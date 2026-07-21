import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import { ProgressBar } from '../../ui/ProgressBar';
import './ContactForm.css';

export const ContactForm = ({ progress, onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = formData.firstName && formData.lastName && formData.email;

  return (
    <div className="contact-container animate-fade-in">
      <div className="contact-content">
        <ProgressBar progress={progress} />
        
        <div className="contact-header">
          <h2>Merci ! Votre diagnostic est prêt.</h2>
          <p>Entrez vos coordonnées pour recevoir immédiatement votre diagnostic détaillé par email.</p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="input-group">
              <label htmlFor="firstName" className="input-label">Prénom</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="input-field"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="lastName" className="input-label">Nom</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="input-field"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="input-group">
            <label htmlFor="email" className="input-label">Email professionnel</label>
            <input
              type="email"
              id="email"
              name="email"
              className="input-field"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="phone" className="input-label">Téléphone (optionnel)</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="input-field"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="contact-actions">
            <Button variant="outline" onClick={onBack}>
              Retour
            </Button>
            <Button 
              variant="secondary" 
              type="submit"
              disabled={!isFormValid}
            >
              Obtenir mon rapport personnalisé
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
