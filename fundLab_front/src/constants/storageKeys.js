/**
 * Clés centralisées pour le localStorage de l'application Business Check-up
 */
export const STORAGE_KEYS = {
  DIAG_STATE: 'bc_diag_state',
  SESSION_ID: 'bc_session_id',
  TRIAGE_ID: 'bc_triage_id',
  RECOMMENDED_MODULE: 'bc_recommended_module_code',
  CURRENT_RUN_ID: 'bc_current_run_id',
  IS_AUTHENTICATED: 'bc_is_authenticated',
  USER_EMAIL: 'bc_user_email',
  USER_PROFILE: 'bc_user_profile',
};

/**
 * Nettoie uniquement les clés liées au diagnostic en cours (sans toucher aux données utilisateur/auth)
 */
export function clearDiagnosticStorage() {
  try {
    const diagnosticKeys = [
      STORAGE_KEYS.DIAG_STATE,
      STORAGE_KEYS.SESSION_ID,
      STORAGE_KEYS.TRIAGE_ID,
      STORAGE_KEYS.RECOMMENDED_MODULE,
      STORAGE_KEYS.CURRENT_RUN_ID,
    ];
    diagnosticKeys.forEach(key => localStorage.removeItem(key));
  } catch (e) {
    console.error('Error clearing diagnostic storage keys:', e);
  }
}
