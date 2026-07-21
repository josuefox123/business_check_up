import React from 'react';
import { ArrowRight, Clock, Zap, ShieldCheck, Compass, HelpCircle, Sparkles, BarChart2, CheckCircle2, ShieldAlert } from 'lucide-react';
import './LandingPage.css';

export const LandingPage = ({ onStart, onLearnMore, onGoToCatalog }) => {
  return (
    <div className="lp-full-page">
      {/* Background ambient glowing shapes */}
      <div className="lp-ambient-blob lp-blob-1" />
      <div className="lp-ambient-blob lp-blob-2" />

      {/* Hero Section — Full Width Desktop Container */}
      <section className="lp-hero-section">
        <div className="lp-container">
          <div className="lp-hero-grid">
            
            {/* Left Column: Hero Content */}
            <div className="lp-hero-left">
              <div className="lp-tag">
                <Sparkles size={14} className="lp-tag-icon" />
                <span>Auto-diagnostic entrepreneurial</span>
              </div>
              
              <h1 className="lp-hero-title">
                Voyez plus clair <br />
                <span className="lp-title-gradient">dans votre entreprise.</span>
              </h1>
              
              <p className="lp-hero-desc">
                Identifiez ce qui fonctionne, ce qui fragilise votre progression et les actions prioritaires à engager d’abord.
              </p>
              
              {/* Value Pills */}
              <div className="lp-pills-row">
                <span className="lp-pill">
                  <Clock size={14} color="#0284C7" />
                  <span>7–15 min</span>
                </span>
                <span className="lp-pill">
                  <Zap size={14} color="#059669" />
                  <span>Résultat immédiat</span>
                </span>
                <span className="lp-pill">
                  <ShieldCheck size={14} color="#7C3AED" />
                  <span>Sans compte</span>
                </span>
              </div>
              
              {/* CTAs */}
              <div className="lp-hero-actions">
                <button className="lp-btn-primary" onClick={onStart}>
                  <span>Commencer mon diagnostic</span>
                  <ArrowRight size={18} strokeWidth={2.5} />
                </button>
                
                <button className="lp-btn-secondary" onClick={onGoToCatalog}>
                  <Compass size={18} />
                  <span>Voir les diagnostics disponibles</span>
                </button>
                
                <button className="lp-btn-link" onClick={onLearnMore}>
                  <HelpCircle size={16} />
                  <span>Comprendre l’outil</span>
                </button>
              </div>
            </div>

            {/* Right Column: Visual SaaS Feature Showcase */}
            <div className="lp-hero-right">
              <div className="lp-preview-card">
                <div className="lp-preview-header">
                  <div className="lp-preview-badge">
                    <BarChart2 size={16} color="#06B6D4" />
                    <span>Aperçu de la restitution</span>
                  </div>
                  <span className="lp-preview-score-tag">Score /100</span>
                </div>

                <div className="lp-preview-body">
                  <div className="lp-preview-item">
                    <div className="lp-preview-icon-wrap bg-green-light">
                      <CheckCircle2 size={18} color="#10B981" />
                    </div>
                    <div>
                      <h4 className="lp-preview-item-title">Score global de maturité</h4>
                      <p className="lp-preview-item-sub">Analyse objective de l'ensemble de vos axes stratégiques</p>
                    </div>
                  </div>

                  <div className="lp-preview-item">
                    <div className="lp-preview-icon-wrap bg-blue-light">
                      <Sparkles size={18} color="#0284C7" />
                    </div>
                    <div>
                      <h4 className="lp-preview-item-title">Forces &amp; Fragilités</h4>
                      <p className="lp-preview-item-sub">Cartographie claire des leviers et des vulnérabilités</p>
                    </div>
                  </div>

                  <div className="lp-preview-item">
                    <div className="lp-preview-icon-wrap bg-purple-light">
                      <Zap size={18} color="#7C3AED" />
                    </div>
                    <div>
                      <h4 className="lp-preview-item-title">Priorités d'action</h4>
                      <p className="lp-preview-item-sub">Plan d'action structuré et jalonnations à 30, 60 et 90 jours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Wide Footer Disclaimer Banner */}
      <footer className="lp-disclaimer-footer">
        <div className="lp-container">
          <div className="lp-disclaimer-content">
            <div className="lp-disclaimer-header">
              <ShieldAlert size={20} color="#22D3EE" />
              <span className="lp-disclaimer-title">UNE PREMIÈRE LECTURE UTILE</span>
            </div>
            <p className="lp-disclaimer-text">
              Diagnostic indicatif fondé sur vos réponses. Il ne constitue ni un audit, ni une due diligence, ni une décision de financement.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
