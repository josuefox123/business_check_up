import { apiFetch, API_BASE_URL } from './config.js';

// Les routes admin/appointments ne sont pas sous /bc, on construit l'URL canonique directement
const adminBase = API_BASE_URL.startsWith('http')
  ? API_BASE_URL.replace(/\/bc\/?$/, '')
  : 'https://business-chekcup.nicktep.com/api';

export const rendezVousApi = {
  getAll(status = '') {
    const endpoint = status
      ? `${adminBase}/admin/appointments?status=${status}`
      : `${adminBase}/admin/appointments`;
    return apiFetch(endpoint)
      .then(res => res?.data || res || [])
      .catch(err => {
        console.error('[rendezVousApi.getAll] Error fetching appointments:', err);
        return [];
      });
  },

  confirm(id, date, meetingLink = '', location = '') {
    return apiFetch(`${adminBase}/admin/appointments/${id}/confirm`, {
      method: 'POST',
      body: JSON.stringify({
        confirmed_starts_at: date,
        meeting_link: meetingLink || null,
        location: location || null
      })
    });
  },

  cancel(id) {
    return apiFetch(`${adminBase}/admin/appointments/${id}/cancel`, {
      method: 'POST'
    });
  },

  complete(id) {
    return apiFetch(`${adminBase}/admin/appointments/${id}/complete`, {
      method: 'POST'
    });
  }
};
