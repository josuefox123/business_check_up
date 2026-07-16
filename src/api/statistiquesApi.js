/**
 * STATISTIQUES API — MOCK LAYER
 * Returns JS Promises resolving live-computed data from LocalStoreRepository.
 * Each method maps 1-to-1 with a future REST endpoint:
 *   GET /api/admin/stats/overview
 *   GET /api/admin/stats/activity?days=7
 *   GET /api/admin/stats/modules
 *   GET /api/admin/stats/scores/distribution
 *   GET /api/admin/stats/sectors
 *
 * To switch to real API: replace Promise.resolve(...) with fetch/axios calls.
 */

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
   * GET /api/admin/stats/overview
   * Returns global KPI summary for the dashboard top cards.
   */
  getOverview() {
    const diags = LocalStoreRepository.getDiagnostics();
    const users = LocalStoreRepository.getUsers();

    const now = new Date();
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);

    // Split into current week vs previous week
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

    // Average score across all diagnostics
    const totalScore = diags.reduce((sum, d) => sum + (d.score || 0), 0);
    const avgScore = diags.length > 0 ? Math.round(totalScore / diags.length) : 0;

    // Score this week vs last week
    const avgScoreThisWeek = diagsThisWeek.length > 0
      ? Math.round(diagsThisWeek.reduce((s, d) => s + (d.score || 0), 0) / diagsThisWeek.length)
      : 0;
    const avgScorePrevWeek = diagsPrevWeek.length > 0
      ? Math.round(diagsPrevWeek.reduce((s, d) => s + (d.score || 0), 0) / diagsPrevWeek.length)
      : 0;

    // Module counts
    const moduleCounts = {};
    diags.forEach(d => {
      moduleCounts[d.moduleId] = (moduleCounts[d.moduleId] || 0) + 1;
    });

    // Most used module
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

    // Unread notifications count
    const notifs = LocalStoreRepository.getNotifications();
    const unreadNotifs = notifs.filter(n => !n.read).length;

    return Promise.resolve({
      // --- Core KPIs ---
      totalDiagnostics: diags.length,
      totalUsers: users.length,
      avgScore,
      unreadNotifications: unreadNotifs,

      // --- Weekly trends (for trend badges) ---
      diagsThisWeek: diagsThisWeek.length,
      diagsTrend: computeTrend(diagsThisWeek.length, diagsPrevWeek.length),
      usersTrend: computeTrend(usersThisWeek.length, usersPrevWeek.length),
      scoreTrend: computeTrend(avgScoreThisWeek, avgScorePrevWeek),

      // --- Module breakdown ---
      mostUsedModule,
      mostUsedModuleName,
      mostUsedModulePercentage: diags.length > 0 ? Math.round((maxCount / diags.length) * 100) : 0,
      moduleCounts,
    });
  },

  /**
   * GET /api/admin/stats/activity?days=7
   * Returns daily diagnostic counts for the last N days.
   */
  getActivityChart(days = 7) {
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
    return Promise.resolve(result);
  },

  /**
   * GET /api/admin/stats/modules
   * Returns per-module stats: count, average score, completion rate.
   */
  getModuleStats() {
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
    return Promise.resolve(
      Object.values(stats).map(m => ({
        ...m,
        avgScore: m.count > 0 ? Math.round(m.totalScore / m.count) : 0,
        percentage: total > 0 ? Math.round((m.count / total) * 100) : 0,
      })).sort((a, b) => b.count - a.count)
    );
  },

  /**
   * GET /api/admin/stats/scores/distribution
   * Returns score bracket breakdown: Critical / Medium / Good / Excellent.
   */
  getScoreDistribution() {
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
    return Promise.resolve(brackets.map(b => ({
      ...b,
      percentage: total > 0 ? Math.round((b.count / total) * 100) : 0,
    })));
  },

  /**
   * GET /api/admin/stats/sectors
   * Returns top sectors from the user profiles.
   */
  getTopSectors() {
    const users = LocalStoreRepository.getUsers();
    const sectorCounts = {};
    users.forEach(u => {
      if (u.sector) {
        sectorCounts[u.sector] = (sectorCounts[u.sector] || 0) + 1;
      }
    });
    return Promise.resolve(
      Object.entries(sectorCounts)
        .map(([sector, count]) => ({ sector, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    );
  },
};
