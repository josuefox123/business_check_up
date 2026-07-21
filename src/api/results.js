/**
 * FUND.lab — API Layer: results.js
 * Générateur intelligent de résultats : forces, fragilités,
 * recommandations et plan d'action, basés sur les scores par axe.
 */

import { getScoreLevel, detectAlerts } from './scoring.js';
import { MODULE_QUESTIONS } from './questions.js';

// ─────────────────────────────────────────
// BANQUE DE RECOMMANDATIONS PAR MODULE / AXE
// ─────────────────────────────────────────
const RECO_BANK = {
  'FLH-01': {
    Ventes: {
      low:  { title: 'Régulariser les ventes',        desc: 'Mettez en place un processus commercial simple : prospection hebdomadaire, relances clients et tableau de suivi des ventes.', urgency: 'haute' },
      mid:  { title: 'Stabiliser le cycle de vente',  desc: 'Identifiez pourquoi vos ventes sont irrégulières et ajustez votre plan commercial en conséquence.', urgency: 'moyenne' },
      high: { title: 'Capitaliser sur la dynamique',  desc: 'Vos ventes sont bonnes. Explorez comment les automatiser ou les scaler vers de nouveaux segments.', urgency: 'basse' },
    },
    Trésorerie: {
      low:  { title: 'Sécuriser la trésorerie en urgence', desc: 'Dressez immédiatement un tableau de trésorerie à 90 jours et identifiez les dépenses à réduire ou reporter.', urgency: 'critique' },
      mid:  { title: 'Améliorer la gestion de trésorerie',  desc: 'Mettez en place un suivi mensuel de trésorerie et anticipez vos besoins de financement sur 3 mois.', urgency: 'haute' },
      high: { title: 'Optimiser la trésorerie',             desc: 'Votre trésorerie est saine. Investissez l\'excédent dans des opportunités de croissance ou une épargne de précaution.', urgency: 'basse' },
    },
    Clients: {
      low:  { title: 'Mettre en place une stratégie de fidélisation', desc: 'Identifiez vos 10 meilleurs clients et développez un programme de suivi personnalisé.', urgency: 'haute' },
      mid:  { title: 'Structurer la relation client',                 desc: 'Créez un suivi régulier avec vos clients existants pour augmenter la récurrence d\'achat.', urgency: 'moyenne' },
      high: { title: 'Exploiter votre base clients fidèles',          desc: 'Votre fidélisation est forte. Transformez vos clients en ambassadeurs via un programme de recommandation.', urgency: 'basse' },
    },
    Marché: {
      low:  { title: 'Mieux connaître votre marché',   desc: 'Réalisez une veille concurrentielle et rencontrez au moins 10 acteurs de votre secteur ce trimestre.', urgency: 'haute' },
      mid:  { title: 'Approfondir la connaissance marché', desc: 'Participez à des événements sectoriels et formalisez une analyse concurrentielle annuelle.', urgency: 'moyenne' },
      high: { title: 'Valoriser votre expertise marché', desc: 'Votre maîtrise du marché est un atout. Utilisez-la pour affiner votre positionnement et anticiper les tendances.', urgency: 'basse' },
    },
    Stratégie: {
      low:  { title: 'Formaliser votre stratégie',    desc: 'Réservez 1 journée ce mois pour écrire votre plan commercial sur 12 mois : objectifs, actions, ressources.', urgency: 'haute' },
      mid:  { title: 'Structurer votre plan d\'action', desc: 'Transcrivez votre stratégie en document partagé avec des étapes et jalons clairs.', urgency: 'moyenne' },
      high: { title: 'Affiner la stratégie', desc: 'Votre stratégie est documentée. Revoyez-la trimestriellement et impliquez votre équipe dans les ajustements.', urgency: 'basse' },
    },
  },

  'PRJ-02': {
    Concept: {
      low:  { title: 'Valider le problème à résoudre',       desc: 'Avant tout, confirmez que le problème que vous adressez existe réellement. Faites 15 entretiens qualitatifs.', urgency: 'critique' },
      mid:  { title: 'Affiner la proposition de valeur',      desc: 'Testez différentes formulations de votre offre auprès de votre cible pour trouver le message qui résonne.', urgency: 'haute' },
      high: { title: 'Développer un avantage concurrentiel', desc: 'Votre concept est bien défini. Travaillez à construire des barrières à l\'entrée durables.', urgency: 'basse' },
    },
    Clientèle: {
      low:  { title: 'Définir un persona client précis',   desc: 'Créez une fiche persona avec : âge, revenu, habitudes, frustrations et motivations d\'achat de votre client idéal.', urgency: 'critique' },
      mid:  { title: 'Affiner le ciblage',                  desc: 'Réduisez votre cible pour vous concentrer sur le segment le plus rentable et le plus accessible.', urgency: 'haute' },
      high: { title: 'Approfondir la connaissance client',  desc: 'Votre ciblage est clair. Développez une carte du parcours client pour identifier les points de friction.', urgency: 'basse' },
    },
    'Modèle économique': {
      low:  { title: 'Modéliser l\'économie du projet',    desc: 'Utilisez un canvas financier simple : coûts fixes, coûts variables, prix de vente, point mort.', urgency: 'critique' },
      mid:  { title: 'Affiner le modèle financier',        desc: 'Précisez vos hypothèses de coûts et de revenus avec un prévisionnel sur 18 mois.', urgency: 'haute' },
      high: { title: 'Optimiser le modèle de revenu',      desc: 'Votre modèle économique est défini. Explorez des modèles alternatifs (abonnement, freemium) pour maximiser la LTV.', urgency: 'basse' },
    },
    Financement: {
      low:  { title: 'Identifier les sources de financement', desc: 'Explorez les options : fonds propres, famille & amis, microfinance, subventions locales, incubateurs.', urgency: 'haute' },
      mid:  { title: 'Consolider le plan de financement',     desc: 'Formalisez un plan de financement sur 24 mois et identifiez les besoins en fonds de roulement.', urgency: 'moyenne' },
      high: { title: 'Optimiser l\'usage du capital',         desc: 'Votre financement est sécurisé. Définissez des KPIs de dépense pour maximiser le ROI de chaque investissement.', urgency: 'basse' },
    },
    Exécution: {
      low:  { title: 'Constituer l\'équipe fondatrice',  desc: 'Identifiez les compétences manquantes et cherchez des co-fondateurs ou prestataires clés.', urgency: 'haute' },
      mid:  { title: 'Renforcer l\'équipe',              desc: 'Définissez un plan de recrutement ou de partenariat pour combler les lacunes dans les 6 prochains mois.', urgency: 'moyenne' },
      high: { title: 'Structurer l\'exécution',         desc: 'Votre équipe est en place. Formalisez un roadmap produit et des milestones clairs pour les 12 prochains mois.', urgency: 'basse' },
    },
  },

  'DIF-03': {
    Nature: {
      low:  { title: 'Diagnostiquer la source réelle',    desc: 'Distinguez les symptômes (trésorerie) des causes profondes (manque de clients, coûts trop élevés). Utilisez la méthode des 5 Pourquoi.', urgency: 'critique' },
      mid:  { title: 'Traiter la difficulté identifiée',  desc: 'Vous avez identifié la nature du problème. Priorisez 3 actions à lancer immédiatement pour stopper l\'hémorragie.', urgency: 'haute' },
      high: { title: 'Consolider les acquis',             desc: 'Votre situation se stabilise. Construisez des indicateurs de surveillance pour prévenir une récidive.', urgency: 'moyenne' },
    },
    Finances: {
      low:  { title: 'Plan de trésorerie d\'urgence',     desc: 'Établissez un plan de trésorerie à 30/60/90 jours. Négociez des délais avec vos créanciers et prioritisez les paiements critiques.', urgency: 'critique' },
      mid:  { title: 'Restructurer les dettes',            desc: 'Renégociez les échéances de vos dettes. Explorez les dispositifs d\'aide publique disponibles dans votre région.', urgency: 'haute' },
      high: { title: 'Consolider la santé financière',    desc: 'Votre situation financière se stabilise. Mettez en place un tableau de bord financier mensuel.', urgency: 'moyenne' },
    },
    Ressources: {
      low:  { title: 'Chercher un accompagnement d\'urgence', desc: 'Contactez dans les 48h une chambre de commerce, un incubateur ou une structure d\'appui pour un accompagnement gratuit.', urgency: 'critique' },
      mid:  { title: 'Structurer votre réseau de soutien',   desc: 'Identifiez 3 mentors ou conseillers qui peuvent vous aider à traverser cette période difficile.', urgency: 'haute' },
      high: { title: 'Valoriser les ressources disponibles', desc: 'Vous avez des ressources. Utilisez-les stratégiquement pour accélérer le redressement.', urgency: 'moyenne' },
    },
    Plan: {
      low:  { title: 'Élaborer un plan de redressement', desc: 'Rédigez un plan de redressement sur 90 jours avec des objectifs hebdomadaires clairs et mesurables.', urgency: 'critique' },
      mid:  { title: 'Accélérer la mise en œuvre',       desc: 'Des solutions sont envisagées. Accélérez leur mise en œuvre et définissez un responsable pour chaque action.', urgency: 'haute' },
      high: { title: 'Piloter le redressement',          desc: 'Un plan est en place. Mettez en place des revues hebdomadaires pour ajuster en temps réel.', urgency: 'moyenne' },
    },
  },

  'OPP-04': {
    'Capacité financière': {
      low:  { title: 'Sécuriser le financement avant d\'avancer', desc: 'Sans trésorerie suffisante, cette opportunité risque de vous fragiliser. Commencez par sécuriser un financement complémentaire.', urgency: 'critique' },
      mid:  { title: 'Évaluer le besoin financier précis',        desc: 'Chiffrez précisément l\'investissement requis et explorez le financement partiel (microcrédits, partenaires).', urgency: 'haute' },
      high: { title: 'Optimiser le déploiement du capital',       desc: 'Votre capacité financière est suffisante. Phasez l\'investissement pour minimiser les risques.', urgency: 'basse' },
    },
    'Capacité humaine': {
      low:  { title: 'Évaluer la faisabilité opérationnelle', desc: 'Si votre équipe est saturée, prendre cette opportunité peut dégrader votre activité principale. Priorisez ou déléguez.', urgency: 'critique' },
      mid:  { title: 'Planifier les recrutements',            desc: 'Identifiez les profils à recruter ou les prestataires à engager pour supporter cette opportunité.', urgency: 'haute' },
      high: { title: 'Affecter les ressources',               desc: 'Votre équipe peut absorber cette opportunité. Définissez les rôles et les responsabilités clairement.', urgency: 'basse' },
    },
    Risques: {
      low:  { title: 'Analyser les risques en priorité',    desc: 'Avant de vous engager, listez les 5 risques principaux et définissez un plan B pour chacun.', urgency: 'haute' },
      mid:  { title: 'Formaliser le plan de mitigation',    desc: 'Vos risques sont identifiés mais pas encore maîtrisés. Formalisez un plan de gestion des risques.', urgency: 'moyenne' },
      high: { title: 'Monitorer les risques',               desc: 'Votre analyse des risques est solide. Mettez en place des indicateurs de surveillance.', urgency: 'basse' },
    },
    Délai: {
      low:  { title: 'Prendre une décision rapide',         desc: 'L\'opportunité est imminente. Décidez dans les 72h si vous pouvez vous engager ou si vous devez décliner.', urgency: 'critique', icon: '⏰' },
      mid:  { title: 'Planifier la saisie de l\'opportunité', desc: 'Le délai est raisonnable. Établissez un plan d\'action détaillé avec un calendrier précis.', urgency: 'haute' },
      high: { title: 'Préparer une réponse structurée',     desc: 'Vous avez du temps. Utilisez-le pour préparer une proposition solide et différenciante.', urgency: 'basse' },
    },
  },

  'PRO-05': {
    Clarté: {
      low:  { title: 'Clarifier le pitch de l\'offre',         desc: 'Si vous ne pouvez pas expliquer votre offre en 2 phrases, vos clients ne la comprendront pas. Travaillez votre pitch en 30 secondes.', urgency: 'haute' },
      mid:  { title: 'Simplifier le message commercial',        desc: 'Testez différentes formulations de votre offre avec 5 clients et retenez celle qui génère le plus d\'intérêt.', urgency: 'moyenne' },
      high: { title: 'Décliner le pitch sur tous les canaux', desc: 'Votre offre est claire. Assurez-vous que ce message est cohérent sur tous vos supports de communication.', urgency: 'basse' },
    },
    Ciblage: {
      low:  { title: 'Définir le client idéal (ICP)',     desc: 'Sans ciblage précis, vos efforts commerciaux se dispersent. Créez un profil de client idéal et concentrez-vous sur lui.', urgency: 'haute' },
      mid:  { title: 'Affiner la segmentation client',     desc: 'Votre cible est vaguement définie. Segmentez votre base clients et identifiez votre segment le plus rentable.', urgency: 'moyenne' },
      high: { title: 'Approfondir la connaissance ICP',   desc: 'Votre ciblage est précis. Enrichissez votre connaissance client avec des entretiens réguliers (1x/trimestre).', urgency: 'basse' },
    },
    Rentabilité: {
      low:  { title: 'Calculer les marges par produit/service', desc: 'Sans connaissance des marges, vous naviguez à l\'aveugle. Calculez le coût de revient de chaque offre immédiatement.', urgency: 'critique' },
      mid:  { title: 'Optimiser la structure tarifaire',         desc: 'Vos marges sont approximatives. Précisez-les et identifiez l\'offre la plus rentable à développer en priorité.', urgency: 'haute' },
      high: { title: 'Maximiser les marges',                    desc: 'Vous connaissez vos marges. Explorez des stratégies pour les augmenter (upsell, bundling, réduction des coûts).', urgency: 'basse' },
    },
    Feedback: {
      low:  { title: 'Mettre en place une boucle de feedback', desc: 'Mettez en place un formulaire de satisfaction simple après chaque vente pour collecter des avis systématiquement.', urgency: 'haute' },
      mid:  { title: 'Formaliser la collecte d\'avis',          desc: 'Vous collectez des retours informels. Structurez ce processus avec des questions précises et mesurables.', urgency: 'moyenne' },
      high: { title: 'Exploiter les insights clients',          desc: 'Vos retours clients sont réguliers. Organisez des sessions mensuelles d\'analyse pour piloter l\'évolution de l\'offre.', urgency: 'basse' },
    },
    Positionnement: {
      low:  { title: 'Clarifier le positionnement prix',  desc: 'Si vous ne savez pas où vous situez par rapport à la concurrence, vous risquez de sous-vendre ou de perdre des clients sensibles au prix.', urgency: 'haute' },
      mid:  { title: 'Affiner la stratégie de prix',      desc: 'Votre positionnement est défini mais perfectible. Testez une augmentation de tarif de 10% sur vos offres premium.', urgency: 'moyenne' },
      high: { title: 'Valoriser le positionnement',       desc: 'Votre positionnement est clair. Communiquez davantage sur votre différenciation pour justifier vos tarifs.', urgency: 'basse' },
    },
  },

  'COM-06': {
    Process: {
      low:  { title: 'Créer un processus de vente simple', desc: 'Définissez les 5 étapes de votre cycle de vente (prospection, premier contact, présentation, objections, closing) et documentez-le.', urgency: 'haute' },
      mid:  { title: 'Formaliser le processus commercial',  desc: 'Vous avez un processus informel. Documentez-le et formez votre équipe pour garantir la cohérence.', urgency: 'moyenne' },
      high: { title: 'Optimiser et automatiser',           desc: 'Votre process est en place. Automatisez les étapes répétitives (relances, suivi) pour gagner du temps.', urgency: 'basse' },
    },
    Indicateurs: {
      low:  { title: 'Mettre en place des KPIs commerciaux',  desc: 'Commencez par suivre 3 indicateurs : CA mensuel, nombre de nouveaux clients, taux de conversion. Revoyez-les chaque semaine.', urgency: 'haute' },
      mid:  { title: 'Enrichir le tableau de bord',           desc: 'Vous avez quelques indicateurs. Ajoutez le coût d\'acquisition client (CAC) et la valeur vie client (LTV).', urgency: 'moyenne' },
      high: { title: 'Piloter par les données',               desc: 'Vos indicateurs sont bien définis. Analysez les tendances trimestrielles pour anticiper les évolutions du marché.', urgency: 'basse' },
    },
    Acquisition: {
      low:  { title: 'Diversifier les canaux d\'acquisition',  desc: 'Ne dépendre que d\'un seul canal est risqué. Testez 2 nouveaux canaux ce trimestre et mesurez leur efficacité.', urgency: 'haute' },
      mid:  { title: 'Optimiser les canaux existants',          desc: 'Analysez le ROI de chaque canal et concentrez 80% de vos efforts sur les 2 plus performants.', urgency: 'moyenne' },
      high: { title: 'Scaler l\'acquisition',                   desc: 'Votre acquisition est efficace. Définissez un budget marketing mensuel et testez des campagnes payantes.', urgency: 'basse' },
    },
    Fidélisation: {
      low:  { title: 'Mettre en place un suivi client post-vente', desc: 'Contactez chaque client 30 jours après l\'achat pour recueillir son avis et proposer un prochain achat.', urgency: 'haute' },
      mid:  { title: 'Développer un programme de fidélité',        desc: 'Identifiez vos clients les plus fidèles et créez une offre spéciale ou un avantage réservé.', urgency: 'moyenne' },
      high: { title: 'Transformer les clients en ambassadeurs',    desc: 'Votre fidélisation est bonne. Développez un programme de référencement pour activer le bouche-à-oreille.', urgency: 'basse' },
    },
  },

  'FIN-07': {
    Suivi: {
      low:  { title: 'Mettre en place un suivi de trésorerie',   desc: 'Créez un tableau Excel simple avec : encaissements prévus, décaissements prévus, solde. Mettez-le à jour chaque semaine.', urgency: 'critique' },
      mid:  { title: 'Professionnaliser le suivi financier',     desc: 'Utilisez un outil de comptabilité simple (Wave, QuickBooks) pour automatiser le suivi de vos finances.', urgency: 'haute' },
      high: { title: 'Optimiser le reporting financier',         desc: 'Votre suivi est régulier. Ajoutez une analyse des écarts entre prévisions et réalisations chaque mois.', urgency: 'basse' },
    },
    Rentabilité: {
      low:  { title: 'Calculer et atteindre le point mort',     desc: 'Calculez immédiatement votre seuil de rentabilité mensuel et définissez un plan d\'action pour l\'atteindre dans 90 jours.', urgency: 'critique' },
      mid:  { title: 'Améliorer les marges',                    desc: 'Identifiez vos 3 offres les plus rentables et concentrez vos efforts commerciaux sur celles-ci.', urgency: 'haute' },
      high: { title: 'Maximiser la profitabilité',              desc: 'Votre rentabilité est positive. Explorez des leviers pour augmenter les marges : réduction coûts, montée en gamme.', urgency: 'basse' },
    },
    Dettes: {
      low:  { title: 'Restructurer les dettes en urgence',  desc: 'Prenez contact avec vos créanciers pour négocier des rééchelonnements. Priorisez les dettes fiscales et sociales.', urgency: 'critique' },
      mid:  { title: 'Optimiser la gestion des dettes',     desc: 'Vos dettes sont gérables. Établissez un calendrier de remboursement et anticipez les échéances à risque.', urgency: 'haute' },
      high: { title: 'Maintenir une structure saine',       desc: 'Votre endettement est sous contrôle. Maintenez un ratio dettes/capitaux propres sain et anticipez tout nouveau besoin de financement.', urgency: 'basse' },
    },
    Prévision: {
      low:  { title: 'Construire un prévisionnel de trésorerie', desc: 'Un prévisionnel sur 3 mois est indispensable. Estimez vos entrées et sorties d\'argent semaine par semaine.', urgency: 'haute' },
      mid:  { title: 'Formaliser le plan financier',              desc: 'Vous avez une vision informelle. Formalisez un prévisionnel sur 6 mois et revoyez-le chaque mois.', urgency: 'moyenne' },
      high: { title: 'Étendre l\'horizon financier',              desc: 'Votre prévision est solide. Étendez-la à 12-18 mois pour anticiper les besoins de financement futurs.', urgency: 'basse' },
    },
  },

  'GOV-08': {
    Rôles: {
      low:  { title: 'Définir les rôles et responsabilités',   desc: 'Créez une matrice RACI simple pour votre équipe. Chaque tâche clé doit avoir un responsable unique clairement désigné.', urgency: 'haute' },
      mid:  { title: 'Clarifier les zones de responsabilité',   desc: 'Des flous subsistent. Organisez une session de travail avec l\'équipe pour aligner les responsabilités.', urgency: 'moyenne' },
      high: { title: 'Renforcer la culture des responsabilités', desc: 'Les rôles sont définis. Formalisez des fiches de poste et révisez-les annuellement.', urgency: 'basse' },
    },
    Décisions: {
      low:  { title: 'Formaliser le processus décisionnel',  desc: 'Définissez qui peut décider quoi et à quelle hauteur. Un cadre de délégation simple accélère l\'exécution.', urgency: 'haute' },
      mid:  { title: 'Améliorer la gouvernance',             desc: 'Votre processus décisionnel est informel. Formalisez les décisions stratégiques (investissement, recrutement) en comité.', urgency: 'moyenne' },
      high: { title: 'Renforcer la gouvernance d\'entreprise', desc: 'Votre gouvernance est bonne. Envisagez la mise en place d\'un comité stratégique externe pour challenger vos décisions.', urgency: 'basse' },
    },
    Communication: {
      low:  { title: 'Instaurer des rituels d\'équipe',      desc: 'Lancez une réunion hebdomadaire de 30 minutes avec votre équipe pour synchroniser les priorités et lever les blocages.', urgency: 'haute' },
      mid:  { title: 'Améliorer la communication interne',   desc: 'Vous avez des réunions, mais peu régulières. Instaurez un rythme fixe et respectez-le.', urgency: 'moyenne' },
      high: { title: 'Enrichir les échanges d\'équipe',      desc: 'La communication est bonne. Ajoutez des sessions trimestrielles de stratégie et de bilan.', urgency: 'basse' },
    },
    Pilotage: {
      low:  { title: 'Mettre en place un tableau de bord',  desc: 'Choisissez 5 KPIs clés pour votre activité et créez un tableau de bord que vous consultez chaque semaine.', urgency: 'haute' },
      mid:  { title: 'Enrichir les outils de pilotage',     desc: 'Vous avez quelques indicateurs. Structurez un tableau de bord complet avec des cibles et des seuils d\'alerte.', urgency: 'moyenne' },
      high: { title: 'Automatiser le pilotage',             desc: 'Votre pilotage est efficace. Explorez des outils de BI (Power BI, Google Looker) pour automatiser vos reportings.', urgency: 'basse' },
    },
  },

  '360-09': {
    Offre: {
      low:  { title: 'Redéfinir la proposition de valeur', desc: 'Repartez des besoins clients réels pour reformuler votre offre. Faites 10 entretiens clients ce mois.', urgency: 'critique' },
      mid:  { title: 'Améliorer la clarté de l\'offre',   desc: 'Simplifiez votre offre et travaillez votre pitch commercial en 30 secondes.', urgency: 'haute' },
      high: { title: 'Innover et différencier',            desc: 'Votre offre est claire. Planifiez l\'évolution de votre gamme sur 18 mois.', urgency: 'basse' },
    },
    Commercial: {
      low:  { title: 'Structurer le développement commercial', desc: 'Mettez en place un pipeline de vente et des objectifs mensuels clairs pour chaque commercial.', urgency: 'critique' },
      mid:  { title: 'Optimiser l\'efficacité commerciale',    desc: 'Analysez votre taux de conversion par canal et doublez les efforts sur le canal le plus performant.', urgency: 'haute' },
      high: { title: 'Scaler le commercial',                   desc: 'Votre commercial fonctionne bien. Explorez des stratégies de croissance accélérée.', urgency: 'basse' },
    },
    Finance: {
      low:  { title: 'Stabiliser la situation financière', desc: 'Mettez en place un suivi de trésorerie mensuel et un plan de redressement sur 90 jours.', urgency: 'critique' },
      mid:  { title: 'Améliorer la gestion financière',    desc: 'Précisez vos prévisions financières et mettez en place des indicateurs de rentabilité.', urgency: 'haute' },
      high: { title: 'Optimiser la performance financière', desc: 'Vos finances sont saines. Explorez l\'accès à des financements pour accélérer la croissance.', urgency: 'basse' },
    },
  },
};

