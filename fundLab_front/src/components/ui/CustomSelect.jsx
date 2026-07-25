import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export const CustomSelect = ({ options = [], value, onChange, placeholder = 'Sélectionner...', error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const hasOptions = Array.isArray(options) && options.length > 0;

  const selectedOption = hasOptions ? options.find(o => 
    typeof o === 'object' ? o.id === value || o.value === value : o === value
  ) : null;

  const getLabel = (opt) => {
    if (!opt) return hasOptions ? placeholder : 'Aucune valeur';
    if (typeof opt === 'object') return opt.label || opt.name || opt.id || opt.value;
    return opt;
  };

  const getValue = (opt) => {
    if (typeof opt === 'object') return opt.value !== undefined ? opt.value : opt.id;
    return opt;
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
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Trigger Box */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          height: '48px',
          borderRadius: '14px',
          border: error ? '1.5px solid #DC2626' : isOpen ? '1.5px solid #34BED5' : '1.5px solid #CBD5E1',
          background: '#ffffff',
          color: selectedOption ? '#0F172A' : '#94A3B8',
          fontSize: '0.94rem',
          fontWeight: selectedOption ? '600' : '400',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          outline: 'none',
          boxSizing: 'border-box',
          boxShadow: isOpen ? '0 0 0 4px rgba(52, 190, 213, 0.14)' : '0 2px 4px rgba(15, 23, 42, 0.02)',
          transition: 'all 0.2s ease-in-out'
        }}
      >
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {getLabel(selectedOption)}
        </span>
        <ChevronDown
          size={18}
          style={{
            color: '#64748B',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            flexShrink: 0,
            marginLeft: '8px'
          }}
        />
      </button>

      {/* Floating Options Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: '#ffffff',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            boxShadow: '0 16px 36px rgba(15, 23, 42, 0.14)',
            zIndex: 999,
            padding: '6px',
            maxHeight: '260px',
            overflowY: 'auto',
            animation: 'selectPop 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            boxSizing: 'border-box'
          }}
        >
          {options.map((opt, idx) => {
            const optVal = getValue(opt);
            const optLabel = getLabel(opt);
            const isSelected = optVal === value;

            return (
              <div
                key={idx}
                onClick={() => {
                  onChange(optVal);
                  setIsOpen(false);
                }}
                style={{
                  padding: '11px 14px',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? '#1A9DB8' : '#1E293B',
                  background: isSelected ? 'rgba(52, 190, 213, 0.12)' : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'background 0.15s ease',
                  marginBottom: '2px'
                }}
                onMouseEnter={e => {
                  if (!isSelected) e.currentTarget.style.background = '#F8FAFC';
                }}
                onMouseLeave={e => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span>{optLabel}</span>
                {isSelected && <Check size={16} style={{ color: '#1A9DB8', flexShrink: 0 }} />}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes selectPop {
          0% { opacity: 0; transform: translateY(-4px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
