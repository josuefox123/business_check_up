<?php

namespace App\Models;

use App\Enums\ActivityStage;
use App\Enums\DominantTopic;
use App\Enums\EntryMode;
use App\Enums\MainOfferType;
use App\Enums\OpportunityType;
use App\Enums\PrimaryNeed;
use App\Enums\RiskFlag;
use App\Enums\TimeAvailable;
use App\Enums\UserProfileType;
use App\Models\BusinessProfile;
use App\Models\DiagnosticRun;
use App\Models\UserProfile;
use App\Models\UserSession;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TriageRecord extends Model
{
    protected $table = 'bc_triage_records';

    protected $primaryKey = 'triage_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'triage_id',
        'session_id',
        'user_id',
        'business_id',
        'entry_mode',
        'declared_profile',
        'activity_stage_declared',
        'primary_need',
        'risk_flags',
        'risk_level',
        'opportunity_type',
        'dominant_topic',
        'time_available',
        'main_offer_type',
        'recommended_module_code',
        'recommendation_reason_code',
        'recommendation_reason_text',
        'user_confirmed_recommendation',
        'override_choice',
        'override_module_code',
        'triage_completed_at',
    ];

    protected $casts = [
        'entry_mode' => EntryMode::class,
        'declared_profile' => UserProfileType::class,
        'activity_stage_declared' => ActivityStage::class,
        'primary_need' => PrimaryNeed::class,
        'risk_flags' => 'array',
        'opportunity_type' => OpportunityType::class,
        'dominant_topic' => DominantTopic::class,
        'time_available' => TimeAvailable::class,
        'main_offer_type' => MainOfferType::class,
        'user_confirmed_recommendation' => 'boolean',
        'override_choice' => 'boolean',
        'triage_completed_at' => 'datetime',
    ];

    public function session(): BelongsTo
    {
        return $this->belongsTo(UserSession::class, 'session_id', 'session_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(UserProfile::class, 'user_id', 'user_id');
    }

    public function business(): BelongsTo
    {
        return $this->belongsTo(BusinessProfile::class, 'business_id', 'business_id');
    }

    public function diagnosticRuns(): HasMany
    {
        return $this->hasMany(DiagnosticRun::class, 'triage_id', 'triage_id');
    }

    public function hasCriticalRisk(): bool
    {
        if (empty($this->risk_flags)) {
            return false;
        }

        $criticalFlags = [
            RiskFlag::CANNOT_PAY_CURRENT_EXPENSES->value,
            RiskFlag::SUPPLIER_TAX_SALARY_DEBT_ARREARS->value,
            RiskFlag::CASH_INSUFFICIENT_CONTINUITY->value,
        ];

        return count(array_intersect($this->risk_flags, $criticalFlags)) > 0;
    }

    public function getEffectiveModuleCode(): string
    {
        if ($this->override_choice && $this->override_module_code) {
            return $this->override_module_code;
        }

        return $this->recommended_module_code;
    }
}
