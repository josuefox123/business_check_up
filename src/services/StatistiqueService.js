/**
 * STATISTIQUE SERVICE — FUND.lab
 * Business layer for all KPI and analytics operations.
 * Maps directly to future REST endpoints via statistiquesApi.
 *
 * API endpoint mapping (for backend integration):
 *   getOverview()        → GET /api/admin/stats/overview
 *   getActivityChart()   → GET /api/admin/stats/activity?days=7
 *   getModuleStats()     → GET /api/admin/stats/modules
 *   getScoreDistrib()    → GET /api/admin/stats/scores/distribution
 *   getTopSectors()      → GET /api/admin/stats/sectors
 */

import { statistiquesApi } from '../api/statistiquesApi.js';

export const StatistiqueService = {

  /** Global KPI summary (total diags, users, avg score, trends) */
  getOverview() {
    return statistiquesApi.getOverview();
  },

  /** Daily activity for the last N days (bar chart data) */
  getActivityChart(days = 7) {
    return statistiquesApi.getActivityChart(days);
  },

  /** Per-module breakdown: count, avg score, % share */
  getModuleStats() {
    return statistiquesApi.getModuleStats();
  },

  /** Score distribution by bracket (critique/faible/moyen/bon/excellent) */
  getScoreDistribution() {
    return statistiquesApi.getScoreDistribution();
  },

  /** Top sectors from user profiles */
  getTopSectors() {
    return statistiquesApi.getTopSectors();
  },
};
