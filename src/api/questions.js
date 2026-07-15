/**
 * FUND.lab — API Layer: questions.js
 * Questions centralisées par module, format enrichi
 * Source unique de vérité pour tout le parcours
 */

// ─── Types de réponses supportés ──────────────────────────────
// 'single'    → 1 choix parmi N
// 'multi'     → plusieurs choix
// 'scale_1_5' → curseur 1-5 (matrice)
// 'text'      → saisie libre (optionnel)

export const TRIAGE_QUESTIONS = {

  // S04 — Situation / statut de l'activité
  s04: {
    id: 's04',
    question: 'Quelle est la situation actuelle de votre activité ?',
    hint: 'Sélectionnez l\'option qui décrit le mieux votre situation aujourd\'hui.',
    type: 'single',
    choices: [
      { id: 'avant',   label: 'Je n\'ai pas encore lancé',        icon: '💡', desc: 'Idée ou projet en préparation' },
      { id: 'recent',  label: 'J\'ai lancé depuis moins de 1 an', icon: '🌱', desc: 'Démarrage, premières ventes' },
      { id: 'en-cours',label: 'Mon activité fonctionne',          icon: '🏃', desc: 'Ventes régulières en cours' },
      { id: 'etabli',  label: 'Entreprise établie (3 ans+)',       icon: '🏢', desc: 'Structure organisée, équipe' },
    ],
  },

  // S05 — Rentabilité
  s05: {
    id: 's05',
    question: 'Votre activité est-elle actuellement rentable ?',
    type: 'single',
    requireProof: true,
    choices: [
      { id: 'yes',     label: 'Oui, clairement rentable',     icon: '✅' },
      { id: 'break',   label: 'À l\'équilibre',              icon: '⚖️' },
      { id: 'no',      label: 'Non, encore en déficit',      icon: '❌' },
      { id: 'projet',  label: 'Pas encore lancé',            icon: '🚀' },
    ],
  },

  // S06 — Objectif principal
  s06: {
    id: 's06',
    question: 'Quel est votre objectif principal en démarrant ce diagnostic ?',
    type: 'single',
    choices: [
      { id: 'grow',  label: 'Développer mon activité',             icon: '📈', desc: 'Croissance, nouveaux marchés' },
      { id: 'fix',   label: 'Résoudre un problème urgent',         icon: '🔧', desc: 'Difficulté, blocage' },
      { id: 'opp',   label: 'Saisir une opportunité',              icon: '🎯', desc: 'Financement, appel d\'offres, marché' },
      { id: 'fun',   label: 'Préparer un financement',             icon: '💰', desc: 'Investisseur, crédit, subvention' },
      { id: 'know',  label: 'Simplement connaître ma situation',   icon: '🔍', desc: 'Bilan objectif' },
    ],
  },

  // S07 — Signaux de vigilance (multi-select)
  s07: {
    id: 's07',
    question: 'Parmi ces situations, lesquelles concernent votre entreprise en ce moment ?',
    hint: 'Cochez tout ce qui s\'applique. Répondez honnêtement — cela détermine le bon diagnostic.',
    type: 'multi',
    allowNone: true,
    choices: [
      { id: 'charges', label: 'Difficulté à payer mes charges',           severity: 'critique', icon: '⚠️' },
      { id: 'dettes',  label: 'Dettes ou retards de paiement',           severity: 'critique', icon: '⚠️' },
      { id: 'treso',   label: 'Trésorerie insuffisante (< 1 mois)',       severity: 'critique', icon: '⚠️' },
      { id: 'ventes',  label: 'Chute significative des ventes',           severity: 'élevé',   icon: '📉' },
      { id: 'client',  label: 'Perte d\'un gros client',                  severity: 'élevé',   icon: '👤' },
      { id: 'livraison',label: 'Problèmes de production/livraison',       severity: 'élevé',   icon: '📦' },
      { id: 'concurrence',label: 'Concurrence nouvelle et agressive',    severity: 'moyen',   icon: '🥊' },
      { id: 'none',    label: 'Aucune de ces situations',                severity: null,      icon: '✅' },
    ],
  },

  // S08 — Opportunité spécifique
  s08: {
    id: 's08',
    question: 'Avez-vous une opportunité concrète à saisir dans les prochains 6 mois ?',
    type: 'single',
    choices: [
      { id: 'fund',   label: 'Obtenir un financement ou subvention',  icon: '💳' },
      { id: 'tender', label: 'Répondre à un appel d\'offres',         icon: '📋' },
      { id: 'market', label: 'Accéder à un nouveau marché',           icon: '🌍' },
      { id: 'expand', label: 'Lancer une nouvelle offre / produit',   icon: '🚀' },
      { id: 'no',     label: 'Non, pas d\'opportunité identifiée',    icon: '—'  },
      { id: 'idk',    label: 'Je ne sais pas encore',                 icon: '❓' },
    ],
  },

  // S09 — Axe de diagnostic souhaité (si applicable)
  s09: {
    id: 's09',
    question: 'Sur quel axe souhaitez-vous concentrer votre diagnostic ?',
    hint: 'Si vous êtes incertain, sélectionnez « Tour d\'horizon complet ».',
    type: 'single',
    choices: [
      { id: 'all', label: 'Tour d\'horizon complet',     icon: '🔭', desc: 'Vue globale (30-45 min)' },
      { id: 'fin', label: 'Finances & trésorerie',       icon: '💰', desc: '8-15 min' },
      { id: 'com', label: 'Commercial & clients',        icon: '📈', desc: '8-15 min' },
      { id: 'pro', label: 'Offre & produits',            icon: '📦', desc: '8-15 min' },
      { id: 'gov', label: 'Organisation & gouvernance',  icon: '🏛️', desc: '8-15 min' },
    ],
  },
};

