import React, { useState, useEffect } from 'react';
import { Button, TextArea } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { AlertOctagon, User, Briefcase, MapPin, TrendingUp, ArrowLeft, DollarSign } from 'lucide-react';
import { REGIONS, DEPARTMENT_COMMUNES, SECTORS } from '../../../constants/locationData.js';

const COUNTRIES = [
  { code: 'BJ', name: 'Bénin', prefix: '+229', length: 8, extra: '01' },
  { code: 'CI', name: 'Côte d’Ivoire', prefix: '+225', length: 10 },
  { code: 'SN', name: 'Sénégal', prefix: '+221', length: 9 },
  { code: 'TG', name: 'Togo', prefix: '+228', length: 8 },
  { code: 'CM', name: 'Cameroun', prefix: '+237', length: 9 },
  { code: 'NE', name: 'Niger', prefix: '+227', length: 8 },
  { code: 'BF', name: 'Burkina Faso', prefix: '+226', length: 8 },
  { code: 'ML', name: 'Mali', prefix: '+223', length: 8 },
  { code: 'GA', name: 'Gabon', prefix: '+241', length: 9 },
  { code: 'CD', name: 'Congo (RDC)', prefix: '+243', length: 9 },
  { code: 'CG', name: 'Congo (Brazzaville)', prefix: '+242', length: 9 },
  { code: 'FR', name: 'France', prefix: '+33', length: 9 },
];

