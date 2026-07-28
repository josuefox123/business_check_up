/**
 * FUND.lab — API Layer: triage.js
 * Logique de soumission triage pure backend (transmission des valeurs dynamiques du backend sans valeurs par défaut hardcodées)
 */

import { apiFetch } from './config.js';
import { COMMUNE_LIST } from '../constants/locationData.js';
import { BACKEND_REFERENCES } from '../constants/referenceData.js';

/**
 * Soumettre les réponses de triage au backend
 * POST /sessions/{sessionId}/triage
 */
export async function submitTriageToBackendApi(sessionId, answers = {}) {
  // Mapping strict et direct depuis les questions dynamiques TRI-00 (sans fallbacks factices)
  const user_profile_type = answers['TRI-00-Q01'] || answers.user_profile_type || null;
  const activity_stage = answers['TRI-00-Q02'] || answers.activity_stage || null;
  const primary_need = answers['TRI-00-Q03'] || answers.primary_need || null;
  
  const triQ04Risk = answers['TRI-00-Q04'] || answers.risk_flags;
  const risk_flags = Array.isArray(triQ04Risk) ? triQ04Risk : (triQ04Risk ? [triQ04Risk] : []);

  const opportunity_type = answers['TRI-00-Q05'] || answers.opportunity_type || null;
  const dominant_topic = answers['TRI-00-Q06'] || answers.dominant_topic || null;
  const entry_mode = answers.entry_mode || 'assisted';
  const time_available = answers.time_available || '7_10_min';

  const region = answers.region || 'Atlantique';

  // Normaliser le secteur vers les chaînes exactes attendues par la validation backend
  const sectorMapping = {
    'Agriculture': 'Agriculture / élevage',
    'Agriculture / élevage': 'Agriculture / élevage',
    'Agro-transformation': 'Agro-transformation',
    'Commerce / Distribution': 'Commerce / distribution',
    'Commerce / distribution': 'Commerce / distribution',
    'Commerce': 'Commerce / distribution',
    'Services': 'Services',
    'Industrie / Fabrication': 'Industrie / fabrication',
    'Industrie / fabrication': 'Industrie / fabrication',
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
  const rawSectorInput = answers.sector || (s05 && s05.secteur) || 'Services';
  const sector = sectorMapping[rawSectorInput] || rawSectorInput;

  let normalizedCommune = null;
  const rawCommune = answers.commune || (s05 && s05.commune);
  if (rawCommune) {
    const clean = rawCommune.trim().toLowerCase();
    const match = COMMUNE_LIST.find(c => c.toLowerCase() === clean) ||
                  COMMUNE_LIST.find(c => c.toLowerCase().includes(clean) || clean.includes(c.toLowerCase()));
    normalizedCommune = match || null;
  }

  let years_in_activity = null;
  const rawYear = answers.year_created || (s05 && s05.creation_year);
  if (rawYear) {
    const parsedYear = parseInt(rawYear, 10);
    if (!isNaN(parsedYear)) {
      years_in_activity = 2026 - parsedYear;
      if (years_in_activity < 0) years_in_activity = 0;
      if (years_in_activity > 99) years_in_activity = 99;
    }
  }

  // Normaliser la tranche d'effectifs vers l'une des 6 valeurs backend autorisées
  const empRangeMapping = {
    'sole_trader': '1-10',
    '1-5': '1-10',
    '1-10': '1-10',
    '6-10': '1-10',
    '11-50': '11-50',
    '51-100': '51-100',
    '101-250': '101-250',
    '251-500': '251-500',
    '50+': '501+',
    '501+': '501+'
  };
  const rawEmpRange = answers.employee_count_range || (s05 && s05.employee_count_range) || '1-10';
  const employee_count_range = empRangeMapping[rawEmpRange] || rawEmpRange;

  const payload = {
    user_profile_type,
    ...( (answers.name || answers.full_name || (answers.s05 && answers.s05.full_name)) ? { full_name: answers.name || answers.full_name || answers.s05.full_name } : {} ),
    ...( (answers.phone || answers.phone_number || (answers.s05 && answers.s05.phone_number)) ? { phone_number: answers.phone || answers.phone_number || answers.s05.phone_number } : {} ),
    ...( (answers.whatsapp_number || (answers.s05 && answers.s05.whatsapp_number)) ? { whatsapp_number: answers.whatsapp_number || answers.s05.whatsapp_number } : {} ),
    ...( (answers.email || (answers.s05 && answers.s05.email)) ? { email: answers.email || answers.s05.email } : {} ),
    business_name: answers.business_name || (s05 && s05.business_name) || null,
    description: answers.description || answers.activity_description || (s05 && s05.activity_description) || null,
    region,
    commune: normalizedCommune,
    sector,
    sub_sector: answers.sub_sector || (s05 && s05.soussecteur) || null,
    activity_stage,
    entry_mode,
    primary_need,
    risk_flags,
    opportunity_type,
    dominant_topic,
    time_available,
    years_in_activity,
    year_created: rawYear || null,
    ca_n_1: (() => {
      const raw = answers.ca_n_1 || (answers.s05 && (answers.s05.ca_n_1 || answers.s05.last_year_turnover)) || null;
      if (!raw) return null;
      const cleaned = String(raw).replace(/[\s\.FCAfca]/g, '');
      const num = Number(cleaned);
      if (isNaN(num)) return null;
      return Math.min(999999999999.99, num).toString();
    })(),
    ca_m_1: (() => {
      const raw = answers.ca_m_1 || (answers.s05 && (answers.s05.ca_m_1 || answers.s05.last_month_turnover)) || null;
      if (!raw) return null;
      const cleaned = String(raw).replace(/[\s\.FCAfca]/g, '');
      const num = Number(cleaned);
      if (isNaN(num)) return null;
      return Math.min(999999999999.99, num).toString();
    })(),
    employee_count_range,
    main_offer_type: (() => {
      const raw = answers.main_offer_type || answers.s10 || null;
      if (!raw) return 'service';
      const offerMap = {
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
        'other': 'other'
      };
      return offerMap[raw] || 'service';
    })()
  };

  return apiFetch(`/sessions/${sessionId}/triage`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}