// ─────────────────────────────────────────
// GÉNÉRATEUR DE FORCES ET FRAGILITÉS
// ─────────────────────────────────────────
export const generateForcesFragilites = (axeScores, moduleId) => {
  const sorted = Object.entries(axeScores).sort((a, b) => b[1].score - a[1].score);

  const forces = sorted
    .filter(([, { score }]) => score >= 65)
    .slice(0, 3)
    .map(([axe, { score }]) => ({
      axe,
      score,
      label: `${axe} — ${score}%`,
      type: 'force',
    }));

  const fragilites = sorted
    .filter(([, { score }]) => score < 50)
    .slice(0, 4)
    .map(([axe, { score }]) => ({
      axe,
      score,
      label: `${axe} — ${score}%`,
      type: 'fragilite',
      urgent: score < 30,
    }));

  return { forces, fragilites };
};

// ─────────────────────────────────────────
// GÉNÉRATEUR DE RECOMMANDATIONS
// ─────────────────────────────────────────
export const generateRecommendations = (axeScores, moduleId) => {
  const moduleRecos = RECO_BANK[moduleId] || {};
  const recommendations = [];

  Object.entries(axeScores).forEach(([axe, { score }]) => {
    const axeRecos = moduleRecos[axe];
    if (!axeRecos) return;

    let level;
    if (score >= 65) level = 'high';
    else if (score >= 40) level = 'mid';
    else level = 'low';

    const reco = axeRecos[level];
    if (reco) {
      recommendations.push({ axe, score, ...reco });
    }
  });

  // Trier par urgence
  const urgencyOrder = { critique: 0, haute: 1, moyenne: 2, basse: 3 };
  return recommendations.sort((a, b) =>
    (urgencyOrder[a.urgency] ?? 4) - (urgencyOrder[b.urgency] ?? 4)
  );
};

