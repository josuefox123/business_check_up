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
export async function submitTriageToBackendApi(sessionId, answers) {
  const { s03, s04, s05 = {}, s06, s07 = [], s08, s09 } = answers;

  // Récupérer la 1ère valeur dynamique fournie par le backend si aucune valeur n'est saisie
  const firstProfile = BACKEND_REFERENCES.user_profile_type[0]?.value || null;
  const firstStage = BACKEND_REFERENCES.activity_stage[0]?.value || null;
  const firstNeed = BACKEND_REFERENCES.primary_need[0]?.value || null;
  const firstRisk = BACKEND_REFERENCES.risk_flag[0]?.value ? [BACKEND_REFERENCES.risk_flag[0].value] : null;
  const firstOpport = BACKEND_REFERENCES.opporttunity_type[0]?.value || null;
  const firstTopic = BACKEND_REFERENCES.dominant_topic[0]?.value || null;
  const firstMode = BACKEND_REFERENCES.entry_mode[0]?.value || null;
  const firstTime = BACKEND_REFERENCES.tume_available[0]?.value || null;

  const user_profile_type = answers.user_profile_type || s03 || firstProfile;
  const activity_stage = answers.activity_stage || s04 || firstStage;
  const primary_need = answers.primary_need || s06 || firstNeed;
  
  const risk_flags = (Array.isArray(answers.risk_flags) && answers.risk_flags.length > 0)
    ? answers.risk_flags
    : ((Array.isArray(s07) && s07.length > 0) ? s07 : firstRisk);

  const opportunity_type = answers.opportunity_type || s08 || firstOpport;
  const dominant_topic = answers.dominant_topic || s09 || firstTopic;
  const entry_mode = answers.entry_mode || firstMode;
  const time_available = answers.time_available || firstTime;

  const region = answers.region || (s05 && s05.region) || 'Atlantique';

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
    full_name: answers.name || answers.full_name || (answers.s05 && answers.s05.full_name) || null,
    phone_number: answers.phone || answers.phone_number || (answers.s05 && answers.s05.phone_number) || null,
    whatsapp_number: answers.whatsapp_number || (answers.s05 && answers.s05.whatsapp_number) || null,
    email: answers.email || (answers.s05 && answers.s05.email) || null,
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
