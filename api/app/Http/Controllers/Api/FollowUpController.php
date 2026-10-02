<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Models\DiagnosticRun;
use App\Models\FollowUpLead;
use App\Models\UserProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class FollowUpController extends BaseController
{
    /**
     * Demander un suivi après diagnostic
     * POST /api/bc/diagnostics/{diagnosticRunId}/follow-up
     */
    public function request(Request $request, string $diagnosticRunId): JsonResponse
    {
        $diagnostic = DiagnosticRun::find($diagnosticRunId);
        if (!$diagnostic) {
            return $this->respondNotFound('Diagnostic not found');
        }

        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:50',
            'whatsapp_number' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'follow_up_need_type' => 'nullable|string|in:diagnostic_expert,business_support,finance_preparation,cci_service,training,other',
            'preferred_contact_channel' => 'nullable|string|in:phone,whatsapp,email',
        ]);

        // Mettre à jour le profil utilisateur
        $userProfile = UserProfile::find($diagnostic->user_id);
        if ($userProfile) {
            $userProfile->update([
                'full_name' => $validated['full_name'],
                'phone_number' => $validated['phone_number'],
                'whatsapp_number' => $validated['whatsapp_number'] ?? null,
                'email' => $validated['email'] ?? null,
                'preferred_contact_channel' => $validated['preferred_contact_channel'] ?? null,
            ]);
        }

        $lead = FollowUpLead::create([
            'lead_id' => (string) Str::uuid(),
            'user_id' => $diagnostic->user_id,
            'business_id' => $diagnostic->business_id,
            'diagnostic_run_id' => $diagnosticRunId,
            'follow_up_requested' => true,
            'follow_up_need_type' => $validated['follow_up_need_type'] ?? 'other',
            'lead_priority' => $this->determinePriority($diagnostic),
            'lead_status' => 'new',
        ]);

        return $this->respondSuccess([
            'lead_id' => $lead->lead_id,
            'priority' => $lead->lead_priority,
            'status' => $lead->lead_status,
            'message' => 'Votre demande de suivi a été enregistrée. Un conseiller vous contactera prochainement.',
        ], 'Follow-up request created', 201);
    }

    private function determinePriority(DiagnosticRun $diagnostic): string
    {
        $scoring = $diagnostic->scoringResult;

        if (!$scoring) {
            return 'medium';
        }

        if ($scoring->hasCriticalRedFlag() || $scoring->score_band->value === 'critical') {
            return 'urgent';
        }

        if ($scoring->score_band->value === 'fragile') {
            return 'high';
        }

        return 'medium';
    }
}
