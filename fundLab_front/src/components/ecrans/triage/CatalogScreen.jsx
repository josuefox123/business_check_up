import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';

// Google Material Symbols icon names per diagnostic
const MODULE_STYLE_MAP = {
  'PRJ-02': { iconSymbol: 'architecture' },
  'FLH-01': { iconSymbol: 'bolt' },
  'DIF-03': { iconSymbol: 'sos' },
  'OPP-04': { iconSymbol: 'ads_click' },
  'PRO-05': { iconSymbol: 'inventory_2' },
  'COM-06': { iconSymbol: 'filter_alt' },
  'FIN-07': { iconSymbol: 'payments' },
  'GOV-08': { iconSymbol: 'account_tree' },
  '360-09': { iconSymbol: 'explore' },
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
            {modules.map((m, i) => (
              <div key={m.id} className="catalog-module-item">
                <button
                  className="catalog-module-card"
                  onClick={() => onSelect(m)}
                >
                  <span className="material-symbols-outlined catalog-icon">
                    {m.iconSymbol || 'help_outline'}
                  </span>
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
