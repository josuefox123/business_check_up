import { apiFetch } from './config.js';
import { LocalStoreRepository } from '../repositories/LocalStoreRepository.js';

// Human-readable module names (mirrors the catalog)
const MODULE_NAMES = {
  'FLH-01': 'Diagnostic Flash',
  'PRJ-02': 'Diagnostic Projet',
  'DIF-03': 'Diagnostic Difficulté',
  'OPP-04': 'Diagnostic Opportunité',
  'PRO-05': 'Offre & Produits',
  'COM-06': 'Diagnostic Commercial',
  'FIN-07': 'Diagnostic Financier',
  'GOV-08': 'Organisation',
};

/** Compute % change between two numbers, returning null if previous is 0 */
const computeTrend = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
};

export const statistiquesApi = {
  getOverview() {
    return apiFetch('/admin/dashboard')
      .then(res => {
        const data = res?.data || res;
        if (!data) return null;

        const diagStarted = Number(data.diagnostics?.started || data.diagnostics?.total || 0);
        const diagCompleted = Number(data.diagnostics?.completed || 0);
        const diagInProgress = Number(data.diagnostics?.in_progress || 0);
        const diagNotStarted = Number(data.diagnostics?.not_started || 0);
        const diagAbandoned = Number(data.diagnostics?.abandoned || 0);
        const completionRate = Number(data.diagnostics?.completion_rate || 0);

        return {
          ...data,
          diagnostics: {
            total: diagStarted,
            started: diagStarted,
            completed: diagCompleted,
            in_progress: diagInProgress,
            not_started: diagNotStarted,
            abandoned: diagAbandoned,
            completion_rate: completionRate,
          },
          pme: Number(data.pme ?? 0),
          score_band: data.score_band ?? {},
          follow_ups: data.follow_ups ?? { total_requests: 0, urgent: 0, high: 0, new: 0 },
        };
      })
      .catch(err => {
        console.error('[statistiquesApi.getOverview] Error fetching admin overview:', err);
        return null;
      });
  },

  /**
   * Daily diagnostic counts (kept empty if not supported natively by backend)
   */
  getActivityChart(days = 7) {
    return Promise.resolve([]);
  },

  /**
   * GET /api/bc/admin/dashboard/modules
   * Returns per-module stats: count, completed.
   */
  getModuleStats() {
    return apiFetch('/admin/dashboard/modules')
      .then(res => {
        const data = res?.data || res;
        const modules = data.modules || [];
        if (!Array.isArray(modules)) return [];

        const total = modules.reduce((acc, m) => acc + (Number(m.count) || 0), 0);

        return modules.map(m => {
          const count = Number(m.count || 0);
          return {
            moduleId: m.module_code,
            module_code: m.module_code,
            name: MODULE_NAMES[m.module_code] || m.module_code,
            count: count,
            completed: Number(m.completed || 0),
            percentage: total > 0 ? Math.round((count / total) * 100) : 0,
          };
        });
      })
      .catch(err => {
        console.error('[statistiquesApi.getModuleStats] Error fetching module stats:', err);
        return [];
      });
  },

  getScoreDistribution() {
    return apiFetch('/admin/dashboard/scores')
      .then(res => {
        const data = res?.data || res;
        return data?.scores_by_module || [];
      })
      .catch(err => {
        console.error('[statistiquesApi.getScoreDistribution] Error fetching score distribution:', err);
        return [];
      });
  },

  getTopSectors() {
    return apiFetch('/admin/dashboard/territory')
      .then(res => {
        const data = res?.data ?? res;
        const regions = data?.regions ?? [];
        if (!Array.isArray(regions)) return [];
        return regions.map(r => ({
          region: r.region ?? '[region non disponible]',
          count: Number(r.diagnostic_count ?? 0),
        }));
      })
      .catch(err => {
        console.error('[statistiquesApi.getTopSectors] Error fetching territory data:', err);
        return [];
      });
  },
};
