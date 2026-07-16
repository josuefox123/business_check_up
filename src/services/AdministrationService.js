/**
 * ADMINISTRATION SERVICE — FUND.lab
 * Aggregates all administrative capabilities and provides a unified dashboard interface.
 * All methods are async (Promise-based) and map to future REST API endpoints.
 */

import { DiagnosticService } from './DiagnosticService.js';
import { QuestionnaireService } from './QuestionnaireService.js';
import { QuestionService } from './QuestionService.js';
import { UtilisateurService } from './UtilisateurService.js';
import { EntrepriseService } from './EntrepriseService.js';
import { NotificationService } from './NotificationService.js';
import { StatistiqueService } from './StatistiqueService.js';
import { ParametreService } from './ParametreService.js';

export const AdministrationService = {
  // CRUD modules
  diagnostics:    DiagnosticService,
  questionnaires: QuestionnaireService,
  questions:      QuestionService,
  users:          UtilisateurService,
  enterprises:    EntrepriseService,
  notifications:  NotificationService,
  settings:       ParametreService,

  // Analytics — all methods exposed for the Dashboard
  statistics: {
    /** GET /api/admin/stats/overview — KPI cards */
    getOverview:          () => StatistiqueService.getOverview(),
    /** GET /api/admin/stats/activity?days=7 — Bar chart */
    getActivityChart:     (days) => StatistiqueService.getActivityChart(days),
    /** GET /api/admin/stats/modules — Module breakdown table */
    getModuleStats:       () => StatistiqueService.getModuleStats(),
    /** GET /api/admin/stats/scores/distribution — Score donut/bar */
    getScoreDistribution: () => StatistiqueService.getScoreDistribution(),
    /** GET /api/admin/stats/sectors — Top sectors pie */
    getTopSectors:        () => StatistiqueService.getTopSectors(),
  },
};
