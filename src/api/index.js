/**
 * FUND.lab — API Layer: index.js
 * Point d'entrée central de toute la couche API
 * Importer depuis ici dans les composants React
 *
 * Usage:
 *   import { PROFILES_LIST, getModule, computeRoute, generateFullResults } from '../api';
 */

// Profils utilisateur
export {
  PROFILES,
  PROFILES_LIST,
  getProfile,
} from './profiles.js';

// Catalogue des modules diagnostics
export {
  MODULES_CATALOG,
  MODULES_LIST,
  getModule,
  MODULE_ROUTES,
  MODULE_BY_ROUTE,
} from './catalog.js';

// Questions par module
export {
  TRIAGE_QUESTIONS,
  MODULE_QUESTIONS,
  getModuleQuestions,
  getTriageQuestion,
} from './questions.js';

// Moteur de scoring
export {
  calculateGlobalScore,
  calculateAxeScores,
  computeFullScore,
  getScoreLevel,
  detectAlerts,
} from './scoring.js';

// Générateur de résultats
export {
  generateForcesFragilites,
  generateRecommendations,
  generateActionPlan,
  generateFullResults,
} from './results.js';

// Logique de triage / routage
export {
  computeRoute,
  getVerifWarning,
  getAvailableModulesForProfile,
  getJourneySteps,
  getTriageStepsForProfile,
} from './triage.js';
