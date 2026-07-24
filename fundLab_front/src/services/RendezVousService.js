import { rendezVousApi } from '../api/rendezVousApi.js';

export const RendezVousService = {
  getAppointments(status = '') {
    return rendezVousApi.getAll(status);
  },
  confirmAppointment(id, date, meetingLink = '', location = '') {
    return rendezVousApi.confirm(id, date, meetingLink, location);
  },
  cancelAppointment(id) {
    return rendezVousApi.cancel(id);
  },
  completeAppointment(id) {
    return rendezVousApi.complete(id);
  }
};
