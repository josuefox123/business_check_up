<?php

namespace App\Models;

use App\Enums\EvidenceLevel;
use App\Models\DiagnosticRun;
use App\Models\QuestionResponse;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EvidenceRecord extends Model
{
    protected $table = 'bc_evidence_records';

    protected $primaryKey = 'evidence_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'evidence_id',
        'diagnostic_run_id',
        'response_id',
        'question_id',
        'evidence_level',
        'evidence_label',
        'evidence_type',
        'document_uploaded',
        'document_url',
        'evidence_recency',
        'evidence_note',
    ];

    protected $casts = [
        'evidence_level' => EvidenceLevel::class,
        'document_uploaded' => 'boolean',
    ];

    public function diagnosticRun(): BelongsTo
    {
        return $this->belongsTo(DiagnosticRun::class, 'diagnostic_run_id', 'diagnostic_run_id');
    }

    public function questionResponse(): BelongsTo
    {
        return $this->belongsTo(QuestionResponse::class, 'response_id', 'response_id');
    }

    public function getCredibilityFactor(): float
    {
        return $this->evidence_level->factor();
    }
}
