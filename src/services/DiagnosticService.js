/**
 * DIAGNOSTIC SERVICE — FUND.lab
 * Domain service logic for executing and managing diagnostics.
 * Components interact only with this layer.
 */

import { diagnosticsApi } from '../api/diagnosticsApi.js';
import { calculateGlobalScore } from '../api/scoring.js';

export const DiagnosticService = {
  getDiagnostics() {
    return diagnosticsApi.getAll();
  },
  getDiagnosticById(id) {
    return diagnosticsApi.getById(id);
  },
  submitDiagnostic(moduleId, answers, userDetails = null) {
    const score = calculateGlobalScore(moduleId, answers);
    const diag = {
      moduleId,
      score,
      answers,
      userName: userDetails?.name || 'Anonyme',
      userEmail: userDetails?.email || '',
      userPhone: userDetails?.phone || ''
    };
    return diagnosticsApi.create(diag);
  },
  deleteDiagnostic(id) {
    return diagnosticsApi.delete(id);
  }
};
