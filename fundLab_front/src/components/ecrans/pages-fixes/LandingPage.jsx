import React from 'react';
import './LandingPage.css';
import whiteLogoImg from '../../../assets/white_logo.png';

export const LandingPage = ({ onStart, onLearnMore, onGoToCatalog }) => {
  return (
    <div className="lp-full-page">
      {/* Hero Section */}
      <section className="lp-hero-section">
        <div className="lp-container">
          <div className="lp-hero-card">

            <span className="lp-tag">Auto-diagnostic entrepreneurial</span>

            <h1 className="lp-hero-title">
              Faites le point <span className="lp-title-accent">sur votre entreprise.</span>
            </h1>

            <p className="lp-hero-desc">
              Identifiez ce qui fonctionne, ce qui fragilise votre progression et les actions prioritaires à engager d’abord.
            </p>

            {/* Action Buttons */}
            <div className="lp-hero-actions">
              <div className="lp-cta-group">
                <button type="button" className="lp-btn-primary" onClick={onStart}>
                  Commencer mon diagnostic
                </button>
                <button type="button" className="lp-btn-link" onClick={onLearnMore}>
                  Comprendre l’outil
                </button>
              </div>

              <button
                type="button"
                className="lp-catalog-link"
                onClick={onGoToCatalog}
              >
                Consulter directement le catalogue →
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Wide Footer Disclaimer Banner (Bleu crépuscule #17212D & Dark Turquoise #34BED5) */}
      <footer className="lp-disclaimer-footer">
        <div className="lp-container">
          <div className="lp-disclaimer-content">
            <span className="lp-disclaimer-title">NOTE DE PRUDENCE</span>
            <p className="lp-disclaimer-text">
              Diagnostic indicatif fondé sur vos déclarations et nos modèles d'analyse. Il ne constitue ni un audit financier, ni une due diligence, ni une décision de financement, et ne remplace pas une mission d'expertise comptable agréée.
            </p>
            <div className="lp-disclaimer-powered">
              <span className="lp-powered-label">Powered by</span>
              <a
                href="https://fund-lab.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="lp-powered-link"
              >
                <img
                  src={whiteLogoImg}
                  alt="FUND.lab"
                  className="lp-powered-logo"
                />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

