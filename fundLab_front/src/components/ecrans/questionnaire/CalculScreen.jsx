import React, { useState, useEffect } from 'react';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { CheckCircle2, Sparkles, Loader2, TrendingUp } from 'lucide-react';

const CALC_STEPS = [
  "Analyse globale de vos réponses",
  "Identification de vos forces et fragilités",
  "Calcul du score de maturité par axe",
  "Génération des priorités d'action sur mesure",
  "Finalisation de votre synthèse de diagnostic"
];

export const CalculScreen = ({ onDone }) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStepIndex(1), 1000);
    const timer2 = setTimeout(() => setStepIndex(2), 2200);
    const timer3 = setTimeout(() => setStepIndex(3), 3400);
    const timer4 = setTimeout(() => setStepIndex(4), 4400);
    const timerDone = setTimeout(() => {
      if (onDone) onDone();
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timerDone);
    };
  }, [onDone]);

  return (
    <ScreenWrapper wide>
      <style>{`
        .calc-page-container {
          max-width: 600px;
          margin: 40px auto;
          text-align: center;
          padding: 32px 24px;
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 20px 45px rgba(15, 23, 42, 0.06);
          box-sizing: border-box;
        }

        .calc-badge-icon {
          width: 72px;
          height: 72px;
          border-radius: 20px;
          background: rgba(52, 190, 213, 0.12);
          color: #1A9DB8;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px auto;
          box-shadow: 0 8px 20px rgba(52, 190, 213, 0.15);
        }

        .calc-steps-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin: 28px 0;
          text-align: left;
          background: #F8FAFC;
          padding: 20px;
          border-radius: 16px;
          border: 1px solid #E2E8F0;
        }

        .calc-step-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.92rem;
          font-weight: 600;
          color: #64748B;
          transition: all 0.3s ease;
        }

        .calc-step-item.active {
          color: #17212D;
          font-weight: 700;
        }

        .calc-step-item.completed {
          color: #059669;
        }
      `}</style>

      <div className="calc-page-container animate-fade-up">
        <div className="calc-badge-icon">
          <TrendingUp size={36} />
        </div>

        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#17212D', marginBottom: '8px', letterSpacing: '-0.02em' }}>
          Calcul de votre restitution en cours
        </h1>

        <p style={{ fontSize: '0.94rem', color: '#64748B', lineHeight: 1.55, maxWidth: '500px', margin: '0 auto' }}>
          Business Check-up analyse vos réponses pour construire votre bilan personnalisé, vos forces et vos axes de progrès.
        </p>

        <div className="calc-steps-list">
          {CALC_STEPS.map((st, idx) => {
            const isDone = idx < stepIndex;
            const isCurrent = idx === stepIndex;

            return (
              <div
                key={idx}
                className={`calc-step-item ${isDone ? 'completed' : isCurrent ? 'active' : ''}`}
              >
                {isDone ? (
                  <CheckCircle2 size={18} style={{ color: '#059669', flexShrink: 0 }} />
                ) : isCurrent ? (
                  <Loader2 size={18} className="animate-spin" style={{ color: '#34BED5', flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #CBD5E1', flexShrink: 0 }} />
                )}
                <span>{st}</span>
              </div>
            );
          })}
        </div>

        <div style={{ fontSize: '0.84rem', color: '#94A3B8', fontWeight: 500 }}>
          Veuillez patienter quelques secondes pendant la génération de votre synthèse...
        </div>
      </div>
    </ScreenWrapper>
  );
};
