import React from 'react';
import './Button.css';

export const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  disabled = false, 
  className = '', 
  type = 'button' 
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
