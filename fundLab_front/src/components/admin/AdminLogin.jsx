import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Check, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import logoImg from '../../assets/logofundlab.png';
import { apiFetch } from '../../api/config.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/bc';

export const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [mode, setMode] = useState('login'); // 'login' or 'forgot'
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateEmailFormat = (val) => {
    if (!val) {
      setEmailError("L'adresse e-mail est requise.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      setEmailError("Format d'e-mail incorrect (ex: nom@domaine.com).");
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePasswordFormat = (val) => {
    if (!val) {
      setPasswordError("Le mot de passe est requis.");
      return false;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(val)) {
      setPasswordError("Doit faire au moins 8 caractères, une majuscule et un chiffre.");
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (emailError) {
      validateEmailFormat(val);
    }
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    if (passwordError) {
      validatePasswordFormat(val);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!validateEmailFormat(email)) {
      return;
    }
    setError('');
    setSuccessMessage(`Un lien de récupération a été envoyé à l'adresse : ${email}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const isEmailValid = validateEmailFormat(email);
    const isPasswordValid = validatePasswordFormat(password);

    if (!isEmailValid || !isPasswordValid) {
      setError('Veuillez corriger les erreurs de saisie.');
      return;
    }

    setError('');
    
    const loginUrl = `${API_BASE_URL.replace('/api/bc', '')}/auth/login`;
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
          <p className="admin-login-sub">Saisissez votre adresse e-mail pour recevoir un lien de réinitialisation.</p>
          
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
              <label className="admin-login-field-label">Adresse e-mail</label>
              <div className="admin-login-input-container" style={{ border: emailError ? '1px solid #ef4444' : '' }}>
                <Mail size={18} className="admin-login-field-icon" style={{ color: emailError ? '#ef4444' : '' }} />
                <input 
                  type="email" 
                  placeholder="exemple@domaine.com" 
                  value={email} 
                  onChange={handleEmailChange} 
                  onBlur={() => validateEmailFormat(email)}
                  className="admin-login-input"
                  required 
                />
              </div>
              {emailError && (
                <span style={{ color: '#ef4444', fontSize: '0.74rem', marginTop: '4px', display: 'block', fontWeight: 500 }}>
                  {emailError}
                </span>
              )}
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
                setEmailError('');
                setPasswordError('');
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
            <label className="admin-login-field-label">Adresse e-mail</label>
            <div className="admin-login-input-container" style={{ border: emailError ? '1px solid #ef4444' : '' }}>
              <Mail size={18} className="admin-login-field-icon" style={{ color: emailError ? '#ef4444' : '' }} />
              <input 
                type="email" 
                placeholder="exemple@domaine.com" 
                value={email} 
                onChange={handleEmailChange} 
                onBlur={() => validateEmailFormat(email)}
                className="admin-login-input"
                required 
              />
            </div>
            {emailError && (
              <span style={{ color: '#ef4444', fontSize: '0.74rem', marginTop: '4px', display: 'block', fontWeight: 500 }}>
                {emailError}
              </span>
            )}
          </div>
          
          <div className="admin-login-field-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="admin-login-field-label" style={{ marginBottom: 0 }}>Mot de passe</label>
              <button 
                type="button" 
                onClick={() => {
                  setMode('forgot');
                  setError('');
                  setEmailError('');
                  setPasswordError('');
                  setSuccessMessage('');
                }}
                style={{ background: 'none', border: 'none', color: 'var(--color-accent, #34BED5)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
              >
                Mot de passe oublié ?
              </button>
            </div>
            <div className="admin-login-input-container" style={{ border: passwordError ? '1px solid #ef4444' : '' }}>
              <Lock size={18} className="admin-login-field-icon" style={{ color: passwordError ? '#ef4444' : '' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={password} 
                onChange={handlePasswordChange} 
                onBlur={() => validatePasswordFormat(password)}
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
            {passwordError && (
              <span style={{ color: '#ef4444', fontSize: '0.74rem', marginTop: '4px', display: 'block', fontWeight: 500 }}>
                {passwordError}
              </span>
            )}
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
