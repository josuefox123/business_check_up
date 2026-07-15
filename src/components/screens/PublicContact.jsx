import React, { useState } from 'react';
import { Button } from '../ui/index.jsx';
import { ScreenWrapper } from '../layout/Navbar.jsx';
import { Mail, Phone, MapPin, Send, MessageSquare, User, Info, ArrowLeft } from 'lucide-react';

export const PublicContactScreen = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulaire de contact soumis:', formData);
    setSubmitted(true);
  };

  const isFormValid = formData.name && formData.email && formData.message;

  return (
    <ScreenWrapper>
      <div className="animate-fade-up" style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--slate-50)' }}>
        
        {/* En-tête Premium avec dégradé subtil */}
        <section style={{ 
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-mid) 100%)', 
          color: 'var(--color-white)', 
          padding: '60px 0', 
          textAlign: 'center',
          borderBottom: '4px solid var(--color-accent)'
        }}>
          <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
            <span className="screen-eyebrow" style={{ 
              background: 'rgba(0, 209, 186, 0.15)', 
              color: 'var(--color-accent)', 
              border: '1px solid rgba(0, 209, 186, 0.3)',
              marginBottom: '16px' 
            }}>
              Contact &amp; Support
            </span>
            <h1 style={{ 
              fontSize: 'clamp(2rem, 5vw, 3rem)', 
              fontWeight: 850, 
              color: '#ffffff', 
              letterSpacing: '-0.03em',
              marginBottom: '16px',
              lineHeight: 1.1
            }}>
              Une question ? Parlons-en.
            </h1>
            <p style={{ 
              fontSize: '1.1rem', 
              color: 'var(--slate-300)', 
              maxWidth: '600px', 
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              Que vous soyez entrepreneur, partenaire ou accompagnateur, notre équipe est là pour vous guider dans l'utilisation du Business Check-up.
            </p>
          </div>
        </section>

        {/* Section de contenu principal */}
        <section className="section" style={{ flex: 1, padding: '60px 0' }}>
          <div className="container" style={{ 
            maxWidth: '1100px', 
            margin: '0 auto', 
            padding: '0 20px',
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '40px',
            alignItems: 'start'
          }}>
            
            {/* Colonne Formulaire */}
            <div style={{ 
              background: '#ffffff', 
              padding: '40px', 
              borderRadius: '24px', 
              boxShadow: '0 10px 30px rgba(10, 23, 69, 0.05)',
              border: '1px solid var(--slate-200)'
            }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    width: '72px', 
                    height: '72px', 
                    borderRadius: '50%', 
                    background: 'var(--color-success-bg)', 
                    color: 'var(--color-success)', 
                    marginBottom: '24px' 
                  }}>
                    <Send size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '12px' }}>
                    Message envoyé avec succès !
                  </h3>
                  <p style={{ color: 'var(--slate-500)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '32px' }}>
                    Merci de nous faire confiance. Un conseiller de notre équipe va prendre connaissance de votre demande et vous recontactera sous 48 heures.
                  </p>
                  <Button variant="primary" onClick={onBack} style={{ gap: '8px' }}>
                    <ArrowLeft size={16} /> Retour à l'accueil
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '4px' }}>
                    Envoyez-nous un message
                  </h2>
                  <p style={{ color: 'var(--slate-500)', fontSize: '0.92rem', marginTop: '-16px', marginBottom: '8px' }}>
                    Remplissez ce formulaire et nous vous répondrons dans les plus brefs délais.
                  </p>

                  <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label htmlFor="name" className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                      <User size={14} color="var(--color-blue)" /> Nom complet <span style={{ color: 'var(--color-accent)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Ex: Jean KODJO"
                      value={formData.name}
                      onChange={handleChange}
                      style={{ 
                        width: '100%', 
                        padding: '14px 18px', 
                        borderRadius: '12px', 
                        border: '1.5px solid var(--slate-200)', 
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        background: 'var(--slate-50)'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-blue)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--slate-200)'}
                      required
                    />
                  </div>

                  <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label htmlFor="email" className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                      <Mail size={14} color="var(--color-blue)" /> Adresse email <span style={{ color: 'var(--color-accent)' }}>*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Ex: j.kodjo@entreprise.bj"
                      value={formData.email}
                      onChange={handleChange}
                      style={{ 
                        width: '100%', 
                        padding: '14px 18px', 
                        borderRadius: '12px', 
                        border: '1.5px solid var(--slate-200)', 
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        background: 'var(--slate-50)'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-blue)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--slate-200)'}
                      required
                    />
                  </div>

                  <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label htmlFor="subject" className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                      <Info size={14} color="var(--color-blue)" /> Objet de votre demande
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      placeholder="Ex: Partenariat, question technique..."
                      value={formData.subject}
                      onChange={handleChange}
                      style={{ 
                        width: '100%', 
                        padding: '14px 18px', 
                        borderRadius: '12px', 
                        border: '1.5px solid var(--slate-200)', 
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        background: 'var(--slate-50)'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-blue)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--slate-200)'}
                    />
                  </div>

                  <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label htmlFor="message" className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                      <MessageSquare size={14} color="var(--color-blue)" /> Message <span style={{ color: 'var(--color-accent)' }}>*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Décrivez votre demande en quelques mots..."
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      style={{ 
                        width: '100%', 
                        padding: '14px 18px', 
                        borderRadius: '12px', 
                        border: '1.5px solid var(--slate-200)', 
                        fontSize: '16px',
                        outline: 'none',
                        resize: 'vertical',
                        transition: 'border-color 0.2s',
                        background: 'var(--slate-50)',
                        minHeight: '120px'
                      }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--color-blue)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--slate-200)'}
                      required
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '14px', marginTop: '10px' }}>
                    <Button variant="primary" type="submit" disabled={!isFormValid} style={{ flex: 1, height: '48px', justifyContent: 'center' }}>
                      Envoyer le message
                    </Button>
                    <Button variant="outline" type="button" onClick={onBack} style={{ height: '48px', justifyContent: 'center' }}>
                      Annuler
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Colonne Coordonnées avec styles intégrés */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Carte Coordonnées */}
              <div style={{ 
                background: '#ffffff', 
                padding: '40px', 
                borderRadius: '24px', 
                boxShadow: '0 10px 30px rgba(10, 23, 69, 0.05)',
                border: '1px solid var(--slate-200)'
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '24px' }}>
                  Nos coordonnées
                </h3>
                
                <div className="info-item">
                  <div className="info-icon" style={{ color: 'var(--color-accent)' }}>
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="info-label">Email professionnel</span>
                    <div className="info-value">
                      <a href="mailto:contact@fundlab.co" style={{ color: 'var(--color-primary)', transition: 'color 0.2s' }}>
                        contact@fundlab.co
                      </a>
                    </div>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon" style={{ color: 'var(--color-accent)' }}>
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="info-label">Téléphone / WhatsApp</span>
                    <div className="info-value" style={{ color: 'var(--color-primary)' }}>
                      +229 00 00 00 00
                    </div>
                  </div>
                </div>

                <div className="info-item" style={{ marginBottom: 0 }}>
                  <div className="info-icon" style={{ color: 'var(--color-accent)' }}>
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="info-label">Siège social</span>
                    <div className="info-value" style={{ color: 'var(--color-primary)', lineHeight: 1.4 }}>
                      Cotonou, Bénin<br />
                      <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--slate-500)' }}>Quartier Ganhi, Avenue Proche CCI</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carte Partenaire / Support */}
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(38, 89, 242, 0.04) 0%, rgba(0, 209, 186, 0.04) 100%)', 
                padding: '30px', 
                borderRadius: '24px', 
                border: '1.5px dashed var(--slate-200)',
                textAlign: 'center'
              }}>
                <h4 style={{ color: 'var(--color-primary)', fontWeight: 800, marginBottom: '8px', fontSize: '1.1rem' }}>
                  Besoin d'un accompagnement direct ?
                </h4>
                <p style={{ color: 'var(--slate-600)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '20px' }}>
                  Le Business Check-up est conçu en partenariat avec des structures d'appui aux entreprises pour vous offrir des solutions de financement et de coaching.
                </p>
                <div style={{ position: 'relative', marginTop: '16px' }}>
                  <iframe 
                    title="Carte CCI Bénin"
                    width="100%" 
                    height="200" 
                    frameBorder="0" 
                    scrolling="no" 
                    marginHeight="0" 
                    marginWidth="0" 
                    src="https://www.openstreetmap.org/export/embed.html?bbox=2.430%2C6.347%2C2.446%2C6.357&amp;layer=mapnik&amp;marker=6.35209%2C2.43795"
                    style={{ 
                      borderRadius: '16px', 
                      border: '1px solid var(--slate-200)',
                      background: '#ffffff'
                    }}
                  />
                  <div style={{ marginTop: '8px', textAlign: 'right' }}>
                    <a 
                      href="https://www.openstreetmap.org/query?lat=6.35209&amp;lon=2.43795#map=17/6.35209/2.43795" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.78rem', color: 'var(--color-blue)', fontWeight: 600 }}
                    >
                      Agrandir la carte ↗
                    </a>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

      </div>
    </ScreenWrapper>
  );
};
