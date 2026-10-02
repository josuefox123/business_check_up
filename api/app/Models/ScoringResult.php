<?php

namespace App\Models;

use App\Enums\EvidenceLevel;
use App\Enums\ScoreBand;
use App\Models\DiagnosticRun;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScoringResult extends Model
{
    protected $table = 'bc_scoring_results';

    protected $primaryKey = 'scoring_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'scoring_id',
        'diagnostic_run_id',
        'module_code',
        'raw_score_1_5',
        'converted_score_0_100',
        'adjusted_score_1_5',
        'credibility_score_0_1',
        'credibilized_score_0_100',
        'score_band',
        'evidence_band',
        'red_flag_count',
        'critical_red_flag_present',
        'dominant_strength_code',
        'dominant_weakness_code',
        'priority_1_code',
        'priority_2_code',
        'priority_3_code',
        'next_module_code',
        'score_calculated_at',
    ];

    protected $casts = [
        'raw_score_1_5' => 'float',
        'converted_score_0_100' => 'integer',
        'adjusted_score_1_5' => 'float',
        'credibility_score_0_1' => 'float',
        'credibilized_score_0_100' => 'integer',
        'score_band' => ScoreBand::class,
        'evidence_band' => EvidenceLevel::class,
        'red_flag_count' => 'integer',
        'critical_red_flag_present' => 'boolean',
        'score_calculated_at' => 'datetime',
    ];

    // protected function casts(): array
    // {
    //     return [
    //         'raw_score_1_5' => 'float',
    //         'adjusted_score_1_5' => 'float',
    //         'credibility_score_0_1' => 'float',
    //         'converted_score_0_100' => 'integer',
    //         'credibilized_score_0_100' => 'integer',
    //     ];
    // }

    public function diagnosticRun(): BelongsTo
    {
        return $this->belongsTo(DiagnosticRun::class, 'diagnostic_run_id', 'diagnostic_run_id');
    }

    public function getScoreDisplay(): int
    {
        return $this->credibilized_score_0_100 ?? $this->converted_score_0_100 ?? 0;
    }

    public function getBandLabel(): string
    {
        return $this->score_band->label();
    }

    public function hasCriticalRedFlag(): bool
    {
        return $this->critical_red_flag_present === true;
    }

    public function getPriorities(): array
    {
        $priorities = [];

        if ($this->priority_1_code) {
            $priorities[] = $this->priority_1_code;
        }
        if ($this->priority_2_code) {
            $priorities[] = $this->priority_2_code;
        }
        if ($this->priority_3_code) {
            $priorities[] = $this->priority_3_code;
        }

        return $priorities;
    }
}
