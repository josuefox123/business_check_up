<?php

namespace App\Services\Routing;

use App\Enums\DominantTopic;
use App\Enums\OpportunityType;
use App\Enums\PrimaryNeed;
use App\Enums\RiskFlag;
use App\Enums\TimeAvailable;
use App\Enums\UserProfileType;
use App\Models\ScoringResult;
use App\Models\TriageRecord;

/**
 * Moteur de Routage Intelligent - Triage
 * 
 * Implémente l'arbre de triage avec les règles de priorité absolue:
 * 1. Signaux de risque critique priment sur tout
 * 2. Financement prématuré → Finance d'abord
 * 3. Besoin flou → Flash
 * 4. Projet non lancé → Diagnostic projet
 * 5. Opportunité claire → P.WIN Light
 * 6. PME structurée + temps → 360°
 */
class TriageRouter
{
    private array $config;

    public function __construct(array $config = [])
    {
        $this->config = $config;
    }

    /**
     * Route principale: détermine le module recommandé
     */
    public function route(TriageRecord $triage): array
    {
        $riskFlags = $triage->risk_flags ?? [];
        $primaryNeed = $triage->primary_need;
        $activityStage = $triage->activity_stage_declared;
        $userProfile = $triage->declared_profile;
        $opportunityType = $triage->opportunity_type;
        $dominantTopic = $triage->dominant_topic;
        $timeAvailable = $triage->time_available;

        // === PRIORITÉ 1: Signaux de risque critique ===
        $criticalFlags = [
            RiskFlag::CANNOT_PAY_CURRENT_EXPENSES->value,
            RiskFlag::SUPPLIER_TAX_SALARY_DEBT_ARREARS->value,
            RiskFlag::CASH_INSUFFICIENT_CONTINUITY->value,
        ];

        if ($this->hasAnyFlag($riskFlags, $criticalFlags)) {
            return $this->buildRoute(
                module: 'DIF-03',
                reasonCode: 'risk_priority',
                reasonText: 'Votre situation semble nécessiter une stabilisation avant toute autre démarche. Votre entreprise semble traverser une difficulté qui mérite d’être traitée en priorité. Nous vous recommandons le Diagnostic Difficulté / Stabilisation. Durée estimée : 10 à 15 minutes. L’objectif est d’identifier le blocage principal et les premières mesures à engager.',
                priority: 1,
                override: true,
            );
        }

        // === PRIORITÉ 2: Signal commercial élevé ===
        $highCommercialFlags = [
            RiskFlag::SALES_STRONG_DECLINE->value,
            RiskFlag::LOST_MAJOR_CLIENT->value,
        ];

        if ($this->hasAnyFlag($riskFlags, $highCommercialFlags)) {
            return $this->buildRoute(
                module: 'DIF-03',
                reasonCode: 'risk_priority',
                reasonText: 'Votre priorité semble être la relance commerciale avant la croissance. Votre entreprise semble traverser une difficulté qui mérite d’être traitée en priorité. Nous vous recommandons le Diagnostic Difficulté / Stabilisation. Durée estimée : 10 à 15 minutes. L’objectif est d’identifier le blocage principal et les premières mesures à engager.',
                priority: 2,
                override: false,
            );
        }

        // === PRIORITÉ 3: Signal production bloquée ===
        if ($this->hasAnyFlag($riskFlags, [RiskFlag::PRODUCTION_DELIVERY_BLOCKED->value])) {
            return $this->buildRoute(
                module: 'DIF-03',
                reasonCode: 'risk_priority',
                reasonText: 'Votre blocage opérationnel doit être traité en priorité. Votre entreprise semble traverser une difficulté qui mérite d’être traitée en priorité. Nous vous recommandons le Diagnostic Difficulté / Stabilisation. Durée estimée : 10 à 15 minutes. L’objectif est d’identifier le blocage principal et les premières mesures à engager.',
                priority: 3,
                override: false,
            );
        }

        // === PRIORITÉ 4: Financement prématuré ===
        if ($primaryNeed === PrimaryNeed::PREPARE_FINANCING) {
            // Vérifier si la viabilité financière est connue
            // Si non → FIN-07 d'abord
            return $this->buildRoute(
                module: 'FIN-07',
                reasonCode: 'finance_before_funding',
                reasonText: "Avant d'évaluer une opportunité de financement, clarifions d'abord la viabilité économique. Votre priorité semble liée à la viabilité économique, à la trésorerie ou à la rentabilité. Nous vous recommandons le Diagnostic Finance / Viabilité. Durée estimée : 8 à 15 minutes.",
                priority: 4,
                override: true,
            );
        }

        // === PRIORITÉ 5: Projet non lancé ===
        if ($activityStage?->value === 'not_launched' || $userProfile === UserProfileType::PROJECT_HOLDER) {
            return $this->buildRoute(
                module: 'PRJ-02',
                reasonCode: 'profile_fit',
                reasonText: 'Votre situation correspond à un projet ou une activité en préparation. Nous vous recommandons le Diagnostic Projet. Durée estimée : 8 à 12 minutes. Il vous aidera à clarifier votre idée, vos clients, votre offre, votre modèle de revenus et les prochaines validations à mener.',
                priority: 5,
                override: false,
            );
        }

        // === PRIORITÉ 6: Opportunité claire sans risque ===
        if ($opportunityType && $opportunityType !== OpportunityType::NONE && $opportunityType !== OpportunityType::UNKNOWN) {
            return $this->buildRoute(
                module: 'OPP-04',
                reasonCode: 'opportunity_fit',
                reasonText: "Vous cherchez à saisir une opportunité. Nous vous recommandons le Diagnostic Opportunité / P.WIN Light. Durée estimée : 10 à 15 minutes. L’objectif est d’apprécier si votre entreprise est mûre pour cette opportunité, quelles conditions doivent être réunies, et quels points doivent être sécurisés avant d’avancer.",
                priority: 6,
                override: false,
            );
        }

        // === PRIORITÉ 7: Besoin flou ===
        if ($primaryNeed === PrimaryNeed::UNKNOWN_NEED) {
            return $this->buildRoute(
                module: 'FLH-01',
                reasonCode: 'need_fit',
                reasonText: 'Votre besoin semble nécessiter une première lecture globale rapide. Nous vous recommandons le Diagnostic Flash. Durée estimée : 7 à 10 minutes. À la fin, Business Check-up vous indiquera la fonction prioritaire à approfondir.',
                priority: 7,
                override: false,
            );
        }

        // === PRIORITÉ 8: PME structurée avec temps ===
        if (
            $userProfile === UserProfileType::STRUCTURED_SME &&
            $timeAvailable === TimeAvailable::THIRTY_FORTY_FIVE_MIN
        ) {
            return $this->buildRoute(
                module: '360-09',
                reasonCode: 'profile_fit',
                reasonText: 'Vous souhaitez une lecture globale de votre entreprise. Nous vous recommandons le Diagnostic Complet 360° simplifié. Durée estimée : 30 à 45 minutes. Il analysera les principales fonctions de votre entreprise et identifiera vos priorités d’amélioration.',
                priority: 8,
                override: false,
            );
        }

        // === ROUTE PAR DÉFAUT: Mapping besoin -> module ===
        $needMapping = [
            PrimaryNeed::CLARIFY_PROJECT->value => 'PRJ-02',
            PrimaryNeed::GLOBAL_UNDERSTANDING->value => 'FLH-01',
            PrimaryNeed::URGENT_DIFFICULTY->value => 'DIF-03',
            PrimaryNeed::INCREASE_SALES->value => 'COM-06',
            PrimaryNeed::CLARIFY_OFFER->value => 'PRO-05',
            PrimaryNeed::UNDERSTAND_FINANCE->value => 'FIN-07',
            PrimaryNeed::ORGANIZE_BUSINESS->value => 'GOV-08',
            PrimaryNeed::ASSESS_OPPORTUNITY->value => 'OPP-04',
        ];

        $module = $needMapping[$primaryNeed->value] ?? 'FLH-01';

        // Si sujet dominant spécifié, l'utiliser
        if ($dominantTopic && $dominantTopic !== DominantTopic::UNKNOWN) {
            $topicMapping = [
                DominantTopic::PRODUCT->value => 'PRO-05',
                DominantTopic::COMMERCIAL->value => 'COM-06',
                DominantTopic::FINANCE->value => 'FIN-07',
                DominantTopic::GOVERNANCE->value => 'GOV-08',
                DominantTopic::FULL_360->value => '360-09',
            ];

            if (isset($topicMapping[$dominantTopic->value])) {
                $module = $topicMapping[$dominantTopic->value];
            }
        }

        // Vérifier le temps disponible
        if ($timeAvailable === TimeAvailable::SEVEN_TEN_MIN && $module === '360-09') {
            $module = 'FLH-01'; // Flash pour temps court
        }

        return $this->buildRoute(
            module: $module,
            reasonCode: 'need_fit',
            reasonText: "Vos réponses indiquent que votre priorité actuelle semble être: {$primaryNeed->label()}.",
            priority: 9,
            override: false,
        );
    }

