import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Clock, ShieldCheck, Zap, BarChart2, Activity, Target,
  Search, Users, CheckCircle, TrendingUp, Award, FileText,
  ChevronLeft, ChevronRight, Star, Quote,
  Lightbulb, Lock, RefreshCw, AlertCircle, Briefcase, Globe,
} from 'lucide-react';
import { Button } from '../ui/index.jsx';
import './LandingPage.css';

import cotiAmazone from '../../assets/about_illustration.png';
import cotiBeach from '../../assets/hero_illustration.png';
import cotiRetro from '../../assets/about_illustration.png';
import cotiPortReal from '../../assets/coti_port_real.jpg';
import cotiAvenueReal from '../../assets/coti_avenue_real.jpg';

const HERO_IMAGES = [cotiAmazone, cotiBeach, cotiRetro, cotiPortReal, cotiAvenueReal];

const DIAGNOSTICS = [
  { id: 'FLH-01', name: 'Diagnostic Flash', desc: 'Tour d\'horizon complet de votre entreprise en moins de 10 minutes.', duration: '7 min', Icon: Zap, color: '#ECFDF5', iconColor: '#059669' },
  { id: 'PRJ-02', name: 'Diagnostic Projet', desc: 'Évaluez la faisabilité et le potentiel de votre nouvelle idée.', duration: '12 min', Icon: Target, color: '#EFF6FF', iconColor: '#2659F2' },
  { id: 'DIF-03', name: 'Diagnostic Difficulté', desc: 'Identifiez la source de vos problèmes financiers ou opérationnels.', duration: '15 min', Icon: Activity, color: '#FEF2F2', iconColor: '#ef4444' },
  { id: 'OPP-04', name: 'Diagnostic Opportunité', desc: 'Analysez une opportunité de marché avant de vous lancer.', duration: '15 min', Icon: Search, color: '#FFFBEB', iconColor: '#f59e0b' },
  { id: 'PRO-05', name: 'Diagnostic Produit', desc: 'Évaluez la performance et l\'adéquation de votre offre au marché.', duration: '10 min', Icon: BarChart2, color: '#F0FDF4', iconColor: '#10b981' },
  { id: 'GOV-08', name: 'Diagnostic Organisation', desc: 'Vérifiez la solidité de votre structure organisationnelle.', duration: '10 min', Icon: Users, color: '#FAF5FF', iconColor: '#8b5cf6' },
];



const STEPS = [
  { num: '01', title: 'Choisir son profil', desc: 'Dites-nous qui vous êtes en quelques clics.', Icon: Users },
  { num: '02', title: 'Pré-diagnostic', desc: 'Quelques questions rapides pour affiner votre orientation.', Icon: Search },
  { num: '03', title: 'Module recommandé', desc: 'Notre algorithme choisit le diagnostic le plus adapté.', Icon: Target },
  { num: '04', title: 'Évaluation complète', desc: 'Répondez aux questions à votre rythme, sans pression.', Icon: Activity },
  { num: '05', title: 'Rapport personnalisé', desc: 'Score, forces, fragilités et plan d\'action prêt à partager.', Icon: FileText },
];

const WHY_ITEMS = [
  {
    Icon: Search,
    title: 'Révéler les fragilités cachées',
    desc: 'Mettez en lumière les goulots d\'étranglement financiers et opérationnels avant qu\'ils ne ralentissent votre croissance.',
  },
  {
    Icon: TrendingUp,
    title: 'Prendre des décisions éclairées',
    desc: 'Validez vos choix de développement, de recrutement et de financement à l\'aide d\'indicateurs clairs et fiables.',
  },
  {
    Icon: Target,
    title: 'Piloter avec un plan d\'action',
    desc: 'Bénéficiez d\'un plan d\'action structuré et hiérarchisé à partager facilement avec vos partenaires et accompagnateurs.',
  },
];

