import React from 'react';
import './ProgressBar.css';

export const ProgressBar = ({ progress }) => {
  return (
    <div className="progress-container">
      <div 
        className="progress-fill" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};
