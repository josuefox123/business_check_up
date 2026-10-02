<?php

namespace App\Services;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\File;

class ReportPdfService
{
    /**
     * Generate the 3-page business checkup PDF document in background and return absolute file path.
     *
     * @param array $data Data to inject into the report views
     * @return string Absolute file path to the generated PDF file
     */
    public function getDefaultData(array $data = []): array
    {
        return [
            'client_name' => $data['entreprise']['nom'] ?? $data['client_name'] ?? 'ASSIRI VAL GROUP',
            'contact_name' => $data['contact_name'] ?? 'ADJIBADE Aboudou Latif',
            'sector' => $data['entreprise']['secteur'] ?? $data['sector'] ?? 'Agro-transformation',
            'region' => $data['entreprise']['zone'] ?? $data['region'] ?? 'Borgou',
            'date' => $data['date_diagnostic'] ?? $data['date'] ?? '03/08/2026',
            'module_libelle' => $data['module']['libelle'] ?? $data['module_libelle'] ?? 'Diagnostic de Difficulté',
            'reference' => $data['reference'] ?? 'e2084107-e528-4b13-9e0c-5c3e0a0a42d4',
            
            // --- PAGE 2 : LECTURE ET DIAGNOSTIC ---
            'global_score' => $data['global_score'] ?? 20,
            'proof_level' => $data['proof_level'] ?? 'Faible',
            'proof_description' => $data['proof_description'] ?? "Les informations reposent sur les déclarations de l'entreprise. Les preuves documentaires (cahier de caisse, relevés bancaires) n'ont pas été vérifiées, ce qui limite la confirmation de l'ampleur exacte du risque.",
            
            // NOUVEAU : Bloc "Ce que cela signifie"
            'meaning_text' => $data['meaning_text'] ?? 'Situation de tension de trésorerie critique caractérisée par des retards de paiement accumulés. La priorité absolue est de stabiliser le besoin de liquidités avant d\'envisager un endettement supplémentaire.',
            
            // NOUVEAU : Encadré de priorité de lecture
            'priority_callout' => $data['priority_callout'] ?? 'Traiter l\'urgence de trésorerie et clarifier les causes profondes avant d\'engager toute recherche de financement externe.',
            
            'lecture_generale' => $data['lecture_generale'] ?? 'L\'entreprise est confrontée à des difficultés de trésorerie critiques, se manifestant par des retards de paiement multiples (fournisseurs, salaires, impôts, loyer). Bien qu\'elle déclare pouvoir maintenir ses activités pendant 30 jours et disposer de 350 000 FCFA en trésorerie, ces affirmations ne sont pas vérifiées. La hausse des coûts et une légère baisse des ventes sont identifiées comme des facteurs aggravants. La perception qu\'un financement seul résoudrait le problème est un signal d\'alerte, suggérant que les causes structurelles ne sont pas pleinement appréhendées. La preuve de la difficulté principale est jugée faible, reposant sur des documents non vérifiés. Une intervention rapide est nécessaire pour stabiliser la situation et analyser les causes profondes.',
            
            'strengths' => $data['strengths'] ?? [
                'Prise de conscience du dirigeant sur la tension de trésorerie prioritaire.',
                'Proactivité démontrée par des premières actions de négociation et de réduction de charges.'
            ],
            
            'vigilances' => $data['vigilances'] ?? [
                'Retards de paiement multiples (fournisseurs, salaires, loyer, fiscalité) créant un risque immédiat d\'interruption d\'activité.',
                'Perception du financement comme solution unique, pouvant masquer un problème sous-jacent de rentabilité ou de marge.',
                'Niveau de preuve faible reposant sur des pièces non vérifiées.'
            ],
            
            'limiting_factors' => $data['limiting_factors'] ?? 'Les données financières, la trésorerie disponible et les délais déclarés sont purement déclaratifs. Ce diagnostic ne constitue pas un audit d\'insolvabilité ni un conseil juridique.',
            
            'scores_by_axis' => collect($data['scores_by_axis'] ?? [
                'Lisibilité'          => ['score' => 68, 'target' => 100],
                'Résilience cash'     => ['score' => 55, 'target' => 100],
                'Préparation décision'=> ['score' => 61, 'target' => 100],
            ])->mapWithKeys(function ($item, $key) {
                $score = $item['score'] ?? 0;
                $score100 = $score <= 5 ? round(($score / 5) * 100) : round($score);
                
                if ($score100 >= 65) {
                    $color = '#148f99'; // Teal
                } elseif ($score100 >= 55) {
                    $color = '#b87a2a'; // Orange
                } else {
                    $color = '#1a2634'; // Dark / Navy
                }

                return [$key => [
                    'score' => $score100,
                    'color' => $color,
                ]];
            })->toArray(),

            // --- PAGE 3 : DÉCISION ET ARBITRAGE ---
            
            // NOUVEAU : Bloc Arbitrage Central
            'arbitrage_title' => $data['arbitrage_title'] ?? 'Restructurer et négocier l\'existant avant tout nouvel endettement',
            'arbitrage_text' => $data['arbitrage_text'] ?? 'Injecter un nouveau financement dans la situation actuelle risquerait d\'être immédiatement absorbé par les dettes accumulées sans résoudre les pertes d\'exploitation. L\'arbitrage prioritaire consiste à négocier un échelonnement et à rétablir la marge brute.',
            'arbitrage_tags' => $data['arbitrage_tags'] ?? ['Urgence Trésorerie', 'Négociation Créanciers', 'Audit de Rentabilité'],

            // Plan d'action (3 priorités)
            'priorities' => $data['priorities'] ?? [
                [
                    'num'      => '1',
                    'type'     => 'Sécuriser',
                    'title'    => 'Sécuriser la trésorerie et geler les tensions immédiates',
                    'subtitle' => 'Prévenir les risques d\'interruption d\'activité liés aux retards de paiement.',
                    'actions'  => [
                        'Établir l\'échéancier exact des dettes urgentes (fournisseurs, salaires, loyers).',
                        'Négocier des plans de rééchelonnement avec les créanciers clés.'
                    ],
                    'proofs'   => 'Attestations de créances et relevés bancaires des 3 derniers mois'
                ],
                [
                    'num'      => '2',
                    'type'     => 'Diagnostiquer',
                    'title'    => 'Diagnostiquer la rentabilité réelle et la structure des coûts',
                    'subtitle' => 'Vérifier si les difficultés proviennent de la marge ou du seul besoin en fonds de roulement.',
                    'actions'  => [
                        'Calculer la marge brute par produit/service.',
                        'Identifier les postes de charges fixes ayant augmenté récemment.'
                    ],
                    'proofs'   => 'Fiches de calcul de coût de revient et factures d\'achats récents'
                ],
                [
                    'num'      => '3',
                    'type'     => 'Prioriser',
                    'title'    => 'Reconstruire un plan de trésorerie prévisionnel à 12 semaines',
                    'subtitle' => 'Piloter les décaissements au fil de l\'eau sur des bases réelles.',
                    'actions'  => [
                        'Suivre de façon hebdomadaire les entrées et sorties réelles.',
                        'Activer les levier de relance clients sur les créances anciennes.'
                    ],
                    'proofs'   => 'Grand livre clients à jour et état du portefeuille de commandes'
                ]
            ],

            // NOUVEAU : Bloc "À ne pas faire maintenant"
            'dont_do_title' => $data['dont_do_title'] ?? 'Ne pas souscrire de dette à court terme à taux élevé',
            'dont_do_text'  => $data['dont_do_text'] ?? 'Éviter d\'engager de nouvelles dépenses de développement ou d\'accepter des financements d\'urgence coûteux tant que les flux de trésorerie d\'exploitation ne sont pas équilibrés.',

            // NOUVEAU : Prochaine étape et À retenir
            'next_step_title' => $data['recommended_next_step_title'] ?? 'Diagnostic Finance / Viabilité',
            'next_step_text' => $data['recommended_next_step'] ?? 'Poursuivre avec le module Diagnostic finance/viabilité pour une analyse approfondie des options de financement et une structuration des besoins, en intégrant les résultats de ce diagnostic pour une approche globale et durable',
            'takeaways_text' => $data['takeaways_text'] ?? 'La priorité n\'est pas la recherche immédiate de fonds, mais la négociation des dettes et le rétablissement d\'une marge opérationnelle positive.',
        ];
    }

