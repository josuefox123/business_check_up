/**
 * STATISTIQUES API — MOCK LAYER
 * Returns JS Promises resolving data from LocalStoreRepository.
 * Safe to swap with REST calls later.
 */

import { LocalStoreRepository } from '../repositories/LocalStoreRepository.js';

export const statistiquesApi = {
  getOverview() {
    const diags = LocalStoreRepository.getDiagnostics();
    const users = LocalStoreRepository.getUsers();
    
    // Calculate module counts
    const moduleCounts = diags.reduce((acc, d) => {
      acc[d.moduleId] = (acc[d.moduleId] || 0) + 1;
      return acc;
    }, {});

    // Find the most used module name
    let mostUsedModule = 'Aucun';
    let maxCount = 0;
    Object.entries(moduleCounts).forEach(([mId, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostUsedModule = mId;
      }
    });

    return Promise.resolve({
      totalDiagnostics: diags.length,
      totalUsers: users.length,
      mostUsedModule,
      mostUsedModulePercentage: diags.length > 0 ? Math.round((maxCount / diags.length) * 100) : 0,
      monthlyProgress: 12, // simulated
      userProgress: 5, // simulated
      moduleCounts
    });
  }
};
