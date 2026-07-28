import React, { useState } from 'react';
import { ChoiceCard, Button } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const ChoixEntreeScreen = ({ question, onSelect, onBack, initialAnswer }) => {
  const [selected, setSelected] = useState(initialAnswer || null);

  // Rule 9: Normalisation des données et variables d'affichage au sommet du composant
  const questionTitle = question?.question || '[question non disponible]';
  const questionHint = question?.hint || null;
  const choicesList = (question?.choices || []).map(c => ({
    id: c.id,
    label: c.label || '[label non disponible]'
  }));
  const canContinue = Boolean(selected);

  if (!question) {
    return (
      <ScreenWrapper>
        {onBack && <TopBackLink onClick={onBack} />}
        <div className="question-wrap animate-fade-up" style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8', fontStyle: 'italic' }}>
          [question non disponible] Aucune question sélectionnée.
        </div>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      {onBack && <TopBackLink onClick={onBack} />}
      <div className="question-wrap animate-fade-up">
        <h1 className="screen-title">{questionTitle}</h1>
        {questionHint && (
          <p className="screen-subtitle" style={{ marginBottom: 'var(--space-8)' }}>
            {questionHint}
          </p>
        )}
        <div className="choices-list" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {choicesList.map(choice => {
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

      <div className="screen-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px' }}>
        {onBack ? (
          <Button variant="outline" onClick={onBack} style={{ gap: '8px' }}>
            <ArrowLeft size={16} />
            <span>Retour</span>
          </Button>
        ) : <div />}
        <Button 
          variant="primary" 
          disabled={!canContinue} 
          onClick={() => { if (onSelect && selected) onSelect(selected); }}
          style={{ gap: '8px' }}
        >
          <span>Continuer</span>
          <ArrowRight size={16} />
        </Button>
      </div>
    </ScreenWrapper>
  );
};
