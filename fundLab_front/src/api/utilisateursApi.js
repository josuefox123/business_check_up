/**
 * UTILISATEURS API — MOCK LAYER
 * Returns JS Promises resolving data from LocalStoreRepository.
 * Safe to swap with REST calls later.
 */

import { LocalStoreRepository } from '../repositories/LocalStoreRepository.js';

export const utilisateursApi = {
  getAll() {
    return Promise.resolve(LocalStoreRepository.getUsers());
  },
  getById(id) {
    const list = LocalStoreRepository.getUsers();
    const item = list.find(u => u.id === id);
    return Promise.resolve(item || null);
  },
  createOrUpdate(user) {
    const users = LocalStoreRepository.getUsers();
    const existing = users.find(u => u.id === user.id || (u.email && u.email === user.email));
    
    const preparedUser = {
      ...existing,
      ...user,
      id: user.id || existing?.id || `USR-${Date.now()}`,
      dateJoined: user.dateJoined || existing?.dateJoined || new Date().toISOString()
    };
    
    LocalStoreRepository.saveUser(preparedUser);
    return Promise.resolve(preparedUser);
  },
  delete(id) {
    LocalStoreRepository.deleteUser(id);
    return Promise.resolve(true);
  }
};
