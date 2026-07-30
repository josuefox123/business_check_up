import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Check, Mail, Lock, Eye, EyeOff, RotateCcw } from 'lucide-react';
import logoImg from '../../assets/logo_compact.png';
import { apiFetch, API_BASE_URL } from '../../api/config.js';

export const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState('login'); // 'login' or 'forgot'
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Rule 9: Normalisation des données et états avant le bloc return ()
  const isForgotMode = mode === 'forgot';
  const hasError = Boolean(error);
  const hasSuccess = Boolean(successMessage);
  const errorMessage = error || '[error_message non disponible]';
  const successText = successMessage || '[success_message non disponible]';
  const submitBtnText = isSubmitting
    ? (isForgotMode ? 'Envoi en cours...' : 'Connexion en cours...')
    : (isForgotMode ? 'Envoyer le lien' : 'Se connecter au Panel');
  const passwordInputType = showPassword ? 'text' : 'password';
  const passwordToggleLabel = showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe';

  const handleForgotSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    const forgotUrl = API_BASE_URL.startsWith('http')
      ? API_BASE_URL.replace(/\/bc\/?$/, '/auth/forgot-password')
      : 'https://business-chekcup.nicktep.com/api/auth/forgot-password';

    try {
      const res = await apiFetch(forgotUrl, {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      const returnedMessage = res?.message ?? res?.data?.message ?? `Un lien de réinitialisation a été envoyé à l'adresse : ${email}`;
      setSuccessMessage(returnedMessage);
    } catch (err) {
      console.error('[AdminLogin] Réinitialisation mot de passe échouée:', err);
      const msg = err?.data?.message ?? err?.message ?? '[forgot_password_error] Impossible d’envoyer le lien de réinitialisation. Veuillez ré-essayer.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    const loginUrl = API_BASE_URL.startsWith('http')
      ? API_BASE_URL.replace(/\/bc\/?$/, '/auth/login')
      : 'https://business-chekcup.nicktep.com/api/auth/login';

    try {
      const res = await apiFetch(loginUrl, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      const token = res?.data?.access_token ?? res?.access_token ?? res?.token ?? null;
      if (token) {
        onLogin(token);
      } else {
        onLogin();
      }
    } catch (err) {
      console.error('[AdminLogin] Connexion administration échouée:', err);
      const msg = err?.data?.message ?? err?.message ?? '[auth_login_error] Identifiants incorrects ou serveur indisponible. Veuillez ré-essayer.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSwitchToLogin = () => {
    setMode('login');
    setError('');
    setSuccessMessage('');
  };

  const handleSwitchToForgot = () => {
    setMode('forgot');
    setError('');
    setSuccessMessage('');
  };

  if (isForgotMode) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card animate-fade-up">
          <Link to="/" className="admin-login-logo" style={{ display: 'block', margin: '0 auto 20px', textAlign: 'center' }}>
            <img src={logoImg} alt="FUND.lab Logo" style={{ height: '40px', width: 'auto', display: 'block', margin: '0 auto' }} />
          </Link>
          <h2 className="admin-login-title">Mot de passe oublié</h2>
          <p className="admin-login-sub">Saisissez votre identifiant pour recevoir un lien de réinitialisation.</p>

          {hasError && (
            <div className="admin-login-error" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={handleForgotSubmit}
                disabled={isSubmitting}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 650,
                  textDecoration: 'underline'
                }}
              >
                <RotateCcw size={14} />
                <span>Réessayer</span>
              </button>
            </div>
          )}

          {hasSuccess && (
            <div className="admin-login-success" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(52, 190, 213, 0.1)',
              border: '1px solid rgba(52, 190, 213, 0.2)',
              borderRadius: '8px',
              padding: '12px',
              color: 'var(--color-accent-dark, #1A9DB8)',
              fontSize: '0.84rem',
              fontWeight: 500,
              lineHeight: 1.4,
              marginBottom: '20px'
            }}>
              <Check size={16} style={{ flexShrink: 0 }} />
              <span>{successText}</span>
            </div>
          )}

          <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="admin-login-field-group">
              <label className="admin-login-field-label">Identifiant (E-mail ou Téléphone)</label>
              <div className="admin-login-input-container">
                <Mail size={18} className="admin-login-field-icon" />
                <input
                  type="text"
                  placeholder="exemple@domaine.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="admin-login-input"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <button type="submit" className="admin-login-submit-btn" disabled={isSubmitting}>
              {submitBtnText}
            </button>
          </form>

          <div style={{ marginTop: '28px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleSwitchToLogin}
              disabled={isSubmitting}
              style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.8rem', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Retourner à la connexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card animate-fade-up">
        <Link to="/" className="admin-login-logo" style={{ display: 'block', margin: '0 auto 20px', textAlign: 'center' }}>
          <img src={logoImg} alt="FUND.lab Logo" style={{ height: '40px', width: 'auto', display: 'block', margin: '0 auto' }} />
        </Link>
        <h2 className="admin-login-title">Espace Administration</h2>
        <p className="admin-login-sub">Identifiez-vous pour accéder au tableau de bord.</p>

        {hasError && (
          <div className="admin-login-error" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.8rem',
                fontWeight: 650,
                textDecoration: 'underline'
              }}
            >
              <RotateCcw size={14} />
              <span>Réessayer</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="admin-login-field-group">
            <label className="admin-login-field-label">Identifiant (E-mail ou Téléphone)</label>
            <div className="admin-login-input-container">
              <Mail size={18} className="admin-login-field-icon" />
              <input
                type="text"
                placeholder="E-mail ou Téléphone"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="admin-login-input"
                disabled={isSubmitting}
                required
              />
            </div>
          </div>

          <div className="admin-login-field-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="admin-login-field-label" style={{ marginBottom: 0 }}>Mot de passe</label>
              <button
                type="button"
                onClick={handleSwitchToForgot}
                disabled={isSubmitting}
                style={{ background: 'none', border: 'none', color: 'var(--color-accent, #34BED5)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
              >
                Mot de passe oublié ?
              </button>
            </div>
            <div className="admin-login-input-container">
              <Lock size={18} className="admin-login-field-icon" />
              <input
                type={passwordInputType}
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-login-input"
                style={{ paddingRight: '44px' }}
                disabled={isSubmitting}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={passwordToggleLabel}
                aria-label={passwordToggleLabel}
                disabled={isSubmitting}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  cursor: 'pointer',
                  color: showPassword ? 'var(--color-accent, #34BED5)' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.2s ease',
                  borderRadius: '6px'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="admin-login-submit-btn"
            disabled={isSubmitting}
          >
            {submitBtnText}
          </button>
        </form>

        <div style={{ marginTop: '28px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#64748b', fontSize: '0.8rem', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
            Retourner au site principal
          </Link>
        </div>
      </div>
    </div>
  );
};
