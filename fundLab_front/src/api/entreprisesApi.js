/**
 * ENTREPRISES API — MOCK LAYER
 * Returns JS Promises resolving data from LocalStoreRepository.
 * Safe to swap with REST calls later.
 */

import { LocalStoreRepository } from '../repositories/LocalStoreRepository.js';

export const entreprisesApi = {
  getAll() {
    const users = LocalStoreRepository.getUsers();
    // Return all enterprises associated with users
    const enterprises = users.map(u => ({
      id: `ENT-${u.id.split('-')[1] || Date.now()}`,
      name: u.companyName || 'Non renseigné',
      sector: u.sector || 'Autre',
      department: u.department || 'Non localisé',
      commune: u.commune || 'Non localisé',
      ownerName: u.name,
      ownerEmail: u.email,
      ownerPhone: u.phone,
      dateJoined: u.dateJoined
    }));
    return Promise.resolve(enterprises);
  }
};
