/**
 * FUND.lab — API Layer: triage.js
 * Logique de routage pré-diagnostic basée sur les réponses triage
 */

import { PROFILES } from './profiles.js';
import { MODULES_CATALOG } from './catalog.js';
import { apiFetch } from './config.js';

const CRITICAL_SIGNALS = ['charges', 'dettes', 'treso'];
const HIGH_SIGNALS = ['ventes', 'client', 'livraison'];

/**
 * Soumettre les réponses de triage au backend
 * POST /sessions/{sessionId}/triage
 */
export async function submitTriageToBackendApi(sessionId, answers) {
  return apiFetch(`/sessions/${sessionId}/triage`, {
    method: 'POST',
    body: JSON.stringify({ answers })
  });
}

// ─────────────────────────────────────────
// ROUTING ENGINE
// ─────────────────────────────────────────
export const computeRoute = (triageAnswers) => {
  const { s03: profileId, s04, s05, s06, s07 = [], s08, s09 } = triageAnswers;

  // Profil institutionnel/curieux → page info
  if (profileId === 'curious') {
    return { route: 'INSTITUTIONAL', moduleId: null, reason: 'Profil institutionnel' };
  }

  // 1. STADE D'ACTIVITÉ (S04) - RÈGLES DE ROUTAGE PRIORITAIRES
  if (s04 === 'no' || s04 === 'occ_non') {
    return { route: 'S10', moduleId: 'PRJ-02', reason: 'Projet en préparation (non lancé ou pas de client payant)' };
  }
  if (s04 === 'occ_oui') {
    return { route: 'S13', moduleId: 'FLH-01', reason: 'Activité occasionnelle avec client payant' };
  }
  if (s04 === 'drop') {
    return { route: 'S11', moduleId: 'DIF-03', reason: 'Ventes en forte baisse (difficultés prioritaires)' };
  }

  // 2. SIGNAUX CRITIQUES (S07) - ROUTE DIFFICULTÉ URGENTE
  const hasCritical = Array.isArray(s07) && s07.some(s => CRITICAL_SIGNALS.includes(s));
  if (hasCritical) {
    return {
      route: 'S11',
      moduleId: 'DIF-03',
      reason: 'Signaux critiques financiers détectés',
      urgent: true,
    };
  }

  // 3. OBJECTIF OPPORTUNITÉ OU FINANCEMENT (S06/S08)
  if (s06 === 'opp' || s06 === 'fun') {
    const hasHigh = Array.isArray(s07) && s07.some(s => HIGH_SIGNALS.includes(s));
    if (hasHigh) {
      return {
        route: 'S11',
        moduleId: 'DIF-03',
        reason: 'Opportunité avec signaux de fragilité',
        warning: 'Avant de saisir cette opportunité, vos signaux suggèrent de traiter des fragilités opérationnelles.',
      };
    }
    return { route: 'S12', moduleId: 'OPP-04', reason: 'Objectif opportunité / financement' };
  }

  if (s08 && s08 !== 'no' && s08 !== 'idk') {
    return { route: 'S12', moduleId: 'OPP-04', reason: 'Opportunité spécifique identifiée' };
  }

  // 4. AXE DE DIAGNOSTIC SPÉCIFIQUE (S09)
  if (s09) {
    const axeModuleMap = {
      pro: 'PRO-05',
      com: 'COM-06',
      fin: 'FIN-07',
      gov: 'GOV-08',
      rh: 'RH-10',
      ops: 'OPS-11',
      for: 'FOR-12',
      dig: 'DIG-13',
      '360': '360-09',
    };
    const moduleId = axeModuleMap[s09];
    if (moduleId) {
      return { route: 'S13', moduleId, reason: `Axe spécifique sélectionné : ${s09}` };
    }
  }

  // 5. PROFIL PME OU STADE DE STRUCTURE (S04 = team)
  if (profileId === 'pme' || s04 === 'team') {
    return { route: 'S13', moduleId: '360-09', reason: 'PME structurée ou équipe en place' };
  }

  // Par défaut → Flash
  return { route: 'S13', moduleId: 'FLH-01', reason: 'Diagnostic Flash par défaut' };
};

// ─────────────────────────────────────────
// GÉNÉRATION D'ALERTE PRÉ-VÉRIFICATION
// ─────────────────────────────────────────
export const getVerifWarning = (moduleId, triageAnswers) => {
  const s07 = triageAnswers.s07 || [];
  const hasCritical = Array.isArray(s07) && s07.some(s => CRITICAL_SIGNALS.includes(s));

  if (moduleId === 'OPP-04' && hasCritical) {
    return 'Attention : vos réponses signalent des tensions financières. Nous recommandons d\'abord un Diagnostic Difficulté avant d\'explorer cette opportunité.';
  }
  if (moduleId === '360-09' && hasCritical) {
    return 'Un diagnostic 360° complet est pertinent, mais vos signaux suggèrent de traiter les urgences financières en priorité.';
  }
  if (moduleId === 'PRJ-02' && triageAnswers.s04 !== 'avant' && hasCritical) {
    return 'Avant de lancer un nouveau projet, sécurisez votre activité actuelle avec un Diagnostic Difficulté.';
  }
  return null;
};

// ─────────────────────────────────────────
// MODULES DISPONIBLES SELON LE PROFIL
// ─────────────────────────────────────────
export const getAvailableModulesForProfile = (profileId) => {
  const profile = PROFILES[profileId];
  if (!profile) return Object.values(MODULES_CATALOG);

  return Object.values(MODULES_CATALOG).filter(module =>
    module.recommendedFor.includes(profileId)
  );
};

// ─────────────────────────────────────────
// ÉTAPES DU PARCOURS PAR PROFIL
// ─────────────────────────────────────────
export const getJourneySteps = (profileId, moduleId) => {
  const profile = PROFILES[profileId] || {};
  return profile.journey || ['Profil', 'Diagnostic', 'Résultats'];
};

// ─────────────────────────────────────────
// QUESTIONS DE TRIAGE PERTINENTES PAR PROFIL
// ─────────────────────────────────────────
export const getTriageStepsForProfile = (profileId) => {
  // Tous les profils passent par S04, S05, S06, S07
  // Certains passent par S08/S09 selon les réponses
  const base = ['s04', 's05', 's06', 's07'];

  if (profileId === 'curious') return []; // Pas de triage
  if (profileId === 'project') return ['s04', 's05', 's06']; // Simplifié
  if (profileId === 'diffic')  return ['s04', 's07', 's08']; // Focus difficulté
  if (profileId === 'opport')  return ['s04', 's08', 's09']; // Focus opportunité

  return base;
};