export const MODULE_QUESTIONS = {

  // ─────────────────────────────────────────
  // FLH-01 — DIAGNOSTIC FLASH
  // ─────────────────────────────────────────
  'FLH-01': {
    intro: 'Ce diagnostic rapide vous donne une vue d\'ensemble de votre activité en 7 questions.',
    estimatedTime: '7-10 min',
    axes: ['Ventes', 'Trésorerie', 'Clients', 'Marché', 'Stratégie'],
    questions: [
      {
        id: 'q1', axe: 'Ventes',
        question: 'Votre activité génère-t-elle des ventes régulières ?',
        type: 'single',
        weight: 15,
        choices: [
          { id: 'yes',  label: 'Oui, chaque semaine ou chaque mois',    score: 15, icon: '✅' },
          { id: 'occ',  label: 'Oui, mais de façon irrégulière',        score: 8,  icon: '📊' },
          { id: 'rare', label: 'Rarement, c\'est difficile',             score: 3,  icon: '⚠️' },
          { id: 'no',   label: 'Non, pas encore',                       score: 0,  icon: '❌' },
        ],
      },
      {
        id: 'q2', axe: 'Trésorerie',
        question: 'Comment évaluez-vous votre situation de trésorerie actuelle ?',
        type: 'single',
        requireProof: true,
        weight: 20,
        choices: [
          { id: 'good',   label: 'Confortable — plus de 3 mois de charges', score: 20, icon: '💚' },
          { id: 'ok',     label: 'Acceptable — 1 à 3 mois de charges',      score: 12, icon: '🟡' },
          { id: 'tight',  label: 'Tendue — moins d\'un mois',               score: 4,  icon: '🟠', alert: true },
          { id: 'crisis', label: 'Critique — difficultés à payer',           score: 0,  icon: '🔴', alert: true },
        ],
      },
      {
        id: 'q3', axe: 'Clients',
        question: 'Avez-vous des clients qui reviennent acheter régulièrement ?',
        type: 'single',
        weight: 15,
        choices: [
          { id: 'many', label: 'Oui, la majorité de mes clients reviennent', score: 15, icon: '⭐' },
          { id: 'some', label: 'Oui, quelques-uns',                         score: 9,  icon: '👍' },
          { id: 'no',   label: 'Non, surtout des clients ponctuels',        score: 3,  icon: '👤' },
        ],
      },
      {
        id: 'q4', axe: 'Marché',
        question: 'Comment évaluez-vous votre maîtrise du marché dans lequel vous opérez ?',
        type: 'scale_1_5',
        hint: '1 = Très peu, 5 = Très bien',
        weight: 15,
      },
      {
        id: 'q5', axe: 'Stratégie',
        question: 'Avez-vous un plan commercial ou une stratégie de développement formalisée ?',
        type: 'single',
        weight: 10,
        choices: [
          { id: 'yes',    label: 'Oui, écrite et suivie régulièrement', score: 10, icon: '📋' },
          { id: 'mental', label: 'Oui, dans ma tête mais non écrite',   score: 6,  icon: '🧠' },
          { id: 'no',     label: 'Non, pas encore',                     score: 1,  icon: '❌' },
        ],
      },
      {
        id: 'q6', axe: 'Stratégie',
        question: 'Sur quelle dimension souhaitez-vous vous améliorer en priorité ?',
        type: 'single',
        weight: 0, // question d'orientation, pas notée
        noScore: true,
        choices: [
          { id: 'sales',   label: 'Ventes et clients',         icon: '📈' },
          { id: 'finance', label: 'Finances et trésorerie',    icon: '💰' },
          { id: 'product', label: 'Offre et produits',         icon: '📦' },
          { id: 'org',     label: 'Organisation et équipe',    icon: '🏛️' },
        ],
      },
      {
        id: 'q7', axe: 'Marché',
        question: 'Rencontrez-vous des difficultés dans votre secteur en ce moment ?',
        type: 'multi',
        weight: 10,
        choices: [
          { id: 'competition', label: 'Concurrence accrue',              penaltyScore: -3, icon: '🥊' },
          { id: 'costs',       label: 'Hausse des coûts',                penaltyScore: -3, icon: '📦' },
          { id: 'demand',      label: 'Baisse de la demande',            penaltyScore: -4, icon: '📉', alert: true },
          { id: 'supply',      label: 'Problèmes d\'approvisionnement',  penaltyScore: -3, icon: '🚚' },
          { id: 'regulation',  label: 'Nouvelles réglementations',       penaltyScore: -2, icon: '📜' },
          { id: 'none',        label: 'Aucune difficulté particulière',  bonusScore: 5,   icon: '✅' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // PRJ-02 — DIAGNOSTIC PROJET
  // ─────────────────────────────────────────
  'PRJ-02': {
    intro: 'Évaluez la maturité de votre projet avant le lancement.',
    estimatedTime: '8-12 min',
    axes: ['Concept', 'Clientèle', 'Modèle économique', 'Financement', 'Exécution'],
    questions: [
      {
        id: 'q1', axe: 'Concept',
        question: 'Avez-vous clairement défini le problème que votre projet cherche à résoudre ?',
        type: 'single',
        weight: 15,
        choices: [
          { id: 'yes',     label: 'Oui, très clairement — problème validé avec des utilisateurs', score: 15, icon: '✅' },
          { id: 'partial', label: 'En partie — j\'ai une intuition forte',                       score: 8,  icon: '🤔' },
          { id: 'no',      label: 'Pas encore — j\'ai une idée générale',                        score: 2,  icon: '💡' },
        ],
      },
      {
        id: 'q2', axe: 'Clientèle',
        question: 'Avez-vous identifié vos clients cibles (profil, besoins, comportements) ?',
        type: 'single',
        weight: 15,
        choices: [
          { id: 'yes',     label: 'Oui, avec précision — persona défini',    score: 15, icon: '🎯' },
          { id: 'partial', label: 'Vaguement — grande cible définie',        score: 7,  icon: '🔍' },
          { id: 'no',      label: 'Non, pas encore',                         score: 1,  icon: '❓' },
        ],
      },
      {
        id: 'q3', axe: 'Clientèle',
        question: 'Avez-vous testé votre idée auprès de clients potentiels ?',
        type: 'single',
        requireProof: true,
        weight: 20,
        choices: [
          { id: 'yes-paid',     label: 'Oui — j\'ai eu des commandes ou paiements',  score: 20, icon: '💳' },
          { id: 'yes-feedback', label: 'Oui — retours positifs verbaux',             score: 14, icon: '👏' },
          { id: 'interviews',   label: 'Oui — interviews ou sondages réalisés',      score: 10, icon: '📊' },
          { id: 'no',           label: 'Non, pas encore',                            score: 2,  icon: '❌' },
        ],
      },
      {
        id: 'q4', axe: 'Modèle économique',
        question: 'Avez-vous une idée de vos coûts de démarrage et de votre modèle économique ?',
        type: 'single',
        weight: 15,
        choices: [
          { id: 'yes-precise', label: 'Oui — chiffrage précis réalisé',          score: 15, icon: '📐' },
          { id: 'yes-approx',  label: 'Oui — estimation grossière',              score: 8,  icon: '🔢' },
          { id: 'no',          label: 'Non, pas encore chiffré',                 score: 1,  icon: '❓' },
        ],
      },
      {
        id: 'q5', axe: 'Financement',
        question: 'Avez-vous une source de financement pour démarrer ?',
        type: 'single',
        weight: 15,
        choices: [
          { id: 'own',      label: 'Oui — mes propres économies',                   score: 15, icon: '💰' },
          { id: 'external', label: 'Oui — financement externe (famille, emprunt)',  score: 13, icon: '🤝' },
          { id: 'small',    label: 'Peu de capital nécessaire',                     score: 10, icon: '✅' },
          { id: 'looking',  label: 'Non, je cherche encore',                        score: 3,  icon: '🔍' },
        ],
      },
      {
        id: 'q6', axe: 'Concept',
        question: 'Y a-t-il des concurrents directs ou des alternatives existantes pour les clients ?',
        type: 'single',
        weight: 10,
        choices: [
          { id: 'yes-few',  label: 'Oui, quelques-uns — je connais mes différenciateurs', score: 10, icon: '⚔️' },
          { id: 'yes-many', label: 'Oui, nombreux — marché concurrentiel',               score: 6,  icon: '🥊' },
          { id: 'none',     label: 'Non, c\'est une niche peu concurrencée',             score: 8,  icon: '🏆' },
          { id: 'idk',      label: 'Je ne sais pas',                                     score: 2,  icon: '❓' },
        ],
      },
      {
        id: 'q7', axe: 'Exécution',
        question: 'Avez-vous les compétences clés pour exécuter ce projet (seul ou en équipe) ?',
        type: 'single',
        weight: 10,
        choices: [
          { id: 'yes',     label: 'Oui — toutes les compétences nécessaires',        score: 10, icon: '💪' },
          { id: 'partial', label: 'La plupart — il manque quelques expertises',      score: 6,  icon: '🔧' },
          { id: 'no',      label: 'Non — besoin de partenaires ou recrutements',     score: 2,  icon: '👥' },
        ],
      },
      {
        id: 'q8', axe: 'Exécution',
        question: 'Quelle est la principale force de votre projet selon vous ?',
        type: 'single',
        weight: 0,
        noScore: true,
        choices: [
          { id: 'innovation', label: 'Innovation — très différenciant',     icon: '💡' },
          { id: 'price',      label: 'Prix — très compétitif',              icon: '💰' },
          { id: 'network',    label: 'Réseau — accès privilégié au marché', icon: '🌐' },
          { id: 'expertise',  label: 'Expertise — savoir-faire unique',     icon: '🏆' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // DIF-03 — DIAGNOSTIC DIFFICULTÉ
  // ─────────────────────────────────────────
  'DIF-03': {
    intro: 'Diagnostic d\'urgence — Identifiez la nature de vos difficultés et les actions prioritaires.',
    estimatedTime: '10-15 min',
    axes: ['Nature', 'Durée', 'Finances', 'Ressources', 'Plan'],
    urgent: true,
    questions: [
      {
        id: 'q1', axe: 'Nature',
        question: 'Quelle est la principale nature de la difficulté que vous traversez ?',
        type: 'single',
        weight: 15,
        choices: [
          { id: 'fin',  label: 'Financière — trésorerie, dettes, rentabilité',  score: 0, icon: '💸', alert: true },
          { id: 'com',  label: 'Commerciale — chute des ventes, clients',        score: 3, icon: '📉', alert: true },
          { id: 'ops',  label: 'Opérationnelle — production, livraison',         score: 5, icon: '⚙️' },
          { id: 'rh',   label: 'Humaine — départs, conflits, démotivation',     score: 4, icon: '👥' },
          { id: 'all',  label: 'Plusieurs difficultés combinées',                score: 0, icon: '⚠️', alert: true },
        ],
      },
      {
        id: 'q2', axe: 'Durée',
        question: 'Depuis combien de temps cette difficulté est-elle présente ?',
        type: 'single',
        weight: 15,
        choices: [
          { id: 'new',     label: 'Moins de 1 mois — nouvelle situation',  score: 12, icon: '🆕' },
          { id: 'recent',  label: '1 à 3 mois',                           score: 8,  icon: '🗓️' },
          { id: 'long',    label: '3 à 6 mois',                           score: 4,  icon: '⏳', alert: true },
          { id: 'chronic', label: 'Plus de 6 mois — situation chronique', score: 0,  icon: '🚨', alert: true },
        ],
      },
      {
        id: 'q3', axe: 'Finances',
        question: 'Avez-vous des dettes ou retards de paiement en cours ?',
        type: 'single',
        requireProof: true,
        weight: 15,
        choices: [
          { id: 'none',          label: 'Non, aucune',                             score: 15, icon: '✅' },
          { id: 'fournisseurs',  label: 'Oui — envers des fournisseurs',          score: 8,  icon: '📦' },
          { id: 'fisc',          label: 'Oui — fiscales ou sociales',              score: 4,  icon: '🏛️', alert: true },
          { id: 'bank',          label: 'Oui — bancaires',                        score: 5,  icon: '🏦' },
          { id: 'multiple',      label: 'Plusieurs types de dettes combinées',    score: 0,  icon: '🚨', alert: true },
        ],
      },
      {
        id: 'q4', axe: 'Finances',
        question: 'Combien de mois de charges pouvez-vous couvrir avec votre trésorerie actuelle ?',
        type: 'single',
        requireProof: true,
        weight: 20,
        choices: [
          { id: '0',   label: 'Moins d\'un mois',  score: 0,  icon: '🔴', alert: true },
          { id: '1-3', label: '1 à 3 mois',        score: 8,  icon: '🟠' },
          { id: '3-6', label: '3 à 6 mois',        score: 14, icon: '🟡' },
          { id: '6+',  label: 'Plus de 6 mois',    score: 20, icon: '🟢' },
        ],
      },
      {
        id: 'q5', axe: 'Ressources',
        question: 'Êtes-vous déjà accompagné par une structure de conseil ou d\'appui ?',
        type: 'single',
        weight: 10,
        choices: [
          { id: 'yes',   label: 'Oui, je suis déjà accompagné',             score: 10, icon: '🤝' },
          { id: 'tried', label: 'J\'ai essayé mais sans résultat concret',  score: 5,  icon: '😕' },
          { id: 'no',    label: 'Non, pas encore',                          score: 3,  icon: '❓' },
        ],
      },
      {
        id: 'q6', axe: 'Plan',
        question: 'Quel est votre besoin le plus urgent en ce moment ?',
        type: 'single',
        weight: 0,
        noScore: true,
        choices: [
          { id: 'cash',      label: 'Liquidités / financement d\'urgence',     icon: '💳' },
          { id: 'customers', label: 'Retrouver des clients et du chiffre',     icon: '📈' },
          { id: 'advice',    label: 'Un conseiller pour m\'orienter',          icon: '🧭' },
          { id: 'legal',     label: 'Informations juridiques / légales',       icon: '⚖️' },
        ],
      },
      {
        id: 'q7', axe: 'Plan',
        question: 'Des solutions ont-elles déjà été envisagées (prêt, aide, restructuration) ?',
        type: 'single',
        weight: 10,
        choices: [
          { id: 'yes-ok',  label: 'Oui — c\'est en cours',            score: 10, icon: '✅' },
          { id: 'yes-no',  label: 'Oui — mais sans résultat',         score: 5,  icon: '😕' },
          { id: 'no',      label: 'Non, pas encore envisagé',         score: 2,  icon: '❌' },
        ],
      },
      {
        id: 'q8', axe: 'Ressources',
        question: 'Comment évaluez-vous votre moral et votre énergie actuellement ?',
        type: 'scale_1_5',
        hint: '1 = Très bas / épuisé · 5 = Déterminé et combatif',
        weight: 10,
      },
      {
        id: 'q9', axe: 'Ressources',
        question: 'Avez-vous des ressources (famille, épargne, associés) sur lesquelles vous appuyer ?',
        type: 'single',
        weight: 5,
        choices: [
          { id: 'yes',  label: 'Oui, significatives',   score: 5, icon: '💪' },
          { id: 'some', label: 'Un peu',                score: 3, icon: '🙂' },
          { id: 'no',   label: 'Non, très peu',         score: 0, icon: '😔' },
        ],
      },
      {
        id: 'q10', axe: 'Plan',
        question: 'Êtes-vous prêt à prendre des décisions difficiles pour redresser la situation ?',
        type: 'single',
        noUnknown: true,
        weight: 10,
        choices: [
          { id: 'yes',   label: 'Oui, tout à fait',                            score: 10, icon: '✊' },
          { id: 'maybe', label: 'Oui, mais j\'ai besoin d\'aide pour décider', score: 6,  icon: '🤝' },
          { id: 'no',    label: 'Pas encore, j\'évalue encore',                score: 2,  icon: '🤔' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // OPP-04 — DIAGNOSTIC OPPORTUNITÉ
  // ─────────────────────────────────────────
  'OPP-04': {
    intro: 'Évaluez si votre entreprise est prête à saisir cette opportunité.',
    estimatedTime: '10-15 min',
    axes: ['Nature', 'Délai', 'Capacité financière', 'Capacité humaine', 'Risques'],
    questions: [
      {
        id: 'q1', axe: 'Nature',
        question: 'Quelle est l\'opportunité que vous cherchez à saisir ?',
        type: 'single',
        weight: 0,
        noScore: true,
        choices: [
          { id: 'funding', label: 'Obtenir un financement / subvention',       icon: '💰' },
          { id: 'market',  label: 'Accéder à un nouveau marché / territoire',  icon: '🌍' },
          { id: 'tender',  label: 'Répondre à un appel d\'offres',             icon: '📋' },
          { id: 'partner', label: 'Trouver un partenaire stratégique',         icon: '🤝' },
          { id: 'grow',    label: 'Augmenter ma capacité de production',       icon: '📦' },
        ],
      },
      {
        id: 'q2', axe: 'Délai',
        question: 'Dans quel délai cette opportunité doit-elle être saisie ?',
        type: 'single',
        weight: 10,
        choices: [
          { id: 'urgent', label: 'Dans les 30 jours',         score: 5,  icon: '🚨', alert: true },
          { id: 'mid',    label: 'Dans les 3 mois',           score: 10, icon: '🗓️' },
          { id: 'long',   label: 'Dans les 6 mois ou plus',  score: 10, icon: '📅' },
        ],
      },
      {
        id: 'q3', axe: 'Capacité financière',
        question: 'Votre trésorerie vous permet-elle d\'investir dans cette opportunité ?',
        type: 'single',
        requireProof: true,
        weight: 25,
        choices: [
          { id: 'yes',   label: 'Oui, sans problème',                        score: 25, icon: '✅' },
          { id: 'tight', label: 'Oui, mais de façon limitée',               score: 14, icon: '🟡' },
          { id: 'no',    label: 'Non — besoin de financement complémentaire', score: 5,  icon: '❌', alert: true },
        ],
      },
      {
        id: 'q4', axe: 'Capacité humaine',
        question: 'Avez-vous les ressources humaines (temps, compétences, équipe) pour exécuter ?',
        type: 'single',
        weight: 20,
        choices: [
          { id: 'yes',     label: 'Oui, pleinement disponibles',                   score: 20, icon: '✅' },
          { id: 'partial', label: 'Partiellement — recrutement à prévoir',         score: 10, icon: '🔧' },
          { id: 'no',      label: 'Non — l\'équipe est déjà saturée',              score: 2,  icon: '❌', alert: true },
        ],
      },
      {
        id: 'q5', axe: 'Risques',
        question: 'Avez-vous déjà évalué les risques de cette opportunité ?',
        type: 'single',
        weight: 20,
        choices: [
          { id: 'yes',     label: 'Oui — avec un plan de mitigation clair',  score: 20, icon: '🛡️' },
          { id: 'partial', label: 'Oui — de façon informelle',               score: 12, icon: '🔍' },
          { id: 'no',      label: 'Pas encore',                              score: 3,  icon: '❓' },
        ],
      },
      {
        id: 'q6', axe: 'Risques',
        question: 'Cette opportunité est-elle alignée avec votre stratégie actuelle ?',
        type: 'single',
        weight: 20,
        choices: [
          { id: 'yes',      label: 'Oui — c\'est dans notre axe de développement',  score: 20, icon: '🎯' },
          { id: 'possible', label: 'C\'est une diversification risquée mais viable', score: 12, icon: '🔀' },
          { id: 'no',       label: 'Non — c\'est une direction très différente',    score: 4,  icon: '⚠️', alert: true },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // PRO-05 — DIAGNOSTIC OFFRE & PRODUITS
  // ─────────────────────────────────────────
  'PRO-05': {
    intro: 'Analysez la clarté, la pertinence et la performance de votre offre.',
    estimatedTime: '8-15 min',
    axes: ['Clarté', 'Ciblage', 'Rentabilité', 'Feedback', 'Positionnement'],
    questions: [
      {
        id: 'q1', axe: 'Clarté',
        question: 'Êtes-vous capable d\'expliquer votre offre en 2 phrases simples ?',
        type: 'single', weight: 20,
        choices: [
          { id: 'yes',     label: 'Oui, clairement et immédiatement',             score: 20, icon: '✅' },
          { id: 'partial', label: 'Oui, mais c\'est complexe à résumer',          score: 10, icon: '🤔' },
          { id: 'no',      label: 'Non, c\'est difficile à expliquer simplement', score: 2,  icon: '❌' },
        ],
      },
      {
        id: 'q2', axe: 'Ciblage',
        question: 'Savez-vous précisément à qui s\'adresse votre offre principale ?',
        type: 'single', weight: 20,
        choices: [
          { id: 'yes',   label: 'Oui — profil client précis défini',   score: 20, icon: '🎯' },
          { id: 'broad', label: 'Oui — mais public très large',        score: 10, icon: '🔍' },
          { id: 'no',    label: 'Pas vraiment',                        score: 2,  icon: '❓' },
        ],
      },
      {
        id: 'q3', axe: 'Rentabilité',
        question: 'Connaissez-vous vos marges sur vos principales offres ?',
        type: 'single', requireProof: true, weight: 20,
        choices: [
          { id: 'yes',   label: 'Oui, précisément',   score: 20, icon: '✅' },
          { id: 'approx',label: 'Approximativement',  score: 10, icon: '🔢' },
          { id: 'no',    label: 'Non',                score: 0,  icon: '❌' },
        ],
      },
      {
        id: 'q4', axe: 'Feedback',
        question: 'Avez-vous des retours clients réguliers sur votre offre ?',
        type: 'single', weight: 20,
        choices: [
          { id: 'yes',      label: 'Oui — enquêtes, avis formalisés',  score: 20, icon: '⭐' },
          { id: 'informal', label: 'Oui — retours informels réguliers', score: 12, icon: '💬' },
          { id: 'no',       label: 'Rarement ou jamais',               score: 2,  icon: '😶' },
        ],
      },
      {
        id: 'q5', axe: 'Positionnement',
        question: 'Comment positionnez-vous vos prix par rapport à la concurrence ?',
        type: 'single', weight: 10,
        choices: [
          { id: 'premium', label: 'Au-dessus du marché — premium justifié', score: 10, icon: '💎' },
          { id: 'market',  label: 'Dans la moyenne du marché',              score: 8,  icon: '⚖️' },
          { id: 'low',     label: 'En-dessous — entrée de gamme',          score: 6,  icon: '🏷️' },
          { id: 'idk',     label: 'Je ne sais pas où je me situe',         score: 0,  icon: '❓' },
        ],
      },
      {
        id: 'q6', axe: 'Clarté',
        question: 'Avez-vous développé de nouvelles offres au cours des 12 derniers mois ?',
        type: 'single', weight: 10,
        choices: [
          { id: 'yes', label: 'Oui, plusieurs', score: 10, icon: '🚀' },
          { id: 'one', label: 'Oui, une',       score: 7,  icon: '👍' },
          { id: 'no',  label: 'Non',            score: 2,  icon: '➖' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // COM-06 — DIAGNOSTIC COMMERCIAL
  // ─────────────────────────────────────────
  'COM-06': {
    intro: 'Analysez votre processus de vente, l\'acquisition clients et la fidélisation.',
    estimatedTime: '8-15 min',
    axes: ['Process', 'Indicateurs', 'Acquisition', 'Fidélisation'],
    questions: [
      {
        id: 'q1', axe: 'Process',
        question: 'Avez-vous un processus de vente défini (prospection → closing) ?',
        type: 'single', weight: 15,
        choices: [
          { id: 'yes',      label: 'Oui, formalisé et suivi',     score: 15, icon: '📋' },
          { id: 'informal', label: 'Informellement',              score: 8,  icon: '🧠' },
          { id: 'no',       label: 'Non',                         score: 1,  icon: '❌' },
        ],
      },
      {
        id: 'q2', axe: 'Indicateurs',
        question: 'Avez-vous des indicateurs commerciaux que vous suivez régulièrement ?',
        type: 'single', weight: 15,
        choices: [
          { id: 'yes',  label: 'Oui (CA, conversion, pipeline...)', score: 15, icon: '📊' },
          { id: 'some', label: 'Quelques-uns',                      score: 8,  icon: '📉' },
          { id: 'no',   label: 'Non',                               score: 1,  icon: '❌' },
        ],
      },
      {
        id: 'q3', axe: 'Acquisition',
        question: 'Quelle est votre principale source de nouveaux clients ?',
        type: 'single', weight: 15,
        choices: [
          { id: 'referral', label: 'Bouche-à-oreille / recommandation',    score: 12, icon: '💬' },
          { id: 'digital',  label: 'Digital / réseaux sociaux / SEO',      score: 14, icon: '📱' },
          { id: 'prosp',    label: 'Prospection active',                   score: 12, icon: '📞' },
          { id: 'event',    label: 'Foires, salons, événements',           score: 10, icon: '🎪' },
          { id: 'inbound',  label: 'Clients qui viennent d\'eux-mêmes',   score: 15, icon: '⭐' },
        ],
      },
      {
        id: 'q4', axe: 'Fidélisation',
        question: 'Avez-vous perdu des clients significatifs au cours des 6 derniers mois ?',
        type: 'single', requireProof: true, weight: 20,
        choices: [
          { id: 'no',    label: 'Non',                                      score: 20, icon: '✅' },
          { id: 'some',  label: 'Oui, quelques-uns',                       score: 10, icon: '😐' },
          { id: 'major', label: 'Oui, un ou plusieurs clients importants', score: 2,  icon: '🚨', alert: true },
        ],
      },
      {
        id: 'q5', axe: 'Fidélisation',
        question: 'Comment évaluez-vous votre taux de fidélisation clients ?',
        type: 'scale_1_5', hint: '1 = Très peu fidèles · 5 = Très fidèles',
        weight: 20,
      },
      {
        id: 'q6', axe: 'Acquisition',
        question: 'Faites-vous des actions marketing régulières pour acquérir de nouveaux clients ?',
        type: 'single', weight: 10,
        choices: [
          { id: 'yes', label: 'Oui, régulièrement avec budget dédié',  score: 10, icon: '✅' },
          { id: 'occ', label: 'Oui, occasionnellement',               score: 6,  icon: '📅' },
          { id: 'no',  label: 'Pas vraiment',                         score: 1,  icon: '❌' },
        ],
      },
      {
        id: 'q7', axe: 'Process',
        question: 'Avez-vous un CRM ou outil de suivi clients ?',
        type: 'single', weight: 5,
        choices: [
          { id: 'crm',   label: 'Oui, un CRM (HubSpot, Salesforce...)', score: 5, icon: '💻' },
          { id: 'excel', label: 'Oui, Excel ou tableur',                score: 4, icon: '📊' },
          { id: 'no',    label: 'Non, tout est dans ma tête',           score: 0, icon: '🧠' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // FIN-07 — DIAGNOSTIC FINANCIER
  // ─────────────────────────────────────────
  'FIN-07': {
    intro: 'Évaluez la santé financière de votre activité.',
    estimatedTime: '8-15 min',
    axes: ['Suivi', 'Rentabilité', 'Dettes', 'Prévision'],
    questions: [
      {
        id: 'q1', axe: 'Suivi',
        question: 'Faites-vous un suivi régulier de votre trésorerie ?',
        type: 'single', weight: 15,
        choices: [
          { id: 'monthly',    label: 'Oui, chaque mois',      score: 15, icon: '✅' },
          { id: 'quarterly',  label: 'Oui, chaque trimestre', score: 10, icon: '📅' },
          { id: 'rarely',     label: 'Rarement',              score: 4,  icon: '😕' },
          { id: 'no',         label: 'Non',                   score: 0,  icon: '❌' },
        ],
      },
      {
        id: 'q2', axe: 'Rentabilité',
        question: 'Connaissez-vous votre point mort (seuil de rentabilité) ?',
        type: 'single', requireProof: true, weight: 15,
        choices: [
          { id: 'yes',   label: 'Oui, précisément',    score: 15, icon: '✅' },
          { id: 'approx',label: 'Approximativement',   score: 8,  icon: '🔢' },
          { id: 'no',    label: 'Non',                 score: 0,  icon: '❌' },
        ],
      },
      {
        id: 'q3', axe: 'Rentabilité',
        question: 'Votre entreprise est-elle actuellement rentable ?',
        type: 'single', requireProof: true, weight: 20,
        choices: [
          { id: 'yes',   label: 'Oui, clairement',   score: 20, icon: '✅' },
          { id: 'break', label: 'À l\'équilibre',   score: 12, icon: '⚖️' },
          { id: 'no',    label: 'Non, en déficit',  score: 0,  icon: '❌', alert: true },
        ],
      },
      {
        id: 'q4', axe: 'Dettes',
        question: 'Avez-vous des emprunts ou dettes en cours ?',
        type: 'single', requireProof: true, weight: 15,
        choices: [
          { id: 'no',         label: 'Non',                      score: 15, icon: '✅' },
          { id: 'manageable', label: 'Oui, gérables',           score: 10, icon: '🟡' },
          { id: 'heavy',      label: 'Oui, lourdes à gérer',    score: 2,  icon: '🔴', alert: true },
        ],
      },
      {
        id: 'q5', axe: 'Suivi',
        question: 'Avez-vous des créances clients en attente de paiement ?',
        type: 'single', requireProof: true, weight: 15,
        choices: [
          { id: 'no',   label: 'Non ou très peu',                      score: 15, icon: '✅' },
          { id: 'some', label: 'Oui, quelques-unes',                   score: 8,  icon: '🟡' },
          { id: 'many', label: 'Oui, beaucoup et depuis longtemps',    score: 0,  icon: '🔴', alert: true },
        ],
      },
      {
        id: 'q6', axe: 'Prévision',
        question: 'Avez-vous une vision de votre trésorerie pour les 3 prochains mois ?',
        type: 'single', weight: 10,
        choices: [
          { id: 'yes',      label: 'Oui, avec un prévisionnel chiffré',  score: 10, icon: '📊' },
          { id: 'informal', label: 'Oui, de façon informelle',           score: 6,  icon: '🧠' },
          { id: 'no',       label: 'Non',                                score: 0,  icon: '❌' },
        ],
      },
      {
        id: 'q7', axe: 'Prévision',
        question: 'Avez-vous cherché ou obtenu des financements externes ?',
        type: 'single', weight: 5,
        choices: [
          { id: 'yes',    label: 'Oui, emprunt bancaire ou aide publique', score: 5, icon: '💳' },
          { id: 'trying', label: 'En cours de démarche',                  score: 4, icon: '🔄' },
          { id: 'no',     label: 'Non, autofinancement uniquement',       score: 3, icon: '💰' },
        ],
      },
      {
        id: 'q8', axe: 'Suivi',
        question: 'Comment gérez-vous vos charges variables (coûts ajustables) ?',
        type: 'single', weight: 5,
        choices: [
          { id: 'yes',  label: 'Je les suis et les optimise régulièrement', score: 5, icon: '✅' },
          { id: 'some', label: 'Partiellement',                             score: 3, icon: '🔧' },
          { id: 'no',   label: 'Peu de visibilité',                        score: 0, icon: '❓' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────
  // GOV-08 — DIAGNOSTIC ORGANISATION
  // ─────────────────────────────────────────
  'GOV-08': {
    intro: 'Évaluez la gouvernance, les rôles et les processus de votre organisation.',
    estimatedTime: '8-15 min',
    axes: ['Rôles', 'Décisions', 'Communication', 'Pilotage'],
    questions: [
      {
        id: 'q1', axe: 'Rôles',
        question: 'Les rôles et responsabilités sont-ils clairement définis dans votre entreprise ?',
        type: 'single', weight: 25,
        choices: [
          { id: 'yes',     label: 'Oui — tout le monde sait ce qu\'il fait', score: 25, icon: '✅' },
          { id: 'partial', label: 'Partiellement',                           score: 12, icon: '🤔' },
          { id: 'no',      label: 'Non, c\'est souvent flou',                score: 2,  icon: '❌' },
        ],
      },
      {
        id: 'q2', axe: 'Décisions',
        question: 'Avez-vous un processus de prise de décision défini ?',
        type: 'single', weight: 20,
        choices: [
          { id: 'yes',      label: 'Oui, formellement',                      score: 20, icon: '📋' },
          { id: 'informal', label: 'Oui, mais informellement',               score: 12, icon: '🧠' },
          { id: 'no',       label: 'Non, les décisions sont improvisées',    score: 2,  icon: '❌' },
        ],
      },
      {
        id: 'q3', axe: 'Communication',
        question: 'Avez-vous des réunions régulières d\'équipe ou de pilotage ?',
        type: 'single', weight: 15,
        choices: [
          { id: 'weekly',  label: 'Oui, chaque semaine',   score: 15, icon: '📅' },
          { id: 'monthly', label: 'Oui, chaque mois',      score: 12, icon: '📆' },
          { id: 'occ',     label: 'Occasionnellement',     score: 6,  icon: '🗓️' },
          { id: 'no',      label: 'Non',                   score: 1,  icon: '❌' },
        ],
      },
      {
        id: 'q4', axe: 'Communication',
        question: 'La stratégie de l\'entreprise est-elle comprise par vos collaborateurs ?',
        type: 'single', weight: 15,
        choices: [
          { id: 'yes',     label: 'Oui, elle est intégrée',         score: 15, icon: '✅' },
          { id: 'partial', label: 'Partiellement',                   score: 8,  icon: '🤔' },
          { id: 'no',      label: 'Non (ou entreprise solo)',        score: 4,  icon: '—' },
        ],
      },
      {
        id: 'q5', axe: 'Pilotage',
        question: 'Avez-vous des outils de pilotage (tableaux de bord, KPIs) ?',
        type: 'single', weight: 15,
        choices: [
          { id: 'yes',  label: 'Oui, complets et utilisés',   score: 15, icon: '📊' },
          { id: 'some', label: 'Quelques indicateurs',        score: 8,  icon: '📈' },
          { id: 'no',   label: 'Non',                         score: 1,  icon: '❌' },
        ],
      },
      {
        id: 'q6', axe: 'Rôles',
        question: 'Comment qualifiez-vous l\'ambiance et la motivation de votre équipe ?',
        type: 'scale_1_5', hint: '1 = Très mauvaise · 5 = Excellente',
        weight: 10,
      },
    ],
  },

  // ─────────────────────────────────────────
  // 360-09 — DIAGNOSTIC 360°
  // ─────────────────────────────────────────
  '360-09': {
    intro: 'Bilan complet de votre entreprise sur 8 dimensions stratégiques.',
    estimatedTime: '30-45 min',
    axes: ['Offre', 'Commercial', 'Finance', 'Organisation', 'Opérations', 'Équipe', 'Digital'],
    premium: true,
    questions: [
      {
        id: 'q1', axe: 'Offre',
        question: 'Votre offre est-elle clairement définie et bien comprise par vos clients ?',
        type: 'scale_1_5', weight: 15,
      },
      {
        id: 'q2', axe: 'Commercial',
        question: 'Votre acquisition clients est-elle efficace et régulière ?',
        type: 'scale_1_5', requireProof: true, weight: 15,
      },
      {
        id: 'q3', axe: 'Finance',
        question: 'Votre situation financière est-elle sous contrôle ?',
        type: 'scale_1_5', requireProof: true, weight: 15,
      },
      {
        id: 'q4', axe: 'Organisation',
        question: 'Les rôles et processus internes sont-ils bien définis ?',
        type: 'scale_1_5', weight: 15,
      },
      {
        id: 'q5', axe: 'Opérations',
        question: 'Votre capacité à livrer est-elle fiable et scalable ?',
        type: 'scale_1_5', weight: 15,
      },
      {
        id: 'q6', axe: 'Équipe',
        question: 'Votre équipe est-elle compétente, motivée et stable ?',
        type: 'scale_1_5', weight: 10,
      },
      {
        id: 'q7', axe: 'Digital',
        question: 'Votre présence et vos outils digitaux sont-ils adaptés à votre marché ?',
        type: 'scale_1_5', weight: 5,
      },
      {
        id: 'q8', axe: 'Défis',
        question: 'Quels sont vos 3 plus grands défis actuels ?',
        type: 'multi', weight: 0, noScore: true,
        choices: [
          { id: 'treso',    label: 'Trésorerie / finances',      icon: '💰' },
          { id: 'clients',  label: 'Acquisition de clients',     icon: '📈' },
          { id: 'team',     label: 'Équipe / ressources humaines',icon: '👥' },
          { id: 'ops',      label: 'Production / opérations',    icon: '⚙️' },
          { id: 'strategy', label: 'Stratégie et vision',        icon: '🎯' },
          { id: 'digital',  label: 'Transformation digitale',    icon: '💻' },
          { id: 'legal',    label: 'Juridique / réglementaire',  icon: '⚖️' },
          { id: 'growth',   label: 'Gérer la croissance',        icon: '🚀' },
        ],
      },
      {
        id: 'q9', axe: 'Défis',
        question: 'Quel est votre objectif principal pour les 12 prochains mois ?',
        type: 'single', noUnknown: true, weight: 0, noScore: true,
        choices: [
          { id: 'survive', label: 'Stabiliser et survivre',        icon: '🛡️' },
          { id: 'grow',    label: 'Croître de 30% ou plus',        icon: '📈' },
          { id: 'fund',    label: 'Lever des fonds',               icon: '💰' },
          { id: 'expand',  label: 'Ouvrir de nouveaux marchés',   icon: '🌍' },
          { id: 'exit',    label: 'Préparer une cession',          icon: '🏁' },
        ],
      },
    ],
  },
};

// Helpers
export const getModuleQuestions = (moduleId) =>
  MODULE_QUESTIONS[moduleId]?.questions || [];

export const getTriageQuestion = (step) =>
  TRIAGE_QUESTIONS[`s0${step}`] || null;
