/**
 * SESSIONS API — Business Check-up
 */

import { apiFetch } from './config.js';

/**
 * Détecter grossièrement le type d'appareil
 */
function getDeviceType() {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

/**
 * Récupérer l'IP publique de l'utilisateur avec un timeout rapide
 */
async function getUserIp() {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 1200);
    const res = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
    clearTimeout(id);
    const data = await res.json();
    return data.ip || '127.0.0.1';
  } catch (e) {
    return '127.0.0.1';
  }
}

/**
 * Créer une nouvelle session utilisateur
 * POST /sessions
 */
export async function createSessionApi(entryMode = 'assisted') {
  const ip = await getUserIp();
  return apiFetch('/sessions', {
    method: 'POST',
    body: JSON.stringify({
      entry_source: 'direct',
      entry_mode: entryMode,
      device_type: getDeviceType(),
      browser_language: 'fr',
      ip_address: ip
    })
  });
}

/**
 * Enregistrer le consentement utilisateur
 * POST /sessions/{sessionId}/consent
 */
export async function submitConsentApi(sessionId, consent = true) {
  return apiFetch(`/sessions/${sessionId}/consent`, {
    method: 'POST',
    body: JSON.stringify({
      consent_diagnostic: consent,
      consent_aggregate: consent,
      consent_contact: false,
      consent_pdf_email: false
    })
  });
}

/**
 * Mettre à jour le statut et le dernier écran de la session
 * PATCH /sessions/{sessionId}
 */
export async function updateSessionApi(sessionId, status, lastScreenId = null) {
  return apiFetch(`/sessions/${sessionId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      status,
      last_screen_id: lastScreenId
    })
  });
}

/**
 * Abandonner une session
 * DELETE /sessions/{sessionId}/abandon
 */
export async function abandonSessionApi(sessionId, lastScreenId = null) {
  return apiFetch(`/sessions/${sessionId}/abandon`, {
    method: 'DELETE',
    body: JSON.stringify({
      last_screen_id: lastScreenId
    })
  });
}
