<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes - Authentication avec Laravel Sanctum
|--------------------------------------------------------------------------
|
*/

// ==========================================
// ROUTES PUBLIQUES (aucune authentification)
// ==========================================
Route::group(['prefix' => 'auth'], function () {

    Route::post('/register', [AuthController::class, 'register'])
        ->name('auth.register');
    Route::post('/login', [AuthController::class, 'login'])
        ->name('auth.login');

    // Mot de passe oublié - envoi du lien
    // Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])
    //     ->name('auth.password.forgot');

    // Reinitialisation du mot de passe avec token
    // Route::post('/reset-password', [AuthController::class, 'resetPassword'])
    //     ->name('auth.password.reset');

    // Verification d'email (lien signe)
    // Route::get('/verify-email/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    //     ->middleware(['signed', 'throttle:6,1'])
    //     ->name('verification.verify');

    // Renvoi de l'email de verification
    // Route::post('/email/verification-notification', [AuthController::class, 'resendVerificationEmail'])
    //     ->middleware(['throttle:6,1'])
    //     ->name('verification.send');
});

// ==========================================
// ROUTES PROTEGEES (Sanctum auth:sanctum)
// ==========================================
Route::middleware('auth:sanctum')->group(function () {

    Route::group(['prefix' => 'auth'], function () {

        // Profil de l'utilisateur connecte
        Route::get('/me', [AuthController::class, 'me'])
            ->name('auth.me');

        // Mise a jour du profil
        Route::put('/profile', [AuthController::class, 'updateProfile'])
            ->name('auth.profile.update');

        // Changement de mot de passe
        Route::put('/password', [AuthController::class, 'changePassword'])
            ->name('auth.password.change');

        // Deconnexion (revocation du token courant)
        Route::post('/logout', [AuthController::class, 'logout'])
            ->name('auth.logout');

        // Deconnexion de tous les appareils (revocation de tous les tokens)
        Route::post('/logout-all', [AuthController::class, 'logoutAll'])
            ->name('auth.logout.all');
    });
});
