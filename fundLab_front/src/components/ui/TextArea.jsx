import React from 'react';

export const TextArea = ({
  value = '',
  onChange,
  maxLength = 500,
  placeholder = 'Votre réponse...',
  rows = 3,
  disabled = false,
  error = false,
  className = '',
  style = {}
}) => {
  const currentLength = (value || '').length;
  const isLimitReached = currentLength >= maxLength;

  return (
    <div className={`text-area-wrapper ${className}`} style={style}>
      <textarea
        className={`form-input ${error ? 'has-error' : ''}`}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      <div className={`text-area-counter ${isLimitReached ? 'limit-reached' : ''}`}>
        {currentLength} / {maxLength} caractères
      </div>
    </div>
  );
};
