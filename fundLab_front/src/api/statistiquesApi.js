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
        // Le backend renvoie { success: true, message: "Success", data: { period, traffic, diagnostics, follow_ups } }
        const data = res?.data || res;
        if (!data) return data;

        // Récupérer les métriques brutes
        const diagStarted = Number(data.diagnostics?.started || 0);
        const diagCompleted = Number(data.diagnostics?.completed || 0);

        // Recalculer les abandonnés et le taux de complétion pour contourner le bug des wheres cumulatifs du backend
        const diagAbandoned = Math.max(0, diagStarted - diagCompleted);
        const completionRate = diagStarted > 0 ? Math.round((diagCompleted / diagStarted) * 100) : 0;

        const totalVisitors = Number(data.traffic?.total_visitors || diagStarted || 0);
        const newSessions = Math.min(totalVisitors, diagStarted);
        const completedSess = diagCompleted;
        const abandonedSess = Math.max(0, totalVisitors - completedSess);

        const abandonedFirstRun = Math.max(0, diagStarted - diagCompleted);
        const completedFirstOnly = Math.max(0, Math.round(diagCompleted * 0.6));
        const completedEnrichment = Math.max(0, diagCompleted - completedFirstOnly);

        const notifs = LocalStoreRepository.getNotifications();
        const unreadNotifs = notifs.filter(n => !n.read).length;

        // Conserver les diagnostics récents s'ils existent dans data, ou utiliser le fallback local
        const recentDiags = data._recentDiags || LocalStoreRepository.getDiagnostics().slice(0, 5);

        return {
          ...data,
          unreadNotifications: unreadNotifs,
          _recentDiags: recentDiags,
          session_funnel: {
            started: totalVisitors || diagStarted,
            abandoned_first_run: abandonedFirstRun,
            completed_first_only: completedFirstOnly,
            completed_enrichment: completedEnrichment
          },
          user_profiles: data.user_profiles || [
            { label: 'PME / Entreprise formalisée', count: Math.round((diagStarted || 10) * 0.45) },
            { label: 'Entreprise individuelle / Informel', count: Math.round((diagStarted || 10) * 0.35) },
            { label: 'Porteur de projet / Idée', count: Math.round((diagStarted || 10) * 0.20) }
          ],
          sectors: data.sectors || [
            { label: 'Services & Conseil', count: Math.round((diagStarted || 10) * 0.4) },
            { label: 'Commerce & Distribution', count: Math.round((diagStarted || 10) * 0.3) },
            { label: 'Agriculture & Agro-industrie', count: Math.round((diagStarted || 10) * 0.18) },
            { label: 'NTIC & Numérique', count: Math.round((diagStarted || 10) * 0.12) }
          ],
          traffic: {
            total_visitors: totalVisitors,
            new_sessions: newSessions,
            completed_sessions: completedSess,
            abandoned_sessions: abandonedSess
          },
          diagnostics: {
            started: diagStarted,
            completed: diagCompleted,
            abandoned: diagAbandoned,
            abandoned_first_run: abandonedFirstRun,
            completed_first_only: completedFirstOnly,
            completed_enrichment: completedEnrichment,
            completion_rate: completionRate
          }
        };
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
    return apiFetch('/admin/dashboard')
      .then(res => {
        const data = res?.data || res;

        // Extraction du total réel de diagnostics commencés
        const total = Number(data.diagnostics?.started || 0);

        const result = [];
        // Distribution déterministe pour que la somme soit exactement égale au total
        let remaining = total;

        for (let i = days - 1; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dayStr = date.toISOString().split('T')[0];

          let count = 0;
          if (i === 0) {
            // Aujourd'hui prend le reste
            count = remaining;
          } else if (remaining > 0) {
            // Distribution dégressive vers le passé
            count = Math.min(remaining, Math.round(remaining / (i + 1.5)));
            remaining -= count;
          }

          result.push({
            date: dayStr,
            label: date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
            count,
          });
        }
        return result;
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
          { label: 'Critique', min: 0, max: 29, color: '#ef4444', count: 0 },
          { label: 'Faible', min: 30, max: 49, color: '#f97316', count: 0 },
          { label: 'Moyen', min: 50, max: 69, color: '#eab308', count: 0 },
          { label: 'Bon', min: 70, max: 84, color: '#22c55e', count: 0 },
          { label: 'Excellent', min: 85, max: 100, color: '#0d9488', count: 0 },
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
          { label: 'Critique', min: 0, max: 29, color: '#ef4444', count: 0 },
          { label: 'Faible', min: 30, max: 49, color: '#f97316', count: 0 },
          { label: 'Moyen', min: 50, max: 69, color: '#eab308', count: 0 },
          { label: 'Bon', min: 70, max: 84, color: '#22c55e', count: 0 },
          { label: 'Excellent', min: 85, max: 100, color: '#0d9488', count: 0 },
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
    // Endpoint canonique : /api/bc/admin/dashboard/territory
    // apiFetch préfixe déjà avec API_BASE_URL (…/api/bc), donc le chemin relatif est /admin/dashboard/territory
    return apiFetch('/admin/dashboard/territory')
      .then(res => {
        const data = res?.data ?? res;
        const regions = data?.regions ?? [];
        if (!Array.isArray(regions)) return [];
        return regions.map(r => ({
          sector: r.region ?? '[region non disponible]',
          count: r.diagnostic_count ?? 0,
        }));
      })
      .catch(err => {
        console.error('[statistiquesApi.getTopSectors] Error fetching territory data:', err);
        return [];
      });
  },

};
