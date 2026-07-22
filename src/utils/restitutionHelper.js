/**
 * getRestitutionData — Extrait les forces, fragilités et priorités d'action
 * de manière unifiée pour l'affichage écran et le PDF.
 */

export function getRestitutionData({ score, answers, moduleId, restitution, isOffline }) {
  const backendForces = restitution?.strengths || [];
  const backendFragilites = restitution?.weaknesses || [];
  const backendPriorityText = restitution?.summary || '';
  const backendPrioritiesList = restitution?.priority_actions || restitution?.priorities || [];

  const useFallback = !!isOffline;

  const forces = (backendForces.length > 0 || !useFallback) ? backendForces : [
    'Connaissance du secteur et ancrage local fort',
    'Volonté d\'agir et engagement personnel du dirigeant',
    score >= 60 ? 'Situation financière sous contrôle' : null,
  ].filter(Boolean);

  const fragilites = (backendFragilites.length > 0 || !useFallback) ? backendFragilites : [
    score < 60 ? 'Trésorerie sous tension — à surveiller en priorité' : null,
    'Manque de formalisation des processus clés',
    'Suivi des indicateurs de performance à structurer',
  ].filter(Boolean);

  const priorityText = (backendPriorityText || !useFallback) ? backendPriorityText : (score < 40
    ? 'La stabilisation de votre situation financière est le sujet à traiter en premier, avant tout autre développement.'
    : score < 70
    ? 'Structurer vos processus commerciaux et formaliser votre suivi de performance sont les leviers prioritaires.'
    : 'Préparer une stratégie de croissance en capitalisant sur vos fondations solides est votre prochain chantier.');

  const priorities = (backendPrioritiesList.length > 0 || !useFallback)
    ? backendPrioritiesList.map((text, i) => {
        if (typeof text === 'object') return text;
        const labels = ['Action immédiate', 'Stabilisation à 30 jours', 'Plan de relance', 'Structuration', 'Capitalisation', 'Croissance'];
        return {
          label: labels[i] || 'Action recommandée',
          text: text
        };
      })
    : (score < 40 ? [
        { label: 'Priorité 1', text: 'Évaluer la trésorerie disponible et contacter votre banque ou un conseiller financier.' },
        { label: 'Priorité 2', text: 'Identifier les charges non essentielles à réduire et les créances à recouvrer.' },
        { label: 'Priorité 3', text: 'Définir un plan commercial minimal pour retrouver des revenus réguliers.' }
      ] : score < 70 ? [
        { label: 'Priorité 1', text: 'Mettre en place un suivi mensuel de trésorerie avec un tableau de bord.' },
        { label: 'Priorité 2', text: 'Formaliser votre offre commerciale et votre processus de vente.' },
        { label: 'Priorité 3', text: 'Explorer les opportunités de financement pour votre développement.' }
      ] : [
        { label: 'Priorité 1', text: 'Documenter et formaliser vos pratiques clés pour les reproduire.' },
        { label: 'Priorité 2', text: 'Identifier et tester un nouveau canal d\'acquisition dans les 60 jours.' },
        { label: 'Priorité 3', text: 'Préparer votre entreprise pour un partenariat stratégique.' }
      ]);

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