// ─────────────────────────────────────────
// PLAN D'ACTION PRIORISÉ
// ─────────────────────────────────────────
export const generateActionPlan = (recommendations, alerts = []) => {
  const plan = [];

  // Alertes critiques en premier
  alerts.forEach(alert => {
    plan.push({
      priority: 1,
      timeframe: '7 jours',
      title: ` Traiter en urgence : ${alert.axe}`,
      desc: `Signal critique détecté sur « ${alert.answer} ». Agissez immédiatement.`,
      type: 'alerte',
      urgency: 'critique',
    });
  });

  // Recommandations critiques et hautes
  recommendations
    .filter(r => r.urgency === 'critique' || r.urgency === 'haute')
    .slice(0, 3)
    .forEach((r, i) => {
      plan.push({
        priority: plan.length + 1,
        timeframe: r.urgency === 'critique' ? '30 jours' : '60 jours',
        title: r.title,
        desc: r.desc,
        axe: r.axe,
        type: 'action',
        urgency: r.urgency,
        icon: r.icon,
      });
    });

  // Recommandations moyennes
  recommendations
    .filter(r => r.urgency === 'moyenne')
    .slice(0, 2)
    .forEach(r => {
      plan.push({
        priority: plan.length + 1,
        timeframe: '90 jours',
        title: r.title,
        desc: r.desc,
        axe: r.axe,
        type: 'amélioration',
        urgency: r.urgency,
        icon: r.icon,
      });
    });

  return plan;
};

