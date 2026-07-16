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

  /**
   * GET /api/bc/admin/dashboard
   * Returns global KPI summary for the dashboard top cards.
   */
  getOverview() {
    return apiFetch('/admin/dashboard')
      .catch(err => {
        console.error('Error fetching admin dashboard overview from backend, using fallback:', err);
        const diags = LocalStoreRepository.getDiagnostics();
        const users = LocalStoreRepository.getUsers();

        const now = new Date();
        const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);

        const diagsThisWeek = diags.filter(d => new Date(d.date) >= sevenDaysAgo);
        const diagsPrevWeek = diags.filter(d => {
          const dt = new Date(d.date);
          return dt >= fourteenDaysAgo && dt < sevenDaysAgo;
        });
        const usersThisWeek = users.filter(u => new Date(u.dateJoined || u.date || now) >= sevenDaysAgo);
        const usersPrevWeek = users.filter(u => {
          const dt = new Date(u.dateJoined || u.date || now);
          return dt >= fourteenDaysAgo && dt < sevenDaysAgo;
        });

        const totalScore = diags.reduce((sum, d) => sum + (d.score || 0), 0);
        const avgScore = diags.length > 0 ? Math.round(totalScore / diags.length) : 0;

        const avgScoreThisWeek = diagsThisWeek.length > 0
          ? Math.round(diagsThisWeek.reduce((s, d) => s + (d.score || 0), 0) / diagsThisWeek.length)
          : 0;
        const avgScorePrevWeek = diagsPrevWeek.length > 0
          ? Math.round(diagsPrevWeek.reduce((s, d) => s + (d.score || 0), 0) / diagsPrevWeek.length)
          : 0;

        const moduleCounts = {};
        diags.forEach(d => {
          moduleCounts[d.moduleId] = (moduleCounts[d.moduleId] || 0) + 1;
        });

        let mostUsedModule = 'Aucun';
        let mostUsedModuleName = 'Aucun';
        let maxCount = 0;
        Object.entries(moduleCounts).forEach(([mId, count]) => {
          if (count > maxCount) {
            maxCount = count;
            mostUsedModule = mId;
            mostUsedModuleName = MODULE_NAMES[mId] || mId;
          }
        });

        const notifs = LocalStoreRepository.getNotifications();
        const unreadNotifs = notifs.filter(n => !n.read).length;

        return {
          totalDiagnostics: diags.length,
          totalUsers: users.length,
          avgScore,
          unreadNotifications: unreadNotifs,
          diagsThisWeek: diagsThisWeek.length,
          diagsTrend: computeTrend(diagsThisWeek.length, diagsPrevWeek.length),
          usersTrend: computeTrend(usersThisWeek.length, usersPrevWeek.length),
          scoreTrend: computeTrend(avgScoreThisWeek, avgScorePrevWeek),
          mostUsedModule,
          mostUsedModuleName,
          mostUsedModulePercentage: diags.length > 0 ? Math.round((maxCount / diags.length) * 100) : 0,
          moduleCounts,
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
        if (!Array.isArray(res)) return [];
        return res.map(m => ({
          ...m,
          name: MODULE_NAMES[m.moduleId] || m.name || m.moduleId
        }));
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

  /**
   * GET /api/bc/admin/dashboard/scores
   * Returns score bracket breakdown.
   */
  getScoreDistribution() {
    return apiFetch('/admin/dashboard/scores')
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

  /**
   * GET /api/bc/admin/dashboard/territory
   * Returns top sectors.
   */
  getTopSectors() {
    return apiFetch('/admin/dashboard/territory')
      .then(res => {
        // Adapter le format du backend (par exemple répartition par secteur)
        if (res && res.sectors) {
          return res.sectors;
        }
        if (Array.isArray(res)) return res;
        return [];
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
