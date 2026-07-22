/**
 * FUND.lab — API Layer: triage.js
 * Logique de soumission triage pure backend
 */

import { apiFetch } from './config.js';
import { COMMUNE_LIST } from '../constants/locationData.js';

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
    'Alibori': 'Alibori',
    'Atacora': 'Atacora',
    'Atlantique': 'Atlantique',
    'Borgou': 'Borgou',
    'Collines': 'Collines',
    'Couffo': 'Couffo',
    'Donga': 'Donga',
    'Littoral': 'Littoral',
    'Mono': 'Mono',
    'Ouémé': 'Ouémé',
    'Plateau': 'Plateau',
    'Zou': 'Zou'
  };
  const region = regionMapping[s05.region] || 'Atlantique';

  // Sector mapping
  const sectorMapping = {
    'Agriculture': 'Agriculture / élevage',
    'Agro-transformation': 'Agro-transformation',
    'Commerce': 'Commerce / distribution',
    'Services': 'Services',
    'Industrie': 'Industrie / fabrication',
    'Numérique': 'Numérique / technologie',
    'Artisanat': 'Artisanat',
    'Transport': 'Transport / logistique',
    'Tourisme': 'Tourisme / hôtellerie / restauration',
    'Santé': 'Santé',
    'Éducation': 'Éducation / formation',
    'BTP': 'BTP / immobilier',
    'Autre': 'Autre'
  };
  const sector = sectorMapping[s05.secteur] || 'Autre';

  let normalizedCommune = null;
  if (s05.commune) {
    const clean = s05.commune.trim().toLowerCase();
    const match = COMMUNE_LIST.find(c => c.toLowerCase() === clean) ||
                  COMMUNE_LIST.find(c => c.toLowerCase().includes(clean) || clean.includes(c.toLowerCase()));
    normalizedCommune = match || null;
  }

  const payload = {
    user_profile_type,
    full_name: answers.name || null,
    phone_number: answers.phone || null,
    email: answers.email || null,
    business_name: s05.business_name || null,
    region,
    commune: normalizedCommune,
    sector,
    sub_sector: s05.soussecteur || null,
    activity_stage,
    entry_mode: 'assisted',
    primary_need,
    risk_flags,
    opportunity_type,
    dominant_topic,
    time_available: 'start_short'
  };

  return apiFetch(`/sessions/${sessionId}/triage`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
