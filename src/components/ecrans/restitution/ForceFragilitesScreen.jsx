import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';

export const ForceFragilitesScreen = ({ score, moduleId, answers, onContinue, onBack, restitution }) => {
  const backendForces = restitution?.strengths || [];
  const backendFragilites = restitution?.weaknesses || [];

  const forces = backendForces.length > 0 ? backendForces : [
    'Connaissance du secteur et ancrage local fort',
    'Volonté d\'agir et engagement personnel du dirigeant',
    score >= 60 ? 'Situation financière sous contrôle' : null,
  ].filter(Boolean);

  const fragilites = backendFragilites.length > 0 ? backendFragilites : [
    score < 60 ? 'Trésorerie sous tension — à surveiller en priorité' : null,
    'Manque de formalisation des processus clés',
    'Suivi des indicateurs de performance à structurer',
  ].filter(Boolean);

  const priorityText = restitution?.summary || (score < 40
    ? 'La stabilisation de votre situation financière est le sujet à traiter en premier, avant tout autre développement.'
    : score < 70
      ? 'Structurer vos processus commerciaux et formaliser votre suivi de performance sont les leviers prioritaires.'
      : 'Préparer une stratégie de croissance en capitalisant sur vos fondations solides est votre prochain chantier.');

  return (
    <ScreenWrapper>
      {onBack && <TopBackLink onClick={onBack} />}
      <div className="result-wrap animate-fade-up">
        <h1 className="screen-title">Vos forces & fragilités</h1>

        <div className="ff-grid">
          <div className="ff-card" style={{ padding: '20px', border: '1px solid var(--slate-200)', borderRadius: '16px', background: 'var(--bg-white)' }}>
            <div className="ff-card-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: 'var(--color-primary)', fontSize: '1rem', marginBottom: '14px' }}>
              <CheckCircle size={18} className="text-success" style={{ color: 'var(--color-success)' }} />
              Vos points d'appui
            </div>
            <ul className="ff-items" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {forces.map((f, i) => (
                <li key={i} className="ff-item" style={{ fontSize: '0.88rem', color: 'var(--slate-600)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span className="ff-item-dot green" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success)', marginTop: '6px', flexShrink: 0 }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="ff-card" style={{ padding: '20px', border: '1px solid var(--slate-200)', borderRadius: '16px', background: 'var(--bg-white)' }}>
            <div className="ff-card-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: 'var(--color-primary)', fontSize: '1rem', marginBottom: '14px' }}>
              <AlertTriangle size={18} className="text-warning" style={{ color: 'var(--color-warning)' }} />
              Points de vigilance
            </div>
            <ul className="ff-items" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {fragilites.map((f, i) => (
                <li key={i} className="ff-item" style={{ fontSize: '0.88rem', color: 'var(--slate-600)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span className="ff-item-dot orange" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-warning)', marginTop: '6px', flexShrink: 0 }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="ff-priority" style={{ padding: '16px', background: 'var(--slate-50)', borderRadius: '12px', border: '1px solid var(--slate-200)', marginBottom: '24px' }}>
          <div className="ff-priority-label" style={{ fontWeight: 800, color: 'var(--slate-800)', fontSize: '0.88rem', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Point prioritaire</div>
          <p className="ff-priority-text" style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: '1.5' }}>
            {priorityText}
          </p>
        </div>

        <div className="screen-nav" style={{ justifyContent: 'flex-end' }}>
          <Button variant="primary" onClick={onContinue}>Continuer →</Button>
        </div>
      </div>
    </ScreenWrapper>
  );
};
