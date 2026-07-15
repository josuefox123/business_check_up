/**
 * UTILISATEUR SERVICE — FUND.lab
 * Domain service logic for registering and managing user profiles.
 */

import { utilisateursApi } from '../api/utilisateursApi.js';

export const UtilisateurService = {
  getUsers() {
    return utilisateursApi.getAll();
  },
  getUserById(id) {
    return utilisateursApi.getById(id);
  },
  registerUser(user) {
    return utilisateursApi.createOrUpdate(user);
  },
  deleteUser(id) {
    return utilisateursApi.delete(id);
  }
};
