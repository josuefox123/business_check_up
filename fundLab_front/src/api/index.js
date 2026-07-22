/**
 * FUND.lab — API Layer: index.js
 * Point d'entrée central de toute la couche API backend
 */

// Logique de triage / routage
export {
  submitTriageToBackendApi,
} from './triage.js';

// Sessions & Consentement
export {
  createSessionApi,
  submitConsentApi,
  updateSessionApi,
  abandonSessionApi,
} from './sessionsApi.js';
