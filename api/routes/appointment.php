<?php

use App\Http\Controllers\Api\Admin\AppointmentAdminController;
use App\Http\Controllers\Api\AppointmentController;
use Illuminate\Support\Facades\Route;

// === RENDEZ-VOUS (public) ===
Route::get('/diagnostics/{diagnosticRunId}/appointment/options', [AppointmentController::class, 'options']);
Route::get('/appointments/slots', [AppointmentController::class, 'slots']);
Route::post('/bc/diagnostics/{diagnosticRunId}/appointment', [AppointmentController::class, 'store']);
Route::get('/appointments/{appointmentId}', [AppointmentController::class, 'show']);
Route::post('/appointments/{appointmentId}/cancel', [AppointmentController::class, 'cancel']);

// === ADMIN RENDEZ-VOUS ===
Route::prefix('admin')->middleware(['auth:sanctum'])->group(function () {
    Route::get('/appointments', [AppointmentAdminController::class, 'index']);
    Route::post('/appointments/{appointmentId}/confirm', [AppointmentAdminController::class, 'confirm']);
    Route::post('/appointments/{appointmentId}/cancel', [AppointmentAdminController::class, 'cancel']);
    Route::post('/appointments/{appointmentId}/complete', [AppointmentAdminController::class, 'complete']);
});
