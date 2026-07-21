import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Clock, ShieldCheck, Zap, BarChart2, Activity, Target,
  Search, Users, TrendingUp, FileText, Rocket, AlertTriangle, Lightbulb,
  Building2, Award, HelpCircle
} from 'lucide-react';
import { Button } from '../../ui/index.jsx';
import logoImg from '../../../assets/logo.png';
import './LandingPage.css';

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

function getFallbackDesc(code) {
  const fallbacks = {
    'FLH-01': 'Tour d\'horizon complet de votre entreprise en moins de 10 minutes.',
    'PRJ-02': 'Évaluez la faisabilité et le potentiel de votre nouvelle idée.',
    'DIF-03': 'Identifiez la source de vos problèmes financiers ou opérationnels.',
    'OPP-04': 'Analysez une opportunité de marché avant de vous lancer.',
    'PRO-05': 'Évaluez la performance et l\'adéquation de votre offre au marché.',
    'COM-06': 'Analysez vos ventes et le parcours d\'accès à vos clients.',
    'FIN-07': 'Faites le point sur votre trésorerie, vos charges et votre rentabilité.',
    'GOV-08': 'Vérifiez la solidité de votre structure organisationnelle.',
    '360-09': 'Un audit complet de tous les aspects clés de votre entreprise.'
  };
  return fallbacks[code] || 'Un module d\'évaluation pour votre entreprise.';
}

const STEPS = [
  { num: '01', title: 'Choisir son profil', desc: 'Dites-nous qui vous êtes en quelques clics.', Icon: Users },
  { num: '02', title: 'Pré-diagnostic', desc: 'Quelques questions rapides pour affiner votre orientation.', Icon: Search },
  { num: '03', title: 'Module recommandé', desc: 'Notre algorithme choisit le diagnostic le plus adapté.', Icon: Target },
  { num: '04', title: 'Évaluation complète', desc: 'Répondez aux questions à votre rythme, sans pression.', Icon: Activity },
  { num: '05', title: 'Rapport personnalisé', desc: 'Score, forces, fragilités et plan d\'action prêt à partager.', Icon: FileText },
];


/* ── Section title component  ── */
const SectionTitle = ({ tag, title, subtitle }) => (
  <div className="lp-section-title">
    {tag && <span className="lp-section-tag">{tag}</span>}
    <h2 className="lp-section-h2">{title}</h2>
    {subtitle && <p className="lp-section-sub">{subtitle}</p>}
  </div>
);

