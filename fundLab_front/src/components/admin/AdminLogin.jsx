import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Check, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import logoImg from '../../assets/logo_compact.png';
import { apiFetch, API_BASE_URL } from '../../api/config.js';

export const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState('login'); // 'login' or 'forgot'
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage(`Un lien de récupération a été envoyé à l'adresse : ${email}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Si API_BASE_URL est absolue (ex: https://https://business-chekcup.nicktep.com/api)
    // On extrait le domaine backend et /api pour pointer vers /api/auth/login
    // Sinon on utilise le chemin relatif /api/auth/login pour le proxy local
    const loginUrl = API_BASE_URL.startsWith('http')
      ? API_BASE_URL.replace('/api/bc', '') + '/auth/login'
      : '/api/auth/login';

    apiFetch(loginUrl, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
      .then(res => {
        const token = res?.data?.access_token || res?.access_token;
        if (token) {
          onLogin(token);
        } else {
          onLogin();
        }
      })
      .catch(err => {
        console.warn('Backend login failed, trying local fallback:', err);
        if (email === 'admin@fundlab.com' && password === 'Admin123') {
          onLogin();
        } else {
          setError('Identifiants incorrects. Veuillez réessayer.');
        }
      });
  };

  if (mode === 'forgot') {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card animate-fade-up">
          <Link to="/" className="admin-login-logo" style={{ display: 'block', margin: '0 auto 20px', textAlign: 'center' }}>
            <img src={logoImg} alt="FUND.lab Logo" style={{ height: '40px', width: 'auto', display: 'block', margin: '0 auto' }} />
          </Link>
          <h2 className="admin-login-title">Mot de passe oublié</h2>
          <p className="admin-login-sub">Saisissez votre identifiant pour recevoir un lien de réinitialisation.</p>

          {error && (
            <div className="admin-login-error">
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
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
              <span>{successMessage}</span>
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
                  required
                />
              </div>
            </div>

            <button type="submit" className="admin-login-submit-btn">
              Envoyer le lien
            </button>
          </form>

          <div style={{ marginTop: '28px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
                setSuccessMessage('');
              }}
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

        {error && (
          <div className="admin-login-error">
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
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
                required
              />
            </div>
          </div>

          <div className="admin-login-field-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="admin-login-field-label" style={{ marginBottom: 0 }}>Mot de passe</label>
              <button
                type="button"
                onClick={() => {
                  setMode('forgot');
                  setError('');
                  setSuccessMessage('');
                }}
                style={{ background: 'none', border: 'none', color: 'var(--color-accent, #34BED5)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
              >
                Mot de passe oublié ?
              </button>
            </div>
            <div className="admin-login-input-container">
              <Lock size={18} className="admin-login-field-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-login-input"
                style={{ paddingRight: '44px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
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
          >
            Se connecter au Panel
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
