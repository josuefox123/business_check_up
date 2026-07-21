/**
 * getRestitutionData — Extrait les forces, fragilités et priorités d'action
 * de manière unifiée pour l'affichage écran et le PDF.
 */

export function getRestitutionData({ score, answers, moduleId, restitution }) {
  const forces = restitution?.strengths || [];
  const fragilites = restitution?.weaknesses || [];
  const priorityText = restitution?.summary || '';
  const backendPriorities = restitution?.priority_actions || restitution?.priorities || [];
  
  const priorities = backendPriorities.map((text, i) => {
    if (typeof text === 'object') return text;
    const labels = ['Action immédiate', 'Stabilisation à 30 jours', 'Plan de relance', 'Structuration', 'Capitalisation', 'Croissance'];
    return {
      label: labels[i] || 'Action recommandée',
      text: text
    };
  });

  // Calcul du niveau de confiance
  const values = Object.keys(answers || {})
    .filter(k => k.endsWith('_confidence'))
    .map(k => answers[k]);
  const total = values.length;
  let confidence = 'Déclaratif';
  if (total > 0) {
    const e3Count = values.filter(v => v === 'E3').length;
    const e2e3Count = values.filter(v => v === 'E2' || v === 'E3').length;
    const e1e2e3Count = values.filter(v => v === 'E1' || v === 'E2' || v === 'E3').length;
    if (e3Count >= 2) confidence = 'Vérifiable';
    else if (e2e3Count >= 3) confidence = 'Documenté';
    else if (e1e2e3Count >= 1) confidence = 'Partiel';
  }

  return { forces, fragilites, priorityText, priorities, confidence };
}
