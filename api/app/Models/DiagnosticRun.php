<?php

namespace App\Models;

use App\Enums\CompletionStatus;
use App\Enums\ModuleFamily;
use App\Enums\ReportStatus;
use App\Models\BusinessProfile;
use App\Models\EvidenceRecord;
use App\Models\QuestionResponse;
use App\Models\RecommendationResult;
use App\Models\ScoringResult;
use App\Models\TriageRecord;
use App\Models\UserProfile;
use App\Models\UserSession;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class DiagnosticRun extends Model
{
    protected $table = 'bc_diagnostic_runs';

    protected $primaryKey = 'diagnostic_run_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'diagnostic_run_id',
        'session_id',
        'user_id',
        'business_id',
        'triage_id',
        'module_code',
        'module_family',
        'module_version',
        'started_at',
        'completed_at',
        'completion_status',
        'question_count_expected',
        'question_count_answered',
        'followup_count',
        'duration_seconds',
        'abandon_screen_id',
        'abandon_question_id',
        'is_recommended_module',
        'is_user_override',
        'report_status',
        'report_sent_at'
    ];

    protected $casts = [
        'module_family' => ModuleFamily::class,
        'completion_status' => CompletionStatus::class,
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'is_recommended_module' => 'boolean',
        'is_user_override' => 'boolean',
        'report_status' => ReportStatus::class,
        'report_sent_at' => 'datetime',
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

    public function triage(): BelongsTo
    {
        return $this->belongsTo(TriageRecord::class, 'triage_id', 'triage_id');
    }

    public function questionResponses(): HasMany
    {
        return $this->hasMany(QuestionResponse::class, 'diagnostic_run_id', 'diagnostic_run_id');
    }

    public function scoringResult(): HasOne
    {
        return $this->hasOne(ScoringResult::class, 'diagnostic_run_id', 'diagnostic_run_id');
    }

    public function recommendationResult(): HasOne
    {
        return $this->hasOne(RecommendationResult::class, 'diagnostic_run_id', 'diagnostic_run_id');
    }

    public function evidenceRecords(): HasMany
    {
        return $this->hasMany(EvidenceRecord::class, 'diagnostic_run_id', 'diagnostic_run_id');
    }

    public function markAsCompleted(): void
    {
        $this->update([
            'completion_status' => CompletionStatus::COMPLETED,
            'completed_at' => now(),
            'duration_seconds' => $this->started_at ? now()->diffInSeconds($this->started_at) : null,
        ]);
    }

    public function markAsAbandoned(string $screenId = null, string $questionId = null): void
    {
        $this->update([
            'completion_status' => CompletionStatus::ABANDONED,
            'abandon_screen_id' => $screenId,
            'abandon_question_id' => $questionId,
            'duration_seconds' => $this->started_at ? now()->diffInSeconds($this->started_at) : null,
        ]);
    }

    public function calculateProgress(): float
    {
        if ($this->question_count_expected === 0) {
            return 0.0;
        }

        return round(($this->question_count_answered / $this->question_count_expected) * 100, 2);
    }
}
