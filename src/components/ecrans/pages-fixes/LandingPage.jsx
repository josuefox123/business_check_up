import React from 'react';
import { ArrowRight, Clock, Zap, ShieldCheck, Compass, HelpCircle, Sparkles, BarChart2, CheckCircle2, ShieldAlert } from 'lucide-react';
import './LandingPage.css';

export const LandingPage = ({ onStart, onLearnMore, onGoToCatalog }) => {
  return (
    <div className="lp-container">
      {/* Background ambient lighting blobs */}
      <div className="lp-ambient-blob lp-blob-1" />
      <div className="lp-ambient-blob lp-blob-2" />

      <div className="lp-main-wrapper">
        <div className="lp-card">
          <div className="lp-card-grid">
            
            {/* Main Action Column */}
            <div className="lp-card-content">
              <div className="lp-tag">
                <Sparkles size={14} className="lp-tag-icon" />
                <span>Auto-diagnostic entrepreneurial</span>
              </div>
              
              <h1 className="lp-card-title">
                Voyez plus clair <br className="hide-on-mobile" />
                <span className="lp-title-gradient">dans votre entreprise.</span>
              </h1>
              
              <p className="lp-card-desc">
                Identifiez ce qui fonctionne, ce qui fragilise votre progression et les actions prioritaires à engager.
              </p>
              
              {/* Value Pills / Badges */}
              <div className="lp-pills-row">
                <span className="lp-pill">
                  <Clock size={13} color="#0284C7" />
                  <span>7–15 min</span>
                </span>
                <span className="lp-pill">
                  <Zap size={13} color="#059669" />
                  <span>Résultat immédiat</span>
                </span>
                <span className="lp-pill">
                  <ShieldCheck size={13} color="#7C3AED" />
                  <span>Sans compte</span>
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="lp-actions">
                <button className="lp-btn-primary-card" onClick={onStart}>
                  <span>Commencer mon diagnostic</span>
                  <ArrowRight size={18} strokeWidth={2.5} />
                </button>
                
                <button className="lp-btn-outline-card" onClick={onGoToCatalog}>
                  <Compass size={18} />
                  <span>Voir les diagnostics disponibles</span>
                </button>
                
                <button className="lp-btn-text-card" onClick={onLearnMore}>
                  <HelpCircle size={16} />
                  <span>Comprendre l’outil</span>
                </button>
              </div>
            </div>
            
            {/* Visual Feature Sidebar (Desktop enhanced preview) */}
            <div className="lp-card-sidebar">
              <div className="lp-preview-box">
                <div className="lp-preview-header">
                  <BarChart2 size={18} color="#06B6D4" />
                  <span>Ce que vous découvrirez</span>
                </div>
                
                <ul className="lp-preview-list">
                  <li>
                    <CheckCircle2 size={16} color="#10B981" className="flex-shrink-0" />
                    <span><strong>Score global de maturité</strong> évalué sur 100 points</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} color="#10B981" className="flex-shrink-0" />
                    <span><strong>Forces &amp; fragilités</strong> de votre activité</span>
                  </li>
                  <li>
                    <CheckCircle2 size={16} color="#10B981" className="flex-shrink-0" />
                    <span><strong>Priorités d'action</strong> à 30, 60 et 90 jours</span>
                  </li>
                </ul>
              </div>

              {/* Bottom Banner inside sidebar/card */}
              <div className="lp-card-banner">
                <div className="lp-banner-header">
                  <ShieldAlert size={15} color="#22D3EE" />
                  <span className="lp-banner-title">Une première lecture utile</span>
                </div>
                <p className="lp-banner-desc">
                  Diagnostic indicatif fondé sur vos réponses. Il ne constitue ni un audit, ni une due diligence, ni une décision de financement.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
