import React, { useState } from 'react';
import { AlertTriangle, MessageSquare } from 'lucide-react';
import { Button, ChoiceCard, CheckboxCard, ProgressBar } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';
import { AnswerConfirmModal } from '../triage/S04Screen.jsx';

export const ConfidenceModal = ({ confidence, setConfidence, onConfirm, onCancel, choices }) => (
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
          Êtes-vous sûr(e) de votre réponse ?
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', lineHeight: 1.5 }}>
          Votre niveau de certitude nous aide à calibrer la précision de votre diagnostic.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {choices.map(c => (
          <button
            key={c.id}
            type="button"
            onClick={() => setConfidence(c.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1.5px solid',
              borderColor: confidence === c.id ? 'var(--color-blue)' : 'var(--slate-200)',
              background: confidence === c.id ? 'rgba(38,89,242,0.04)' : '#ffffff',
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
              borderColor: confidence === c.id ? 'var(--color-blue)' : 'var(--slate-300)',
              background: confidence === c.id ? 'var(--color-blue)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {confidence === c.id && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffffff' }} />}
            </div>
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '12px', marginTop: '4px' }}>
        <Button variant="outline" onClick={onCancel} style={{ justifyContent: 'center', width: '100%' }}>
          Retour
        </Button>
        <Button variant="primary" disabled={!confidence} onClick={onConfirm} style={{ justifyContent: 'center', width: '100%' }}>
          Confirmer
        </Button>
      </div>
    </div>
  </div>
);

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

  const [answer, setAnswer] = useState(
    (!isMulti && !isText && savedAnswer !== null) ? savedAnswer : null
  );
  const [multiAnswer, setMultiAnswer] = useState(
    isMulti && Array.isArray(savedAnswer) ? savedAnswer : []
  );
  const [textVal, setTextVal] = useState(
    isText && typeof savedAnswer === 'string' ? savedAnswer : ''
  );
  const [showConfidenceModal, setShowConfidenceModal] = useState(false);
  const [confidence, setConfidence] = useState(null);
  const [showProof, setShowProof] = useState(false);
  const [evidenceType, setEvidenceType] = useState('');
  const [evidenceLabel, setEvidenceLabel] = useState('');
  const [showQuitModal, setShowQuitModal] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const CONFIDENCE_CHOICES = [
    { id: 'sure', label: 'Je suis tout à fait sûr(e)' },
    { id: 'estimate', label: 'C\'est une estimation raisonnable' },
    { id: 'not_sure', label: 'Je ne suis pas très sûr(e)' },
    { id: 'unknown', label: 'Je doute fortement / je ne sais pas' },
  ];

  const EVIDENCE_TYPES = [
    { id: 'invoice', label: 'Facture', level: 'E2' },
    { id: 'receipt', label: 'Reçu / Ticket de caisse', level: 'E1' },
    { id: 'bank_statement', label: 'Relevé bancaire', level: 'E3' },
    { id: 'mobile_money', label: 'Relevé Mobile Money', level: 'E3' },
    { id: 'order', label: 'Bon de commande', level: 'E1' },
    { id: 'contract', label: 'Contrat', level: 'E2' },
    { id: 'excel', label: 'Fichier Excel', level: 'E2' },
    { id: 'notebook', label: 'Cahier de caisse', level: 'E2' },
    { id: 'photo', label: 'Photo de preuve', level: 'E1' },
    { id: 'customer_message', label: 'Message client (WhatsApp, SMS...)', level: 'E1' },
    { id: 'tax_document', label: 'Document fiscal', level: 'E3' },
    { id: 'other', label: 'Autre justificatif', level: 'E1' }
  ];

  const toggleMulti = (id) => {
    if (id === 'idk') { setMultiAnswer(['idk']); return; }
    setMultiAnswer(prev => {
      const c = prev.filter(x => x !== 'idk');
      return c.includes(id) ? c.filter(x => x !== id) : [...c, id];
    });
  };

  const canContinue = showProof
    ? evidenceType !== ''
    : (isMulti ? multiAnswer.length > 0 : isText ? textVal.trim().length > 0 : answer !== null);

  const handleContinue = () => {
    if (questionData.requireProof) {
      setShowConfidenceModal(true);
    } else {
      const ans = isMulti ? multiAnswer : isText ? textVal : answer;
      onContinue(ans, null, null, null, null);
    }
  };

  const SCALE_LABELS = ['1 — Pas du tout', '2 — Peu', '3 — Modérément', '4 — Bien', '5 — Très bien'];

  const handleChoiceSelect = (val) => {
    setAnswer(val);
    if (questionData.requireProof) {
      setShowConfidenceModal(true);
    } else {
      let label = '';
      if (val === 'idk') {
        label = 'Je ne sais pas';
      } else if (isScale) {
        label = SCALE_LABELS[val - 1] || '';
      } else {
        label = questionData.choices.find(c => c.id === val)?.label || '';
      }
      setSelectedLabel(label);
      setShowConfirmModal(true);
    }
  };

  const handleConfirmConfidence = () => {
    setShowConfidenceModal(false);
    if (confidence === 'sure') {
      setShowProof(true);
    } else {
      const ans = isMulti ? multiAnswer : isText ? textVal : answer;
      onContinue(ans, null, confidence, null, null);
    }
  };

  const handleConfirmProof = () => {
    const ans = isMulti ? multiAnswer : isText ? textVal : answer;
    const selectedTypeObj = EVIDENCE_TYPES.find(t => t.id === evidenceType);
    const resolvedLevel = selectedTypeObj ? selectedTypeObj.level : 'E1';
    onContinue(ans, resolvedLevel, confidence, evidenceType, evidenceLabel);
  };

  return (
    <ScreenWrapper>
      {!showProof && onBack && <TopBackLink onClick={onBack} />}
      {showQuitModal && (
        <QuitConfirmModal
          onConfirm={() => { setShowQuitModal(false); onQuit(); }}
          onCancel={() => setShowQuitModal(false)}
        />
      )}

      {showConfirmModal && (
        <AnswerConfirmModal
          label={selectedLabel}
          onConfirm={() => {
            setShowConfirmModal(false);
            onContinue(answer, null, null, null, null);
          }}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}

      {showConfidenceModal && (
        <ConfidenceModal
          confidence={confidence}
          setConfidence={setConfidence}
          choices={CONFIDENCE_CHOICES}
          onConfirm={handleConfirmConfidence}
          onCancel={() => setShowConfidenceModal(false)}
        />
      )}

      <div className="question-wrap animate-fade-up">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <ProgressBar current={current} total={total} />
        </div>

        {showProof ? (
          <>
            <p className="question-meta-label" style={{ marginBottom: 'var(--space-3)' }}>Justification de la réponse</p>
            <h1 className="question-heading">Sur quel justificatif vous basez-vous ?</h1>
            <p className="proof-intro" style={{ marginBottom: '24px', color: 'var(--slate-500)', fontSize: '0.85rem' }}>Cette information permet de valider la certitude de vos réponses pour l\'analyse.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-600)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Type de justificatif / preuve
                </label>
                <select
                  value={evidenceType}
                  onChange={e => setEvidenceType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--slate-200)',
                    background: '#ffffff',
                    color: 'var(--slate-800)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    fontFamily: 'var(--font)',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">-- Sélectionnez un type de justificatif --</option>
                  {EVIDENCE_TYPES.map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--slate-600)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Description / Libellé de la preuve
                </label>
                <input
                  type="text"
                  placeholder="Ex: Fichier Excel trésorerie juin 2026, Facture client..."
                  value={evidenceLabel}
                  onChange={e => setEvidenceLabel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--slate-200)',
                    background: '#ffffff',
                    color: 'var(--slate-800)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    fontFamily: 'var(--font)'
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <h1 className="question-text">{questionData.question}</h1>
            {questionData.hint && <p className="question-desc" style={{ marginBottom: 'var(--space-6)' }}>{questionData.hint}</p>}

            {questionData.relance && (
              <div className="alert alert-info" style={{ marginBottom: 'var(--space-8)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} className="text-blue" style={{ flexShrink: 0 }} />
                <span>{questionData.relance}</span>
              </div>
            )}

            {isText ? (
              <textarea
                className="form-input"
                rows={4}
                placeholder={questionData.placeholder || 'Votre réponse...'}
                value={textVal}
                onChange={e => setTextVal(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            ) : isScale ? (
              <div className="choices-list">
                {SCALE_LABELS.map((l, i) => (
                  <ChoiceCard key={i + 1} label={l} selected={answer === i + 1} onClick={() => handleChoiceSelect(i + 1)} />
                ))}
                <ChoiceCard label="Je ne sais pas" selected={answer === 'idk'} onClick={() => handleChoiceSelect('idk')} />
              </div>
            ) : isMulti ? (
              <div className="choices-list">
                {questionData.choices.map(c => (
                  <CheckboxCard key={c.id} label={c.label} checked={multiAnswer.includes(c.id)} onChange={() => toggleMulti(c.id)} />
                ))}
              </div>
            ) : (
              <div className="choices-list">
                {questionData.choices.map(c => (
                  <ChoiceCard key={c.id} label={c.label} selected={answer === c.id} onClick={() => handleChoiceSelect(c.id)} />
                ))}
                {!questionData.noUnknown && !questionData.choices.some(c => c.id === 'idk' || c.label.toLowerCase().includes('ne sais pas')) && (
                  <ChoiceCard label="Je ne sais pas" selected={answer === 'idk'} onClick={() => handleChoiceSelect('idk')} />
                )}
              </div>
            )}
          </>
        )}

        {(isMulti || isText || showProof) ? (
          <div className="screen-nav" style={{ justifyContent: showProof ? 'space-between' : 'flex-end' }}>
            {showProof && (
              <Button variant="outline" onClick={() => { setShowProof(false); setShowConfidenceModal(true); }}>
                Retour
              </Button>
            )}
            <div className="screen-nav-right" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Button variant="primary" disabled={!canContinue} onClick={showProof ? handleConfirmProof : handleContinue}>
                {showProof ? 'Valider la preuve' : 'Continuer'}
              </Button>
            </div>
          </div>
        ) : null}

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
    </ScreenWrapper>
  );
};
