<?php

namespace App\Models;

use App\Enums\AnswerType;
use App\Models\DiagnosticRun;
use App\Models\EvidenceRecord;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class QuestionResponse extends Model
{
    protected $table = 'bc_question_responses';

    protected $primaryKey = 'response_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'response_id',
        'diagnostic_run_id',
        'module_code',
        'question_id',
        'question_version',
        'question_dimension',
        'answer_type',
        'answer_value',
        'answer_ia',
        'answer_text',
        'answer_label',
        'score_1_5',
        'weight',
        'is_critical_question',
        'red_flag_triggered',
        'red_flag_code',
        'followup_triggered',
        'followup_question_id',
        'response_confidence_user',
        'answered_at',
    ];

    protected $casts = [
        'answer_type' => AnswerType::class,
        'score_1_5' => 'float',
        'weight' => 'float',
        'answer_value' => 'array',
        'is_critical_question' => 'boolean',
        'red_flag_triggered' => 'boolean',
        'followup_triggered' => 'boolean',
        'answered_at' => 'datetime',
    ];

    public function question()
    {
        return $this->belongsTo(
            Question::class,
            'question_id', // Clé étrangère dans bc_question_responses
            'question_id'  // Clé primaire (ou propriétaire) dans bc_questions
        );
    }

    public function diagnosticRun(): BelongsTo
    {
        return $this->belongsTo(DiagnosticRun::class, 'diagnostic_run_id', 'diagnostic_run_id');
    }

    public function evidenceRecord(): HasOne
    {
        return $this->hasOne(EvidenceRecord::class, 'response_id', 'response_id');
    }

    public function getScoreContribution(): float
    {
        if ($this->score_1_5 === null || $this->weight === null) {
            return 0.0;
        }

        return $this->score_1_5 * $this->weight;
    }

    public function isCritical(): bool
    {
        return $this->is_critical_question === true;
    }

    public function hasRedFlag(): bool
    {
        return $this->red_flag_triggered === true;
    }
}
