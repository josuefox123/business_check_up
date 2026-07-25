import React, { useState, useRef, useEffect } from 'react';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { Button } from '../../ui/index.jsx';
import { Mail, CheckCircle2, AlertOctagon, ArrowLeft, RefreshCw, Lock } from 'lucide-react';
import './EmailVerification.css';

export const EmailVerificationModal = ({
  email,
  onVerify,
  onResendCode,
  onEditEmail,
  isLoading = false,
  errorMsg = ''
}) => {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccessMsg, setResendSuccessMsg] = useState('');
  const [localError, setLocalError] = useState('');
  const inputRefs = useRef([]);

  // Auto-focus first digit box on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Countdown timer for resending code
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (index, value) => {
    const cleanVal = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = cleanVal;
    setDigits(newDigits);
    setLocalError('');

    if (cleanVal && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }

    const fullCode = newDigits.join('');
    if (fullCode.length === 6) {
      handleComplete(fullCode);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (pasteData) {
      const pastedDigits = pasteData.slice(0, 6).split('');
      const newDigits = ['', '', '', '', '', ''];
      pastedDigits.forEach((char, i) => {
        newDigits[i] = char;
      });
      setDigits(newDigits);
      setLocalError('');

      const lastFilledIndex = Math.min(pastedDigits.length, 5);
      if (inputRefs.current[lastFilledIndex]) {
        inputRefs.current[lastFilledIndex].focus();
      }

      const fullCode = newDigits.join('');
      if (fullCode.length === 6) {
        handleComplete(fullCode);
      }
    }
  };

  const handleComplete = (code) => {
    if (code.length !== 6) {
      setLocalError('Veuillez entrer les 6 caractères du code.');
      return;
    }
    if (onVerify) {
      onVerify(code);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || isResending) return;
    setIsResending(true);
    setResendSuccessMsg('');
    setLocalError('');
    try {
      if (onResendCode) {
        await onResendCode();
      }
      setResendSuccessMsg('Un nouveau code à 6 caractères a été envoyé à votre adresse e-mail.');
      setResendTimer(60);
    } catch (err) {
      setLocalError(err.message || 'Impossible de renvoyer le code. Veuillez réessayer.');
    } finally {
      setIsResending(false);
    }
  };

  const currentCode = digits.join('');
  const displayError = errorMsg || localError;

  return (
    <ScreenWrapper>
      <div className="email-verif-container animate-fade-up">
        {onEditEmail && (
          <button
            type="button"
            onClick={onEditEmail}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: 'var(--slate-600)',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '16px',
              padding: 0
            }}
          >
            <ArrowLeft size={16} />
            <span>Modifier l'adresse e-mail</span>
          </button>
        )}

        <div className="email-verif-card">
          {/* Header Icon */}
          <div className="email-verif-icon-badge">
            <Mail size={30} />
          </div>

          <h2 className="email-verif-title">
            Vérification de votre e-mail
          </h2>

          <div className="email-verif-subtitle">
            Un code de sécurité à <strong>6 caractères</strong> a été envoyé à :
            <br />
            <div className="email-target-pill">
              <Mail size={14} />
              <span>{email}</span>
            </div>
          </div>

          {/* Alert Messages */}
          {displayError && (
            <div
              className="alert alert-danger"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#DC2626',
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '20px',
                textAlign: 'left'
              }}
            >
              <AlertOctagon size={18} style={{ flexShrink: 0 }} />
              <span>{displayError}</span>
            </div>
          )}

          {resendSuccessMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#059669',
                background: '#ECFDF5',
                border: '1px solid #6EE7B7',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '20px',
                textAlign: 'left'
              }}
            >
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>{resendSuccessMsg}</span>
            </div>
          )}

          {/* 6 Digit Input Boxes */}
          <div className="otp-inputs-row" onPaste={handlePaste}>
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={el => (inputRefs.current[idx] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(idx, e.target.value)}
                onKeyDown={e => handleKeyDown(idx, e)}
                disabled={isLoading}
                className={`otp-box ${digit ? 'is-filled' : ''}`}
              />
            ))}
          </div>

          {/* Action Button */}
          <Button
            type="button"
            variant="primary"
            full
            size="lg"
            onClick={() => handleComplete(currentCode)}
            disabled={isLoading || currentCode.length !== 6}
            style={{ height: '52px', fontSize: '0.95rem', fontWeight: 700, marginBottom: '16px' }}
          >
            {isLoading ? 'Vérification en cours...' : 'Valider le code et continuer →'}
          </Button>

          {/* Resend Option */}
          <div className="resend-section">
            <Lock size={14} style={{ color: '#94A3B8' }} />
            <span>Code non reçu ?</span>
            {resendTimer > 0 ? (
              <span style={{ fontWeight: 700, color: '#334155' }}>Renvoyer ({resendTimer}s)</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="resend-btn"
              >
                <RefreshCw size={14} className={isResending ? 'animate-spin' : ''} />
                <span>Renvoyer le code</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </ScreenWrapper>
  );
};
