import React from 'react';
import { Compass, Target, HelpCircle } from 'lucide-react';
import { ChoiceCard } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';

export const ChoixEntreeScreen = ({ onAssisted, onCatalog, onLearnMore }) => {
  return (
    <ScreenWrapper>
      <div className="question-wrap animate-fade-up">
        <h1 className="screen-title">Que souhaitez-vous faire ?</h1>
        <p className="screen-subtitle" style={{marginBottom:'var(--space-8)'}}>
          Sélectionnez l'option qui correspond le mieux à votre besoin actuel.
        </p>
        <div className="choices-list" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <ChoiceCard
            label="Aidez-moi à choisir le bon diagnostic"
            icon={<Compass size={20} className="text-blue" />}
            selected={false}
            onClick={onAssisted}
          />
          <ChoiceCard
            label="Je sais déjà ce que je veux diagnostiquer"
            icon={<Target size={20} className="text-teal" />}
            selected={false}
            onClick={onCatalog}
          />
          <ChoiceCard
            label="Je veux comprendre l'outil"
            icon={<HelpCircle size={20} className="text-slate" />}
            selected={false}
            onClick={onLearnMore}
          />
        </div>
      </div>
    </ScreenWrapper>
  );
};
