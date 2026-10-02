<?php

namespace App\Services\Scoring;

use App\Enums\EvidenceLevel;
use App\Enums\ScoreBand;
use App\Models\DiagnosticRun;
use App\Models\ScoringResult;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

/**
 * Moteur de Scoring Business Check-up
 * 
 * Implémente les règles de calcul SCR-01 à SCR-15
 * avec toutes les formules de scoring documentées.
 */
class ScoringEngine
{
    private array $config;

    public function __construct(array $config = [])
    {
        $this->config = $config;
    }

    /**
     * SCR-01: Conversion score 1-5 -> 0-100
     * Formule: score_0_100 = ROUND(((score_1_5 - 1) / 4) * 100, 0)
     */
    public function convertToDisplayScore(float $score1to5): int
    {
        $converted = (($score1to5 - 1) / 4) * 100;
        return (int) round($converted, 0);
    }

    /**
     * SCR-02: Score module = moyenne pondérée des questions scorées
     * Formule: sum(score_i * weight_i) / sum(weight_i)
     * Exclut les questions "No score" du dénominateur
     */
    public function calculateModuleScore(Collection $responses): float
    {
        $weightedSum = 0;
        $totalWeight = 0;

        foreach ($responses as $response) {
            if ($response->score_1_5 === null || $response->weight === null) {
                continue; // Question "No score" - exclue du calcul
            }

            $weightedSum += $response->score_1_5 * $response->weight;
            $totalWeight += $response->weight;
        }

        if ($totalWeight === 0) {
            return 1.0; // Score minimum par défaut
        }

        return round($weightedSum / $totalWeight, 2);
    }

    /**
     * SCR-03: Flash - Priorité dominante
     * min_domain_score ajusté par red_flag_count
     */
    public function calculateFlashPriority(DiagnosticRun $run): array
    {
        $responses = $run->questionResponses;

        // Grouper par dimension
        $dimensions = [
            'offer' => [],
            'client' => [],
            'sales' => [],
            'finance' => [],
            'cash' => [],
            'organization' => [],
            'team' => [],
            'operations' => [],
            'formalization' => [],
            'opportunity' => [],
            'difficulty' => [],
        ];

        foreach ($responses as $response) {
            $dim = $response->question_dimension;
            if (isset($dimensions[$dim])) {
                $dimensions[$dim][] = $response;
            }
        }

        // Calculer score par domaine
        $domainScores = [];
        foreach ($dimensions as $dim => $dimResponses) {
            if (empty($dimResponses)) {
                continue;
            }

            $score = $this->calculateModuleScore(collect($dimResponses));
            $redFlagCount = collect($dimResponses)->where('red_flag_triggered', true)->count();

            // Ajustement par red flags: chaque red flag réduit le score de 0.3
            $adjustedScore = max(1.0, $score - ($redFlagCount * 0.3));

            $domainScores[$dim] = [
                'raw_score' => $score,
                'adjusted_score' => $adjustedScore,
                'red_flag_count' => $redFlagCount,
            ];
        }

        // Trouver le domaine avec le score ajusté le plus faible (priorité dominante)
        $minScore = PHP_FLOAT_MAX;
        $priorityDomain = null;

        foreach ($domainScores as $dim => $data) {
            if ($data['adjusted_score'] < $minScore) {
                $minScore = $data['adjusted_score'];
                $priorityDomain = $dim;
            }
        }

        // Mapping domaine → module
        $domainToModule = [
            'offer' => 'PRO-05',
            'client' => 'COM-06',
            'sales' => 'COM-06',
            'finance' => 'FIN-07',
            'cash' => 'FIN-07',
            'organization' => 'GOV-08',
            'team' => 'GOV-08',
            'operations' => 'DIF-03',
            'formalization' => 'GOV-08',
            'opportunity' => 'OPP-04',
            'difficulty' => 'DIF-03',
        ];

        return [
            'priority_domain' => $priorityDomain,
            'priority_module' => $domainToModule[$priorityDomain] ?? 'FLH-01',
            'domain_scores' => $domainScores,
            'min_adjusted_score' => $minScore,
        ];
    }

