import React, { useState } from 'react';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { Button, ChoiceCard, ProgressBar } from '../../ui/index.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';

export const TriageCombinedScreen = ({
  question1,
  question2,
  onContinue,
  onBack,
  progress,
  initialAnswer1,
  initialAnswer2
}) => {
  const [selected1, setSelected1] = useState(initialAnswer1 ?? null);
  const [selected2, setSelected2] = useState(initialAnswer2 ?? null);

  const choices1 = (question1?.choices || question1?.options || []).map(c => ({
    id: c.value || c.id,
    label: c.label || c.text,
    desc: c.desc || c.description
  }));

  const choices2 = (question2?.choices || question2?.options || []).map(c => ({
    id: c.value || c.id,
    label: c.label || c.text,
    desc: c.desc || c.description
  }));

  const title1 = question1?.question || question1?.text || 'Quel est votre profil ?';
  const hint1 = question1?.hint || question1?.helper_text;

  const title2 = question2?.question || question2?.text || 'Votre activité vend-elle déjà des produits ou services ?';
  const hint2 = question2?.hint || question2?.helper_text;

  const canContinue = Boolean(selected1 && selected2);

  const handleSubmit = () => {
    if (canContinue) {
      onContinue(selected1, selected2);
    }
  };

  return (
    <ScreenWrapper>
      {onBack && <TopBackLink onClick={onBack} />}
      <div className="question-wrap animate-fade-up" style={{ maxWidth: '640px', margin: '0 auto' }}>
        {progress && (
          <div style={{ marginBottom: 'var(--space-6, 24px)' }}>
            <ProgressBar current={progress.current} total={progress.total} />
          </div>
        )}

        <div style={{ marginBottom: '32px' }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#34BED5',
            background: 'rgba(52, 190, 213, 0.1)',
            padding: '4px 12px',
            borderRadius: '99px',
            display: 'inline-block',
            marginBottom: '12px'
          }}>
            Profil &amp; Maturité
          </span>
          <h1 className="question-heading" style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', marginBottom: '8px' }}>
            Positionnez votre entreprise
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0, lineHeight: 1.5 }}>
            Ces deux informations permettent d'aiguiller précisément votre diagnostic.
          </p>
        </div>

        {/* Section 1 : Profil */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderLeft: '4px solid #34BED5',
          borderRadius: '16px',
          padding: '24px 20px',
          marginBottom: '24px',
          boxShadow: '0 4px 14px rgba(23, 33, 45, 0.03)'
        }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#17212D', marginBottom: '6px' }}>
            1. {title1}
          </h2>
          {hint1 && (
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '16px', lineHeight: 1.4 }}>
              {hint1}
            </p>
          )}

          <div className="choices-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
            {choices1.map(c => (
              <ChoiceCard
                key={c.id}
                label={c.label}
                selected={selected1 === c.id}
                onClick={() => setSelected1(c.id)}
              />
            ))}
          </div>
        </div>

        {/* Section 2 : Stade de vente */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderLeft: '4px solid #17212D',
          borderRadius: '16px',
          padding: '24px 20px',
          marginBottom: '24px',
          boxShadow: '0 4px 14px rgba(23, 33, 45, 0.03)'
        }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#17212D', marginBottom: '6px' }}>
            2. {title2}
          </h2>
          {hint2 && (
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '16px', lineHeight: 1.4 }}>
              {hint2}
            </p>
          )}

          <div className="choices-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {choices2.map(c => (
              <ChoiceCard
                key={c.id}
                label={c.label}
                selected={selected2 === c.id}
                onClick={() => setSelected2(c.id)}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Navigation */}
      <div className="screen-nav">
        {onBack && <Button variant="outline" onClick={onBack}>Retour</Button>}
        <Button variant="primary" disabled={!canContinue} onClick={handleSubmit}>
          Continuer
        </Button>
      </div>
    </ScreenWrapper>
  );
};
