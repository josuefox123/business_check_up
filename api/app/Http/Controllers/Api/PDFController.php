<?php

namespace App\Http\Controllers\Api;

use App\Mail\DiagnosticReportMail;
use App\Models\DiagnosticRun;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;

class PDFController extends BaseController
{
    /**
     * Générer le PDF de restitution
     * POST /api/bc/diagnostics/{diagnosticRunId}/pdf
     */
    public function generate(string $diagnosticRunId): JsonResponse
    {
        $diagnostic = DiagnosticRun::with(['scoringResult', 'recommendationResult', 'user', 'business'])
            ->find($diagnosticRunId);

        if (!$diagnostic) {
            return $this->respondNotFound('Diagnostic not found');
        }

        $recommendation = $diagnostic->recommendationResult;
        if (!$recommendation) {
            return $this->respondError('No restitution found', 404);
        }

        $pdf = Pdf::loadView('pdf.restitution', [
            'diagnostic' => $diagnostic,
            'scoring' => $diagnostic->scoringResult,
            'recommendation' => $recommendation,
            'user' => $diagnostic->user,
            'business' => $diagnostic->business,
        ]);

        $filename = "business-checkup-{$diagnosticRunId}.pdf";
        $path = storage_path("app/public/pdfs/{$filename}");

        if (!is_dir(dirname($path))) {
            mkdir(dirname($path), 0755, true);
        }

        $pdf->save($path);

        $recommendation->update([
            'pdf_generated' => true,
            'pdf_url' => asset("storage/pdfs/{$filename}"),
        ]);

        return $this->respondSuccess([
            'pdf_url' => $recommendation->pdf_url,
            'filename' => $filename,
        ], 'PDF generated successfully');
    }


    /**
     * POST /api/bc/diagnostics/{diagnosticRunId}/report/email
     * Envoie le rapport du diagnostic par email avec le PDF en pièce jointe.
     */
    // public function sendReportByEmail(Request $request, string $diagnosticRunId): JsonResponse
    // {
    //     // Validation de la requête
    //     $validated = $request->validate([
    //         'email'     => ['required', 'email:rfc', 'max:255'],
    //         'full_name' => ['nullable', 'string', 'max:255'],
    //     ]);

    //     // Récupération du diagnostic + vérifications métier
    //     $run = DiagnosticRun::with(['session', 'business', 'scoringResult', 'recommendationResult'])
    //         ->findOrFail($diagnosticRunId);

    //     // if ($run->completion_status !== 'completed') {
    //     //     return response()->json([
    //     //         'message' => 'Le diagnostic doit être terminé avant l\'envoi du rapport.',
    //     //     ], 422);
    //     // }

    //     // Vérification du consentement email (S50 / consent_pdf_email)
    //     // $consent = $run->session?->consentRecord;
    //     // if ($consent && $consent->consent_pdf_email === false) {
    //     //     return response()->json([
    //     //         'message' => 'L\'utilisateur n\'a pas consenti à recevoir le rapport par email.',
    //     //     ], 403);
    //     // }

    //     // Mise à jour du profil utilisateur (collecte différée S50)
    //     $user = $run->user;
    //     if ($user) {
    //         $user->email = $validated['email'];
    //         if (!empty($validated['full_name'])) {
    //             $user->full_name = $validated['full_name'];
    //         }
    //         $user->save();
    //     }

    //     // 5 Génération du PDF si absent (réutilise ta logique existante)
    //     // $pdfPath = $run->recommendationResult?->pdf_url;
    //     // if (!$pdfPath || !Storage::exists($pdfPath)) {
    //     //     $pdfPath = $this->generatePdfForRun($run); // <- ta méthode interne de génération
    //     //     if ($run->recommendationResult) {
    //     //         $run->recommendationResult->update([
    //     //             'pdf_generated' => true,
    //     //             'pdf_url'       => $pdfPath,
    //     //         ]);
    //     //     }
    //     // }

    //     // 6 Envoi en file d'attente (ne bloque pas la réponse API)
    //     Mail::to($validated['email'])
    //         ->queue(new DiagnosticReportMail($run, $pdfPath, $validated['full_name'] ?? null));

    //     // 7. Tracking analytics
    //     AnalyticsEvent::create([
    //         'session_id'  => $run->session_id,
    //         'user_id'     => $run->user_id,
    //         'event_type'  => 'report_emailed',
    //         'module_code' => $run->module_code,
    //         'event_timestamp' => now(),
    //         'event_metadata'  => json_encode(['channel' => 'email']),
    //     ]);

    //     return response()->json([
    //         'message' => 'Le rapport est en cours d\'envoi.',
    //         'email'   => $validated['email'],
    //     ], 202);
    // }


    /**
     * Reçoit le PDF les infos d'envoi, en une seule requête. (Envoie du PDF)
     * Content-Type: multipart/form-data
     */
    public function sendReportByEmail(Request $request, string $diagnosticRunId): JsonResponse
    {
        //  Validation : fichier PDF + email obligatoires
        $validated = $request->validate([
            'report'    => ['required', 'file', 'mimetypes:application/pdf', 'max:10240'], // 10 Mo max
            'email'     => ['required', 'email:rfc', 'max:255'],
            'full_name' => ['nullable', 'string', 'max:255'],
        ]);

        $run = DiagnosticRun::with(['session', 'recommendationResult'])
            ->findOrFail($diagnosticRunId);

        // Vérifications métier
        // if ($run->completion_status !== 'completed') {
        //     return response()->json([
        //         'message' => 'Le diagnostic doit être terminé avant l\'envoi du rapport.',
        //     ], 422);
        // }

        // $consent = $run->session?->consentRecord;
        // if ($consent && $consent->consent_pdf_email === false) {
        //     return response()->json([
        //         'message' => 'L\'utilisateur n\'a pas consenti à recevoir le rapport par email.',
        //     ], 403);
        // }

        // Stockage du PDF + mise à jour profil (transaction)
        $pdfPath = DB::transaction(function () use ($validated, $run) {

            // Stockage hors public/ — écrase l'ancien si régénéré
            $path = $validated['report']->storeAs('reports', $run->id . '.pdf', 'local');

            $run->recommendationResult?->update([
                'pdf_generated' => true,
                'pdf_url'       => $path,
            ]);

            // Collecte différée (S50)
            $user = $run->user;
            if ($user) {
                $user->email = $validated['email'];
                if (!empty($validated['full_name'])) {
                    $user->full_name = $validated['full_name'];
                }
                $user->save();
            }

            return $path;
        });

        // Envoi en queue (le Mailable et le template ne changent pas)
        try {
            Mail::to($validated['email'])
                ->send(new DiagnosticReportMail($run, $pdfPath, $validated['full_name'] ?? null));
        } catch (TransportExceptionInterface $e) {
            Log::error('Échec envoi rapport par email', [
                'diagnostic_run_id' => $run->id,
                'email'             => $validated['email'],
                'error'             => $e->getMessage(),
            ]);

            // Le PDF reste stocké : le front peut proposer de réessayer
            return response()->json([
                'message' => 'Le rapport est enregistré, mais l\'envoi de l\'email a échoué. Veuillez réessayer.',
                'code'    => 'EMAIL_SEND_FAILED',
            ], 502);
        }
        return response()->json([
            'message' => 'Le rapport a été enregistré et est en cours d\'envoi.',
            'email'   => $validated['email'],
        ], 202);
    }
}
