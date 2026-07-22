import React from 'react';
import { Compass, Target, HelpCircle, Building } from 'lucide-react';
import { ChoiceCard } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';

export const ChoixEntreeScreen = ({ question, onSelect, onBack }) => {
  if (!question) return null;

  const getIconForId = (id) => {
    switch (id) {
      case 'assisted':
        return <Compass size={20} style={{ color: '#17212D' }} />;
      case 'direct':
      case 'direct_catalog':
        return <Target size={20} style={{ color: '#34BED5' }} />;
      case 'learn':
      case 'learn_more':
        return <HelpCircle size={20} style={{ color: '#64748B' }} />;
      case 'institutional':
        return <Building size={20} style={{ color: '#8B5CF6' }} />;
      default:
        return <HelpCircle size={20} style={{ color: '#64748B' }} />;
    }
  };

  const choicesToRender = (question.choices || []).map(c => ({
    id: c.id,
    label: c.label,
    icon: getIconForId(c.id)
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
          {choicesToRender.map(choice => (
            <ChoiceCard
              key={choice.id}
              label={choice.label}
              icon={choice.icon}
              selected={false}
              onClick={() => onSelect(choice.id)}
            />
          ))}
        </div>
      </div>
    </ScreenWrapper>
  );
};