    /**
     * SCR-04: Difficulté - Niveau d'urgence
     * urgence = weighted inverse des signaux de continuité, cash, dettes, ventes, livraison
     */
    public function calculateUrgencyLevel(DiagnosticRun $run): array
    {
        $responses = $run->questionResponses;

        // Questions clés pour l'urgence (DIF-03)
        $urgencyWeights = [
            'DIF-03-Q02' => 1.7, // Continuité 30 jours
            'DIF-03-Q03' => 1.6, // Cash
            'DIF-03-Q05' => 1.5, // Dette
            'DIF-03-Q04' => 1.3, // Ventes
            'DIF-03-Q07' => 1.2, // Production
        ];

        $urgencyScore = 0;
        $totalWeight = 0;
        $hasCritical = false;

        foreach ($responses as $response) {
            $qId = $response->question_id;
            if (!isset($urgencyWeights[$qId])) {
                continue;
            }

            $weight = $urgencyWeights[$qId];
            // Score inversé: plus le score est bas, plus l'urgence est élevée
            $inverseScore = 6 - ($response->score_1_5 ?? 3); // 5→1, 1→5

            $urgencyScore += $inverseScore * $weight;
            $totalWeight += $weight;

            // Détection critique: continuité "Non sans appui rapide"
            if ($qId === 'DIF-03-Q02' && ($response->score_1_5 ?? 5) <= 1.5) {
                $hasCritical = true;
            }
        }

        if ($totalWeight === 0) {
            return ['level' => 'low', 'score' => 1.0, 'has_critical' => false];
        }

        $normalizedUrgency = $urgencyScore / $totalWeight;

        // Classification
        $level = match (true) {
            $hasCritical || $normalizedUrgency >= 4.5 => 'critical',
            $normalizedUrgency >= 3.5 => 'high',
            $normalizedUrgency >= 2.5 => 'medium',
            default => 'low',
        };

        return [
            'level' => $level,
            'score' => round($normalizedUrgency, 2),
            'has_critical' => $hasCritical,
        ];
    }

    /**
     * SCR-05: Opportunité - Maturité
     * avg weighted des questions clés
     */
    public function calculateOpportunityMaturity(DiagnosticRun $run): array
    {
        $responses = $run->questionResponses;

        // Questions clés P.WIN Light
        $keyQuestions = [
            'OPP-04-Q03' => 1.4, // Traction
            'OPP-04-Q04' => 1.2, // Offre prête
            'OPP-04-Q06' => 1.3, // Capacité
            'OPP-04-Q07' => 1.2, // Coût
            'OPP-04-Q08' => 1.2, // Marge
            'OPP-04-Q11' => 1.5, // Preuve
            'OPP-04-Q13' => 1.2, // Avantage
        ];

        $weightedSum = 0;
        $totalWeight = 0;

        foreach ($responses as $response) {
            $qId = $response->question_id;
            if (!isset($keyQuestions[$qId])) {
                continue;
            }

            $weight = $keyQuestions[$qId];
            $weightedSum += ($response->score_1_5 ?? 3) * $weight;
            $totalWeight += $weight;
        }

        if ($totalWeight === 0) {
            return ['maturity' => 'unknown', 'score' => 3.0];
        }

        $maturityScore = $weightedSum / $totalWeight;

        $maturity = match (true) {
            $maturityScore >= 4.0 => 'credible',
            $maturityScore >= 3.0 => 'conditional',
            $maturityScore >= 2.0 => 'premature',
            default => 'premature',
        };

        return [
            'maturity' => $maturity,
            'score' => round($maturityScore, 2),
        ];
    }

    /**
     * SCR-06: Projet - Préparation
     */
    public function calculateProjectReadiness(DiagnosticRun $run): float
    {
        $responses = $run->questionResponses;

        // Questions clés avec poids renforcés
        $keyQuestions = [
            'PRJ-02-Q01' => 1.3, // Problème
            'PRJ-02-Q02' => 1.2, // Client
            'PRJ-02-Q04' => 1.4, // Validation
            'PRJ-02-Q05' => 1.2, // Revenu
            'PRJ-02-Q06' => 1.0, // Coûts
            'PRJ-02-Q08' => 1.2, // Différenciation
        ];

        return $this->calculateWeightedScore($responses, $keyQuestions);
    }

