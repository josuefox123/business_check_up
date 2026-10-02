<?php

namespace App\Models;

use App\Models\UserSession;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConsentRecord extends Model
{
    protected $table = 'bc_consent_records';

    protected $primaryKey = 'consent_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'consent_id',
        'session_id',
        'consent_diagnostic',
        'consent_aggregate',
        'consent_contact',
        'consent_pdf_email',
        'consent_version',
        'consent_timestamp',
        'privacy_notice_url',
    ];

    protected $casts = [
        'consent_diagnostic' => 'boolean',
        'consent_aggregate' => 'boolean',
        'consent_contact' => 'boolean',
        'consent_pdf_email' => 'boolean',
        'consent_timestamp' => 'datetime',
    ];

    public function session(): BelongsTo
    {
        return $this->belongsTo(UserSession::class, 'session_id', 'session_id');
    }

    public function isDiagnosticAllowed(): bool
    {
        return $this->consent_diagnostic === true;
    }

    public function isAggregateAllowed(): bool
    {
        return $this->consent_aggregate === true;
    }

    public function isContactAllowed(): bool
    {
        return $this->consent_contact === true;
    }
}
