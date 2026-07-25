import React, { useState } from 'react';
import { AlertTriangle, MessageSquare } from 'lucide-react';
import { Button, ChoiceCard, CheckboxCard, ProgressBar, TextArea } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';
import { getModuleThemeClass } from '../../../utils/themeUtils.js';

export const QuitConfirmModal = ({ onConfirm, onCancel }) => (
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
      borderRadius: '20px',
      padding: '36px 32px 28px',
      maxWidth: '400px',
      width: '100%',
      boxShadow: '0 24px 60px rgba(7,14,36,0.18)',
      textAlign: 'center',
      animation: 'scaleIn 0.2s cubic-bezier(0.16,1,0.3,1)',
    }}>
      <div style={{
        width: '56px', height: '56px',
        background: 'rgba(220, 38, 38, 0.08)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
      }}>
        <AlertTriangle size={26} strokeWidth={2} style={{ color: '#dc2626' }} />
      </div>

      <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '10px' }}>
        Quitter le diagnostic ?
      </h2>
      <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)', lineHeight: 1.6, marginBottom: '28px' }}>
        Votre progression sera <strong style={{ color: 'var(--slate-700)' }}>perdue</strong>.
        Vous serez redirigé vers l’accueil.
      </p>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1, padding: '12px 16px',
            borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem',
            border: '1.5px solid var(--slate-200)', background: '#fff',
            color: 'var(--slate-700)', cursor: 'pointer',
            fontFamily: 'var(--font)', transition: 'all 0.15s',
          }}
        >
          Continuer
        </button>
        <button
          onClick={onConfirm}
          style={{
            flex: 1, padding: '12px 16px',
            borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem',
            border: 'none', background: '#dc2626',
            color: '#fff', cursor: 'pointer',
            fontFamily: 'var(--font)', transition: 'all 0.15s',
            boxShadow: '0 4px 14px rgba(220,38,38,0.28)',
          }}
        >
          Quitter
        </button>
      </div>
    </div>
  </div>
);

export const QuestionScreen = ({ moduleId, questionData, current, total, savedAnswer, onContinue, onBack, onQuit }) => {
  const isMulti = questionData.type === 'multi';
  const isScale = questionData.type === 'scale_1_5';
  const isText = questionData.type === 'short_text';
  const maxLength = questionData.maxLength || 500;
  const themeClass = getModuleThemeClass(moduleId || questionData?.moduleId);

  const [answer, setAnswer] = useState(
    (!isMulti && !isText && savedAnswer !== null) ? savedAnswer : null
  );
  const [multiAnswer, setMultiAnswer] = useState(
    isMulti && Array.isArray(savedAnswer) ? savedAnswer : []
  );
  const [textVal, setTextVal] = useState(
    isText && typeof savedAnswer === 'string' ? savedAnswer : ''
  );
  const [showQuitModal, setShowQuitModal] = useState(false);

  const toggleMulti = (id) => {
    if (id === 'idk') { setMultiAnswer(['idk']); return; }
    setMultiAnswer(prev => {
      const c = prev.filter(x => x !== 'idk');
      return c.includes(id) ? c.filter(x => x !== id) : [...c, id];
    });
  };

  const canContinue = isMulti ? multiAnswer.length > 0 : isText ? textVal.trim().length > 0 : answer !== null;

  const handleContinue = () => {
    const ans = isMulti ? multiAnswer : isText ? textVal : answer;
    onContinue(ans, null, null, null, null);
  };

  const SCALE_LABELS = ['1 — Pas du tout', '2 — Peu', '3 — Modérément', '4 — Bien', '5 — Très bien'];

  const handleChoiceSelect = (val) => {
    setAnswer(val);
  };

  return (
    <ScreenWrapper className={themeClass}>
      {onBack && <TopBackLink onClick={onBack} />}
      {showQuitModal && (
        <QuitConfirmModal
          onConfirm={() => { setShowQuitModal(false); onQuit(); }}
          onCancel={() => setShowQuitModal(false)}
        />
      )}

      <div key={questionData.id || current} className="question-wrap animate-fade-up">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <ProgressBar current={current} total={total} />
        </div>

        <h1 className="question-text">{questionData.question}</h1>
        {questionData.hint && <p className="question-desc" style={{ marginBottom: 'var(--space-6)' }}>{questionData.hint}</p>}

        {questionData.relance && (
          <div className="alert alert-info" style={{ marginBottom: 'var(--space-8)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} className="text-blue" style={{ flexShrink: 0 }} />
            <span>{questionData.relance}</span>
          </div>
        )}

        {(() => {
          const choices = questionData?.choices || [];
          const numChoices = choices.length;
          // Use 2x2 grid ONLY for EVEN short choices (2 or 4 options). Odd choice counts (3, 5) use linear cards.
          const isEven2x2Grid = !isText && !isScale && (numChoices === 2 || numChoices === 4) && choices.every(c => (c.label || '').trim().length <= 45);
          const containerClass = isEven2x2Grid ? 'choices-grid-2x2' : 'choices-list';

          if (isText) {
            return (
              <TextArea
                rows={4}
                maxLength={maxLength}
                placeholder={questionData.placeholder || 'Votre réponse...'}
                value={textVal}
                onChange={e => setTextVal(e.target.value)}
              />
            );
          }
          if (isScale) {
            return (
              <div className="choices-list">
                {SCALE_LABELS.map((l, i) => (
                  <ChoiceCard key={i + 1} label={l} selected={answer === i + 1} onClick={() => handleChoiceSelect(i + 1)} />
                ))}
              </div>
            );
          }
          if (isMulti) {
            return (
              <div className={containerClass}>
                {choices.map(c => (
                  <CheckboxCard key={c.id} label={c.label} checked={multiAnswer.includes(c.id)} onChange={() => toggleMulti(c.id)} />
                ))}
              </div>
            );
          }
          return (
            <div className={containerClass}>
              {choices.map(c => (
                <ChoiceCard key={c.id} label={c.label} selected={answer === c.id} onClick={() => handleChoiceSelect(c.id)} />
              ))}
            </div>
          );
        })()}

        <div className="question-quit-row">
          <button
            type="button"
            className="question-quit-btn"
            onClick={() => setShowQuitModal(true)}
          >
            Quitter le diagnostic
          </button>
        </div>
      </div>

      <div className="screen-nav">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Retour
          </Button>
        )}
        <Button variant="primary" disabled={!canContinue} onClick={handleContinue}>
          Continuer
        </Button>
      </div>
    </ScreenWrapper>
  );
};
