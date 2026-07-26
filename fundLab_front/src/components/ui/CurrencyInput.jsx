import React, { useState } from 'react';

/**
 * Composant pour la saisie structurée des montants et périodes :
 * - currency_xof
 * - currency_xof_with_period
 */
export const CurrencyInput = ({ type, value, onChange }) => {
  const isIdkInitial = value === "Je ne sais pas";
  
  const [isIdk, setIsIdk] = useState(isIdkInitial);
  const [period, setPeriod] = useState(() => {
    if (type === 'currency_xof_with_period' && value && !isIdkInitial) {
      if (value.includes('/ mois') || value.includes('par mois')) return 'mois';
      if (value.includes('/ semaine') || value.includes('par semaine')) return 'semaine';
      if (value.includes('/ trimestre') || value.includes('par trimestre')) return 'trimestre';
      if (value.includes('/ an') || value.includes('par an')) return 'année';
    }
    return 'mois';
  });
  
  const [amount, setAmount] = useState(() => {
    if (!value || isIdkInitial) return '';
    const match = value.match(/\d+/g);
    return match ? match.join('') : '';
  });

  const updateParent = (idkState, amountVal, periodVal) => {
    if (idkState) {
      onChange("Je ne sais pas");
      return;
    }

    if (!amountVal || isNaN(amountVal)) {
      onChange('');
      return;
    }

    const formattedAmount = parseInt(amountVal, 10).toLocaleString('fr-FR');

    if (type === 'currency_xof_with_period') {
      const text = `${formattedAmount} FCFA par ${periodVal}`;
      onChange(text);
    } else {
      const text = `${formattedAmount} FCFA`;
      onChange(text);
    }
  };

  const handleIdkToggle = (e) => {
    const checked = e.target.checked;
    setIsIdk(checked);
    updateParent(checked, amount, period);
  };

  const handleAmountChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setAmount(val);
    if (isIdk) setIsIdk(false);
    updateParent(false, val, period);
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
    if (isIdk) setIsIdk(false);
    updateParent(false, amount, newPeriod);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '540px', margin: '0 auto', width: '100%' }}>
      {/* 1. Sélection de la période si type = currency_xof_with_period */}
      {type === 'currency_xof_with_period' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '0.86rem', fontWeight: 700, color: '#334155' }}>
            Sélectionnez la période :
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {[
              { id: 'semaine', label: 'Semaine' },
              { id: 'mois', label: 'Mois' },
              { id: 'trimestre', label: 'Trimestre' },
              { id: 'année', label: 'Année' }
            ].map(p => (
              <button
                key={p.id}
                type="button"
                disabled={isIdk}
                onClick={() => handlePeriodChange(p.id)}
                style={{
                  padding: '12px 8px',
                  borderRadius: '12px',
                  border: period === p.id && !isIdk ? '2px solid #34BED5' : '1.5px solid #CBD5E1',
                  background: period === p.id && !isIdk ? 'rgba(52, 190, 213, 0.1)' : '#FFFFFF',
                  color: period === p.id && !isIdk ? '#1A9DB8' : '#475569',
                  fontWeight: period === p.id && !isIdk ? 700 : 600,
                  fontSize: '0.88rem',
                  cursor: isIdk ? 'not-allowed' : 'pointer',
                  opacity: isIdk ? 0.4 : 1,
                  transition: 'all 0.15s ease'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. Saisie du montant numérique */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '0.86rem', fontWeight: 700, color: '#334155' }}>
          Montant approximatif (FCFA) :
        </label>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            disabled={isIdk}
            placeholder="Ex: 500 000"
            value={amount ? parseInt(amount, 10).toLocaleString('fr-FR') : ''}
            onChange={handleAmountChange}
            style={{
              width: '100%',
              height: '52px',
              borderRadius: '12px',
              border: '1.5px solid #CBD5E1',
              padding: '0 70px 0 16px',
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#0F172A',
              outline: 'none',
              background: isIdk ? '#F8FAFC' : '#FFFFFF',
              opacity: isIdk ? 0.5 : 1,
              boxSizing: 'border-box'
            }}
          />
          <span style={{
            position: 'absolute',
            right: '16px',
            fontWeight: 800,
            fontSize: '0.88rem',
            color: '#64748B'
          }}>
            FCFA
          </span>
        </div>
        <span style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.4 }}>
          Vous pouvez saisir un montant approximatif ou choisir « Je ne sais pas ». Le montant n'est pas une preuve comptable.
        </span>
      </div>

      {/* 3. Option "Je ne sais pas" */}
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 16px',
        borderRadius: '12px',
        border: isIdk ? '1.5px solid #34BED5' : '1.5px solid #E2E8F0',
        background: isIdk ? 'rgba(52, 190, 213, 0.08)' : '#F8FAFC',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'all 0.15s ease'
      }}>
        <input
          type="checkbox"
          checked={isIdk}
          onChange={handleIdkToggle}
          style={{ width: '18px', height: '18px', accentColor: '#34BED5', cursor: 'pointer' }}
        />
        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: isIdk ? '#1A9DB8' : '#334155' }}>
          Je ne sais pas
        </span>
      </label>
    </div>
  );
};
