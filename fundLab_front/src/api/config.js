/**
 * Configuration de l'API Laravel pour Business Check-up
 * BASE URL: https://business-chekcup.nicktep.com/docs/api
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://business-chekcup.nicktep.com/api/bc';

/**
 * Convertit une durée en secondes (integer) en label lisible "X-Y min"
 * Conforme au format `target_duration` du backend (integer secondes).
 */
export function formatDurationSeconds(seconds) {
  if (!seconds || typeof seconds !== 'number') return '';
  const minutes = Math.round(seconds / 60);
  if (minutes <= 5) return `${minutes} min`;
  if (minutes <= 8) return '7-10 min';
  if (minutes <= 12) return '8-12 min';
  if (minutes <= 15) return '10-15 min';
  if (minutes <= 20) return '15-20 min';
  if (minutes <= 35) return '30-45 min';
  return `${minutes} min`;
}

/**
 * Client API générique (fetch wrapper)
 */
export async function apiFetch(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers || {})
  };

  // Si vous gardez un jeton admin classique :
  const adminToken = localStorage.getItem('admin_token');
  if (adminToken) {
    headers['Authorization'] = `Bearer ${adminToken}`;
  }

  let response;
  try {
    response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers
    });
  } catch (err) {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.onLine === false) {
      window.dispatchEvent(new CustomEvent('api-offline', { detail: true }));
    }
    const error = new Error(`Network Error: Le serveur API est injoignable.`);
    error.status = 503;
    error.isNetworkError = true;
    throw error;
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}