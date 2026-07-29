import React from 'react';
import { ArrowLeft } from 'lucide-react';

export const CheckIcon = () => (
  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
    <path d="M1 5L4 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const TopBackLink = ({ onClick }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }} className="no-print">
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        color: '#64748B',
        fontWeight: 650,
        fontSize: '0.88rem',
        cursor: 'pointer',
        padding: '8px 16px',
        borderRadius: '10px',
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        fontFamily: 'inherit',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#0F172A';
        e.currentTarget.style.borderColor = '#CBD5E1';
        e.currentTarget.style.background = '#F8FAFC';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#64748B';
        e.currentTarget.style.borderColor = '#E2E8F0';
        e.currentTarget.style.background = '#FFFFFF';
      }}
    >
      <ArrowLeft size={15} />
      <span>Retour</span>
    </button>
  </div>
);
