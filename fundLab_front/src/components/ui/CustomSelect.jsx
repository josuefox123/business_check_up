import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import './CustomSelect.css';

export const CustomSelect = ({
  options = [],
  value,
  onChange,
  placeholder = 'Sélectionnez une option...',
  disabled = false,
  error = false,
  className = '',
  style = {}
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Normalize options array into array of { value, label }
  const normalizedOptions = options.map(opt => {
    if (typeof opt === 'object' && opt !== null) {
      return {
        value: opt.value !== undefined ? opt.value : opt.id,
        label: opt.label || opt.name || opt.value || opt.id
      };
    }
    return { value: opt, label: String(opt) };
  });

  const selectedOption = normalizedOptions.find(opt => String(opt.value) === String(value));

  const handleSelect = (optionValue) => {
    if (onChange) {
      onChange(optionValue);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`custom-select-container ${isOpen ? 'is-open' : ''} ${disabled ? 'is-disabled' : ''} ${error ? 'has-error' : ''} ${className}`}
      style={style}
    >
      <button
        type="button"
        className="custom-select-trigger"
        onClick={() => !disabled && setIsOpen(prev => !prev)}
        disabled={disabled}
        aria-expanded={isOpen}
      >
        <span className={`custom-select-value ${!selectedOption ? 'is-placeholder' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={18} className="custom-select-chevron" />
      </button>

      {isOpen && !disabled && (
        <div className="custom-select-dropdown animate-scale-in">
          <ul className="custom-select-options" role="listbox">
            {normalizedOptions.map(opt => {
              const isSelected = String(opt.value) === String(value);
              return (
                <li
                  key={String(opt.value)}
                  className={`custom-select-option ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => handleSelect(opt.value)}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span className="custom-select-option-label">{opt.label}</span>
                  {isSelected && <Check size={16} className="custom-select-check" />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
