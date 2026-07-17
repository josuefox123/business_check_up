/**
 * Configuration de l'API Laravel pour Business Check-up
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://business-chekcup.nicktep.com/api/api/bc';

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
    const error = new Error(errorData.message || `API Error: ${response.statusText}`);
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
