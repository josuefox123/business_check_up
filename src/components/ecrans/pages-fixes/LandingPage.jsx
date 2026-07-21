import React from 'react';
import './LandingPage.css';

export const LandingPage = ({ onStart, onLearnMore, onGoToCatalog }) => {
  return (
    <div className="lp-full-page">
      {/* Hero Section */}
      <section className="lp-hero-section">
        <div className="lp-container">
          <div className="lp-hero-content">
            
            <span className="lp-tag">Auto-diagnostic entrepreneurial</span>
            
            <h1 className="lp-hero-title">
              Voyez plus clair <span className="lp-title-accent">dans votre entreprise.</span>
            </h1>
            
            <p className="lp-hero-desc">
              Identifiez ce qui fonctionne, ce qui fragilise votre progression et les actions prioritaires à engager d’abord.
            </p>
            
            {/* Value Pills / Badges (Sans icônes) */}
            <div className="lp-pills-row">
              <span className="lp-pill">7–15 min</span>
              <span className="lp-pill">Résultat immédiat</span>
              <span className="lp-pill">Sans compte</span>
            </div>
            
            {/* Action Buttons (Sans icônes devant) */}
            <div className="lp-hero-actions">
              <button className="lp-btn-primary" onClick={onStart}>
                Commencer mon diagnostic &rarr;
              </button>
              
              <button className="lp-btn-secondary" onClick={onGoToCatalog}>
                Voir les diagnostics disponibles
              </button>
              
              <button className="lp-btn-link" onClick={onLearnMore}>
                Comprendre l’outil
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Wide Footer Disclaimer Banner (Bleu crépuscule #17212D & Dark Turquoise #34BED5) */}
      <footer className="lp-disclaimer-footer">
        <div className="lp-container">
          <div className="lp-disclaimer-content">
            <span className="lp-disclaimer-title">UNE PREMIÈRE LECTURE UTILE</span>
            <p className="lp-disclaimer-text">
              Diagnostic indicatif fondé sur vos réponses. Il ne constitue ni un audit, ni une due diligence, ni une décision de financement.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
