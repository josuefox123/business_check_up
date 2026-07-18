/**
 * getRestitutionData — Extrait les forces, fragilités et priorités d'action
 * de manière unifiée pour l'affichage écran et le PDF.
 */

export function getRestitutionData({ score, answers, moduleId, restitution }) {
  const backendForces = restitution?.strengths || [];
  const backendFragilites = restitution?.weaknesses || [];

  const forces = backendForces.length > 0 ? backendForces : [
    'Connaissance du secteur et ancrage local fort',
    'Volonté d\'agir et engagement personnel du dirigeant',
    score >= 60 ? 'Situation financière sous contrôle' : null,
  ].filter(Boolean);

  const fragilites = backendFragilites.length > 0 ? backendFragilites : [
    score < 60 ? 'Trésorerie sous tension — à surveiller en priorité' : null,
    'Manque de formalisation des processus clés',
    'Suivi des indicateurs de performance à structurer',
  ].filter(Boolean);

  const priorityText = restitution?.summary || (score < 40
    ? 'La stabilisation de votre situation financière est le sujet à traiter en premier, avant tout autre développement.'
    : score < 70
    ? 'Structurer vos processus commerciaux et formaliser votre suivi de performance sont les leviers prioritaires.'
    : 'Préparer une stratégie de croissance en capitalisant sur vos fondations solides est votre prochain chantier.');

  const backendPriorities = restitution?.priority_actions || restitution?.priorities || [];
  
  const priorities = backendPriorities.length > 0
    ? backendPriorities.map((text, i) => {
        if (typeof text === 'object') return text;
        const labels = ['Action immédiate', 'Stabilisation à 30 jours', 'Plan de relance', 'Structuration', 'Capitalisation', 'Croissance'];
        return {
          label: labels[i] || 'Action recommandée',
          text: text
        };
      })
    : (score < 40 ? [
        { label:'Action immédiate', text:'Évaluer la trésorerie disponible et contacter votre banque ou un conseiller financier sous 48h.' },
        { label:'Stabilisation à 30 jours', text:'Identifier les charges non essentielles à réduire et les créances à recouvrer en priorité.' },
        { label:'Plan de relance', text:'Définir un plan commercial minimal pour retrouver un flux de revenus régulier d\'ici 60 jours.' },
      ] : score < 70 ? [
        { label:'Action immédiate', text:'Mettre en place un suivi mensuel de trésorerie avec un tableau de bord simple.' },
        { label:'Structuration à 30 jours', text:'Formaliser votre offre commerciale et votre processus de vente pour gagner en efficacité.' },
        { label:'Préparation à 90 jours', text:'Explorer les opportunités de financement (aides, prêts) pour financer votre développement.' },
      ] : [
        { label:'Capitaliser', text:'Documenter et formaliser vos pratiques qui fonctionnent pour les reproduire à l\'échelle.' },
        { label:'Croissance', text:'Identifier et tester un nouveau segment de marché ou canal d\'acquisition dans les 60 jours.' },
        { label:'Préparation', text:'Préparer votre entreprise pour une éventuelle levée de fonds ou un partenariat stratégique.' },
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
