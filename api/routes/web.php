<?php


use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

Route::get('/', function () {



    // --- 1. Récupération de l'ID et du payload depuis ton JSON ---
    // $diagnosticRunId = 'cebaf5aa-030a-485f-b0ee-1e904350ea7d';

    // $reportPayload = [
    //     'reference'              => 'f8e33b06-819d-404f-8b12-9f393aac1af4',
    //     'date_diagnostic'        => '2026-07-28T11:19:26.000000Z',
    //     'entreprise'             => [
    //         'nom'     => 'Non renseigné',
    //         'secteur' => 'Agriculture / élevage',
    //         'zone'    => 'Littoral',
    //     ],
    //     'module' => [
    //         'code'    => '360-09',
    //         'libelle' => 'Libellé officiel à confirmer — 360-09',
    //     ],
    //     'global_score'           => 51,
    //     'lecture_generale'       => "L'entreprise, opérant dans le secteur de l'Agriculture / élevage sur le Littoral, se trouve dans une phase de stabilisation avec un score global de 51, jugé \"fragile\". Un risque de liquidité est identifié comme un point de vigilance majeur. Malgré une bonne organisation interne et une excellente réputation, l'ambition d'accéder à un nouveau marché est freinée par une connaissance insuffisante de ce dernier et des défis commerciaux. La prudence financière est un arbitrage difficile face aux objectifs de croissance.",
    //     'priorites_immediates'   => [
    //         "Sécuriser la trésorerie et la liquidité de l'entreprise.",
    //         "Approfondir la connaissance du marché et le potentiel commercial.",
    //         "Renforcer le positionnement concurrentiel de l'offre.",
    //     ],
    //     'proof_level'            => 'Non renseigné',
    //     'proof_description'      => "Les conclusions de cette analyse reposent sur les réponses déclaratives de l'entreprise. Cinq déclarations clés n'ont pas été corroborées par des preuves documentées et sont donc considérées comme non confirmées. Les scores par axe n'étant pas disponibles, l'analyse détaillée par domaine est limitée. Le nom de l'entreprise n'a pas été renseigné.",
    //     'scores_by_axis'         => [],
    //     'strengths'              => [
    //         "L'entreprise dispose d'une routine régulière et suivie pour attirer et suivre de nouveaux clients.",
    //         "Les rôles et responsabilités des personnes clés sont clairement répartis et connus.",
    //         "Il existe une routine au moins mensuelle et structurée pour suivre ventes, trésorerie, opérations et décisions.",
    //         "L'entreprise crée de la valeur territoriale, sociale ou environnementale par des emplois locaux et des revenus pour les producteurs/fournisseurs.",
    //         "L'entreprise a un point fort social ou environnemental reconnu, documenté et mesuré.",
    //         "Il n'y a pas de risque négatif ou social/environnemental significatif identifié à mieux maîtriser.",
    //         "Le positionnement de l'entreprise est très cohérent et compris de la même manière par les clients, l’équipe et les partenaires.",
    //         "L'offre principale est rentable et régulièrement livrée avec la qualité et les délais promis.",
    //         "Les clients actuels recommandent très souvent l'entreprise spontanément à leur entourage, ce qui est un moteur pour l'entreprise.",
    //         "L'entreprise n'a pas d'avis négatifs visibles en ligne et jouit d'une excellente réputation (4.5+ étoiles).",
    //     ],
    //     'vigilances'             => [
    //         "La trésorerie disponible ne couvre que partiellement les charges essentielles des 30 prochains jours, ce qui indique un risque de liquidité.",
    //         "L'entreprise ne connaît pas la taille ou la profondeur de son marché accessible, indiquant une demande insuffisante.",
    //         "La différence qui fait choisir l'entreprise par un client est claire mais facilement imitable ou peu prouvée.",
    //         "L'avantage concurrentiel de l'entreprise resterait pertinent si un concurrent baissait ses prix ou copiait l'offre, mais avec adaptation.",
    //     ],
    //     'limiting_factors'       => "Le nom de l'entreprise n'a pas été renseigné. Cinq déclarations clés de l'utilisateur n'ont pas pu être vérifiées par des preuves documentées dans le run, elles sont donc considérées comme déclarées mais non confirmées. Les scores par axe ne sont pas disponibles, ce qui limite l'analyse détaillée des performances par domaine.",
    //     'key_factors'            => [
    //         [
    //             'title'       => 'Risque de liquidité',
    //             'description' => "La trésorerie disponible ne couvre que partiellement les charges essentielles des 30 prochains jours, ce qui constitue un risque financier majeur et rend difficile l'arbitrage entre croissance et prudence financière.",
    //         ],
    //         [
    //             'title'       => 'Connaissance du marché et potentiel commercial',
    //             'description' => "L'entreprise souhaite accéder à un nouveau marché, mais ne connaît pas la taille ou la profondeur de son marché accessible. Les ventes sont identifiées comme un axe faible, ce qui pourrait freiner l'expansion.",
    //         ],
    //         [
    //             'title'       => 'Positionnement concurrentiel',
    //             'description' => "Bien que le positionnement soit clair et cohérent, l'avantage concurrentiel est jugé facilement imitable ou peu prouvé, nécessitant une adaptation face à la concurrence.",
    //         ],
    //     ],
    //     'priorities'             => [
    //         [
    //             'num'      => '1',
    //             'type'     => 'Financier',
    //             'title'    => "Sécuriser la trésorerie et la liquidité de l'entreprise",
    //             'subtitle' => "Le risque de liquidité est une menace directe pour la pérennité de l'entreprise et entrave les ambitions de stabilisation et de croissance.",
    //             'actions'  => [
    //                 'Établir un prévisionnel de trésorerie détaillé sur 3 à 6 mois pour anticiper les besoins.',
    //                 'Identifier et mettre en œuvre des actions rapides pour optimiser les flux de trésorerie (ex: recouvrement clients, gestion des stocks).',
    //                 'Évaluer les options de financement court terme pour renforcer la liquidité et couvrir les charges essentielles.',
    //             ],
    //             'proofs'   => "La trésorerie disponible ne couvre que partiellement les charges essentielles des 30 prochains jours (AXE_FIN_RISQUE_LIQUIDITE).",
    //         ],
    //         [
    //             'num'      => '2',
    //             'type'     => 'Commercial',
    //             'title'    => 'Approfondir la connaissance du marché et le potentiel commercial',
    //             'subtitle' => "Pour soutenir l'ambition d'accéder à un nouveau marché, il est crucial de mieux comprendre la demande et le potentiel de croissance.",
    //             'actions'  => [
    //                 'Réaliser une étude de marché approfondie pour évaluer la taille et la profondeur du marché cible.',
    //                 'Analyser les performances commerciales actuelles pour identifier les leviers d\'amélioration des ventes.',
    //                 'Définir des objectifs commerciaux clairs et mesurables pour le nouveau marché, en lien avec les capacités de l\'entreprise.',
    //             ],
    //             'proofs'   => "L'entreprise ne connaît pas la taille ou la profondeur de son marché accessible (demande insuffisante). Les ventes sont déclarées comme un axe faible.",
    //         ],
    //         [
    //             'num'      => '3',
    //             'type'     => 'Stratégique',
    //             'title'    => 'Renforcer le positionnement concurrentiel de l\'offre',
    //             'subtitle' => 'Un positionnement plus robuste est essentiel pour se différencier durablement et soutenir l\'expansion sur de nouveaux marchés.',
    //             'actions'  => [
    //                 'Identifier les éléments différenciateurs uniques de l\'offre qui sont difficiles à imiter par les concurrents.',
    //                 'Développer une proposition de valeur claire et prouvable, communiquée de manière cohérente à toutes les parties prenantes.',
    //                 'Anticiper les réactions des concurrents et préparer des stratégies d\'adaptation pour maintenir l\'avantage concurrentiel.',
    //             ],
    //             'proofs'   => "La différence qui fait choisir l'entreprise est claire mais facilement imitable ou peu prouvée. L'avantage concurrentiel resterait pertinent avec adaptation si un concurrent baissait ses prix ou copiait l'offre.",
    //         ],
    //     ],
    //     'recommended_next_step'  => "Il est recommandé de poursuivre l'accompagnement en approfondissant la gouvernance et l'organisation, l'impact et l'ancrage local, le potentiel marché, le positionnement concurrentiel, le produit et l'offre, ainsi que la visibilité digitale et l'image de marque, comme souhaité par l'entreprise, afin de consolider sa stabilisation et soutenir son accès à de nouveaux marchés.",
    //     'expert_exchange_text'   => "L'entreprise exprime un besoin d'approfondissement sur plusieurs axes (gouvernance, impact, marché, positionnement, produit, visibilité), ce qui est cohérent avec sa phase de stabilisation et son ambition d'accéder à un nouveau marché. Ces enrichissements permettront de structurer les actions nécessaires pour sécuriser la trésorerie et renforcer le positionnement, en particulier face à un avantage concurrentiel jugé imitable. L'accompagnement devra capitaliser sur les forces existantes, notamment la bonne réputation et l'organisation interne, pour transformer les vigilances en opportunités de croissance.",
    // ];

    // --- 2. Envoi POST ---
    // $url = "https://business-chekcup.nicktep.com/api/diagnostics/{$diagnosticRunId}/send-report";

    // try {
    //     $response = Http::withHeaders([
    //         'Accept'       => 'application/json',
    //         'Content-Type' => 'application/json',
    //     ])->post($url, $reportPayload);

    //     if ($response->successful()) {
    //         Log::info('Report envoyé avec succès.', [
    //             'status' => $response->status(),
    //             'body'   => $response->json(),
    //         ]);

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Report envoyé avec succès.',
    //             'api_response' => $response->json(),
    //         ]);
    //     }

    //     // Gestion des erreurs HTTP 4xx / 5xx
    //     Log::error('Échec de l\'envoi du report.', [
    //         'status' => $response->status(),
    //         'body'   => $response->body(),
    //     ]);

    //     return response()->json([
    //         'success' => false,
    //         'message' => 'Le serveur a répondu avec une erreur.',
    //         'http_status' => $response->status(),
    //         'error_body'  => $response->json() ?? $response->body(),
    //     ], $response->status());
    // } catch (\Illuminate\Http\Client\ConnectionException $e) {
    //     // Serveur injoignable (localhost éteint, mauvaise URL, etc.)
    //     Log::error('Connexion impossible à l\'API locale.', ['error' => $e->getMessage()]);

    //     return response()->json([
    //         'success' => false,
    //         'message' => 'Impossible de joindre le serveur local.',
    //         'error'   => $e->getMessage(),
    //     ], 503);
    // } catch (\Exception $e) {
    //     Log::error('Exception inattendue.', ['error' => $e->getMessage()]);

    //     return response()->json([
    //         'success' => false,
    //         'message' => 'Une erreur est survenue.',
    //         'error'   => $e->getMessage(),
    //     ], 500);
    // }




    return view('welcome');
});
