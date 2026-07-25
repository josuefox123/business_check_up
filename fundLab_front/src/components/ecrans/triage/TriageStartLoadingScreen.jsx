import React, { useEffect, useState } from 'react';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { CheckCircle2, Sparkles, Loader2, ArrowRight } from 'lucide-react';

export const TriageStartLoadingScreen = ({ onComplete, message = "Initialisation de votre diagnostic sur mesure..." }) => {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    "Validation de votre consentement",
    "Création de votre session sécurisée",
    "Préparation du questionnaire de triage",
    "Accès au formulaire d'informations"
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setStepIndex(1), 400);
    const timer2 = setTimeout(() => setStepIndex(2), 800);
    const timer3 = setTimeout(() => setStepIndex(3), 1200);
    const timer4 = setTimeout(() => {
      if (onComplete) onComplete();
    }, 1700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <ScreenWrapper wide>
      <style>{`
        .init-container {
          max-width: 580px;
          margin: 40px auto;
          text-align: center;
          padding: 32px 24px;
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 20px 45px rgba(15, 23, 42, 0.06);
        }

        .init-badge-icon {
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

        .init-steps-list {
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

        .init-step-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #64748B;
          transition: all 0.3s ease;
        }

        .init-step-item.active {
          color: #17212D;
          font-weight: 700;
        }

        .init-step-item.completed {
          color: #059669;
        }
      `}</style>

      <div className="init-container animate-fade-up">
        <div className="init-badge-icon">
          <Sparkles size={36} />
        </div>

        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#17212D', marginBottom: '8px', letterSpacing: '-0.02em' }}>
          Bienvenue ! Votre parcours démarre
        </h1>

        <p style={{ fontSize: '0.94rem', color: '#64748B', lineHeight: 1.55 }}>
          Nous préparons votre évaluation. Merci de patienter un court instant pendant le chargement des étapes.
        </p>

        <div className="init-steps-list">
          {steps.map((st, idx) => {
            const isDone = idx < stepIndex;
            const isCurrent = idx === stepIndex;

            return (
              <div
                key={idx}
                className={`init-step-item ${isDone ? 'completed' : isCurrent ? 'active' : ''}`}
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
          {message}
        </div>
      </div>
    </ScreenWrapper>
  );
};
