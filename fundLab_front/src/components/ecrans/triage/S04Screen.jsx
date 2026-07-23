import React, { useState } from 'react';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { Button, ChoiceCard, ProgressBar } from '../../ui/index.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';
import { useReferences } from '../../../contexts/ReferencesContext.jsx';

export const AnswerConfirmModal = ({ label, onConfirm, onCancel }) => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 9999,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px',
    background: 'rgba(7, 14, 36, 0.55)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    animation: 'fadeIn 0.18s ease',
  }}>
    <div style={{
      background: '#ffffff',
      borderRadius: '24px',
      padding: '32px 24px',
      maxWidth: '440px',
      width: '100%',
      boxShadow: '0 24px 60px rgba(7,14,36,0.18)',
      animation: 'scaleIn 0.2s cubic-bezier(0.16,1,0.3,1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }} onClick={e => e.stopPropagation()}>
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '8px' }}>
          Confirmer votre choix
        </h3>
        <p style={{ fontSize: '0.92rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
          Vous avez sélectionné : <br />
          <strong style={{ color: 'var(--color-blue)', fontSize: '1.05rem', display: 'inline-block', marginTop: '8px' }}>{label}</strong>
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '12px', marginTop: '4px' }}>
        <Button variant="outline" onClick={onCancel} style={{ justifyContent: 'center', width: '100%' }}>
          Retour
        </Button>
        <Button variant="primary" onClick={onConfirm} style={{ justifyContent: 'center', width: '100%' }}>
          Continuer
        </Button>
      </div>
    </div>
  </div>
);

export const S04SubQuestionModal = ({ onConfirm, onCancel }) => {
  const [localSub, setLocalSub] = useState(null);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      background: 'rgba(7, 14, 36, 0.55)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      animation: 'fadeIn 0.18s ease',
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        padding: '32px 24px',
        maxWidth: '440px',
        width: '100%',
        boxShadow: '0 24px 60px rgba(7,14,36,0.18)',
        animation: 'scaleIn 0.2s cubic-bezier(0.16,1,0.3,1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '8px' }}>
            Précision requise
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--slate-600)', lineHeight: 1.5 }}>
            Avez-vous au moins un client qui a payé ?
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setLocalSub('yes')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1.5px solid',
              borderColor: localSub === 'yes' ? 'var(--color-blue)' : 'var(--slate-200)',
              background: localSub === 'yes' ? 'rgba(38,89,242,0.04)' : '#ffffff',
              color: 'var(--slate-800)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s'
            }}
          >
            <div style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              border: '2px solid',
              borderColor: localSub === 'yes' ? 'var(--color-blue)' : 'var(--slate-300)',
              background: localSub === 'yes' ? 'var(--color-blue)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {localSub === 'yes' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffffff' }} />}
            </div>
            <span>Oui, j\'ai au moins un client payant</span>
          </button>

          <button
            type="button"
            onClick={() => setLocalSub('no')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1.5px solid',
              borderColor: localSub === 'no' ? 'var(--color-blue)' : 'var(--slate-200)',
              background: localSub === 'no' ? 'rgba(38,89,242,0.04)' : '#ffffff',
              color: 'var(--slate-800)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s'
            }}
          >
            <div style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              border: '2px solid',
              borderColor: localSub === 'no' ? 'var(--color-blue)' : 'var(--slate-300)',
              background: localSub === 'no' ? 'var(--color-blue)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {localSub === 'no' && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffffff' }} />}
            </div>
            <span>Non, aucun client payant pour l\'instant</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '12px', marginTop: '4px' }}>
          <Button variant="outline" onClick={onCancel} style={{ justifyContent: 'center', width: '100%' }}>
            Retour
          </Button>
          <Button variant="primary" disabled={localSub === null} onClick={() => onConfirm(localSub)} style={{ justifyContent: 'center', width: '100%' }}>
            Continuer
          </Button>
        </div>
      </div>
    </div>
  );
};

export const S04Screen = ({ question, currentStep, totalSteps, onContinue, onBack, initialAnswer }) => {
  const { references } = useReferences();
  const rawStages = references?.activity_stage || [];

  const resolvedChoices = question?.choices || rawStages.map(p => ({
    id: p.value || p.id,
    label: p.label,
    desc: p.desc || p.description
  }));

  const [selected, setSelected] = useState(initialAnswer || null);

  const titleText = question?.question || 'Votre activité vend-elle déjà des produits ou services ?';
  const subtitleText = question?.hint || 'Cette question affine votre profil et nous aide à vous orienter vers le diagnostic le plus adapté.';

  return (
    <ScreenWrapper>
      {onBack && <TopBackLink onClick={onBack} />}

      <div key={currentStep || titleText} className="question-wrap animate-fade-up">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <ProgressBar current={currentStep !== undefined ? currentStep : 1} total={totalSteps || 6} />
        </div>
        <h1 className="question-heading">{titleText}</h1>
        <p className="question-hint" style={{ marginBottom: 'var(--space-6)', fontSize: '0.82rem', opacity: 0.9 }}>
          {subtitleText}
        </p>

        <div className="choices-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {resolvedChoices.map(c => (
            <ChoiceCard
              key={c.id}
              label={c.label}
              selected={selected === c.id}
              onClick={() => setSelected(c.id)}
            />
          ))}
        </div>

      </div>

      {/* Boutons d'action simples Retour et Continuer intégrés en bas de page (Hors de l'animation transform) */}
      <div className="screen-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', gap: '12px' }}>
        {onBack && <Button variant="outline" onClick={onBack}>Retour</Button>}
        <Button variant="primary" disabled={!selected} onClick={() => onContinue(selected)}>Continuer</Button>
      </div>
    </ScreenWrapper>
  );
};
