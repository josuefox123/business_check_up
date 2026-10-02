<?php

namespace App\Models;

use App\Enums\AppointmentStatus;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Appointment extends Model
{
    use HasUuids;

    protected $table = 'bc_appointments';

    protected $fillable = [
        'diagnostic_run_id',
        'user_id',
        'rdv_type',
        'email',
        'priority',
        'status',
        'requested_starts_at',
        'main_question',
        'confirmed_starts_at',
        'meeting_link',
        'location',
        'admin_notes',
    ];

    protected $casts = [
        'requested_starts_at' => 'datetime',
        'confirmed_starts_at' => 'datetime',
        'status' => AppointmentStatus::class,
    ];

    public function diagnosticRun()
    {
        return $this->belongsTo(DiagnosticRun::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(UserProfile::class, 'user_id', 'user_id');
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(UserSession::class, 'session_id', 'session_id');
    }
}
