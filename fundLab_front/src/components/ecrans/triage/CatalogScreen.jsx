import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';

import iconFinanceStrategy from '../../../assets/icon_finance_strategy.png';
import iconFlashCustom from '../../../assets/icon_flash_custom.png';
import iconProjectCustom from '../../../assets/icon_project_custom.png';
import iconDifficultyCustom from '../../../assets/icon_difficulty_custom.png';
import iconOpportunityCustom from '../../../assets/icon_opportunity_custom.png';
import iconProductCustom from '../../../assets/icon_product_custom.png';
import iconCommercialCustom from '../../../assets/icon_commercial_custom.png';
import iconGovernanceCustom from '../../../assets/icon_governance_custom.png';
import icon360Custom from '../../../assets/icon_360_custom.png';

// Google Material Symbols icon names per diagnostic + optional PNG override
const MODULE_STYLE_MAP = {
  'PRJ-02': { iconImg: iconProjectCustom },
  'FLH-01': { iconImg: iconFlashCustom },
  'DIF-03': { iconImg: iconDifficultyCustom },
  'OPP-04': { iconImg: iconOpportunityCustom },
  'PRO-05': { iconImg: iconProductCustom },
  'COM-06': { iconImg: iconCommercialCustom },
  'FIN-07': { iconImg: iconFinanceStrategy },
  'GOV-08': { iconImg: iconGovernanceCustom },
  '360-09': { iconImg: icon360Custom },
};

export const CatalogScreen = ({ onSelect, onBack, warningSignals }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('../../../api/config.js').then(({ apiFetch }) => {
      apiFetch('/modules')
        .then(res => {
          const list = res?.data?.modules || res?.modules || [];
          if (list.length > 0) {
            setModules(list.filter(m => m.is_available !== false && m.code !== 'TRI-00').map(m => ({
              id: m.code,
              name: m.name,
              ...MODULE_STYLE_MAP[m.code]
            })));
          }
        })
        .catch(() => { })
        .finally(() => setLoading(false));
    });
  }, []);

  return (
    <ScreenWrapper>
      {onBack && <TopBackLink onClick={onBack} />}
      <div className="catalog-wrap animate-fade-up">
        <h1 className="screen-title">Les diagnostics disponibles</h1>
        <p className="screen-subtitle" style={{ marginBottom: 'var(--space-8)' }}>
          Choisissez le module qui correspond le mieux à votre situation actuelle.
        </p>

        {warningSignals && warningSignals.length > 0 && (
          <div className="alert alert-warning" style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} className="text-warning" />
            <span>Vos réponses précédentes signalent des points de vigilance. Si vous avez des difficultés urgentes, le <strong>Diagnostic Difficulté</strong> est recommandé en priorité.</span>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--slate-400)', fontSize: '0.9rem' }}>Chargement des modules…</div>
        ) : (
          <div className="catalog-modules-grid">
            {modules.map((m) => (
              <div key={m.id} className="catalog-module-item">
                <button
                  className="catalog-module-card"
                  onClick={() => onSelect(m)}
                >
                  {m.iconImg ? (
                    <img
                      src={m.iconImg}
                      alt={m.name}
                      className="catalog-icon catalog-icon-png"
                    />
                  ) : (
                    <span className="material-symbols-outlined catalog-icon">
                      {m.iconSymbol || 'help_outline'}
                    </span>
                  )}
                </button>
                <div className="catalog-module-label">
                  <div className="catalog-module-name">{m.name}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ScreenWrapper>
  );
};
