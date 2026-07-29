import React from 'react';
import { Clock, HelpCircle, CheckSquare, Info, ArrowRight, Pencil, AlertTriangle } from 'lucide-react';
import { Button } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';
import './RouteScreen.css';

export const RouteScreen = ({ routeKey, recommendedModule, reason: reasonProp, onStart, onCatalog, onBack }) => {
  // Rule 9: Normalisation des données et préparation de l'état dérivé au sommet du composant
  const reason = reasonProp || recommendedModule?.reason || {};

  const modName = recommendedModule?.name ?? "[Aucun module recommandé]";
  const modDuration = recommendedModule?.duration ?? "[duration non disponible]";
  const modDescription = reason?.text || recommendedModule?.description || "[description non disponible]";
  const qCount = recommendedModule?.question_count;
  const hasQuestionCount = qCount !== undefined && qCount !== null;

  const riskLevel = reason?.risk_level;
  const isHighRiskOrPriority = riskLevel === 'critical' || riskLevel === 'high' || reason?.priority === 'high' || String(reason?.override_required) === 'true';

  const warningText = isHighRiskOrPriority
    ? (riskLevel === 'critical' ? 'Ce module est critique. Il est fortement recommandé de le compléter immédiatement.' : 'Ce module est prioritaire sur la base de votre profil de risque.')
    : null;

  const cardTitle = `Votre orientation recommandée : ${modName}`;
  const ctaText = 'Démarrer le Diagnostic';

  return (
    <ScreenWrapper>
      {onBack && <TopBackLink onClick={onBack} />}
      <div className="route-recommendation-container animate-fade-up">
        <div className="route-recommendation-card">
          {/* Title & Body */}
          <h1 className="route-main-title">
            {cardTitle}
          </h1>
          <p className="route-main-subtitle">
            {modDescription}
          </p>

          {/* Feature Recommendation Cards */}
          <div className="route-info-cards-list">
            {/* Card 1: Durée Estimée */}
            <div className="route-info-card">
              <div className="route-info-icon-wrap">
                <Clock size={20} />
              </div>
              <div className="route-info-content">
                <span className="route-info-label">DURÉE ESTIMÉE</span>
                <span className="route-info-value">{modDuration}</span>
              </div>
            </div>

            {/* Card 2: Nombre de questions (si disponible) */}
            {hasQuestionCount && (
              <div className="route-info-card">
                <div className="route-info-icon-wrap">
                  <HelpCircle size={20} />
                </div>
                <div className="route-info-content">
                  <span className="route-info-label">NOMBRE DE QUESTIONS</span>
                  <span className="route-info-value">{qCount} questions</span>
                </div>
              </div>
            )}

            {/* Card 3: Vous recevrez */}
            <div className="route-info-card">
              <div className="route-info-icon-wrap">
                <CheckSquare size={20} />
              </div>
              <div className="route-info-content">
                <span className="route-info-label">VOUS RECEVREZ</span>
                <span className="route-info-value-text">
                  Score, forces, fragilités, priorités d’action, orientation
                </span>
              </div>
            </div>

            {/* Card 4: Information Importante */}
            <div className="route-info-card">
              <div className="route-info-icon-wrap">
                <Info size={20} />
              </div>
              <div className="route-info-content">
                <span className="route-info-label">INFORMATION IMPORTANTE</span>
                <span className="route-info-value-text">
                  Vous pouvez répondre avec des estimations.
                </span>
              </div>
            </div>
          </div>

          {/* Optional Warning Alert derived from risk_level / priority */}
          {warningText && (
            <div
              className="alert alert-warning"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'var(--color-warning, #B45309)',
                background: 'var(--color-warning-bg, #FEF3C7)',
                padding: '12px 16px',
                borderRadius: '12px',
                marginBottom: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                textAlign: 'left'
              }}
            >
              <AlertTriangle size={18} style={{ flexShrink: 0 }} />
              <span>{warningText}</span>
            </div>
          )}

          {/* Action Buttons Group */}
          <div className="route-actions-group">
            <Button
              type="button"
              variant="primary"
              full
              size="lg"
              onClick={onStart}
              className="route-btn-primary"
            >
              <span>{ctaText}</span>
              <ArrowRight size={18} />
            </Button>

            <Button
              type="button"
              variant="outline"
              full
              onClick={onCatalog}
              className="route-btn-secondary"
            >
              Voir les autres diagnostics
            </Button>

            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="route-btn-link"
              >
                <Pencil size={15} />
                <span>Modifier mes réponses</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </ScreenWrapper>
  );
};
