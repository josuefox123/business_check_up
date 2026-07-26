import React, { useState, useEffect } from 'react';
import { Button, TextArea } from '../../ui/index.jsx';
import { CustomSelect } from '../../ui/CustomSelect.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';
import { AlertOctagon, User, Briefcase, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { REGIONS, DEPARTMENT_COMMUNES, SECTORS } from '../../../constants/locationData.js';
import { BACKEND_REFERENCES } from '../../../constants/referenceData.js';

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

const PROFILE_TYPES = BACKEND_REFERENCES.user_profile_type || [];
const ACTIVITY_STAGES = BACKEND_REFERENCES.activity_stage || [];

const EMPLOYEE_RANGES = [
  { id: '1-10', label: '1 à 10 employés' },
  { id: '11-50', label: '11 à 50 employés' },
  { id: '51-100', label: '51 à 100 employés' },
  { id: '101-250', label: '101 à 250 employés' },
  { id: '251-500', label: '251 à 500 employés' },
  { id: '501+', label: 'Plus de 500 employés (501+)' }
];

const formatCustomText = (text) => {
  if (!text) return '';
  const clean = text.trimStart();
  if (clean.length === 0) return '';
  return clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
};

export const UserProfileFormScreen = ({ onSubmit, onSkip, onBack, triageAnswers, mode = 'final', onExistingDiagnostic }) => {
  const [isExistingUser, setIsExistingUser] = useState(false);
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
      user_profile_type: triageAnswers?.s03 || triageAnswers?.user_profile_type || '',
      full_name: triageAnswers?.name || '',
      phone_country: parsedPhone.countryCode || 'BJ',
      phone_suffix: parsedPhone.suffix || '',
      whatsapp_country: 'BJ',
      whatsapp_suffix: '',
      email: triageAnswers?.email || '',
      business_name: s05.business_name || '',

      activity_description: s05.activity_description || triageAnswers?.activity_description || '',
      region: s05.region || '',
      commune: s05.commune || '',
      other_commune: '',
      sector: s05.secteur || '',
      other_sector: '',
      sub_sector: s05.soussecteur || '',
      year_created: s05.creation_year ? s05.creation_year.toString() : '',
      ca_n_1: triageAnswers?.ca_n_1 || '',
      ca_m_1: triageAnswers?.ca_m_1 || '',
      activity_stage: triageAnswers?.s04 || triageAnswers?.activity_stage || '',
      employee_count_range: triageAnswers?.employee_count_range || '',
      other_employee_count_range: ''
    };
  });

  const [communes, setCommunes] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);
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
      user_profile_type: triageAnswers.s03 || prev.user_profile_type,
      activity_stage: triageAnswers.s04 || prev.activity_stage
    }));
  }, [triageAnswers]);

  const currentYear = new Date().getFullYear();
  const yearsList = [];
  for (let y = currentYear; y >= 1960; y--) {
    yearsList.push(y.toString());
  }

  // Mettre à jour les communes quand la région change (en incluant 'Autre')
  useEffect(() => {
    if (!form.region) {
      setCommunes([]);
      return;
    }
    const list = DEPARTMENT_COMMUNES[form.region] ? [...DEPARTMENT_COMMUNES[form.region], 'Autre'] : ['Autre'];
    setCommunes(list);
    if (form.commune && list.length > 0 && !list.includes(form.commune)) {
      setForm(prev => ({ ...prev, commune: '' }));
    }
  }, [form.region]);

  const handleChange = (field, val) => {
    setForm(prev => ({ ...prev, [field]: val }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};

    if (!form.email || !form.email.trim()) {
      newErrors.email = "L'adresse e-mail est requise.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email.trim())) {
        newErrors.email = "L'adresse e-mail n'est pas valide (ex: contact@entreprise.com).";
      }
    }

    if (isExistingUser) {
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setIsSubmitting(true);
      try {
        if (onExistingDiagnostic) {
          await onExistingDiagnostic(form.email.trim());
        } else {
          await onSubmit({
            email: form.email.trim(),
            is_existing_lookup: true
          });
        }
      } catch (err) {
        console.error('Existing diagnostic submit error:', err);
        setErrors({ global: err.message || "Erreur lors de la vérification de l'adresse email." });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const phoneCountryConfig = COUNTRIES.find(c => c.code === form.phone_country) || COUNTRIES[0];

    if (!form.full_name || !form.full_name.trim()) {
      newErrors.full_name = "Le nom et prénom du déclarant sont requis.";
    }

    if (!form.business_name || !form.business_name.trim()) {
      newErrors.business_name = "Le nom de l'entreprise ou projet est requis.";
    }

    if (!form.phone_suffix || !form.phone_suffix.trim()) {
      newErrors.phone_number = "Le numéro de téléphone est requis.";
    } else if (form.phone_suffix.trim().length !== phoneCountryConfig.length) {
      newErrors.phone_number = `Le numéro de téléphone doit comporter exactement ${phoneCountryConfig.length} chiffres.`;
    }

    if (!form.activity_description || !form.activity_description.trim()) {
      newErrors.activity_description = "La description de votre activité est requise.";
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

      const finalPhonePrefix = phoneCountryConfig.code === 'BJ' ? '+22901' : phoneCountryConfig.prefix;

      const finalSector = form.sector === 'Autre' ? formatCustomText(form.other_sector) : form.sector;
      const finalCommune = form.commune === 'Autre' ? formatCustomText(form.other_commune) : form.commune;
      const finalEmpRange = form.employee_count_range === 'Autre' ? formatCustomText(form.other_employee_count_range) : form.employee_count_range;

      await onSubmit({
        ...form,
        sector: finalSector,
        commune: finalCommune,
        employee_count_range: finalEmpRange,
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

    const sectorOptions = SECTORS.includes('Autre') ? SECTORS : [...SECTORS, 'Autre'];

    return (
      <ScreenWrapper wide>
        {onBack && <TopBackLink onClick={onBack} />}

        <style>{`
        .pg-form-container {
          width: 100%;
          max-width: 740px;
          margin: 0 auto;
          padding: 16px 12px 48px 12px;
          box-sizing: border-box;
        }

        .pg-form-section {
          margin-bottom: 32px;
        }

        .pg-section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
          padding-bottom: 10px;
          border-bottom: 1.5px solid #E2E8F0;
        }

        .pg-section-icon {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          background: rgba(52, 190, 213, 0.12);
          color: #1A9DB8;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .pg-section-title {
          font-size: 0.88rem;
          font-weight: 800;
          color: #17212D;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin: 0;
        }

        .pg-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .pg-span-2 {
          grid-column: span 2;
        }

        .pg-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .pg-field-label {
          font-weight: 700 !important;
          font-size: 0.86rem !important;
          color: #17212D !important;
          margin: 0;
        }

        .pg-field-input {
          height: 48px !important;
          border-radius: 14px !important;
          border: 1.5px solid #CBD5E1 !important;
          background: #ffffff !important;
          color: #0F172A !important;
          font-size: 0.94rem !important;
          padding: 0 16px !important;
          transition: all 0.2s ease-in-out !important;
          outline: none !important;
          box-sizing: border-box !important;
          width: 100% !important;
          box-shadow: 0 2px 4px rgba(15, 23, 42, 0.02) !important;
        }

        .pg-field-input:focus {
          border-color: #34BED5 !important;
          box-shadow: 0 0 0 4px rgba(52, 190, 213, 0.14) !important;
        }

        textarea.pg-field-input {
          height: auto !important;
          min-height: 90px !important;
          padding: 12px 16px !important;
          font-family: inherit !important;
          resize: vertical !important;
        }

        .pg-action-nav {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 36px;
          width: 100%;
        }

        .pg-btn-submit {
          flex: 1 !important;
          min-width: 0 !important;
          height: 52px !important;
          border-radius: 14px !important;
          font-weight: 800 !important;
          font-size: clamp(0.84rem, 3.5vw, 0.96rem) !important;
          background: #17212D !important;
          color: #ffffff !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          box-shadow: 0 8px 22px rgba(23, 33, 45, 0.22) !important;
          white-space: nowrap !important;
          padding: 0 16px !important;
        }

        @media (max-width: 640px) {
          .pg-form-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .pg-span-2 {
            grid-column: span 1 !important;
          }
        }
      `}</style>

        <div className="pg-form-container animate-fade-up">
          {/* Page Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.85rem)', fontWeight: 800, color: '#17212D', marginBottom: '8px', letterSpacing: '-0.02em' }}>
              {isExistingUser ? "Retrouver mon diagnostic" : "Informations Générales"}
            </h1>
            <p style={{ fontSize: '0.94rem', color: '#64748B', lineHeight: 1.55, maxWidth: '560px', margin: '0 auto', marginBottom: '16px' }}>
              {isExistingUser 
                ? "Saisissez votre adresse e-mail pour recevoir votre code de vérification et accéder à votre historique."
                : "Renseignez les informations de votre entreprise ci-dessous pour démarrer le questionnaire."}
            </p>

            <button
              type="button"
              onClick={() => {
                setIsExistingUser(!isExistingUser);
                setErrors({});
              }}
              style={{
                background: 'rgba(52, 190, 213, 0.08)',
                border: '1px solid rgba(52, 190, 213, 0.3)',
                color: '#1A9DB8',
                fontSize: '0.86rem',
                fontWeight: 700,
                padding: '8px 16px',
                borderRadius: '9999px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {isExistingUser ? "← Remplir le formulaire complet" : "J'ai déjà effectué un diagnostic"}
            </button>
          </div>

          <form onSubmit={handleFormSubmit}>
            {errors.global && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#DC2626', background: '#FEF2F2', border: '1px solid #FEE2E2', padding: '12px 16px', borderRadius: '12px', fontSize: '0.86rem', fontWeight: 600, marginBottom: '24px' }}>
                <AlertOctagon size={18} />
                <span>{errors.global}</span>
              </div>
            )}

            {isExistingUser ? (
              /* MODE VÉRIFICATION D'UN DIAGNOSTIC EXISTANT */
              <div className="pg-form-section">
                <div className="pg-field-group">
                  <label className="pg-field-label">
                    Votre adresse e-mail <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <input
                    type="email"
                    className="pg-field-input"
                    placeholder="Ex: koffi@soglo.bj"
                    value={form.email}
                    onChange={e => handleChange('email', e.target.value)}
                  />
                  {errors.email && (
                    <span style={{ color: '#DC2626', fontSize: '0.78rem', fontWeight: 600 }}>
                      {errors.email}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              /* MODE FORMULAIRE COMPLET */
              <>
                {/* Section 1: Coordonnées de base */}
                <div className="pg-form-section">
                  <div className="pg-section-header">
                    <div className="pg-section-icon">
                      <User size={18} />
                    </div>
                    <h3 className="pg-section-title">Coordonnées de base</h3>
                  </div>

                  <div className="pg-form-grid">
                    <div className="pg-field-group pg-span-2">
                      <label className="pg-field-label">
                        Nom de l'entreprise / projet <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="pg-field-input"
                        placeholder="Ex: Ets Soglo & Associés"
                        value={form.business_name}
                        onChange={e => handleChange('business_name', e.target.value)}
                      />
                      {errors.business_name && (
                        <span style={{ color: '#DC2626', fontSize: '0.78rem', fontWeight: 600 }}>
                          {errors.business_name}
                        </span>
                      )}
                    </div>

                    <div className="pg-field-group">
                      <label className="pg-field-label">
                        Nom & Prénom du déclarant <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="pg-field-input"
                        placeholder="Ex: Koffi SOGLO"
                        value={form.full_name}
                        onChange={e => handleChange('full_name', e.target.value)}
                      />
                      {errors.full_name && (
                        <span style={{ color: '#DC2626', fontSize: '0.78rem', fontWeight: 600 }}>
                          {errors.full_name}
                        </span>
                      )}
                    </div>

                    <div className="pg-field-group">
                      <label className="pg-field-label">
                        Adresse e-mail <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <input
                        type="email"
                        className="pg-field-input"
                        placeholder="Ex: koffi@soglo.bj"
                        value={form.email}
                        onChange={e => handleChange('email', e.target.value)}
                      />
                      {errors.email && (
                        <span style={{ color: '#DC2626', fontSize: '0.78rem', fontWeight: 600 }}>
                          {errors.email}
                        </span>
                      )}
                    </div>

                    <div className="pg-field-group">
                      <label className="pg-field-label">
                        Numéro de téléphone <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                        <div style={{ position: 'relative' }}>
                          <button
                            type="button"
                            className="pg-field-input"
                            onClick={() => setPhoneDropdownOpen(!phoneDropdownOpen)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '0 10px',
                              borderTopRightRadius: 0,
                              borderBottomRightRadius: 0,
                              borderRight: 'none',
                              background: '#F8FAFC',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <img 
                              src={`https://flagcdn.com/w20/${(COUNTRIES.find(c => c.code === form.phone_country) || COUNTRIES[0]).code.toLowerCase()}.png`} 
                              alt="" 
                              style={{ width: '18px', height: 'auto', borderRadius: '2px' }} 
                            />
                            <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#334155' }}>
                              {(COUNTRIES.find(c => c.code === form.phone_country) || COUNTRIES[0]).prefix}
                            </span>
                          </button>

                          {phoneDropdownOpen && (
                            <>
                              <div style={{ position: 'fixed', inset: 0, zIndex: 90 }} onClick={() => setPhoneDropdownOpen(false)} />
                              <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                zIndex: 100,
                                background: '#FFFFFF',
                                border: '1px solid #E2E8F0',
                                borderRadius: '10px',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                width: '240px',
                                marginTop: '4px'
                              }}>
                                {COUNTRIES.map(c => (
                                  <div
                                    key={c.code}
                                    onClick={() => {
                                      setForm(prev => ({ ...prev, phone_country: c.code, phone_suffix: '' }));
                                      setPhoneDropdownOpen(false);
                                    }}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '10px',
                                      padding: '10px 12px',
                                      cursor: 'pointer',
                                      fontSize: '0.86rem',
                                      fontWeight: 500,
                                      color: '#334155',
                                      background: form.phone_country === c.code ? '#F1F5F9' : 'transparent'
                                    }}
                                  >
                                    <img 
                                      src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`} 
                                      alt="" 
                                      style={{ width: '18px', height: 'auto', borderRadius: '2px' }} 
                                    />
                                    <span style={{ flex: 1 }}>{c.name}</span>
                                    <span style={{ color: '#94A3B8', fontWeight: 600 }}>{c.prefix}</span>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}
                        </div>

                        {form.phone_country === 'BJ' && (
                          <div style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRight: 'none', padding: '0 12px', fontSize: '0.88rem', color: '#475569', fontWeight: 700, height: '44px', display: 'flex', alignItems: 'center', boxSizing: 'border-box' }}>
                            01
                          </div>
                        )}

                        <input 
                          type="text" 
                          className="pg-field-input" 
                          maxLength={form.phone_country === 'BJ' ? 8 : (COUNTRIES.find(c => c.code === form.phone_country)?.length || 10)}
                          placeholder={form.phone_country === 'BJ' ? "XXXXXXXX" : "Numéro de téléphone"} 
                          value={form.phone_suffix} 
                          onChange={e => handleChange('phone_suffix', e.target.value.replace(/[^0-9]/g, ''))} 
                          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, flex: 1 }}
                        />
                      </div>
                      {errors.phone_number && (
                        <span style={{ color: '#DC2626', fontSize: '0.78rem', fontWeight: 600 }}>
                          {errors.phone_number}
                        </span>
                      )}
                    </div>

                    <div className="pg-field-group pg-span-2">
                      <label className="pg-field-label">
                        Description rapide de votre activité <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <TextArea
                        rows={2}
                        maxLength={500}
                        placeholder="Décrivez brièvement votre activité principale..."
                        value={form.activity_description}
                        onChange={e => handleChange('activity_description', e.target.value)}
                      />
                      {errors.activity_description && (
                        <span style={{ color: '#DC2626', fontSize: '0.78rem', fontWeight: 600 }}>
                          {errors.activity_description}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 2: Activité & Secteur */}
                <div className="pg-form-section">
                  <div className="pg-section-header">
                    <div className="pg-section-icon">
                      <Briefcase size={18} />
                    </div>
                    <h3 className="pg-section-title">Activité & Secteur</h3>
                  </div>

                  <div className="pg-form-grid">
                    {/* Secteur d'activité */}
                    <div className="pg-field-group">
                      <label className="pg-field-label">
                        Secteur d'activité
                      </label>
                      <CustomSelect
                        options={sectorOptions}
                        value={form.sector}
                        onChange={val => handleChange('sector', val)}
                        error={errors.sector}
                      />
                      {form.sector === 'Autre' && (
                        <div style={{ marginTop: '8px' }}>
                          <input
                            type="text"
                            className="pg-field-input"
                            placeholder="Précisez votre secteur d'activité..."
                            value={form.other_sector}
                            onChange={e => handleChange('other_sector', formatCustomText(e.target.value))}
                          />
                        </div>
                      )}
                      {errors.sector && (
                        <span style={{ color: '#DC2626', fontSize: '0.78rem', fontWeight: 600 }}>
                          {errors.sector}
                        </span>
                      )}
                    </div>

                    {/* Sous-secteur */}
                    <div className="pg-field-group">
                      <label className="pg-field-label">
                        Sous-secteur d'activité
                      </label>
                      <input
                        type="text"
                        className="pg-field-input"
                        placeholder="Ex: Transformation agroalimentaire"
                        value={form.sub_sector}
                        onChange={e => handleChange('sub_sector', e.target.value)}
                      />
                    </div>

                    {/* Stade d'activité */}
                    <div className="pg-field-group pg-span-2">
                      <label className="pg-field-label">
                        Stade actuel de votre activité
                      </label>
                      <CustomSelect
                        options={ACTIVITY_STAGES}
                        value={form.activity_stage}
                        onChange={val => handleChange('activity_stage', val)}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Localisation & Structure */}
                <div className="pg-form-section">
                  <div className="pg-section-header">
                    <div className="pg-section-icon">
                      <MapPin size={18} />
                    </div>
                    <h3 className="pg-section-title">Localisation & Structure</h3>
                  </div>

                  <div className="pg-form-grid">
                    {/* Région */}
                    <div className="pg-field-group">
                      <label className="pg-field-label">
                        Département / Région
                      </label>
                      <CustomSelect
                        options={REGIONS}
                        value={form.region}
                        onChange={val => handleChange('region', val)}
                      />
                    </div>

                    {/* Commune */}
                    <div className="pg-field-group">
                      <label className="pg-field-label">
                        Commune
                      </label>
                      <CustomSelect
                        options={communes}
                        value={form.commune}
                        onChange={val => handleChange('commune', val)}
                      />
                      {form.commune === 'Autre' && (
                        <div style={{ marginTop: '8px' }}>
                          <input
                            type="text"
                            className="pg-field-input"
                            placeholder="Précisez votre commune..."
                            value={form.other_commune}
                            onChange={e => handleChange('other_commune', formatCustomText(e.target.value))}
                          />
                        </div>
                      )}
                      {errors.commune && (
                        <span style={{ color: '#DC2626', fontSize: '0.78rem', fontWeight: 600 }}>
                          {errors.commune}
                        </span>
                      )}
                    </div>

                    {/* Année de création */}
                    <div className="pg-field-group">
                      <label className="pg-field-label">
                        Année de création
                      </label>
                      <CustomSelect
                        options={yearsList}
                        value={form.year_created}
                        onChange={val => handleChange('year_created', val)}
                      />
                    </div>

                    {/* Tranche d'effectifs */}
                    <div className="pg-field-group">
                      <label className="pg-field-label">
                        Tranche d'effectifs (employés)
                      </label>
                      <CustomSelect
                        options={EMPLOYEE_RANGES}
                        value={form.employee_count_range}
                        onChange={val => handleChange('employee_count_range', val)}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Profil Entrepreneurial */}
                <div className="pg-form-section">
                  <div className="pg-section-header">
                    <div className="pg-section-icon">
                      <User size={18} />
                    </div>
                    <h3 className="pg-section-title">Profil Entrepreneurial</h3>
                  </div>

                  <div className="pg-form-grid">
                    <div className="pg-field-group pg-span-2">
                      <label className="pg-field-label">
                        Votre profil d'entrepreneur
                      </label>
                      <CustomSelect
                        options={PROFILE_TYPES}
                        value={form.user_profile_type}
                        onChange={val => handleChange('user_profile_type', val)}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="pg-action-nav">
              {onBack && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  style={{ height: '52px', borderRadius: '14px', fontWeight: 700, padding: '0 20px', flexShrink: 0 }}
                >
                  Retour
                </Button>
              )}
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="pg-btn-submit"
              >
                <span>
                  {isSubmitting 
                    ? (isExistingUser ? 'Vérification...' : 'Enregistrement...') 
                    : (isExistingUser ? 'Retrouver mon diagnostic' : 'Lancer le diagnostic')}
                </span>
                <ArrowRight size={18} style={{ flexShrink: 0 }} />
              </Button>
            </div>
          </form>
        </div>
      </ScreenWrapper>
    );
  };