export const LandingPage = ({ onStart, onLearnMore, onGoToCatalog }) => {
  const [modules, setModules] = useState([
    { id: 'FLH-01', name: 'Diagnostic Flash', desc: 'Tour d\'horizon complet de votre entreprise en moins de 10 minutes.', duration: '10 min', iconName: 'Zap', bg: '#ECFDF5', iconColor: '#059669' },
    { id: 'PRJ-02', name: 'Diagnostic Projet', desc: 'Évaluez la faisabilité et le potentiel de votre nouvelle idée.', duration: '10 min', iconName: 'Target', bg: '#EFF6FF', iconColor: '#2659F2' },
    { id: 'DIF-03', name: 'Diagnostic Difficulté', desc: 'Identifiez la source de vos problèmes financiers ou opérationnels.', duration: '13 min', iconName: 'AlertTriangle', bg: '#FEF2F2', iconColor: '#ef4444' },
    { id: 'OPP-04', name: 'Diagnostic Opportunité', desc: 'Analysez une opportunité de marché avant de vous lancer.', duration: '13 min', iconName: 'Target', bg: '#FFFBEB', iconColor: '#f59e0b' },
    { id: 'PRO-05', name: 'Diagnostic Produit', desc: 'Évaluez la performance et l\'adéquation de votre offre au marché.', duration: '10 min', iconName: 'Lightbulb', bg: '#F0FDF4', iconColor: '#10b981' },
    { id: 'GOV-08', name: 'Diagnostic Organisation', desc: 'Vérifiez la solidité de votre structure organisationnelle.', duration: '10 min', iconName: 'Building2', bg: '#FAF5FF', iconColor: '#8b5cf6' },
  ]);

  useEffect(() => {
    import('../../../api/config.js').then(({ apiFetch }) => {
      apiFetch('/modules')
        .then(res => {
          const list = res?.data?.modules || res?.modules || [];
          if (list.length > 0) {
            // Filtrer le triage initial (TRI-00) et limiter aux 6 premiers
            const parsed = list
              .filter(m => m.is_available !== false && m.code !== 'TRI-00')
              .slice(0, 6)
              .map(m => ({
                id: m.code,
                name: m.name,
                desc: m.description || getFallbackDesc(m.code),
                duration: m.target_duration_formatted || m.target_duration || '',
                ...MODULE_STYLE_MAP[m.code]
              }));
            setModules(parsed);
          }
        })
        .catch(err => console.error("Error loading landing page modules from backend:", err));
    });
  }, []);

  return (
    <div className="landing-page">

      {/* ── HERO ── */}
      <section className="lp-hero-split">
        {/* Left: text content */}
        <div className="lp-hero-split-left">
          <div className="lp-hero-split-badge">
            <span className="lp-badge-dot" />
            Outil d'évaluation intelligent
          </div>

          <h1 className="lp-hero-split-title">
            Business Check-up
            <span style={{ display: 'block', fontSize: '60%', fontWeight: 700, color: 'var(--color-accent)', marginTop: '6px', letterSpacing: '-0.01em' }}>
              Powered by FUND.lab
            </span>
          </h1>

          <p className="lp-hero-split-desc">
            En quelques minutes, identifiez les points forts, les fragilités
            et les priorités d'action de votre entreprise.
          </p>

          <div className="lp-hero-split-actions">
            <button className="lp-btn-primary" onClick={onStart}>
              Aidez-moi à choisir le bon diagnostic
            </button>
          </div>

          <div className="lp-hero-secondary-links">
            {/* Desktop view (compact) */}
            <button className="lp-hero-catalog-link hide-on-mobile" onClick={onLearnMore}>
              Comprendre Business Check-up
            </button>
            <span className="lp-hero-links-separator hide-on-mobile">•</span>
            <button className="lp-hero-catalog-link hide-on-mobile" onClick={onGoToCatalog}>
              Accéder au catalogue
            </button>

            {/* Mobile view (expanded and left-aligned) */}
            <button className="lp-hero-catalog-link show-on-mobile" onClick={onLearnMore}>
              Je veux comprendre ce que fait Business Check-up
            </button>
            <button className="lp-hero-catalog-link show-on-mobile" onClick={onGoToCatalog}>
              Je sais déjà ce que je veux diagnostiquer
            </button>
          </div>
        </div>

        {/* Right: beautiful text warning without frames */}
        <div className="lp-hero-split-right">
          <div className="lp-hero-disclaimer-wrapper animate-fade-up">
            <div className="lp-hero-disclaimer-icon">
              <ShieldCheck size={48} strokeWidth={1.2} />
            </div>
            <p className="lp-hero-disclaimer-text">
              Diagnostic indicatif, fondé sur vos réponses. Il ne remplace pas une analysis approfondie.
            </p>
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
            {modules.map((d, i) => {
              const IconComponent = MODULE_ICONS_MAP[d.iconName] || HelpCircle;
              return (
                <div key={d.id} className="lp-diag-card animate-fade-up" style={{ animationDelay: `${i * 80}ms`, borderLeftColor: d.iconColor }}>
                  <div className="lp-diag-icon" style={{ background: d.bg, color: d.iconColor }}>
                    <IconComponent size={20} strokeWidth={2} />
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
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Button variant="primary" onClick={onGoToCatalog}>
              Voir tous les diagnostics <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="cta-band">
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <span className="tag" style={{ marginBottom: '20px', display: 'inline-flex', background: 'rgba(52, 190, 213,0.15)', color: '#fff' }}>
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
            <Link to="/" style={{ display: 'inline-block', marginBottom: '16px' }}>
              <img src={logoImg} alt="FUND.lab Logo" style={{ height: '36px', width: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }} />
            </Link>
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
