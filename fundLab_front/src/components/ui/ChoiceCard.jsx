import React from 'react';
import './ChoiceCard.css';

export const ChoiceCard = ({ title, icon, selected, onClick }) => {
  return (
    <button 
      className={`choice-card ${selected ? 'selected' : ''}`} 
      onClick={onClick}
      type="button"
    >
      {icon && <div className="choice-icon">{icon}</div>}
      <span className="choice-title">{title}</span>
    </button>
  );
};
