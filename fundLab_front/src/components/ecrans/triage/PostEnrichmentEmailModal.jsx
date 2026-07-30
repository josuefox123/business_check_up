import React, { useState } from 'react';
import { Mail, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../../ui/index.jsx';

export const PostEnrichmentEmailModal = ({ onSubmit, onCancel, isLoading = false }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim();
    const cleanName = fullName.trim();

    if (!cleanEmail) {
      setError('Veuillez saisir votre adresse e-mail.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Veuillez saisir une adresse e-mail valide.');
      return;
    }

    onSubmit({
      full_name: cleanName,
      email: cleanEmail
    });
  };

  const submitText = isLoading ? 'Envoi du code...' : 'Recevoir mon code par e-mail';

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
          padding: '36px 28px 28px 28px',
          maxWidth: '440px',
          width: '100%',
          boxShadow: '0 24px 50px rgba(15, 23, 42, 0.25)',
          boxSizing: 'border-box',
          animation: 'modalPop 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(52, 190, 213, 0.12)',
              color: '#34BED5',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}
          >
            <ShieldCheck size={32} />
          </div>

          <h2
            style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              color: '#0F172A',
              margin: '0 0 8px 0',
              letterSpacing: '-0.02em'
            }}
          >
            Adresse e-mail requise
          </h2>

          <p
            style={{
              fontSize: '0.9rem',
              color: '#64748B',
              lineHeight: 1.55,
              margin: 0
            }}
          >
            Pour finaliser l'enrichissement et sécuriser l'envoi de votre rapport de diagnostic, veuillez renseigner votre e-mail pour recevoir un code de vérification unique.
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#DC2626',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '20px'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label
              htmlFor="post-enrichment-fullname"
              style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}
            >
              Nom complet (optionnel)
            </label>
            <div style={{ position: 'relative' }}>
              <User
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94A3B8'
                }}
              />
              <input
                id="post-enrichment-fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Jean Dupont"
                style={{
                  width: '100%',
                  height: '46px',
                  paddingLeft: '42px',
                  paddingRight: '14px',
                  borderRadius: '12px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  color: '#0F172A'
                }}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="post-enrichment-email"
              style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}
            >
              Adresse e-mail <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={18}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94A3B8'
                }}
              />
              <input
                id="post-enrichment-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@exemple.com"
                style={{
                  width: '100%',
                  height: '46px',
                  paddingLeft: '42px',
                  paddingRight: '14px',
                  borderRadius: '12px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  color: '#0F172A'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              style={{
                height: '48px',
                borderRadius: '12px',
                fontWeight: 750,
                fontSize: '0.95rem',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>{submitText}</span>
              {!isLoading && <ArrowRight size={16} />}
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
                style={{
                  height: '44px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  justifyContent: 'center'
                }}
              >
                Annuler
              </Button>
            )}
          </div>
        </form>
      </div>

      <style>{`
        @keyframes modalPop {
          0% { transform: scale(0.92); opacity: 0; }
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