    /**
     * Generate PDF stream specifically for the new preview template (preview_new) using DomPDF (no Chromium required).
     *
     * @param array $data
     * @return \Barryvdh\DomPDF\PDF
     */
    public function generatePreviewNewPdf(array $data = []): \Barryvdh\DomPDF\PDF
    {
        $defaultData = $this->getDefaultData($data);
        $defaultData['isPdf'] = true;

        $pdf = Pdf::loadView('preview_new', $defaultData);
        $pdf->setPaper('a4', 'portrait');
        $pdf->setOption('isHtml5ParserEnabled', true);
        $pdf->setOption('isRemoteEnabled', true);

        return $pdf;
    }

    public function generateFile(array $data = []): string
    {
        $defaultData = $this->getDefaultData($data);

        $htmlContent = view('template_mail.master_pdf', $defaultData)->render();
        
        $tempDir = storage_path('app/pdf_temp');
        if (!File::exists($tempDir)) {
            File::makeDirectory($tempDir, 0755, true);
        }

        $uniq = uniqid();
        $htmlFile = $tempDir . '/report_' . $uniq . '.html';
        $pdfFile = $tempDir . '/report_' . $uniq . '.pdf';

        File::put($htmlFile, $htmlContent);

        $chromeBinary = $this->getBrowserBinary();

        if ($chromeBinary) {
            $command = sprintf(
                '"%s" --headless --disable-gpu --no-sandbox --print-to-pdf="%s" "%s" 2>&1',
                $chromeBinary,
                $pdfFile,
                $htmlFile
            );

            exec($command, $output, $returnVar);

            if ($returnVar === 0 && File::exists($pdfFile) && File::size($pdfFile) > 0) {
                File::delete($htmlFile);
                return $pdfFile;
            }
        }

        $pdf = Pdf::loadView('template_mail.master_pdf', $defaultData);
        $pdf->setPaper('a4', 'portrait');
        $pdf->setOption('isHtml5ParserEnabled', true);
        $pdf->setOption('isRemoteEnabled', true);
        
        $pdf->save($pdfFile);
        File::delete($htmlFile);

        return $pdfFile;
    }

