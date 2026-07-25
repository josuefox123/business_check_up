/**
 * FUND.lab — Centralized Backend Reference Data
 * Références de données transmises par l'API backend
 */

export const BACKEND_REFERENCES = {
  activity_stage: [
    { value: "not_launched", label: "Pas encore lancé" },
    { value: "occasional_sales", label: "Ventes occasionnelles" },
    { value: "regular_sales", label: "Ventes régulières" },
    { value: "structured_activity", label: "Activité structurée" },
    { value: "declining_sales", label: "Ventes en baisse" }
  ],
  user_profile_type: [
    { value: "project_holder", label: "Porteur de projet" },
    { value: "active_entrepreneur", label: "Entrepreneur en activité" },
    { value: "structured_sme", label: "PME structurée" },
    { value: "distressed_business", label: "Entreprise en difficulté" },
    { value: "opportunity_seeker", label: "Recherche d'opportunité" },
    { value: "institutional_curious", label: "Institutionnel / curieux" }
  ],
  primary_need: [
    { value: "clarify_project", label: "Tester ou clarifier mon idée" },
    { value: "global_understanding", label: "Comprendre globalement mon entreprise" },
    { value: "urgent_difficulty", label: "Résoudre une difficulté urgente" },
    { value: "increase_sales", label: "Améliorer mes ventes" },
    { value: "clarify_offer", label: "Clarifier mon offre" },
    { value: "understand_finance", label: "Comprendre trésorerie et rentabilité" },
    { value: "organize_business", label: "Mieux organiser les rôles" },
    { value: "assess_opportunity", label: "Savoir si je suis prêt" },
    { value: "prepare_financing", label: "Préparer un financement" },
    { value: "unknown_need", label: "Je ne sais pas exactement" }
  ],
  opporttunity_type: [
    { value: "financing", label: "Obtenir un financement" },
    { value: "new_market", label: "Accéder à un nouveau marché" },
    { value: "tender_large_account", label: "Répondre à un appel d'offres / grand compte" },
    { value: "partnership", label: "Trouver un partenaire" },
    { value: "capacity_investment", label: "Investir ou augmenter la capacité" },
    { value: "geographic_expansion", label: "Étendre à une autre zone" },
    { value: "none", label: "Pas d'opportunité précise" },
    { value: "unknown", label: "Je ne sais pas encore" }
  ],
  dominant_topic: [
    { value: "product", label: "Produit" },
    { value: "commercial", label: "Commercial" },
    { value: "finance", label: "Finance" },
    { value: "governance", label: "Gouvernance" },
    { value: "hr", label: "Ressources humaines" },
    { value: "operations", label: "Opérations" },
    { value: "digital", label: "Digital" },
    { value: "formalization", label: "Formalisation" },
    { value: "full_360", label: "Vision 360°" },
    { value: "unknown", label: "Inconnu" }
  ],
  risk_flag: [
    { value: "cannot_pay_current_expenses", label: "Difficulté à payer les charges courantes" },
    { value: "supplier_tax_salary_debt_arrears", label: "Retards fournisseurs, impôts, salaires ou dettes" },
    { value: "cash_insufficient_continuity", label: "Trésorerie insuffisante pour continuer" },
    { value: "sales_strong_decline", label: "Forte baisse des ventes" },
    { value: "lost_major_client", label: "Perte d'un client important" },
    { value: "production_delivery_blocked", label: "Blocage production ou livraison" },
    { value: "internal_conflict_key_departure", label: "Conflits internes ou départs critiques" },
    { value: "none", label: "Aucune de ces situations" },
    { value: "prefer_not_to_answer", label: "Je préfère ne pas répondre" }
  ],
  entry_mode: [
    { value: "assisted", label: "Accompagné" },
    { value: "direct_catalog", label: "Catalogue direct" },
    { value: "learn_more", label: "En savoir plus" },
    { value: "institutional_partner", label: "Je représente une institution / un partenaire" }
  ],
  entry_source: [
    { value: "direct", label: "Direct" },
    { value: "cci_link", label: "Lien CCI" },
    { value: "whatsapp", label: "WhatsApp" },
    { value: "facebook", label: "Facebook" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "qr_code", label: "QR Code" },
    { value: "email", label: "E-mail" },
    { value: "partner", label: "Partenaire" },
    { value: "other", label: "Autre" }
  ],
  tume_available: [
    { value: "7_10_min", label: "7 à 10 minutes" },
    { value: "8_15_min", label: "8 à 15 minutes" },
    { value: "30_45_min", label: "30 à 45 minutes" },
    { value: "start_short", label: "Commencer court et approfondir après" },
    { value: "deep_dive", label: "Diagnostic sérieux, même si plus long" }
  ]
};
