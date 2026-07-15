/**
 * ENTREPRISE SERVICE — FUND.lab
 * Domain service logic for querying registered companies.
 */

import { entreprisesApi } from '../api/entreprisesApi.js';

export const EntrepriseService = {
  getEnterprises() {
    return entreprisesApi.getAll();
  }
};
