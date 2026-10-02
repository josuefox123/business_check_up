<?php

namespace App\Http\Controllers\Api;

use App\Enums\EntryMode;
use App\Enums\EntrySource;
use App\Enums\SessionStatus;
use App\Http\Controllers\Api\BaseController;
use App\Models\UserSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SessionController extends BaseController
{
    /**
     * Créer une nouvelle session utilisateur
     * POST /api/bc/sessions
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'ip_address' => 'required|ip',
            'entry_source' => 'nullable|string|in:' . implode(',', array_column(EntrySource::cases(), 'value')),
            'entry_mode' => 'nullable|string|in:' . implode(',', array_column(EntryMode::cases(), 'value')),
            'device_type' => 'nullable|string|in:mobile,tablet,desktop,unknown',
            'browser_language' => 'nullable|string|in:fr,en',
            'utm_campaign' => 'nullable|string|max:255',
            'utm_channel' => 'nullable|string|max:255',
        ]);

        $session = UserSession::create([
            'session_id' => (string) Str::uuid(),
            'user_id' => (string) Str::uuid(), // Utilisateur anonyme initial
            'started_at' => now(),
            'entry_source' => $validated['entry_source'] ?? EntrySource::DIRECT->value,
            'entry_mode' => $validated['entry_mode'] ?? EntryMode::ASSISTED->value,
            'device_type' => $validated['device_type'] ?? 'unknown',
            'browser_language' => $validated['browser_language'] ?? 'fr',
            'session_status' => SessionStatus::STARTED->value,
            'utm_campaign' => $validated['utm_campaign'] ?? null,
            'utm_channel' => $validated['utm_channel'] ?? null,
        ]);

        return $this->respondSuccess([
            'session_id' => $session->session_id,
            'user_id' => $session->user_id,
            'started_at' => $session->started_at->toIso8601String(),
            'status' => $session->session_status->value,
        ], 'Session created successfully', 201);
    }

    /**
     * Récupérer les détails d'une session
     * GET /api/bc/sessions/{sessionId}
     */
    public function show(string $sessionId): JsonResponse
    {
        $session = UserSession::find($sessionId);

        if (!$session) {
            return $this->respondNotFound('Session not found');
        }

        return $this->respondSuccess([
            'session_id' => $session->session_id,
            'user_id' => $session->user_id,
            'status' => $session->session_status->value,
            'started_at' => $session->started_at?->toIso8601String(),
            'ended_at' => $session->ended_at?->toIso8601String(),
            'entry_source' => $session->entry_source?->value,
            'entry_mode' => $session->entry_mode?->value,
            'device_type' => $session->device_type,
            'last_screen' => $session->last_screen_id,
        ]);
    }

    /**
     * Mettre à jour le statut d'une session
     * PATCH /api/bc/sessions/{sessionId}
     */
    public function update(Request $request, string $sessionId): JsonResponse
    {
        $session = UserSession::find($sessionId);

        if (!$session) {
            return $this->respondNotFound('Session not found');
        }

        $validated = $request->validate([
            'status' => 'required|string|in:' . implode(',', array_column(SessionStatus::cases(), 'value')),
            'last_screen_id' => 'nullable|string|max:50',
        ]);

        $updateData = ['session_status' => $validated['status']];

        if (isset($validated['last_screen_id'])) {
            $updateData['last_screen_id'] = $validated['last_screen_id'];
        }

        if ($validated['status'] === SessionStatus::COMPLETED->value) {
            $updateData['ended_at'] = now();
        }

        $session->update($updateData);

        return $this->respondSuccess([
            'session_id' => $session->session_id,
            'status' => $session->session_status->value,
        ], 'Session updated');
    }

    /**
     * Abandonner une session
     * DELETE /api/bc/sessions/{sessionId}
     */
    public function abandon(Request $request, string $sessionId): JsonResponse
    {
        $session = UserSession::find($sessionId);

        if (!$session) {
            return $this->respondNotFound('Session not found');
        }

        $screenId = $request->input('last_screen_id');
        $session->markAsAbandoned($screenId);

        return $this->respondSuccess([
            'session_id' => $session->session_id,
            'status' => 'abandoned',
        ], 'Session abandoned');
    }
}