    /**
     * SCR-07: Produit/Offre - Maturité
     */
    public function calculateOfferMaturity(DiagnosticRun $run): float
    {
        $responses = $run->questionResponses;

        $keyQuestions = [
            'PRO-05-Q01' => 1.2, // Clarté
            'PRO-05-Q02' => 1.3, // Besoin client
            'PRO-05-Q04' => 1.2, // Différenciation
            'PRO-05-Q05' => 1.2, // Prix
            'PRO-05-Q06' => 1.4, // Marge
            'PRO-05-Q11' => 1.3, // Preuve marché
        ];

        return $this->calculateWeightedScore($responses, $keyQuestions);
    }

    /**
     * SCR-08: Commercial - Maturité
     */
    public function calculateCommercialMaturity(DiagnosticRun $run): float
    {
        $responses = $run->questionResponses;

        $keyQuestions = [
            'COM-06-Q01' => 1.2, // Segments
            'COM-06-Q02' => 1.1, // Canaux
            'COM-06-Q03' => 1.1, // Conversion
            'COM-06-Q04' => 1.2, // Récurrence
            'COM-06-Q05' => 1.0, // Suivi client
            'COM-06-Q09' => 1.2, // Tendance
        ];

        return $this->calculateWeightedScore($responses, $keyQuestions);
    }

    /**
     * SCR-09: Finance - Viabilité
     */
    public function calculateFinancialViability(DiagnosticRun $run): float
    {
        $responses = $run->questionResponses;

        $keyQuestions = [
            'FIN-07-Q01' => 1.2, // CA
            'FIN-07-Q02' => 1.2, // Charges
            'FIN-07-Q03' => 1.5, // Marge
            'FIN-07-Q04' => 1.3, // Trésorerie
            'FIN-07-Q05' => 1.2, // BFR
            'FIN-07-Q06' => 1.4, // Dettes
            'FIN-07-Q09' => 1.0, // Financement
            'FIN-07-Q10' => 1.2, // Remboursement
            'FIN-07-Q11' => 1.0, // Résilience
        ];

        return $this->calculateWeightedScore($responses, $keyQuestions);
    }

    /**
     * SCR-10: Gouvernance - Maturité organisationnelle
     */
    public function calculateGovernanceMaturity(DiagnosticRun $run): float
    {
        $responses = $run->questionResponses;

        $keyQuestions = [
            'GOV-08-Q01' => 1.2, // Rôles
            'GOV-08-Q02' => 1.1, // Décisions
            'GOV-08-Q03' => 1.0, // Réunions
            'GOV-08-Q04' => 1.3, // Délégation
            'GOV-08-Q07' => 1.0, // KPI
            'GOV-08-Q10' => 1.0, // Dépenses
        ];

        return $this->calculateWeightedScore($responses, $keyQuestions);
    }

    /**
     * SCR-11: 360° - Score global
     */
    public function calculate360Score(DiagnosticRun $run): array
    {
        $responses = $run->questionResponses;

        // Axes du 360°
        $axes = [
            'governance' => ['GOV'],
            'finance' => ['FIN'],
            'product' => ['PRO'],
            'commercial' => ['COM'],
            'hr' => ['RH'],
            'vision' => ['VIS'],
            'positioning' => ['POS'],
            'market' => ['MKT'],
            'impact' => ['IMP'],
        ];

        $axisScores = [];
        $globalSum = 0;
        $globalCount = 0;

        foreach ($axes as $axisName => $prefixes) {
            $axisResponses = $responses->filter(function ($r) use ($prefixes) {
                foreach ($prefixes as $prefix) {
                    if (str_starts_with($r->question_id, "360-09-{$prefix}")) {
                        return true;
                    }
                }
                return false;
            });

            if ($axisResponses->isEmpty()) {
                continue;
            }

            // Q1-Q3 scorées, Q4 exclue (non scorée)
            $scoredResponses = $axisResponses->filter(function ($r) {
                return !str_ends_with($r->question_id, '-Q4');
            });

            $score = $this->calculateModuleScore($scoredResponses);
            $axisScores[$axisName] = $score;

            $globalSum += $score;
            $globalCount++;
        }

        $globalScore = $globalCount > 0 ? $globalSum / $globalCount : 3.0;

        // Identifier les 2-3 axes les plus faibles
        asort($axisScores);
        $weakestAxes = array_slice(array_keys($axisScores), 0, 3, true);

        // Mapping axes faibles → modules
        $axisToModule = [
            'governance' => 'GOV-08',
            'finance' => 'FIN-07',
            'product' => 'PRO-05',
            'commercial' => 'COM-06',
            'hr' => 'RH-10',
            'vision' => 'VIS-14',
            'positioning' => 'POS-15',
            'market' => 'MKT-16',
            'impact' => 'IMP-17',
        ];

        $recommendedModules = array_map(fn($axis) => $axisToModule[$axis] ?? null, $weakestAxes);
        $recommendedModules = array_filter($recommendedModules);

        return [
            'global_score' => round($globalScore, 2),
            'axis_scores' => $axisScores,
            'weakest_axes' => $weakestAxes,
            'recommended_modules' => $recommendedModules,
        ];
    }

