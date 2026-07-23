import React from 'react';
import { Target } from 'lucide-react';
import { Button } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';

export const PrioritesActionScreen = ({ score, onContinue, onBack, restitution }) => {
  const backendPriorities = restitution?.priority_actions || restitution?.priorities || [];

  const priorities = backendPriorities.map((text, i) => {
    if (typeof text === 'object') return text;
    const labels = ['Action immédiate', 'Stabilisation à 30 jours', 'Plan de relance', 'Structuration', 'Capitalisation', 'Croissance'];
    return {
      label: labels[i] || 'Action recommandée',
      text: text
    };
  });

  return (
    <ScreenWrapper>
      {onBack && <TopBackLink onClick={onBack} />}
      <div className="animate-fade-up">
        <div className="screen-header" style={{ marginBottom: '24px' }}>
          <h1 className="screen-title">Vos priorités d'action</h1>
          <p className="screen-desc">Ces actions sont personnalisées en fonction de votre score et de vos réponses.</p>
        </div>

        <div className="priority-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {priorities.map((p, i) => (
            <div key={i} className={`priority-item ${i === 0 && score < 40 ? 'danger' : i === 0 && score < 70 ? 'warning' : ''}`} style={{ display: 'flex', gap: '16px', padding: '18px', border: '1px solid var(--slate-200)', borderRadius: '16px', background: 'var(--bg-white)' }}>
              <div className="priority-icon" style={{ color: 'var(--color-blue)', background: 'var(--color-blue-light)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Target size={22} />
              </div>
              <div className="priority-content">
                <h4 style={{ fontSize: '0.95rem', fontWeight: 850, color: 'var(--slate-800)', marginBottom: '4px' }}>Priorité {i + 1} : {p.label}</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', lineHeight: '1.5' }}>{p.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="screen-nav" style={{ justifyContent: 'flex-end', marginTop: '32px' }}>
          <Button variant="primary" onClick={onContinue}>Continuer →</Button>
        </div>
      </div>
    </ScreenWrapper>
  );
};
