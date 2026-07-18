/**
 * All diagnostic screen components — S01 to S99
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, ChoiceCard, CheckboxCard, ProgressBar, ScoreGauge, Badge } from '../ui/index.jsx';
import { ScreenWrapper } from '../layout/Navbar.jsx';
import logoImg from '../../assets/logo.png';
import './screens.css';
import aboutIllustration from '../../assets/about_illustration.png';


const CheckIcon = () => (
  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
    <path d="M1 5L4 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

import { 
  Rocket, Store, Building2, AlertTriangle, Target, Lightbulb, ArrowRight, ChevronLeft,
  Lock, AlertOctagon, HelpCircle, Check, CheckSquare, Award, Clock, BarChart2, FileText,
  Users, TrendingUp, Calendar, CheckCircle, ShieldCheck, Download, Activity, Zap,
  Globe, MessageSquare, Handshake
} from 'lucide-react';

/* ============================================================
   S01 — CONSENTEMENT
   ============================================================ */
export const ConsentScreen = ({ onContinue, onBack }) => {
  const [checked, setChecked] = useState({ diag: false, stats: false, contact: false });
  const [error, setError] = useState(false);

  const toggle = (key) => {
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
    setError(false);
  };

  const handleSubmit = () => {
    if (!checked.diag || !checked.stats) { setError(true); return; }
    onContinue({ ...checked });
  };

  return (
    <ScreenWrapper>
      <div className="consent-wrap animate-fade-up">
        <div className="screen-icon-header" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div className="screen-icon" style={{ background: 'var(--color-blue-light)', color: 'var(--color-blue)', padding: '12px', borderRadius: '50%' }}>
            <Lock size={32} />
          </div>
        </div>
        <h1 className="screen-title" style={{ textAlign: 'center' }}>Avant de commencer</h1>
        <p className="screen-subtitle" style={{ textAlign: 'center', margin: '0 auto 24px', maxWidth: '520px' }}>
          Vos réponses serviront à produire votre diagnostic, à vous orienter et à produire des statistiques
          agrégées pour mieux comprendre les besoins des entrepreneurs.
        </p>

        <div className="consent-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {[
            { key: 'diag', label: "J'accepte l'utilisation de mes réponses pour le diagnostic", optional: false },
            { key: 'stats', label: "J'accepte l'usage agrégé des données", optional: false },
            { key: 'contact', label: "J'accepte d'être recontacté", optional: true },
          ].map(item => (
            <button 
              key={item.key} 
              className={`consent-item ${checked[item.key] ? 'checked' : ''}`} 
              onClick={() => toggle(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--slate-200)',
                background: checked[item.key] ? 'rgba(38,89,242,0.04)' : 'var(--bg-white)',
                borderColor: checked[item.key] ? 'var(--color-blue)' : 'var(--slate-200)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <div 
                className="consent-check" 
                style={{ 
                  width: '20px', 
                  height: '20px', 
                  borderRadius: '6px', 
                  border: '2px solid var(--slate-300)',
                  borderColor: checked[item.key] ? 'var(--color-blue)' : 'var(--slate-300)',
                  background: checked[item.key] ? 'var(--color-blue)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  flexShrink: 0
                }}
              >
                {checked[item.key] && <Check size={14} strokeWidth={3} />}
              </div>
              <div className="consent-text" style={{ flex: 1 }}>
                <span className="consent-label" style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                  {item.label}
                </span>
                {item.optional && (
                  <span className="consent-optional" style={{ marginLeft: '8px', fontSize: '0.75rem', color: 'var(--slate-400)', background: 'var(--slate-100)', padding: '2px 8px', borderRadius: '9999px', fontWeight: 'bold' }}>
                    Optionnel
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {error && (
          <div className="consent-error" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-danger)', background: 'var(--color-danger-bg)', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.88rem', fontWeight: 600 }}>
            <AlertOctagon size={16} />
            <span>Vous devez accepter l'utilisation des réponses ET l'usage agrégé pour commencer.</span>
          </div>
        )}

        <div className="screen-nav">
          <Button variant="outline" onClick={onBack}>Retour</Button>
          <Button variant="primary" onClick={handleSubmit}>Continuer</Button>
        </div>
      </div>
    </ScreenWrapper>
  );
};

/* ============================================================
   S02 — CHOIX D'ENTRÉE
   ============================================================ */
import { Compass } from 'lucide-react';

export const ChoixEntreeScreen = ({ onAssisted, onCatalog, onLearnMore }) => {
  return (
    <ScreenWrapper>
      <div className="question-wrap animate-fade-up">
        <h1 className="screen-title">Que souhaitez-vous faire ?</h1>
        <p className="screen-subtitle" style={{marginBottom:'var(--space-8)'}}>
          Sélectionnez l'option qui correspond le mieux à votre besoin actuel.
        </p>
        <div className="choices-list" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <ChoiceCard
            label="Aidez-moi à choisir le bon diagnostic"
            icon={<Compass size={20} className="text-blue" />}
            selected={false}
            onClick={onAssisted}
          />
          <ChoiceCard
            label="Je sais déjà ce que je veux diagnostiquer"
            icon={<Target size={20} className="text-teal" />}
            selected={false}
            onClick={onCatalog}
          />
          <ChoiceCard
            label="Je veux comprendre l'outil"
            icon={<HelpCircle size={20} className="text-slate" />}
            selected={false}
            onClick={onLearnMore}
          />
        </div>
      </div>
    </ScreenWrapper>
  );
};

/* ============================================================
   S03 — SÉLECTION DE PROFIL (Premium — API-driven)
   ============================================================ */
import { PROFILES_LIST } from '../../api/index.js';



// Icônes professionnelles Google Fonts (Material Symbols Outlined) par profil
const PROFILE_GOOGLE_ICONS = {
  project: 'lightbulb',
  active:  'storefront',
  pme:     'corporate_fare',
  diffic:  'warning',
  opport:  'track_changes',
  curious: 'info',
};

export const S03Screen = ({ onContinue, onSelect, onBack, initialAnswer }) => {
  const [selected, setSelected] = useState(initialAnswer || null);
  const handleCb = onContinue || onSelect; // compatibilité DiagnosticApp

  const handleConfirm = () => {
    if (selected && handleCb) handleCb(selected);
  };

  return (
    <ScreenWrapper wide>
      <div className="animate-fade-up" style={{ maxWidth: '920px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <span className="section-tag" style={{ marginBottom: '14px', display: 'inline-flex' }}>
            Étape 1 sur 5
          </span>
          <h1 className="screen-title" style={{ textAlign: 'center' }}>
            Quel est votre profil ?
          </h1>
          <p className="screen-subtitle" style={{ textAlign: 'center', margin: '0 auto', maxWidth: '500px' }}>
            Sélectionnez la situation qui vous décrit le mieux. Nous adapterons le questionnaire à votre contexte.
          </p>
        </div>

        {/* Profile Grid */}
        <div className="profile-select-grid">
          {PROFILES_LIST.map((profile, i) => {
            const isSelected = selected === profile.id;
            const googleIcon = PROFILE_GOOGLE_ICONS[profile.id] || 'help';

            return (
              <button
                key={profile.id}
                className={`profile-select-card animate-fade-up delay-${Math.min(i + 1, 6) * 100}${isSelected ? ' selected' : ''}`}
                onClick={() => setSelected(profile.id)}
                style={{
                  '--p-color':  profile.color,
                  '--p-light':  profile.colorLight,
                  '--p-border': profile.colorBorder,
                }}
              >

                {/* Icon — Google Fonts Material Symbols */}
                <div className="profile-card-icon" style={{
                  background: isSelected ? profile.color : profile.colorLight,
                }}>
                  <span
                    className="material-symbols-outlined"
                    style={{
                      color: isSelected ? '#fff' : profile.color,
                      fontSize: '24px',
                      userSelect: 'none'
                    }}
                  >
                    {googleIcon}
                  </span>
                </div>

                {/* Content */}
                <div className="profile-card-body">
                  <div className="profile-card-label">{profile.label}</div>
                  <div className="profile-card-sublabel">{profile.sublabel}</div>
                </div>

                {/* Check */}
                <div className="profile-card-check" style={{
                  borderColor: isSelected ? profile.color : 'var(--slate-300)',
                  background: isSelected ? profile.color : 'transparent',
                }}>
                  {isSelected && <CheckIcon />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="screen-nav" style={{ marginTop: 'var(--space-8)' }}>
          {onBack && (
            <button className="btn btn-outline" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ChevronLeft size={16} /> Retour
            </button>
          )}
          <button
            className="btn btn-primary"
            onClick={handleConfirm}
            disabled={!selected}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', opacity: selected ? 1 : 0.45, cursor: selected ? 'pointer' : 'not-allowed' }}
          >
            Continuer <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--slate-400)', marginTop: 'var(--space-5)', fontWeight: 500 }}>
          Pas sûr ? Sélectionnez le profil le plus proche — vous pourrez préciser ensuite.
        </p>
      </div>
    </ScreenWrapper>
  );
};

/* ============================================================
   S04 — STADE D'ACTIVITÉ
   ============================================================ */
const S04_CHOICES = [
  { id: 'no',    label: 'Non, pas encore' },
  { id: 'occ',   label: 'Oui, mais de manière occasionnelle' },
  { id: 'reg',   label: 'Oui, régulièrement' },
  { id: 'team',  label: 'Oui, avec équipe et clients réguliers' },
  { id: 'drop',  label: 'Mes ventes ont fortement baissé' },
];

/* ============================================================
   S06 — PRÉOCCUPATION PRINCIPALE
   ============================================================ */
const S06_CHOICES = [
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

/* ============================================================
   S07 — SIGNAUX DE RISQUE
   ============================================================ */
const S07_CHOICES = [
  { id: 'charges',   label: 'Difficulté à payer les charges courantes',        severity: 'CRITIQUE' },
  { id: 'dettes',    label: 'Retards dettes, impôts, fournisseurs, salaires',  severity: 'CRITIQUE' },
  { id: 'treso',     label: 'Trésorerie insuffisante pour continuer',           severity: 'CRITIQUE' },
  { id: 'ventes',    label: 'Forte baisse des ventes',                         severity: 'ÉLEVÉ' },
  { id: 'client',    label: 'Perte d\'un client important',                    severity: 'ÉLEVÉ' },
  { id: 'livraison', label: 'Blocage production / incapacité à livrer',         severity: 'ÉLEVÉ' },
  { id: 'conflit',   label: 'Conflits internes / départs critiques',           severity: 'MOYEN' },
  { id: 'none',      label: 'Aucune de ces situations',                        severity: null },
  { id: 'prefer',    label: 'Je préfère ne pas répondre',                      severity: null },
];

/* ============================================================
   S08 — OPPORTUNITÉ
   ============================================================ */
const S08_CHOICES = [
  { id: 'funding',  label: 'Obtenir un financement' },
  { id: 'market',   label: 'Accéder à un nouveau marché' },
  { id: 'tender',   label: 'Répondre à un appel d\'offres / grand compte' },
  { id: 'partner',  label: 'Trouver un partenaire' },
  { id: 'invest',   label: 'Investir ou augmenter ma capacité' },
  { id: 'no',       label: 'Non' },
  { id: 'idk',      label: 'Je ne sais pas encore' },
];

/* ============================================================
   S09 — SUJET DOMINANT
   ============================================================ */
const S09_CHOICES = [
  { id: 'pro', label: 'Mon produit, offre ou prix' },
  { id: 'com', label: 'Mes ventes, clients, communication' },
  { id: 'fin', label: 'Ma trésorerie, charges, rentabilité' },
  { id: 'gov', label: 'Mon organisation, rôles, décisions' },
  { id: 'rh',  label: 'Mon équipe, compétences, motivation' },
  { id: 'ops', label: 'Ma production, délais, capacité à livrer' },
  { id: 'for', label: 'Ma formalisation, documents, obligations' },
  { id: 'dig', label: 'Mon usage du digital' },
  { id: '360', label: 'Je veux tout analyser' },
  { id: 'idk', label: 'Je ne sais pas' },
];

/* ============================================================
   GENERIC CHOICE SCREEN (Triage)
   ============================================================ */
export const TriageScreen = ({ step, question, hint, choices, multi = false, onContinue, onBack, progress, initialAnswer }) => {
  const [selected, setSelected] = useState(() => {
    if (initialAnswer !== null && initialAnswer !== undefined) return initialAnswer;
    return multi ? [] : null;
  });

  const toggle = (id) => {
    if (multi) {
      if (id === 'none' || id === 'prefer') {
        setSelected([id]);
      } else {
        setSelected(prev => {
          const cleaned = prev.filter(x => x !== 'none' && x !== 'prefer');
          return cleaned.includes(id) ? cleaned.filter(x => x !== id) : [...cleaned, id];
        });
      }
    } else {
      setSelected(id);
    }
  };

  const canContinue = multi ? selected.length > 0 : selected !== null;

  return (
    <ScreenWrapper>
      <div className="question-wrap animate-fade-up">
        {progress && (
          <div style={{marginBottom:'var(--space-6)'}}>
            <ProgressBar current={progress.current} total={progress.total} label={`Étape ${progress.current}/${progress.total}`} />
          </div>
        )}

        <h1 className="question-heading">{question}</h1>
        {hint && <p className="question-hint">{hint}</p>}

        <div className="choices-list">
          {choices.map(c => (
            multi ? (
              <CheckboxCard
                key={c.id}
                label={c.label}
                checked={selected.includes(c.id)}
                severity={c.severity}
                onChange={() => toggle(c.id)}
              />
            ) : (
              <ChoiceCard
                key={c.id}
                label={c.label}
                selected={selected === c.id}
                onClick={() => toggle(c.id)}
              />
            )
          ))}
        </div>

        <div className="screen-nav">
          <Button variant="outline" onClick={onBack}>Retour</Button>
          <div className="screen-nav-right">
            <Button variant="primary" disabled={!canContinue} onClick={() => onContinue(selected)}>
              Continuer
            </Button>
          </div>
        </div>

      </div>
    </ScreenWrapper>
  );
};



export const S04Screen = ({ onContinue, onBack, initialAnswer }) => {
  const [selected, setSelected] = useState(() => {
    if (!initialAnswer) return null;
    // Les valeurs occ_oui / occ_non sont des sous-cas de 'occ'
    if (initialAnswer === 'occ_oui' || initialAnswer === 'occ_non') return 'occ';
    return initialAnswer;
  });
  const [subSelected, setSubSelected] = useState(() => {
    if (initialAnswer === 'occ_oui') return 'yes';
    if (initialAnswer === 'occ_non') return 'no';
    return null;
  });

  const handleContinue = () => {
    if (!selected) return;
    if (selected === 'occ') {
      if (subSelected === 'yes') {
        onContinue('occ_oui');
      } else if (subSelected === 'no') {
        onContinue('occ_non');
      }
    } else {
      onContinue(selected);
    }
  };

  const choices = [
    { id: 'no',    label: 'Non, pas encore' },
    { id: 'occ',   label: 'Oui, mais de manière occasionnelle' },
    { id: 'reg',   label: 'Oui, régulièrement' },
    { id: 'team',  label: 'Oui, avec équipe et clients réguliers' },
    { id: 'drop',  label: 'Mes ventes ont fortement baissé' },
  ];

  const needsSub = selected === 'occ';
  const canContinue = selected && (!needsSub || subSelected !== null);

  return (
    <ScreenWrapper>
      <div className="question-wrap animate-fade-up">

        <h1 className="question-heading">Votre activité vend-elle déjà des produits ou services ?</h1>
        <p className="question-hint" style={{marginBottom:'var(--space-6)'}}>Cette question affine votre profil et nous aide à vous orienter vers le diagnostic le plus adapté.</p>

        <div className="choices-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {choices.map(c => (
            <ChoiceCard
              key={c.id}
              label={c.label}
              selected={selected === c.id}
              onClick={() => {
                setSelected(c.id);
                setSubSelected(null);
              }}
            />
          ))}
        </div>

        {needsSub && (
          <div className="sub-question-block animate-fade-up" style={{ marginTop: '20px', padding: '16px', background: 'var(--slate-50)', borderRadius: '12px', border: '1px solid var(--slate-200)' }}>
            <p style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--slate-800)', marginBottom: '12px' }}>
              Avez-vous au moins un client qui a payé ?
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className={`btn ${subSelected === 'yes' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSubSelected('yes')}
                style={{ flex: 1, padding: '10px', fontSize: '0.88rem' }}
              >
                Oui
              </button>
              <button 
                className={`btn ${subSelected === 'no' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSubSelected('no')}
                style={{ flex: 1, padding: '10px', fontSize: '0.88rem' }}
              >
                Non
              </button>
            </div>
          </div>
        )}

        <div className="screen-nav" style={{ marginTop: '28px' }}>
          <Button variant="outline" onClick={onBack}>Retour</Button>
          <Button variant="primary" disabled={!canContinue} onClick={handleContinue}>Continuer</Button>
        </div>
      </div>
    </ScreenWrapper>
  );
};
export const S05Screen = ({ onContinue, onBack, initialAnswer }) => {
  const REGIONS = ['Atlantique', 'Littoral', 'Ouémé', 'Borgou', 'Zou', 'Collines', 'Plateau', 'Mono', 'Couffo', 'Donga', 'Atacora', 'Alibori', 'Autre'];
  const SECTORS = ['Agriculture','Agro-transformation','Commerce','Services','Industrie','Numérique','Artisanat','Transport','Tourisme','Santé','Éducation','BTP','Autre'];
  const [data, setData] = useState(initialAnswer && typeof initialAnswer === 'object' ? initialAnswer : { region:'', commune:'', secteur:'', soussecteur:'' });
  const canContinue = data.region && data.secteur;

  return (
    <ScreenWrapper>
      <div className="question-wrap animate-fade-up">

        <h1 className="question-heading">Département & Secteur d'activité</h1>
        <p className="question-hint">Ces informations nous permettent de contextualiser votre diagnostic.</p>
        <div style={{display:'flex',flexDirection:'column',gap:'var(--space-4)',marginBottom:'var(--space-6)'}}>
          <div className="form-group">
            <label className="form-label">Département <span style={{color:'var(--color-danger)'}}>*</span></label>
            <select className="form-select" value={data.region} onChange={e=>setData({...data,region:e.target.value})}>
              <option value="">Sélectionnez votre département</option>
              {REGIONS.map(r=><option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Commune <span style={{color:'var(--slate-400)',fontWeight:400}}>(recommandé)</span></label>
            <input className="form-input" placeholder="Ex: Cotonou, Porto-Novo, Parakou..." value={data.commune} onChange={e=>setData({...data,commune:e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Secteur d'activité <span style={{color:'var(--color-danger)'}}>*</span></label>
            <select className="form-select" value={data.secteur} onChange={e=>setData({...data,secteur:e.target.value})}>
              <option value="">Sélectionnez un secteur</option>
              {SECTORS.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Sous-secteur <span style={{color:'var(--slate-400)',fontWeight:400}}>(facultatif)</span></label>
            <input className="form-input" placeholder="Ex: Restauration, E-commerce, Logistique..." value={data.soussecteur} onChange={e=>setData({...data,soussecteur:e.target.value})} />
          </div>
        </div>
        <div className="screen-nav">
          <Button variant="outline" onClick={onBack}>Retour</Button>
          <Button variant="primary" disabled={!canContinue} onClick={() => onContinue(data)}>Continuer</Button>
        </div>

      </div>
    </ScreenWrapper>
  );
};
export const S06Screen = (props) => (
  <TriageScreen step="S06" question="Aujourd'hui, votre principale préoccupation est :" choices={S06_CHOICES} {...props} />
);
export const S07Screen = (props) => (
  <TriageScreen step="S07" question="Votre entreprise connaît-elle actuellement l'une de ces situations ?" hint="Plusieurs choix possibles. Soyez honnête — cela nous permet de vous orienter vers le bon diagnostic." choices={S07_CHOICES} multi {...props} />
);
export const S08Screen = (props) => (
  <TriageScreen step="S08" question="Cherchez-vous à saisir une opportunité précise ?" choices={S08_CHOICES} {...props} />
);
export const S09Screen = (props) => (
  <TriageScreen step="S09" question="Quel sujet souhaitez-vous analyser en priorité ?" choices={S09_CHOICES} {...props} />
);

/* ============================================================
   S10/S11/S12/S13 — ROUTE SCREENS
   ============================================================ */
const ROUTE_CONFIGS = {
  S10: {
    chip: 'route-chip-projet', chipLabel: '🚀 Module Projet',
    type: '', cardTitle: 'Votre situation : Projet en préparation',
    body: 'Votre situation correspond à un projet ou une activité en préparation. Le diagnostic Projet est conçu spécifiquement pour vous aider à valider vos hypothèses, clarifier votre offre et identifier vos prochaines étapes.',
    module: 'PRJ-02', duration: '8-12 minutes',
    output: 'Score de faisabilité, forces du projet, risques, actions prioritaires',
    cta: 'Démarrer le Diagnostic Projet',
  },
  S11: {
    chip: 'route-chip-urgent', chipLabel: '⚡ Priorité Urgente',
    type: 'urgent', cardTitle: 'Votre entreprise traverse une difficulté',
    body: 'Votre entreprise semble traverser une difficulté qui mérite d\'être traitée en priorité. Notre outil vous recommande le Diagnostic Difficulté — un module conçu pour identifier rapidement les causes et les actions de stabilisation.',
    module: 'DIF-03', duration: '10-15 minutes',
    output: 'Analyse des causes, plan de stabilisation, ressources disponibles',
    cta: 'Démarrer le Diagnostic Difficulté',
    warning: 'Ce module est prioritaire. Il est fortement recommandé de le compléter avant tout autre diagnostic.',
  },
  S12: {
    chip: 'route-chip-opport', chipLabel: '🎯 Opportunité',
    type: 'opport', cardTitle: 'Vous cherchez à saisir une opportunité',
    body: 'Vous cherchez à saisir une opportunité. Vérifions si votre entreprise est prête pour cette opportunité et sous quelles conditions le succès est envisageable.',
    module: 'OPP-04', duration: '10-15 minutes',
    output: 'Évaluation de maturité, conditions de succès, risques à anticiper',
    cta: 'Démarrer le Diagnostic Opportunité',
    warning: 'Ce diagnostic ne constitue PAS une validation d\'éligibilité à un financement.',
  },
};


export const RouteScreen = ({ routeKey, recommendedModule, onStart, onCatalog, onBack }) => {
  // Les données du module viennent du backend via recommendedModule
  const modName = recommendedModule?.name || '';
  const modDuration = recommendedModule?.duration || '';
  const modDescription = recommendedModule?.description || '';

  // Config d'affichage selon le type de route (chip, texte contextuel)
  const routeDisplay = {
    S10: {
      chip: 'route-chip-projet', chipLabel: '🚀 Module Projet',
      cardTitle: `Votre orientation recommandée : ${modName}`,
      body: modDescription || `Votre situation correspond à un projet ou une activité en préparation. Le module "${modName}" est conçu pour vous aider à valider vos hypothèses et identifier vos prochaines étapes.`,
      cta: `Démarrer ${modName}`,
      warning: null,
    },
    S11: {
      chip: 'route-chip-urgent', chipLabel: '⚡ Priorité Urgente',
      cardTitle: `Votre entreprise traverse une difficulté`,
      body: modDescription || `Votre entreprise semble traverser une difficulté. Notre outil vous recommande le module "${modName}" — conçu pour identifier rapidement les causes et les actions de stabilisation.`,
      cta: `Démarrer ${modName}`,
      warning: 'Ce module est prioritaire. Il est fortement recommandé de le compléter avant tout autre diagnostic.',
    },
    S12: {
      chip: 'route-chip-opport', chipLabel: '🎯 Opportunité',
      cardTitle: `Vous cherchez à saisir une opportunité`,
      body: modDescription || `Vous cherchez à saisir une opportunité. Le module "${modName}" vérifie si votre entreprise est prête et sous quelles conditions le succès est envisageable.`,
      cta: `Démarrer ${modName}`,
      warning: 'Ce diagnostic ne constitue PAS une validation d\'éligibilité à un financement.',
    },
  };

  const cfg = routeDisplay[routeKey] || {
    chip: 'route-chip-recommend', chipLabel: '✅ Recommandé',
    cardTitle: `Votre orientation recommandée : ${modName}`,
    body: modDescription || `Notre outil vous recommande le module "${modName}" sur la base de votre profil et de vos réponses au triage.`,
    cta: `Démarrer ${modName}`,
    warning: null,
  };

  return (
    <ScreenWrapper>
      <div className="route-wrap animate-fade-up">
        <div className={`route-chip ${cfg.chip}`}>{cfg.chipLabel}</div>
        <div className={`route-card`} style={{ padding: '24px', border: '1px solid var(--slate-200)', borderRadius: '16px', background: 'var(--bg-white)', marginTop: '14px' }}>
          <h1 className="route-title" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '12px' }}>
            {cfg.cardTitle}
          </h1>
          <p className="route-body" style={{ color: 'var(--slate-600)', fontSize: '0.92rem', lineHeight: '1.55', marginBottom: '20px' }}>
            {cfg.body}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            {modDuration && (
              <div className="route-detail-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                <Clock size={15} className="text-blue" />
                <span>Durée estimée : <strong>{modDuration}</strong></span>
              </div>
            )}
            {recommendedModule?.question_count && (
              <div className="route-detail-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                <FileText size={15} className="text-blue" />
                <span>Nombre de questions : <strong>{recommendedModule.question_count} questions</strong></span>
              </div>
            )}
            <div className="route-detail-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
              <BarChart2 size={15} className="text-blue" />
              <span>Vous recevrez : <strong>Score, forces, fragilités, priorités d'action, orientation</strong></span>
            </div>
            <div className="route-detail-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
              <FileText size={15} className="text-blue" />
              <span>Vous pouvez répondre avec des <strong>estimations</strong>. Option "Je ne sais pas" disponible.</span>
            </div>
          </div>

          {cfg.warning && (
            <div className="alert alert-warning" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-warning)', background: 'var(--color-warning-bg)', padding: '10px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.82rem', fontWeight: 600 }}>
              <AlertTriangle size={15} />
              <span>{cfg.warning}</span>
            </div>
          )}

          <div className="route-actions">
            <Button variant="primary" size="lg" onClick={onStart} style={{ width: '100%', justifyContent: 'center' }}>
              {cfg.cta}
            </Button>
            <div className="route-actions-secondary">
              <Button variant="outline" onClick={onCatalog} style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem' }}>
                Voir les autres diagnostics
              </Button>
              <Button variant="outline" onClick={onBack} style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem' }}>
                Modifier mes réponses
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ScreenWrapper>
  );
};

const MODULE_ICONS_MAP = {
  Rocket: Rocket,
  Zap: Zap,
  AlertTriangle: AlertTriangle,
  Target: Target,
  Lightbulb: Lightbulb,
  Users: Users,
  TrendingUp: TrendingUp,
  Building2: Building2,
  Award: Award,
};

// Couleurs et icônes par code module (UI uniquement, pas de données métier)
const MODULE_STYLE_MAP = {
  'PRJ-02': { iconName:'Rocket',        bg:'#EFF6FF', iconColor:'#2659F2' },
  'FLH-01': { iconName:'Zap',           bg:'#ECFDF5', iconColor:'#059669' },
  'DIF-03': { iconName:'AlertTriangle', bg:'#FEF2F2', iconColor:'#ef4444' },
  'OPP-04': { iconName:'Target',        bg:'#FFFBEB', iconColor:'#f59e0b' },
  'PRO-05': { iconName:'Lightbulb',     bg:'#F0FDF4', iconColor:'#10b981' },
  'COM-06': { iconName:'Users',         bg:'#FFF7ED', iconColor:'#f97316' },
  'FIN-07': { iconName:'TrendingUp',    bg:'#EFF6FF', iconColor:'#2563eb' },
  'GOV-08': { iconName:'Building2',     bg:'#FAF5FF', iconColor:'#8b5cf6' },
  '360-09': { iconName:'Award',         bg:'#F0FDF4', iconColor:'#16a34a' },
};

export const CatalogScreen = ({ onSelect, onBack, warningSignals }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('../../api/config.js').then(({ apiFetch }) => {
      apiFetch('/modules')
        .then(res => {
          const list = res?.data?.modules || res?.modules || [];
          if (list.length > 0) {
            setModules(list.filter(m => m.is_available !== false && m.code !== 'TRI-00').map(m => ({
              id: m.code,
              name: m.name,
              duration: m.target_duration_formatted || m.target_duration || '',
              question_count: m.question_count || null,
              description: m.description || null,
              ...MODULE_STYLE_MAP[m.code]
            })));
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    });
  }, []);

  return (
    <ScreenWrapper>
      <div className="catalog-wrap animate-fade-up">
        <h1 className="screen-title">Les diagnostics disponibles</h1>
        <p className="screen-subtitle" style={{marginBottom:'var(--space-8)'}}>
          Choisissez le module qui correspond le mieux à votre situation actuelle.
        </p>

        {warningSignals && warningSignals.length > 0 && (
          <div className="alert alert-warning" style={{marginBottom:'var(--space-6)', display:'flex', alignItems:'center', gap:'8px'}}>
            <AlertTriangle size={18} className="text-warning" />
            <span>Vos réponses précédentes signalent des points de vigilance. Si vous avez des difficultés urgentes, le <strong>Diagnostic Difficulté</strong> est recommandé en priorité.</span>
          </div>
        )}

        {loading ? (
          <div style={{textAlign:'center', padding:'40px 0', color:'var(--slate-400)', fontSize:'0.9rem'}}>Chargement des modules…</div>
        ) : (
          <div className="catalog-modules-grid">
            {modules.map((m, i) => (
              <button
                key={m.id}
                className={`catalog-module-card animate-fade-up delay-${Math.min(i,5)+1}00`}
                onClick={() => onSelect(m)}
                style={{ borderLeft: `4px solid ${m.iconColor || 'var(--slate-300)'}` }}
              >
                <div className="catalog-module-info">
                  <div className="catalog-module-name">{m.name}</div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                    {m.duration && <div className="catalog-module-dur">{m.duration}</div>}
                    {m.question_count && (
                      <div className="catalog-module-dur" style={{ color: 'var(--slate-400)', fontWeight: 500 }}>
                        {m.question_count} questions
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="screen-nav" style={{justifyContent:'flex-start', marginTop:'var(--space-6)'}}>
          <Button variant="outline" onClick={onBack}>← Retour</Button>
        </div>
      </div>
    </ScreenWrapper>
  );
};

/* ============================================================
   S21 — VÉRIFICATION AVANT MODULE
   ============================================================ */
export const VerifModuleScreen = ({ chosenModule, warningMessage, onConfirm, onAcceptReco, recoModule }) => (
  <ScreenWrapper>
    <div className="route-wrap animate-fade-up">
      <div className="alert alert-warning" style={{marginBottom:'var(--space-6)', display:'flex', alignItems:'center', gap:'8px'}}>
        <AlertTriangle size={18} className="text-warning" />
        <div>
          <strong>Point d'attention</strong>
          <p style={{marginTop:'var(--space-1)', fontSize: '0.88rem'}}>{warningMessage}</p>
        </div>
      </div>
      <h2 style={{fontSize:'1.25rem',fontWeight:700,marginBottom:'var(--space-3)'}}>Vous avez choisi : {chosenModule?.name}</h2>
      <p style={{color:'var(--slate-500)',marginBottom:'var(--space-6)'}}>Comment souhaitez-vous procéder ?</p>
      <div style={{display:'flex',flexDirection:'column',gap:'var(--space-3)'}}>
        <Button variant="primary" onClick={onConfirm}>Confirmer mon choix et continuer</Button>
        {recoModule && <Button variant="outline" onClick={onAcceptReco}>Suivre la recommandation → {recoModule.name}</Button>}
      </div>
    </div>
  </ScreenWrapper>
);

// MODULE_INTROS : garde uniquement les données visuelles (icône, couleur)
// Les données textuelles (nom, durée) viennent du backend via la prop `moduleData`
const MODULE_INTRO_STYLES = {
  'PRJ-02': { iconName:'Rocket',        bg:'#EFF6FF', iconColor:'#2659F2' },
  'FLH-01': { iconName:'Zap',           bg:'#ECFDF5', iconColor:'#059669' },
  'DIF-03': { iconName:'AlertTriangle', bg:'#FEF2F2', iconColor:'#ef4444' },
  'OPP-04': { iconName:'Target',        bg:'#FFFBEB', iconColor:'#f59e0b' },
  'PRO-05': { iconName:'Lightbulb',     bg:'#F0FDF4', iconColor:'#10b981' },
  'COM-06': { iconName:'Users',         bg:'#FFF7ED', iconColor:'#f97316' },
  'FIN-07': { iconName:'TrendingUp',    bg:'#EFF6FF', iconColor:'#2563eb' },
  'GOV-08': { iconName:'Building2',     bg:'#FAF5FF', iconColor:'#8b5cf6' },
  '360-09': { iconName:'Award',         bg:'#F0FDF4', iconColor:'#16a34a' },
};

// moduleData = { id, name, duration, description } depuis le backend (via currentModule dans DiagnosticApp)
export const IntroModuleScreen = ({ moduleId, moduleData, onStart, onCatalog }) => {
  const [backendModule, setBackendModule] = useState(null);
  const style = MODULE_INTRO_STYLES[moduleId] || MODULE_INTRO_STYLES['FLH-01'];
  const IconComp = MODULE_ICONS_MAP[style.iconName] || HelpCircle;

  // Charger les détails du module depuis le backend si pas encore reçus via prop
  useEffect(() => {
    if (moduleData?.name && moduleData?.question_count) {
      setBackendModule(moduleData);
      return;
    }
    if (!moduleId) return;
    import('../../api/config.js').then(({ apiFetch }) => {
      apiFetch(`/modules/${moduleId}`)
        .then(res => {
          const d = res?.data || res;
          if (d?.code) {
            setBackendModule({
              id: d.code,
              name: d.name,
              duration: d.target_duration_formatted || d.target_duration || '',
              description: d.description || '',
              question_count: d.question_count || null
            });
          }
        })
        .catch(() => {});
    });
  }, [moduleId, moduleData]);

  const title    = backendModule?.name     || moduleData?.name     || moduleId || '';
  const duration = backendModule?.duration || moduleData?.duration || '';
  const qCount   = backendModule?.question_count || moduleData?.question_count || null;

  return (
    <ScreenWrapper>
      <div className="intro-wrap animate-fade-up">
        <div className="screen-icon-header" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="screen-icon" style={{ background: style.bg, color: style.iconColor, width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconComp size={32} />
          </div>
        </div>
        <h1 className="screen-title" style={{ textAlign: 'center' }}>{title}</h1>

        <div className="intro-meta-row" style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {duration && (
            <span className="intro-meta-chip" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} style={{ color: 'var(--slate-500)' }} />
              {duration}
            </span>
          )}
          {qCount && (
            <span className="intro-meta-chip" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={14} style={{ color: 'var(--slate-500)' }} />
              {qCount} questions
            </span>
          )}
          <span className="intro-meta-chip" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BarChart2 size={14} style={{ color: 'var(--slate-500)' }} />
            Score + Forces + Fragilités + Priorités
          </span>
        </div>

        <div className="alert alert-info" style={{margin:'var(--space-6) 0', display:'flex', alignItems:'center', gap:'8px'}}>
          <Lightbulb size={18} className="text-blue" />
          <span>Répondez le plus simplement possible. Si vous ne connaissez pas une information, choisissez "Je ne sais pas".</span>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:'var(--space-3)'}}>
          <Button variant="primary" size="lg" full onClick={onStart}>Commencer le diagnostic →</Button>
          <Button variant="outline" onClick={onCatalog}>Voir les autres diagnostics</Button>
        </div>
      </div>
    </ScreenWrapper>
  );
};

/* ============================================================
   QUIT CONFIRM MODAL — Modale stylisée de confirmation quitter
   ============================================================ */
const QuitConfirmModal = ({ onConfirm, onCancel }) => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 9999,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px',
    background: 'rgba(7, 14, 36, 0.55)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    animation: 'fadeIn 0.18s ease',
  }}>
    <div style={{
      background: '#ffffff',
      borderRadius: '20px',
      padding: '36px 32px 28px',
      maxWidth: '400px',
      width: '100%',
      boxShadow: '0 24px 60px rgba(7,14,36,0.18)',
      textAlign: 'center',
      animation: 'scaleIn 0.2s cubic-bezier(0.16,1,0.3,1)',
    }}>
      {/* Icône d'avertissement */}
      <div style={{
        width: '56px', height: '56px',
        background: 'rgba(220, 38, 38, 0.08)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
      }}>
        <AlertTriangle size={26} strokeWidth={2} style={{ color: '#dc2626' }} />
      </div>

      <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '10px' }}>
        Quitter le diagnostic ?
      </h2>
      <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)', lineHeight: 1.6, marginBottom: '28px' }}>
        Votre progression sera <strong style={{ color: 'var(--slate-700)' }}>perdue</strong>.
        Vous serez redirigé vers l’accueil.
      </p>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1, padding: '12px 16px',
            borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem',
            border: '1.5px solid var(--slate-200)', background: '#fff',
            color: 'var(--slate-700)', cursor: 'pointer',
            fontFamily: 'var(--font)', transition: 'all 0.15s',
          }}
        >
          Continuer
        </button>
        <button
          onClick={onConfirm}
          style={{
            flex: 1, padding: '12px 16px',
            borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem',
            border: 'none', background: '#dc2626',
            color: '#fff', cursor: 'pointer',
            fontFamily: 'var(--font)', transition: 'all 0.15s',
            boxShadow: '0 4px 14px rgba(220,38,38,0.28)',
          }}
        >
          Quitter
        </button>
      </div>
    </div>
  </div>
);

/* ============================================================
   S31/S32/S33 — QUESTION LOOP
   ============================================================ */
export const QuestionScreen = ({ moduleId, questionData, current, total, savedAnswer, onContinue, onBack, onQuit }) => {
  const isMulti = questionData.type === 'multi';
  const isScale = questionData.type === 'scale_1_5';
  const isText  = questionData.type === 'short_text';

  // Initialise les états avec la réponse sauvegardée si l'utilisateur revient en arrière
  const [answer, setAnswer] = useState(
    (!isMulti && !isText && savedAnswer !== null) ? savedAnswer : null
  );
  const [multiAnswer, setMultiAnswer] = useState(
    isMulti && Array.isArray(savedAnswer) ? savedAnswer : []
  );
  const [textVal, setTextVal] = useState(
    isText && typeof savedAnswer === 'string' ? savedAnswer : ''
  );
  const [showProof, setShowProof] = useState(false);
  const [proof, setProof] = useState(null);
  const [showQuitModal, setShowQuitModal] = useState(false);

  const PROOF_CHOICES = [
    { id:'E0', label:'C\'est une estimation ou mon ressenti' },
    { id:'E1', label:'J\'ai un indice concret : commandes, clients, reçus...' },
    { id:'E2', label:'J\'ai un document : facture, cahier, Excel, relevé...' },
    { id:'E3', label:'J\'ai une donnée vérifiable et récente' },
  ];

  const toggleMulti = (id) => {
    if (id === 'idk') { setMultiAnswer(['idk']); return; }
    setMultiAnswer(prev => {
      const c = prev.filter(x => x !== 'idk');
      return c.includes(id) ? c.filter(x => x !== id) : [...c, id];
    });
  };

  const canContinue = isMulti ? multiAnswer.length > 0 : isText ? textVal.trim().length > 0 : answer !== null;

  const handleContinue = () => {
    const ans = isMulti ? multiAnswer : isText ? textVal : answer;
    if (questionData.requireProof && !showProof) {
      setShowProof(true);
    } else {
      onContinue(ans, proof);
    }
  };

  const SCALE_LABELS = ['1 — Pas du tout', '2 — Peu', '3 — Modérément', '4 — Bien', '5 — Très bien'];

  return (
    <ScreenWrapper>
      {/* Modale de confirmation quitter */}
      {showQuitModal && (
        <QuitConfirmModal
          onConfirm={() => { setShowQuitModal(false); onQuit(); }}
          onCancel={() => setShowQuitModal(false)}
        />
      )}

      <div className="question-wrap animate-fade-up">
        <div style={{marginBottom:'var(--space-6)'}}>
          <ProgressBar current={current} total={total} />
        </div>

        {!showProof ? (
          <>
            <p style={{fontWeight:700, color:'var(--slate-400)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'var(--space-4)'}}>
              {moduleId} · Question {current}/{total}
            </p>
            <h1 className="question-text">{questionData.question}</h1>
            {questionData.hint && <p className="question-desc" style={{marginBottom:'var(--space-6)'}}>{questionData.hint}</p>}

            {/* Relance */}
            {questionData.relance && (
              <div className="alert alert-info" style={{marginBottom:'var(--space-8)', display: 'flex', alignItems: 'center', gap: '8px'}}>
                <MessageSquare size={18} className="text-blue" style={{ flexShrink: 0 }} />
                <span>{questionData.relance}</span>
              </div>
            )}

            {isText ? (
              <textarea
                className="form-input"
                rows={4}
                placeholder={questionData.placeholder || 'Votre réponse...'}
                value={textVal}
                onChange={e => setTextVal(e.target.value)}
                style={{resize:'vertical'}}
              />
            ) : isScale ? (
              <div className="choices-list">
                {SCALE_LABELS.map((l, i) => (
                  <ChoiceCard key={i+1} label={l} selected={answer === i+1} onClick={() => setAnswer(i+1)} />
                ))}
                <ChoiceCard label="Je ne sais pas" selected={answer === 'idk'} onClick={() => setAnswer('idk')} />
              </div>
            ) : isMulti ? (
              <div className="choices-list">
                {questionData.choices.map(c => (
                  <CheckboxCard key={c.id} label={c.label} checked={multiAnswer.includes(c.id)} onChange={() => toggleMulti(c.id)} />
                ))}
              </div>
            ) : (
              <div className="choices-list">
                {questionData.choices.map(c => (
                  <ChoiceCard key={c.id} label={c.label} selected={answer === c.id} onClick={() => setAnswer(c.id)} />
                ))}
                {!questionData.noUnknown && (
                  <ChoiceCard label="Je ne sais pas" selected={answer === 'idk'} onClick={() => setAnswer('idk')} />
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <p className="question-meta-label" style={{marginBottom:'var(--space-3)'}}>Niveau de preuve</p>
            <h1 className="question-heading">Sur quoi vous basez-vous pour cette réponse ?</h1>
            <p className="proof-intro" style={{ marginBottom: '20px', color: 'var(--slate-500)', fontSize: '0.85rem' }}>Cette information nous permet d’ajuster la confiance accordée à votre résultat.</p>
            <div className="choices-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {PROOF_CHOICES.map(c => (
                <ChoiceCard key={c.id} label={c.label} selected={proof === c.id} onClick={() => setProof(c.id)} />
              ))}
            </div>
          </>
        )}

        <div className="screen-nav">
          <Button variant="outline" onClick={showProof ? () => setShowProof(false) : onBack}>
            Retour
          </Button>
          <div className="screen-nav-right" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              style={{fontSize:'0.8rem',color:'var(--slate-400)',background:'none',border:'none',cursor:'pointer',fontFamily:'var(--font)', fontWeight: 600}}
              onClick={() => setShowQuitModal(true)}
            >
              Quitter
            </button>
            <Button variant="primary" disabled={showProof ? !proof : !canContinue} onClick={handleContinue}>
              {showProof ? 'Valider la preuve' : 'Continuer'}
            </Button>
          </div>
        </div>
      </div>
    </ScreenWrapper>
  );
};

/* ============================================================
   S40 — CALCUL INTERMÉDIE
   ============================================================ */
const CALC_MESSAGES = [
  'Analyse de vos réponses en cours…',
  'Identification de vos forces…',
  'Calcul du score de maturité…',
  'Détection des points de vigilance…',
  'Génération des priorités d\'action…',
  'Finalisation de votre rapport…',
];

import { RefreshCw } from 'lucide-react';

export const CalculScreen = ({ onDone }) => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % CALC_MESSAGES.length);
    }, 550);
    const t = setTimeout(onDone, 3000);
    return () => { clearTimeout(t); clearInterval(interval); };
  }, [onDone]);

  return (
    <ScreenWrapper>
      <div className="calc-wrap animate-fade-in" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div className="calc-animation" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-blue-light)', color: 'var(--color-blue)', marginBottom: '24px' }}>
          <RefreshCw size={36} className="animate-spin" style={{ animation: 'spinSlow 2s linear infinite' }} />
        </div>
        <h2 className="calc-title" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '12px' }}>Analyse en cours…</h2>
        <p className="calc-subtitle" style={{ color: 'var(--slate-500)', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 24px', lineHeight: '1.6' }}>
          Nous analysons vos réponses. Business Check-up prépare une première lecture de vos forces, points de vigilance et priorités d'action.
        </p>
        <div className="calc-messages" style={{ minHeight: '24px', fontWeight: 600, color: 'var(--color-blue)', fontSize: '0.9rem' }}>
          {CALC_MESSAGES[msgIndex]}
        </div>
      </div>
    </ScreenWrapper>
  );
};

/* ============================================================
   S41 — RÉSULTAT SYNTHÈSE
   ============================================================ */
const getLevel = (s) => {
  if (s < 20) return { label:'Critique', color:'var(--score-critique)' };
  if (s < 40) return { label:'Fragile',  color:'var(--score-fragile)'  };
  if (s < 60) return { label:'Stable',   color:'var(--score-stable)'   };
  if (s < 80) return { label:'Solide',   color:'var(--score-solide)'   };
  return              { label:'Avancé',  color:'var(--score-avance)'   };
};
const getConfidence = (a) => {
  const values = Object.values(a || {});
  const e3Count = values.filter(v => v === 'E3').length;
  const e2e3Count = values.filter(v => v === 'E2' || v === 'E3').length;
  const e1e2e3Count = values.filter(v => v === 'E1' || v === 'E2' || v === 'E3').length;

  if (e3Count >= 2) return 'Vérifiable';
  if (e2e3Count >= 3) return 'Documenté';
  if (e1e2e3Count >= 1) return 'Partiel';
  return 'Déclaratif';
};

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const ResultatSyntheseScreen = ({ score, answers, moduleId, onDetail, onContact, onRestart }) => {
  const lvl = getLevel(score);
  const conf = getConfidence(answers);

  // Fake data for radar chart based on score
  const radarData = [
    { subject: 'Finance', A: score > 50 ? score : score + 20, fullMark: 100 },
    { subject: 'Marketing', A: score > 30 ? score - 10 : 40, fullMark: 100 },
    { subject: 'Orga', A: score > 60 ? score : 50, fullMark: 100 },
    { subject: 'Tech', A: score > 40 ? score + 10 : 30, fullMark: 100 },
    { subject: 'Legal', A: score > 20 ? score + 5 : 45, fullMark: 100 },
  ];

  return (
    <ScreenWrapper wide>
      <div className="animate-fade-up">
        {/* Dashboard Header */}
        <div className="results-header">
          <div className="results-header-info">
            <span className="badge badge-teal" style={{marginBottom:'var(--space-4)'}}>Rapport Généré</span>
            <h1>Tableau de bord : {moduleId}</h1>
            <p>Voici la synthèse de votre maturité basée sur {Object.keys(answers).length} points de contrôle.</p>
          </div>
          <div style={{background:'rgba(255,255,255,0.1)', padding:'var(--space-5)', borderRadius:'var(--radius-xl)', textAlign:'center'}}>
            <div style={{fontSize:'3.5rem', fontWeight:800, lineHeight:1}}>{score}</div>
            <div style={{fontSize:'0.85rem', textTransform:'uppercase', letterSpacing:'0.05em', marginTop:'var(--space-1)'}}>Score Global</div>
          </div>
        </div>

        {/* Grid 2 columns */}
        <div className="dashboard-grid">
          {/* Main KPI Card */}
          <div className="dash-card">
            <div className="dash-card-header">
              <ShieldCheck size={20} color="var(--brand-blue)" />
              <div className="dash-card-title">Diagnostic de Maturité</div>
            </div>
            <div className="results-kpi-row">
              <ScoreGauge score={score} size={140} />
              <div>
                <div style={{fontSize:'1.1rem', fontWeight:700, color:'var(--slate-900)', marginBottom:'var(--space-1)'}}>
                  Niveau : <span style={{color:lvl.color}}>{lvl.label}</span>
                </div>
                <div style={{fontSize:'0.9rem', color:'var(--slate-500)'}}>
                  Fiabilité de l'évaluation : <strong>{conf}</strong>
                </div>
              </div>
            </div>
            <p style={{fontSize:'0.95rem', color:'var(--slate-600)', lineHeight:1.6}}>
              {score < 40
                ? 'Situation nécessitant une attention immédiate sur les fondamentaux.'
                : score < 70
                ? 'Base saine mais des optimisations sont nécessaires pour passer un cap.'
                : 'Structure solide, prête pour la croissance ou la mise à l\'échelle.'}
            </p>
          </div>

          {/* Chart Card */}
          <div className="dash-card">
            <div className="dash-card-header">
              <Activity size={20} color="var(--brand-teal)" />
              <div className="dash-card-title">Analyse Multidimensionnelle</div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="var(--slate-200)" />
                  <PolarAngleAxis dataKey="subject" tick={{fill:'var(--slate-600)', fontSize:12, fontWeight:600}} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Score" dataKey="A" stroke="var(--brand-blue)" fill="var(--brand-blue)" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="results-actions">
          <Button variant="outline" onClick={onContact}><Download size={18}/> Exporter PDF</Button>
          <Button variant="teal" onClick={onContact}><Calendar size={18}/> Demander un suivi</Button>
          <Button variant="primary" onClick={onDetail}>Plan d'Action Détaillé <ArrowRight size={18}/></Button>
        </div>
      </div>
    </ScreenWrapper>
  );
};

/* ============================================================
   S42 — FORCES & FRAGILITÉS
   ============================================================ */
export const ForceFragilitesScreen = ({ score, moduleId, answers, onContinue, onBack, restitution }) => {
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

  return (
    <ScreenWrapper>
      <div className="result-wrap animate-fade-up">
        <h1 className="screen-title">Vos forces & fragilités</h1>

        <div className="ff-grid">
          <div className="ff-card" style={{ padding: '20px', border: '1px solid var(--slate-200)', borderRadius: '16px', background: 'var(--bg-white)' }}>
            <div className="ff-card-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: 'var(--color-primary)', fontSize: '1rem', marginBottom: '14px' }}>
              <CheckCircle size={18} className="text-success" style={{ color: 'var(--color-success)' }} />
              Vos points d'appui
            </div>
            <ul className="ff-items" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {forces.map((f, i) => (
                <li key={i} className="ff-item" style={{ fontSize: '0.88rem', color: 'var(--slate-600)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span className="ff-item-dot green" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)', marginTop: '6px', flexShrink: 0 }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="ff-card" style={{ padding: '20px', border: '1px solid var(--slate-200)', borderRadius: '16px', background: 'var(--bg-white)' }}>
            <div className="ff-card-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: 'var(--color-primary)', fontSize: '1rem', marginBottom: '14px' }}>
              <AlertTriangle size={18} className="text-warning" style={{ color: 'var(--color-warning)' }} />
              Points de vigilance
            </div>
            <ul className="ff-items" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {fragilites.map((f, i) => (
                <li key={i} className="ff-item" style={{ fontSize: '0.88rem', color: 'var(--slate-600)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span className="ff-item-dot orange" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-warning)', marginTop: '6px', flexShrink: 0 }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="ff-priority" style={{ padding: '16px', background: 'var(--slate-50)', borderRadius: '12px', border: '1px solid var(--slate-200)', marginBottom: '24px' }}>
          <div className="ff-priority-label" style={{ fontWeight: 800, color: 'var(--slate-800)', fontSize: '0.88rem', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Point prioritaire</div>
          <p className="ff-priority-text" style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: '1.5' }}>
            {priorityText}
          </p>
        </div>

        <div className="screen-nav" style={{justifyContent:'flex-end'}}>
          <Button variant="primary" onClick={onContinue}>Continuer</Button>
        </div>
      </div>
    </ScreenWrapper>
  );
};

/* ============================================================
   S43 — PRIORITÉS D'ACTION
   ============================================================ */
export const PrioritesActionScreen = ({ score, onContinue, onBack, restitution }) => {
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

  return (
    <ScreenWrapper>
      <div className="animate-fade-up">
        <div className="screen-header" style={{ marginBottom: '24px' }}>
          <h1 className="screen-title">Vos priorités d'action</h1>
          <p className="screen-desc">Ces actions sont personnalisées en fonction de votre score et de vos réponses.</p>
        </div>

        <div className="priority-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {priorities.map((p, i) => (
            <div key={i} className={`priority-item ${i === 0 && score < 40 ? 'danger' : i === 0 && score < 70 ? 'warning' : ''}`} style={{ display: 'flex', gap: '16px', padding: '18px', border: '1px solid var(--slate-200)', borderRadius: '16px', background: 'var(--bg-white)' }}>
              <div className="priority-icon" style={{ color: 'var(--color-blue)', background: 'var(--color-blue-light)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Target size={22} />
              </div>
              <div className="priority-content">
                <h4 style={{ fontSize: '0.95rem', fontWeight: 850, color: 'var(--slate-800)', marginBottom: '4px' }}>Priorité {i+1} : {p.label}</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', lineHeight: '1.5' }}>{p.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="screen-nav" style={{justifyContent:'space-between', marginTop: '32px'}}>
          <Button variant="outline" onClick={onBack}>Retour</Button>
          <Button variant="primary" onClick={onContinue}>Continuer</Button>
        </div>
      </div>
    </ScreenWrapper>
  );
};

/* ============================================================
   S44 — ORIENTATION SUIVANTE
   ============================================================ */
export const OrientationSuivanteScreen = ({ score, onDownload, onRestart, onContact, onCatalog, restitution }) => {
  const isCritical = score < 40;
  const isMedium = score >= 40 && score < 70;
  const isHigh = score >= 70;

  // Recommandation de module issue du backend
  const nextModuleCode = restitution?.next_module;
  const moduleLabels = {
    'PRJ-02': 'Diagnostic Projet',
    'FLH-01': 'Diagnostic Flash',
    'DIF-03': 'Diagnostic Difficulté',
    'OPP-04': 'Diagnostic Opportunité',
    'PRO-05': 'Diagnostic Offre/Produits',
    'COM-06': 'Diagnostic Commercial',
    'FIN-07': 'Diagnostic Finance',
    'GOV-08': 'Diagnostic Organisation',
    '360-09': 'Diagnostic Complet 360°',
  };
  const nextModuleName = nextModuleCode ? moduleLabels[nextModuleCode] : null;

  return (
    <ScreenWrapper>
      <div className="result-wrap animate-fade-up">
        <h1 className="screen-title" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '10px' }}>Quelle est la suite ?</h1>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.92rem', marginBottom: '24px', lineHeight: '1.5' }}>
          En fonction de votre score, notre outil vous propose plusieurs chemins possibles.
        </p>

        {isCritical && (
          <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-danger)', background: 'var(--color-danger-bg)', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.88rem', fontWeight: 600 }}>
            <AlertOctagon size={20} />
            <div>
              <strong>Situation qui nécessite une attention immédiate</strong>
              <p style={{ fontWeight: 400, marginTop: '2px', color: 'var(--slate-600)' }}>Nous vous recommandons de demander un accompagnement prioritaire pour vous aider à stabiliser votre activité.</p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {/* Si le backend conseille un module précis */}
          {nextModuleName ? (
            <Button variant="primary" size="lg" onClick={() => onCatalog()} style={{ width: '100%', justifyContent: 'center', gap: '8px' }}>
              <Compass size={18} /> Commencer le module : {nextModuleName}
            </Button>
          ) : (
            <>
              {/* Actions personnalisées par score */}
              {isCritical && (
                <Button variant="primary" size="lg" onClick={onContact} style={{ width: '100%', justifyContent: 'center', gap: '8px' }}>
                  <Users size={18} /> Demander un suivi prioritaire
                </Button>
              )}

              {isMedium && (
                <Button variant="primary" size="lg" onClick={onCatalog} style={{ width: '100%', justifyContent: 'center', gap: '8px' }}>
                  <Compass size={18} /> Structurer les pratiques (Voir les diagnostics)
                </Button>
              )}

              {isHigh && (
                <Button variant="primary" size="lg" onClick={onCatalog} style={{ width: '100%', justifyContent: 'center', gap: '8px' }}>
                  <Target size={18} /> Évaluer une opportunité (Module Opportunité)
                </Button>
              )}
            </>
          )}

          {/* Autres options complémentaires */}
          {isCritical && nextModuleName && (
            <Button variant="outline" onClick={onContact} style={{ width: '100%', justifyContent: 'center', gap: '8px' }}>
              <Users size={18} /> Demander un suivi prioritaire
            </Button>
          )}
          {isMedium && (
            <Button variant="outline" onClick={onContact} style={{ width: '100%', justifyContent: 'center', gap: '8px' }}>
              <Calendar size={18} /> Planifier un suivi conseil
            </Button>
          )}
          {isHigh && (
            <Button variant="outline" onClick={onContact} style={{ width: '100%', justifyContent: 'center', gap: '8px' }}>
              <TrendingUp size={18} /> Préparer une étape de croissance
            </Button>
          )}

          {/* Actions communes */}
          <div style={{ height: '1px', background: 'var(--slate-200)', margin: '12px 0' }} />
          
          <Button variant="teal" onClick={onDownload} style={{ width: '100%', justifyContent: 'center', gap: '8px', color: '#fff' }}>
            <FileText size={18} /> Télécharger mon résumé PDF
          </Button>
          <Button variant="outline" onClick={onRestart} style={{ width: '100%', justifyContent: 'center', gap: '8px' }}>
            <Compass size={18} /> Recommencer un autre diagnostic
          </Button>
        </div>

        <div style={{ padding: '16px', background: 'var(--slate-50)', borderRadius: '12px', border: '1px solid var(--slate-200)' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--slate-700)' }}>Rappel :</strong> Ce diagnostic est indicatif et ne remplace pas l'analyse d'un expert. 
            Les recommandations proposées sont basées uniquement sur vos réponses déclaratives.
          </p>
        </div>
      </div>
    </ScreenWrapper>
  );
};

/* ============================================================
   S50 — CONTACT / PDF / SUIVI
   ============================================================ */
export const ContactSuiviScreen = ({ onSubmit, onSkip }) => {
  const [form, setForm] = useState({ nom: '', email: '', tel: '', accept: false });
  const [errorMsg, setErrorMsg] = useState('');

  const handleAction = (actionType) => {
    setErrorMsg('');
    if (actionType === 'pdf') {
      if (!form.nom || !form.email) {
        setErrorMsg('Le nom et l\'adresse e-mail sont obligatoires pour recevoir le résumé PDF.');
        return;
      }
      onSubmit({ ...form, action: 'pdf' });
    } else if (actionType === 'suivi') {
      if (!form.nom || !form.tel) {
        setErrorMsg('Le nom et le numéro de téléphone / WhatsApp sont obligatoires pour être recontacté.');
        return;
      }
      onSubmit({ ...form, action: 'suivi' });
    }
  };

  return (
    <ScreenWrapper>
      <div className="animate-fade-up" style={{ maxWidth: '540px', margin: '0 auto', padding: '20px 20px' }}>
        <div style={{ marginBottom: '28px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'var(--color-blue-light)', color: 'var(--color-blue)', marginBottom: '16px' }}>
            <FileText size={28} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '10px' }}>
            Résumé &amp; Accompagnement
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--slate-500)', lineHeight: 1.6 }}>
            Laisser vos coordonnées est facultatif, sauf si vous souhaitez recevoir votre résumé ou être recontacté.
          </p>
        </div>

        <div style={{ background: 'var(--bg-white)', border: '1px solid var(--slate-200)', padding: '28px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
          {errorMsg && (
            <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-danger)', background: 'var(--color-danger-bg)', padding: '10px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.82rem', fontWeight: 600 }}>
              <AlertOctagon size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="nom" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Nom &amp; Prénom</label>
              <input
                type="text"
                id="nom"
                className="form-input"
                placeholder="Ex: Amadou Diop"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Adresse e-mail</label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="Ex: amadou@diop.sn"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="tel" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Téléphone / WhatsApp</label>
              <input
                type="tel"
                id="tel"
                className="form-input"
                placeholder="Ex: +221 77 000 00 00"
                value={form.tel}
                onChange={(e) => setForm({ ...form, tel: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '6px' }}>
              <input
                type="checkbox"
                id="accept"
                checked={form.accept}
                onChange={(e) => setForm({ ...form, accept: e.target.checked })}
                style={{ marginTop: '3px', cursor: 'pointer' }}
              />
              <label htmlFor="accept" style={{ fontSize: '0.8rem', color: 'var(--slate-500)', lineHeight: '1.4', cursor: 'pointer', userSelect: 'none' }}>
                J'autorise la CCI et FUND.lab à me recontacter concernant ce diagnostic.
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Button 
              variant="teal" 
              onClick={() => handleAction('pdf')} 
              style={{ width: '100%', justifyContent: 'center', gap: '8px', color: '#fff' }}
            >
              Télécharger mon résumé PDF
            </Button>
            <Button 
              variant="primary" 
              onClick={() => handleAction('suivi')} 
              style={{ width: '100%', justifyContent: 'center', gap: '8px' }}
            >
              Demander un suivi
            </Button>
            <Button 
              variant="outline" 
              onClick={onSkip} 
              style={{ width: '100%', justifyContent: 'center', border: 'none', color: 'var(--slate-500)', textDecoration: 'underline' }}
            >
              Ignorer et terminer
            </Button>
          </div>
        </div>
      </div>
    </ScreenWrapper>
  );
};



/* ============================================================
   S99 — FIN DE PARCOURS
   ============================================================ */
export const FinParcoursScreen = ({ onRestart, onShare }) => (
  <ScreenWrapper>
    <div className="animate-scale-in" style={{ textAlign: 'center', maxWidth: '480px', margin: '0 auto', padding: 'var(--space-10) 0' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '96px', height: '96px', borderRadius: '50%', background: 'rgba(0, 184, 163, 0.08)', color: 'var(--color-teal)', marginBottom: '24px' }}>
        <Award size={48} />
      </div>
      <span className="section-tag" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>Parcours terminé</span>
      <h1 style={{ fontSize: 'clamp(1.65rem, 4vw, 2.25rem)', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.025em', marginBottom: 'var(--space-5)' }}>
        Merci d'avoir réalisé votre diagnostic !
      </h1>
      <p style={{ fontSize: '1rem', color: 'var(--slate-500)', lineHeight: 1.7, marginBottom: 'var(--space-8)', maxWidth: '400px', margin: '0 auto var(--space-8)' }}>
        Votre rapport est prêt. Gardez vos priorités d'action en tête et revenez dans quelques semaines pour mesurer votre progression.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxWidth: '320px', margin: '0 auto' }}>
        <Button variant="primary" size="lg" full onClick={onRestart}>Faire un autre diagnostic</Button>
        <Button variant="outline" full onClick={onShare}>Partager ce lien</Button>
      </div>
      <p style={{ marginTop: 'var(--space-8)', fontSize: '0.8rem', color: 'var(--slate-400)' }}>
        FUND.lab — L'évaluation intelligente des entreprises
      </p>
    </div>
  </ScreenWrapper>
);

/* ============================================================
   S90 — PAGE INSTITUTIONNELLE
   ============================================================ */
export const InstitutionnelleScreen = ({ onBack, onContact }) => (
  <div className="about-page animate-fade-up" style={{ paddingTop: '72px' }}>
    {/* Hero Section */}
    <section className="section" style={{ background: 'var(--color-white)' }}>
      <div className="container" style={{ display: 'flex', gap: 'var(--spacing-2xl)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '320px' }}>
          <h1 style={{ fontSize: '40px', marginBottom: 'var(--spacing-xl)' }}>À propos du Business Check-up</h1>
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h5 style={{ marginBottom: 'var(--spacing-xs)', fontSize: '20px' }}>Notre mission</h5>
            <p style={{ color: 'var(--color-text)', fontSize: '16px', lineHeight: '1.6' }}>
              Accompagner activement les entrepreneurs et les entreprises africaines dans leur développement grâce à des outils d'évaluation intelligents, inclusifs et hautement accessibles.
            </p>
          </div>
          <div>
            <h5 style={{ marginBottom: 'var(--spacing-xs)', fontSize: '20px' }}>Notre vision</h5>
            <p style={{ color: 'var(--color-text)', fontSize: '16px', lineHeight: '1.6' }}>
              Devenir la plateforme numérique de référence incontournable pour l'évaluation et l'accompagnement des structures en Afrique francophone.
            </p>
          </div>
        </div>
        <div style={{ flex: '1', minWidth: '320px', display: 'flex', justifyContent: 'center' }}>
          <img 
            src={aboutIllustration} 
            alt="Entrepreneurs collaborant sur le Business Check-up" 
            style={{ 
              width: '100%', 
              maxWidth: '500px', 
              height: 'auto', 
              maxHeight: '350px', 
              objectFit: 'cover', 
              borderRadius: 'var(--radius-lg)', 
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--slate-200)'
            }} 
          />
        </div>
      </div>
    </section>

    {/* Objectives Section */}
    <section className="section bg-light">
      <div className="container">
        <div className="section-header">
          <h2>Nos objectifs</h2>
          <p className="text-subtitle">Notre cadre d'action s'appuie sur trois piliers fondamentaux.</p>
        </div>
        <div className="grid-3">
          <div className="card">
            <div className="card-icon" style={{ color: 'var(--color-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '48px' }}><Globe size={24} /></div>
            <h5>Démocratiser l'accès</h5>
            <p>Permettre à chaque créateur de projet ou dirigeant de PME d'accéder sans frais à des outils d'audit d'un niveau digne des plus grands cabinets conseils.</p>
          </div>
          <div className="card">
            <div className="card-icon" style={{ color: 'var(--color-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '48px' }}><FileText size={24} /></div>
            <h5>Recommandations concrètes</h5>
            <p>Fournir un plan d'action balisé plutôt qu'une simple note. Chaque indicateur est corrélé à une opportunité d'optimisation.</p>
          </div>
          <div className="card">
            <div className="card-icon" style={{ color: 'var(--color-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '48px' }}><Handshake size={24} /></div>
            <h5>Créer un écosystème</h5>
            <p>Connecter les entreprises auditées avec les meilleurs accompagnateurs locaux pour initier et sécuriser leur croissance long terme.</p>
          </div>
        </div>
      </div>
    </section>



    {/* Actions Section */}
    <section className="section bg-light text-center">
      <div className="container" style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button variant="primary" onClick={onContact}>Nous contacter</Button>
        <Button variant="outline" onClick={onBack}>Revenir à l'accueil</Button>
      </div>
    </section>

    {/* FOOTER */}
    <footer className="footer no-print">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link to="/" style={{ display: 'inline-block', marginBottom: '16px' }}>
              <img src={logoImg} alt="FUND.lab Logo" style={{ height: '36px', width: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }} />
            </Link>
            <p>Le diagnostic intelligent au service de la croissance des entrepreneurs et des entreprises en Afrique.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h6>Nos Diagnostics</h6>
              <Link to="/catalog">Diagnostic Projet</Link>
              <Link to="/catalog">Diagnostic Flash</Link>
              <Link to="/catalog">Diagnostic Complet 360°</Link>
            </div>
            <div className="footer-col">
              <h6>L'entreprise</h6>
              <Link to="/a-propos">À Propos</Link>
              <Link to="/contact">Contact</Link>
            </div>
            <div className="footer-col">
              <h6>Légal</h6>
              <a href="#">Mentions Légales</a>
              <a href="#">Confidentialité</a>
              <a href="#">CGU</a>
            </div>
          </div>
        </div>
        <div className="footer-divider"></div>
        <div className="footer-bottom">
          <span>© 2026 FUND.lab. Tous droits réservés.</span>
        </div>
      </div>
    </footer>
  </div>
);