// ── TÉMOIGNAGES (données carrousel) ──────────────────────────────────
const TESTIMONIALS = [
  {
    name: 'Aminata D.',
    role: 'Directrice, PME',
    country: 'Côte d\'Ivoire',
    avatar: 'AD',
    avatarBg: '#2659F2',
    rating: 5,
    text: 'Le diagnostic FUND.lab m\'a permis d\'identifier en moins de 15 minutes les trois fragilités qui bloquaient notre croissance.',
    module: 'Diagnostic 360°',
    score: 71,
  },
  {
    name: 'Kofi A.',
    role: 'Fondateur, Startup',
    country: 'Ghana',
    avatar: 'KA',
    avatarBg: '#00D1BA',
    rating: 5,
    text: 'J\'avais un projet solide mais je ne savais pas par où commencer. Le Diagnostic Projet m\'a donné un plan structuré.',
    module: 'Diagnostic Projet',
    score: 64,
  },
  {
    name: 'Fatou N.',
    role: 'Gérante, Cabinet',
    country: 'Sénégal',
    avatar: 'FN',
    avatarBg: '#8b5cf6',
    rating: 5,
    text: 'En traversant une période difficile, le diagnostic de difficulté a mis le doigt sur ce que je refusais de voir.',
    module: 'Diagnostic Difficulté',
    score: 38,
  },
];

