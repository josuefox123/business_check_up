import React from 'react';
import { Button } from '../ui/Button';
import { AlertCircle, CheckCircle, TrendingUp, RefreshCw } from 'lucide-react';
import './Report.css';

export const Report = ({ answers, onRestart }) => {
  // Un calcul simple du score pour simuler le résultat
  const calculateScore = () => {
    let score = 50; // Base
    
    // Si la trésorerie est "Plus de 6 mois" (c4 pour s04)
    if (answers['s04'] === 'c4') score += 20;
    // Si la trésorerie est "Moins d'un mois" (c1 pour s04)
    if (answers['s04'] === 'c1') score -= 20;
    
    // Rentable (c1 pour s05)
    if (answers['s05'] === 'c1') score += 20;
    
    return Math.min(100, Math.max(0, score));
  };

  const score = calculateScore();
  
  const getScoreColor = () => {
    if (score >= 70) return 'var(--color-success)';
    if (score >= 40) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  const isTrésorerieCritique = answers['s04'] === 'c1' || answers['s04'] === 'c2';

  return (
    <div className="report-container animate-fade-in">
      <header className="report-header">
        <div className="logo-placeholder">
          <div className="logo-icon">F</div>
          <span className="logo-text">FUND.lab</span>
        </div>
      </header>

      <main className="report-main">
        <div className="report-hero">
          <div className="score-circle-container">
            <svg viewBox="0 0 100 100" className="score-svg">
              <circle cx="50" cy="50" r="45" className="score-track" />
              <circle 
                cx="50" cy="50" r="45" 
                className="score-fill" 
                strokeDasharray={`${score * 2.83} 283`}
                style={{ stroke: getScoreColor() }}
              />
            </svg>
            <div className="score-content">
              <span className="score-value">{score}</span>
              <span className="score-label">/100</span>
            </div>
          </div>
          <div className="report-hero-text">
            <h2>Votre rapport de diagnostic</h2>
            <p>Voici l'analyse personnalisée de votre situation basée sur vos réponses.</p>
          </div>
        </div>

        <div className="report-dashboard">
          <div className="dashboard-column">
            <h3>Points d'attention</h3>
            {isTrésorerieCritique ? (
              <div className="alert-card danger">
                <AlertCircle className="alert-icon" />
                <div>
                  <h4>Alerte Trésorerie</h4>
                  <p>Moins de 3 mois de réserve de trésorerie. Priorité : Sécuriser des fonds ou réduire les dépenses rapidement.</p>
                </div>
              </div>
            ) : (
              <div className="alert-card success">
                <CheckCircle className="alert-icon" />
                <div>
                  <h4>Trésorerie Saine</h4>
                  <p>Votre réserve de trésorerie actuelle vous permet d'exécuter sereinement votre plan d'action.</p>
                </div>
              </div>
            )}
          </div>

          <div className="dashboard-column">
            <h3>Recommandations</h3>
            <div className="recommendation-list">
              <div className="recommendation-item">
                <div className="rec-icon"><TrendingUp size={20} /></div>
                <div>
                  <h4>Optimisation du modèle</h4>
                  <p>Analysez vos coûts d'acquisition pour maximiser la rentabilité.</p>
                </div>
              </div>
              <div className="recommendation-item">
                <div className="rec-icon"><RefreshCw size={20} /></div>
                <div>
                  <h4>Structuration</h4>
                  <p>Préparez vos indicateurs clés si vous envisagez de rencontrer des investisseurs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="report-actions">
          <Button variant="primary" onClick={() => window.print()}>
            Télécharger le rapport (PDF)
          </Button>
          <Button variant="outline" onClick={onRestart}>
            Refaire le diagnostic
          </Button>
        </div>
      </main>
    </div>
  );
};
