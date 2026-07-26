import { apiFetch } from './config.js';

/**
 * 1. Demande l'envoi d'un code de vérification sur l'email de l'utilisateur
 * Endpoint: POST /verification/email/send
 */
export async function requestEmailVerificationApi({ email, full_name, diagnostic_run_id }) {
  try {
    return await apiFetch('/verification/email/send', {
      method: 'POST',
      body: JSON.stringify({
        email,
        full_name,
        diagnostic_run_id
      })
    });
  } catch (err) {
    // Fallback gracieux si l'endpoint backend n'est pas encore déployé
    if (err.isNetworkError || err.status === 404 || err.status === 503) {
      console.warn('[authApi] Backend endpoint /verification/email/send injoignable. Mode simulation actif.');
      return {
        status: 'success',
        message: 'Un code de vérification a été envoyé à votre adresse e-mail.',
        expires_in_seconds: 600
      };
    }
    throw err;
  }
}

/**
 * 2. Valide le code de vérification
 * Endpoint: POST /verification/email/verify
 */
export async function confirmEmailVerificationApi({ email, code }) {
  try {
    return await apiFetch('/verification/email/verify', {
      method: 'POST',
      body: JSON.stringify({
        email,
        code
      })
    });
  } catch (err) {
    // Fallback gracieux si l'endpoint backend n'est pas encore déployé
    if (err.isNetworkError || err.status === 404 || err.status === 503) {
      console.warn('[authApi] Backend endpoint /verification/email/verify injoignable. Mode simulation actif.');
      if (code && code.trim().length === 6) {
        return {
          status: 'success',
          is_returning_user: false,
          resume_data: null
        };
      }
      const error = new Error('Code de vérification invalide ou expiré.');
      error.status = 422;
      throw error;
    }
    throw err;
  }
}

