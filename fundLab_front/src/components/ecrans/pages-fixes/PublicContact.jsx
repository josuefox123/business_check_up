import React, { useState } from 'react';
import {
  Mail, Phone, MapPin, Send, MessageSquare,
  User, Info, ArrowLeft, CheckCircle, Clock, HeadphonesIcon, Globe, Check, X
} from 'lucide-react';
import { apiFetch } from '../../../api/config.js';


/* ── Petit composant champ réutilisable ── */
const Field = ({ id, label, icon: Icon, required, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <label htmlFor={id} style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '0.88rem',
      fontWeight: 700,
      color: '#17212D',
      letterSpacing: '0.01em'
    }}>
      <Icon size={14} color="#34BED5" />
      {label}
      {required && <span style={{ color: '#34BED5', marginLeft: '2px' }}>*</span>}
    </label>
    {children}
  </div>
);

/* ── Input stylisé ── */
const inputStyle = {
  width: '100%',
  padding: '14px 18px',
  borderRadius: '12px',
  border: '1.5px solid #E2E8F0',
  fontSize: '0.98rem',
  outline: 'none',
  transition: 'all 0.2s ease',
  background: '#F8FAFC',
  fontFamily: 'inherit',
  color: '#0F172A',
  boxSizing: 'border-box',
};

const onFocusStyle = (e) => {
  e.target.style.borderColor = '#34BED5';
  e.target.style.boxShadow = '0 0 0 4px rgba(52, 190, 213, 0.15)';
  e.target.style.background = '#ffffff';
};

const onBlurStyle = (e) => {
  e.target.style.borderColor = '#E2E8F0';
  e.target.style.boxShadow = 'none';
  e.target.style.background = '#F8FAFC';
};

