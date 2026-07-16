/**
 * SESSIONS API — Business Check-up
 */

import { apiFetch } from './config.js';

/**
 * Créer une nouvelle session utilisateur
 * POST /sessions
 */
export async function createSessionApi() {
  return apiFetch('/sessions', {
    method: 'POST'
  });
}

/**
 * Enregistrer le consentement utilisateur
 * POST /sessions/{sessionId}/consent
 */
export async function submitConsentApi(sessionId, consent = true) {
  return apiFetch(`/sessions/${sessionId}/consent`, {
    method: 'POST',
    body: JSON.stringify({ consent })
  });
}