    /**
     * Vérifier si un choix direct est cohérent avec les signaux de risque
     */
    public function validateDirectChoice(string $moduleCode, TriageRecord $triage): array
    {
        $riskFlags = $triage->risk_flags ?? [];

        // Cas 1: Opportunité + risque critique
        if ($moduleCode === 'OPP-04' && $triage->hasCriticalRisk()) {
            return [
                'valid' => false,
                'warning' => 'Vos réponses signalent une difficulté à traiter en priorité.',
                'recommended_module' => 'DIF-03',
            ];
        }

        // Cas 2: 360° + difficulté critique
        if ($moduleCode === '360-09' && $triage->hasCriticalRisk()) {
            return [
                'valid' => false,
                'warning' => 'Votre situation semble nécessiter un diagnostic de stabilisation avant une vue complète.',
                'recommended_module' => 'DIF-03',
            ];
        }

        // Cas 3: Commercial + offre floue
        if ($moduleCode === 'COM-06' && $triage->dominant_topic === DominantTopic::PRODUCT) {
            return [
                'valid' => false,
                'warning' => 'Votre difficulté commerciale peut venir d\'une offre insuffisamment claire.',
                'recommended_module' => 'PRO-05',
            ];
        }

        // Cas 4: Financement + pas de viabilité
        if ($moduleCode === 'OPP-04' && $triage->primary_need === PrimaryNeed::PREPARE_FINANCING) {
            return [
                'valid' => false,
                'warning' => "Avant d'évaluer une opportunité de financement, clarifions d'abord la viabilité économique.",
                'recommended_module' => 'FIN-07',
            ];
        }

        return [
            'valid' => true,
            'warning' => null,
            'recommended_module' => null,
        ];
    }

