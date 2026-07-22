import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiFetch } from '../api/config.js';

const ReferencesContext = createContext(null);

// Fallbacks locaux en cas de coupure de réseau ou de problème serveur
export const FALLBACK_REFERENCES = {
  user_profile_type: [
    { value: 'project_holder', label: 'Porteur de projet' },
    { value: 'active_entrepreneur', label: 'Entrepreneur en activité' },
    { value: 'structured_sme', label: 'PME structurée' },
    { value: 'distressed_business', label: 'Entreprise en difficulté' },
    { value: 'opportunity_seeker', label: "Recherche d'opportunité" },
    { value: 'institutional_curious', label: 'Institutionnel / curieux' }
  ],
  activity_stage: [
    { value: 'not_launched', label: 'Pas encore lancé' },
    { value: 'occasional_sales', label: 'Ventes occasionnelles' },
    { value: 'regular_sales', label: 'Ventes régulières' },
    { value: 'structured_activity', label: 'Activité structurée' },
    { value: 'declining_sales', label: 'Ventes en baisse' }
  ],
  primary_need: [
    { value: 'clarify_project', label: 'Tester ou clarifier mon idée de projet' },
    { value: 'global_understanding', label: 'Comprendre globalement mon entreprise' },
    { value: 'urgent_difficulty', label: 'Résoudre une difficulté urgente' },
    { value: 'increase_sales', label: 'Améliorer mes ventes / trouver plus de clients' },
    { value: 'clarify_offer', label: 'Clarifier mon offre, produits ou prix' },
    { value: 'understand_finance', label: 'Comprendre trésorerie, charges, rentabilité' },
    { value: 'organize_business', label: 'Mieux organiser rôles et décisions' },
    { value: 'assess_opportunity', label: 'Savoir si je suis prêt pour une opportunité' },
    { value: 'prepare_financing', label: 'Préparer une demande de financement' },
    { value: 'unknown_need', label: 'Je ne sais pas exactement' }
  ],
  risk_flag: [
    { value: 'cannot_pay_current_expenses', label: 'Difficulté à payer les charges courantes', severity: 'CRITIQUE' },
    { value: 'supplier_tax_salary_debt_arrears', label: 'Retards dettes, impôts, fournisseurs, salaires', severity: 'CRITIQUE' },
    { value: 'cash_insufficient_continuity', label: 'Trésorerie insuffisante pour continuer', severity: 'CRITIQUE' },
    { value: 'sales_strong_decline', label: 'Forte baisse des ventes', severity: 'ÉLEVÉ' },
    { value: 'lost_major_client', label: "Perte d'un client important", severity: 'ÉLEVÉ' },
    { value: 'production_delivery_blocked', label: 'Blocage production / incapacité à livrer', severity: 'ÉLEVÉ' },
    { value: 'internal_conflict_key_departure', label: 'Conflits internes / départs critiques', severity: 'MOYEN' },
    { value: 'none', label: 'Aucune de ces situations', severity: null },
    { value: 'prefer_not_to_answer', label: 'Je préfère ne pas répondre', severity: null }
  ],
  opporttunity_type: [
    { value: 'financing', label: 'Obtenir un financement' },
    { value: 'new_market', label: 'Accéder à un nouveau marché' },
    { value: 'tender_large_account', label: "Répondre à un appel d'offres / grand compte" },
    { value: 'partnership', label: 'Trouver un partenaire' },
    { value: 'capacity_investment', label: 'Investir ou augmenter ma capacité' },
    { value: 'none', label: 'Non' },
    { value: 'unknown', label: 'Je ne sais pas encore' }
  ],
  dominant_topic: [
    { value: 'product', label: 'Mon produit, offre ou prix' },
    { value: 'commercial', label: 'Mes ventes, clients, communication' },
    { value: 'finance', label: 'Ma trésorerie, charges, rentabilité' },
    { value: 'governance', label: 'Mon organisation, rôles, décisions' },
    { value: 'hr', label: 'Mon équipe, compétences, motivation' },
    { value: 'operations', label: 'Ma production, délais, capacité à livrer' },
    { value: 'formalization', label: 'Ma formalisation, documents, obligations' },
    { value: 'digital', label: 'Mon usage du digital' },
    { value: 'full_360', label: 'Je veux tout analyser' },
    { value: 'unknown', label: 'Je ne sais pas' }
  ],
  departments: [
    'Atlantique', 'Littoral', 'Ouémé', 'Borgou', 'Zou', 'Collines', 'Plateau', 'Mono', 'Couffo', 'Donga', 'Atacora', 'Alibori', 'Autre'
  ],
  department_communes: {
    'Alibori': ['Banikoara', 'Gogounou', 'Kandi', 'Karimama', 'Malanville', 'Segbana'],
    'Atacora': ['Boukoumbé', 'Cobly', 'Kérou', 'Kouandé', 'Matéri', 'Natitingou', 'Péhunco', 'Tanguiéta', 'Toucountouna'],
    'Atlantique': ['Abomey-Calavi', 'Allada', 'Kpomassè', 'Ouidah', 'Sô-Ava', 'Toffo', 'Tori-Bossito', 'Zè'],
    'Borgou': ['Bembéréké', 'Kalalé', "N'Dali", 'Nikki', 'Parakou', 'Pèrèrè', 'Sinendé', 'Tchaourou'],
    'Collines': ['Bantè', 'Dassa-Zoumé', 'Glazoué', 'Ouèssè', 'Savalou', 'Savè'],
    'Couffo': ['Aplahoué', 'Djakotomey', 'Dogbo', 'Klouékanmè', 'Lalo', 'Toviklin'],
    'Donga': ['Bassila', 'Copargo', 'Djougou', 'Ouaké'],
    'Littoral': ['Cotonou'],
    'Mono': ['Athiémé', 'Bopa', 'Comè', 'Grand-Popo', 'Houéyogbé', 'Lokossa'],
    'Ouémé': ['Adjarra', 'Adjohoun', 'Aguégués', 'Akpro-Missérété', 'Avrankou', 'Bonou', 'Dangbo', 'Porto-Novo', 'Sèmè-Kpodji'],
    'Plateau': ['Adja-Ouèrè', 'Ifangni', 'Kétou', 'Pobè', 'Sakété'],
    'Zou': ['Abomey', 'Agbangnizoun', 'Bohicon', 'Covè', 'Djidja', 'Ouinhi', 'Za-Kpota', 'Zagnanado', 'Zogbodomey']
  },
  sectors: [
    'Agriculture',
    'Agro-transformation',
    'Commerce',
    'Services',
    'Industrie',
    'Numérique',
    'Artisanat',
    'Transport',
    'Tourisme',
    'Santé',
    'Éducation',
    'BTP',
    'Autre'
  ]
};