    /**
     * SCR-12: Score crédibilisé
     * score_credible = score_declared * evidence_factor
     */
    public function calculateCredibilizedScore(
        float $declaredScore,
        EvidenceLevel $evidenceLevel
    ): float {
        return round($declaredScore * $evidenceLevel->factor(), 2);
    }

    /**
     * SCR-14: Banding
     */
    public function determineScoreBand(float $score0to100): ScoreBand
    {
        return ScoreBand::fromScore($score0to100);
    }

    /**
     * Calcul principal complet pour un diagnostic
     */
    public function calculateFullScore(DiagnosticRun $run): ScoringResult
    {
        $moduleCode = $run->module_code;
        $responses = $run->questionResponses;

        // 1. Score brut selon le module
        $rawScore = match ($moduleCode) {
            'FLH-01' => $this->calculateModuleScore($responses),
            'PRJ-02' => $this->calculateProjectReadiness($run),
            'DIF-03' => $this->calculateModuleScore($responses),
            'OPP-04' => $this->calculateOpportunityMaturity($run)['score'] ?? 3.0,
            'PRO-05' => $this->calculateOfferMaturity($run),
            'COM-06' => $this->calculateCommercialMaturity($run),
            'FIN-07' => $this->calculateFinancialViability($run),
            'GOV-08' => $this->calculateGovernanceMaturity($run),
            '360-09' => $this->calculate360Score($run)['global_score'] ?? 3.0,
            default => $this->calculateModuleScore($responses),
        };

        // 2. Conversion 0-100
        $convertedScore = $this->convertToDisplayScore($rawScore);

        // 3. Niveau de preuve moyen
        $evidenceRecords = $run->evidenceRecords;
        $avgEvidenceFactor = $evidenceRecords->isEmpty()
            ? 0.7
            : $evidenceRecords->avg(fn($e) => $e->getCredibilityFactor());

        // 4. Score crédibilisé
        $evidenceLevel = $this->determineEvidenceLevelFromFactor($avgEvidenceFactor);
        $credibilizedScore = $this->calculateCredibilizedScore($rawScore, $evidenceLevel);
        $credibilizedScore0to100 = $this->convertToDisplayScore($credibilizedScore);

        // 5. Red flags
        $redFlagCount = $responses->where('red_flag_triggered', true)->count();
        $hasCriticalRedFlag = $responses->where('red_flag_triggered', true)
            ->contains(function ($r) {
                return str_contains($r->red_flag_code ?? '', 'CRITICAL');
            });

        // 6. Bande
        $scoreBand = $this->determineScoreBand($credibilizedScore0to100);

        // 7. Créer le résultat
        $scoringResult = new ScoringResult([
            'scoring_id' => (string) Str::uuid(),
            'diagnostic_run_id' => $run->diagnostic_run_id,
            'module_code' => $moduleCode,
            'raw_score_1_5' => $rawScore,
            'converted_score_0_100' => $convertedScore,
            'adjusted_score_1_5' => $rawScore, // Ajustement contextuel si besoin
            'credibility_score_0_1' => $avgEvidenceFactor,
            'credibilized_score_0_100' => $credibilizedScore0to100,
            'score_band' => $scoreBand,
            'evidence_band' => $evidenceLevel,
            'red_flag_count' => $redFlagCount,
            'critical_red_flag_present' => $hasCriticalRedFlag,
            'score_calculated_at' => now(),
        ]);

        $scoringResult->save();

        return $scoringResult;
    }

