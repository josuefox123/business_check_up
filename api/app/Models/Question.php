<?php

namespace App\Models;

use App\Enums\AnswerType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Question extends Model
{
    protected $table = 'bc_questions';

    protected $primaryKey = 'question_id';

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'question_id',
        'module_code',
        'order',
        'role',
        'dimension',
        'text',
        'helper_text',
        'answer_type',
        'answer_ia',
        'options',
        'score_logic',
        'weight',
        'evidence_required',
        'evidence_prompt',
        'default_evidence_level',
        'red_flag_conditions',
        'followup_trigger',
        'next_question_logic',
        'next_module_hint',
        'version',
        'is_active',
        'is_required',
        'question_kind',
        'req_level',
    ];

    protected $casts = [
        'answer_type' => AnswerType::class,
        'options' => 'array',
        'red_flag_conditions' => 'array',
        'followup_trigger' => 'array',
        'weight' => 'decimal:2',
        'evidence_required' => 'boolean',
        'is_active' => 'boolean',
        'is_required' => 'boolean',
    ];

    /**
     * Scope : questions actives d'un module
     */
    public function scopeActiveForModule($query, string $moduleCode)
    {
        return $query
            ->where('module_code', $moduleCode)
            ->where('is_active', true)
            ->orderBy('order');
    }

    /**
     * Récupérer les options formatées pour le front
     */
    public function getFormattedOptions(): array
    {
        return array_map(function ($opt) {
            return [
                'value' => $opt['value'],
                'label' => $opt['label'],
                'score' => $opt['score'] ?? null,
            ];
        }, $this->options ?? []);
    }

    /**
     * Récupérer les options avec scores (pour le back)
     */
    public function getScoringOptions(): array
    {
        return $this->options ?? [];
    }

    /**
     * Vérifier si une réponse déclenche un red flag
     */
    public function checkRedFlagByAnswer(string $answerValue, ?float $score = null): ?array
    {
        if (empty($this->red_flag_conditions)) {
            return null;
        }

        foreach ($this->red_flag_conditions as $condition) {
            $triggered = match ($condition['operator']) {
                '<=' => $score !== null && $score <= $condition['value'],
                '>=' => $score !== null && $score >= $condition['value'],
                '=' => $answerValue === $condition['value'],
                'in' => in_array($answerValue, (array) $condition['value']),
                default => false,
            };

            if ($triggered) {
                return [
                    'code' => $condition['code'],
                    'message' => $condition['message'] ?? 'Alerte déclenchée',
                ];
            }
        }

        return null;
    }



    // ───────────────────────────────────────────────
    // SCORES
    // ───────────────────────────────────────────────

    /**
     * Récupère le score d'une option simple (single_choice)
     */
    public function getScoreForOption(string $answerValue): ?int
    {
        $options = $this->options ?? [];

        foreach ($options as $option) {
            if ($option['value'] === $answerValue) {
                return $option['score'] ?? null;
            }
        }

        return null;
    }


    /**
     * Récupère le label d'une option simple
     */
    public function getLabelForOption(string $answerValue): ?string
    {
        $options = $this->options ?? [];

        foreach ($options as $option) {
            if ($option['value'] === $answerValue) {
                return $option['label'] ?? null;
            }
        }

        return null;
    }


    /**
     * Calcule le score moyen pour un tableau de réponses (multi_choice)
     * Retourne [score_moyen, labels_concaténés]
     */
    public function getScoreForMultipleOptions(array $answerValues): array
    {
        $options = $this->options ?? [];
        $scores = [];
        $labels = [];

        // Index rapide des options par valeur
        $optionsByValue = [];
        foreach ($options as $option) {
            $optionsByValue[$option['value']] = $option;
        }

        foreach ($answerValues as $value) {
            if (isset($optionsByValue[$value])) {
                $option = $optionsByValue[$value];
                $scores[] = $option['score'] ?? 0;
                $labels[] = $option['label'] ?? $value;
            }
        }

        if (empty($scores)) {
            return [null, null];
        }

        // Score moyen arrondi
        $averageScore = (int) round(array_sum($scores) / count($scores));

        return [
            $averageScore,
            implode(' | ', $labels)
        ];
    }



