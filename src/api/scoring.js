/**
 * FUND.lab — API Layer: scoring.js
 * Moteur de calcul de score avancé par module
 * Formules pondérées par axe + détection de signaux critiques
 */

import { MODULE_QUESTIONS } from './questions.js';

// ─────────────────────────────────────────
// SCORE PAR RÉPONSE
// ─────────────────────────────────────────
const getAnswerScore = (question, answerValue) => {
  if (question.noScore) return { score: 0, max: 0 };

  const weight = question.weight || 10;

  // Échelle 1-5
  if (question.type === 'scale_1_5') {
    if (!answerValue || answerValue === 'idk') return { score: 0, max: weight };
    const val = parseInt(answerValue);
    if (isNaN(val)) return { score: 0, max: weight };
    const normalized = ((val - 1) / 4) * weight;
    return { score: normalized, max: weight };
  }

  // Choix unique
  if (question.type === 'single') {
    const choice = (question.choices || []).find(c => c.id === answerValue);
    if (!choice) return { score: 0, max: weight };
    // Utilise le score défini dans la choice, ou proportionnel au weight
    const rawScore = choice.score !== undefined ? choice.score : weight / 2;
    // Normalise par rapport au max possible de ce type de question
    const maxPossible = Math.max(...(question.choices || []).map(c => c.score || 0));
    if (maxPossible === 0) return { score: 0, max: weight };
    const normalized = (rawScore / maxPossible) * weight;
    return { score: normalized, max: weight };
  }

  // Multi-select
  if (question.type === 'multi') {
    const answers = Array.isArray(answerValue) ? answerValue : [];
    if (answers.length === 0) return { score: weight / 2, max: weight };

    // Bonus si "none" sélectionné
    if (answers.includes('none')) return { score: weight, max: weight };

    let penalty = 0;
    let bonus = 0;
    answers.forEach(id => {
      const choice = (question.choices || []).find(c => c.id === id);
      if (!choice) return;
      if (choice.penaltyScore) penalty += Math.abs(choice.penaltyScore);
      if (choice.bonusScore) bonus += choice.bonusScore;
    });

    const base = weight;
    const result = Math.max(0, base - penalty + bonus);
    return { score: Math.min(result, weight), max: weight };
  }

  return { score: 0, max: weight };
};

// ─────────────────────────────────────────
// SCORE PAR AXE
// ─────────────────────────────────────────
export const calculateAxeScores = (moduleId, answers) => {
  const moduleData = MODULE_QUESTIONS[moduleId];
  if (!moduleData) return {};

  const axeMap = {};

  moduleData.questions.forEach(q => {
    const axe = q.axe || 'Général';
    if (!axeMap[axe]) axeMap[axe] = { total: 0, max: 0, questions: [] };

    const answerValue = answers[q.id];
    const { score, max } = getAnswerScore(q, answerValue);

    axeMap[axe].total += score;
    axeMap[axe].max += max;
    axeMap[axe].questions.push({
      id: q.id,
      question: q.question,
      answer: answerValue,
      score,
      max,
    });
  });

  // Convertir en pourcentages
  const result = {};
  Object.entries(axeMap).forEach(([axe, data]) => {
    result[axe] = {
      score: data.max > 0 ? Math.round((data.total / data.max) * 100) : 50,
      label: axe,
    };
  });

  return result;
};

// ─────────────────────────────────────────
// SCORE GLOBAL
// ─────────────────────────────────────────
export const calculateGlobalScore = (moduleId, answers) => {
  const moduleData = MODULE_QUESTIONS[moduleId];
  if (!moduleData) return 50;

  let totalWeighted = 0;
  let maxWeighted = 0;

  moduleData.questions.forEach(q => {
    if (q.noScore) return;
    const answerValue = answers[q.id];
    if (answerValue === undefined || answerValue === null) return;

    const { score, max } = getAnswerScore(q, answerValue);
    totalWeighted += score;
    maxWeighted += max;
  });

  if (maxWeighted === 0) return 50;
  const raw = (totalWeighted / maxWeighted) * 100;
  return Math.max(5, Math.min(95, Math.round(raw)));
};

// ─────────────────────────────────────────
// NIVEAU DE MATURITÉ
// ─────────────────────────────────────────
export const getScoreLevel = (score) => {
  if (score >= 80) return { label: 'Excellent',  color: '#10b981', colorLight: 'rgba(16,185,129,0.1)', icon: 'Award' };
  if (score >= 65) return { label: 'Solide',     color: '#059669', colorLight: 'rgba(5,150,105,0.1)',  icon: 'CheckCircle' };
  if (score >= 50) return { label: 'Moyen',      color: '#f59e0b', colorLight: 'rgba(245,158,11,0.1)', icon: 'AlertCircle' };
  if (score >= 35) return { label: 'Fragile',    color: '#ef4444', colorLight: 'rgba(239,68,68,0.1)',  icon: 'AlertTriangle' };
  return              { label: 'Critique',    color: '#dc2626', colorLight: 'rgba(220,38,38,0.1)',  icon: 'AlertOctagon' };
};

// ─────────────────────────────────────────
// DÉTECTION SIGNAUX D'ALERTE
// ─────────────────────────────────────────
export const detectAlerts = (moduleId, answers) => {
  const moduleData = MODULE_QUESTIONS[moduleId];
  if (!moduleData) return [];

  const alerts = [];

  moduleData.questions.forEach(q => {
    const answerValue = answers[q.id];
    if (!answerValue) return;

    if (q.type === 'single') {
      const choice = (q.choices || []).find(c => c.id === answerValue);
      if (choice?.alert) {
        alerts.push({
          questionId: q.id,
          axe: q.axe,
          question: q.question,
          answer: choice.label,
          severity: choice.id.includes('crisis') || choice.id === '0' || choice.id === 'chronic' ? 'critique' : 'élevé',
        });
      }
    }

    if (q.type === 'multi') {
      const selected = Array.isArray(answerValue) ? answerValue : [];
      selected.forEach(id => {
        const choice = (q.choices || []).find(c => c.id === id);
        if (choice?.alert) {
          alerts.push({
            questionId: q.id,
            axe: q.axe,
            question: q.question,
            answer: choice.label,
            severity: 'élevé',
          });
        }
      });
    }
  });

  return alerts;
};

// ─────────────────────────────────────────
// EXPORT COMPLET DU SCORING
// ─────────────────────────────────────────
export const computeFullScore = (moduleId, answers) => {
  const global  = calculateGlobalScore(moduleId, answers);
  const axes    = calculateAxeScores(moduleId, answers);
  const level   = getScoreLevel(global);
  const alerts  = detectAlerts(moduleId, answers);

  return { global, axes, level, alerts };
};
