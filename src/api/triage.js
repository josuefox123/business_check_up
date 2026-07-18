/**
 * FUND.lab — API Layer: triage.js
 * Logique de routage pré-diagnostic basée sur les réponses triage
 */

import { PROFILES } from './profiles.js';
import { MODULES_CATALOG } from './catalog.js';
import { apiFetch } from './config.js';

const CRITICAL_SIGNALS = ['charges', 'dettes', 'treso'];
const HIGH_SIGNALS = ['ventes', 'client', 'livraison'];

/**
 * Soumettre les réponses de triage au backend
 * POST /sessions/{sessionId}/triage
 */
export async function submitTriageToBackendApi(sessionId, answers) {
  const { s03, s04, s05 = {}, s06, s07 = [], s08, s09 } = answers;

  // UserProfileType mapping
  const profileMapping = {
    'project': 'project_holder',
    'active': 'active_entrepreneur',
    'pme': 'structured_sme',
    'diffic': 'distressed_business',
    'opport': 'opportunity_seeker',
    'curious': 'institutional_curious'
  };
  const user_profile_type = profileMapping[s03] || 'active_entrepreneur';

  // ActivityStage mapping
  const stageMapping = {
    'no': 'not_launched',
    'occ_non': 'not_launched',
    'occ': 'occasional_sales',
    'occ_oui': 'occasional_sales',
    'reg': 'regular_sales',
    'team': 'structured_activity',
    'drop': 'declining_sales'
  };
  const activity_stage = stageMapping[s04] || 'regular_sales';

  // PrimaryNeed mapping
  const needMapping = {
    'prj': 'clarify_project',
    'flh': 'global_understanding',
    'dif': 'urgent_difficulty',
    'com': 'increase_sales',
    'pro': 'clarify_offer',
    'fin': 'understand_finance',
    'gov': 'organize_business',
    'opp': 'assess_opportunity',
    'fun': 'prepare_financing',
    'idk': 'unknown_need'
  };
  const primary_need = needMapping[s06] || 'global_understanding';

  // RiskFlags mapping
  const riskMapping = {
    'charges': 'cannot_pay_current_expenses',
    'dettes': 'supplier_tax_salary_debt_arrears',
    'treso': 'cash_insufficient_continuity',
    'ventes': 'sales_strong_decline',
    'client': 'lost_major_client',
    'livraison': 'production_delivery_blocked',
    'conflits': 'internal_conflict_key_departure',
    'none': 'none',
    'pna': 'prefer_not_to_answer'
  };
  const risk_flags = Array.isArray(s07) 
    ? s07.map(flag => riskMapping[flag] || flag)
    : [];

  // OpportunityType mapping
  const opportunityMapping = {
    'fin': 'financing',
    'financing': 'financing',
    'funding': 'financing',
    'market': 'new_market',
    'new_market': 'new_market',
    'tender': 'tender_large_account',
    'tender_large_account': 'tender_large_account',
    'part': 'partnership',
    'partner': 'partnership',
    'partnership': 'partnership',
    'inv': 'capacity_investment',
    'invest': 'capacity_investment',
    'capacity_investment': 'capacity_investment',
    'geo': 'geographic_expansion',
    'geographic_expansion': 'geographic_expansion',
    'no': 'none',
    'none': 'none',
    'idk': 'unknown',
    'unknown': 'unknown'
  };
  const opportunity_type = opportunityMapping[s08] || null;

  // DominantTopic mapping
  const topicMapping = {
    'pro': 'product',
    'com': 'commercial',
    'fin': 'finance',
    'gov': 'governance',
    'rh': 'hr',
    'ops': 'operations',
    'for': 'formalization',
    'dig': 'digital',
    '360': 'full_360',
    'idk': 'unknown'
  };
  const dominant_topic = topicMapping[s09] || null;

  // Region mapping
  const regionMapping = {
    'Alibori': 'alibori',
    'Atacora': 'atacora',
    'Atlantique': 'atlantique',
    'Borgou': 'borgou',
    'Collines': 'collines',
    'Couffo': 'couffo',
    'Donga': 'donga',
    'Littoral': 'littoral',
    'Mono': 'mono',
    'Ouémé': 'oueme',
    'Plateau': 'plateau',
    'Zou': 'zou'
  };
  const region = regionMapping[s05.region] || 'atlantique';

  // Sector mapping
  const sectorMapping = {
    'Agriculture': 'agriculture_livestock',
    'Agro-transformation': 'agro_processing',
    'Commerce': 'commerce_distribution',
    'Services': 'services',
    'Industrie': 'industry_manufacturing',
    'Numérique': 'digital_technology',
    'Artisanat': 'crafts',
    'Transport': 'transport_logistics',
    'Tourisme': 'tourism_hospitality',
    'Santé': 'health',
    'Éducation': 'education_training',
    'BTP': 'construction_real_estate',
    'Autre': 'other'
  };
  const sector = sectorMapping[s05.secteur] || 'other';

  const payload = {
    user_profile_type,
    full_name: answers.name || null,
    phone_number: answers.phone || null,
    email: answers.email || null,
    business_name: s05.business_name || null,
    region,
    commune: s05.commune || null,
    sector,
    sub_sector: s05.soussecteur || null,
    activity_stage,
    entry_mode: 'assisted',
    primary_need,
    risk_flags,
    opportunity_type,
    dominant_topic,
    time_available: 'start_short' // Required by backend validation
  };

  return apiFetch(`/sessions/${sessionId}/triage`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

// ─────────────────────────────────────────
// ROUTING ENGINE
// ─────────────────────────────────────────
export const computeRoute = (triageAnswers) => {
  const { s03: profileId, s04, s05, s06, s07 = [], s08, s09 } = triageAnswers;

  // Profil institutionnel/curieux → page info
  if (profileId === 'curious') {
    return { route: 'INSTITUTIONAL', moduleId: null, reason: 'Profil institutionnel' };
  }

  // 1. STADE D'ACTIVITÉ (S04) - RÈGLES DE ROUTAGE PRIORITAIRES
  if (s04 === 'no' || s04 === 'occ_non') {
    return { route: 'S10', moduleId: 'PRJ-02', reason: 'Projet en préparation (non lancé ou pas de client payant)' };
  }
  if (s04 === 'occ_oui') {
    return { route: 'S13', moduleId: 'FLH-01', reason: 'Activité occasionnelle avec client payant' };
  }
  if (s04 === 'drop') {
    return { route: 'S11', moduleId: 'DIF-03', reason: 'Ventes en forte baisse (difficultés prioritaires)' };
  }

  // 2. SIGNAUX CRITIQUES (S07) - ROUTE DIFFICULTÉ URGENTE
  const hasCritical = Array.isArray(s07) && s07.some(s => CRITICAL_SIGNALS.includes(s));
  if (hasCritical) {
    return {
      route: 'S11',
      moduleId: 'DIF-03',
      reason: 'Signaux critiques financiers détectés',
      urgent: true,
    };
  }

  // 3. OBJECTIF OPPORTUNITÉ OU FINANCEMENT (S06/S08)
  if (s06 === 'opp' || s06 === 'fun') {
    const hasHigh = Array.isArray(s07) && s07.some(s => HIGH_SIGNALS.includes(s));
    if (hasHigh) {
      return {
        route: 'S11',
        moduleId: 'DIF-03',
        reason: 'Opportunité avec signaux de fragilité',
        warning: 'Avant de saisir cette opportunité, vos signaux suggèrent de traiter des fragilités opérationnelles.',
      };
    }
    return { route: 'S12', moduleId: 'OPP-04', reason: 'Objectif opportunité / financement' };
  }

  if (s08 && s08 !== 'no' && s08 !== 'idk') {
    return { route: 'S12', moduleId: 'OPP-04', reason: 'Opportunité spécifique identifiée' };
  }

  // 4. AXE DE DIAGNOSTIC SPÉCIFIQUE (S09)
  if (s09) {
    const axeModuleMap = {
      pro: 'PRO-05',
      com: 'COM-06',
      fin: 'FIN-07',
      gov: 'GOV-08',
      rh: 'RH-10',
      ops: 'OPS-11',
      for: 'FOR-12',
      dig: 'DIG-13',
      '360': '360-09',
    };
    const moduleId = axeModuleMap[s09];
    if (moduleId) {
      return { route: 'S13', moduleId, reason: `Axe spécifique sélectionné : ${s09}` };
    }
  }

  // 5. PROFIL PME OU STADE DE STRUCTURE (S04 = team)
  if (profileId === 'pme' || s04 === 'team') {
    return { route: 'S13', moduleId: '360-09', reason: 'PME structurée ou équipe en place' };
  }

  // Par défaut → Flash
  return { route: 'S13', moduleId: 'FLH-01', reason: 'Diagnostic Flash par défaut' };
};

// ─────────────────────────────────────────
// GÉNÉRATION D'ALERTE PRÉ-VÉRIFICATION
// ─────────────────────────────────────────
export const getVerifWarning = (moduleId, triageAnswers) => {
  const s07 = triageAnswers.s07 || [];
  const hasCritical = Array.isArray(s07) && s07.some(s => CRITICAL_SIGNALS.includes(s));

  if (moduleId === 'OPP-04' && hasCritical) {
    return 'Attention : vos réponses signalent des tensions financières. Nous recommandons d\'abord un Diagnostic Difficulté avant d\'explorer cette opportunité.';
  }
  if (moduleId === '360-09' && hasCritical) {
    return 'Un diagnostic 360° complet est pertinent, mais vos signaux suggèrent de traiter les urgences financières en priorité.';
  }
  if (moduleId === 'PRJ-02' && triageAnswers.s04 !== 'avant' && hasCritical) {
    return 'Avant de lancer un nouveau projet, sécurisez votre activité actuelle avec un Diagnostic Difficulté.';
  }
  return null;
};

// ─────────────────────────────────────────
// MODULES DISPONIBLES SELON LE PROFIL
// ─────────────────────────────────────────
export const getAvailableModulesForProfile = (profileId) => {
  const profile = PROFILES[profileId];
  if (!profile) return Object.values(MODULES_CATALOG);

  return Object.values(MODULES_CATALOG).filter(module =>
    module.recommendedFor.includes(profileId)
  );
};

// ─────────────────────────────────────────
// ÉTAPES DU PARCOURS PAR PROFIL
// ─────────────────────────────────────────
export const getJourneySteps = (profileId, moduleId) => {
  const profile = PROFILES[profileId] || {};
  return profile.journey || ['Profil', 'Diagnostic', 'Résultats'];
};

// ─────────────────────────────────────────
// QUESTIONS DE TRIAGE PERTINENTES PAR PROFIL
// ─────────────────────────────────────────
export const getTriageStepsForProfile = (profileId) => {
  // Tous les profils passent par S04, S05, S06, S07
  // Certains passent par S08/S09 selon les réponses
  const base = ['s04', 's05', 's06', 's07'];

  if (profileId === 'curious') return []; // Pas de triage
  if (profileId === 'project') return ['s04', 's05', 's06']; // Simplifié
  if (profileId === 'diffic')  return ['s04', 's07', 's08']; // Focus difficulté
  if (profileId === 'opport')  return ['s04', 's08', 's09']; // Focus opportunité

  return base;
};
