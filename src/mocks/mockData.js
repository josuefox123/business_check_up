/**
 * MOCK DATA — FUND.lab
 * Centralized data models for frontend execution and future API alignment.
 */

// Initial diagnostics run history
export const INITIAL_DIAGNOSTICS = [];

// Initial users list (CCI prospects)
export const INITIAL_USERS = [];

// Initial app settings
export const INITIAL_SETTINGS = {
  scoreThresholds: {
    critique: 40,
    moyen: 70
  },
  general: {
    appName: 'Business Check-up',
    organizationName: 'CCI Bénin',
    contactEmail: 'contact@cci.bj',
    enablePdfExport: true,
    maintenanceMode: false
  }
};

// Initial admin notifications list
export const INITIAL_NOTIFICATIONS = [];

// Centralizer to import directly if needed, but LocalStoreRepository will manage active state
export const DEFAULT_MOCK_DATA = {
  questionnaires: {
    triage: {},
    modules: {},
    catalog: {}
  },
  diagnostics: INITIAL_DIAGNOSTICS,
  users: INITIAL_USERS,
  settings: INITIAL_SETTINGS,
  notifications: INITIAL_NOTIFICATIONS
};