export const PublicContactScreen = ({ onBack }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Extract, declare and normalize static configuration arrays before return() (Rule 9)
  const reassuranceBadges = [
    { icon: Clock, text: 'Réponse sous 48h' },
    { icon: HeadphonesIcon, text: 'Conseillers dédiés' },
    { icon: CheckCircle, text: 'Service gratuit' },
  ];

  const contactInfoCards = [
    {
      icon: Mail,
      label: 'Email professionnel',
      value: (
        <a
          href="mailto:info@fund-lab.org"
          style={{ color: '#34BED5', fontWeight: 700, textDecoration: 'none', transition: 'color 0.2s ease' }}
          onMouseEnter={(e) => e.target.style.color = '#1A9DB8'}
          onMouseLeave={(e) => e.target.style.color = '#34BED5'}
        >
          info@fund-lab.org
        </a>
      )
    },
    {
      icon: Phone,
      label: 'Téléphone / WhatsApp',
      value: <span style={{ color: '#1A9DB8', fontWeight: 700 }}>+229 01 9797 1299</span>
    },
    {
      icon: Globe,
      label: 'Site Internet',
      value: (
        <a
          href="https://fund-lab.org/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#34BED5', fontWeight: 700, textDecoration: 'none', transition: 'color 0.2s ease' }}
          onMouseEnter={(e) => e.target.style.color = '#1A9DB8'}
          onMouseLeave={(e) => e.target.style.color = '#34BED5'}
        >
          https://fund-lab.org/
        </a>
      )
    },
    {
      icon: MapPin,
      label: 'Siège social',
      value: (
        <span style={{ color: '#1A9DB8', fontWeight: 700, lineHeight: 1.5 }}>
          Cotonou, Bénin<br />
          <span style={{ fontWeight: 500, fontSize: '0.85rem', color: '#64748B' }}>
            Marché de Wologuèdè
          </span><br />
          <a
            href="https://maps.app.goo.gl/zAXiCx6rSomNADwn7?g_st=aw"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#34BED5',
              fontSize: '0.82rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '6px'
            }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            Voir sur Google Maps →
          </a>
        </span>
      )
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      await apiFetch('/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Erreur de soumission du formulaire de contact public :', err);
      // Fallback explicitly referencing the API field name / action context (Rule 7)
      setErrorMsg(err?.message || '[submit_contact_error] Impossible de soumettre le formulaire pour le champ contact. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(formData.email || '');
  const isFormValid = formData.name && formData.email && isEmailValid && formData.message;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F1F5F9',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: '72px', // Compense la hauteur de la navbar fixe
      boxSizing: 'border-box',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>

      {/* ── HERO BANNER ── */}
      <section style={{
        background: 'linear-gradient(135deg, #17212D 0%, #0F172A 100%)',
        padding: '80px 24px 70px',
        textAlign: 'center',
        borderBottom: '4px solid #34BED5',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Dot-grid background pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(52,190,213,0.15) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          pointerEvents: 'none',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        }} />
        {/* Cercles lumineux en arrière-plan */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-50px',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(52, 190, 213, 0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-50px',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(52, 190, 213, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          {/* Badge animé "En ligne" */}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(52, 190, 213, 0.12)', color: '#34BED5',
            border: '1px solid rgba(52, 190, 213, 0.25)', borderRadius: '9999px',
            padding: '6px 16px', fontSize: '0.8rem', fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: '24px',
          }}>
            <span className="contact-online-dot" />
            Contact &amp; Support
          </span>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 6vw, 3.2rem)',
            fontWeight: 850, color: '#ffffff',
            letterSpacing: '-0.03em', marginBottom: '20px', lineHeight: 1.15,
          }}>
            Une question ?{' '}
            <span style={{ color: '#34BED5' }}>Parlons-en.</span>
          </h1>
          <p style={{
            fontSize: '1.15rem', color: '#94A3B8',
            maxWidth: '600px', margin: '0 auto', lineHeight: 1.7,
          }}>
            Que vous soyez entrepreneur, partenaire ou accompagnateur, notre équipe est à votre écoute pour vous guider dans l'utilisation du Business Check-up.
          </p>

          {/* Badges de réassurance */}
          <div style={{
            display: 'flex', justifyContent: 'center', flexWrap: 'wrap',
            gap: '16px', marginTop: '36px',
          }}>
            {reassuranceBadges.map(({ icon: Icon, text }) => (
              <div key={text} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '9999px', padding: '8px 20px',
                fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0',
                backdropFilter: 'blur(8px)',
                transition: 'background 0.2s ease, border-color 0.2s ease',
              }}>
                <Icon size={14} color="#34BED5" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTENU PRINCIPAL ── */}
      <section style={{ padding: '60px 24px 100px', flex: 1 }}>
        <div className="contact-container" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gap: '40px',
          alignItems: 'start',
        }}>

          {/* ── COLONNE GAUCHE : FORMULAIRE ── */}
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '48px',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
            border: '1px solid #E2E8F0',
          }}>
            {submitted ? (
              /* ─ État succès ─ */
              <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                {/* Animated checkmark circle */}
                <div style={{
                  position: 'relative',
                  width: '96px', height: '96px',
                  margin: '0 auto 28px',
                }}>
                  <div className="contact-success-ring" />
                  <div style={{
                    position: 'absolute', inset: '12px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(16,185,129,0.35)',
                  }}>
                    <CheckCircle size={32} color="#ffffff" strokeWidth={2.5} />
                  </div>
                </div>
                <h3 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#17212D', marginBottom: '14px', letterSpacing: '-0.02em' }}>
                  Message envoyé !
                </h3>
                <p style={{ color: '#64748B', fontSize: '1rem', lineHeight: 1.7, marginBottom: '36px', maxWidth: '420px', margin: '0 auto 36px' }}>
                  Merci ! Un conseiller de notre équipe prendra connaissance de votre demande et vous recontactera sous <strong style={{ color: '#17212D' }}>48 heures</strong>.
                </p>
                <button
                  onClick={onBack}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    background: 'linear-gradient(135deg, #17212D, #2B3A4A)', color: '#ffffff',
                    border: 'none', borderRadius: '12px',
                    padding: '14px 28px', fontWeight: 700, fontSize: '1rem',
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 14px rgba(23,33,45,0.25)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(23,33,45,0.35)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(23,33,45,0.25)'; }}
                >
                  <ArrowLeft size={18} /> Retour à l'accueil
                </button>
              </div>
            ) : (
              /* ─ Formulaire ─ */
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#17212D', marginBottom: '8px' }}>
                    Envoyez-nous un message
                  </h2>
                  <p style={{ color: '#64748B', fontSize: '0.95rem', lineHeight: 1.5 }}>
                    Remplissez ce formulaire et nos équipes vous répondront dans les plus brefs délais.
                  </p>
                </div>

                {/* Nom + Email sur 2 colonnes */}
                <div className="form-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <Field id="name" label="Nom complet" icon={User} required>
                    <input
                      type="text" id="name" name="name"
                      placeholder="Ex: Jean KODJO"
                      value={formData.name} onChange={handleChange}
                      style={inputStyle} onFocus={onFocusStyle} onBlur={onBlurStyle}
                      disabled={isSubmitting}
                      required
                    />
                  </Field>
                  <Field id="email" label="Adresse email" icon={Mail} required>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email" id="email" name="email"
                        placeholder="Ex: j.kodjo@entreprise.bj"
                        value={formData.email} onChange={handleChange}
                        style={{ ...inputStyle, paddingRight: formData.email ? '44px' : '18px' }}
                        onFocus={onFocusStyle} onBlur={onBlurStyle}
                        disabled={isSubmitting}
                        required
                      />
                      {formData.email && (
                        <span style={{
                          position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                          width: '22px', height: '22px', borderRadius: '50%',
                          background: isEmailValid ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'background 0.2s ease',
                          pointerEvents: 'none',
                        }}>
                          {isEmailValid
                            ? <Check size={12} color="#10B981" strokeWidth={3} />
                            : <X size={12} color="#EF4444" strokeWidth={3} />}
                        </span>
                      )}
                    </div>
                  </Field>
                </div>

                <Field id="subject" label="Objet de la demande" icon={Info}>
                  <input
                    type="text" id="subject" name="subject"
                    placeholder="Ex: Partenariat, question technique, accompagnement..."
                    value={formData.subject} onChange={handleChange}
                    style={inputStyle} onFocus={onFocusStyle} onBlur={onBlurStyle}
                    disabled={isSubmitting}
                  />
                </Field>

                <Field id="message" label="Message" icon={MessageSquare} required>
                  <textarea
                    id="message" name="message"
                    placeholder="Décrivez votre demande en quelques mots..."
                    value={formData.message} onChange={handleChange}
                    rows="6"
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '140px' }}
                    onFocus={onFocusStyle} onBlur={onBlurStyle}
                    disabled={isSubmitting}
                    required
                  />
                </Field>

                {errorMsg && (
                  <div style={{
                    padding: '14px 18px',
                    borderRadius: '12px',
                    background: '#FEE2E2',
                    border: '1px solid #FCA5A5',
                    color: '#991B1B',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <span>{errorMsg}</span>
                    <button
                      type="button"
                      onClick={() => handleSubmit()}
                      style={{
                        alignSelf: 'flex-start',
                        background: '#991B1B',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Réessayer
                    </button>
                  </div>
                )}

                {/* Boutons d'action */}
                <div className="form-btns" style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                  <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    style={{
                      flex: 2, padding: '15px 24px',
                      borderRadius: '12px', fontWeight: 700, fontSize: '1rem',
                      border: 'none',
                      background: (isFormValid && !isSubmitting) ? '#17212D' : '#CBD5E1',
                      color: (isFormValid && !isSubmitting) ? '#ffffff' : '#94A3B8',
                      cursor: (isFormValid && !isSubmitting) ? 'pointer' : 'not-allowed',
                      fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                      transition: 'all 0.2s ease',
                      boxShadow: (isFormValid && !isSubmitting) ? '0 4px 12px rgba(23, 33, 69, 0.15)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (isFormValid && !isSubmitting) e.target.style.background = '#2B3A4A';
                    }}
                    onMouseLeave={(e) => {
                      if (isFormValid && !isSubmitting) e.target.style.background = '#17212D';
                    }}
                  >
                    <Send size={16} /> {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
                  </button>
                  <button
                    type="button"
                    onClick={onBack}
                    disabled={isSubmitting}
                    style={{
                      flex: 1, padding: '15px 24px', borderRadius: '12px',
                      fontWeight: 600, fontSize: '1rem',
                      border: '1.5px solid #E2E8F0', background: '#ffffff',
                      color: isSubmitting ? '#94A3B8' : '#475569',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit', whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                      opacity: isSubmitting ? 0.6 : 1,
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        e.target.style.background = '#F8FAFC';
                        e.target.style.borderColor = '#CBD5E1';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubmitting) {
                        e.target.style.background = '#ffffff';
                        e.target.style.borderColor = '#E2E8F0';
                      }
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* ── COLONNE DROITE : INFORMATIONS ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>

            {/* Carte coordonnées — design enrichi */}
            <div style={{
              background: 'linear-gradient(160deg, #1E2D3D 0%, #17212D 100%)',
              borderRadius: '24px',
              padding: '36px',
              boxShadow: '0 20px 50px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(52,190,213,0.12)',
              border: '1px solid rgba(52,190,213,0.15)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Orbe décoratif */}
              <div style={{
                position: 'absolute', top: '-40px', right: '-40px',
                width: '200px', height: '200px',
                background: 'radial-gradient(circle, rgba(52,190,213,0.12) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginBottom: '28px', letterSpacing: '-0.01em' }}>
                Nos coordonnées
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {contactInfoCards.map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{
                    display: 'flex', gap: '16px', alignItems: 'flex-start',
                    padding: '16px',
                    borderRadius: '14px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    transition: 'background 0.2s ease, border-color 0.2s ease',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(52,190,213,0.08)'; e.currentTarget.style.borderColor = 'rgba(52,190,213,0.2)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}
                  >
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                      background: 'linear-gradient(135deg, rgba(52,190,213,0.25), rgba(52,190,213,0.1))',
                      border: '1px solid rgba(52,190,213,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={18} color="#34BED5" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '5px' }}>
                        {label}
                      </div>
                      <div style={{ fontSize: '0.95rem' }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── Styles responsive + animations ── */}
      <style>{`
        @keyframes contact-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        @keyframes contact-ring-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .contact-online-dot {
          display: inline-block;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 0 0 rgba(16,185,129,0.5);
          animation: contact-pulse 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }
        .contact-success-ring {
          position: absolute; inset: 0;
          border-radius: 50%;
          border: 2.5px solid transparent;
          border-top-color: #34BED5;
          border-right-color: rgba(52,190,213,0.3);
          animation: contact-ring-spin 1.2s linear infinite;
        }
        @media (max-width: 960px) {
          .contact-container {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
          }
        }
        @media (max-width: 768px) {
          section:last-of-type {
            padding-bottom: 120px !important;
          }
        }
        @media (max-width: 640px) {
          .form-two-col {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .form-btns {
            flex-direction: column !important;
          }
          .form-btns button {
            width: 100% !important;
          }
        }
      `}</style>

    </div>
  );
};
