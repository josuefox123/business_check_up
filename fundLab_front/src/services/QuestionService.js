/**
 * QUESTION SERVICE — FUND.lab
 * Domain service logic for managing specific questions in modules.
 */

import { questionsApi } from '../api/questionsApi.js';

export const QuestionService = {
  getTriageQuestions() {
    return questionsApi.getTriageQuestions();
  },
  getDiagnosticQuestions(moduleCode) {
    return questionsApi.getDiagnosticQuestions(moduleCode);
  },
  getEnrichmentQuestions(moduleCode) {
    return questionsApi.getEnrichmentQuestions(moduleCode);
  },
  getByModule(moduleId, questionKind = 'diagnostic') {
    return questionsApi.getByModule(moduleId, questionKind);
  },
  saveQuestion(moduleId, question) {
    return questionsApi.save(moduleId, question);
  },
  deleteQuestion(moduleId, qId) {
    return questionsApi.delete(moduleId, qId);
  }
};
