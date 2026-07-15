/**
 * PARAMETRE SERVICE — FUND.lab
 * Domain service logic for app parameters.
 */

import { parametresApi } from '../api/parametresApi.js';

export const ParametreService = {
  getSettings() {
    return parametresApi.get();
  },
  saveSettings(settings) {
    return parametresApi.save(settings);
  }
};
