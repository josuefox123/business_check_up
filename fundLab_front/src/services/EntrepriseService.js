/**
 * ENTREPRISE SERVICE — FUND.lab
 * Domain service logic for querying registered companies.
 */

import { pmeApi } from '../api/pmeApi.js';

export const EntrepriseService = {
  getEnterprises() {
    return pmeApi.getAll();
  }
};
