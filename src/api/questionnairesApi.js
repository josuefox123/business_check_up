/**
 * QUESTIONNAIRES API — MOCK LAYER
 * Returns JS Promises resolving data from LocalStoreRepository.
 * Safe to swap with REST calls later.
 */

import { LocalStoreRepository } from '../repositories/LocalStoreRepository.js';

export const questionnairesApi = {
  getAll() {
    const qData = LocalStoreRepository.getQuestionnaires();
    return Promise.resolve(Object.keys(qData.modules).map(moduleId => ({
      id: moduleId,
      name: qData.catalog[moduleId]?.name || moduleId,
      questionsCount: qData.modules[moduleId]?.questions?.length || 0,
      axes: qData.modules[moduleId]?.axes || []
    })));
  },
  getById(moduleId) {
    const qData = LocalStoreRepository.getQuestionnaires();
    if (qData.modules[moduleId]) {
      return Promise.resolve({
        id: moduleId,
        name: qData.catalog[moduleId]?.name || moduleId,
        estimatedTime: qData.modules[moduleId].estimatedTime || '',
        axes: qData.modules[moduleId].axes || [],
        questions: qData.modules[moduleId].questions || []
      });
    }
    return Promise.resolve(null);
  }
};
