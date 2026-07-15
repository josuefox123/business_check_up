/**
 * MOCK DATA — FUND.lab
 * Centralized data models for frontend execution and future API alignment.
 */

import { MODULES_CATALOG } from '../api/catalog.js';
import { MODULE_QUESTIONS, TRIAGE_QUESTIONS } from '../api/questions.js';

// Initial diagnostics run history
export const INITIAL_DIAGNOSTICS = [
  {
    id: 'DIAG-2026-001',
    moduleId: 'FLH-01',
    moduleName: 'Diagnostic Flash',
    score: 72,
    date: '2026-07-15T18:30:00Z',
    userName: 'Koffi Mensah',
    userEmail: 'koffi.mensah@gmail.com',
    userPhone: '+229 97 00 11 22',
    confidence: 'Documenté',
    answers: {
      q1: 'yes',
      q2: 'good',
      q3: 'some',
      q4: 4,
      q5: 'mental',
      q6: 'sales',
      q7: ['competition', 'costs']
    }
  },
  {
    id: 'DIAG-2026-002',
    moduleId: 'DIF-03',
    moduleName: 'Diagnostic Difficulté',
    score: 38,
    date: '2026-07-15T20:15:00Z',
    userName: 'Afiwa Sika',
    userEmail: 'afiwa.sika@boutique.bj',
    userPhone: '+229 90 22 33 44',
    confidence: 'Déclaratif',
    answers: {
      q1: 'fin',
      q2: 'long',
      q3: 'multiple',
      q4: '0',
      q5: 'no',
      q6: 'cash',
      q7: 'no',
      q8: 2,
      q9: 'some',
      q10: 'maybe'
    }
  },
  {
    id: 'DIAG-2026-003',
    moduleId: 'PRJ-02',
    moduleName: 'Diagnostic Projet',
    score: 64,
    date: '2026-07-15T21:40:00Z',
    userName: 'Mathieu Hounde',
    userEmail: 'mathieu.h@techstartup.bj',
    userPhone: '+229 95 88 77 66',
    confidence: 'Partiel',
    answers: {
      q1: 'partial',
      q2: 'yes',
      q3: 'interviews',
      q4: 'yes-approx',
      q5: 'own',
      q6: 'yes-few',
      q7: 'partial',
      q8: 'innovation'
    }
  },
  {
    id: 'DIAG-2026-004',
    moduleId: 'FIN-07',
    moduleName: 'Diagnostic Financier',
    score: 82,
    date: '2026-07-14T10:05:00Z',
    userName: 'Sophie Bio',
    userEmail: 's.bio@agrobusiness.bj',
    userPhone: '+229 97 12 34 56',
    confidence: 'Vérifiable',
    answers: {
      q1: 'monthly',
      q2: 'yes',
      q3: 'yes',
      q4: 'manageable',
      q5: 'no',
      q6: 'yes',
      q7: 'yes',
      q8: 'yes'
    }
  },
  {
    id: 'DIAG-2026-005',
    moduleId: 'GOV-08',
    moduleName: 'Diagnostic Organisation',
    score: 51,
    date: '2026-07-13T15:20:00Z',
    userName: 'Jean-Pierre Codjia',
    userEmail: 'jp.codjia@transports.bj',
    userPhone: '+229 96 45 67 89',
    confidence: 'Partiel',
    answers: {
      q1: 'partial',
      q2: 'informal',
      q3: 'monthly',
      q4: 'partial',
      q5: 'some',
      q6: 3
    }
  }
];

// Initial users list (CCI prospects)
export const INITIAL_USERS = [
  {
    id: 'USR-001',
    name: 'Koffi Mensah',
    email: 'koffi.mensah@gmail.com',
    phone: '+229 97 00 11 22',
    companyName: 'Mensah Trading Co.',
    sector: 'Commerce général',
    department: 'Littoral',
    commune: 'Cotonou',
    profile: 'active',
    dateJoined: '2026-07-15T18:32:00Z',
    contactRequested: true,
    pdfDownloaded: true
  },
  {
    id: 'USR-002',
    name: 'Afiwa Sika',
    email: 'afiwa.sika@boutique.bj',
    phone: '+229 90 22 33 44',
    companyName: 'Boutique E-Sika',
    sector: 'Commerce de détail / E-commerce',
    department: 'Ouémé',
    commune: 'Porto-Novo',
    profile: 'diffic',
    dateJoined: '2026-07-15T20:18:00Z',
    contactRequested: true,
    pdfDownloaded: false
  },
  {
    id: 'USR-003',
    name: 'Mathieu Hounde',
    email: 'mathieu.h@techstartup.bj',
    phone: '+229 95 88 77 66',
    companyName: 'Hounde Solutions LLC',
    sector: 'Technologies de l\'information',
    department: 'Atlantique',
    commune: 'Abomey-Calavi',
    profile: 'project',
    dateJoined: '2026-07-15T21:42:00Z',
    contactRequested: false,
    pdfDownloaded: true
  },
  {
    id: 'USR-004',
    name: 'Sophie Bio',
    email: 's.bio@agrobusiness.bj',
    phone: '+229 97 12 34 56',
    companyName: 'Bio & Co Agribusiness',
    sector: 'Agriculture et agro-alimentaire',
    department: 'Borgou',
    commune: 'Parakou',
    profile: 'pme',
    dateJoined: '2026-07-14T10:08:00Z',
    contactRequested: true,
    pdfDownloaded: true
  },
  {
    id: 'USR-005',
    name: 'Jean-Pierre Codjia',
    email: 'jp.codjia@transports.bj',
    phone: '+229 96 45 67 89',
    companyName: 'Codjia Logistique Bénin',
    sector: 'Transports et logistique',
    department: 'Littoral',
    commune: 'Cotonou',
    profile: 'pme',
    dateJoined: '2026-07-13T15:23:00Z',
    contactRequested: false,
    pdfDownloaded: true
  }
];

// Initial app settings
export const INITIAL_SETTINGS = {
  scoreThresholds: {
    critique: 40,
    moyen: 70
  },
  general: {
    appName: 'Business Check-up',
    organizationName: 'CCI Bénin',
    contactEmail: 'contact@cci.bj',
    enablePdfExport: true,
    maintenanceMode: false
  }
};

// Initial admin notifications list
export const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOT-001',
    title: 'Nouveau diagnostic soumis',
    message: 'Koffi Mensah a complété le Diagnostic Flash avec un score de 72/100.',
    type: 'success',
    read: false,
    date: '2026-07-15T18:30:00Z'
  },
  {
    id: 'NOT-002',
    title: 'Alerte d\'urgence (Difficulté)',
    message: 'Afiwa Sika a complété le Diagnostic Difficulté avec un score critique de 38/100.',
    type: 'danger',
    read: false,
    date: '2026-07-15T20:15:00Z'
  },
  {
    id: 'NOT-003',
    title: 'Nouveau prospect (Suivi)',
    message: 'Sophie Bio demande un rappel par un conseiller CCI.',
    type: 'info',
    read: true,
    date: '2026-07-14T10:08:00Z'
  }
];

// Centralizer to import directly if needed, but LocalStoreRepository will manage active state
export const DEFAULT_MOCK_DATA = {
  questionnaires: {
    triage: TRIAGE_QUESTIONS,
    modules: MODULE_QUESTIONS,
    catalog: MODULES_CATALOG
  },
  diagnostics: INITIAL_DIAGNOSTICS,
  users: INITIAL_USERS,
  settings: INITIAL_SETTINGS,
  notifications: INITIAL_NOTIFICATIONS
};
