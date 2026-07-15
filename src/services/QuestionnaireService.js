/**
 * QUESTIONNAIRE SERVICE — FUND.lab
 * Domain service logic for managing questionnaires/modules.
 */

import { questionnairesApi } from '../api/questionnairesApi.js';

export const QuestionnaireService = {
  getQuestionnaires() {
    return questionnairesApi.getAll();
  },
  getQuestionnaireById(id) {
    return questionnairesApi.getById(id);
  }
};