// ─────────────────────────────────────────
// GÉNÉRATION COMPLÈTE DES RÉSULTATS
// ─────────────────────────────────────────
export const generateFullResults = (moduleId, answers, scoreData) => {
  const { global, axes, level, alerts } = scoreData;
  const { forces, fragilites } = generateForcesFragilites(axes, moduleId);
  const recommendations = generateRecommendations(axes, moduleId);
  const actionPlan = generateActionPlan(recommendations, alerts);

  // Synthèse narrative
  const moduleName = MODULE_QUESTIONS[moduleId]?.intro || '';

  let synthese;
  if (global >= 75) {
    synthese = `Votre entreprise présente une bonne maturité globale (${global}/100). Vos points forts sont solides et vous disposez d'une base saine pour vous développer. Concentrez-vous sur l'optimisation de vos axes les plus faibles pour atteindre l'excellence.`;
  } else if (global >= 55) {
    synthese = `Votre entreprise est dans une situation intermédiaire (${global}/100). Vous avez des forces réelles sur lesquelles vous appuyer, mais plusieurs axes nécessitent un effort structuré. Priorisez les actions à fort impact dans les 90 prochains jours.`;
  } else if (global >= 35) {
    synthese = `Votre situation présente des fragilités importantes (${global}/100). Certains axes sont en dessous du seuil critique et demandent une attention immédiate. Commencez par les actions prioritaires avant d'envisager une phase de croissance.`;
  } else {
    synthese = `Votre situation est fragile et nécessite des actions urgentes (${global}/100). Concentrez-vous exclusivement sur la stabilisation de votre activité dans les 30 prochains jours. Un accompagnement professionnel est fortement recommandé.`;
  }

  return {
    score: global,
    level,
    synthese,
    axes,
    forces,
    fragilites,
    recommendations,
    actionPlan,
    alerts,
    moduleId,
    generatedAt: new Date().toISOString(),
  };
};
