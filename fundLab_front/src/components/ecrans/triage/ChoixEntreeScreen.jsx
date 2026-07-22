import React, { useState } from 'react';
import { ChoiceCard, Button } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';

export const ChoixEntreeScreen = ({ question, onSelect, onBack, initialAnswer }) => {
  const [selected, setSelected] = useState(initialAnswer || null);

  if (!question) return null;

  const choicesToRender = (question.choices || []).map(c => ({
    id: c.id,
    label: c.label
  }));

  return (
    <ScreenWrapper>
      {onBack && <TopBackLink onClick={onBack} />}
      <div className="question-wrap animate-fade-up">
        <h1 className="screen-title">{question.question}</h1>
        {question.hint && (
          <p className="screen-subtitle" style={{ marginBottom: 'var(--space-8)' }}>
            {question.hint}
          </p>
        )}
        <div className="choices-list" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {choicesToRender.map(choice => {
            const isSelected = selected === choice.id;
            return (
              <ChoiceCard
                key={choice.id}
                label={choice.label}
                selected={isSelected}
                onClick={() => setSelected(choice.id)}
              />
            );
          })}
        </div>
      </div>

      <div className="screen-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', gap: '12px' }}>
        {onBack && <Button variant="outline" onClick={onBack}>Retour</Button>}
        <Button 
          variant="primary" 
          disabled={!selected} 
          onClick={() => { if (onSelect) onSelect(selected); }}
        >
          Continuer
        </Button>
      </div>
    </ScreenWrapper>
  );
};
