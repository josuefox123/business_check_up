import React, { useState, useEffect } from 'react';
import { Clock, FileText, BarChart2, Lightbulb, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { getModuleThemeClass } from '../../../utils/themeUtils.js';

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

export const IntroModuleScreen = ({ moduleId, moduleData, onStart, onCatalog, onBack }) => {
  const [backendModule, setBackendModule] = useState(null);
  const [loading, setLoading] = useState(
    !moduleData?.question_count && !(moduleData?.duration || moduleData?.target_duration_formatted)
  );

  const targetId = moduleId || moduleData?.id || moduleData?.code;
  const activeIcon = getIconForModule(targetId);
  const themeClass = getModuleThemeClass(targetId);

  useEffect(() => {
    if (moduleData?.name && (moduleData?.duration || moduleData?.target_duration_formatted) && moduleData?.question_count) {
      setBackendModule(moduleData);
      setLoading(false);
      return;
    }
    if (!moduleId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    import('../../../api/config.js').then(({ apiFetch }) => {
      apiFetch(`/modules/${moduleId}`)
        .then(res => {
          const d = res?.data || res;
          if (d?.code) {
            setBackendModule({
              id: d.code,
              name: d.name,
              duration: d.target_duration_formatted || d.target_duration || '',
              description: d.description || '',
              question_count: d.question_count || null,
            });
          }
        })
        .catch(() => { })
        .finally(() => setLoading(false));
    });
  }, [moduleId, moduleData]);

  // ─── Normalisation des données (Rule 9) ───────────────────────────────────
  const title = backendModule?.name || moduleData?.name || moduleId || 'Diagnostic stratégique';
  const rawDuration = backendModule?.duration || moduleData?.duration || '';

  let durationDisplay = '8 - 12 min';
  if (rawDuration) {
    durationDisplay = String(rawDuration).toLowerCase().includes('min')
      ? String(rawDuration)
      : `${rawDuration} min`;
  }

  const qCount = backendModule?.question_count || moduleData?.question_count || null;
  const moduleCode = targetId ? String(targetId).toUpperCase() : null;

  return (
    <ScreenWrapper className={themeClass} style={{ background: '#F8FAFC', minHeight: '100vh', fontFamily: 'Lato, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <style>{`
        .intro-container {
          width: 100%;
          max-width: 440px;
          margin: 6px auto 24px auto;
          padding: 0 12px;
          box-sizing: border-box;
        }

        .intro-back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: #64748B;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          padding: 2px 2px 10px 2px;
          transition: color 0.15s ease;
          font-family: inherit;
        }

        .intro-back-link:hover {
          color: #17212D;
        }

        .intro-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-left: 3px solid #34BED5;
          border-radius: 6px;
          box-shadow: 0 8px 24px rgba(23, 33, 45, 0.05);
          padding: 20px 18px;
          box-sizing: border-box;
          text-align: left;
        }

        @media (min-width: 640px) {
          .intro-card {
            padding: 28px 24px;
          }
        }

        .intro-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .intro-icon-badge {
          width: 44px;
          height: 44px;
          border-radius: 6px;
          background: #17212D;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(23, 33, 45, 0.15);
        }

        .intro-icon-img {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }

        .intro-tag {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: #34BED5;
          text-transform: uppercase;
          margin-bottom: 2px;
        }

        .intro-title {
          font-size: 1.25rem;
          font-weight: 900;
          color: #17212D;
          letter-spacing: -0.02em;
          line-height: 1.25;
          margin: 0;
        }

        /* Ruban de métriques sobre et unifié, sans retour à la ligne */
        .intro-ribbon {
          display: flex;
          align-items: center;
          justify-content: space-around;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 6px;
          padding: 10px 12px;
          margin-bottom: 16px;
        }

        .intro-ribbon-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          flex: 1;
        }

        .intro-ribbon-divider {
          width: 1px;
          height: 26px;
          background: #E2E8F0;
          margin: 0 8px;
        }

        .intro-ribbon-label {
          font-size: 0.64rem;
          font-weight: 800;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 2px;
          white-space: nowrap;
        }

        .intro-ribbon-value {
          font-size: 0.92rem;
          font-weight: 900;
          color: #17212D;
          white-space: nowrap;
        }

        /* Section des livrables */
        .intro-deliverables-title {
          font-size: 0.68rem;
          font-weight: 800;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 10px;
        }

        .intro-deliverables-list {
          list-style: none;
          padding: 0;
          margin: 0 0 16px 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .intro-deliverable-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.82rem;
          color: #334155;
          line-height: 1.35;
        }

        .intro-check-dot {
          width: 17px;
          height: 17px;
          border-radius: 4px;
          background: #E0F7FA;
          color: #0F7F90;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* Note méthodologique légère */
        .intro-advisory-note {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.76rem;
          color: #64748B;
          line-height: 1.4;
          padding: 8px 10px;
          background: #F1F5F9;
          border-radius: 6px;
          margin-bottom: 18px;
        }

        /* Boutons d'action */
        .intro-btn-start {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          width: 100%;
          background: #17212D;
          color: #FFFFFF;
          border: none;
          border-radius: 6px;
          padding: 10px 16px;
          font-size: 0.86rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.15s ease;
          box-sizing: border-box;
          letter-spacing: 0.01em;
          white-space: nowrap;
          box-shadow: 0 3px 10px rgba(23, 33, 45, 0.12);
        }

        .intro-btn-start:hover {
          background: #0F172A;
          transform: translateY(-1px);
          box-shadow: 0 5px 14px rgba(23, 33, 45, 0.2);
        }

        .intro-btn-secondary {
          display: block;
          width: 100%;
          background: transparent;
          color: #64748B;
          border: none;
          font-size: 0.78rem;
          font-weight: 700;
          margin-top: 8px;
          padding: 6px 10px;
          cursor: pointer;
          text-align: center;
          transition: color 0.15s ease;
        }

        .intro-btn-secondary:hover {
          color: #17212D;
          text-decoration: underline;
        }
      `}</style>

      <div className="intro-container animate-fade-up">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="intro-back-link"
          >
            <ArrowLeft size={14} />
            <span>Retour</span>
          </button>
        )}

        <div className="intro-card">

          {/* En-tête : Badge Bleu Crépuscule faisant ressortir l'icône + Code & Titre */}
          <div className="intro-header">
            <div className="intro-icon-badge">
              <img
                src={activeIcon}
                alt={title}
                className="intro-icon-img"
              />
            </div>
            <div>
              <div className="intro-tag">
                {moduleCode ? `Module · ${moduleCode}` : 'Module'}
              </div>
              <h1 className="intro-title">
                {title}
              </h1>
            </div>
          </div>

          {/* Ruban unifié de métriques (Durée & Questions) sans retour à la ligne */}
          <div className="intro-ribbon">
            <div className="intro-ribbon-item">
              <div className="intro-ribbon-label">
                <Clock size={12} color="#34BED5" />
                <span>Durée estimée</span>
              </div>
              <div className="intro-ribbon-value">
                {loading ? '...' : durationDisplay}
              </div>
            </div>

            <div className="intro-ribbon-divider" />

            <div className="intro-ribbon-item">
              <div className="intro-ribbon-label">
                <FileText size={12} color="#34BED5" />
                <span>Questionnaire</span>
              </div>
              <div className="intro-ribbon-value">
                {loading ? '...' : `${qCount || '14'} questions`}
              </div>
            </div>
          </div>

          {/* Livrables stratégiques sous forme de liste fluide */}
          <div className="intro-deliverables-title">
            À l'issue de ce module, vous recevrez
          </div>
          <ul className="intro-deliverables-list">
            <li className="intro-deliverable-item">
              <div className="intro-check-dot">
                <Check size={11} strokeWidth={3} />
              </div>
              <span><strong>Score de maturité</strong> et cartographie des forces &amp; fragilités.</span>
            </li>
            <li className="intro-deliverable-item">
              <div className="intro-check-dot">
                <Check size={11} strokeWidth={3} />
              </div>
              <span><strong>Plan d’action priorisé</strong> avec leviers de performance actionnables.</span>
            </li>
            <li className="intro-deliverable-item">
              <div className="intro-check-dot">
                <Check size={11} strokeWidth={3} />
              </div>
              <span><strong>Recommandations stratégiques</strong> adaptées à votre profil PME.</span>
            </li>
          </ul>

          {/* Conseil méthodologique discret et rassurant */}
          <div className="intro-advisory-note">
            <Lightbulb size={16} color="#0F7F90" style={{ flexShrink: 0 }} />
            <span>Répondez simplement avec vos estimations actuelles, sans document préalable requis.</span>
          </div>

          {/* Boutons d'action statutaires */}
          <div>
            <button
              type="button"
              className="intro-btn-start"
              onClick={onStart}
            >
              <span>Commencer le diagnostic</span>
              <ArrowRight size={15} />
            </button>

            {onCatalog && (
              <button
                type="button"
                className="intro-btn-secondary"
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
