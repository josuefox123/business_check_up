<?php

namespace App\Models;

use App\Enums\ActivityStage;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BusinessProfile extends Model
{
    protected $table = 'bc_business_profiles';

    protected $primaryKey = 'business_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'business_id',
        'user_id',
        'business_name',
        'has_business_name',
        'country',
        'region',
        'commune',
        'sector',
        'sub_sector',
        'activity_stage',
        'maturity_phase',
        'legal_status',
        'ifu_available',
        'rccm_available',
        'bank_account_available',
        'years_in_activity',
        'year_created',
        'ca_n_1',
        'ca_m_1',
        'description',
        'employee_count_range',
        'monthly_revenue_range_xof',
        'customer_type',
        'sales_channel_main',
        'business_context_flags',
    ];

    protected $casts = [
        'has_business_name' => 'boolean',
        'ifu_available' => 'boolean',
        'rccm_available' => 'boolean',
        'bank_account_available' => 'boolean',
        'business_context_flags' => 'array',
        'activity_stage' => ActivityStage::class,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(UserProfile::class, 'user_id', 'user_id');
    }

    public function triageRecords(): HasMany
    {
        return $this->hasMany(TriageRecord::class, 'business_id', 'business_id');
    }

    public function diagnosticRuns(): HasMany
    {
        return $this->hasMany(DiagnosticRun::class, 'business_id', 'business_id');
    }

    public function isFormalized(): bool
    {
        return $this->rccm_available === true && $this->ifu_available === true;
    }

    public function hasBankAccount(): bool
    {
        return $this->bank_account_available === true;
    }
}
