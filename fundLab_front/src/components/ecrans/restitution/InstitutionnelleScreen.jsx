import React from 'react';
import { Globe, FileText, Handshake, ArrowLeft, Mail } from 'lucide-react';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';
import aboutIllustration from '../../../assets/about_illustration.png';
import './InstitutionnelleScreen.css';

const OBJECTIVES = [
  {
    icon: Globe,
    title: "Démocratiser l'accès",
    description: "Permettre à chaque créateur de projet ou dirigeant de PME d'accéder sans frais à des outils d'audit d'un niveau digne des plus grands cabinets conseils."
  },
  {
    icon: FileText,
    title: "Recommandations concrètes",
    description: "Fournir un plan d'action balisé plutôt qu'une simple note. Chaque indicateur est corrélé à une opportunité d'optimisation."
  },
  {
    icon: Handshake,
    title: "Créer un écosystème",
    description: "Connecter les entreprises auditées avec les meilleurs accompagnateurs locaux pour initier et sécuriser leur croissance long terme."
  }
];

export const InstitutionnelleScreen = ({ onBack, onContact }) => (
  <ScreenWrapper wide>
    {onBack && <TopBackLink onClick={onBack} />}
    <div className="about-page animate-fade-up">
      <div className="about-container">

        {/* ── HERO & MISSION/VISION ── */}
        <section className="about-hero-card">
          <div className="about-hero-layout">
            <div className="about-hero-content">
              <span className="about-tag">Mission & Vision</span>
              <h1 className="about-title">
                À propos de <span className="about-title-accent">Business Check-up.</span>
              </h1>

              <div className="about-pillars">
                <div className="about-pillar-item">
                  <span className="about-pillar-label">Notre mission</span>
                  <p className="about-pillar-text">
                    Accompagner activement les entrepreneurs et les entreprises africaines dans leur développement grâce à des outils d'évaluation intelligents, inclusifs et hautement accessibles.
                  </p>
                </div>

                <div className="about-pillar-item">
                  <span className="about-pillar-label">Notre vision</span>
                  <p className="about-pillar-text">
                    Devenir la plateforme numérique de référence incontournable pour l'évaluation et l'accompagnement des structures en Afrique francophone.
                  </p>
                </div>
              </div>
            </div>

            <div className="about-hero-visual">
              <img
                src={aboutIllustration}
                alt="Entrepreneurs collaborant sur le Business Check-up"
                className="about-img"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* ── OBJECTIVES SECTION ── */}
        <section className="about-objectives-section">
          <div className="about-section-header">
            <span className="about-section-tag">Cadre d'action</span>
            <h2 className="about-section-title">Nos objectifs</h2>
            <p className="about-section-subtitle">
              Notre démarche s'appuie sur trois piliers fondamentaux.
            </p>
          </div>

          <div className="about-grid-3">
            {OBJECTIVES.map((obj, idx) => {
              const IconComp = obj.icon;
              return (
                <div key={idx} className="about-objective-card">
                  <div className="about-card-icon">
                    <IconComp size={22} />
                  </div>
                  <h3 className="about-card-title">{obj.title}</h3>
                  <p className="about-card-desc">{obj.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── ACTIONS SECTION ── */}
        <section className="about-actions-section">
          {onContact && (
            <button
              type="button"
              className="about-btn-primary"
              onClick={onContact}
            >
              <Mail size={18} />
              <span>Nous contacter</span>
            </button>
          )}
          {onBack && (
            <button
              type="button"
              className="about-btn-outline"
              onClick={onBack}
            >
              <ArrowLeft size={16} />
              <span>Revenir à l'accueil</span>
            </button>
          )}
        </section>

      </div>
    </div>
  </ScreenWrapper>
);
