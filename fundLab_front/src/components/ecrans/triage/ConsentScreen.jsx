import React, { useState } from 'react';
import { Lock, Check, ArrowRight, ArrowLeft, RotateCcw, AlertOctagon, Signature } from 'lucide-react';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import './ConsentScreen.css';

export const ConsentScreen = ({ onContinue, onBack }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Rule 9: Normalisation des variables d'affichage au sommet du composant
  const submitBtnText = isSubmitting ? 'Validation...' : 'Accepter et continuer';

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await onContinue({ diag: true, stats: true, contact: true });
    } catch (err) {
      console.error('Consent submission error:', err);
      setErrorMsg(err?.message || '[submit_consent_error] Échec de l’enregistrement de votre consentement. Veuillez ré-essayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenWrapper>
      <div className="consent-wrap animate-fade-up">

        {/* ── EN-TÊTE ── */}
        <div className="consent-header">
          <h1 className="consent-title">Avant de commencer</h1>
        </div>

        {/* ── ÉTAT D'ERREUR AVEC RETRY LOCALISÉ ── */}
        {errorMsg && (
          <div className="consent-error-box">
            <div className="consent-error-content">
              <AlertOctagon size={16} />
              <span>{errorMsg}</span>
            </div>
            <button
              type="button"
              className="consent-btn-outline"
              style={{ minHeight: '34px', padding: '6px 12px', fontSize: '0.8rem' }}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              <RotateCcw size={12} />
              <span>Réessayer</span>
            </button>
          </div>
        )}

        {/* ── CARTE DE CONSENTEMENT (TRUE NORTH) ── */}
        <div className="consent-card">
          <p className="consent-intro-text">
            Vos réponses servent à établir votre diagnostic et vous orienter.
          </p>

          <div className="consent-checklist">
            <div className="consent-check-item">
              <div className="consent-check-icon-wrap">
                <Check size={13} strokeWidth={3} />
              </div>
              <span>J'accepte l'utilisation de mes réponses pour le diagnostic</span>
            </div>
            <div className="consent-check-item">
              <div className="consent-check-icon-wrap">
                <Check size={13} strokeWidth={3} />
              </div>
              <span>J'accepte l'usage agrégé des données</span>
            </div>
            <div className="consent-check-item">
              <div className="consent-check-icon-wrap">
                <Check size={13} strokeWidth={3} />
              </div>
              <span>J'accepte d'être recontacté</span>
            </div>
          </div>

          <div className="consent-storage-note">
            <Lock size={15} className="consent-storage-icon" />
            <span>Vos réponses sont sauvegardées automatiquement et conservées pendant <strong>7 jours</strong> sur cet appareil.</span>
          </div>
        </div>

        {/* ── NAVIGATION ── */}
        <div className="consent-nav-row">
          {onBack ? (
            <button
              type="button"
              className="consent-btn-outline"
              onClick={onBack}
              disabled={isSubmitting}
            >
              <ArrowLeft size={16} />
              <span>Retour</span>
            </button>
          ) : <div />}

          <button
            type="button"
            className="consent-btn-primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <span>{submitBtnText}</span>
            {!isSubmitting && <ArrowRight size={16} />}
          </button>
        </div>

      </div>
    </ScreenWrapper>
  );
};
