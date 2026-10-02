<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Models\DiagnosticRun;
use App\Models\Question;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class QuestionBankController extends BaseController
{
    /**
     * Récupérer toutes les questions actives d'un module
     * GET /api/bc/modules/{moduleCode}/questions
     */
    public function index(string $moduleCode, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'question_kind' => ['nullable', Rule::in(['diagnostic', 'enrichment'])]
        ]);

        $query = Question::activeForModule($moduleCode);

        if (isset($validated['question_kind'])) {
            $query->where('question_kind', $validated['question_kind']);
        }

        $questions = $query->get();

        if ($questions->isEmpty()) {
            return $this->respondNotFound('No questions found for this module');
        }

        return $this->respondSuccess([
            'module_code' => $moduleCode,
            'question_count' => $questions->count(),
            'questions' => $questions->map(fn($q) => $this->formatForFront($q)),
        ]);
    }

    /**
     * Détails d'une question spécifique
     * GET /api/bc/modules/{moduleCode}/questions/{questionId}
     */
    public function show(string $moduleCode, string $questionId): JsonResponse
    {
        $question = Question::activeForModule($moduleCode)
            ->where('question_id', $questionId)
            ->first();

        if (!$question) {
            return $this->respondNotFound('Question not found');
        }

        return $this->respondSuccess([
            'question' => $this->formatForFront($question, true),
        ]);
    }

    /**
     * Prochaine question à afficher dans un diagnostic actif
     * GET /api/bc/diagnostics/{diagnosticRunId}/next-question
     */
    public function next(string $diagnosticRunId): JsonResponse
    {
        $diagnostic = DiagnosticRun::with('questionResponses')->find($diagnosticRunId);

        if (!$diagnostic) {
            return $this->respondNotFound('Diagnostic not found');
        }

        $answeredIds = $diagnostic->questionResponses->pluck('question_id')->toArray();

        // Chercher la prochaine question non répondue
        $nextQuestion = Question::activeForModule($diagnostic->module_code)
            ->whereNotIn('question_id', $answeredIds)
            ->first();

        if (!$nextQuestion) {
            // Vérifier s'il y a des relances en attente
            $pendingFollowup = $this->checkPendingFollowup($diagnostic);

            if ($pendingFollowup) {
                return $this->respondSuccess([
                    'status' => 'followup',
                    'followup' => $pendingFollowup,
                ]);
            }

            return $this->respondSuccess([
                'status' => 'completed',
                'message' => 'All questions answered. Ready to complete.',
                'next_step' => "/api/bc/diagnostics/{$diagnosticRunId}/complete",
            ]);
        }

        return $this->respondSuccess([
            'status' => 'in_progress',
            'progress' => $diagnostic->calculateProgress(),
            'question' => $this->formatForFront($nextQuestion),
        ]);
    }

    /**
     * Liste complète pour l'admin (avec logique métier)
     *  GET /api/bc/admin/questions
     */
    public function adminIndex(): JsonResponse
    {
        $questions = Question::withCount('diagnosticRuns')
            ->orderBy('module_code')
            ->orderBy('order')
            ->get();

        return $this->respondSuccess([
            'total' => $questions->count(),
            'questions' => $questions->map(function ($q) {
                return [
                    'question_db_id' => $q->question_db_id,
                    'question_id' => $q->question_id,
                    'module_code' => $q->module_code,
                    'order' => $q->order,
                    'text' => $q->text,
                    'is_active' => $q->is_active,
                    'answer_type' => $q->answer_type,
                    'weight' => $q->weight,
                    'evidence_required' => $q->evidence_required,
                    'usage_count' => $q->diagnostic_runs_count ?? 0,
                    'created_at' => $q->created_at,
                    'updated_at' => $q->updated_at,
                ];
            }),
        ]);
    }

    /**
     * Modifier une question (admin)
     * PUT /api/bc/admin/questions/{questionDbId}
     */
    public function adminUpdate(Request $request, int $questionDbId): JsonResponse
    {
        $question = Question::find($questionDbId);

        if (!$question) {
            return $this->respondNotFound('Question not found');
        }

        $validated = $request->validate([
            'text' => 'sometimes|string',
            'helper_text' => 'sometimes|nullable|string',
            'options' => 'sometimes|array',
            'weight' => 'sometimes|numeric|min:0|max:2',
            'is_active' => 'sometimes|boolean',
            'evidence_required' => 'sometimes|boolean',
            'order' => 'sometimes|integer',
        ]);

        // Incrémenter la version si modification substantielle
        if (isset($validated['text']) || isset($validated['options'])) {
            $currentVersion = (float) str_replace('v', '', $question->version);
            $validated['version'] = 'v' . ($currentVersion + 0.1);
        }

        $question->update($validated);

        return $this->respondSuccess([
            'question' => $question->fresh(),
        ], 'Question updated successfully');
    }

    /**
     * Formater une question pour le front-end
     */
    private function formatForFront(Question $question, bool $full = false): array
    {
        $data = [
            'question_id' => $question->question_id,
            'order' => $question->order,
            'role' => $question->role,
            'dimension' => $question->dimension,
            'text' => $question->text,
            'helper_text' => $question->helper_text,
            'answer_type' => $question->answer_type,
            'options' => $question->getFormattedOptions(),
            'evidence_required' => $question->evidence_required,
            'evidence_prompt' => $question->evidence_prompt,
            'has_followup' => !empty($question->followup_trigger),
            'is_required' => $question->is_required,
            'question_kind' => $question->question_kind,
        ];

        if ($full) {
            // Données complètes pour l'admin
            $data['score_logic'] = $question->score_logic;
            $data['weight'] = $question->weight;
            $data['red_flag_conditions'] = $question->red_flag_conditions;
            $data['followup_trigger'] = $question->followup_trigger;
            $data['next_question_logic'] = $question->next_question_logic;
            $data['next_module_hint'] = $question->next_module_hint;
        }

        return $data;
    }

    /**
     * Vérifier les relances en attente
     */
    private function checkPendingFollowup(DiagnosticRun $diagnostic): ?array
    {
        // Logique de vérification des relances
        // À implémenter selon les règles métier
        return null;
    }
}
