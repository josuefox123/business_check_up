export const PROFILES_LIST = [
  {
    id: 'creator',
    label: 'Porteur de projet',
    sublabel: 'Idée en cours de validation ou étude de marché',
    color: '#2659F2', // brand-blue
    colorLight: 'rgba(38, 89, 242, 0.04)',
    colorBorder: 'rgba(38, 89, 242, 0.15)'
  },
  {
    id: 'active',
    label: 'Entrepreneur en activité',
    sublabel: 'Ventes régulières ou structure déjà lancée',
    color: '#00B8A3', // brand-teal
    colorLight: 'rgba(0, 184, 163, 0.04)',
    colorBorder: 'rgba(0, 184, 163, 0.15)'
  },
  {
    id: 'pme',
    label: 'Dirigeant de PME',
    sublabel: 'Activité structurée avec équipe en place',
    color: '#0F172A', // dark slate
    colorLight: 'rgba(15, 23, 42, 0.03)',
    colorBorder: 'rgba(15, 23, 42, 0.12)'
  },
  {
    id: 'diffic',
    label: 'Entreprise en difficulté',
    sublabel: 'Baisse de ventes ou tension financière critique',
    color: '#EF4444', // red danger
    colorLight: 'rgba(239, 68, 68, 0.04)',
    colorBorder: 'rgba(239, 68, 68, 0.15)'
  },
  {
    id: 'opport',
    label: 'Recherche d\'opportunité',
    sublabel: 'Projet de développement ou nouveau marché',
    color: '#F59E0B', // amber warning
    colorLight: 'rgba(245, 158, 11, 0.04)',
    colorBorder: 'rgba(245, 158, 11, 0.15)'
  },
  {
    id: 'curious',
    label: 'Curieux ou Institutionnel',
    sublabel: 'Découvrir la plateforme et ses modules',
    color: '#64748B', // slate gray
    colorLight: 'rgba(100, 116, 139, 0.04)',
    colorBorder: 'rgba(100, 116, 139, 0.15)'
  }
];

export const PROFILE_GOOGLE_ICONS = {
  creator: 'lightbulb',
  active: 'store',
  pme: 'corporate_fare',
  diffic: 'warning',
  opport: 'trending_up',
  curious: 'visibility'
};

export const S04_CHOICES = [
  { id: 'no', label: 'Non, pas encore' },
  { id: 'occ', label: 'Oui, mais de manière occasionnelle' },
  { id: 'reg', label: 'Oui, régulièrement' },
  { id: 'team', label: 'Oui, avec équipe et clients réguliers' },
  { id: 'drop', label: 'Mes ventes ont fortement baissé' },
];

export const S06_CHOICES = [
  { id: 'prj', label: 'Tester ou clarifier mon idée de projet' },
  { id: 'flh', label: 'Comprendre globalement mon entreprise' },
  { id: 'dif', label: 'Résoudre une difficulté urgente' },
  { id: 'com', label: 'Améliorer mes ventes / trouver plus de clients' },
  { id: 'pro', label: 'Clarifier mon offre, produits ou prix' },
  { id: 'fin', label: 'Comprendre trésorerie, charges, rentabilité' },
  { id: 'gov', label: 'Mieux organiser rôles et décisions' },
  { id: 'opp', label: 'Savoir si je suis prêt pour une opportunité' },
  { id: 'fun', label: 'Préparer une demande de financement' },
  { id: 'idk', label: 'Je ne sais pas exactement' },
];

export const S07_CHOICES = [
  { id: 'charges', label: 'Difficulté à payer les charges courantes', severity: 'CRITIQUE' },
  { id: 'dettes', label: 'Retards dettes, impôts, fournisseurs, salaires', severity: 'CRITIQUE' },
  { id: 'treso', label: 'Trésorerie insuffisante pour continuer', severity: 'CRITIQUE' },
  { id: 'ventes', label: 'Forte baisse des ventes', severity: 'ÉLEVÉ' },
  { id: 'client', label: 'Perte d\'un client important', severity: 'ÉLEVÉ' },
  { id: 'livraison', label: 'Blocage production / incapacité à livrer', severity: 'ÉLEVÉ' },
  { id: 'conflit', label: 'Conflits internes / départs critiques', severity: 'MOYEN' },
  { id: 'none', label: 'Aucune de ces situations', severity: null },
  { id: 'prefer', label: 'Je préfère ne pas répondre', severity: null },
];

export const S08_CHOICES = [
  { id: 'funding', label: 'Obtenir un financement' },
  { id: 'market', label: 'Accéder à un nouveau marché' },
  { id: 'tender', label: 'Répondre à un appel d\'offres / grand compte' },
  { id: 'partner', label: 'Trouver un partenaire' },
  { id: 'invest', label: 'Investir ou augmenter ma capacité' },
  { id: 'no', label: 'Non' },
  { id: 'idk', label: 'Je ne sais pas encore' },
];

export const S09_CHOICES = [
  { id: 'pro', label: 'Mon produit, offre ou prix' },
  { id: 'com', label: 'Mes ventes, clients, communication' },
  { id: 'fin', label: 'Ma trésorerie, charges, rentabilité' },
  { id: 'gov', label: 'Mon organisation, rôles, décisions' },
  { id: 'rh', label: 'Mon équipe, compétences, motivation' },
  { id: 'ops', label: 'Ma production, délais, capacité à livrer' },
  { id: 'for', label: 'Ma formalisation, documents, obligations' },
  { id: 'dig', label: 'Mon usage du digital' },
  { id: '360', label: 'Je veux tout analyser' },
  { id: 'idk', label: 'Je ne sais pas' },
];

export const CONFIDENCE_CHOICES = [
  { id: 'E1', label: 'Déclaratif simple', sub: 'Pas de justificatif à fournir.' },
  { id: 'E2', label: 'Éléments de preuve partiels', sub: 'Documents de suivi interne, devis.' },
  { id: 'E3', label: 'Éléments de preuve complets', sub: 'États financiers certifiés, contrats signés.' }
];
