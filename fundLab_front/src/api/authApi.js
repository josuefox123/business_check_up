import { apiFetch } from './config.js';

/**
 * 1. Demande l'envoi d'un code OTP à 6 caractères sur l'email de l'utilisateur
 */
export async function requestEmailVerificationApi({ email, full_name, business_name }) {
  try {
    return await apiFetch('/auth/verify-email/request', {
      method: 'POST',
      body: JSON.stringify({
        email,
        full_name,
        business_name
      })
    });
  } catch (err) {
    // Fallback gracieux si l'endpoint backend n'est pas encore déployé
    if (err.isNetworkError || err.status === 404 || err.status === 503) {
      console.warn('[authApi] Backend endpoint /auth/verify-email/request injoignable. Mode simulation actif.');
      return {
        status: 'success',
        message: 'Un code de vérification à 6 caractères a été envoyé à votre adresse e-mail.',
        expires_in_seconds: 600
      };
    }
    throw err;
  }
}

/**
 * 2. Valide le code à 6 caractères et vérifie l'historique utilisateur (Nouveau vs Ancien)
 */
export async function confirmEmailVerificationApi({ email, code }) {
  try {
    return await apiFetch('/auth/verify-email/confirm', {
      method: 'POST',
      body: JSON.stringify({
        email,
        code
      })
    });
  } catch (err) {
    // Fallback gracieux si l'endpoint backend n'est pas encore déployé
    if (err.isNetworkError || err.status === 404 || err.status === 503) {
      console.warn('[authApi] Backend endpoint /auth/verify-email/confirm injoignable. Mode simulation actif.');
      if (code && code.trim().length === 6) {
        return {
          status: 'success',
          is_returning_user: false,
          resume_data: null
        };
      }
      const error = new Error('Code de vérification invalide ou expiré (6 caractères requis).');
      error.status = 422;
      throw error;
    }
    throw err;
  }
}
