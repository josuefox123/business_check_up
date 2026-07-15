export const diagnosticData = [
  {
    id: 's01',
    title: "1. Quel est le statut de votre entreprise ?",
    choices: [
      { id: 'c1', label: "En cours de création / Projet", icon: 'rocket' },
      { id: 'c2', label: "Déjà créée et en activité", icon: 'building' }
    ]
  },
  {
    id: 's02',
    title: "2. Quelle est votre activité principale ?",
    choices: [
      { id: 'c1', label: "Prestations de services (B2B/B2C)", icon: 'briefcase' },
      { id: 'c2', label: "Commerce de détail / E-commerce", icon: 'cart' },
      { id: 'c3', label: "Industrie / Artisanat / BTP", icon: 'wrench' },
      { id: 'c4', label: "Technologie / Software / SaaS", icon: 'monitor' }
    ]
  },
  {
    id: 's03',
    title: "3. Quel est votre chiffre d'affaires annuel ?",
    choices: [
      { id: 'c1', label: "Moins de 100 k€" },
      { id: 'c2', label: "100 k€ - 500 k€" },
      { id: 'c3', label: "500 k€ - 1 M€" },
      { id: 'c4', label: "Plus de 1 M€" }
    ]
  },
  {
    id: 's04',
    title: "4. De combien de mois de trésorerie disposez-vous pour faire face à vos engagements ?",
    choices: [
      { id: 'c1', label: "Moins d'un mois" },
      { id: 'c2', label: "1 à 3 mois" },
      { id: 'c3', label: "3 à 6 mois" },
      { id: 'c4', label: "Plus de 6 mois" }
    ]
  },
  {
    id: 's05',
    title: "5. Votre entreprise est-elle rentable ?",
    choices: [
      { id: 'c1', label: "Oui, nous dégageons des bénéfices" },
      { id: 'c2', label: "À l'équilibre (ni perte ni profit)" },
      { id: 'c3', label: "Non, nous sommes en déficit" }
    ]
  },
  {
    id: 's06',
    title: "6. Avez-vous déjà levé des fonds ou contracté des emprunts importants ?",
    choices: [
      { id: 'c1', label: "Oui, levée de fonds (VC/Business Angels)" },
      { id: 'c2', label: "Oui, emprunts bancaires / Bpifrance" },
      { id: 'c3', label: "Non, autofinancement uniquement" }
    ]
  },
  {
    id: 's07',
    title: "7. Combien de personnes composent votre équipe à plein temps ?",
    choices: [
      { id: 'c1', label: "1 (Fondateur unique)", icon: 'users' },
      { id: 'c2', label: "2 à 5 personnes", icon: 'users' },
      { id: 'c3', label: "6 à 20 personnes", icon: 'users' },
      { id: 'c4', label: "Plus de 20 personnes", icon: 'users' }
    ]
  },
  {
    id: 's08',
    title: "8. Quel est votre objectif prioritaire pour les 6 prochains mois ?",
    choices: [
      { id: 'c1', label: "Survivre / Stabiliser la trésorerie", icon: 'shield' },
      { id: 'c2', label: "Accélérer la croissance commerciale", icon: 'trending' },
      { id: 'c3', label: "Recruter des profils clés", icon: 'users' },
      { id: 'c4', label: "Préparer une levée de fonds", icon: 'rocket' }
    ]
  },
  {
    id: 's09',
    title: "9. De quel type d'accompagnement pensez-vous avoir le plus besoin ?",
    choices: [
      { id: 'c1', label: "Conseil stratégique et financier", icon: 'briefcase' },
      { id: 'c2', label: "Mise en relation avec des investisseurs", icon: 'handshake' },
      { id: 'c3', label: "Mentorat opérationnel (Sales/Product)", icon: 'users' },
      { id: 'c4', label: "Aucun pour le moment", icon: 'shield' }
    ]
  }
];
