import React from 'react';
import './LandingPage.css';

export const LandingPage = ({ onStart, onLearnMore, onGoToCatalog }) => {
  return (
    <div className="lp-container">
      <div className="lp-card">
        {/* Upper Content area */}
        <div className="lp-card-content">
          <span className="lp-tag">Auto-diagnostic entrepreneurial</span>
          
          <h1 className="lp-card-title">
            Voyez plus clair dans votre entreprise.
          </h1>
          
          <p className="lp-card-desc">
            Identifiez ce qui fonctionne, ce qui fragilise votre progression et les actions à engager d’abord.
          </p>
          
          {/* Pills / Badges */}
          <div className="lp-pills-row">
            <span className="lp-pill">7–15 min</span>
            <span className="lp-pill">Résultat immédiat</span>
            <span className="lp-pill">Sans compte</span>
          </div>
          
          {/* Buttons */}
          <div className="lp-actions">
            <button className="lp-btn-primary-card" onClick={onStart}>
              Commencer mon diagnostic &rarr;
            </button>
            
            <button className="lp-btn-outline-card" onClick={onGoToCatalog}>
              Voir les diagnostics disponibles
            </button>
            
            <button className="lp-btn-text-card" onClick={onLearnMore}>
              Comprendre l’outil
            </button>
          </div>
        </div>
        
        {/* Bottom Banner area */}
        <div className="lp-card-banner">
          <span className="lp-banner-title">Une première lecture utile</span>
          <p className="lp-banner-desc">
            Diagnostic indicatif fondé sur vos réponses. Il ne constitue ni un audit, ni une due diligence, ni une décision de financement.
          </p>
        </div>
      </div>
    </div>
  );
};
