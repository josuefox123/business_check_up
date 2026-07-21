import React from 'react';
import { ArrowLeft } from 'lucide-react';

export const CheckIcon = () => (
  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
    <path d="M1 5L4 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const TopBackLink = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: 'none',
      border: 'none',
      color: '#17212D',
      fontWeight: 700,
      fontSize: '0.9rem',
      cursor: 'pointer',
      padding: '0',
      marginBottom: '20px',
      transition: 'opacity 0.2s ease',
      fontFamily: 'var(--font)',
    }}
    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
  >
    <ArrowLeft size={16} strokeWidth={2.5} />
    <span>Retour</span>
  </button>
);
