import React, { useState } from 'react';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { Button, ChoiceCard, CheckboxCard, ProgressBar } from '../../ui/index.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';

export const TriageScreen = ({ step, question, hint, choices = [], multi = false, onContinue, onBack, progress, initialAnswer }) => {
  const normalizedChoices = choices.map(c => ({
    id: c.value || c.id,
    label: c.label,
    severity: c.severity,
    desc: c.desc || c.description
  }));

  const [selected, setSelected] = useState(() => {
    if (initialAnswer !== null && initialAnswer !== undefined) return initialAnswer;
    return multi ? [] : null;
  });

  const toggle = (id) => {
    if (multi) {
      if (id === 'none' || id === 'prefer' || id === 'prefer_not_to_answer') {
        setSelected([id]);
      } else {
        setSelected(prev => {
          const cleaned = prev.filter(x => x !== 'none' && x !== 'prefer' && x !== 'prefer_not_to_answer');
          return cleaned.includes(id) ? cleaned.filter(x => x !== id) : [...cleaned, id];
        });
      }
    } else {
      setSelected(id);
    }
  };

  const handleContinueSubmit = () => {
    onContinue(selected);
  };

  const canContinue = multi ? selected.length > 0 : selected !== null;

  return (
    <ScreenWrapper>
      {onBack && <TopBackLink onClick={onBack} />}
      <div className="question-wrap animate-fade-up">
        {progress && (
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <ProgressBar current={progress.current} total={progress.total} label={`Étape ${progress.current}/${progress.total}`} />
          </div>
        )}

        <h1 className="question-heading">{question}</h1>
        {hint && <p className="question-hint">{hint}</p>}

        <div className="choices-list">
          {normalizedChoices.map(c => (
            multi ? (
              <CheckboxCard
                key={c.id}
                label={c.label}
                checked={selected.includes(c.id)}
                severity={c.severity}
                onChange={() => toggle(c.id)}
              />
            ) : (
              <ChoiceCard
                key={c.id}
                label={c.label}
                selected={selected === c.id}
                onClick={() => toggle(c.id)}
              />
            )
          ))}
        </div>

      </div>

      {/* Boutons d'action simples Retour et Continuer intégrés en bas de page (Hors de l'animation transform) */}
      <div className="screen-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', gap: '12px' }}>
        {onBack && <Button variant="outline" onClick={onBack}>Retour</Button>}
        <Button variant="primary" disabled={!canContinue} onClick={handleContinueSubmit}>
          Continuer
        </Button>
      </div>
    </ScreenWrapper>
  );
};
