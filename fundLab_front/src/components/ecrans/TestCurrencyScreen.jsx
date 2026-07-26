import React, { useState } from 'react';
import { CurrencyInput } from '../ui/CurrencyInput.jsx';
import { ScreenWrapper } from '../layout/Navbar.jsx';

export const TestCurrencyScreen = () => {
  const [val1, setVal1] = useState('');
  const [val2, setVal2] = useState('');

  return (
    <ScreenWrapper>
      <div style={{ maxWidth: '680px', margin: '40px auto', padding: '0 20px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#17212D', marginBottom: '8px' }}>
          Test des composants de saisie monétaire
        </h1>
        <p style={{ color: '#64748B', marginBottom: '32px' }}>
          Page de démonstration interactive pour prévisualiser les types <code>currency_xof</code> et <code>currency_xof_with_period</code>.
        </p>

        {/* SECTION 1: currency_xof */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', marginBottom: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
            1. Type : <code>currency_xof</code>
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px' }}>
            (Saisie simple du montant approximatif en FCFA)
          </p>

          <CurrencyInput
            type="currency_xof"
            value={val1}
            onChange={(val) => setVal1(val)}
          />

          <div style={{ marginTop: '20px', padding: '12px 16px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>Valeur envoyée au backend : </span>
            <code style={{ fontSize: '0.9rem', color: '#1A9DB8', fontWeight: 700 }}>{val1 ? JSON.stringify(val1) : '(vide)'}</code>
          </div>
        </div>

        {/* SECTION 2: currency_xof_with_period */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
            2. Type : <code>currency_xof_with_period</code>
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px' }}>
            (Choix de la période + saisie du montant en FCFA)
          </p>

          <CurrencyInput
            type="currency_xof_with_period"
            value={val2}
            onChange={(val) => setVal2(val)}
          />

          <div style={{ marginTop: '20px', padding: '12px 16px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>Valeur envoyée au backend : </span>
            <code style={{ fontSize: '0.9rem', color: '#1A9DB8', fontWeight: 700 }}>{val2 ? JSON.stringify(val2) : '(vide)'}</code>
          </div>
        </div>
      </div>
    </ScreenWrapper>
  );
};
