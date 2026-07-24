import { apiFetch } from './config.js';

export const rendezVousApi = {
  getAll(status = '') {
    const endpoint = status ? `/admin/appointments?status=${status}` : '/admin/appointments';
    return apiFetch(endpoint)
      .then(res => res?.data || res || [])
      .catch(err => {
        console.error('Error fetching appointments from backend:', err);
        return [];
      });
  },

  confirm(id, date, meetingLink = '', location = '') {
    return apiFetch(`/admin/appointments/${id}/confirm`, {
      method: 'POST',
      body: JSON.stringify({
        confirmed_starts_at: date,
        meeting_link: meetingLink || null,
        location: location || null
      })
    });
  },

  cancel(id) {
    return apiFetch(`/admin/appointments/${id}/cancel`, {
      method: 'POST'
    });
  },

  complete(id) {
    return apiFetch(`/admin/appointments/${id}/complete`, {
      method: 'POST'
    });
  }
};
