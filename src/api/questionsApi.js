/**
 * QUESTIONS API — MOCK LAYER
 * Returns JS Promises resolving data from LocalStoreRepository.
 * Safe to swap with REST calls later.
 */

import { LocalStoreRepository } from '../repositories/LocalStoreRepository.js';

export const questionsApi = {
  getByModule(moduleId) {
    const qData = LocalStoreRepository.getQuestionnaires();
    if (moduleId === 'triage') {
      return Promise.resolve(Object.values(qData.triage));
    }
    if (qData.modules[moduleId]) {
      return Promise.resolve(qData.modules[moduleId].questions || []);
    }
    return Promise.resolve([]);
  },
  save(moduleId, question) {
    LocalStoreRepository.saveQuestion(moduleId, question);
    return Promise.resolve(question);
  },
  delete(moduleId, qId) {
    LocalStoreRepository.deleteQuestion(moduleId, qId);
    return Promise.resolve(true);
  }
};