    /**
     * Déterminer le module suivant recommandé après un diagnostic
     */
    public function recommendNextModule(string $currentModule, ScoringResult $scoring): ?string
    {
        $band = $scoring->score_band;
        $hasCritical = $scoring->hasCriticalRedFlag();

        // Routing rules post-diagnostic
        $routing = [
            'FLH-01' => [
                'conditions' => [
                    ['field' => 'score_band', 'value' => 'critical', 'module' => 'DIF-03'],
                ],
                'default' => null, // Dépend du domaine prioritaire
            ],
            'PRJ-02' => [
                'conditions' => [
                    ['field' => 'score_band', 'value' => 'fragile', 'module' => 'PRO-05'],
                ],
                'default' => 'COM-06',
            ],
            'DIF-03' => [
                'conditions' => [
                    ['field' => 'priority_1_code', 'contains' => 'FIN', 'module' => 'FIN-07'],
                    ['field' => 'priority_1_code', 'contains' => 'COM', 'module' => 'COM-06'],
                    ['field' => 'priority_1_code', 'contains' => 'GOV', 'module' => 'GOV-08'],
                ],
                'default' => 'FIN-07',
            ],
            'OPP-04' => [
                'conditions' => [
                    ['field' => 'score_band', 'value' => 'fragile', 'module' => 'PRO-05'],
                    ['field' => 'score_band', 'value' => 'critical', 'module' => 'DIF-03'],
                ],
                'default' => 'FIN-07',
            ],
            'PRO-05' => [
                'default' => 'COM-06',
            ],
            'COM-06' => [
                'default' => 'FIN-07',
            ],
            'FIN-07' => [
                'conditions' => [
                    ['field' => 'score_band', 'value' => 'advanced', 'module' => 'OPP-04'],
                ],
                'default' => 'DIF-03',
            ],
            'GOV-08' => [
                'default' => 'GOV-08', // Approfondissement
            ],
            '360-09' => [
                'default' => null, // Modules ciblés selon axes faibles
            ],
        ];

        $rules = $routing[$currentModule] ?? ['default' => null];

        // Vérifier les conditions
        if (isset($rules['conditions'])) {
            foreach ($rules['conditions'] as $condition) {
                if ($this->checkCondition($scoring, $condition)) {
                    return $condition['module'];
                }
            }
        }

        return $rules['default'] ?? null;
    }

    private function hasAnyFlag(array $flags, array $targetFlags): bool
    {
        return count(array_intersect($flags, $targetFlags)) > 0;
    }

    private function buildRoute(
        string $module,
        string $reasonCode,
        string $reasonText,
        int $priority,
        bool $override
    ): array {
        return [
            'module_code' => $module,
            'reason_code' => $reasonCode,
            'reason_text' => $reasonText,
            'priority' => $priority,
            'override_user_choice' => $override,
        ];
    }

    private function checkCondition(ScoringResult $scoring, array $condition): bool
    {
        $field = $condition['field'];

        if ($field === 'score_band') {
            return $scoring->score_band->value === $condition['value'];
        }

        if ($field === 'priority_1_code') {
            return str_contains($scoring->priority_1_code ?? '', $condition['contains']);
        }

        return false;
    }
}
