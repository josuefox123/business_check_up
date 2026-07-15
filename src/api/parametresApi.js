/**
 * PARAMETRES API — MOCK LAYER
 * Returns JS Promises resolving data from LocalStoreRepository.
 * Safe to swap with REST calls later.
 */

import { LocalStoreRepository } from '../repositories/LocalStoreRepository.js';

export const parametresApi = {
  get() {
    return Promise.resolve(LocalStoreRepository.getSettings());
  },
  save(settings) {
    LocalStoreRepository.saveSettings(settings);
    return Promise.resolve(settings);
  }
};