export const UserProfileFormScreen = ({ onSubmit, onSkip, onBack, triageAnswers, mode = 'final' }) => {
  const parsePhoneNumber = (num) => {
    if (!num) return { countryCode: 'BJ', suffix: '' };
    const clean = num.replace(/[\s\-\(\)]/g, '');

    if (clean.startsWith('+22901')) return { countryCode: 'BJ', suffix: clean.slice(6) };
    if (clean.startsWith('22901')) return { countryCode: 'BJ', suffix: clean.slice(5) };

    for (const c of COUNTRIES) {
      if (clean.startsWith(c.prefix)) {
        return { countryCode: c.code, suffix: clean.slice(c.prefix.length) };
      }
      const rawPrefix = c.prefix.slice(1);
      if (clean.startsWith(rawPrefix)) {
        return { countryCode: c.code, suffix: clean.slice(rawPrefix.length) };
      }
    }

    if (clean.startsWith('01') && clean.length === 10) return { countryCode: 'BJ', suffix: clean.slice(2) };
    if (clean.length === 8) return { countryCode: 'BJ', suffix: clean };

    return { countryCode: 'BJ', suffix: clean };
  };

  const [form, setForm] = useState(() => {
    const s05 = triageAnswers?.s05 || {};
    const parsedPhone = parsePhoneNumber(triageAnswers?.phone || triageAnswers?.phone_number || '');

    return {
      // Profil utilisateur
      user_profile_type: triageAnswers?.s03 || 'active_entrepreneur',
      full_name: triageAnswers?.name || '',
      phone_country: parsedPhone.countryCode || 'BJ',
      phone_suffix: parsedPhone.suffix || '',
      whatsapp_country: 'BJ',
      whatsapp_suffix: '',
      email: triageAnswers?.email || '',

      // Profil business
      business_name: s05.business_name || '',
      activity_description: s05.activity_description || triageAnswers?.activity_description || '',
      region: s05.region || 'Atlantique',
      commune: s05.commune || '',
      sector: s05.secteur || 'Services',
      sub_sector: s05.soussecteur || '',
      year_created: s05.creation_year ? s05.creation_year.toString() : new Date().getFullYear().toString(),
      ca_n_1: triageAnswers?.ca_n_1 || '',
      ca_m_1: triageAnswers?.ca_m_1 || '',
      activity_stage: triageAnswers?.s04 || 'regular_sales',
      years_in_activity: '',
      employee_count_range: triageAnswers?.employee_count_range || '1-10'
    };
  });

  const [communes, setCommunes] = useState([]);
  const [errors, setErrors] = useState({});
  const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 640 : false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!triageAnswers) return;
    const s05 = triageAnswers.s05 || {};
    const parsedPhone = parsePhoneNumber(triageAnswers.phone || triageAnswers.phone_number || '');

    setForm(prev => ({
      ...prev,
      full_name: triageAnswers.name || prev.full_name,
      email: triageAnswers.email || prev.email,
      phone_country: parsedPhone.countryCode || prev.phone_country,
      phone_suffix: parsedPhone.suffix || prev.phone_suffix,
      business_name: s05.business_name || prev.business_name,
      activity_description: s05.activity_description || triageAnswers.activity_description || prev.activity_description,
      region: s05.region || prev.region,
      commune: s05.commune || prev.commune,
      sector: s05.secteur || prev.sector,
      sub_sector: s05.soussecteur || prev.sub_sector,
      year_created: s05.creation_year ? s05.creation_year.toString() : prev.year_created,
    }));
  }, [triageAnswers]);

  const currentYear = new Date().getFullYear();
  const yearsList = [];
  for (let y = currentYear; y >= 1960; y--) {
    yearsList.push(y);
  }

  // Mettre à jour les communes quand la région change
  useEffect(() => {
    const list = DEPARTMENT_COMMUNES[form.region] || [];
    setCommunes(list);
    if (list.length > 0) {
      setForm(prev => ({ ...prev, commune: list[0] }));
    } else {
      setForm(prev => ({ ...prev, commune: '' }));
    }
  }, [form.region]);

  const handleChange = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
  };

  const isInitial = mode === 'initial';
  const showContactFields = true;
  const showBusinessFields = true;
  const showFinancialFields = false;

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};

    if (!form.full_name || !form.full_name.trim()) {
      newErrors.full_name = "Le nom et prénom du déclarant sont requis.";
    }

    if (!form.email || !form.email.trim()) {
      newErrors.email = "L'adresse e-mail est requise.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email.trim())) {
        newErrors.email = "L'adresse e-mail n'est pas valide (ex: contact@entreprise.com).";
      }
    }

    if (!form.business_name || !form.business_name.trim()) {
      newErrors.business_name = "Le nom de l'entreprise ou projet est requis.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      let calculatedYears = '';
      const year = parseInt(form.year_created, 10);
      if (!isNaN(year)) {
        calculatedYears = Math.max(0, new Date().getFullYear() - year);
      }

      const phoneCountryConfig = COUNTRIES.find(c => c.code === form.phone_country) || COUNTRIES[0];
      const finalPhonePrefix = phoneCountryConfig.code === 'BJ' ? '+22901' : phoneCountryConfig.prefix;

      await onSubmit({
        ...form,
        phone_number: form.phone_suffix ? `${finalPhonePrefix}${form.phone_suffix}` : '',
        whatsapp_number: '',
        years_in_activity: calculatedYears !== '' ? calculatedYears : null
      });
    } catch (err) {
      console.error('Submit error:', err);
      setErrors({ global: err.message || "Une erreur est survenue lors de l'enregistrement de votre profil." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <ScreenWrapper>
      <style>{`
        .profile-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .profile-form-span-2 {
          grid-column: span 2;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-label {
          font-weight: 700 !important;
          font-size: 0.85rem !important;
          color: #1E293B !important;
          margin-bottom: 2px;
        }
        .form-input {
          height: 46px !important;
          border-radius: 12px !important;
          border: 1.5px solid #CBD5E1 !important;
          background: #F8FAFC !important;
          color: #0F172A !important;
          font-size: 0.92rem !important;
          padding: 0 16px !important;
          transition: all 0.2s ease-in-out !important;
          outline: none !important;
          box-sizing: border-box !important;
          width: 100% !important;
        }
        .form-input:focus {
          border-color: #14B8A6 !important;
          background: #ffffff !important;
          box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.1) !important;
        }
        select.form-input {
          cursor: pointer !important;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748B' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          background-size: 16px;
          padding-right: 40px;
        }
        textarea.form-input {
          height: auto !important;
          min-height: 88px !important;
          padding: 12px 16px !important;
          font-family: inherit !important;
          resize: vertical !important;
        }
        .profile-card-container {
          background: #ffffff !important;
          border: 1px solid #E2E8F0 !important;
          border-top: 4px solid var(--color-accent, #34BED5) !important;
          padding: 32px !important;
          border-radius: 20px !important;
          box-shadow: 0 16px 40px rgba(7, 14, 36, 0.05) !important;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        @media (max-width: 640px) {
          .profile-form-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .profile-form-span-2 {
            grid-column: span 1 !important;
          }
          .profile-card-container {
            padding: 20px 16px !important;
            border-radius: 16px !important;
          }
        }
      `}</style>
      <form onSubmit={handleFormSubmit}>
        <div className="animate-fade-up" style={{ maxWidth: '680px', margin: '0 auto', padding: isMobile ? '12px 12px' : '20px 20px' }}>
          <div style={{ marginBottom: isMobile ? '18px' : '28px', textAlign: 'center' }}>
            <h1 style={{ fontSize: isMobile ? '1.4rem' : '1.75rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '6px', letterSpacing: '-0.02em' }}>
              {isInitial ? "Informations générales" : "Finalisez votre profil"}
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)', lineHeight: 1.5 }}>
              {isInitial ? "Veuillez renseigner les éléments ci-dessous pour démarrer votre évaluation." : "Pour recevoir votre rapport et voir vos résultats, merci de compléter les informations ci-dessous."}
            </p>
          </div>

          <div className="profile-card-container">

            {errors.global && (
              <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-danger)', background: 'var(--color-danger-bg)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600 }}>
                <AlertOctagon size={16} />
                <span>{errors.global}</span>
              </div>
            )}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(52, 190, 213, 0.12)', color: '#1A9DB8' }}>
                  <User size={18} />
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-600)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Coordonnées & Structure
                </span>
              </div>

              <div className="profile-form-grid">
                {/* Nom de l'entreprise / projet */}
                <div className="form-group profile-form-span-2">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Nom de l'entreprise / projet <span style={{ color: 'var(--color-danger)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: Ets Soglo & Associés"
                    value={form.business_name}
                    onChange={e => handleChange('business_name', e.target.value)}
                  />
                  {errors.business_name && (
                    <div style={{ color: 'var(--color-danger)', fontSize: '0.78rem', marginTop: '4px', fontWeight: 600 }}>
                      {errors.business_name}
                    </div>
                  )}
                </div>

                {/* Nom & Prénom du déclarant */}
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Nom & Prénom du déclarant <span style={{ color: 'var(--color-danger)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: Koffi SOGLO"
                    value={form.full_name}
                    onChange={e => handleChange('full_name', e.target.value)}
                  />
                  {errors.full_name && (
                    <div style={{ color: 'var(--color-danger)', fontSize: '0.78rem', marginTop: '4px', fontWeight: 600 }}>
                      {errors.full_name}
                    </div>
                  )}
                </div>

                {/* Adresse e-mail */}
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Adresse e-mail <span style={{ color: 'var(--color-danger)' }}>*</span>
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Ex: koffi@soglo.bj"
                    value={form.email}
                    onChange={e => handleChange('email', e.target.value)}
                  />
                  {errors.email && (
                    <div style={{ color: 'var(--color-danger)', fontSize: '0.78rem', marginTop: '4px', fontWeight: 600 }}>
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Description de votre activité */}
                <div className="form-group profile-form-span-2">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                    Description de votre activité
                  </label>
                  <TextArea
                    rows={3}
                    maxLength={500}
                    placeholder="Décrivez brièvement votre activité, vos produits ou services principaux..."
                    value={form.activity_description}
                    onChange={e => handleChange('activity_description', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="screen-nav">
          {onBack && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBackClick}
            >
              Retour
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enregistrement...' : (isInitial ? 'Lancer le diagnostic' : 'Valider et voir mon résultat →')}
          </Button>
        </div>
      </form>
    </ScreenWrapper>
  );
};

