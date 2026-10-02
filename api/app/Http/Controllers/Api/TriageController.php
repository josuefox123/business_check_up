<?php

namespace App\Http\Controllers\Api;

use App\Enums\ActivityStage;
use App\Enums\DominantTopic;
use App\Enums\EntryMode;
use App\Enums\MainOfferType;
use App\Enums\OpportunityType;
use App\Enums\PrimaryNeed;
use App\Enums\RiskFlag;
use App\Enums\TimeAvailable;
use App\Enums\UserProfileType;
use App\Http\Controllers\Api\BaseController;
use App\Models\BusinessProfile;
use App\Models\TriageRecord;
use App\Models\UserProfile;
use App\Models\UserSession;
use App\Services\Routing\TriageRouter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;


class TriageController extends BaseController
{
    private TriageRouter $router;

    public function __construct(TriageRouter $router)
    {
        $this->router = $router;
    }

    /**
     * Soumettre le triage complet et obtenir le module recommandé
     * POST /api/bc/sessions/{sessionId}/triage
     */
   public function store(Request $request, string $sessionId): JsonResponse
    {
        $session = UserSession::find($sessionId);

        if (!$session) {
            return $this->respondNotFound('Session not found');
        }

        // Vérifier le consentement
        if (!$session->consentRecord || !$session->consentRecord->isDiagnosticAllowed()) {
            return $this->respondForbidden('Diagnostic consent required');
        }

        $validated = $request->validate([
            // Profil utilisateur
            'user_profile_type' => 'nullable|string|in:' . implode(',', array_column(UserProfileType::cases(), 'value')), // 2
            'full_name' => 'nullable|string|max:255',
            'phone_number' => 'nullable|string|max:50',
            'whatsapp_number' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',

            // Profil business
            'business_name' => 'nullable|string|max:255',
            'region' => 'nullable|string',
            'commune' => 'nullable|string',
            'sector' => 'nullable|string',
            'sub_sector' => 'nullable|string|max:100',
            'year_created' => ['nullable', 'string'],
            'ca_n_1' => 'nullable|string',
            'ca_m_1' => 'nullable|string',
            'activity_stage' => 'nullable|string|in:' . implode(',', array_column(ActivityStage::cases(), 'value')), // 3
            'years_in_activity' => 'nullable|integer|min:0|max:99',
            'employee_count_range' => 'nullable|string|in:' . implode(',', ["1-10", "11-50", "51-100", "101-250", "251-500", "501+"]),
            'description' => ['nullable', 'string'],

            // Triage
            'entry_mode' => 'nullable|string|in:' . implode(',', array_column(EntryMode::cases(), 'value')), // 1
            'primary_need' => 'nullable|string|in:' . implode(',', array_column(PrimaryNeed::cases(), 'value')), // 4
            'risk_flags' => 'nullable|array', // 5
            'risk_flags.*' => 'string|in:' . implode(',', array_column(RiskFlag::cases(), 'value')), // 5
            'opportunity_type' => 'nullable|string|in:' . implode(',', array_column(OpportunityType::cases(), 'value')), // 6
            'dominant_topic' => 'nullable|string|in:' . implode(',', array_column(DominantTopic::cases(), 'value')), // 7
            'main_offer_type' => 'nullable|string|in:' . implode(',', array_column(MainOfferType::cases(), 'value')), // 8
            'time_available' => 'nullable|string|in:' . implode(',', array_column(TimeAvailable::cases(), 'value')),
        ]);

        $userProfile = UserProfile::where('email', $validated['email'])->first();

        // Créer ou mettre à jour le profil utilisateur
        if (!$userProfile) {
            $userProfile = UserProfile::create([
                'user_id' => (string) Str::uuid(),
                'email' => $validated['email'],
                'user_profile_type' => $validated['user_profile_type'] ?? null,
                'full_name' => $validated['full_name'] ?? null,
                'phone_number' => $validated['phone_number'] ?? null,
                'whatsapp_number' => $validated['whatsapp_number'] ?? null,
            ]);
        } else {
            $userProfile->update([
                'user_profile_type' => $validated['user_profile_type'] ?? $userProfile->user_profile_type,
                'full_name' => $validated['full_name'] ?? $userProfile->full_name,
                'phone_number' => $validated['phone_number'] ?? $userProfile->phone_number,
                'whatsapp_number' => $validated['whatsapp_number'] ?? $userProfile->whatsapp_number,
            ]);
        }



        $businessProfile = BusinessProfile::firstOrCreate(
            [
                'user_id' => $userProfile->user_id,
            ],
            [
                'business_id' =>  (string) Str::uuid(),
                'business_name' => $validated['business_name'] ?? null,
                'has_business_name' => true,
                'region' => $validated['region'],
                'commune' => $validated['commune'] ?? null,
                'sector' => $validated['sector'],
                'sub_sector' => $validated['sub_sector'] ?? null,
                'activity_stage' => $validated['activity_stage'] ?? null,
                'years_in_activity' => $validated['years_in_activity'] ?? null,
                'year_created' => $validated['year_created'] ?? now()->year,
                'ca_n_1' => $validated['ca_n_1'] ?? null,
                'ca_m_1' => $validated['ca_m_1'] ?? null,
                'employee_count_range' => $validated['employee_count_range'] ?? null,
                'country' => 'BJ',
                'description' => $validated['description'] ?? null,
            ]
        );

        // Déterminer le niveau de risque
        $riskFlags = $validated['risk_flags'] ?? [];
        $riskLevel = $this->determineRiskLevel($riskFlags);

        // Créer l'enregistrement de triage
        $triage = TriageRecord::create([
            'triage_id' => (string) Str::uuid(),
            'session_id' => $sessionId,
            'user_id' => $session->user_id,
            'business_id' => $businessProfile->business_id,
            'entry_mode' => $validated['entry_mode'],
            'declared_profile' => $validated['user_profile_type'],
            'activity_stage_declared' => $validated['activity_stage'],
            'primary_need' => $validated['primary_need'],
            'risk_flags' => $riskFlags,
            'risk_level' => $riskLevel,
            'opportunity_type' => $validated['opportunity_type'] ?? null,
            'dominant_topic' => $validated['dominant_topic'] ?? null,
            'time_available' => $validated['time_available'] ?? null,
            'triage_completed_at' => now(),
        ]);

        // Router vers le module recommandé
        $route = $this->router->route($triage);

        // Mettre à jour le triage avec la recommandation
        $triage->update([
            'recommended_module_code' => $route['module_code'],
            'recommendation_reason_code' => $route['reason_code'],
            'recommendation_reason_text' => $route['reason_text'],
        ]);

        return $this->respondSuccess([
            'triage_id' => $triage->triage_id,
            'recommended_module' => [
                'code' => $route['module_code'],
                'name' => config("business-checkup.modules.{$route['module_code']}.name"),
                'duration' => config("business-checkup.modules.{$route['module_code']}.target_duration"),
            ],
            'reason' => [
                'code' => $route['reason_code'],
                'text' => $route['reason_text'],
            ],
            'priority' => $route['priority'],
            'override_required' => $route['override_user_choice'],
            'risk_level' => $riskLevel,
            'user_profile' => [
                'user_id' => $session->user_id,
                'type' => $validated['user_profile_type'],
            ],
        ], 'Triage completed', 201);
    }

