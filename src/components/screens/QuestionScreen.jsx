import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { ChoiceCard } from '../ui/ChoiceCard';
import { ProgressBar } from '../ui/ProgressBar';
import { Rocket, Building2, Briefcase, ShoppingCart, Wrench, Monitor, Users, TrendingUp, ShieldCheck, HeartHandshake } from 'lucide-react';
import './QuestionScreen.css';

const IconMap = {
  rocket: <Rocket size={24} />,
  building: <Building2 size={24} />,
  briefcase: <Briefcase size={24} />,
  cart: <ShoppingCart size={24} />,
  wrench: <Wrench size={24} />,
  monitor: <Monitor size={24} />,
  users: <Users size={24} />,
  trending: <TrendingUp size={24} />,
  shield: <ShieldCheck size={24} />,
  handshake: <HeartHandshake size={24} />,
};

export const QuestionScreen = ({ questionData, progress, onNext, onBack, initialAnswer }) => {
  const [selectedId, setSelectedId] = useState(initialAnswer || null);

  const handleNext = () => {
    if (selectedId) {
      onNext(selectedId);
    }
  };

  return (
    <div className="question-container animate-fade-in">
      <div className="question-content">
        <ProgressBar progress={progress} />
        
        <h2 className="question-title">{questionData.title}</h2>
        
        <div className="choices-grid">
          {questionData.choices.map((choice) => (
            <div key={choice.id} className="choice-wrapper">
              <ChoiceCard
                title={choice.label}
                icon={choice.icon ? IconMap[choice.icon] : null}
                selected={selectedId === choice.id}
                onClick={() => setSelectedId(choice.id)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="question-footer">
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button 
          variant="primary" 
          onClick={handleNext}
          disabled={!selectedId}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
};
