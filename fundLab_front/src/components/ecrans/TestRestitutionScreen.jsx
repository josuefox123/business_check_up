import React from 'react';
import { ResultatSyntheseScreen } from './restitution/ResultatSyntheseScreen.jsx';

export const TestRestitutionScreen = () => {
  const mockBackendData = {
    diagnostic_run_id: "RUN-2026-88912",
    module_code: "FIN-07",
    module_name: "Diagnostic Finance & Trésorerie",
    completed_at: "2026-07-28T14:00:00Z",
    duration_seconds: 480,
    scoring: {
      raw_score_1_5: 3.2,
      converted_score_0_100: 64,
      credibilized_score_0_100: 60,
      score_band: "BAND_STABLE",
      band_label: "Trésorerie sous contrôle mais prévisions à structurer",
      credibility_score: 0.85,
      evidence_band: "PREUVE_FORTE",
      red_flag_count: 1,
      has_critical_red_flag: false,
      dominant_strength: "Structure de coûts fixes maîtrisée",
      dominant_weakness: "Absence d'anticipation sur le BFR à 6 mois",
      priorities: "Mettre en place un tableau de bord mensuel; Négocier les délais fournisseurs; Réévaluer les encours clients"
    },
    restitution: {
      recommendation_id: "REC-FIN-001",
      summary: "Votre entreprise affiche une solidité financière globale correcte. Cependant, la gestion du BFR nécessite une attention particulière pour éviter un creux de trésorerie sur le prochain trimestre.",
      interpretation_text: "L'analyse montre des indicateurs sains sur la marge brute, mais un manque de visibilité sur les flux d'encaissement à moyen terme.",
      orientation_text: "Un accompagnement sur la modélisation du besoin en fonds de roulement et l'optimisation des relances clients est fortement recommandé.",
      typical_strengths: [
        "Marge brute au-dessus de la moyenne du secteur",
        "Maîtrise constante des charges d'exploitation",
        "Absence de sur-endettement à court terme"
      ],
      typical_fragilities: [
        "Délais de paiement clients supérieurs à 60 jours",
        "Pas de plan de trésorerie prévisionnel dynamique",
        "Dépendance forte vis-à-vis d'un client majeur (35% du CA)"
      ],
      priorities: [
        "Structurer un plan de trésorerie glissant à 12 semaines",
        "Négocier des acomptes à la commande pour l'offre principale",
        "Activer un dispositif d'affacturage ou d'assurance-crédit"
      ],
      next_module: "FIN-07",
      follow_up_recommended: "Plan d'action Trésorerie sous 15 jours",
      urgent_attention: "Attention aux échéances fiscales du mois prochain : risque de tension sur le solde disponible."
    },
    disclaimer: "Ce résultat constitue une analyse automatique indicative basée sur les déclarations fournies.",
    disclaimer_financing: "Document non contractuel pour l'octroi direct de financements bancaires."
  };

  return (
    <ResultatSyntheseScreen
      restitution={mockBackendData}
      onBack={() => window.history.back()}
      onRestart={() => alert("Recommencer le diagnostic")}
      onEnrichment={() => alert("Ouvrir le rapport complet")}
    />
  );
};
