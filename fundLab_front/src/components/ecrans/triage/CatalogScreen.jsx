import React, { useState, useEffect } from 'react';
import { AlertTriangle, HelpCircle } from 'lucide-react';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';

import iconProject from '../../../assets/icon_project.png';
import iconFlash from '../../../assets/icon_flash.png';
import iconDifficulties from '../../../assets/icon_difficulties.png';
import iconOpportunities from '../../../assets/icon_opportunities.png';
import iconProduct from '../../../assets/icon_product.png';
import iconSales from '../../../assets/icon_sales.png';
import iconFinance from '../../../assets/icon_finance.png';
import iconOrganization from '../../../assets/icon_organization.png';
import icon360 from '../../../assets/icon_360.png';

const MODULE_STYLE_MAP = {
  'PRJ-02': { iconImg: iconProject },
  'FLH-01': { iconImg: iconFlash },
  'DIF-03': { iconImg: iconDifficulties },
  'OPP-04': { iconImg: iconOpportunities },
  'PRO-05': { iconImg: iconProduct },
  'COM-06': { iconImg: iconSales },
  'FIN-07': { iconImg: iconFinance },
  'GOV-08': { iconImg: iconOrganization },
  '360-09': { iconImg: icon360 },
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
              duration: m.target_duration_formatted || m.target_duration || '',
              question_count: m.question_count || null,
              description: m.description || null,
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
                  className={`catalog-module-card animate-fade-up delay-${Math.min(i, 5) + 1}00`}
                  onClick={() => onSelect(m)}
                >
                  {m.iconImg ? (
                    <img src={m.iconImg} alt={m.name} className="catalog-icon" />
                  ) : (
                    <HelpCircle size={44} strokeWidth={1.5} className="catalog-icon" />
                  )}
                </button>
                <div className="catalog-module-label animate-fade-up">
                  <div className="catalog-module-name">{m.name}</div>
                  <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {m.duration && <div className="catalog-module-dur">{m.duration}</div>}
                    {m.question_count && (
                      <div className="catalog-module-dur" style={{ color: 'var(--slate-500)', background: 'var(--slate-100)' }}>
                        {m.question_count} Q
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ScreenWrapper>
  );
};
