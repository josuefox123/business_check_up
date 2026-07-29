import React, { useState, useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';
import { apiFetch } from '../../../api/config.js';

import iconFinanceStrategy from '../../../assets/icone diagnostique/icon_strategy.png';
import iconFlashCustom from '../../../assets/icone diagnostique/icon_flash.png';
import iconProjectCustom from '../../../assets/icone diagnostique/icon_project.png';
import iconDifficultyCustom from '../../../assets/icone diagnostique/icon_difficulty.png';
import iconOpportunityCustom from '../../../assets/icone diagnostique/icon_opportunity.png';
import iconProductCustom from '../../../assets/icone diagnostique/icon_product_offer.png';
import iconGovernanceCustom from '../../../assets/icone diagnostique/icon_organisation.png';
import iconCommercialCustom from '../../../assets/icone diagnostique/icon_commercial.png';
import icon360Custom from '../../../assets/icone diagnostique/icon_360.png';

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
  const [errorMsg, setErrorMsg] = useState('');

  const fetchModules = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await apiFetch('/modules');
      const list = res?.data?.modules || res?.modules || [];
      if (list.length > 0) {
        setModules(list.filter(m => m.is_available !== false && m.code !== 'TRI-00').map(m => ({
          id: m.code,
          name: m.name || m.module_name || '[module_name non disponible]',
          ...MODULE_STYLE_MAP[m.code]
        })));
      }
    } catch (err) {
      console.error('Catalog modules fetch error:', err);
      setErrorMsg(err?.message || '[fetch_modules_error] Impossible de charger les diagnostics. Veuillez ré-essayer.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  // Rule 9: Data Normalization at component start
  const hasWarningSignals = warningSignals && warningSignals.length > 0;
  const hasModules = !loading && !errorMsg && modules.length > 0;
  const showEmptyState = !loading && !errorMsg && modules.length === 0;

  return (
    <ScreenWrapper>
      {onBack && <TopBackLink onClick={onBack} />}
      <div className="catalog-wrap animate-fade-up">
        <h1 className="screen-title">Les diagnostics disponibles</h1>
        <p className="screen-subtitle" style={{ marginBottom: 'var(--space-8)' }}>
          Choisissez le module qui correspond le mieux à votre situation actuelle.
        </p>

        {hasWarningSignals && (
          <div className="alert alert-warning" style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} className="text-warning" />
            <span>Vos réponses précédentes signalent des points de vigilance. Si vous avez des difficultés urgentes, le <strong>Diagnostic Difficulté</strong> est recommandé en priorité.</span>
          </div>
        )}

        {/* Error state with localized retry */}
        {errorMsg && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{errorMsg}</span>
            <Button variant="outline" size="sm" onClick={fetchModules} style={{ gap: '6px' }}>
              <RotateCcw size={14} />
              <span>Réessayer</span>
            </Button>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--slate-400)', fontSize: '0.9rem' }}>Chargement des modules…</div>
        ) : (
          <>
            {hasModules && (
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

            {showEmptyState && (
              <div style={{ padding: '30px', textAlign: 'center', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', color: '#94A3B8', fontSize: '0.9rem' }}>
                [modules non disponibles] Aucun module disponible pour le moment.
              </div>
            )}
          </>
        )}
      </div>
    </ScreenWrapper>
  );
};
