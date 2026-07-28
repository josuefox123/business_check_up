import React from 'react';
import { Award, ArrowRight } from 'lucide-react';
import { Button } from '../../ui/index.jsx';

export const TriageCompletionModal = ({ onConfirm }) => {
  // Rule 9: Normalisation des variables au sommet de la fonction composant
  const titleText = "Félicitations pour votre parcours !";
  const descText = "Vous avez complété avec succès le questionnaire d'évaluation initial. Pour obtenir votre diagnostic recommandé sur mesure, veuillez vérifier et compléter les informations générales de votre entreprise.";
  const btnLabelText = "COMPLÉTER MES INFORMATIONS";

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '28px',
          padding: '36px 24px 28px 24px',
          maxWidth: '420px',
          width: '100%',
          boxShadow: '0 24px 50px rgba(15, 23, 42, 0.25)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
          animation: 'modalPop 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Glowing Badge with Surrounding Particles */}
        <div
          style={{
            position: 'relative',
            width: '90px',
            height: '90px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '22px'
          }}
        >
          {/* Surrounding Decorative Particles */}
          <div
            style={{
              position: 'absolute',
              top: '4px',
              left: '12px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#34BED5',
              opacity: 0.8
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '8px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#34BED5',
              opacity: 0.5
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '8px',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#34BED5',
              opacity: 0.6
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              right: '12px',
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              background: '#34BED5',
              opacity: 0.75
            }}
          />

          {/* Center Circle Icon */}
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: '#34BED5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 10px 28px rgba(52, 190, 213, 0.4)',
              zIndex: 2
            }}
          >
            <Award size={36} strokeWidth={2.2} />
          </div>
        </div>

        {/* Modal Title */}
        <h2
          style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 12px 0',
            letterSpacing: '-0.02em'
          }}
        >
          {titleText}
        </h2>

        {/* Modal Description */}
        <p
          style={{
            fontSize: '0.92rem',
            color: '#64748B',
            lineHeight: 1.6,
            margin: '0 0 26px 0',
            padding: '0 4px'
          }}
        >
          {descText}
        </p>

        {/* CTA Button */}
        <Button
          type="button"
          variant="primary"
          full
          onClick={onConfirm}
          style={{
            height: '52px',
            borderRadius: '14px',
            fontWeight: 800,
            fontSize: '0.98rem',
            background: '#17212D',
            color: '#ffffff',
            letterSpacing: '0.03em',
            boxShadow: '0 8px 22px rgba(23, 33, 45, 0.25)',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <span>{btnLabelText}</span>
          <ArrowRight size={18} />
        </Button>
      </div>

      <style>{`
        @keyframes modalPop {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
