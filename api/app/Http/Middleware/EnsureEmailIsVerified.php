<?php

namespace App\Http\Middleware;

use App\Models\EmailVerificationCode;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureEmailIsVerified
{
    /**
     * Vérifie que l'adresse email de la requête a été validée par code (valable 24h).
     * L'email est lu dans le body de la requête (champ "email").
     */
    public function handle(Request $request, Closure $next): Response
    {
        $email = strtolower((string) $request->input('email', ''));

        // Pas d'email dans la requête → la validation du contrôleur s'en chargera,
        // mais on anticipe avec un message clair.
        if ($email === '') {
            return response()->json([
                'message' => 'Le champ email est requis.',
                'code'    => 'EMAIL_REQUIRED',
            ], 422);
        }

        if (!EmailVerificationCode::hasVerifiedEmail($email)) {
            return response()->json([
                'message' => 'Veuillez d\'abord vérifier votre adresse email avec le code reçu.',
                'code'    => 'EMAIL_NOT_VERIFIED',
            ], 403);
        }

        return $next($request);
    }
}
