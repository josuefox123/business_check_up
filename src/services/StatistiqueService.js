/**
 * STATISTIQUE SERVICE — FUND.lab
 * Domain service logic for metrics and overview KPIs.
 */

import { statistiquesApi } from '../api/statistiquesApi.js';

export const StatistiqueService = {
  getOverview() {
    return statistiquesApi.getOverview();
  }
};
