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
    'curious': 'institutional_curious',
    'project_holder': 'project_holder',
    'active_entrepreneur': 'active_entrepreneur',
    'structured_sme': 'structured_sme',
    'distressed_business': 'distressed_business',
    'opportunity_seeker': 'opportunity_seeker',
    'institutional_curious': 'institutional_curious'
  };
  const user_profile_type = profileMapping[s03] || s03 || 'active_entrepreneur';

  // ActivityStage mapping
  const stageMapping = {
    'no': 'not_launched',
    'not_launched': 'not_launched',
    'occ_non': 'not_launched',
    'occ': 'occasional_sales',
    'occasional': 'occasional_sales',
    'occ_oui': 'occasional_sales',
    'occasional_sales': 'occasional_sales',
    'reg': 'regular_sales',
    'regular': 'regular_sales',
    'regular_sales': 'regular_sales',
    'team': 'structured_activity',
    'structured': 'structured_activity',
    'structured_activity': 'structured_activity',
    'drop': 'declining_sales',
    'declining': 'declining_sales',
    'declining_sales': 'declining_sales'
  };
  const activity_stage = stageMapping[s04] || s04 || 'regular_sales';

  // PrimaryNeed mapping
  const needMapping = {
    'prj': 'clarify_project',
    'clarify_project': 'clarify_project',
    'flh': 'global_understanding',
    'global_understanding': 'global_understanding',
    'dif': 'urgent_difficulty',
    'urgent_difficulty': 'urgent_difficulty',
    'com': 'increase_sales',
    'increase_sales': 'increase_sales',
    'pro': 'clarify_offer',
    'clarify_offer': 'clarify_offer',
    'fin': 'understand_finance',
    'understand_finance': 'understand_finance',
    'gov': 'organize_business',
    'organize_business': 'organize_business',
    'opp': 'assess_opportunity',
    'assess_opportunity': 'assess_opportunity',
    'fun': 'prepare_financing',
    'prepare_financing': 'prepare_financing',
    'idk': 'unknown_need',
    'unknown': 'unknown_need',
    'unknown_need': 'unknown_need'
  };
  const primary_need = needMapping[s06] || s06 || 'global_understanding';

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
  const opportunity_type = opportunityMapping[s08] || s08 || null;

  // DominantTopic mapping
  const topicMapping = {
    'pro': 'product',
    'product': 'product',
    'com': 'commercial',
    'commercial': 'commercial',
    'fin': 'finance',
    'finance': 'finance',
    'gov': 'governance',
    'governance': 'governance',
    'rh': 'hr',
    'hr': 'hr',
    'ops': 'operations',
    'operations': 'operations',
    'for': 'formalization',
    'formalization': 'formalization',
    'dig': 'digital',
    'digital': 'digital',
    '360': 'full_360',
    'full_360': 'full_360',
    'idk': 'unknown',
    'unknown': 'unknown'
  };
  const dominant_topic = topicMapping[s09] || s09 || null;

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
  const region = regionMapping[s05.region] || s05.region || 'Atlantique';

  // Sector mapping
  const sectorMapping = {
    'Agriculture': 'Agriculture / élevage',
    'Agro-transformation': 'Agro-transformation',
    'Commerce / Distribution': 'Commerce / distribution',
    'Commerce': 'Commerce / distribution',
    'Services': 'Services',
    'Industrie / Fabrication': 'Industrie / fabrication',
    'Industrie': 'Industrie / fabrication',
    'Numérique / technologie': 'Numérique / technologie',
    'Numérique': 'Numérique / technologie',
    'Artisanat': 'Artisanat',
    'Transport / logistique': 'Transport / logistique',
    'Transport': 'Transport / logistique',
    'Tourisme / hôtellerie /restauration': 'Tourisme / hôtellerie / restauration',
    'Tourisme / hôtellerie / restauration': 'Tourisme / hôtellerie / restauration',
    'Tourisme': 'Tourisme / hôtellerie / restauration',
    'Santé': 'Santé',
    'Éducation / formation': 'Éducation / formation',
    'Éducation': 'Éducation / formation',
    'BTP / immobilier': 'BTP / immobilier',
    'BTP': 'BTP / immobilier',
    'Autre': 'Autre'
  };
  const sector = sectorMapping[s05.secteur] || s05.secteur || 'Autre';

  let normalizedCommune = null;
  if (s05.commune) {
    const clean = s05.commune.trim().toLowerCase();
    const match = COMMUNE_LIST.find(c => c.toLowerCase() === clean) ||
                  COMMUNE_LIST.find(c => c.toLowerCase().includes(clean) || clean.includes(c.toLowerCase()));
    normalizedCommune = match || null;
  }

  let years_in_activity = null;
  if (s05.creation_year) {
    const parsedYear = parseInt(s05.creation_year, 10);
    if (!isNaN(parsedYear)) {
      years_in_activity = 2026 - parsedYear;
      if (years_in_activity < 0) years_in_activity = 0;
      if (years_in_activity > 99) years_in_activity = 99;
    }
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
    time_available: 'start_short',
    years_in_activity,
    year_created: s05.creation_year || null,
    main_offer_type: (() => {
      const val = answers.s10 || null;
      if (!val) return null;
      const translationMap = {
        'main_product': 'physical_product',
        'physical_product': 'physical_product',
        'digital_product': 'digital_product',
        'professional_service': 'service',
        'service': 'service',
        'consulting_service': 'consulting',
        'consulting': 'consulting',
        'subscription_service': 'subscription',
        'subscription': 'subscription',
        'multiple_offers': 'multiple_offers',
        'not_defined': 'not_defined',
        'other': 'other'
      };
      return translationMap[val] || val;
    })()
  };

  return apiFetch(`/sessions/${sessionId}/triage`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
