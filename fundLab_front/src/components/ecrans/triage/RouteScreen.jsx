import React from 'react';
import { Clock, FileText, Check, Lightbulb, ArrowRight, ArrowLeft, AlertTriangle } from 'lucide-react';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import './RouteScreen.css';

import iconFinanceStrategy from '../../../assets/icone diagnostique/icon_strategy.png';
import iconFlashCustom from '../../../assets/icone diagnostique/icon_flash.png';
import iconProjectCustom from '../../../assets/icone diagnostique/icon_project.png';
import iconDifficultyCustom from '../../../assets/icone diagnostique/icon_difficulty.png';
import iconOpportunityCustom from '../../../assets/icone diagnostique/icon_opportunity.png';
import iconProductCustom from '../../../assets/icone diagnostique/icon_product_offer.png';
import iconCommercialCustom from '../../../assets/icone diagnostique/icon_commercial.png';
import iconGovernanceCustom from '../../../assets/icone diagnostique/icon_organisation.png';
import icon360Custom from '../../../assets/icone diagnostique/icon_360.png';

const MODULE_STYLE_MAP = {
  'PRJ-02': iconProjectCustom,
  'FLH-01': iconFlashCustom,
  'DIF-03': iconDifficultyCustom,
  'OPP-04': iconOpportunityCustom,
  'PRO-05': iconProductCustom,
  'COM-06': iconCommercialCustom,
  'FIN-07': iconFinanceStrategy,
  'GOV-08': iconGovernanceCustom,
  '360-09': icon360Custom,
};

const getIconForModule = (modId) => {
  if (!modId) return icon360Custom;
  const clean = String(modId).trim().toUpperCase();
  if (MODULE_STYLE_MAP[clean]) return MODULE_STYLE_MAP[clean];
  const prefix = clean.split('-')[0];
  const prefixMap = {
    'PRJ': iconProjectCustom,
    'FLH': iconFlashCustom,
    'DIF': iconDifficultyCustom,
    'OPP': iconOpportunityCustom,
    'PRO': iconProductCustom,
    'COM': iconCommercialCustom,
    'FIN': iconFinanceStrategy,
    'GOV': iconGovernanceCustom,
    '360': icon360Custom,
  };
  return prefixMap[prefix] || icon360Custom;
};

export const RouteScreen = ({ routeKey, recommendedModule, reason: reasonProp, onStart, onCatalog, onBack }) => {
  // ─── Normalisation des données (Rule 9) ───────────────────────────────────
  const reason = reasonProp || recommendedModule?.reason || {};
  const targetId = routeKey || recommendedModule?.code || recommendedModule?.id;
  const moduleCode = targetId ? String(targetId).toUpperCase() : null;
  const activeIcon = getIconForModule(targetId);

  const modName = recommendedModule?.name ?? "[Aucun module recommandé]";
  const rawDuration = recommendedModule?.duration ?? '';
  let durationDisplay = '8 - 12 min';
  if (rawDuration) {
    durationDisplay = String(rawDuration).toLowerCase().includes('min')
      ? String(rawDuration)
      : `${rawDuration} min`;
  }

  const modDescription = reason?.text || recommendedModule?.description || "Ce module correspond à l'analyse stratégique prioritaire de votre profil d'entreprise.";
  const qCount = recommendedModule?.question_count;

  const riskLevel = reason?.risk_level;
  const isHighRiskOrPriority = riskLevel === 'critical' || riskLevel === 'high' || reason?.priority === 'high' || String(reason?.override_required) === 'true';

  const warningText = isHighRiskOrPriority
    ? (riskLevel === 'critical' ? 'Ce module est critique. Il est fortement recommandé de le compléter en priorité.' : 'Ce module est prioritaire sur la base de votre profil de risque.')
    : null;

  return (
    <ScreenWrapper style={{ background: '#F8FAFC', minHeight: '100vh', fontFamily: 'Lato, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div className="route-recommendation-container animate-fade-up">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="route-back-link"
          >
            <ArrowLeft size={14} />
            <span>Modifier mes réponses</span>
          </button>
        )}

        <div className="route-card">
          {/* En-tête : Badge Bleu Crépuscule + Code & Titre */}
          <div className="route-header">
            <div className="route-icon-badge">
              <img
                src={activeIcon}
                alt={modName}
                className="route-icon-img"
              />
            </div>
            <div>
              <div className="route-tag">
                {moduleCode ? `Orientation recommandée · ${moduleCode}` : 'Orientation recommandée'}
              </div>
              <h1 className="route-title">
                {modName}
              </h1>
            </div>
          </div>

          {/* Motif / Description de la recommandation */}
          {modDescription && (
            <p className="route-description">
              {modDescription}
            </p>
          )}

          {/* Ruban unifié de métriques (Durée & Questions) sans retour à la ligne */}
          <div className="route-ribbon">
            <div className="route-ribbon-item">
              <div className="route-ribbon-label">
                <Clock size={12} color="#34BED5" />
                <span>Durée estimée</span>
              </div>
              <div className="route-ribbon-value">
                {durationDisplay}
              </div>
            </div>

            <div className="route-ribbon-divider" />

            <div className="route-ribbon-item">
              <div className="route-ribbon-label">
                <FileText size={12} color="#34BED5" />
                <span>Questionnaire</span>
              </div>
              <div className="route-ribbon-value">
                {qCount ? `${qCount} questions` : 'Diagnostic complet'}
              </div>
            </div>
          </div>

          {/* Alerte si vigilance ou risque élevé */}
          {warningText && (
            <div className="route-warning-box">
              <AlertTriangle size={15} color="#D97706" style={{ flexShrink: 0 }} />
              <span>{warningText}</span>
            </div>
          )}

          {/* Livrables stratégiques sous forme de liste fluide */}
          <div className="route-deliverables-title">
            À l'issue de ce module, vous recevrez
          </div>
          <ul className="route-deliverables-list">
            <li className="route-deliverable-item">
              <div className="route-check-dot">
                <Check size={11} strokeWidth={3} />
              </div>
              <span><strong>Score de maturité</strong> et cartographie des forces &amp; fragilités.</span>
            </li>
            <li className="route-deliverable-item">
              <div className="route-check-dot">
                <Check size={11} strokeWidth={3} />
              </div>
              <span><strong>Plan d’action priorisé</strong> avec leviers de performance actionnables.</span>
            </li>
            <li className="route-deliverable-item">
              <div className="route-check-dot">
                <Check size={11} strokeWidth={3} />
              </div>
              <span><strong>Recommandations stratégiques</strong> adaptées à votre profil PME.</span>
            </li>
          </ul>

          {/* Conseil méthodologique discret et rassurant */}
          <div className="route-advisory-note">
            <Lightbulb size={16} color="#0F7F90" style={{ flexShrink: 0 }} />
            <span>Vous pouvez répondre avec vos estimations actuelles, sans document préalable requis.</span>
          </div>

          {/* Boutons d'action statutaires */}
          <div>
            <button
              type="button"
              className="route-btn-start"
              onClick={onStart}
            >
              <span>Commencer le diagnostic</span>
              <ArrowRight size={15} />
            </button>

            {onCatalog && (
              <button
                type="button"
                className="route-btn-secondary"
                onClick={onCatalog}
              >
                Voir les autres diagnostics
              </button>
            )}
          </div>
        </div>
      </div>
    </ScreenWrapper>
  );
};
