import React, { useState, useEffect } from 'react';
import { Lock, AlertOctagon, Check } from 'lucide-react';
import { Button } from '../../ui/index.jsx';
import { TopBackLink, CheckIcon } from '../partage/sharedUI.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';

export const ConsentScreen = ({ initialAnswers = { diag: false, stats: false, contact: false }, onChangeConsent, onContinue, onBack }) => {
  const [checked, setChecked] = useState(initialAnswers);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (initialAnswers) {
      setChecked(initialAnswers);
    }
  }, [initialAnswers]);

  const toggle = (key) => {
    setChecked(prev => {
      const nextChecked = { ...prev, [key]: !prev[key] };
      if (onChangeConsent) {
        onChangeConsent(nextChecked);
      }
      return nextChecked;
    });
    setError(false);
  };

  const handleSubmit = () => {
    if (!checked.diag || !checked.stats) { setError(true); return; }
    onContinue({ ...checked });
  };

  return (
    <ScreenWrapper>
      {onBack && <TopBackLink onClick={onBack} />}
      <div className="consent-wrap animate-fade-up">
        <div className="screen-icon-header" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div className="screen-icon" style={{ background: 'var(--color-blue-light)', color: 'var(--color-blue)', padding: '12px', borderRadius: '50%' }}>
            <Lock size={32} />
          </div>
        </div>
        <h1 className="screen-title" style={{ textAlign: 'center' }}>Avant de commencer</h1>
        <p className="screen-subtitle" style={{ textAlign: 'center', margin: '0 auto 24px', maxWidth: '520px' }}>
          Vos réponses serviront à produire votre diagnostic, à vous orienter et à produire des statistiques
          agrégées pour mieux comprendre les besoins des entrepreneurs.
        </p>

        <div className="consent-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {[
            { key: 'diag', label: "J'accepte l'utilisation de mes réponses pour le diagnostic", optional: false },
            { key: 'stats', label: "J'accepte l'usage agrégé des données", optional: false },
            { key: 'contact', label: "J'accepte d'être recontacté", optional: true },
          ].map(item => (
            <button
              key={item.key}
              className={`consent-item ${checked[item.key] ? 'checked' : ''}`}
              onClick={() => toggle(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--slate-200)',
                background: checked[item.key] ? 'rgba(38,89,242,0.04)' : 'var(--bg-white)',
                borderColor: checked[item.key] ? 'var(--color-blue)' : 'var(--slate-200)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <div
                className="consent-check"
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '6px',
                  border: '2px solid var(--slate-300)',
                  borderColor: checked[item.key] ? 'var(--color-blue)' : 'var(--slate-300)',
                  background: checked[item.key] ? 'var(--color-blue)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  flexShrink: 0
                }}
              >
                {checked[item.key] && <Check size={14} strokeWidth={3} />}
              </div>
              <div className="consent-text" style={{ flex: 1 }}>
                <span className="consent-label" style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                  {item.label}
                </span>
                {item.optional && (
                  <span className="consent-optional" style={{ marginLeft: '8px', fontSize: '0.75rem', color: 'var(--slate-400)', background: 'var(--slate-100)', padding: '2px 8px', borderRadius: '9999px', fontWeight: 'bold' }}>
                    Optionnel
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {error && (
          <div className="consent-error" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-danger)', background: 'var(--color-danger-bg)', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.88rem', fontWeight: 600 }}>
            <AlertOctagon size={16} />
            <span>Vous devez accepter l'utilisation des réponses ET l'usage agrégé pour commencer.</span>
          </div>
        )}

        {/* Boutons d'action simples Retour et Continuer intégrés en bas de page */}
        <div className="screen-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', gap: '12px' }}>
          {onBack && <Button variant="outline" onClick={onBack}>Retour</Button>}
          <Button variant="primary" disabled={!checked.diag || !checked.stats} onClick={handleSubmit}>Continuer</Button>
        </div>
      </div>
    </ScreenWrapper>
  );
};
