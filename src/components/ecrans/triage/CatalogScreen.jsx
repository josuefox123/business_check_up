import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';

const MODULE_STYLE_MAP = {
  'PRJ-02': { iconName: 'Rocket', bg: '#EFF6FF', iconColor: '#2659F2' },
  'FLH-01': { iconName: 'Zap', bg: '#ECFDF5', iconColor: '#059669' },
  'DIF-03': { iconName: 'AlertTriangle', bg: '#FEF2F2', iconColor: '#ef4444' },
  'OPP-04': { iconName: 'Target', bg: '#FFFBEB', iconColor: '#f59e0b' },
  'PRO-05': { iconName: 'Lightbulb', bg: '#F0FDF4', iconColor: '#10b981' },
  'COM-06': { iconName: 'Users', bg: '#FFF7ED', iconColor: '#f97316' },
  'FIN-07': { iconName: 'TrendingUp', bg: '#EFF6FF', iconColor: '#2563eb' },
  'GOV-08': { iconName: 'Building2', bg: '#FAF5FF', iconColor: '#8b5cf6' },
  '360-09': { iconName: 'Award', bg: '#F0FDF4', iconColor: '#16a34a' },
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
              <button
                key={m.id}
                className={`catalog-module-card animate-fade-up delay-${Math.min(i, 5) + 1}00`}
                onClick={() => onSelect(m)}
                style={{ borderLeft: `4px solid ${m.iconColor || 'var(--slate-300)'}` }}
              >
                <div className="catalog-module-info">
                  <div className="catalog-module-name">{m.name}</div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                    {m.duration && <div className="catalog-module-dur">{m.duration}</div>}
                    {m.question_count && (
                      <div className="catalog-module-dur" style={{ color: 'var(--slate-400)', fontWeight: 500 }}>
                        {m.question_count} questions
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </ScreenWrapper>
  );
};
