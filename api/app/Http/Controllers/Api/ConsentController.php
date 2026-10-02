<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Models\ConsentRecord;
use App\Models\UserSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ConsentController extends BaseController
{
    /**
     * Enregistrer le consentement
     * POST /api/bc/sessions/{sessionId}/consent
     */
    public function store(Request $request, string $sessionId): JsonResponse
    {
        $session = UserSession::find($sessionId);

        if (!$session) {
            return $this->respondNotFound('Session not found');
        }

        $validated = $request->validate([
            'consent_diagnostic' => 'required|boolean',
            'consent_aggregate' => 'required|boolean',
            'consent_contact' => 'nullable|boolean',
            'consent_pdf_email' => 'nullable|boolean',
            'privacy_notice_url' => 'nullable|url|max:500',
        ]);

        // Vérification: consentement diagnostic obligatoire
        if (!$validated['consent_diagnostic']) {
            return $this->respondError(
                'Diagnostic consent is required to proceed',
                403,
                ['consent_diagnostic' => 'You must accept the diagnostic consent to continue']
            );
        }

        $consent = ConsentRecord::create([
            'consent_id' => (string) Str::uuid(),
            'session_id' => $sessionId,
            'consent_diagnostic' => $validated['consent_diagnostic'],
            'consent_aggregate' => $validated['consent_aggregate'],
            'consent_contact' => $validated['consent_contact'] ?? false,
            'consent_pdf_email' => $validated['consent_pdf_email'] ?? false,
            'consent_version' => config('business-checkup.version'),
            'consent_timestamp' => now(),
            'privacy_notice_url' => $validated['privacy_notice_url'] ?? null,
        ]);

        return $this->respondSuccess([
            'consent_id' => $consent->consent_id,
            'consent_diagnostic' => $consent->consent_diagnostic,
            'consent_aggregate' => $consent->consent_aggregate,
            'consent_contact' => $consent->consent_contact,
            'timestamp' => $consent->consent_timestamp->toIso8601String(),
        ], 'Consent recorded successfully', 201);
    }

    /**
     * Vérifier le consentement
     *  GET /api/bc/sessions/{sessionId}/consent
     */
    public function show(string $sessionId): JsonResponse
    {
        $session = UserSession::find($sessionId);

        if (!$session) {
            return $this->respondNotFound('Session not found');
        }

        $consent = $session->consentRecord;

        if (!$consent) {
            return $this->respondError('No consent found for this session', 404);
        }

        return $this->respondSuccess([
            'consent_id' => $consent->consent_id,
            'consent_diagnostic' => $consent->consent_diagnostic,
            'consent_aggregate' => $consent->consent_aggregate,
            'consent_contact' => $consent->consent_contact,
            'consent_pdf_email' => $consent->consent_pdf_email,
            'timestamp' => $consent->consent_timestamp->toIso8601String(),
        ]);
    }
}
