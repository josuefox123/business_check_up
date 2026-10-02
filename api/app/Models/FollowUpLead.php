<?php

namespace App\Models;

use App\Models\BusinessProfile;
use App\Models\DiagnosticRun;
use App\Models\UserProfile;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FollowUpLead extends Model
{
    protected $table = 'bc_follow_up_leads';

    protected $primaryKey = 'lead_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'lead_id',
        'user_id',
        'business_id',
        'diagnostic_run_id',
        'follow_up_requested',
        'follow_up_need_type',
        'lead_priority',
        'lead_reason_code',
        'assigned_to',
        'lead_status',
        'contact_attempt_count',
        'last_contacted_at',
        'follow_up_notes',
    ];

    protected $casts = [
        'follow_up_requested' => 'boolean',
        'contact_attempt_count' => 'integer',
        'last_contacted_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(UserProfile::class, 'user_id', 'user_id');
    }

    public function business(): BelongsTo
    {
        return $this->belongsTo(BusinessProfile::class, 'business_id', 'business_id');
    }

    public function diagnosticRun(): BelongsTo
    {
        return $this->belongsTo(DiagnosticRun::class, 'diagnostic_run_id', 'diagnostic_run_id');
    }

    public function isNew(): bool
    {
        return $this->lead_status === 'new';
    }

    public function markAsContacted(): void
    {
        $this->update([
            'lead_status' => 'contacted',
            'contact_attempt_count' => $this->contact_attempt_count + 1,
            'last_contacted_at' => now(),
        ]);
    }
}
