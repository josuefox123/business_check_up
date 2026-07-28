import React from 'react';
import { Target, ArrowRight } from 'lucide-react';
import { Button } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';

const normalizeToArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      } catch (e) {}
    }
    return value.split(/[\n;|]+/).map(item => item.trim()).filter(Boolean);
  }
  return [];
};

export const PrioritesActionScreen = ({ score, onContinue, onBack, restitution }) => {
  // Rule 9: Data Normalization at component start
  const restData = restitution?.restitution || restitution || {};
  const scoring = restitution?.scoring || {};

  const rawPriorities = restData?.priority_actions || restData?.priorities || scoring?.priorities;
  const normalizedPriorities = normalizeToArray(rawPriorities);

  const prioritiesList = normalizedPriorities.map((item, i) => {
    if (typeof item === 'object' && item !== null) return item;
    const defaultLabels = ['Action immédiate', 'Stabilisation à 30 jours', 'Plan de relance', 'Structuration', 'Capitalisation', 'Croissance'];
    return {
      label: defaultLabels[i] || `Action recommandée #${i + 1}`,
      text: item
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
          {prioritiesList.length > 0 ? (
            prioritiesList.map((p, i) => (
              <div key={i} className={`priority-item ${i === 0 && score < 40 ? 'danger' : i === 0 && score < 70 ? 'warning' : ''}`} style={{ display: 'flex', gap: '16px', padding: '18px', border: '1px solid var(--slate-200)', borderRadius: '16px', background: 'var(--bg-white)' }}>
                <div className="priority-icon" style={{ color: 'var(--color-blue)', background: 'var(--color-blue-light)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Target size={22} />
                </div>
                <div className="priority-content">
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 850, color: 'var(--slate-800)', marginBottom: '4px' }}>Priorité {i + 1} : {p.label}</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', lineHeight: '1.5', margin: 0 }}>{p.text}</p>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '20px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', fontStyle: 'italic', color: '#94A3B8', fontSize: '0.88rem' }}>
              [priority_actions / priorities non disponible]
            </div>
          )}
        </div>
      </div>

      <div className="screen-nav" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
        <Button variant="primary" onClick={onContinue} style={{ gap: '8px' }}>
          <span>Continuer</span>
          <ArrowRight size={16} />
        </Button>
      </div>
    </ScreenWrapper>
  );
};
