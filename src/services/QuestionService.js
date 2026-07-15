/**
 * QUESTION SERVICE — FUND.lab
 * Domain service logic for managing specific questions in modules.
 */

import { questionsApi } from '../api/questionsApi.js';

export const QuestionService = {
  getQuestionsByModule(moduleId) {
    return questionsApi.getByModule(moduleId);
  },
  saveQuestion(moduleId, question) {
    return questionsApi.save(moduleId, question);
  },
  deleteQuestion(moduleId, qId) {
    return questionsApi.delete(moduleId, qId);
  }
};
