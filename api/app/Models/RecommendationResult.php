<?php

namespace App\Models;

use App\Models\DiagnosticRun;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RecommendationResult extends Model
{
    protected $table = 'bc_recommendation_results';

    protected $primaryKey = 'recommendation_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'recommendation_id',
        'diagnostic_run_id',
        'module_code',
        'summary_text_key',
        'summary_text_rendered',
        'interpretation_text',
        'strengths_codes',
        'weaknesses_codes',
        'typical_fragilities',
        'typical_strengths',
        'priority_actions_codes',
        'orientation_text_key',
        'orientation_text',
        'next_module_code',
        'follow_up_recommended',
        'urgent_attention_recommended',
        'disclaimer_version',
        'pdf_generated',
        'pdf_url',
    ];

    protected $casts = [
        'strengths_codes' => 'array',
        'weaknesses_codes' => 'array',
        'priority_actions_codes' => 'array',
        'typical_fragilities' => 'array',
        'typical_strengths' => 'array',
        'follow_up_recommended' => 'boolean',
        'urgent_attention_recommended' => 'boolean',
        'pdf_generated' => 'boolean',
    ];

    public function diagnosticRun(): BelongsTo
    {
        return $this->belongsTo(DiagnosticRun::class, 'diagnostic_run_id', 'diagnostic_run_id');
    }

    public function getStrengths(): array
    {
        return $this->strengths_codes ?? [];
    }

    public function getWeaknesses(): array
    {
        return $this->weaknesses_codes ?? [];
    }

    public function getPriorityActions(): array
    {
        return $this->priority_actions_codes ?? [];
    }

    public function isFollowUpRecommended(): bool
    {
        return $this->follow_up_recommended === true;
    }

    public function isUrgentAttentionRequired(): bool
    {
        return $this->urgent_attention_recommended === true;
    }
}
