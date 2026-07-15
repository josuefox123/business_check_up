/**
 * NOTIFICATIONS API — MOCK LAYER
 * Returns JS Promises resolving data from LocalStoreRepository.
 * Safe to swap with REST calls later.
 */

import { LocalStoreRepository } from '../repositories/LocalStoreRepository.js';

export const notificationsApi = {
  getAll() {
    return Promise.resolve(LocalStoreRepository.getNotifications());
  },
  markAsRead(id) {
    const list = LocalStoreRepository.getNotifications();
    const item = list.find(n => n.id === id);
    if (item) {
      item.read = true;
      LocalStoreRepository.saveNotification(item);
    }
    return Promise.resolve(true);
  },
  create(notification) {
    const newNotif = {
      ...notification,
      id: notification.id || `NOT-${Date.now()}`,
      read: false,
      date: new Date().toISOString()
    };
    LocalStoreRepository.saveNotification(newNotif);
    return Promise.resolve(newNotif);
  },
  delete(id) {
    LocalStoreRepository.deleteNotification(id);
    return Promise.resolve(true);
  }
};
