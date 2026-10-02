<?php

namespace App\Models;

use App\Enums\EntryMode;
use App\Enums\EntrySource;
use App\Enums\SessionStatus;
use App\Models\AnalyticsEvent;
use App\Models\ConsentRecord;
use App\Models\DiagnosticRun;
use App\Models\TriageRecord;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class UserSession extends Model
{
    protected $table = 'bc_user_sessions';

    protected $primaryKey = 'session_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'session_id',
        'user_id',
        'started_at',
        'ended_at',
        'entry_source',
        'entry_mode',
        'device_type',
        'browser_language',
        'session_status',
        'last_screen_id',
        'utm_campaign',
        'utm_channel',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'entry_source' => EntrySource::class,
        'entry_mode' => EntryMode::class,
        'session_status' => SessionStatus::class,
    ];

    public function consentRecord(): HasOne
    {
        return $this->hasOne(ConsentRecord::class, 'session_id', 'session_id');
    }

    public function triageRecords(): HasMany
    {
        return $this->hasMany(TriageRecord::class, 'session_id', 'session_id');
    }

    public function diagnosticRuns(): HasMany
    {
        return $this->hasMany(DiagnosticRun::class, 'session_id', 'session_id');
    }

    public function analyticsEvents(): HasMany
    {
        return $this->hasMany(AnalyticsEvent::class, 'session_id', 'session_id');
    }

    public function scopeActive($query)
    {
        return $query->where('session_status', '!=', SessionStatus::ABANDONED->value);
    }

    public function scopeCompleted($query)
    {
        return $query->where('session_status', SessionStatus::COMPLETED->value);
    }

    public function markAsCompleted(): void
    {
        $this->update([
            'session_status' => SessionStatus::COMPLETED,
            'ended_at' => now(),
        ]);
    }

    public function markAsAbandoned(string $screenId = null): void
    {
        $this->update([
            'session_status' => SessionStatus::ABANDONED,
            'ended_at' => now(),
            'last_screen_id' => $screenId,
        ]);
    }
}
