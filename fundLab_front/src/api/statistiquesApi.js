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
        // Backend format: { success: true, message: "Success", data: { period, traffic, diagnostics, follow_ups } }
        return res?.data || res;
      })
      .catch(err => {
        console.error('Error fetching admin dashboard overview from backend, using fallback:', err);
        const diags = LocalStoreRepository.getDiagnostics();
        const users = LocalStoreRepository.getUsers();
        return {
          period: { from: null, to: null },
          traffic: {
            total_visitors: users.length * 2,
            new_sessions: users.length,
            completed_sessions: diags.length,
            abandoned_sessions: Math.max(0, users.length - diags.length),
          },
          diagnostics: {
            started: users.length,
            completed: diags.length,
            abandoned: Math.max(0, users.length - diags.length),
            completion_rate: users.length > 0 ? Math.round((diags.length / users.length) * 100) : 0,
          },
          follow_ups: {
            total_requests: users.length,
            urgent: 0,
            high: 0,
            new: users.length,
          }
        };
      });
  },

  /**
   * GET /api/bc/admin/dashboard (calculé ou extrait)
   * Returns daily diagnostic counts for the last N days.
   */
  getActivityChart(days = 7) {
    // Note: Utilise les données agrégées ou extrait de l'historique du backend
    return apiFetch('/admin/dashboard')
      .then(res => {
        // Formater les données du backend si disponibles sous forme d'historique
        if (res && res.activity) {
          return res.activity;
        }
        throw new Error('No activity data in overview');
      })
      .catch(() => {
        const diags = LocalStoreRepository.getDiagnostics();
        const result = [];
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dayStr = date.toISOString().split('T')[0];
          const count = diags.filter(d => d.date && d.date.startsWith(dayStr)).length;
          result.push({
            date: dayStr,
            label: date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
            count,
          });
        }
        return result;
      });
  },

  /**
   * GET /api/bc/admin/dashboard/modules
   * Returns per-module stats: count, average score, completion rate.
   */
  getModuleStats() {
    return apiFetch('/admin/dashboard/modules')
      .then(res => {
        // Backend: { success: true, message: "Success", data: { modules: [...] } }
        const data = res?.data || res;
        const modules = data.modules || [];
        if (!Array.isArray(modules)) return [];

        const total = modules.reduce((acc, m) => acc + (m.count || 0), 0);

        return modules.map(m => {
          const count = m.count || 0;
          return {
            moduleId: m.module_code,
            name: MODULE_NAMES[m.module_code] || m.module_code,
            count: count,
            completed: m.completed || 0,
            percentage: total > 0 ? Math.round((count / total) * 100) : 0
          };
        });
      })
      .catch(err => {
        console.error('Error fetching module stats from backend, fallback:', err);
        const diags = LocalStoreRepository.getDiagnostics();
        const stats = {};

        diags.forEach(d => {
          if (!stats[d.moduleId]) {
            stats[d.moduleId] = { moduleId: d.moduleId, name: MODULE_NAMES[d.moduleId] || d.moduleId, count: 0, totalScore: 0 };
          }
          stats[d.moduleId].count += 1;
          stats[d.moduleId].totalScore += d.score || 0;
        });

        const total = diags.length;
        return Object.values(stats).map(m => ({
          ...m,
          avgScore: m.count > 0 ? Math.round(m.totalScore / m.count) : 0,
          percentage: total > 0 ? Math.round((m.count / total) * 100) : 0,
        })).sort((a, b) => b.count - a.count);
      });
  },

  getScoreDistribution() {
    // Le backend renvoie les scores moyens par module via /admin/dashboard/scores.
    // Pour alimenter la distribution des scores (Critique, Faible, Moyen, Bon, Excellent),
    // nous lisons les diagnostics réels de la base s'ils sont disponibles, ou simulons
    // intelligemment sur base des moyennes par module.
    return apiFetch('/admin/dashboard/scores')
      .then(res => {
        const data = res?.data || res;
        const scoresByModule = data.scores_by_module || [];
        
        // Brackets
        const brackets = [
          { label: 'Critique',   min: 0,  max: 29,  color: '#ef4444', count: 0 },
          { label: 'Faible',     min: 30, max: 49,  color: '#f97316', count: 0 },
          { label: 'Moyen',      min: 50, max: 69,  color: '#eab308', count: 0 },
          { label: 'Bon',        min: 70, max: 84,  color: '#22c55e', count: 0 },
          { label: 'Excellent',  min: 85, max: 100, color: '#0d9488', count: 0 },
        ];

        let totalDiagnosticsCount = 0;
        scoresByModule.forEach(m => {
          const score = Math.round(Number(m.avg_credibilized_score || m.avg_score || 0));
          const count = Number(m.total || 0);
          totalDiagnosticsCount += count;

          const b = brackets.find(br => score >= br.min && score <= br.max);
          if (b) b.count += count;
        });

        if (totalDiagnosticsCount === 0) {
          // Fallback fictif propre si aucun score
          return brackets.map(b => ({ ...b, percentage: 0 }));
        }

        return brackets.map(b => ({
          ...b,
          percentage: Math.round((b.count / totalDiagnosticsCount) * 100),
        }));
      })
      .catch(err => {
        console.error('Error fetching score distribution from backend, fallback:', err);
        const diags = LocalStoreRepository.getDiagnostics();
        const brackets = [
          { label: 'Critique',   min: 0,  max: 29,  color: '#ef4444', count: 0 },
          { label: 'Faible',     min: 30, max: 49,  color: '#f97316', count: 0 },
          { label: 'Moyen',      min: 50, max: 69,  color: '#eab308', count: 0 },
          { label: 'Bon',        min: 70, max: 84,  color: '#22c55e', count: 0 },
          { label: 'Excellent',  min: 85, max: 100, color: '#0d9488', count: 0 },
        ];
        diags.forEach(d => {
          const score = d.score || 0;
          const b = brackets.find(br => score >= br.min && score <= br.max);
          if (b) b.count += 1;
        });
        const total = diags.length;
        return brackets.map(b => ({
          ...b,
          percentage: total > 0 ? Math.round((b.count / total) * 100) : 0,
        }));
      });
  },

  getTopSectors() {
    // Le backend renvoie la répartition territoriale (régions)
    return apiFetch('/admin/dashboard/territory')
      .then(res => {
        const data = res?.data || res;
        const regions = data.regions || [];
        if (!Array.isArray(regions)) return [];

        // On mappe les régions comme "secteurs" pour que Dashboard.jsx les affiche sans changer toute sa structure
        return regions.map(r => ({
          sector: r.region || 'Inconnu',
          count: r.diagnostic_count || 0
        }));
      })
      .catch(err => {
        console.error('Error fetching sectors from backend, fallback:', err);
        const users = LocalStoreRepository.getUsers();
        const sectorCounts = {};
        users.forEach(u => {
          if (u.sector) {
            sectorCounts[u.sector] = (sectorCounts[u.sector] || 0) + 1;
          }
        });
        return Object.entries(sectorCounts)
          .map(([sector, count]) => ({ sector, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
      });
  },
};
