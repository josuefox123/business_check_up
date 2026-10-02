import React, { useState } from 'react';
import {
  Mail, Phone, MapPin, Send, MessageSquare,
  User, Info, ArrowLeft, CheckCircle, Clock, ShieldCheck, Check, X
} from 'lucide-react';
import { apiFetch } from '../../../api/config.js';
import './PublicContact.css';

/* ── Petit composant champ réutilisable ── */
const Field = ({ id, label, icon: Icon, required, children }) => (
  <div className="contact-field-group">
    <label htmlFor={id} className="contact-field-label">
      <Icon size={14} className="contact-label-icon" />
      <span>{label}</span>
      {required && <span className="contact-required-star">*</span>}
    </label>
    {children}
  </div>
);

export const PublicContactScreen = ({ onBack }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
    <div className="contact-page">
      <div className="contact-container">

        {/* ── EN-TÊTE ÉPURÉ (ZÉRO BOURRAGE) ── */}
        <section className="contact-header">
          <span className="contact-tag">Contact &amp; Support</span>
          <h1 className="contact-title">
            Une question ? <span className="contact-title-accent">Parlons-en.</span>
          </h1>
          <p className="contact-desc">
            Notre équipe est à votre disposition pour vous orienter et répondre à vos questions.
          </p>
        </section>

        {/* ── GRILLE PRINCIPALE (UTILISATION COMPACTE DE L'ESPACE) ── */}
        <div className="contact-layout">

          {/* Formulaire Principal */}
          <div className="contact-form-card">
            {submitted ? (
              <div className="contact-success-box">
                <div className="contact-success-icon-wrap">
                  <CheckCircle size={28} />
                </div>
                <h3 className="contact-success-title">Message envoyé !</h3>
                <p className="contact-success-desc">
                  Merci. Un conseiller prendra connaissance de votre demande et vous recontactera sous 48 heures.
                </p>
                <button
                  type="button"
                  className="contact-submit-btn"
                  onClick={onBack}
                  style={{ margin: '0 auto', display: 'inline-flex', minWidth: '200px' }}
                >
                  <ArrowLeft size={16} />
                  <span>Retour à l'accueil</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-form-two-col">
                  <Field id="name" label="Nom complet" icon={User} required>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Ex: Jean KODJO"
                      value={formData.name}
                      onChange={handleChange}
                      className="contact-input"
                      disabled={isSubmitting}
                      required
                    />
                  </Field>

                  <Field id="email" label="Adresse email" icon={Mail} required>
                    <div className="contact-input-wrapper">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Ex: j.kodjo@entreprise.bj"
                        value={formData.email}
                        onChange={handleChange}
                        className="contact-input"
                        style={{ paddingRight: formData.email ? '36px' : '14px' }}
                        disabled={isSubmitting}
                        required
                      />
                      {formData.email && (
                        <span className={`contact-email-feedback ${isEmailValid ? 'valid' : 'invalid'}`}>
                          {isEmailValid
                            ? <Check size={11} color="#10B981" strokeWidth={3} />
                            : <X size={11} color="#EF4444" strokeWidth={3} />}
                        </span>
                      )}
                    </div>
                  </Field>
                </div>

                <Field id="subject" label="Objet de la demande" icon={Info}>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="Ex: Question technique, partenariat, orientation..."
                    value={formData.subject}
                    onChange={handleChange}
                    className="contact-input"
                    disabled={isSubmitting}
                  />
                </Field>

                <Field id="message" label="Message" icon={MessageSquare} required>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Décrivez votre besoin en quelques mots..."
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="contact-textarea"
                    disabled={isSubmitting}
                    required
                  />
                </Field>

                {errorMsg && (
                  <div className="contact-error-banner">
                    <span>{errorMsg}</span>
                    <button
                      type="button"
                      onClick={() => handleSubmit()}
                      className="contact-retry-btn"
                    >
                      Réessayer
                    </button>
                  </div>
                )}

                <div className="contact-actions-row">
                  <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="contact-submit-btn"
                  >
                    <Send size={15} />
                    <span>{isSubmitting ? 'Envoi en cours...' : 'Envoyer'}</span>
                  </button>

                  {onBack && (
                    <button
                      type="button"
                      onClick={onBack}
                      disabled={isSubmitting}
                      className="contact-cancel-btn"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* Carte Coordonnées & Support (Compacte & Structurée) */}
          <div className="contact-info-card">
            <h2 className="contact-info-title">Coordonnées directes</h2>

            <div className="contact-info-list">
              <a href="mailto:info@fund-lab.org" className="contact-info-row">
                <div className="contact-info-icon">
                  <Mail size={16} />
                </div>
                <div className="contact-info-content">
                  <span className="contact-info-label">Email</span>
                  <span className="contact-info-text link">info@fund-lab.org</span>
                </div>
              </a>

              <a href="https://wa.me/2290197971299" target="_blank" rel="noopener noreferrer" className="contact-info-row">
                <div className="contact-info-icon">
                  <Phone size={16} />
                </div>
                <div className="contact-info-content">
                  <span className="contact-info-label">WhatsApp &amp; Téléphone</span>
                  <span className="contact-info-text link">+229 01 9797 1299</span>
                </div>
              </a>

              <div className="contact-info-row">
                <div className="contact-info-icon">
                  <MapPin size={16} />
                </div>
                <div className="contact-info-content">
                  <span className="contact-info-label">Siège social</span>
                  <span className="contact-info-text">Cotonou, Bénin - Marché de Wologuèdè</span>
                  <a
                    href="https://maps.app.goo.gl/zAXiCx6rSomNADwn7?g_st=aw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-maps-link"
                  >
                    Ouvrir sur Google Maps →
                  </a>
                </div>
              </div>
            </div>

            {/* Réassurance intégrée discrète */}
            <div className="contact-reassurance-footer">
              <div className="contact-reassurance-pill">
                <Clock size={13} className="contact-reassurance-icon" />
                <span>Réponse sous 48h ouvrées</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
