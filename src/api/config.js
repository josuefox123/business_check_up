/**
 * Configuration de l'API Laravel pour Business Check-up
 * BASE URL: https://business-chekcup.nicktep.com/api/api/bc
 * Le serveur est configuré avec le préfixe /api/bc dans routes/api.php,
 * mais le host ajoute déjà un /api — on garde la valeur actuelle qui fonctionne.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://business-chekcup.nicktep.com/api/api/bc';

/**
 * Convertit une durée en secondes (integer) en label lisible "X-Y min"
 * Conforme au format `target_duration` du backend (integer secondes).
 */
export function formatDurationSeconds(seconds) {
  if (!seconds || typeof seconds !== 'number') return '';
  const minutes = Math.round(seconds / 60);
  if (minutes <= 5)  return `${minutes} min`;
  if (minutes <= 8)  return '7-10 min';
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

  // Récupérer le token de session si stocké
  const sessionId = localStorage.getItem('bc_session_id');
  if (sessionId) {
    headers['X-Session-ID'] = sessionId;
  }

  // Récupérer le token auth admin si connecté
  const token = localStorage.getItem('admin_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  // Si pas de contenu (204)
  if (response.status === 204) {
    return null;
  }

  return response.json();
}
