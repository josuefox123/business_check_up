import React, { useState } from 'react';
import {
  Mail, Phone, MapPin, Send, MessageSquare,
  User, Info, ArrowLeft, CheckCircle, Clock, HeadphonesIcon, Globe
} from 'lucide-react';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const isFormValid = formData.name && formData.email && formData.message;

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
        {/* Cercles lumineux en arrière-plan */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-50px',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(52, 190, 213, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-50px',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(52, 190, 213, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(52, 190, 213, 0.12)', color: '#34BED5',
            border: '1px solid rgba(52, 190, 213, 0.25)', borderRadius: '9999px',
            padding: '6px 16px', fontSize: '0.8rem', fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: '24px',
          }}>
            Contact &amp; Support
          </span>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 6vw, 3.2rem)',
            fontWeight: 850, color: '#ffffff',
            letterSpacing: '-0.03em', marginBottom: '20px', lineHeight: 1.15,
          }}>
            Une question ? Parlons-en.
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
            {[
              { icon: Clock, text: 'Réponse sous 48h' },
              { icon: HeadphonesIcon, text: 'Conseillers dédiés' },
              { icon: CheckCircle, text: 'Service gratuit' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '9999px', padding: '8px 20px',
                fontSize: '0.85rem', fontWeight: 600, color: '#E2E8F0',
                backdropFilter: 'blur(4px)',
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
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px',
                }}>
                  <Send size={32} color="#10B981" />
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#17212D', marginBottom: '16px' }}>
                  Message envoyé avec succès !
                </h3>
                <p style={{ color: '#64748B', fontSize: '1.05rem', lineHeight: 1.65, marginBottom: '36px', maxWidth: '480px', margin: '0 auto 36px' }}>
                  Merci pour votre message. Un conseiller de notre équipe va prendre connaissance de votre demande et vous recontactera sous 48 heures.
                </p>
                <button
                  onClick={onBack}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    background: '#17212D', color: '#ffffff',
                    border: 'none', borderRadius: '12px',
                    padding: '14px 28px', fontWeight: 700, fontSize: '1rem',
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.target.style.background = '#2B3A4A'}
                  onMouseLeave={(e) => e.target.style.background = '#17212D'}
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
                    Remplissez ce formulaire et nos équipes vous répondrons dans les plus brefs délais.
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
                      required
                    />
                  </Field>
                  <Field id="email" label="Adresse email" icon={Mail} required>
                    <input
                      type="email" id="email" name="email"
                      placeholder="Ex: j.kodjo@entreprise.bj"
                      value={formData.email} onChange={handleChange}
                      style={inputStyle} onFocus={onFocusStyle} onBlur={onBlurStyle}
                      required
                    />
                  </Field>
                </div>

                <Field id="subject" label="Objet de la demande" icon={Info}>
                  <input
                    type="text" id="subject" name="subject"
                    placeholder="Ex: Partenariat, question technique, accompagnement..."
                    value={formData.subject} onChange={handleChange}
                    style={inputStyle} onFocus={onFocusStyle} onBlur={onBlurStyle}
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
                    required
                  />
                </Field>

                {/* Boutons d'action */}
                <div className="form-btns" style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                  <button
                    type="submit"
                    disabled={!isFormValid}
                    style={{
                      flex: 2, padding: '15px 24px',
                      borderRadius: '12px', fontWeight: 700, fontSize: '1rem',
                      border: 'none',
                      background: isFormValid ? '#17212D' : '#CBD5E1',
                      color: isFormValid ? '#ffffff' : '#94A3B8',
                      cursor: isFormValid ? 'pointer' : 'not-allowed',
                      fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                      transition: 'all 0.2s ease',
                      boxShadow: isFormValid ? '0 4px 12px rgba(23, 33, 69, 0.15)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (isFormValid) e.target.style.background = '#2B3A4A';
                    }}
                    onMouseLeave={(e) => {
                      if (isFormValid) e.target.style.background = '#17212D';
                    }}
                  >
                    <Send size={16} /> Envoyer le message
                  </button>
                  <button
                    type="button"
                    onClick={onBack}
                    style={{
                      flex: 1, padding: '15px 24px', borderRadius: '12px',
                      fontWeight: 600, fontSize: '1rem',
                      border: '1.5px solid #E2E8F0', background: '#ffffff',
                      color: '#475569', cursor: 'pointer',
                      fontFamily: 'inherit', whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#F8FAFC';
                      e.target.style.borderColor = '#CBD5E1';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#ffffff';
                      e.target.style.borderColor = '#E2E8F0';
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

            {/* Carte coordonnées */}
            <div style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '36px',
              boxShadow: '0 10px 30px rgba(15, 23, 42, 0.04)',
              border: '1px solid #E2E8F0',
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#17212D', marginBottom: '28px' }}>
                Nos coordonnées
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {[
                  {
                    icon: Mail, label: 'Email professionnel',
                    value: <a href="mailto:info@fund-lab.org" style={{ color: '#34BED5', fontWeight: 700, textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.target.style.color = '#1A9DB8'} onMouseLeave={(e) => e.target.style.color = '#34BED5'}>info@fund-lab.org</a>,
                  },
                  {
                    icon: Phone, label: 'Téléphone / WhatsApp',
                    value: <span style={{ color: '#17212D', fontWeight: 700 }}>+229 01 9797 1299</span>,
                  },
                  {
                    icon: Globe, label: 'Site Internet',
                    value: <a href="https://fund-lab.org/" target="_blank" rel="noopener noreferrer" style={{ color: '#34BED5', fontWeight: 700, textDecoration: 'none', transition: 'color 0.2s ease' }} onMouseEnter={(e) => e.target.style.color = '#1A9DB8'} onMouseLeave={(e) => e.target.style.color = '#34BED5'}>https://fund-lab.org/</a>,
                  },
                  {
                    icon: MapPin, label: 'Siège social',
                    value: (
                      <span style={{ color: '#17212D', fontWeight: 700, lineHeight: 1.5 }}>
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
                    ),
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                      background: 'rgba(52, 190, 213, 0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={18} color="#34BED5" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
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

      {/* ── Styles responsive ── */}
      <style>{`
        @media (max-width: 960px) {
          .contact-container {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
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
