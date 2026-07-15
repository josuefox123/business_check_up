/**
 * RAPPORT API — MOCK LAYER
 * Handles report simulation and generation of scores, strengths, and weaknesses.
 * Safe to swap with REST calls later.
 */

import { generateFullResults } from './results.js';

export const rapportsApi = {
  generateReport(moduleId, answers, score) {
    const reportData = generateFullResults(moduleId, answers, score);
    return Promise.resolve({
      moduleId,
      score,
      confidence: reportData.confidence,
      level: reportData.level,
      forces: reportData.forces || [],
      fragilites: reportData.fragilites || [],
      recommendations: reportData.recommendations || [],
      actionPlan: reportData.actionPlan || [],
      generatedAt: new Date().toISOString()
    });
  }
};