    /**
     * Helper: Calcul score pondéré générique
     */
    private function calculateWeightedScore(Collection $responses, array $keyQuestions): float
    {
        $weightedSum = 0;
        $totalWeight = 0;

        foreach ($responses as $response) {
            $qId = $response->question_id;
            if (!isset($keyQuestions[$qId])) {
                continue;
            }

            $weight = $keyQuestions[$qId];
            $score = $response->score_1_5 ?? 3.0;

            $weightedSum += $score * $weight;
            $totalWeight += $weight;
        }

        if ($totalWeight === 0) {
            return 3.0;
        }

        return round($weightedSum / $totalWeight, 2);
    }

    /**
     * Helper: Déterminer le niveau de preuve depuis le facteur
     */
    private function determineEvidenceLevelFromFactor(float $factor): EvidenceLevel
    {
        return match (true) {
            $factor >= 0.98 => EvidenceLevel::E3_VERIFIABLE_DATA,
            $factor >= 0.93 => EvidenceLevel::E2_DOCUMENT_AVAILABLE,
            $factor >= 0.80 => EvidenceLevel::E1_CONCRETE_INDICE,
            default => EvidenceLevel::E0_DECLARATIVE,
        };
    }
    
    
    /**
     * Calcule les scores par axe pour le radar du rapport PDF.
     *
     * - Module 360-09 : délègue à calculate360Score() et traduit les clés en labels français.
     * - Autres modules : regroupe les QuestionResponses par question_dimension, calcule la
     *   moyenne pondérée par dimension, puis fusionne les dimensions apparentées en axes nommés.
     *
     * @return array<string, array{score: float, target: float}>
     *         e.g. ['Finance & Viabilité' => ['score' => 3.2, 'target' => 4.5]]
     */
    public function calculateAxisScoresForReport(DiagnosticRun $run): array
    {
        $moduleCode = $run->module_code;

        // ─── Module 360° ──────────────────────────────────────────────────────
        if ($moduleCode === '360-09') {
            $result = $this->calculate360Score($run);

            $axisLabels = [
                'governance'  => 'Gouvernance',
                'finance'     => 'Finance & Viabilité',
                'product'     => 'Offre & Produit',
                'commercial'  => 'Commercial',
                'hr'          => 'Ressources Humaines',
                'vision'      => 'Vision',
                'positioning' => 'Positionnement',
                'market'      => 'Marché & Clients',
                'impact'      => 'Impact',
            ];

            $output = [];
            foreach ($result['axis_scores'] as $axisKey => $score) {
                $label = $axisLabels[$axisKey] ?? ucfirst($axisKey);
                $output[$label] = ['score' => round($score, 2), 'target' => 4.5];
            }

            return $output;
        }

        // ─── Autres modules : regroupement par question_dimension ─────────────
        // Plusieurs dimensions peuvent converger vers le même axe (moyenne pondérée combinée).
        $dimensionToAxis = [
            'offer'         => 'Offre & Positionnement',
            'client'        => 'Marché & Clients',
            'sales'         => 'Marché & Clients',
            'finance'       => 'Finance & Viabilité',
            'cash'          => 'Finance & Viabilité',
            'organization'  => 'Organisation & Pilotage',
            'team'          => 'Organisation & Pilotage',
            'operations'    => 'Opérations & Exécution',
            'formalization' => 'Organisation & Pilotage',
            'opportunity'   => 'Vision & Opportunité',
            'difficulty'    => 'Diagnostic & Difficulté',
        ];

        $responses = $run->questionResponses;

        // Regrouper les réponses par axe cible
        $axisGroups = [];
        foreach ($responses as $response) {
            $dim = $response->question_dimension;
            if (! $dim) {
                continue;
            }
            $axisLabel = $dimensionToAxis[$dim] ?? null;
            if (! $axisLabel) {
                continue;
            }
            if (! isset($axisGroups[$axisLabel])) {
                $axisGroups[$axisLabel] = collect();
            }
            $axisGroups[$axisLabel]->push($response);
        }

        if (empty($axisGroups)) {
            return [];
        }

        $output = [];
        foreach ($axisGroups as $axisLabel => $axisResponses) {
            $score = $this->calculateModuleScore($axisResponses);
            $output[$axisLabel] = ['score' => round($score, 2), 'target' => 4.5];
        }

        return $output;
    }
}
