/**
 * DIAGNOSTICS API — MOCK LAYER
 * Returns JS Promises resolving data from LocalStoreRepository.
 * Safe to swap with REST calls later.
 */

import { LocalStoreRepository } from '../repositories/LocalStoreRepository.js';

export const diagnosticsApi = {
  getAll() {
    return Promise.resolve(LocalStoreRepository.getDiagnostics());
  },
  getById(id) {
    const list = LocalStoreRepository.getDiagnostics();
    const item = list.find(d => d.id === id);
    return Promise.resolve(item || null);
  },
  create(diag) {
    const newDiag = {
      ...diag,
      id: diag.id || `DIAG-${Date.now()}`,
      date: diag.date || new Date().toISOString()
    };
    LocalStoreRepository.saveDiagnostic(newDiag);
    return Promise.resolve(newDiag);
  },
  delete(id) {
    LocalStoreRepository.deleteDiagnostic(id);
    return Promise.resolve(true);
  }
};
