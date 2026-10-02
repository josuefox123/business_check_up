<?php

namespace App\Http\Controllers\Api;

use App\Enums\ReportStatus;
use App\Http\Controllers\Controller;
use App\Mail\DiagnosticReportMail;
use App\Models\DiagnosticRun;
use App\Services\ReportPdfService;
use App\Services\Scoring\ScoringEngine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class ReportDiagnosticController extends Controller
{
    public function __construct(protected ReportPdfService $pdfService) {}

    /**
     * Génération du PDF et envoi silencieux par email
     */
    public function sendReport(string $diagnosticRunId, Request $request): JsonResponse
    {
        $diagnosticRun = DiagnosticRun::findOrFail($diagnosticRunId);
        $body = $request->all();

        if (array_is_list($body)) {
            $payload = $body[0] ?? [];
        } else {
            $payload = $body;
        }

        $report = $payload['result']['report']
            ?? $payload['delivery_payload']['report']
            ?? $payload['report']
            ?? null;

        if (! is_array($report)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Le rapport est introuvable.',
            ], 422);
        }

        // 3 Validation rapide des champs clés (OMR)
        $validator = Validator::make($report, [
            'reference' => 'nullable|string',
            'date_diagnostic' => 'nullable|string',
            'global_score' => 'nullable|integer',
            'lecture_generale' => 'nullable|string',
            'entreprise' => 'nullable|array',
            'entreprise.nom' => 'nullable|string',
            'entreprise.secteur' => 'nullable|string',
            'entreprise.zone' => 'nullable|string',
            'module' => 'nullable|array',
            'module.libelle' => 'nullable|string',
            'priorites_immediates' => 'nullable|array',
            'strengths' => 'nullable|array',
            'vigilances' => 'nullable|array',
            'key_factors' => 'nullable|array',
            'priorities' => 'nullable|array',
            'proof_level' => 'nullable|string',
            'proof_description' => 'nullable|string',
            'limiting_factors' => 'nullable|string',
            'recommended_next_step' => 'nullable|string',
            'expert_exchange_text' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation du report échouée.',
                'errors' => $validator->errors(),
            ], 422);
        }

        // 4. Destinataire
        $clientName = $diagnosticRun->business?->business_name ?? 'Nom de votre PME';
        $recipient = $diagnosticRun->user;

        if (! $recipient || ! $recipient->email) {
            return response()->json([
                'status' => 'error',
                'message' => 'Destinataire introuvable ou email manquant pour ce diagnostic.',
            ], 422);
        }

        // 5 Génération PDF + envoi mail
        try {
            $report['entreprise']['nom'] = $diagnosticRun->business?->business_name ?? 'Non renseigné';

            // Calcul dynamique des scores par axe depuis les QuestionResponses
            // (le webhook envoie scores_by_axis vide — on l'écrase avec les données réelles)
            $scoringEngine = new ScoringEngine();
            $calculatedAxisScores = $scoringEngine->calculateAxisScoresForReport($diagnosticRun);
            if (! empty($calculatedAxisScores)) {
                $report['scores_by_axis'] = $calculatedAxisScores;
            }

            // Score global officiel (crédibilisé) depuis ScoringResult si disponible
            $officialScore = $diagnosticRun->scoringResult?->getScoreDisplay();
            if ($officialScore !== null) {
                $report['global_score'] = $officialScore;
            }

            // Remplacer les codes de modules par leurs libellés officiels dans recommended_next_step
            if (! empty($report['recommended_next_step'])) {
                if (preg_match_all('/[A-Z0-9]{3,4}-[0-9]{2}/', $report['recommended_next_step'], $matches)) {
                    foreach (array_unique($matches[0]) as $moduleCode) {
                        $moduleName = config("business-checkup.modules.{$moduleCode}.name");
                        if ($moduleName) {
                            $report['recommended_next_step'] = str_replace(
                                $moduleCode,
                                $moduleName,
                                $report['recommended_next_step']
                            );
                        }
                    }
                }
            }

            // Le service attend exactement ce format : $data['entreprise']['nom'], etc.
            $pdfPath = $this->pdfService->generateFile($report);

            Mail::to('assogbamanuel6@gmail.com')
                ->bcc([
                    'nicktep519@gmail.com',
                    // 'n.thecia@fund-lab.org',
                    // 'i.turibis@fund-lab.org',
                    // 'raymond.abile@ccib.bj'
                ])
                ->send(new DiagnosticReportMail($diagnosticRun, $pdfPath, $recipient->full_name, $report['module']['libelle'] ?? null));

            $diagnosticRun->update([
                'report_status' => ReportStatus::SENT,
                'report_sent_at' => now(),
            ]);

            @unlink($pdfPath);

            Log::info('Rapport généré et envoyé.', [
                'diagnostic_run_id' => $diagnosticRun->diagnostic_run_id,
                'reference' => $report['reference'] ?? null,
                'recipient' => $recipient->email,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => "Le rapport PDF a été généré et envoyé à {$recipient->full_name}.",
                'reference' => $report['reference'] ?? null,
                'mailer' => config('mail.default'),
                'notice' => 'En environnement local (log), consultez storage/logs/laravel.log pour voir l\'email et sa pièce jointe PDF.',
            ]);
        } catch (\Exception $e) {
            Log::error('Erreur génération/envoi rapport.', [
                'diagnostic_run_id' => $diagnosticRun->diagnostic_run_id,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la génération ou de l\'envoi du rapport.',
                'detail' => $e->getMessage(),
            ], 500);
        }
    }
}
