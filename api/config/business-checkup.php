<?php

/**
 * Configuration Business Check-up - Powered by FUND.lab
 * 
 * Tous les paramètres métier sont centralisés ici pour permettre
 * à FUND.lab de modifier questions, scores, seuils et recommandations
 * sans redéveloppement technique.
 */

return [
    'version' => env('API_VERSION'),
    /*
    |--------------------------------------------------------------------------
    | Modules disponibles
    |--------------------------------------------------------------------------
    */
    'modules' => [
        'TRI-00' => [
            'code' => 'TRI-00',
            'name' => 'Triage initial',
            'family' => 'orientation',
            'status' => 'mvp',
            'target_duration' => '2–3 min',
            'question_count' => 8,
            'scoring_type' => 'routing',
            'evidence_level' => 'none',
            'output_type' => 'module_recommendation',
        ],
        'FLH-01' => [
            'code' => 'FLH-01',
            'name' => 'Diagnostic flash',
            'family' => 'transversal',
            'status' => 'mvp',
            'target_duration' => '7–10 min',
            'question_count' => 14,
            'scoring_type' => 'priority_dominant',
            'evidence_level' => 'simplified',
            'output_type' => 'flash_result',
        ],
        'PRJ-02' => [
            'code' => 'PRJ-02',
            'name' => 'Diagnostic projet',
            'family' => 'situational',
            'status' => 'mvp',
            'target_duration' => '8–12 min',
            'question_count' => 12,
            'scoring_type' => 'project_readiness',
            'evidence_level' => 'light',
            'output_type' => 'detailed_result',
        ],
        'DIF-03' => [
            'code' => 'DIF-03',
            'name' => 'Diagnostic difficulté / stabilisation',
            'family' => 'situational',
            'status' => 'mvp',
            'target_duration' => '10–15 min',
            'question_count' => 14,
            'scoring_type' => 'urgency_cause',
            'evidence_level' => 'simplified',
            'output_type' => 'detailed_result',
        ],
        'OPP-04' => [
            'code' => 'OPP-04',
            'name' => 'Diagnostic opportunité / P.WIN Light',
            'family' => 'situational',
            'status' => 'mvp',
            'target_duration' => '10–15 min',
            'question_count' => 16,
            'scoring_type' => 'opportunity_maturity',
            'evidence_level' => 'simplified',
            'output_type' => 'detailed_result',
        ],
        'PRO-05' => [
            'code' => 'PRO-05',
            'name' => 'Diagnostic produit / offre',
            'family' => 'functional',
            'status' => 'mvp',
            'target_duration' => '8–15 min',
            'question_count' => 12,
            'scoring_type' => 'offer_maturity',
            'evidence_level' => 'simplified',
            'output_type' => 'detailed_result',
        ],
        'COM-06' => [
            'code' => 'COM-06',
            'name' => 'Diagnostic commercial / accès marché',
            'family' => 'functional',
            'status' => 'mvp',
            'target_duration' => '8–15 min',
            'question_count' => 12,
            'scoring_type' => 'commercial_maturity',
            'evidence_level' => 'simplified',
            'output_type' => 'detailed_result',
        ],
        'FIN-07' => [
            'code' => 'FIN-07',
            'name' => 'Diagnostic finance / viabilité',
            'family' => 'functional',
            'status' => 'mvp',
            'target_duration' => '8–15 min',
            'question_count' => 12,
            'scoring_type' => 'financial_viability',
            'evidence_level' => 'simplified',
            'output_type' => 'detailed_result',
        ],
        'GOV-08' => [
            'code' => 'GOV-08',
            'name' => 'Diagnostic gouvernance / organisation',
            'family' => 'functional',
            'status' => 'mvp',
            'target_duration' => '8–15 min',
            'question_count' => 12,
            'scoring_type' => 'organizational_maturity',
            'evidence_level' => 'simplified',
            'output_type' => 'detailed_result',
        ],
        '360-09' => [
            'code' => '360-09',
            'name' => 'Diagnostic complet 360° simplifié',
            'family' => 'transversal',
            'status' => 'mvp_recommended',
            'target_duration' => '30–45 min',
            'question_count' => 36,
            'scoring_type' => 'global_360',
            'evidence_level' => 'simplified_per_axis',
            'output_type' => 'radar_result',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Familles de modules
    |--------------------------------------------------------------------------
    */
    'module_families' => [
        'orientation' => 'Modules d\'entrée et d\'orientation',
        'transversal' => 'Modules transversaux',
        'situational' => 'Modules situationnels',
        'functional' => 'Modules fonctionnels',
        'expert' => 'Modules experts',
        'signal_only' => 'Signaux de détection MVP',
    ],

    /*
    |--------------------------------------------------------------------------
    | Scoring - Configuration
    |--------------------------------------------------------------------------
    */
    'scoring' => [
        // Échelle interne
        'internal_scale' => [
            'min' => 1.0,
            'max' => 5.0,
        ],

        // Échelle affichée
        'display_scale' => [
            'min' => 0,
            'max' => 100,
        ],

        // Conversion: score_0_100 = ROUND(((score_1_5 - 1) / 4) * 100, 0)
        'conversion_formula' => 'linear',

        // Bandes de résultat
        'bands' => [
            'critical' => ['min' => 0, 'max' => 35, 'label' => 'Point de vigilance prioritaire'],
            'fragile' => ['min' => 36, 'max' => 55, 'label' => 'Base fragile à renforcer'],
            'stable' => ['min' => 56, 'max' => 70, 'label' => 'Base fonctionnelle à structurer'],
            'solid' => ['min' => 71, 'max' => 85, 'label' => 'Base solide à consolider'],
            'advanced' => ['min' => 86, 'max' => 100, 'label' => 'Maturité avancée'],
        ],

        // Facteurs de crédibilité par niveau de preuve
        'evidence_factors' => [
            'E0' => 0.70,  // Déclaratif seul
            'E1' => 0.85,  // Indice concret
            'E2' => 0.95,  // Document disponible
            'E3' => 1.00,  // Donnée vérifiable
        ],

        // Seuils de red flags
        'red_flag_thresholds' => [
            'critical' => 1,  // Au moins 1 red flag critique
            'high' => 2,      // Au moins 2 red flags élevés
            'medium' => 3,    // Au moins 3 red flags moyens
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Routing - Règles de triage et de priorité
    |--------------------------------------------------------------------------
    */
    'routing' => [
        // Hiérarchie de priorité absolue
        'priority_rules' => [
            [
                'priority' => 1,
                'name' => 'RISQUE_CRITIQUE_FINANCE',
                'conditions' => [
                    'risk_flags' => ['cannot_pay_current_expenses', 'supplier_tax_salary_debt_arrears', 'cash_insufficient_continuity'],
                ],
                'route' => 'DIF-03',
                'message' => 'Votre situation semble nécessiter une stabilisation avant toute autre démarche.',
                'override_user_choice' => true,
            ],
            [
                'priority' => 2,
                'name' => 'RISQUE_ELEVE_COMMERCIAL',
                'conditions' => [
                    'risk_flags' => ['sales_strong_decline', 'lost_major_client'],
                ],
                'route' => 'DIF-03',
                'message' => 'Votre priorité semble être la relance commerciale avant la croissance.',
                'override_user_choice' => false,
            ],
            [
                'priority' => 3,
                'name' => 'RISQUE_PRODUCTION_BLOQUEE',
                'conditions' => [
                    'risk_flags' => ['production_delivery_blocked'],
                ],
                'route' => 'DIF-03',
                'message' => 'Votre blocage opérationnel doit être traité en priorité.',
                'override_user_choice' => false,
            ],
            [
                'priority' => 4,
                'name' => 'FINANCEMENT_PREMATURE',
                'conditions' => [
                    'primary_need' => 'prepare_financing',
                    'risk_flags' => ['none'],
                    'financial_signals' => ['margin_unknown', 'cash_not_tracked'],
                ],
                'route' => 'FIN-07',
                'message' => 'Avant d\'évaluer une opportunité de financement, clarifions d\'abord la viabilité économique.',
                'override_user_choice' => true,
            ],
            [
                'priority' => 5,
                'name' => 'PROJET_NON_LANCE',
                'conditions' => [
                    'activity_stage' => 'not_launched',
                ],
                'route' => 'PRJ-02',
                'message' => 'Votre situation correspond à un projet à clarifier.',
                'override_user_choice' => false,
            ],
            [
                'priority' => 6,
                'name' => 'OPPORTUNITE_CLAIRE',
                'conditions' => [
                    'opportunity_type' => ['financing', 'new_market', 'tender_large_account', 'partnership', 'capacity_investment'],
                    'risk_level' => 'none',
                ],
                'route' => 'OPP-04',
                'message' => 'Vérifions si votre entreprise est prête pour cette opportunité.',
                'override_user_choice' => false,
            ],
            [
                'priority' => 7,
                'name' => 'BESOIN_FLOU',
                'conditions' => [
                    'primary_need' => 'unknown_need',
                ],
                'route' => 'FLH-01',
                'message' => 'Commençons par une lecture rapide pour identifier votre priorité.',
                'override_user_choice' => false,
            ],
            [
                'priority' => 8,
                'name' => 'PME_STRUCTUREE_GLOBAL',
                'conditions' => [
                    'user_profile' => 'structured_sme',
                    'time_available' => '30_45_min',
                    'risk_level' => 'none',
                ],
                'route' => '360-09',
                'message' => 'Vous souhaitez une vue globale de votre entreprise.',
                'override_user_choice' => false,
            ],
        ],

        // Mapping besoin principal → module
        'need_to_module' => [
            'clarify_project' => 'PRJ-02',
            'global_understanding' => 'FLH-01',
            'urgent_difficulty' => 'DIF-03',
            'increase_sales' => 'COM-06',
            'clarify_offer' => 'PRO-05',
            'understand_finance' => 'FIN-07',
            'organize_business' => 'GOV-08',
            'assess_opportunity' => 'OPP-04',
            'prepare_financing' => 'FIN-07', // Vérification finance avant opportunité
            'unknown_need' => 'FLH-01',
        ],

        // Mapping sujet dominant → module
        'topic_to_module' => [
            'product' => 'PRO-05',
            'commercial' => 'COM-06',
            'finance' => 'FIN-07',
            'governance' => 'GOV-08',
            'hr' => 'signal', // V1
            'operations' => 'signal', // V1
            'digital' => 'signal', // V1
            'formalization' => 'signal', // V1
            'full_360' => '360-09',
            'unknown' => 'FLH-01',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Restitution - Messages et templates
    |--------------------------------------------------------------------------
    */
    'restitution' => [
        'max_strengths' => 3,
        'max_weaknesses' => 3,
        'max_priorities' => 3,

        'disclaimer' => 'Ce diagnostic est indicatif. Il ne remplace pas une analyse approfondie. Les recommandations sont proposées à partir des informations renseignées.',

        'disclaimer_financing' => 'Ce diagnostic ne constitue pas une validation d\'éligibilité à un financement.',

        'tone_guardrails' => [
            'never_promise_financing' => true,
            'never_use_failure_language' => true,
            'always_contextualize' => true,
            'always_propose_action' => true,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Données - Configuration
    |--------------------------------------------------------------------------
    */
    'data' => [
        'default_currency' => 'XOF',
        'default_country' => 'BJ',
        'default_language' => 'fr',
        'date_format' => 'ISO_8601',
        'id_format' => 'UUID',
        'field_format' => 'snake_case',

        'sectors' => [
            'agriculture_livestock' => 'Agriculture / élevage',
            'agro_processing' => 'Agro-transformation',
            'commerce_distribution' => 'Commerce / distribution',
            'services' => 'Services',
            'industry_manufacturing' => 'Industrie / fabrication',
            'digital_technology' => 'Numérique / technologie',
            'crafts' => 'Artisanat',
            'transport_logistics' => 'Transport / logistique',
            'tourism_hospitality' => 'Tourisme / hôtellerie / restauration',
            'health' => 'Santé',
            'education_training' => 'Éducation / formation',
            'construction_real_estate' => 'BTP / immobilier',
            'other' => 'Autre',
        ],

        'regions_benin' => [
            'alibori' => 'Alibori',
            'atacora' => 'Atacora',
            'atlantique' => 'Atlantique',
            'borgou' => 'Borgou',
            'collines' => 'Collines',
            'couffo' => 'Couffo',
            'donga' => 'Donga',
            'littoral' => 'Littoral',
            'mono' => 'Mono',
            'oueme' => 'Ouémé',
            'plateau' => 'Plateau',
            'zou' => 'Zou',
        ],

        'communes' => [
            //alibori
            'Banikoara',
            'Gogounou',
            'Kandi',
            'Karimama',
            'Malanville',
            'Segbana',

            //atacora
            'Boukoumbé',
            'Cobly',
            'Kérou',
            'Kouandé',
            'Matéri',
            'Natitingou',
            'Péhunco',
            'Tanguiéta',
            'Toucountouna',

            //atlantique
            'Abomey-Calavi',
            'Allada',
            'Kpomassè',
            'Ouidah',
            'Sô-Ava',
            'Toffo',
            'Tori-Bossito',
            'Zè',

            // Borgou
            'Bembéréké',
            'Kalalé',
            'N\'Dali',
            'Nikki',
            'Parakou',
            'Pèrèrè',
            'Sinendé',
            'Tchaourou',

            //Collines
            'Bantè',
            'Dassa-Zoumé',
            'Glazoué',
            'Ouèssè',
            'Savalou',
            'Savè',

            // Couffo
            'Aplahoué',
            'Djakotomey',
            'Dogbo',
            'Klouékanmè',
            'Lalo',
            'Toviklin',

            // Donga
            'Bassila',
            'Copargo',
            'Djougou',
            'Ouaké',

            // Littoral
            'Cotonou',

            // Mono
            'Athiémé',
            'Bopa',
            'Comè',
            'Grand-Popo',
            'Houéyogbé',
            'Lokossa',

            // Ouémé
            'Adjarra',
            'Adjohoun',
            'Aguégués',
            'Akpro-Missérété',
            'Avrankou',
            'Bonou',
            'Dangbo',
            'Porto-Novo',
            'Sèmè-Kpodji',

            // Plateau
            'Adja-Ouèrè',
            'Ifangni',
            'Kétou',
            'Pobè',
            'Sakété',

            // Zou
            'Abomey',
            'Agbangnizoun',
            'Bohicon',
            'Covè',
            'Djidja',
            'Ouinhi',
            'Za-Kpota',
            'Zagnanado',
            'Zogbodomey'


        ]
    ],

    /*
    |--------------------------------------------------------------------------
    | Sécurité et conformité
    |--------------------------------------------------------------------------
    */
    'security' => [
        'consent_required' => true,
        'max_questions_per_screen' => 2,
        'auto_save_interval' => 1, // questions
        'session_timeout' => 3600, // secondes
        'pdf_ttl' => 86400, // 24h
        'rate_limit' => [
            'diagnostics_per_hour' => 10,
            'downloads_per_hour' => 5,
        ],
    ],

    'appointments' => [
        'weekdays'      => [1, 2, 3, 4, 5],   // lundi → vendredi
        'start_hour'    => 9,                  // premier créneau : 9h
        'end_hour'      => 17,                 // dernier créneau se termine à 17h
        'slot_duration' => 45,                 // minutes
        'days_ahead'    => 14,                 // nombre de jours ouverts à la réservation
    ],


    'answer_ai' => [
        'endpoint' => env('ANSWER_AI_ENDPOINT', 'https://n8n.sylfleur.com/webhook/bcu/ai-classification/open-answers'),
    ],

    // config/mail.php — ajouter à la fin du tableau
    'c&' => env('CONTACT_RECIPIENT_EMAIL', 'nicktep519@gmail.com'),
];
