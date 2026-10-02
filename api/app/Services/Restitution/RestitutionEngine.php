<?php

namespace App\Services\Restitution;

use App\Enums\ScoreBand;
use App\Models\DiagnosticRun;
use App\Models\RecommendationResult;
use App\Models\ScoringResult;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

/**
 * Moteur de Restitution Business Check-up
 * 
 * Génère les messages consolidés par module et par bande de score.
 * Respecte les tone guardrails: jamais de promesse de financement,
 * jamais de langage d'échec, toujours contextualisé et actionnable.
 */
class RestitutionEngine
{
    private array $config;

    public function __construct(array $config = [])
    {
        $this->config = $config;
    }

    /**
     * Génère la restitution complète pour un diagnostic
     */
    public function generateRestitution(DiagnosticRun $run, ScoringResult $scoring): RecommendationResult
    {
        $moduleCode = $run->module_code;
        $scoreBand = $scoring->score_band;
        $score = $scoring->getScoreDisplay();

        // 1 Déterminer le template de restitution
        $template = $this->getTemplate($moduleCode, $scoreBand);

        // 2 Générer les forces
        $strengths = $this->generateStrengths($run, $scoring);

        // 3 Générer les fragilités
        $weaknesses = $this->generateWeaknesses($run, $scoring);

        // 4 Générer les priorités d'action
        $priorities = $this->generatePriorities($run, $scoring, $template);

        // 5 Déterminer l'orientation suivante
        $nextModule = $this->determineNextModule($run, $scoring);

        // 6 Construire le résultat
        $attributes = [
            'recommendation_id' => (string) Str::uuid(),
            'diagnostic_run_id' => $run->diagnostic_run_id,
            'module_code' => $moduleCode,
            'summary_text_key' => $template['summary_key'],
            'summary_text_rendered' => $this->renderSummary($template, $score, $scoreBand),
            'interpretation_text' => $template['interpretation_text'],
            'strengths_codes' => $strengths,
            'typical_strengths' => $template['typical_strengths'],
            'weaknesses_codes' => $weaknesses,
            'typical_fragilities' => $template['typical_fragilities'],
            'priority_actions_codes' => $priorities,
            'orientation_text_key' => $template['orientation_key'],
            'orientation_text' => $template['orientation_text'],
            'next_module_code' => $nextModule,
            'follow_up_recommended' => $scoreBand === ScoreBand::CRITICAL || $scoreBand === ScoreBand::FRAGILE,
            'urgent_attention_recommended' => $scoreBand === ScoreBand::CRITICAL || $scoring->hasCriticalRedFlag(),
            'disclaimer_version' => 'disc_v1.0_2026',
            'pdf_generated' => false,
        ];

        // Traçabilité de la variante éditoriale choisie (A/B/C)
        // + éléments d'affichage du pack (titres de sections, CTA, transition REQ).
        // Activées seulement si les colonnes existent (voir migration fournie).
        if (Schema::hasColumn('recommendation_results', 'restitution_variant')) {
            $attributes['restitution_variant'] = $template['variant_code'];
        }
        if (Schema::hasColumn('recommendation_results', 'restitution_meta')) {
            $attributes['restitution_meta'] = json_encode([
                'variant_code'       => $template['variant_code'],
                'narrative_angle'    => $template['narrative_angle'],
                'band_label'         => $template['band_label'],
                'headline'           => $template['headline'],
                'strengths_heading'  => $template['strengths_heading'],
                'vigilances_heading' => $template['vigilances_heading'],
                'actions_heading'    => $template['actions_heading'],
                'transition_req'     => $template['transition_req'],
                'cta_label'          => $template['cta_label'],
            ], JSON_UNESCAPED_UNICODE);
        }

        $recommendation = new RecommendationResult($attributes);

        $recommendation->save();

        return $recommendation;
    }

    /**
     * Récupère un pack de restitution selon module et bande de score,
     * en choisissant ALÉATOIREMENT l'une des 3 variantes éditoriales (A/B/C).
     * Source des packs : config/restitution_templates.php
     */
    private function getTemplate(string $moduleCode, ScoreBand $band): array
    {

        $templates = config('restitution_templates');

        // Fallback sur FLH-01 si module non trouvé
        $moduleTemplates = $templates[$moduleCode] ?? $templates['FLH-01'];
        $bandKey = $band->value;

        $variants = $moduleTemplates[$bandKey] ?? $moduleTemplates[ScoreBand::STABLE->value];

        // ─────────────────────────────────────────────────────────────
        // Choix ALÉATOIRE de la variante éditoriale (A, B ou C).
        // Chaque pack est complet et cohérent en lui-même (Excel V2,
        // feuille RESTITUTION VARIANTS) : l'utilisateur ne voit jamais
        // deux fois exactement le même texte au même niveau.
        // ─────────────────────────────────────────────────────────────
        $variantCode = array_rand($variants);

        $template = $variants[$variantCode];
        $template['variant_code'] = $variantCode;

        // Clés de texte paramétrables — la variante est tracée dans la clé
        $keyPrefix = $this->moduleKeyPrefix($moduleCode);
        $bandKeyUpper = strtoupper($bandKey);
        $template['summary_key'] = "{$keyPrefix}_{$bandKeyUpper}_SUMMARY_{$variantCode}";
        $template['orientation_key'] = "{$keyPrefix}_{$bandKeyUpper}_ORIENTATION_{$variantCode}";

        return $template;
    }

