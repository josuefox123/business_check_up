/**
 * RAPPORT SERVICE — FUND.lab
 * Domain service logic for generating reports.
 */

import { rapportsApi } from '../api/rapportsApi.js';

export const RapportService = {
  getReport(moduleId, answers, score) {
    return rapportsApi.generateReport(moduleId, answers, score);
  }
};
