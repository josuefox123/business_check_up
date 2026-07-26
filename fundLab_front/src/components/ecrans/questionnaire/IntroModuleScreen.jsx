import React, { useState, useEffect } from 'react';
import { FileText, BarChart2, Lightbulb } from 'lucide-react';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';
import { getModuleThemeClass } from '../../../utils/themeUtils.js';

import iconFinanceStrategy from '../../../assets/icone diagnostique/Icon_strategy,-strategics,-finance-strategy,-chess,-horse.png';
import iconFlashCustom from '../../../assets/icone diagnostique/flash.png';
import iconProjectCustom from '../../../assets/icone diagnostique/PROJET.png';
import iconDifficultyCustom from '../../../assets/icone diagnostique/difficulté.png';
import iconOpportunityCustom from '../../../assets/icone diagnostique/OPPORTUNITé.png';
import iconProductCustom from '../../../assets/icone diagnostique/OFFRE PRODUIT.png';
import iconCommercialCustom from '../../../assets/icone diagnostique/COMMERCIAL.png';
import iconGovernanceCustom from '../../../assets/icone diagnostique/organisation.png';
import icon360Custom from '../../../assets/icone diagnostique/360.png';

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
    '360': icon360Custom
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
              question_count: d.question_count || null
            });
          }
        })
        .catch(() => { })
        .finally(() => setLoading(false));
    });
  }, [moduleId, moduleData]);

  const title = backendModule?.name || moduleData?.name || moduleId || 'Diagnostic';
  const rawDuration = backendModule?.duration || moduleData?.duration || '';
  
  // Séparer la partie numérique et l'unité si présent (ex: "8 - 12 min")
  let durationNumber = '';
  let durationUnit = '';
  if (rawDuration) {
    const durationParts = String(rawDuration).split(/min/i);
    durationNumber = durationParts[0]?.trim() || rawDuration;
    durationUnit = durationParts.length > 1 ? 'MIN' : '';
  }
  const qCount = backendModule?.question_count || moduleData?.question_count || null;

  return (
    <ScreenWrapper className={themeClass} style={{ background: '#F4F9FB', minHeight: '100vh' }}>
      {onBack && <TopBackLink onClick={onBack} />}
      
      <style>{`
        .intro-card-container {
          max-width: 480px;
          margin: 20px auto 40px auto;
          background: #ffffff;
          border-radius: 32px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 15px 40px rgba(15, 23, 42, 0.04);
          padding: 36px 24px;
          text-align: center;
          box-sizing: border-box;
        }

        .intro-badge-outer {
          width: 96px;
          height: 96px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px auto;
          background: var(--color-accent-light, rgba(52, 190, 213, 0.15));
          border: 2px solid var(--color-blue-ring, rgba(52, 190, 213, 0.35));
        }

        .intro-badge-inner {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #ffffff;
          box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .intro-badge-img {
          width: 44px;
          height: 44px;
          object-fit: contain;
          filter: brightness(0);
        }

        .intro-duration-block {
          margin: 20px 0 24px 0;
          min-height: 64px;
        }

        .intro-duration-val {
          font-size: 2.8rem;
          font-weight: 800;
          color: #17212D;
          line-height: 1;
          letter-spacing: -0.03em;
        }

        .intro-duration-unit {
          font-size: 1.2rem;
          font-weight: 800;
          margin-left: 6px;
          color: var(--color-accent, #34BED5);
        }

        .intro-duration-sub {
          font-size: 0.88rem;
          color: #94A3B8;
          font-weight: 500;
          margin-top: 4px;
        }

        .intro-skeleton-bar {
          background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
          background-size: 200% 100%;
          animation: introSkeletonShimmer 1.5s infinite ease-in-out;
        }

        @keyframes introSkeletonShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .intro-pills-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .intro-pill-questions {
          background: var(--color-accent-light, rgba(52, 190, 213, 0.15));
          color: var(--color-accent-dark, var(--color-accent, #0F7F90));
          border-radius: 24px;
          padding: 12px 20px;
          font-size: 0.92rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .intro-pill-scope {
          background: #F8FAFC;
          color: #475569;
          border: 1px solid #F1F5F9;
          border-radius: 24px;
          padding: 12px 20px;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .intro-hint-alert {
          background: #F0FCFF;
          border: 1px solid #CFF4FC;
          border-radius: 20px;
          padding: 14px 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #08596B;
          font-size: 0.9rem;
          font-weight: 500;
          margin-bottom: 28px;
        }

        .intro-btn-primary {
          background: #17212D;
          color: #ffffff;
          border: none;
          border-radius: 28px;
          padding: 16px 24px;
          width: 100%;
          font-size: 1.05rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 10px 25px rgba(23, 33, 45, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .intro-btn-primary:hover {
          background: #0F172A;
          transform: translateY(-1px);
          box-shadow: 0 14px 30px rgba(23, 33, 45, 0.28);
        }

        .intro-btn-secondary {
          background: transparent;
          color: #64748B;
          border: none;
          font-size: 0.92rem;
          font-weight: 600;
          margin-top: 16px;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .intro-btn-secondary:hover {
          color: #17212D;
          text-decoration: underline;
        }
      `}</style>

      <div className="intro-card-container animate-fade-up">
        {/* Concentric badge with CSS theme variables */}
        <div className="intro-badge-outer">
          <div className="intro-badge-inner">
            <img 
              src={activeIcon} 
              alt={title} 
              className="intro-badge-img"
            />
          </div>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#17212D', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
          {title}
        </h1>

        {/* Duration Unit directly as sent by backend with Skeleton Shimmer while loading */}
        <div className="intro-duration-block">
          {loading ? (
            <div style={{ padding: '8px 0' }}>
              <div className="intro-skeleton-bar" style={{ width: '130px', height: '38px', margin: '0 auto 6px auto', borderRadius: '10px' }}></div>
              <div className="intro-skeleton-bar" style={{ width: '85px', height: '14px', margin: '0 auto', borderRadius: '6px' }}></div>
            </div>
          ) : (
            <div>
              <div>
                <span className="intro-duration-val">{durationNumber || '8 - 12'}</span>
                <span className="intro-duration-unit">{durationUnit || 'MIN'}</span>
              </div>
              <div className="intro-duration-sub">Durée estimée</div>
            </div>
          )}
        </div>

        {/* Meta Chips Stack */}
        <div className="intro-pills-stack">
          {loading ? (
            <div className="intro-skeleton-bar" style={{ width: '140px', height: '38px', margin: '0 auto', borderRadius: '24px' }}></div>
          ) : (
            qCount && (
              <div className="intro-pill-questions animate-fade-up">
                <FileText size={16} />
                <span>{qCount} questions</span>
              </div>
            )
          )}

          <div className="intro-pill-scope">
            <BarChart2 size={15} style={{ color: 'var(--color-accent-dark, #17212D)' }} />
            <span>SCORE + FORCES + FRAGILITÉS + PRIORITÉS</span>
          </div>
        </div>

        {/* Lightbulb Hint Alert */}
        <div className="intro-hint-alert">
          <Lightbulb size={18} style={{ color: 'var(--color-accent-dark, #08596B)', flexShrink: 0 }} />
          <span>Répondez le plus simplement possible.</span>
        </div>

        {/* Action Buttons */}
        <div>
          <button className="intro-btn-primary" onClick={onStart}>
            <span>Commencer le diagnostic</span>
            <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>→</span>
          </button>
          
          {onCatalog && (
            <div>
              <button className="intro-btn-secondary" onClick={onCatalog}>
                Voir les autres diagnostics
              </button>
            </div>
          )}
        </div>
      </div>
    </ScreenWrapper>
  );
};