/*
    |--------------------------------------------------------------------------
    | Red flags
    |--------------------------------------------------------------------------
    */

    /**
     * Retourne le code du premier red flag déclenché, ou null.
     *
     * @param int|null     $score       Score calculé (null pour les questions non scorées)
     * @param string|array $answerValue Valeur(s) de réponse (string si single_choice, array si multi_choice)
     */
    public function checkRedFlag(?int $score, string|array $answerValue): ?string
    {
        foreach ($this->normalizedConditions($this->red_flag_conditions) as $condition) {
            if ($this->matchesCondition($condition, $score, $answerValue)) {
                return $condition['code'] ?? null;
            }
        }

        return null;
    }

    /*
    |--------------------------------------------------------------------------
    | Questions de suivi (follow-up)
    |--------------------------------------------------------------------------
    */

    /**
     * Retourne la liste des questions de suivi déclenchées.
     * Même moteur d'évaluation que checkRedFlag().
     *
     * @return array<int, array{question_id: string, text: ?string, options: ?array}>
     */
    public function checkFollowups(?int $score, string|array $answerValue): array
    {
        $followups = [];

        foreach ($this->normalizedConditions($this->followup_trigger) as $trigger) {
            if (empty($trigger['question_id'])) {
                continue;
            }

            if ($this->matchesCondition($trigger, $score, $answerValue)) {
                $followups[] = [
                    'question_id' => $trigger['question_id'],
                    'text'        => $trigger['text'] ?? null,
                    'options'     => $trigger['options'] ?? null,
                ];
            }
        }

        return $followups;
    }

    /*
    |--------------------------------------------------------------------------
    | Moteur d'évaluation commun
    |--------------------------------------------------------------------------
    */

    /**
     * Normalise le stockage JSON : accepte une liste d'objets (format cible)
     * ou un objet unique (format legacy). Retourne toujours une liste.
     */
    private function normalizedConditions(?array $conditions): array
    {
        if (empty($conditions)) {
            return [];
        }

        // Un objet unique (tableau associatif) devient une liste d'un élément.
        if (! array_is_list($conditions)) {
            $conditions = [$conditions];
        }

        return $conditions;
    }

    /**
     * Évaluateur générique de condition.
     * Toute condition dont le format n'est pas reconnu est ignorée (retourne false),
     * ce qui protège l'ancien format pseudo-textuel ('score <= 2', 'has_critical', …).
     */
    private function matchesCondition(array $condition, ?int $score, string|array $answerValue): bool
    {
        $field    = $condition['field']    ?? null;
        $operator = $condition['operator'] ?? null;

        if (! $field || ! $operator) {
            return false;
        }

        $value = $condition['value'] ?? null;

        return match ($field) {
            'score'        => $score !== null && $this->evaluateNumeric($score, $operator, $value),
            'value'        => $this->evaluateSingleValue($answerValue, $operator, $value),
            'values'       => $this->evaluateMultiValues($answerValue, $operator, $value),
            'values_count' => $this->evaluateNumeric(count((array) $answerValue), $operator, (int) $value),
            default        => false,
        };
    }

    /**
     * Comparaison numérique : utilisée pour 'score' et 'values_count'.
     */
    private function evaluateNumeric(int $number, string $operator, mixed $value): bool
    {
        $value = (int) $value;

        return match ($operator) {
            '<='      => $number <= $value,
            '<'       => $number <  $value,
            '>='      => $number >= $value,
            '>'       => $number >  $value,
            '==', '=' => $number == $value,
            '!='      => $number != $value,
            default   => false,
        };
    }

    /**
     * Comparaison d'une valeur unique (single_choice).
     */
    private function evaluateSingleValue(string|array $answer, string $operator, mixed $value): bool
    {
        // Par sécurité : si un tableau arrive (multi_choice), on évalue chaque élément.
        if (is_array($answer)) {
            foreach ($answer as $item) {
                if ($this->evaluateSingleValue($item, $operator, $value)) {
                    return true;
                }
            }
            return false;
        }

        return match ($operator) {
            '=', '==' => $answer === $value,
            '!='      => $answer !== $value,
            'in'      => in_array($answer, (array) $value, true),
            'not_in'  => ! in_array($answer, (array) $value, true),
            default   => false,
        };
    }

    /**
     * Comparaison d'un ensemble de valeurs (multi_choice).
     * '=' signifie « sélection exacte » (ex. : « chercher_financement » seul).
     */
    private function evaluateMultiValues(string|array $answer, string $operator, mixed $value): bool
    {
        $answers = array_values((array) $answer);
        $values  = array_values((array) $value);

        $intersection = array_intersect($answers, $values);

        return match ($operator) {
            'intersects', 'contains_any' => count($intersection) > 0,
            'contains_all'               => count($intersection) === count($values),
            'not_intersects'             => count($intersection) === 0,
            '=', '=='                    => $answers == $values,
            default                      => false,
        };
    }



    /*
    |--------------------------------------------------------------------------
    | QuestionEnrichmentHelpers
    |--------------------------------------------------------------------------
    */


    /**
     * Métadonnées d'enrichissement (présentes uniquement pour les REQ).
     */
    public function enrichmentMeta(): HasOne
    {
        return $this->hasOne(QuestionEnrichmentMeta::class, 'question_db_id', 'question_db_id');
    }

    /**
     * Question de diagnostic (score / routage / red flags) — les 148 existantes.
     */
    public function isDiagnostic(): bool
    {
        return $this->question_kind !== 'enrichment';
    }


    /**
     * Question d'enrichissement REQ : alimente le rapport et le RDV,
     * ne modifie ni le routage, ni le score, ni la bande de résultat.
     */
    public function isEnrichment(): bool
    {
        return $this->question_kind === 'enrichment';
    }

    /**
     * REQ affichée systématiquement (niveau Core) ?
     */
    public function isCoreEnrichment(): bool
    {
        return $this->isEnrichment() && $this->req_level === 'core';
    }

    /**
     * REQ affichée sous condition (niveau Conditional) ?
     * La condition métier est dans enrichmentMeta->display_condition.
     */
    public function isConditionalEnrichment(): bool
    {
        return $this->isEnrichment() && $this->req_level === 'conditional';
    }

    /*
     * Scopes pratiques :
     *
     *   Question::diagnostic()->where('module_code', $module)->get();
     *   Question::enrichment()->where('module_code', $module)->get();
     *   Question::enrichmentCore()->... / Question::enrichmentConditional()->...
     */
    public function scopeDiagnostic($query)
    {
        return $query->where('question_kind', 'diagnostic');
    }

    public function scopeEnrichment($query)
    {
        return $query->where('question_kind', 'enrichment');
    }

    public function scopeEnrichmentCore($query)
    {
        return $query->enrichment()->where('req_level', 'core');
    }

    public function scopeEnrichmentConditional($query)
    {
        return $query->enrichment()->where('req_level', 'conditional');
    }

    public function options(): HasMany
    {
        return $this->hasMany(Option::class, 'question_id', 'question_id');
    }
}