    /**
     * Confirmer ou modifier le choix de module
     * POST /api/bc/sessions/{sessionId}/triage/confirm
     */
    public function confirm(Request $request, string $sessionId): JsonResponse
    {
        $session = UserSession::find($sessionId);

        if (!$session) {
            return $this->respondNotFound('Session not found');
        }

        $validated = $request->validate([
            'triage_id' => 'required|string|uuid',
            'confirmed' => 'required|boolean',
            'override_module_code' => 'nullable|string|exists:config_business_checkup_modules,code',
        ]);

        $triage = TriageRecord::find($validated['triage_id']);

        if (!$triage || $triage->session_id !== $sessionId) {
            return $this->respondNotFound('Triage not found');
        }

        $triage->update([
            'user_confirmed_recommendation' => $validated['confirmed'],
            'override_choice' => !$validated['confirmed'] && !empty($validated['override_module_code']),
            'override_module_code' => $validated['override_module_code'] ?? null,
        ]);

        $effectiveModule = $triage->getEffectiveModuleCode();

        return $this->respondSuccess([
            'triage_id' => $triage->triage_id,
            'confirmed' => $validated['confirmed'],
            'effective_module' => $effectiveModule,
            'module_name' => config("business-checkup.modules.{$effectiveModule}.name"),
        ]);
    }

    /**
     * Valider un choix direct de module
     * POST /api/bc/sessions/{sessionId}/triage/validate-choice
     */
    public function validateChoice(Request $request, string $sessionId): JsonResponse
    {
        $session = UserSession::find($sessionId);

        if (!$session) {
            return $this->respondNotFound('Session not found');
        }

        $validated = $request->validate([
            'module_code' => 'required|string',
            'triage_id' => 'required|string|uuid',
        ]);

        $triage = TriageRecord::find($validated['triage_id']);

        if (!$triage) {
            return $this->respondNotFound('Triage not found');
        }

        $validation = $this->router->validateDirectChoice($validated['module_code'], $triage);

        return $this->respondSuccess($validation);
    }

    private function determineRiskLevel(array $riskFlags): string
    {
        if (empty($riskFlags) || in_array('none', $riskFlags)) {
            return 'none';
        }

        $criticalFlags = [
            RiskFlag::CANNOT_PAY_CURRENT_EXPENSES->value,
            RiskFlag::SUPPLIER_TAX_SALARY_DEBT_ARREARS->value,
            RiskFlag::CASH_INSUFFICIENT_CONTINUITY->value,
        ];

        $highFlags = [
            RiskFlag::SALES_STRONG_DECLINE->value,
            RiskFlag::LOST_MAJOR_CLIENT->value,
            RiskFlag::PRODUCTION_DELIVERY_BLOCKED->value,
        ];

        if (count(array_intersect($riskFlags, $criticalFlags)) > 0) {
            return 'critical';
        }

        if (count(array_intersect($riskFlags, $highFlags)) > 0) {
            return 'high';
        }

        return 'medium';
    }
}
