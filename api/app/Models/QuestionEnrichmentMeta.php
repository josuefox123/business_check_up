<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuestionEnrichmentMeta extends Model
{
    protected $table = 'bc_question_enrichment_meta';

    protected $fillable = [
        'question_db_id',
        'display_moment',
        'display_condition',
        'report_sections',
        'ai_usage',
        'recommendation_effect',
        'rdv_trigger',
        'rdv_type',
        'data_to_prepare',
        'sensitivity',
        'ux_note',
        'dev_field',
    ];


    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class, 'question_db_id', 'question_db_id');
    }


    /**
     * Sections du rapport alimentées, sous forme de liste.
     */
    public function reportSectionsList(): array
    {
        return array_values(array_filter(array_map('trim', explode('|', (string) $this->report_sections))));
    }
}
