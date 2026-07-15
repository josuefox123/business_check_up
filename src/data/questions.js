/**
 * Questions data for each module
 */

export const MODULES_QUESTIONS = {
  'FLH-01': [
    { id: 'q1', question: 'Votre activité vend-elle actuellement des produits ou services ?', type: 'single', choices: [{ id:'yes', label:'Oui, régulièrement' }, { id:'occ', label:'Oui, mais occasionnellement' }, { id:'no', label:'Non, pas encore' }] },
    { id: 'q2', question: 'Comment évaluez-vous votre situation de trésorerie actuelle ?', type: 'single', requireProof: true, choices: [{ id:'good', label:'Confortable (plus de 3 mois de charges)' }, { id:'ok', label:'Acceptable (1-3 mois)' }, { id:'tight', label:'Tendue (moins d\'un mois)' }, { id:'crisis', label:'Critique (difficultés à payer)' }] },
    { id: 'q3', question: 'Avez-vous des clients récurrents (qui reviennent acheter) ?', type: 'single', choices: [{ id:'many', label:'Oui, la majorité de mes clients reviennent' }, { id:'some', label:'Oui, quelques-uns' }, { id:'no', label:'Non, surtout des clients one-shot' }] },
    { id: 'q4', question: 'Comment évaluez-vous votre maîtrise du marché dans lequel vous opérez ?', type: 'scale_1_5', hint: '1 = Très peu, 5 = Très bien' },
    { id: 'q5', question: 'Avez-vous un plan commercial ou une stratégie de développement formalisée ?', type: 'single', choices: [{ id:'yes', label:'Oui, écrite et suivie' }, { id:'mental', label:'Oui, dans ma tête' }, { id:'no', label:'Non, pas encore' }] },
    { id: 'q6', question: 'Sur quelle dimension souhaitez-vous vous améliorer en priorité ?', type: 'single', choices: [{ id:'sales', label:'Ventes et clients' }, { id:'finance', label:'Finances et trésorerie' }, { id:'product', label:'Offre et produits' }, { id:'org', label:'Organisation et équipe' }] },
    { id: 'q7', question: 'Rencontrez-vous des difficultés dans votre secteur en ce moment ?', type: 'multi', choices: [{ id:'competition', label:'Concurrence accrue' }, { id:'costs', label:'Hausse des coûts' }, { id:'demand', label:'Baisse de la demande' }, { id:'supply', label:'Problèmes d\'approvisionnement' }, { id:'regulation', label:'Nouvelles réglementations' }, { id:'none', label:'Aucune difficulté particulière' }] },
  ],

  'DIF-03': [
    { id: 'q1', question: 'Quelle est la principale nature de la difficulté que vous traversez ?', type: 'single', choices: [{ id:'fin', label:'Financière (trésorerie, dettes)' }, { id:'com', label:'Commerciale (chute des ventes)' }, { id:'ops', label:'Opérationnelle (production, livraison)' }, { id:'rh', label:'Humaine (départs, conflits)' }, { id:'all', label:'Plusieurs difficultés combinées' }] },
    { id: 'q2', question: 'Depuis combien de temps cette difficulté est-elle présente ?', type: 'single', choices: [{ id:'new', label:'Moins de 1 mois' }, { id:'recent', label:'1 à 3 mois' }, { id:'long', label:'3 à 6 mois' }, { id:'chronic', label:'Plus de 6 mois' }] },
    { id: 'q3', question: 'Avez-vous des dettes ou retards de paiement en cours ?', type: 'single', requireProof: true, choices: [{ id:'none', label:'Non, aucune' }, { id:'fournisseurs', label:'Oui, envers des fournisseurs' }, { id:'fisc', label:'Oui, fiscales ou sociales' }, { id:'bank', label:'Oui, bancaires' }, { id:'multiple', label:'Plusieurs types de dettes' }] },
    { id: 'q4', question: 'Combien de mois de charges pouvez-vous couvrir avec votre trésorerie actuelle ?', type: 'single', requireProof: true, choices: [{ id:'0', label:'Moins d\'un mois' }, { id:'1-3', label:'1 à 3 mois' }, { id:'3-6', label:'3 à 6 mois' }, { id:'6+', label:'Plus de 6 mois' }] },
    { id: 'q5', question: 'Avez-vous déjà contacté des conseillers ou structures d\'accompagnement ?', type: 'single', choices: [{ id:'yes', label:'Oui, je suis déjà accompagné' }, { id:'tried', label:'J\'ai essayé mais sans résultat' }, { id:'no', label:'Non, pas encore' }] },
    { id: 'q6', question: 'Quel est votre besoin le plus urgent en ce moment ?', type: 'single', choices: [{ id:'cash', label:'Liquidités / financement d\'urgence' }, { id:'customers', label:'Retrouver des clients et du chiffre' }, { id:'advice', label:'Un conseiller pour m\'orienter' }, { id:'legal', label:'Informations juridiques / légales' }] },
    { id: 'q7', question: 'Avez-vous envisagé ou discuté de solutions comme un prêt, une aide ou une restructuration ?', type: 'single', choices: [{ id:'yes-ok', label:'Oui, et c\'est en cours' }, { id:'yes-no', label:'Oui, mais sans résultat' }, { id:'no', label:'Non, pas encore' }] },
    { id: 'q8', question: 'Comment évaluez-vous votre moral et votre énergie actuellement ?', type: 'scale_1_5', hint: '1 = Très bas / épuisé, 5 = Déterminé et combatif' },
    { id: 'q9', question: 'Avez-vous des ressources (famille, épargne, associés) sur lesquelles vous appuyer ?', type: 'single', choices: [{ id:'yes', label:'Oui, significatives' }, { id:'some', label:'Un peu' }, { id:'no', label:'Non, très peu' }] },
    { id: 'q10', question: 'Êtes-vous prêt à prendre des décisions difficiles pour redresser la situation ?', type: 'single', noUnknown: true, choices: [{ id:'yes', label:'Oui, tout à fait' }, { id:'maybe', label:'Oui, mais j\'ai besoin d\'aide pour décider' }, { id:'no', label:'Pas encore, j\'évalue la situation' }] },
  ],

  'PRJ-02': [
    { id: 'q1', question: 'Avez-vous clairement défini le problème que votre projet cherche à résoudre ?', type: 'single', choices: [{ id:'yes', label:'Oui, très clairement' }, { id:'partial', label:'En partie seulement' }, { id:'no', label:'Pas encore' }] },
    { id: 'q2', question: 'Avez-vous identifié vos clients cibles (profil, besoins, comportements) ?', type: 'single', choices: [{ id:'yes', label:'Oui, avec une bonne précision' }, { id:'partial', label:'Vaguement' }, { id:'no', label:'Non' }] },
    { id: 'q3', question: 'Avez-vous testé votre idée auprès de clients potentiels ?', type: 'single', requireProof: true, choices: [{ id:'yes-paid', label:'Oui, et j\'ai eu des commandes ou paiements' }, { id:'yes-feedback', label:'Oui, j\'ai reçu des retours positifs' }, { id:'interviews', label:'Oui, par des interviews ou sondages' }, { id:'no', label:'Non, pas encore' }] },
    { id: 'q4', question: 'Avez-vous une idée de vos coûts de démarrage ?', type: 'single', choices: [{ id:'yes-precise', label:'Oui, avec un chiffrage précis' }, { id:'yes-approx', label:'Oui, une estimation grossière' }, { id:'no', label:'Non' }] },
    { id: 'q5', question: 'Avez-vous une source de financement pour démarrer ?', type: 'single', choices: [{ id:'own', label:'Oui, mes propres économies' }, { id:'external', label:'Oui, financement externe (famille, emprunt, aide)' }, { id:'looking', label:'Non, je cherche encore' }, { id:'small', label:'Pas besoin de beaucoup' }] },
    { id: 'q6', question: 'Avez-vous des concurrents directs ou des alternatives existantes pour les clients ?', type: 'single', choices: [{ id:'yes-many', label:'Oui, nombreux' }, { id:'yes-few', label:'Oui, quelques-uns' }, { id:'none', label:'Non, c\'est une niche' }, { id:'idk', label:'Je ne sais pas' }] },
    { id: 'q7', question: 'Avez-vous les compétences clés pour exécuter ce projet seul ou en équipe ?', type: 'single', choices: [{ id:'yes', label:'Oui, toutes les compétences nécessaires' }, { id:'partial', label:'La plupart, il manque quelques expertises' }, { id:'no', label:'Non, il me faut des partenaires ou recrutements' }] },
    { id: 'q8', question: 'Quelle est la principale force de votre projet selon vous ?', type: 'single', choices: [{ id:'innovation', label:'Très innovant ou différenciant' }, { id:'price', label:'Prix très compétitif' }, { id:'network', label:'Réseau et accès au marché' }, { id:'expertise', label:'Expertise rare ou unique' }] },
  ],

  'OPP-04': [
    { id: 'q1', question: 'Quelle est l\'opportunité que vous cherchez à saisir ?', type: 'single', choices: [{ id:'funding', label:'Obtenir un financement' }, { id:'market', label:'Accéder à un nouveau marché' }, { id:'tender', label:'Répondre à un appel d\'offres' }, { id:'partner', label:'Trouver un partenaire' }, { id:'grow', label:'Augmenter significativement ma capacité' }] },
    { id: 'q2', question: 'Dans quel délai cette opportunité doit-elle être saisie ?', type: 'single', choices: [{ id:'urgent', label:'Dans les 30 jours' }, { id:'mid', label:'Dans les 3 mois' }, { id:'long', label:'Dans les 6 mois ou plus' }] },
    { id: 'q3', question: 'Votre trésorerie vous permet-elle d\'investir dans cette opportunité ?', type: 'single', requireProof: true, choices: [{ id:'yes', label:'Oui, sans problème' }, { id:'tight', label:'Oui, mais de façon limitée' }, { id:'no', label:'Non, j\'aurais besoin de financement' }] },
    { id: 'q4', question: 'Avez-vous les ressources humaines (temps, compétences, équipe) pour exécuter ?', type: 'single', choices: [{ id:'yes', label:'Oui, pleinement' }, { id:'partial', label:'Partiellement — il faudrait un recrutement' }, { id:'no', label:'Non, l\'équipe est déjà saturée' }] },
    { id: 'q5', question: 'Avez-vous déjà évalué les risques de cette opportunité ?', type: 'single', choices: [{ id:'yes', label:'Oui, avec un plan de mitigation' }, { id:'partial', label:'Oui, mais de façon informelle' }, { id:'no', label:'Pas encore' }] },
    { id: 'q6', question: 'Cette opportunité est-elle alignée avec votre stratégie actuelle ?', type: 'single', choices: [{ id:'yes', label:'Oui, c\'est dans notre axe de développement' }, { id:'possible', label:'C\'est une diversification risquée mais possible' }, { id:'no', label:'Non, c\'est une direction différente' }] },
  ],

  'PRO-05': [
    { id: 'q1', question: 'Êtes-vous capable d\'expliquer votre offre en 2 phrases simples ?', type: 'single', choices: [{ id:'yes', label:'Oui, clairement' }, { id:'partial', label:'Oui, mais c\'est complexe à expliquer' }, { id:'no', label:'Non, c\'est difficile à résumer' }] },
    { id: 'q2', question: 'Savez-vous précisément à qui s\'adresse votre offre principale ?', type: 'single', choices: [{ id:'yes', label:'Oui, avec un profil client précis' }, { id:'broad', label:'Oui, mais c\'est un public très large' }, { id:'no', label:'Pas vraiment' }] },
    { id: 'q3', question: 'Connaissez-vous vos marges sur vos principales offres ?', type: 'single', requireProof: true, choices: [{ id:'yes', label:'Oui, précisément' }, { id:'approx', label:'Approximativement' }, { id:'no', label:'Non' }] },
    { id: 'q4', question: 'Avez-vous des retours clients réguliers sur votre offre ?', type: 'single', choices: [{ id:'yes', label:'Oui, formellement (enquêtes, avis)' }, { id:'informal', label:'Oui, de façon informelle' }, { id:'no', label:'Rarement ou jamais' }] },
    { id: 'q5', question: 'Comment positionner vos prix par rapport à la concurrence ?', type: 'single', choices: [{ id:'premium', label:'Au-dessus du marché (premium)' }, { id:'market', label:'Dans la moyenne du marché' }, { id:'low', label:'En-dessous (entrée de gamme)' }, { id:'idk', label:'Je ne sais pas où je me situe' }] },
    { id: 'q6', question: 'Avez-vous développé de nouvelles offres au cours des 12 derniers mois ?', type: 'single', choices: [{ id:'yes', label:'Oui, plusieurs' }, { id:'one', label:'Oui, une' }, { id:'no', label:'Non' }] },
  ],

  'COM-06': [
    { id: 'q1', question: 'Avez-vous un processus de vente défini (prospection → closing) ?', type: 'single', choices: [{ id:'yes', label:'Oui, formalisé' }, { id:'informal', label:'Informellement' }, { id:'no', label:'Non' }] },
    { id: 'q2', question: 'Avez-vous des indicateurs commerciaux que vous suivez régulièrement ?', type: 'single', choices: [{ id:'yes', label:'Oui (CA, taux de conversion, pipeline...)' }, { id:'some', label:'Quelques-uns' }, { id:'no', label:'Non' }] },
    { id: 'q3', question: 'Quelle est votre principale source de nouveaux clients ?', type: 'single', choices: [{ id:'referral', label:'Bouche-à-oreille / recommandation' }, { id:'digital', label:'Digital / réseaux sociaux / SEO' }, { id:'prosp', label:'Prospection active (appels, emails)' }, { id:'event', label:'Foires, salons, événements' }, { id:'inbound', label:'Clients qui viennent d\'eux-mêmes' }] },
    { id: 'q4', question: 'Avez-vous perdu des clients significatifs au cours des 6 derniers mois ?', type: 'single', requireProof: true, choices: [{ id:'no', label:'Non' }, { id:'some', label:'Oui, quelques-uns' }, { id:'major', label:'Oui, un ou plusieurs clients importants' }] },
    { id: 'q5', question: 'Comment évaluez-vous votre taux de fidélisation clients ?', type: 'scale_1_5', hint: '1 = Très peu fidèles, 5 = Très fidèles' },
    { id: 'q6', question: 'Faites-vous des actions marketing régulières pour acquérir de nouveaux clients ?', type: 'single', choices: [{ id:'yes', label:'Oui, régulièrement et avec budget dédié' }, { id:'occ', label:'Oui, occasionnellement' }, { id:'no', label:'Pas vraiment' }] },
    { id: 'q7', question: 'Avez-vous un CRM ou outil de suivi clients ?', type: 'single', choices: [{ id:'crm', label:'Oui, un CRM (HubSpot, Salesforce, etc.)' }, { id:'excel', label:'Oui, Excel ou autre' }, { id:'no', label:'Non, tout est dans ma tête' }] },
  ],

  'FIN-07': [
    { id: 'q1', question: 'Faites-vous un suivi régulier de votre trésorerie ?', type: 'single', choices: [{ id:'monthly', label:'Oui, chaque mois' }, { id:'quarterly', label:'Oui, chaque trimestre' }, { id:'rarely', label:'Rarement' }, { id:'no', label:'Non' }] },
    { id: 'q2', question: 'Connaissez-vous votre point mort (seuil de rentabilité) ?', type: 'single', requireProof: true, choices: [{ id:'yes', label:'Oui, précisément' }, { id:'approx', label:'Approximativement' }, { id:'no', label:'Non' }] },
    { id: 'q3', question: 'Votre entreprise est-elle actuellement rentable ?', type: 'single', requireProof: true, choices: [{ id:'yes', label:'Oui, clairement' }, { id:'break', label:'À l\'équilibre' }, { id:'no', label:'Non, en déficit' }] },
    { id: 'q4', question: 'Avez-vous des emprunts ou dettes en cours ?', type: 'single', requireProof: true, choices: [{ id:'no', label:'Non' }, { id:'manageable', label:'Oui, gérables' }, { id:'heavy', label:'Oui, lourdes à gérer' }] },
    { id: 'q5', question: 'Avez-vous des factures en attente de paiement (créances clients) ?', type: 'single', requireProof: true, choices: [{ id:'no', label:'Non ou très peu' }, { id:'some', label:'Oui, quelques-unes' }, { id:'many', label:'Oui, beaucoup et depuis longtemps' }] },
    { id: 'q6', question: 'Avez-vous une vision de votre trésorerie pour les 3 prochains mois ?', type: 'single', choices: [{ id:'yes', label:'Oui, avec un prévisionnel' }, { id:'informal', label:'Oui, mais de façon informelle' }, { id:'no', label:'Non' }] },
    { id: 'q7', question: 'Avez-vous cherché ou obtenu des financements externes ?', type: 'single', choices: [{ id:'yes', label:'Oui, emprunt bancaire ou aide' }, { id:'trying', label:'En cours de démarche' }, { id:'no', label:'Non, autofinancement uniquement' }] },
    { id: 'q8', question: 'Comment gérez-vous vos charges variables ?', type: 'single', choices: [{ id:'yes', label:'Je les suis et les optimise régulièrement' }, { id:'some', label:'Partiellement' }, { id:'no', label:'Peu de visibilité' }] },
  ],

  'GOV-08': [
    { id: 'q1', question: 'Les rôles et responsabilités sont-ils clairement définis dans votre entreprise ?', type: 'single', choices: [{ id:'yes', label:'Oui, tout le monde sait ce qu\'il fait' }, { id:'partial', label:'Partiellement' }, { id:'no', label:'Non, c\'est souvent flou' }] },
    { id: 'q2', question: 'Avez-vous un processus de prise de décision défini ?', type: 'single', choices: [{ id:'yes', label:'Oui, formellement' }, { id:'informal', label:'Oui, mais informellement' }, { id:'no', label:'Non, les décisions sont souvent improvisées' }] },
    { id: 'q3', question: 'Avez-vous des réunions régulières d\'équipe ou de pilotage ?', type: 'single', choices: [{ id:'weekly', label:'Oui, chaque semaine' }, { id:'monthly', label:'Oui, chaque mois' }, { id:'occ', label:'Occasionnellement' }, { id:'no', label:'Non' }] },
    { id: 'q4', question: 'La stratégie de l\'entreprise est-elle connue et comprise par vos collaborateurs ?', type: 'single', choices: [{ id:'yes', label:'Oui, ils l\'ont intégrée' }, { id:'partial', label:'Partiellement' }, { id:'no', label:'Non ou entreprise solo' }] },
    { id: 'q5', question: 'Avez-vous des outils de pilotage (tableaux de bord, KPIs) ?', type: 'single', choices: [{ id:'yes', label:'Oui, complets et utilisés' }, { id:'some', label:'Quelques indicateurs' }, { id:'no', label:'Non' }] },
    { id: 'q6', question: 'Comment qualifiez-vous l\'ambiance et la motivation au sein de votre équipe ?', type: 'scale_1_5', hint: '1 = Très mauvaise, 5 = Excellente' },
  ],

  '360-09': [
    { id: 'q1', question: 'Offre & Produits : Votre offre est-elle clairement définie et comprise par vos clients ?', type: 'scale_1_5' },
    { id: 'q2', question: 'Commercial : Votre acquisition clients est-elle efficace et régulière ?', type: 'scale_1_5', requireProof: true },
    { id: 'q3', question: 'Finance : Votre situation financière est-elle sous contrôle ?', type: 'scale_1_5', requireProof: true },
    { id: 'q4', question: 'Organisation : Les rôles et processus sont-ils bien définis ?', type: 'scale_1_5' },
    { id: 'q5', question: 'Opérations : Votre capacité à livrer est-elle fiable et scalable ?', type: 'scale_1_5' },
    { id: 'q6', question: 'Équipe : Votre équipe est-elle compétente, motivée et stable ?', type: 'scale_1_5' },
    { id: 'q7', question: 'Digital : Votre présence et vos outils digitaux sont-ils adaptés ?', type: 'scale_1_5' },
    { id: 'q8', question: 'Quels sont vos 3 plus grands défis actuels ?', type: 'multi', choices: [
      { id:'treso', label:'Trésorerie / finances' },
      { id:'clients', label:'Acquisition de clients' },
      { id:'team', label:'Équipe / RH' },
      { id:'ops', label:'Production / opérations' },
      { id:'strategy', label:'Stratégie et vision' },
      { id:'digital', label:'Transformation digitale' },
      { id:'legal', label:'Juridique / réglementaire' },
      { id:'growth', label:'Gérer la croissance' },
    ]},
    { id: 'q9', question: 'Quel est votre objectif principal pour les 12 prochains mois ?', type: 'single', noUnknown: true, choices: [
      { id:'survive', label:'Stabiliser et survivre' },
      { id:'grow', label:'Croître de 30%+' },
      { id:'fund', label:'Lever des fonds' },
      { id:'expand', label:'Ouvrir de nouveaux marchés' },
      { id:'exit', label:'Préparer une cession' },
    ]},
  ],
};

/**
 * Calculate score from answers
 */
export const calculateScore = (moduleId, answers) => {
  const questions = MODULES_QUESTIONS[moduleId] || [];
  if (questions.length === 0) return 50;

  let total = 0;
  let max = 0;

  questions.forEach(q => {
    if (q.type === 'scale_1_5') {
      const val = answers[q.id];
      if (val && val !== 'idk') {
        total += (parseInt(val) / 5) * 20;
        max += 20;
      }
    } else if (q.type === 'single') {
      const positiveAnswers = ['yes', 'good', 'many', 'monthly', 'yes-ok', 'yes-paid', 'yes-precise', 'formal', 'weekly', 'crm', 'yes-feedback'];
      const negativeAnswers = ['no', 'crisis', 'chronic', 'multiple', 'heavy', 'many'];
      const val = answers[q.id];
      if (val) {
        if (positiveAnswers.includes(val)) { total += 15; max += 15; }
        else if (negativeAnswers.includes(val)) { max += 15; }
        else { total += 8; max += 15; }
      }
    }
  });

  if (max === 0) return 50;
  return Math.max(5, Math.min(95, Math.round((total / max) * 100)));
};
