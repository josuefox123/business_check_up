import React from 'react';
import { Compass, Target, HelpCircle, Building } from 'lucide-react';
import { ChoiceCard } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';

export const ChoixEntreeScreen = ({ question, onSelect, onBack }) => {
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

  const fallbackChoices = [
    { id: 'assisted', label: 'Aidez-moi à choisir le bon diagnostic', icon: getIconForId('assisted') },
    { id: 'direct', label: 'Je sais déjà ce que je veux diagnostiquer', icon: getIconForId('direct') },
    { id: 'learn', label: 'Je veux comprendre ce que fait Business Check-up', icon: getIconForId('learn') },
    { id: 'institutional', label: 'Je représente une institution / un partenaire', icon: getIconForId('institutional') }
  ];

  const resolvedChoices = question?.choices || [];
  const choicesToRender = resolvedChoices.length > 0
    ? resolvedChoices.map(c => ({
        id: c.id,
        label: c.label,
        icon: getIconForId(c.id)
      }))
    : fallbackChoices;

  const titleText = question?.question || 'Que souhaitez-vous faire ?';
  const subtitleText = question?.hint || "Sélectionnez l'option qui correspond le mieux à votre besoin actuel.";

  return (
    <ScreenWrapper>
      {onBack && <TopBackLink onClick={onBack} />}
      <div className="question-wrap animate-fade-up">
        <h1 className="screen-title">{titleText}</h1>
        <p className="screen-subtitle" style={{ marginBottom: 'var(--space-8)' }}>
          {subtitleText}
        </p>
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
