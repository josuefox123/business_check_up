import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Clock, ShieldCheck, Zap, BarChart2, Activity, Target,
  Search, Users, CheckCircle, TrendingUp, FileText, ChevronLeft, ChevronRight,
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

/* ── Section title component inspired by the Abomey site ── */
const SectionTitle = ({ tag, title, subtitle }) => (
  <div className="lp-section-title">
    {tag && <span className="lp-section-tag">{tag}</span>}
    <h2 className="lp-section-h2">{title}</h2>
    {subtitle && <p className="lp-section-sub">{subtitle}</p>}
  </div>
);

export const LandingPage = ({ onStart, onLearnMore, onGoToCatalog }) => {
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
        {/* Carousel Background */}
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

        {/* Dark overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(10, 23, 69, 0.55) 0%, rgba(10, 23, 69, 0.78) 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }} />

        {/* Carousel dots */}
        <div className="hero-bg-dots no-print">
          {HERO_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImgIndex(index)}
              className={`hero-bg-dot${index === currentImgIndex ? ' active' : ''}`}
              aria-label={`Image ${index + 1}`}
            />
          ))}
        </div>

        <div className="container hero-grid" style={{ zIndex: 2 }}>
          <div className="hero-content animate-fade-up">
            {/* Small institution badge */}
            <div className="lp-hero-badge">
              <ShieldCheck size={13} />
              Outil officiel CCI Bénin
            </div>

            <h1 className="hero-title" style={{ color: '#ffffff' }}>
              Business Check-up
              <span className="hero-title-accent" style={{ fontSize: '1.5rem', display: 'block', marginTop: '8px', color: 'var(--color-accent)', fontWeight: 700 }}>
                Powered by FUND.lab
              </span>
            </h1>

            <p className="hero-subtitle" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem', marginBottom: '28px' }}>
              En quelques minutes, identifiez les points forts, les fragilités<br />
              et les priorités d'action de votre entreprise.
            </p>

            <div className="hero-actions">
              <button className="hero-cta-primary" onClick={onStart}>
                Aidez-moi à choisir le bon diagnostic <ArrowRight size={18} strokeWidth={2.5} />
              </button>
              <button className="hero-link-btn" onClick={onGoToCatalog}>
                Je sais déjà ce que je veux diagnostiquer
              </button>
              <button className="hero-link-btn" onClick={onLearnMore}>
                Je veux comprendre ce que fait Business Check-up
              </button>
            </div>

            <div className="hero-trust" style={{ marginTop: '16px', color: 'rgba(255,255,255,0.55)' }}>
              <ShieldCheck size={13} color="rgba(255,255,255,0.55)" />
              <span style={{ fontSize: '0.73rem' }}>
                Diagnostic indicatif, fondé sur vos réponses. Il ne remplace pas une analyse approfondie.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── NOTRE MISSION (style Abomey) ── */}
      <section className="lp-band lp-band--white">
        <div className="container">
          <SectionTitle
            tag="Notre mission"
            title="Un outil au service des entrepreneurs béninois"
            subtitle="FUND.lab Business Check-up aide les dirigeants d'entreprise à évaluer leur situation, identifier leurs fragilités et bâtir un plan d'action concret — gratuitement, en quelques minutes."
          />

          <div className="lp-why-grid">
            {WHY_ITEMS.map((item, i) => (
              <div key={i} className="lp-why-card animate-fade-up" style={{ animationDelay: `${i * 100 + 100}ms` }}>
                <div className="lp-why-icon">
                  <item.Icon size={22} strokeWidth={2} />
                </div>
                <div>
                  <h5 className="lp-why-title">{item.title}</h5>
                  <p className="lp-why-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ── */}
      <section className="lp-band lp-band--light">
        <div className="container">
          <SectionTitle
            tag="Parcours guidé"
            title="Mise en oeuvre du Diagnostic"
            subtitle="Un processus simple et progressif en 5 étapes clés."
          />

          <div className="lp-steps-row">
            {STEPS.map((s, i) => (
              <div key={i} className="lp-step animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="lp-step-num">{s.num}</div>
                <div className="lp-step-icon">
                  <s.Icon size={18} strokeWidth={2} />
                </div>
                <div className="lp-step-title">{s.title}</div>
                <div className="lp-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button className="hero-cta-primary" onClick={onStart} style={{ display: 'inline-flex', width: 'auto' }}>
              Lancer mon diagnostic <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </section>

      {/* ── NOS DIAGNOSTICS ── */}
      <section className="lp-band lp-band--white" id="diagnostics">
        <div className="container">
          <SectionTitle
            tag="Catalogue"
            title="Nos Diagnostics"
            subtitle="Des modules d'évaluation adaptés à chaque étape de votre développement."
          />

          <div className="lp-diag-grid">
            {DIAGNOSTICS.map((d, i) => (
              <div key={d.id} className="lp-diag-card animate-fade-up" style={{ animationDelay: `${i * 80}ms`, borderLeftColor: d.iconColor }}>
                <div className="lp-diag-icon" style={{ background: d.color, color: d.iconColor }}>
                  <d.Icon size={20} strokeWidth={2} />
                </div>
                <div className="lp-diag-body">
                  <h5 className="lp-diag-name">{d.name}</h5>
                  <p className="lp-diag-desc">{d.desc}</p>
                  <div className="lp-diag-footer">
                    <span className="lp-diag-duration"><Clock size={12} /> {d.duration}</span>
                    <Link to="/catalog" className="lp-diag-link">Voir <ArrowRight size={13} /></Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
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
          <button className="hero-cta-primary" onClick={onStart} style={{ background: 'var(--color-accent)', color: 'var(--color-primary)', display: 'inline-flex', width: 'auto' }}>
            Commencer maintenant <ArrowRight size={20} strokeWidth={2.5} />
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer no-print">
        <div className="container lp-footer-inner">
          <div className="lp-footer-brand">
            <span className="logo-text">FUND<span style={{ color: 'var(--color-accent)' }}>.lab</span></span>
            <p>Le diagnostic intelligent au service de la croissance des entrepreneurs et des entreprises.</p>
            <p style={{ marginTop: '8px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>
              Un service de la CCI Bénin
            </p>
          </div>
          <div className="lp-footer-links">
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
        <div className="lp-footer-bottom container">
          <span>© 2026 FUND.lab — CCI Bénin. Tous droits réservés.</span>
          <span>Les résultats sont indicatifs et ne constituent pas un conseil professionnel.</span>
        </div>
      </footer>
    </div>
  );
};
