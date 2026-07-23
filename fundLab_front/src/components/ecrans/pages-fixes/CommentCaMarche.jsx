import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Shield, BarChart2, Download, Zap, Compass, Search, FileText, Users } from 'lucide-react';
import logoImg from '../../../assets/logo_compact.png';
import './CommentCaMarche.css';

const STEPS = [
  {
    num: '01',
    icon: <Users size={20} />,
    title: 'Choisissez votre profil',
    desc: 'Sélectionnez la situation qui décrit le mieux votre activité parmi nos 6 profils. Cela permet d\'ajuster immédiatement le parcours à vos enjeux de départ.',
    tag: '< 1 min',
  },
  {
    num: '02',
    icon: <Search size={20} />,
    title: 'Répondez au pré-diagnostic',
    desc: 'Quelques questions rapides permettent à notre moteur de comprendre votre contexte — secteur, région, préoccupation principale, signaux de risque.',
    tag: '2–3 min',
  },
  {
    num: '03',
    icon: <Zap size={20} />,
    title: 'Recevez votre orientation',
    desc: 'Notre algorithme intelligent vous recommande instantanément le module de diagnostic le plus adapté à votre profil et votre situation.',
    tag: 'Instantané',
  },
  {
    num: '04',
    icon: <FileText size={20} />,
    title: 'Complétez le questionnaire',
    desc: 'Répondez aux questions du module recommandé à votre rythme. Des estimations suffisent — une option "Je ne sais pas" est disponible à chaque étape.',
    tag: '7–45 min',
  },
  {
    num: '05',
    icon: <BarChart2 size={20} />,
    title: 'Obtenez votre rapport personnalisé',
    desc: 'Score de maturité, forces, fragilités, priorités d\'action et recommandations personnalisées — téléchargeables en PDF immédiatement.',
    tag: 'Immédiat',
  },
];

const FEATURES = [
  { icon: <Shield size={22} />, title: '100% confidentiel', desc: 'Vos données restent privées. Aucune inscription requise.' },
  { icon: <Clock size={22} />, title: 'De 7 à 45 minutes', desc: 'Choisissez le module adapté à votre disponibilité.' },
  { icon: <BarChart2 size={22} />, title: 'Score & analyse', desc: 'Un score de maturité + des recommandations concrètes.' },
  { icon: <Download size={22} />, title: 'Rapport PDF', desc: 'Téléchargez et conservez votre rapport de diagnostic.' },
];

export const CommentCaMarche = ({ onStart }) => {
  return (
    <div className="how-it-works-page">

      {/* ── HERO ── */}
      <section className="hiw-hero">
        <div className="container hiw-hero-inner">
          <h1 className="hiw-hero-title">
            Un parcours guidé,<br />
            <span style={{ color: 'var(--color-accent)' }}>étape par étape</span>
          </h1>
          <p className="hiw-hero-subtitle">
            En quelques questions, notre outil vous oriente vers le diagnostic le plus adapté, analyse votre situation et vous livre un rapport personnalisé.
          </p>
        </div>
      </section>

      {/* ── STEPS ── */}
      <section className="section" style={{ background: 'var(--bg-white)', paddingTop: 'var(--space-16)' }}>
        <div className="container hiw-steps-container">
          <div className="hiw-steps-line" />
          {STEPS.map((step, i) => (
            <div key={i} className={`hiw-step-row animate-fade-up delay-${Math.min(i, 5) + 1}00`}>
              <div className="hiw-step-left">
                <div className="hiw-step-num-wrap">
                  <div className="hiw-step-icon">{step.icon}</div>
                  <div className="hiw-step-num">{step.num}</div>
                </div>
              </div>
              <div className="hiw-step-card">
                <div className="hiw-step-header">
                  <h3 className="hiw-step-title">{step.title}</h3>
                  <span className="hiw-step-tag">
                    <Clock size={11} /> {step.tag}
                  </span>
                </div>
                <p className="hiw-step-desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section" style={{ background: 'var(--bg-app)' }}>
        <div className="container">
          <div className="section-header animate-fade-up">
            <h2>Ce que vous obtenez</h2>
            <p>Un diagnostic complet, gratuit et exploitable immédiatement.</p>
          </div>
          <div className="grid-2 hiw-features-grid animate-fade-up delay-200">
            {FEATURES.map((f, i) => (
              <div key={i} className="hiw-feature-card">
                <div className="hiw-feature-icon">{f.icon}</div>
                <div>
                  <div className="hiw-feature-title">{f.title}</div>
                  <div className="hiw-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="hiw-cta-section">
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <h2 style={{ color: '#fff', marginBottom: '14px', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
            Prêt à lancer votre diagnostic ?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '32px', maxWidth: '460px', margin: '0 auto 32px' }}>
            Aucune inscription requise. Vos réponses restent confidentielles.
          </p>
          <button className="hiw-btn-cta" onClick={onStart}>
            Commencer le diagnostic
          </button>
        </div>
      </section>
    </div>
  );
};