export const LandingPage = ({ onStart, onLearnMore, onGoToCatalog }) => {
  const navigate = useNavigate();
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex(prev => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="landing-page">

      {/* ── HERO ── */}
      <section className="hero-section" style={{ position: 'relative' }}>
        {/* Carousel Background Images with fade transition */}
        <div className="hero-bg-slider" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {HERO_IMAGES.map((img, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: index === currentImgIndex ? 1 : 0,
                transition: 'opacity 1.2s ease-in-out',
                zIndex: index === currentImgIndex ? 1 : 0
              }}
            />
          ))}
        </div>

        {/* Premium Dark overlay for high contrast and readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(10, 23, 69, 0.55) 0%, rgba(10, 23, 69, 0.75) 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }} />

        {/* Dots indicators for carousel */}
        <div className="hero-bg-dots no-print">
          {HERO_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImgIndex(index)}
              className={`hero-bg-dot${index === currentImgIndex ? ' active' : ''}`}
              aria-label={`Afficher l'image ${index + 1}`}
            />
          ))}
        </div>

        <div className="hero-bg-glow" style={{ opacity: 0.15 }} />
        <div className="container hero-grid" style={{ zIndex: 2 }}>
          <div className="hero-content animate-fade-up">
            <span className="tag" style={{
              marginBottom: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(0, 209, 186, 0.15)',
              color: 'var(--color-accent)',
              border: '1px solid rgba(0, 209, 186, 0.3)'
            }}>
              <Zap size={13} strokeWidth={2.5} /> Outil d'évaluation intelligent
            </span>
            <h1 className="hero-title" style={{ color: '#ffffff' }}>
              Business Check-up<br />
              <span className="hero-title-accent" style={{ fontSize: '1.6rem', display: 'block', marginTop: '4px', color: 'var(--color-accent)', fontWeight: 700 }}>Powered by FUND.lab</span>
            </h1>
            <p className="hero-subtitle" style={{ fontWeight: 500, color: 'rgba(255, 255, 255, 0.85)', fontSize: '1.15rem', marginBottom: '20px' }}>
              En quelques minutes, identifiez les points forts, les fragilités et les priorités d'action
            </p>

            <div className="hero-actions">
              <button className="hero-cta-primary" onClick={onStart}>
                Aidez-moi à choisir le bon diagnostic <ArrowRight size={18} strokeWidth={2.5} />
              </button>

              <button
                className="hero-link-btn"
                onClick={onGoToCatalog}
              >
                Je sais déjà ce que je veux diagnostiquer
              </button>

              <button
                className="hero-link-btn"
                onClick={onLearnMore}
              >
                Je veux comprendre ce que fait Business Check-up
              </button>
            </div>
            <div className="hero-trust" style={{ marginTop: '16px', color: 'rgba(255, 255, 255, 0.6)' }}>
              <ShieldCheck size={14} color="rgba(255, 255, 255, 0.6)" />
              <span style={{ fontSize: '0.74rem', color: 'rgba(255, 255, 255, 0.6)', lineHeight: '1.4' }}>
                Diagnostic indicatif, fondé sur vos réponses. Il ne remplace pas une analyse approfondie.
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ── POURQUOI ── */}
      <section className="section" style={{ background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="section-header animate-fade-up">
            <span className="tag" style={{ marginBottom: '16px' }}>Les bénéfices</span>
            <h2>Pourquoi diagnostiquer son entreprise ?</h2>
            <p>Prendre du recul pour anticiper les risques et libérer votre potentiel de croissance.</p>
          </div>
          <div className="grid-3">
            {WHY_ITEMS.map((item, i) => (
              <div key={i} className="card animate-fade-up" style={{ animationDelay: `${i * 100 + 200}ms` }}>
                <div className="card-icon-wrap">
                  <item.Icon size={22} strokeWidth={2} />
                </div>
                <h5>{item.title}</h5>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STEPS ── */}
      <section className="section" style={{ background: 'var(--bg-app)' }}>
        <div className="container">
          <div className="section-header animate-fade-up">
            <span className="tag" style={{ marginBottom: '16px' }}>Parcours</span>
            <h2>Comment ça fonctionne ?</h2>
            <p>Un processus simple et progressif en 5 étapes clés.</p>
          </div>
          <div className="steps-grid">
            {STEPS.map((s, i) => (
              <div key={i} className="step-item animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="step-icon-wrap">
                  <s.Icon size={18} strokeWidth={2} />
                </div>
                <div className="step-num">{s.num}</div>
                <div className="step-body">
                  <div className="step-title">{s.title}</div>
                  <div className="step-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <button className="hero-cta-primary" onClick={onStart}>
              Lancer mon diagnostic <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </section>

      {/* ── DIAGNOSTICS ── */}
      <section className="section" id="diagnostics" style={{ background: 'var(--bg-white)' }}>
        <div className="container">
          <div className="section-header animate-fade-up">
            <span className="tag" style={{ marginBottom: '16px' }}>Catalogue</span>
            <h2>Nos Diagnostics</h2>
            <p>Des modules d'évaluation adaptés à chaque étape de votre développement.</p>
          </div>
          <div className="diag-grid">
            {DIAGNOSTICS.map((d, i) => (
              <div key={d.id} className="diag-card animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="diag-icon" style={{ background: d.color, color: d.iconColor }}>
                  <d.Icon size={22} strokeWidth={2} />
                </div>
                <div className="diag-body">
                  <h5 className="diag-name">{d.name}</h5>
                  <p className="diag-desc">{d.desc}</p>
                </div>

                <div className="diag-footer">
                  <span className="diag-duration"><Clock size={13} /> {d.duration}</span>
                  <Link to="/catalog" className="diag-link">Voir <ArrowRight size={14} /></Link>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Button variant="outline" onClick={onGoToCatalog}>
              Voir tous les diagnostics <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="cta-band">
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="tag" style={{ marginBottom: '20px', display: 'inline-flex', background: 'rgba(0,209,186,0.15)', color: '#fff' }}>
            <ShieldCheck size={13} /> Gratuit &amp; sans inscription
          </span>
          <h2 style={{ color: '#fff', marginBottom: '16px', fontSize: 'clamp(1.75rem,4vw,2.5rem)' }}>
            Prêt à évaluer votre entreprise ?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '36px', maxWidth: '480px', margin: '0 auto 36px' }}>
            Démarrez votre diagnostic guidé maintenant et obtenez votre score de maturité en quelques minutes.
          </p>
          <button className="hero-cta-primary" onClick={onStart} style={{ background: 'var(--color-accent)', color: 'var(--color-primary)' }}>
            Commencer maintenant <ArrowRight size={20} strokeWidth={2.5} />
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer no-print">
        <div className="footer-content container">
          <div className="footer-brand">
            <span className="logo-text">FUND<span style={{ color: 'var(--color-accent)' }}>.lab</span></span>
            <p>Le diagnostic intelligent au service de la croissance des entrepreneurs et des entreprises.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h6>Diagnostics</h6>
              <Link to="/catalog">Diagnostic Projet</Link>
              <Link to="/catalog">Diagnostic Flash</Link>
              <Link to="/catalog">Diagnostic Complet 360°</Link>
            </div>
            <div className="footer-col">
              <h6>À propos</h6>
              <Link to="/a-propos">Notre mission</Link>
              <Link to="/a-propos">Nos partenaires</Link>
              <Link to="/contact">Contact</Link>
            </div>
            <div className="footer-col">
              <h6>Légal</h6>
              <a href="#">Mentions légales</a>
              <a href="#">Confidentialité</a>
              <a href="#">CGU</a>
            </div>
          </div>
        </div>
        <div className="footer-divider" style={{ maxWidth: '1280px', margin: '0 auto' }} />
        <div className="footer-bottom container">
          <span>© 2026 FUND.lab. Tous droits réservés.</span>
          <span>Les résultats sont indicatifs et ne constituent pas un conseil professionnel.</span>
        </div>
      </footer>
    </div>
  );
};