    /**
     * Generate 3-page PDF stream for email attachments or HTTP download
     *
     * @param array $data
     * @return \Barryvdh\DomPDF\PDF
     */
    public function generate(array $data = []): \Barryvdh\DomPDF\PDF
    {
        // $defaultData = [
        //     'client_name' => $data['entreprise']['nom'] ?? $data['client_name'] ?? 'ASSIRI VAL GROUP',
        //     'sector' => $data['entreprise']['secteur']  ?? $data['sector'] ?? 'Agro-transformation',
        //     'region' => $data['entreprise']['zone'] ?? $data['region'] ?? 'Borgou',
        //     'date' => $data['date_diagnostic'] ?? $data['date'] ?? '03/08/2026',
        //     'module_libelle' => $data['module']['libelle'] ?? $data['module_libelle'] ?? 'Diagnostic Finance / Viabilité',
        //     'reference' => $data['reference'] ?? 'e2084107-e528-4b13-9e0c-5c3e0a0a42d4',
        //     'lecture_generale' => $data['lecture_generale'] ?? 'L\'entreprise est confrontée à des difficultés de trésorerie critiques, se manifestant par des retards de paiement multiples (fournisseurs, salaires, impôts, loyer). Bien qu\'elle déclare pouvoir maintenir ses activités pendant 30 jours et disposer de 350 000 en trésorerie, ces affirmations ne sont pas vérifiées. La hausse des coûts et une légère baisse des ventes sont identifiées comme des facteurs aggravants. La perception qu\'un financement seul résoudrait le problème est un signal d\'alerte, suggérant que les causes structurelles ne sont pas pleinement appréhendées. La preuve de la difficulté principale est jugée faible, reposant sur des documents non vérifiés. Une intervention rapide est nécessaire pour stabiliser la situation et analyser les causes profondes.',
        //     'global_score' => $data['global_score'] ?? 20,
        //     'scores_by_axis' => $data['scores_by_axis'] ?? [
        //         'Finance & Viabilité'    => ['score' => 2.5, 'target' => 4.5],
        //         'Opérations & Exécution' => ['score' => 3.8, 'target' => 4.2],
        //         'Ressources Humaines'    => ['score' => 0.0, 'target' => 4.0],
        //     ],
        //     'priorites_immediates' => $data['priorites_immediates'] ?? [
        //         'SÉCURISER la trésorerie et les paiements urgents',
        //         'DIAGNOSTIQUER les causes profondes de la difficulté de trésorerie',
        //         'PRIORISER les leviers d\'action structurels et opérationnels',
        //     ],
        //     'proof_level' => $data['proof_level'] ?? 'Faible',
        //     'proof_description' => $data['proof_description'] ?? 'Les informations sont basées sur les déclarations de l\'entreprise. Les preuves documentaires mentionnées (cahier de caisse/ventes, relevés bancaires) n\'ont pas été fournies ni vérifiées, ce qui limite la confirmation des difficultés critiques.',
        //     'strengths' => $data['strengths'] ?? [
        //         'Le dirigeant reconnaît l\'existence d\'une difficulté prioritaire liée à la trésorerie.',
        //         'L\'entreprise a déjà entrepris plusieurs actions pour tenter de corriger la situation, démontrant une proactivité.'
        //     ],
        //     'vigilances' => $data['vigilances'] ?? [
        //         'L\'entreprise présente des retards de paiement multiples (fournisseurs, salaires, impôts/taxes, loyer), indiquant une tension de trésorerie sévère et un risque de rupture d\'activité.',
        //         'Le dirigeant considère qu\'un financement seul réglerait complètement le problème, ce qui peut masquer des causes plus profondes et structurelles, comme la rentabilité ou la gestion des coûts.',
        //         'La preuve de la difficulté principale est faible, reposant sur des documents non vérifiés, ce qui rend difficile une évaluation précise de l\'ampleur et de la nature réelle du problème.'
        //     ],
        //     'limiting_factors' => $data['limiting_factors'] ?? 'Les informations concernant la capacité à continuer les activités, le montant de trésorerie disponible, les actions déjà tentées et les marges de manœuvre sont déclarées par l\'utilisateur et n\'ont pas été vérifiées par des preuves documentaires. Le diagnostic ne peut pas conclure à l\'insolvabilité de l\'entreprise et aucun conseil juridique n\'est fourni.',
        //     'key_factors' => $data['key_factors'] ?? [
        //         ['title' => 'Trésorerie critique et retards de paiement', 'description' => 'La difficulté principale déclarée est la trésorerie, confirmée par des retards de paiement multiples (fournisseurs, salaires, impôts/taxes, loyer). Cette situation est exacerbée par une hausse des coûts et une légère baisse des ventes.'],
        //         ['title' => 'Perception du financement comme solution unique', 'description' => 'Le dirigeant estime qu\'un financement seul résoudrait complètement le problème, ce qui peut masquer des problèmes structurels sous-jacents liés à la rentabilité ou à la gestion des coûts, et détourner l\'attention d\'autres leviers d\'action.'],
        //         ['title' => 'Preuve faible de la difficulté principale', 'description' => 'La confirmation de la difficulté principale repose sur des documents non vérifiés (cahier de caisse/ventes, relevés bancaires), ce qui limite la capacité à évaluer précisément la gravité et la nature exacte de la situation.'],
        //     ],
        //     'priorities' => $data['priorities'] ?? [
        //         [
        //             'num' => '1',
        //             'type' => 'Securiser',
        //             'title' => 'SÉCURISER la trésorerie et les paiements urgents',
        //             'subtitle' => 'Les retards de paiement multiples signalent une urgence absolue et un risque élevé de rupture d\'activité.',
        //             'actions' => [
        //                 'Évaluer précisément la situation de trésorerie actuelle et les besoins immédiats pour couvrir les charges urgentes.',
        //                 'Négocier activement avec les créanciers (fournisseurs, bailleur, administration fiscale) pour obtenir des délais de paiement ou des échelonnements.',
        //                 'Identifier et activer rapidement les encaissements clients proches et les stocks vendables pour générer des liquidités immédiates.'
        //             ],
        //             'proofs' => 'Déclaration de retards de paiement multiples (fournisseurs, salaires, impôts/taxes, loyer) et de la trésorerie comme difficulté principale.'
        //         ],
        //         [
        //             'num' => '2',
        //             'type' => 'Diagnostiquer',
        //             'title' => 'DIAGNOSTIQUER les causes profondes de la difficulté de trésorerie',
        //             'subtitle' => 'La perception qu\'un financement seul résoudrait le problème, combinée à une preuve faible de la difficulté critique, suggère que les causes réelles ne sont pas pleinement comprises.',
        //             'actions' => [
        //                 'Analyser en détail la structure des coûts pour identifier les postes de dépenses excessifs ou non essentiels.',
        //                 'Évaluer la rentabilité des produits ou services pour déterminer si les prix sont trop bas ou les marges insuffisantes.',
        //                 'Confirmer les données financières par des documents vérifiés (relevés bancaires, grands livres) pour établir un diagnostic fiable de la situation.'
        //             ],
        //             'proofs' => 'Déclaration que le financement est perçu comme solution unique, preuve faible de la difficulté critique, baisse des ventes et hausse des coûts déclarées.'
        //         ],
        //         [
        //             'num' => '3',
        //             'type' => 'Prioriser',
        //             'title' => 'PRIORISER les leviers d\'action structurels et opérationnels',
        //             'subtitle' => 'Après avoir sécurisé l\'urgence et diagnostiqué les causes, il est crucial de mettre en œuvre des actions durables au-delà du simple financement.',
        //             'actions' => [
        //                 'Définir un plan d\'action combinant des mesures de court terme (gestion des paiements) et de moyen terme (amélioration de la rentabilité, recherche de nouveaux marchés).',
        //                 'Explorer les marges de manœuvre déclarées (réduction temporaire de charges, apport des associés, actifs non essentiels) pour renforcer la trésorerie sans dépendre uniquement d\'un financement externe.',
        //                 'Évaluer la pertinence de l\'orientation vers de nouveaux marchés comme action prioritaire, en la confrontant aux capacités actuelles et à la situation de trésorerie.'
        //             ],
        //             'proofs' => 'Actions déjà tentées (réduction charges, relance clients, négociation dettes), marges de manœuvre mobilisables déclarées et action prioritaire déclarée (nouveaux marchés).'
        //         ]
        //     ],
        //     'recommended_next_step' => $data['recommended_next_step'] ?? 'Il est recommandé de poursuivre avec le module Diagnostic finance / viabilité pour une analyse approfondie des options de financement et une structuration des besoins, en intégrant les résultats de ce diagnostic pour une approche globale et durable.',
        //     'expert_exchange_text' => $data['expert_exchange_text'] ?? 'L\'entreprise exprime un besoin d\'appui personnalisé et a déjà exploré diverses pistes, y compris la recherche de financement. L\'expert peut l\'aider à valider les données déclarées, à affiner le diagnostic des causes profondes, et à structurer un plan d\'action combinant les leviers opérationnels et financiers. L\'orientation vers FIN-07 est pertinente pour aborder la question du financement de manière éclairée, en s\'assurant que les problèmes structurels sont également traités.',
        // ];
        $defaultData = $this->getDefaultData($data);

        $pdf = Pdf::loadView('template_mail.master_pdf', $defaultData);
        $pdf->setPaper('a4', 'portrait');
        $pdf->setOption('isHtml5ParserEnabled', true);
        $pdf->setOption('isRemoteEnabled', true);

        return $pdf;
    }

    /**
     * Detect Chrome or Edge executable location across Windows and Linux.
     *
     * @return string|null
     */
    protected function getBrowserBinary(): ?string
    {
        $paths = [
            'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
            'C:\Program Files\Microsoft\Edge\Application\msedge.exe',
            'C:\Program Files\Google\Chrome\Application\chrome.exe',
            'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',
            '/usr/bin/google-chrome',
            '/usr/bin/chromium-browser',
            '/usr/bin/chromium',
        ];

        foreach ($paths as $path) {
            if (File::exists($path)) {
                return $path;
            }
        }

        return null;
    }
}
