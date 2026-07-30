import { apiFetch, API_BASE_URL } from './config.js';

const adminBase = API_BASE_URL.startsWith('http')
  ? API_BASE_URL.replace(/\/bc\/?$/, '')
  : 'https://business-chekcup.nicktep.com/api';

export const pmeApi = {
  getAll() {
    return apiFetch(`${adminBase}/bc/admin/dashboard/pmes`)
      .then(res => res?.data || res || [])
      .catch(err => {
        console.error('[pmeApi.getAll] Error fetching PMEs:', err);
        return [];
      });
  }
};
