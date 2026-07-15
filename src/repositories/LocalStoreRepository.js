/**
 * LOCAL STORAGE REPOSITORY — FUND.lab
 * Pure data access layer mimicking database query operations.
 * Component layers should never call this directly; they interact through Services.
 */

import { DEFAULT_MOCK_DATA } from '../mocks/mockData.js';

const KEYS = {
  DIAGNOSTICS: 'fundlab_diagnostics',
  USERS: 'fundlab_users',
  QUESTIONNAIRES: 'fundlab_questionnaires',
  SETTINGS: 'fundlab_settings',
  NOTIFICATIONS: 'fundlab_notifications'
};

// Auto-initialize storage database on first load
export const initRepository = () => {
  if (!localStorage.getItem(KEYS.SETTINGS)) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_MOCK_DATA.settings));
  }
  if (!localStorage.getItem(KEYS.DIAGNOSTICS)) {
    localStorage.setItem(KEYS.DIAGNOSTICS, JSON.stringify(DEFAULT_MOCK_DATA.diagnostics));
  }
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(DEFAULT_MOCK_DATA.users));
  }
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(DEFAULT_MOCK_DATA.notifications));
  }
  if (!localStorage.getItem(KEYS.QUESTIONNAIRES)) {
    localStorage.setItem(KEYS.QUESTIONNAIRES, JSON.stringify(DEFAULT_MOCK_DATA.questionnaires));
  }
};

// Force initial setup
initRepository();

export const LocalStoreRepository = {
  // ─── Diagnostics CRUD ───
  getDiagnostics() {
    initRepository();
    return JSON.parse(localStorage.getItem(KEYS.DIAGNOSTICS)) || [];
  },
  saveDiagnostic(diag) {
    const diags = this.getDiagnostics();
    const existingIndex = diags.findIndex(d => d.id === diag.id);
    if (existingIndex > -1) {
      diags[existingIndex] = diag;
    } else {
      diags.unshift(diag); // Newer ones first
    }
    localStorage.setItem(KEYS.DIAGNOSTICS, JSON.stringify(diags));
    return diag;
  },
  deleteDiagnostic(id) {
    const diags = this.getDiagnostics();
    const filtered = diags.filter(d => d.id !== id);
    localStorage.setItem(KEYS.DIAGNOSTICS, JSON.stringify(filtered));
    return true;
  },

  // ─── Users CRUD ───
  getUsers() {
    initRepository();
    return JSON.parse(localStorage.getItem(KEYS.USERS)) || [];
  },
  saveUser(user) {
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id || (u.email && u.email === user.email));
    if (existingIndex > -1) {
      users[existingIndex] = { ...users[existingIndex], ...user };
    } else {
      users.unshift(user);
    }
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    return user;
  },
  deleteUser(id) {
    const users = this.getUsers();
    const filtered = users.filter(u => u.id !== id);
    localStorage.setItem(KEYS.USERS, JSON.stringify(filtered));
    return true;
  },

  // ─── Questionnaires & Questions CRUD ───
  getQuestionnaires() {
    initRepository();
    return JSON.parse(localStorage.getItem(KEYS.QUESTIONNAIRES)) || DEFAULT_MOCK_DATA.questionnaires;
  },
  saveQuestionnaires(quest) {
    localStorage.setItem(KEYS.QUESTIONNAIRES, JSON.stringify(quest));
    return quest;
  },
  saveQuestion(moduleId, questionObj) {
    const data = this.getQuestionnaires();
    if (moduleId === 'triage') {
      data.triage[questionObj.id] = questionObj;
    } else if (data.modules[moduleId]) {
      const qList = data.modules[moduleId].questions || [];
      const idx = qList.findIndex(q => q.id === questionObj.id);
      if (idx > -1) {
        qList[idx] = questionObj;
      } else {
        qList.push(questionObj);
      }
      data.modules[moduleId].questions = qList;
    }
    this.saveQuestionnaires(data);
    return questionObj;
  },
  deleteQuestion(moduleId, qId) {
    const data = this.getQuestionnaires();
    if (moduleId === 'triage') {
      delete data.triage[qId];
    } else if (data.modules[moduleId]) {
      data.modules[moduleId].questions = (data.modules[moduleId].questions || []).filter(q => q.id !== qId);
    }
    this.saveQuestionnaires(data);
    return true;
  },

  // ─── Settings CRUD ───
  getSettings() {
    initRepository();
    return JSON.parse(localStorage.getItem(KEYS.SETTINGS)) || DEFAULT_MOCK_DATA.settings;
  },
  saveSettings(settings) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    return settings;
  },

  // ─── Notifications CRUD ───
  getNotifications() {
    initRepository();
    return JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS)) || [];
  },
  saveNotification(notif) {
    const notifs = this.getNotifications();
    const existingIndex = notifs.findIndex(n => n.id === notif.id);
    if (existingIndex > -1) {
      notifs[existingIndex] = notif;
    } else {
      notifs.unshift(notif);
    }
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    return notif;
  },
  deleteNotification(id) {
    const notifs = this.getNotifications();
    const filtered = notifs.filter(n => n.id !== id);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(filtered));
    return true;
  }
};
