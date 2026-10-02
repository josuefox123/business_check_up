<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\EmailVerificationCodeMail;
use App\Models\EmailVerificationCode;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;

class EmailVerificationController extends Controller
{
    /**
     * Génère et envoie un code à 6 chiffres.
     * POST /api/bc/verification/email/send
     */
    public function send(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email'             => ['required', 'email:rfc', 'max:255'],
            'full_name'         => ['nullable', 'string', 'max:255'],
            'diagnostic_run_id' => ['nullable', 'uuid'],
        ]);

        $email = strtolower($validated['email']);

        // Anti-spam : 1 code par minute par email
        $recent = EmailVerificationCode::where('email', $email)
            ->whereNull('verified_at')
            ->latest('last_sent_at')
            ->first();

        if ($recent && $recent->last_sent_at->diffInSeconds(now()) < EmailVerificationCode::RESEND_DELAY_SEC) {
            return response()->json([
                'message'    => 'Un code vient d\'être envoyé. Veuillez patienter avant de demander un nouveau code.',
                'retry_after' => EmailVerificationCode::RESEND_DELAY_SEC - $recent->last_sent_at->diffInSeconds(now()),
            ], 429);
        }

        [$record, $code] = EmailVerificationCode::generateFor(
            $email,
            $validated['diagnostic_run_id'] ?? null
        );

        try {
            Mail::to($email)->send(
                new EmailVerificationCodeMail($code, $validated['full_name'] ?? null)
            );
        } catch (TransportExceptionInterface $e) {
            Log::error('Échec envoi code de vérification', ['email' => $email, 'error' => $e->getMessage()]);
            return response()->json([
                'message' => 'L\'envoi de l\'email a échoué. Veuillez réessayer.',
                'code'    => 'EMAIL_SEND_FAILED',
            ], 502);
        }

        return response()->json([
            'message'    => 'Un code de vérification a été envoyé à votre adresse email.',
            'expires_in' => EmailVerificationCode::EXPIRATION_MINUTES * 60, // secondes, pour le timer front
        ], 200);
    }

    /**
     * Vérifie le code saisi par l'utilisateur.
     *  POST /api/bc/verification/email/verify
     */
    public function verify(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email:rfc'],
            'code'  => ['required', 'string', 'size:6'],
        ]);

        $email = strtolower($validated['email']);

        $record = EmailVerificationCode::where('email', $email)
            ->whereNull('verified_at')
            ->latest('last_sent_at')
            ->first();

        if (!$record) {
            return response()->json([
                'message' => 'Aucun code en cours pour cette adresse. Veuillez demander un nouveau code.',
                'code'    => 'NO_CODE_PENDING',
            ], 404);
        }

        if ($record->isExpired()) {
            return response()->json([
                'message' => 'Ce code a expiré. Veuillez demander un nouveau code.',
                'code'    => 'CODE_EXPIRED',
            ], 410);
        }

        if ($record->attempts >= EmailVerificationCode::MAX_ATTEMPTS) {
            return response()->json([
                'message' => 'Trop de tentatives. Veuillez demander un nouveau code.',
                'code'    => 'TOO_MANY_ATTEMPTS',
            ], 429);
        }

        if (!$record->checkCode($validated['code'])) {
            $record->increment('attempts');
            return response()->json([
                'message'          => 'Code incorrect.',
                'code'             => 'CODE_INVALID',
                'attempts_left'    => EmailVerificationCode::MAX_ATTEMPTS - $record->attempts,
            ], 422);
        }

        // Code correct → email vérifié
        $record->update(['verified_at' => now()]);

        return response()->json([
            'message'  => 'Adresse email vérifiée avec succès.',
            'verified' => true,
        ], 200);
    }
}
