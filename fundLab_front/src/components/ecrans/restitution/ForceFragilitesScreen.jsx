import React from 'react';
import { CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
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

export const ForceFragilitesScreen = ({ score, moduleId, answers, onContinue, onBack, restitution }) => {
  const restData = restitution?.restitution || restitution || {};
  const scoring = restitution?.scoring || {};

  const forces = normalizeToArray(restData?.typical_strengths || restData?.strengths || scoring?.dominant_strength);
  const fragilites = normalizeToArray(restData?.typical_fragilities || restData?.weaknesses || scoring?.dominant_weakness);
  const priorityText = restData?.summary || restData?.interpretation_text || scoring?.priorities;

  return (
    <ScreenWrapper>
      {onBack && <TopBackLink onClick={onBack} />}
      <div className="result-wrap animate-fade-up">
        <h1 className="screen-title">Vos forces &amp; fragilités</h1>

        <div className="ff-grid">
          {/* Forces / Points d'appui */}
          <div className="ff-card" style={{ padding: '20px', border: '1px solid var(--slate-200)', borderRadius: '16px', background: 'var(--bg-white)' }}>
            <div className="ff-card-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: 'var(--color-primary)', fontSize: '1rem', marginBottom: '14px' }}>
              <CheckCircle size={18} className="text-success" style={{ color: 'var(--color-success)' }} />
              Vos points d'appui
            </div>
            <ul className="ff-items" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, margin: 0 }}>
              {forces.length > 0 ? (
                forces.map((f, i) => (
                  <li key={i} className="ff-item" style={{ fontSize: '0.88rem', color: 'var(--slate-600)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span className="ff-item-dot green" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)', marginTop: '6px', flexShrink: 0 }} />
                    <span>{f}</span>
                  </li>
                ))
              ) : (
                <li style={{ fontSize: '0.85rem', color: '#94A3B8', fontStyle: 'italic' }}>
                  [typical_strengths / strengths non disponible]
                </li>
              )}
            </ul>
          </div>

          {/* Fragilités / Points de vigilance */}
          <div className="ff-card" style={{ padding: '20px', border: '1px solid var(--slate-200)', borderRadius: '16px', background: 'var(--bg-white)' }}>
            <div className="ff-card-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: 'var(--color-primary)', fontSize: '1rem', marginBottom: '14px' }}>
              <AlertTriangle size={18} className="text-warning" style={{ color: 'var(--color-warning)' }} />
              Points de vigilance
            </div>
            <ul className="ff-items" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', padding: 0, margin: 0 }}>
              {fragilites.length > 0 ? (
                fragilites.map((f, i) => (
                  <li key={i} className="ff-item" style={{ fontSize: '0.88rem', color: 'var(--slate-600)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span className="ff-item-dot orange" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-warning)', marginTop: '6px', flexShrink: 0 }} />
                    <span>{f}</span>
                  </li>
                ))
              ) : (
                <li style={{ fontSize: '0.85rem', color: '#94A3B8', fontStyle: 'italic' }}>
                  [typical_fragilities / weaknesses non disponible]
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Synthèse prioritaire */}
        <div className="ff-priority" style={{ padding: '16px', background: 'var(--slate-50)', borderRadius: '12px', border: '1px solid var(--slate-200)', marginBottom: '24px', marginTop: '24px' }}>
          <div className="ff-priority-label" style={{ fontWeight: 800, color: 'var(--slate-800)', fontSize: '0.88rem', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Point prioritaire</div>
          <p className="ff-priority-text" style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: '1.5', margin: 0 }}>
            {priorityText || '[summary / interpretation_text non disponible]'}
          </p>
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