    /**
     * Préfixe des clés de texte paramétrables par module.
     * Permet de tracer la variante utilisée : ex. FIN_CRITICAL_SUMMARY_B
     */
    private function moduleKeyPrefix(string $moduleCode): string
    {
        return match ($moduleCode) {
            'FLH-01' => 'FLASH',
            'PRJ-02' => 'PRJ',
            'DIF-03' => 'DIF',
            'OPP-04' => 'OPP',
            'PRO-05' => 'PRO',
            'COM-06' => 'COM',
            'FIN-07' => 'FIN',
            'GOV-08' => 'GOV',
            '360-09' => 'GLOBAL',
            default  => 'FLASH',
        };
    }

    private function generateStrengths(DiagnosticRun $run, ScoringResult $scoring): array
    {
        $responses = $run->questionResponses;
        $strengths = [];

        // Identifier les questions avec score >= 4.0
        $highScores = $responses->where('score_1_5', '>=', 4.0);

        foreach ($highScores->take(3) as $response) {
            $dimension = $response->question_dimension;
            $strengths[] = $this->mapDimensionToStrength($dimension);
        }

        // Si moins de 3 forces, ajouter des forces génériques
        $defaultStrengths = [
            'Existence d\'une activité réelle',
            'Volonté de progresser démontrée',
            'Premières preuves de fonctionnement',
        ];

        while (count($strengths) < 2) {
            $strengths[] = array_shift($defaultStrengths);
        }

        return array_slice($strengths, 0, 3);
    }

    private function generateWeaknesses(DiagnosticRun $run, ScoringResult $scoring): array
    {
        $responses = $run->questionResponses;
        $weaknesses = [];

        // Identifier les questions avec score <= 2.0 ou red flag
        $lowScores = $responses->filter(function ($r) {
            return ($r->score_1_5 !== null && $r->score_1_5 <= 2.0) || $r->red_flag_triggered;
        });

        foreach ($lowScores->take(3) as $response) {
            $dimension = $response->question_dimension;
            $weaknesses[] = $this->mapDimensionToWeakness($dimension);
        }

        // Si moins de 2 fragilités, ajouter des fragilités génériques
        $defaultWeaknesses = [
            'Formalisation partielle des pratiques',
            'Suivi irrégulier des indicateurs clés',
            'Dépendance à quelques facteurs non maîtrisés',
        ];

        while (count($weaknesses) < 2) {
            $weaknesses[] = array_shift($defaultWeaknesses);
        }

        return array_slice($weaknesses, 0, 3);
    }

    private function generatePriorities(DiagnosticRun $run, ScoringResult $scoring, array $template): array
    {
        $priorities = $template['actions'] ?? [];

        // Ajouter des priorités spécifiques selon le score
        if ($scoring->score_band === ScoreBand::CRITICAL) {
            array_unshift($priorities, 'Demander un appui personnalisé dans les 7 prochains jours');
        }

        if ($scoring->hasCriticalRedFlag()) {
            array_unshift($priorities, 'Sécuriser la continuité d\'activité à court terme');
        }

        return array_slice($priorities, 0, 3);
    }

    private function determineNextModule(DiagnosticRun $run, ScoringResult $scoring): ?string
    {
        // Logique de détermination du module suivant
        $moduleCode = $run->module_code;
        $band = $scoring->score_band;

        // Mapping simple pour MVP
        $nextModules = [
            'FLH-01' => 'PRO-05', // Approfondir selon priorité détectée
            'PRJ-02' => 'COM-06',
            'DIF-03' => 'FIN-07',
            'OPP-04' => 'FIN-07',
            'PRO-05' => 'COM-06',
            'COM-06' => 'FIN-07',
            'FIN-07' => 'GOV-08',
            'GOV-08' => 'GOV-08',
            '360-09' => null, // Dépend des axes faibles
        ];

        return $nextModules[$moduleCode] ?? null;
    }

    private function renderSummary(array $template, int $score, ScoreBand $band): string
    {
        // Le message exécutif provient directement du pack éditorial choisi
        // (Excel V2, feuille RESTITUTION VARIANTS). Il est rédigé pour la
        // combinaison (module, bande, variante) et respecte les tone guardrails.
        return $template['executive_message'];
    }

    private function mapDimensionToStrength(string $dimension): string
    {
        $mapping = [
            'offer' => 'Offre claire et différenciée',
            'client' => 'Client cible bien identifié',
            'sales' => 'Ventes régulières et suivies',
            'finance' => 'Lisibilité financière satisfaisante',
            'cash' => 'Trésorerie maîtrisée',
            'organization' => 'Organisation structurée',
            'team' => 'Équipe compétente et stable',
            'operations' => 'Capacité de livraison fiable',
            'formalization' => 'Documents de base en place',
            'opportunity' => 'Opportunité bien définie',
        ];

        return $mapping[$dimension] ?? 'Point fort identifié';
    }

    private function mapDimensionToWeakness(string $dimension): string
    {
        $mapping = [
            'offer' => 'Offre à clarifier ou repositionner',
            'client' => 'Client cible peu défini',
            'sales' => 'Ventes irrégulières ou en baisse',
            'finance' => 'Lisibilité financière à renforcer',
            'cash' => 'Trésorerie peu suivie ou tendue',
            'organization' => 'Organisation à structurer',
            'team' => 'Compétences ou effectif à renforcer',
            'operations' => 'Capacité de livraison à sécuriser',
            'formalization' => 'Formalisation administrative insuffisante',
            'opportunity' => 'Opportunité à préparer davantage',
        ];

        return $mapping[$dimension] ?? 'Point de vigilance identifié';
    }
}
