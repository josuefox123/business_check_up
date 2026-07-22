/**
 * NOTIFICATION SERVICE — FUND.lab
 * Domain service logic for admin notifications.
 */

import { notificationsApi } from '../api/notificationsApi.js';

export const NotificationService = {
  getNotifications() {
    return notificationsApi.getAll();
  },
  markAsRead(id) {
    return notificationsApi.markAsRead(id);
  },
  addNotification(notif) {
    return notificationsApi.create(notif);
  },
  deleteNotification(id) {
    return notificationsApi.delete(id);
  }
};