export const ReferencesProvider = ({ children }) => {
  const [references, setReferences] = useState(FALLBACK_REFERENCES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiFetch('/reference-list')
      .then(res => {
        if (active && res) {
          // Fusionner avec fallbacks en cas de champs manquants
          setReferences({
            user_profile_type: res.user_profile_type || FALLBACK_REFERENCES.user_profile_type,
            activity_stage: res.activity_stage || FALLBACK_REFERENCES.activity_stage,
            primary_need: res.primary_need || FALLBACK_REFERENCES.primary_need,
            risk_flag: res.risk_flag || FALLBACK_REFERENCES.risk_flag,
            opporttunity_type: res.opporttunity_type || FALLBACK_REFERENCES.opporttunity_type,
            dominant_topic: res.dominant_topic || FALLBACK_REFERENCES.dominant_topic,
            departments: res.departments || FALLBACK_REFERENCES.departments,
            department_communes: res.department_communes || FALLBACK_REFERENCES.department_communes,
            sectors: res.sectors || FALLBACK_REFERENCES.sectors,
          });
        }
      })
      .catch(err => {
        console.warn("API /reference-list non joignable. Utilisation des fallbacks locaux.", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  return (
    <ReferencesContext.Provider value={{ references, loading }}>
      {children}
    </ReferencesContext.Provider>
  );
};

export const useReferences = () => {
  const context = useContext(ReferencesContext);
  if (!context) {
    throw new Error('useReferences doit être utilisé au sein d’un ReferencesProvider');
  }
  return context;
};
