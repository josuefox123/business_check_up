import React, { useState } from 'react';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { Button, ChoiceCard, CheckboxCard, ProgressBar } from '../../ui/index.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';
import { AnswerConfirmModal } from './S04Screen.jsx';

export const TriageScreen = ({ step, question, hint, choices, multi = false, onContinue, onBack, progress, initialAnswer }) => {
  const [selected, setSelected] = useState(() => {
    if (initialAnswer !== null && initialAnswer !== undefined) return initialAnswer;
    return multi ? [] : null;
  });
  const [selectedLabel, setSelectedLabel] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const toggle = (id) => {
    if (multi) {
      if (id === 'none' || id === 'prefer') {
        setSelected([id]);
      } else {
        setSelected(prev => {
          const cleaned = prev.filter(x => x !== 'none' && x !== 'prefer');
          return cleaned.includes(id) ? cleaned.filter(x => x !== id) : [...cleaned, id];
        });
      }
    } else {
      setSelected(id);
      const label = choices.find(c => c.id === id)?.label || '';
      setSelectedLabel(label);
      setShowConfirmModal(true);
    }
  };

  const handleContinueSubmit = () => {
    onContinue(selected);
  };

  const canContinue = multi ? selected.length > 0 : selected !== null;

  return (
    <ScreenWrapper>
      {onBack && <TopBackLink onClick={onBack} />}
      {showConfirmModal && (
        <AnswerConfirmModal
          label={selectedLabel}
          onConfirm={() => {
            setShowConfirmModal(false);
            onContinue(selected);
          }}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
      <div className="question-wrap animate-fade-up">
        {progress && (
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <ProgressBar current={progress.current} total={progress.total} label={`Étape ${progress.current}/${progress.total}`} />
          </div>
        )}

        <h1 className="question-heading">{question}</h1>
        {hint && <p className="question-hint">{hint}</p>}

        <div className="choices-list">
          {choices.map(c => (
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

        {multi && (
          <div className="screen-nav" style={{ justifyContent: 'flex-end' }}>
            <Button variant="primary" disabled={!canContinue} onClick={handleContinueSubmit}>
              Continuer
            </Button>
          </div>
        )}

      </div>
    </ScreenWrapper>
  );
};
