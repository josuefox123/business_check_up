<?php

namespace App\Http\Controllers\Api;

use App\Enums\CompletionStatus;
use App\Enums\EvidenceLevel;
use App\Enums\EvidenceType;
use App\Enums\ReportStatus;
use App\Http\Controllers\Api\BaseController;
use App\Models\DiagnosticRun;
use App\Models\EvidenceRecord;
use App\Models\Question;
use App\Models\QuestionResponse;
use App\Models\TriageRecord;
use App\Models\UserSession;
use App\Services\Ia\AnswerClassifierService;
use App\Services\Restitution\RestitutionEngine;
use App\Services\Scoring\ScoringEngine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class DiagnosticController extends BaseController
{
    private ScoringEngine $scoringEngine;
    private RestitutionEngine $restitutionEngine;

    public function __construct(
        ScoringEngine $scoringEngine,
        RestitutionEngine $restitutionEngine
    ) {
        $this->scoringEngine = $scoringEngine;
        $this->restitutionEngine = $restitutionEngine;
    }

    /**
     * Démarrer un diagnostic
     *  POST /api/bc/sessions/{sessionId}/diagnostics
     */
    public function start(Request $request, string $sessionId): JsonResponse
    {
        $session = UserSession::find($sessionId);
        if (!$session) {
            return $this->respondNotFound('Session not found');
        }

        $validated = $request->validate([
            'module_code' => 'required|string',
            'triage_id' => 'nullable|string|uuid',
            'is_recommended' => 'required|boolean',
            'is_override' => 'nullable|boolean',
        ]);

        $moduleConfig = config("business-checkup.modules.{$validated['module_code']}");
        if (!$moduleConfig) {
            return $this->respondError('Module not found', 404);
        }

        $triage = null;
        if (!empty($validated['triage_id'])) {
            $triage = TriageRecord::find($validated['triage_id']);
        }

        $diagnostic = DiagnosticRun::create([
            'diagnostic_run_id' => (string) Str::uuid(),
            'session_id' => $sessionId,
            'user_id' => $session->user_id,
            'business_id' => $triage?->business_id,
            'triage_id' => $triage?->triage_id,
            'module_code' => $validated['module_code'],
            'module_family' => $moduleConfig['family'],
            'module_version' => 'v1.0',
            'started_at' => now(),
            'completion_status' => CompletionStatus::STARTED,
            'question_count_expected' => $moduleConfig['question_count'],
            'question_count_answered' => 0,
            'followup_count' => 0,
            'is_recommended_module' => $validated['is_recommended'],
            'is_user_override' => $validated['is_override'] ?? false,
        ]);

        return $this->respondSuccess([
            'diagnostic_run_id' => $diagnostic->diagnostic_run_id,
            'module_code' => $diagnostic->module_code,
            'module_name' => $moduleConfig['name'],
            'status' => $diagnostic->completion_status->value,
            'started_at' => $diagnostic->started_at->toIso8601String(),
            'question_count_expected' => $diagnostic->question_count_expected,
            'progress' => 0,
        ], 'Diagnostic started', 201);
    }

    /**
     * Soumettre une réponse à une question
     * POST /api/bc/diagnostics/{diagnosticRunId}/answers
     */
    public function submitAnswer(Request $request, string $diagnosticRunId): JsonResponse
    {
        // 1 Récupération du diagnostic 
        $diagnostic = DiagnosticRun::find($diagnosticRunId);

        if (!$diagnostic) {
            return $this->respondNotFound('Diagnostic not found');
        }

        // if ($diagnostic->status === 'completed') {
        //     return $this->respondError('Ce diagnostic est déjà terminé.', 422);
        // }

        // Validation 
        $validated = $request->validate([
            'question_id'                => 'required|string|max:50',
            'answer_value'               => 'required',
            'response_confidence_user'   => 'nullable|string|in:sure,estimate,not_sure,unknown',
            'evidence_level'             => 'nullable|string|in:' . implode(',', array_column(EvidenceLevel::cases(), 'value')),
            'evidence_label'             => 'nullable|string',
            'evidence_type'              => 'nullable|string|in:' . implode(',', array_column(EvidenceType::cases(), 'value')),
        ]);

        // 3 Récupération & vérification de la question 
        $question = Question::where('question_id', $validated['question_id'])
            ->where('is_active', true)
            ->first();

        if (!$question) {
            return $this->respondNotFound('Question introuvable ou inactive');
        }

        // Sécurité : la question doit appartenir au module du diagnostic
        if ($question->module_code !== $diagnostic->module_code) {
            return $this->respondError(
                'Cette question n\'appartient pas au module de ce diagnostic.',
                403
            );
        }

        // 4 Vérifier si la question a déjà été répondue 
        $existingResponse = QuestionResponse::where('diagnostic_run_id', $diagnosticRunId)
            ->where('question_id', $validated['question_id'])
            ->first();

        $isUpdate = $existingResponse !== null;


        $freeText = null;

        // if ($question->answer_ia) {
        //     $freeText = trim($validated['answer_value'] ?? '');

        //     if ($freeText === '') {
        //         return $this->respondError(
        //             'Cette question attend une réponse en texte libre.',
        //             422
        //         );
        //     }

        //     try {
        //         $iaResult = app(AnswerClassifierService::class)
        //             ->classify($question, $freeText, [
        //                 'sector' => $diagnostic->business?->sector ?? null,
        //             ]);
        //     } catch (\RuntimeException $e) {
        //         Log::warning('Classification IA échouée', [
        //             'question_id' => $question->question_id,
        //             'error'       => $e->getMessage(),
        //         ]);

        //         // Mode dégradé : le front affiche les options classiques à l'utilisateur
        //         return response()->json([
        //             'message' => 'Le service d\'analyse est momentanément indisponible. Veuillez choisir une option.',
        //             'code'    => 'AI_UNAVAILABLE',
        //             'fallback_options' => $question->options,
        //         ], 503);
        //     }

        //     // L'IA a choisi -> on alimente le pipeline normal avec la/les valeur(s)
        //     $rawAnswerValue = $question->answer_type->value === 'multi_choice'
        //         ? $iaResult['chosen_values']
        //         : $iaResult['chosen_values'][0];

        //     // Pour les questions 'short_text', on force le traitement comme single_choice
        //     if ($answerType === 'short_text' || $answerType === 'text_libre') {
        //         $answerType = 'single_choice';
        //     }
        // }

        // ═══════════════════════════════════════════════════════
        // QUESTION IA : on stocke le texte libre BRUT.
        // Pas d'appel IA ici — la classification se fera à la fin.
        // ═══════════════════════════════════════════════════════
        if ($question->answer_ia) {
            $freeText = trim((string) ($validated['answer_value'] ?? ''));

            if ($freeText === '') {
                return $this->respondError(
                    'Cette question attend une réponse en texte libre.',
                    422
                );
            }

            $score       = null;        // pas de score maintenant
            $answerLabel = null;        // sera rempli après classification
            $storedValue = $freeText;   // le texte brut

        } else {

            // 5 Calcul du score selon le type de réponse 

            $score = null;
            $answerLabel = null;
            $rawAnswerValue = $validated['answer_value'];
            $answerType = $question->answer_type->value;

            switch ($answerType) {
                case 'single_choice':
                    $score = $question->getScoreForOption($rawAnswerValue);
                    $answerLabel = $question->getLabelForOption($rawAnswerValue);
                    $storedValue = $rawAnswerValue;
                    break;

                case 'multi_choice':
                    $answerValues = is_array($rawAnswerValue)
                        ? $rawAnswerValue
                        : [$rawAnswerValue];
                    [$score, $answerLabel] = $question->getScoreForMultipleOptions($answerValues);
                    $storedValue = $answerValues;
                    break;

                case 'scale_1_5':
                    $score = is_numeric($rawAnswerValue) ? (int) $rawAnswerValue : null;
                    $storedValue = $rawAnswerValue;
                    break;

                case 'short_text':
                    $score = null;
                    $answerLabel = $rawAnswerValue;
                    $storedValue = $rawAnswerValue;
                    break;

                default:
                    return $this->respondError('Type de réponse non supporté.', 400);
            }
        }

        //  6 Red Flag & Follow-up 
        $redFlagTriggered = false;
        $redFlagCode = null;
        $followUpTriggered = false;
        $followUpQuestionId = null;

        if ($score !== null) {
            $redFlagCode = $question->checkRedFlag($score, $rawAnswerValue);
            $redFlagTriggered = $redFlagCode !== null;

            // $followUp = $question->checkFollowups($score, $rawAnswerValue);
            // if ($followUp) {
            //     $followUpTriggered = true;
            //     $followUpQuestionId = $followUp['question_id'];
            // }
        }

        //  7 Création ou Mise à jour en transaction 
        try {
            DB::beginTransaction();

            if ($isUpdate) {
                // ═══════════════════════════════════════════════════════
                // MISE À JOUR d'une réponse existante
                // ═══════════════════════════════════════════════════════
                $existingResponse->update([
                    'question_version'       => $question->version,
                    'question_dimension'     => $question->dimension ?? 'meta',
                    'answer_type'            => $question->answer_type,
                    'answer_value'           => $question->answer_ia ? null : $storedValue,
                    'answer_ia'              => $question->answer_ia,
                    'answer_label'           => $answerLabel,
                    'answer_text'            => $freeText,
                    'score_1_5'              => $score,
                    'weight'                 => $question->weight,
                    'is_critical_question'   => $question->evidence_required ?? false,
                    'red_flag_triggered'     => $redFlagTriggered,
                    'red_flag_code'          => $redFlagCode,
                    'followup_triggered'     => $followUpTriggered,
                    'followup_question_id'   => $followUpQuestionId,
                    'response_confidence_user' => $validated['response_confidence_user'] ?? null,
                    'answered_at'            => now(),
                    'updated_at'             => now(),
                ]);

                $response = $existingResponse;

                // Mettre à jour l'evidence si fournie
                if (!empty($validated['evidence_level'])) {
                    EvidenceRecord::updateOrCreate(
                        [
                            'response_id' => $response->response_id,
                            'question_id' => $validated['question_id'],
                        ],
                        [
                            'evidence_id'       => (string) Str::uuid(),
                            'diagnostic_run_id' => $diagnosticRunId,
                            'evidence_level'    => $validated['evidence_level'],
                            'evidence_label'    => $validated['evidence_label'] ?? null,
                            'evidence_type'     => $validated['evidence_type'] ?? null,
                        ]
                    );
                }

                $message = 'Réponse mise à jour avec succès.';
            } else {
                // ═══════════════════════════════════════════════════════
                // CRÉATION d'une nouvelle réponse
                // ═══════════════════════════════════════════════════════
                $response = QuestionResponse::create([
                    'response_id'            => (string) Str::uuid(),
                    'diagnostic_run_id'      => $diagnosticRunId,
                    'module_code'            => $diagnostic->module_code,
                    'question_id'            => $validated['question_id'],
                    'question_version'       => $question->version,
                    'question_dimension'     => $question->dimension ?? 'evidence',
                    'answer_type'            => $question->answer_type,
                    'answer_value'           => json_encode($storedValue),
                    'answer_ia'              => $question->answer_ia,
                    'answer_text'            => $freeText,
                    'answer_label'           => $answerLabel,
                    'score_1_5'              => $score,
                    'weight'                 => $question->weight,
                    'is_critical_question'   => $question->evidence_required ?? false,
                    'red_flag_triggered'     => $redFlagTriggered,
                    'red_flag_code'          => $redFlagCode,
                    'followup_triggered'     => $followUpTriggered,
                    'followup_question_id'   => $followUpQuestionId,
                    'response_confidence_user' => $validated['response_confidence_user'] ?? null,
                    'answered_at'            => now(),
                ]);

                if (!empty($validated['evidence_level'])) {
                    EvidenceRecord::create([
                        'evidence_id'       => (string) Str::uuid(),
                        'diagnostic_run_id' => $diagnosticRunId,
                        'response_id'       => $response->response_id,
                        'question_id'       => $validated['question_id'],
                        'evidence_level'    => $validated['evidence_level'],
                        'evidence_label'    => $validated['evidence_label'] ?? null,
                        'evidence_type'     => $validated['evidence_type'] ?? null,
                    ]);
                }

                // Incrémenter le compteur seulement pour une NOUVELLE réponse
                $diagnostic->increment('question_count_answered');

                $message = 'Réponse enregistrée avec succès.';
            }

            // Vérification de complétion 
            $isCompleted = $diagnostic->question_count_answered >= $diagnostic->question_count_expected;

            if ($isCompleted && $diagnostic->status !== 'completed') {
                $diagnostic->update(['status' => 'completed']);
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Erreur soumission réponse', [
                'diagnostic_run_id' => $diagnosticRunId,
                'question_id'       => $validated['question_id'],
                'is_update'         => $isUpdate,
                'error'             => $e->getMessage(),
            ]);
            return $this->respondError('Erreur lors de l\'enregistrement de la réponse.', 500);
        }

        //  8 Réponse API
        $responseData = [
            'response_id'          => $response->response_id,
            'is_update'            => $isUpdate,  // ← Indique au front si c'était un update
            'score'                => $score,
            'red_flag_triggered'   => $redFlagTriggered,
            'red_flag_code'        => $redFlagCode,
            'followup_triggered'   => $followUpTriggered,
            'followup_question_id' => $followUpQuestionId,
            'progress'             => $diagnostic->calculateProgress(),
        ];

        if ($isCompleted) {
            $responseData['diagnostic_status'] = 'completed';
            $responseData['next_step'] = 'calculate_score';

            return $this->respondSuccess(
                $responseData,
                $message . ' Diagnostic terminé.'
            );
        }

        $responseData['diagnostic_status'] = 'in_progress';

        return $this->respondSuccess($responseData, $message);
    }

    /**
     * Finaliser le diagnostic et calculer les scores
     * POST /api/bc/diagnostics/{diagnosticRunId}/complete
     */
    public function complete(string $diagnosticRunId, AnswerClassifierService $classifier): JsonResponse
    {
        $diagnostic = DiagnosticRun::with(['questionResponses', 'evidenceRecords'])
            ->find($diagnosticRunId);

        if (!$diagnostic) {
            return $this->respondNotFound('Diagnostic not found');
        }

        if ($diagnostic->completion_status === CompletionStatus::COMPLETED) {
            return $this->respondError('Diagnostic already completed', 400);
        }


        // ═══════════════════════════════════════════════
        // 1. RÉCUPÉRER LES RÉPONSES IA EN ATTENTE
        // ═══════════════════════════════════════════════
        $iaResponses = QuestionResponse::with('question')
            ->where('diagnostic_run_id', $diagnosticRunId)
            ->whereHas('question', fn($q) => $q->where('answer_ia', true))
            ->whereNull('score_1_5')
            ->get();

        $iaGlobalStatus = 'done'; // done | partial | failed


        // ═══════════════════════════════════════════════
        // 2. CLASSIFICATION BATCH (un seul appel HTTP)
        // ═══════════════════════════════════════════════
        $results = [];
        if ($iaResponses->isNotEmpty()) {
            try {
                $results = $classifier->classifyBatch($diagnostic, $iaResponses);
            } catch (\RuntimeException $e) {
                Log::error('Classification IA échouée', [
                    'diagnostic_run_id' => $diagnosticRunId,
                    'error'             => $e->getMessage(),
                ]);
                $iaGlobalStatus = 'failed'; // on calculera le score SANS les questions IA
            }
        }



        // ═══════════════════════════════════════════════
        // 3. MISE À JOUR DES RÉPONSES (transaction)
        // ═══════════════════════════════════════════════
        DB::transaction(function () use ($iaResponses, $results, &$iaGlobalStatus) {
            foreach ($iaResponses as $response) {
                $question = $response->question;
                $result   = $results[$response->question_id] ?? null;

                // --- Échec unitaire : exclue du scoring ---
                if (!$result || empty($result['chosen_values'])) {
                    $response->update(['weight' => 0]);
                    $iaGlobalStatus = $iaGlobalStatus === 'failed' ? 'failed' : 'partial';
                    continue;
                }

                // --- Validation des valeurs choisies contre les options ---
                $validValues  = collect($question->options)->pluck('value')->all();
                $chosenValues = array_values(array_intersect($result['chosen_values'], $validValues));

                if (empty($chosenValues)) {
                    $response->update(['weight' => 0]);
                    $iaGlobalStatus = $iaGlobalStatus === 'failed' ? 'failed' : 'partial';
                    continue;
                }

                // --- Score via TES méthodes existantes du modèle Question ---
                if ($question->answer_type->value === 'multi_choice') {
                    [$score, $label] = $question->getScoreForMultipleOptions($chosenValues);
                    $storedValue = $chosenValues;
                } else {
                    $score       = $question->getScoreForOption($chosenValues[0]);
                    $label       = $question->getLabelForOption($chosenValues[0]);
                    $storedValue = $chosenValues[0];
                }

                // --- Red flags recalculés maintenant qu'on a un score ---
                $redFlagCode = $score !== null
                    ? $question->checkRedFlag($score, $storedValue)
                    : null;

                $response->update([
                    'answer_value'       => json_encode($storedValue),
                    'answer_label'       => $label,
                    'score_1_5'          => $score,
                    'red_flag_triggered' => $redFlagCode !== null,
                    'red_flag_code'      => $redFlagCode,
                ]);
            }
        });

        // ═══════════════════════════════════════════════
        // 4. CALCUL DU SCORE (ta logique existante)
        //    Les questions IA non classées ont weight = 0
        //    elles sont naturellement exclues de la moyenne pondérée
        // ═══════════════════════════════════════════════
        $diagnostic->markAsCompleted();

        $scoringResult = $this->scoringEngine->calculateFullScore($diagnostic);


        // ═══════════════════════════════════════════════
        // 5. RÉPONSE
        // ═══════════════════════════════════════════════
        // return $this->respondSuccess(
        //     [
        //         'diagnostic_status' => 'completed',
        //         'ia_classification' => $iaGlobalStatus,  // done | partial | failed
        //         'scoring'           => $scoring,
        //     ],
        //     $iaGlobalStatus === 'failed'
        //         ? 'Diagnostic terminé. Note : certaines réponses n\'ont pas pu être analysées automatiquement.'
        //         : 'Diagnostic terminé. Votre résultat est prêt.'
        // );

        // $diagnostic->markAsCompleted();
        // $scoringResult = $this->scoringEngine->calculateFullScore($diagnostic);

        $recommendation = $this->restitutionEngine->generateRestitution($diagnostic, $scoringResult);

        return $this->respondSuccess([
            'diagnostic_run_id' => $diagnosticRunId,
            'module_code' => $diagnostic->module_code,
            'module_name' => config("business-checkup.modules.{$diagnostic->module_code}.name"),
            'completed_at' => $diagnostic->completed_at?->toIso8601String(),
            'duration_seconds' => $diagnostic->duration_seconds,
            'scoring' => [
                'score_0_100' => $scoringResult->getScoreDisplay(),
                'score_band' => $scoringResult->score_band->value,
                'band_label' => $scoringResult->getBandLabel(),
                'credibility_score' => $scoringResult->credibility_score_0_1,
                'red_flag_count' => $scoringResult->red_flag_count,
                'has_critical_red_flag' => $scoringResult->hasCriticalRedFlag(),
            ],
            'restitution' => [
                'recommendation_id' => $recommendation->recommendation_id,
                'headline' => $recommendation->headline,
                'summary' => $recommendation->summary_text_rendered,
                'interpretation_text' => $recommendation->interpretation_text,
                'orientation_text' => $recommendation->orientation_text,
                'strengths' => $recommendation->getStrengths(),
                'typical_strengths' => $recommendation->typical_strengths,
                'weaknesses' => $recommendation->getWeaknesses(),
                'typical_fragilities' => $recommendation->typical_fragilities,
                'priorities' => $recommendation->getPriorityActions(),
                'next_module' => $recommendation->next_module_code,
                'follow_up_recommended' => $recommendation->isFollowUpRecommended(),
                'urgent_attention' => $recommendation->isUrgentAttentionRequired(),
            ],
            'disclaimer' => config('business-checkup.restitution.disclaimer'),
        ], 'Diagnostic completed successfully');
    }

    /**
     * Récupérer le résultat d'un diagnostic
     *  GET /api/bc/diagnostics/{diagnosticRunId}/result
     */
    public function result(string $diagnosticRunId): JsonResponse
    {
        $diagnostic = DiagnosticRun::with(['scoringResult', 'recommendationResult'])
            ->find($diagnosticRunId);

        if (!$diagnostic) {
            return $this->respondNotFound('Diagnostic not found');
        }

        if ($diagnostic->completion_status !== CompletionStatus::COMPLETED) {
            return $this->respondError('Diagnostic not yet completed', 400);
        }

        $scoring = $diagnostic->scoringResult;
        $recommendation = $diagnostic->recommendationResult;

        if (!$scoring || !$recommendation) {
            return $this->respondError('Results not found', 404);
        }

        return $this->respondSuccess([
            'diagnostic_run_id' => $diagnosticRunId,
            'module_code' => $diagnostic->module_code,
            'module_name' => config("business-checkup.modules.{$diagnostic->module_code}.name"),
            'completed_at' => $diagnostic->completed_at?->toIso8601String(),
            'duration_seconds' => $diagnostic->duration_seconds,
            'scoring' => [
                'raw_score_1_5' => $scoring->raw_score_1_5,
                'converted_score_0_100' => $scoring->converted_score_0_100,
                'credibilized_score_0_100' => $scoring->credibilized_score_0_100,
                'score_band' => $scoring->score_band->value,
                'band_label' => $scoring->getBandLabel(),
                'credibility_score' => $scoring->credibility_score_0_1,
                'evidence_band' => $scoring->evidence_band?->value,
                'red_flag_count' => $scoring->red_flag_count,
                'has_critical_red_flag' => $scoring->hasCriticalRedFlag(),
                'dominant_strength' => $scoring->dominant_strength_code,
                'dominant_weakness' => $scoring->dominant_weakness_code,
                'priorities' => $scoring->getPriorities(),
            ],
            'restitution' => [
                'recommendation_id' => $recommendation->recommendation_id,
                'summary' => $recommendation->summary_text_rendered,
                'interpretation_text' => $recommendation->interpretation_text,
                'orientation_text' => $recommendation->orientation_text,
                'typical_strengths' => $recommendation->typical_strengths,
                'typical_fragilities' => $recommendation->typical_fragilities,
                'priorities' => $recommendation->getPriorityActions(),
                'next_module' => $recommendation->next_module_code,
                'follow_up_recommended' => $recommendation->isFollowUpRecommended(),
                'urgent_attention' => $recommendation->isUrgentAttentionRequired(),
            ],
            'disclaimer' => config('business-checkup.restitution.disclaimer'),
            'disclaimer_financing' => $diagnostic->module_code === 'OPP-04'
                ? config('business-checkup.restitution.disclaimer_financing')
                : null,
        ]);
    }

    /**
     * Tous les détails d'un diagnostic
     */
    public function show(string $diagnosticRunId): JsonResponse
    {

        if (!$diagnosticRunId) {
            return $this->respondNotFound('Diagnostic not found');
        }

        // return response()->json($diagnosticRunId);

        /** @var DiagnosticRun  $diagnostic */
        $diagnostic = DiagnosticRun::findOrFail($diagnosticRunId);

        $diagnostic->load([
            'user',
            'business',
            'triage',
            'questionResponses.question:question_id,text,question_kind',
            'scoringResult',
            'recommendationResult',
            'evidenceRecords',
        ]);

        // Envoi tolérant vers n8n pour la génération du rapport sans bloquer la consultation des détails
        try {
            $response = Http::timeout(5)
                ->acceptJson()
                ->post(
                    'https://n8n.sylfleur.com/webhook/bcu-report-v1',
                    $diagnostic->toArray()
                );

            if ($response->successful()) {
                $diagnostic->update([
                    'report_status' => ReportStatus::PENDING,
                ]);
            } else {
                $diagnostic->update([
                    'report_status' => ReportStatus::FAILED,
                ]);
            }
        } catch (\Throwable $e) {
            Log::warning('[DiagnosticController@show] Webhook n8n inaccessible: ' . $e->getMessage());
            $diagnostic->update([
                'report_status' => ReportStatus::FAILED,
            ]);
        }

        return $this->respondSuccess($diagnostic);
        

    }
}
