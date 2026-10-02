<?php

use App\Http\Controllers\Api\ReportDiagnosticController;
use App\Services\ReportPdfService;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Routes du Rapport PDF & Emailing Business Check-up (3 Pages)
|--------------------------------------------------------------------------
*/

Route::post('/diagnostics/{diagnosticRunId}/send-report', [ReportDiagnosticController::class, 'sendReport']);

/**
 * Endpoint de prévisualisation HTML interactive du rapport 3 pages
 */
Route::get('/report/preview', function (ReportPdfService $pdfService) {
    $data = [
        'client_name' => 'Entreprise Client SAS',
        'date' => date('d/m/Y'),
        'global_score' => 62,
    ];

    return view('report_preview', $data);
});

/**
 * Endpoint de génération et téléchargement direct du PDF 3 pages en arrière-plan
 */
Route::get('/report/download-pdf', function (ReportPdfService $pdfService) {
    $pdfPath = $pdfService->generateFile([
        'client_name' => 'Entreprise Client SAS',
        'date' => date('d/m/Y'),
        'global_score' => 62,
    ]);

    return response()->download($pdfPath, 'Rapport_Business_Checkup_3_Pages.pdf')->deleteFileAfterSend(true);
});

/**
 * Endpoint de flux d'affichage direct du PDF dans le navigateur
 */
Route::get('/test-pdf', function (ReportPdfService $pdfService) {
    $pdfPath = $pdfService->generateFile([
        'client_name' => 'Entreprise Client SAS',
        'date' => date('d/m/Y'),
        'global_score' => 62,
    ]);

    return response()->file($pdfPath, [
        'Content-Type' => 'application/pdf',
        'Content-Disposition' => 'inline; filename="Rapport_Business_Checkup_3_Pages.pdf"'
    ])->deleteFileAfterSend(true);
});
