import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { ScreenWrapper } from '../../layout/Navbar.jsx';

const CALC_MESSAGES = [
  'Analyse de vos réponses en cours…',
  'Identification de vos forces…',
  'Calcul du score de maturité…',
  'Détection des points de vigilance…',
  'Génération des priorités d\'action…',
  'Finalisation de votre rapport…',
];

export const CalculScreen = ({ onDone }) => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex(i => (i + 1) % CALC_MESSAGES.length);
    }, 550);
    const t = setTimeout(onDone, 3000);
    return () => { clearTimeout(t); clearInterval(interval); };
  }, [onDone]);

  return (
    <ScreenWrapper>
      <div className="calc-wrap animate-fade-in" style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div className="calc-animation" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-blue-light)', color: 'var(--color-blue)', marginBottom: '24px' }}>
          <RefreshCw size={36} className="animate-spin" style={{ animation: 'spinSlow 2s linear infinite' }} />
        </div>
        <h2 className="calc-title" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '12px' }}>Analyse en cours…</h2>
        <p className="calc-subtitle" style={{ color: 'var(--slate-500)', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 24px', lineHeight: '1.6' }}>
          Nous analysons vos réponses. Business Check-up prépare une première lecture de vos forces, points de vigilance et priorités d'action.
        </p>
        <div className="calc-messages" style={{ minHeight: '24px', fontWeight: 600, color: 'var(--color-blue)', fontSize: '0.9rem' }}>
          {CALC_MESSAGES[msgIndex]}
        </div>
      </div>
    </ScreenWrapper>
  );
};
