/**
 * ADMINISTRATION SERVICE — FUND.lab
 * Aggregates all administrative capabilities and provides a unified dashboard interface.
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
  // Aggregate CRUD exports
  diagnostics: DiagnosticService,
  questionnaires: QuestionnaireService,
  questions: QuestionService,
  users: UtilisateurService,
  enterprises: EntrepriseService,
  notifications: NotificationService,
  statistics: StatistiqueService,
  settings: ParametreService
};
