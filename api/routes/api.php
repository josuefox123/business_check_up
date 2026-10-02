<?php

use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\ConsentController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\DiagnosticController;
use App\Http\Controllers\Api\EmailVerificationController;
use App\Http\Controllers\Api\FollowUpController;
use App\Http\Controllers\Api\ModuleController;
use App\Http\Controllers\Api\PDFController;
use App\Http\Controllers\Api\QuestionBankController;
use App\Http\Controllers\Api\SessionController;
use App\Http\Controllers\Api\TriageController;
use App\Http\Controllers\ReferenceListeController;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| Business Check-up API Routes
|--------------------------------------------------------------------------
| Toutes les routes sont préfixées par /api/bc
*/

Route::prefix('bc')->group(function () {

    // === SESSIONS ===
    Route::post('/diagnostic-sessions', [SessionController::class, 'store']);
    Route::get('/sessions/{sessionId}', [SessionController::class, 'show']);
    Route::patch('/sessions/{sessionId}', [SessionController::class, 'update']);
    Route::delete('/sessions/{sessionId}/abandon', [SessionController::class, 'abandon']);

    // === CONSENTEMENT ===
    Route::post('/sessions/{sessionId}/consent', [ConsentController::class, 'store']);
    Route::get('/sessions/{sessionId}/consent', [ConsentController::class, 'show']);

    // === VÉRIFICATION EMAIL ===
    Route::post('/verification/email/send', [EmailVerificationController::class, 'send']);
    Route::post('/verification/email/verify', [EmailVerificationController::class, 'verify']);


    // === TRIAGE ===
    Route::post('/sessions/{sessionId}/triage', [TriageController::class, 'store']);
    Route::post('/sessions/{sessionId}/triage/confirm', [TriageController::class, 'confirm']);
    Route::post('/sessions/{sessionId}/triage/validate-choice', [TriageController::class, 'validateChoice']);

    // === MODULES (Catalogue) ===
    Route::get('/modules', [ModuleController::class, 'index']);
    Route::get('/modules/{code}', [ModuleController::class, 'show']);

    // Question Bank (public)
    Route::get('/modules/{moduleCode}/questions', [QuestionBankController::class, 'index']);
    Route::get('/modules/{moduleCode}/questions/{questionId}', [QuestionBankController::class, 'show']);
    Route::get('/diagnostics/{diagnosticRunId}/next-question', [QuestionBankController::class, 'next']);

    // === DIAGNOSTICS ===
    Route::post('/sessions/{sessionId}/diagnostics', [DiagnosticController::class, 'start']);
    Route::post('/diagnostics/{diagnosticRunId}/answers', [DiagnosticController::class, 'submitAnswer']);
    Route::post('/diagnostics/{diagnosticRunId}/complete', [DiagnosticController::class, 'complete']);
    Route::get('/diagnostics/{diagnosticRunId}/result', [DiagnosticController::class, 'result']);

    Route::get('/diagnostics/{diagnosticRunId}/details', [DiagnosticController::class, 'show']);

    // === PDF ===
    Route::post('/diagnostics/{diagnosticRunId}/pdf', [PDFController::class, 'generate']);

    // === ENVOI DU RAPPORT PAR EMAIL ===
    // Route::post('/diagnostics/{diagnosticRunId}/report/email', [PDFController::class, 'sendReportByEmail']);

    // === ENVOI DU RAPPORT PAR EMAIL (PDF généré par le front) ===
    // Route::post('/diagnostics/{diagnosticRunId}/report/email', [PDFController::class, 'sendReportByEmail']);

    // === SUIVI ===
    Route::post('/diagnostics/{diagnosticRunId}/follow-up', [FollowUpController::class, 'request']);

    // === ADMIN DASHBOARD ===
    Route::prefix('admin')->middleware(['auth:sanctum'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'overview']);
        Route::get('/dashboard/modules', [DashboardController::class, 'modules']);
        Route::get('dashboard/diagnostics', [DashboardController::class, 'diagnostics']);
        Route::get('/dashboard/scores', [DashboardController::class, 'scores']);
        Route::get('/dashboard/territory', [DashboardController::class, 'territory']);
        Route::get('/dashboard/pmes', [DashboardController::class, 'pmes']);

        Route::get('/dashboard/{userProfile}/historical', [DashboardController::class, 'historical']);

        // Admin Question Bank (protégé)
        Route::get('/questions', [QuestionBankController::class, 'adminIndex']);
        Route::put('/questions/{questionDbId}', [QuestionBankController::class, 'adminUpdate']);
        Route::post('/questions', [QuestionBankController::class, 'adminStore']);
        Route::delete('/questions/{questionDbId}', [QuestionBankController::class, 'adminDestroy']);
    });

    // === CONTACT ===
    Route::post('/contact', [ContactController::class, 'send']);

    // Liste de référence
    Route::get('/reference-list', [ReferenceListeController::class, 'referenceList']);
});
require __DIR__ . '/auth.php';
require __DIR__ . '/appointment.php';
require __DIR__ . '/report.php';
