import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/index.jsx';
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

  const [initialStep, setInitialStep] = useState(1);
  const isInitial = mode === 'initial';
  const showContactFields = (isInitial && initialStep === 1) || (!isInitial && (!triageAnswers?.name && !triageAnswers?.phone));
  const showBusinessFields = isInitial && initialStep === 2;
  const showFinancialFields = !isInitial;
 
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const newErrors = {};
 
    if (showContactFields) {
      if (!form.user_profile_type) {
        newErrors.user_profile_type = "Le type de profil utilisateur est requis.";
      }
      
      const phoneCountryConfig = COUNTRIES.find(c => c.code === form.phone_country) || COUNTRIES[0];
      if (form.phone_suffix && form.phone_suffix.trim()) {
        if (form.phone_suffix.trim().length !== phoneCountryConfig.length) {
          newErrors.phone_number = `Le numéro de téléphone doit comporter exactement ${phoneCountryConfig.length} chiffres.`;
        }
      }
      
      if (form.email && form.email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email.trim())) {
          newErrors.email = "L'adresse e-mail n'est pas valide (ex: contact@entreprise.com).";
        }
      }
    }
 
    if (showBusinessFields) {
      if (!form.region) {
        newErrors.region = "La région / département est requise.";
      }
      if (!form.sector) {
        newErrors.sector = "Le secteur d'activité est requis.";
      }
      if (!form.year_created) {
        newErrors.year_created = "L'année de création est requise.";
      }
      if (!form.activity_stage) {
        newErrors.activity_stage = "Le stade d'activité est requis.";
      }
    }
 
    if (showFinancialFields) {
      if (form.ca_n_1 && form.ca_n_1.trim()) {
        const cleanTurnover = form.ca_n_1.replace(/[\s\.FCAfca]/g, '');
        if (isNaN(Number(cleanTurnover))) {
          newErrors.ca_n_1 = "Le chiffre d'affaires annuel doit être un nombre.";
        }
      }
      if (form.ca_m_1 && form.ca_m_1.trim()) {
        const cleanTurnover = form.ca_m_1.replace(/[\s\.FCAfca]/g, '');
        if (isNaN(Number(cleanTurnover))) {
          newErrors.ca_m_1 = "Le chiffre d'affaires mensuel doit être un nombre.";
        }
      }
    }
 
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (isInitial && initialStep === 1) {
      setInitialStep(2);
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
    if (isInitial && initialStep === 2) {
      setInitialStep(1);
    } else if (onBack) {
      onBack();
    }
  };
 
  return (
    <ScreenWrapper>
      <style>{`
        .profile-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .profile-form-span-2 {
          grid-column: span 2;
        }
        @media (max-width: 640px) {
          .profile-form-grid {
            grid-template-columns: 1fr !important;
          }
          .profile-form-span-2 {
            grid-column: span 1 !important;
          }
        }
      `}</style>
      <div className="animate-fade-up" style={{ maxWidth: '680px', margin: '0 auto', padding: isMobile ? '12px 12px' : '20px 20px' }}>
        <div style={{ marginBottom: isMobile ? '18px' : '28px', textAlign: 'center' }}>
          <h1 style={{ fontSize: isMobile ? '1.35rem' : '1.6rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '10px' }}>
            {isInitial && initialStep === 1 && "Peut-on en savoir plus sur vous ?"}
            {isInitial && initialStep === 2 && "Parlez-nous de votre activité"}
            {!isInitial && "Finalisez votre profil"}
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--slate-500)', lineHeight: 1.6 }}>
            {isInitial && initialStep === 1 && "Présentez-vous en quelques secondes pour démarrer votre diagnostic."}
            {isInitial && initialStep === 2 && "Quelques détails sur votre projet ou votre entreprise."}
            {!isInitial && "Pour recevoir votre rapport et voir vos résultats, merci de compléter les informations ci-dessous."}
          </p>
        </div>
 
        <form onSubmit={handleFormSubmit} style={{ background: 'var(--bg-white)', border: '1px solid var(--slate-200)', padding: isMobile ? '16px' : '28px', borderRadius: isMobile ? '12px' : '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: isMobile ? '16px' : '24px' }}>
          
          {errors.global && (
            <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-danger)', background: 'var(--color-danger-bg)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600 }}>
              <AlertOctagon size={16} />
              <span>{errors.global}</span>
            </div>
          )}
 
          {/* Section 1 : Profil Utilisateur */}
          {showContactFields && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--slate-100)', paddingBottom: '8px', marginBottom: '16px' }}>
                <User size={18} style={{ color: 'var(--color-accent)' }} />
                <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#070E24' }}>Profil Utilisateur</h2>
              </div>
              
              <div className="profile-form-grid">
                <div className="form-group profile-form-span-2">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Vous êtes... <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                  <select 
                    className="form-input" 
                    value={form.user_profile_type} 
                    onChange={e => handleChange('user_profile_type', e.target.value)}
                  >
                    <option value="active_entrepreneur">Entrepreneur(e) en activité</option>
                    <option value="project_holder">Porteur de projet / Futur entrepreneur</option>
                    <option value="structured_sme">Dirigeant de PME structurée</option>
                    <option value="distressed_business">Entreprise en difficulté / En restructuration</option>
                    <option value="opportunity_seeker">En recherche d'opportunités de marché / Investissement</option>
                    <option value="institutional_curious">Partenaire / Institutionnel / Curieux</option>
                  </select>
                  {errors.user_profile_type && (
                    <div style={{ color: 'var(--color-danger)', fontSize: '0.78rem', marginTop: '4px', fontWeight: 600 }}>
                      {errors.user_profile_type}
                    </div>
                  )}
                </div>
 
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Nom &amp; Prénom</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: Koffi SOGLO"
                    value={form.full_name}
                    onChange={e => handleChange('full_name', e.target.value)}
                  />
                </div>
 
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Adresse e-mail</label>
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
 
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Téléphone</label>
                  <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                    <div style={{ position: 'relative' }}>
                      <button
                        type="button"
                        onClick={() => setPhoneDropdownOpen(!phoneDropdownOpen)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: 'var(--slate-50)',
                          border: '1px solid var(--slate-300)',
                          borderRight: 'none',
                          padding: '0 12px',
                          borderTopLeftRadius: '8px',
                          borderBottomLeftRadius: '8px',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: 'var(--slate-700)',
                          cursor: 'pointer',
                          outline: 'none',
                          width: '105px',
                          height: '42px',
                          boxSizing: 'border-box',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <img 
                            src={`https://flagcdn.com/w20/${form.phone_country.toLowerCase()}.png`} 
                            alt="" 
                            style={{ width: '20px', height: 'auto', borderRadius: '2px', border: '1px solid var(--slate-200)' }} 
                          />
                          <span>{COUNTRIES.find(c => c.code === form.phone_country)?.prefix}</span>
                        </div>
                        <span style={{ fontSize: '0.6rem', color: 'var(--slate-400)' }}>▼</span>
                      </button>
                      {phoneDropdownOpen && (
                        <>
                          <div 
                            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }} 
                            onClick={() => setPhoneDropdownOpen(false)} 
                          />
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            zIndex: 1000,
                            background: 'white',
                            border: '1px solid var(--slate-200)',
                            borderRadius: '8px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            width: '240px',
                            marginTop: '4px'
                          }}>
                            {COUNTRIES.map(c => (
                              <div
                                key={c.code}
                                onClick={() => {
                                  handleChange('phone_country', c.code);
                                  handleChange('phone_suffix', '');
                                  setPhoneDropdownOpen(false);
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  padding: '10px 12px',
                                  cursor: 'pointer',
                                  fontSize: '0.88rem',
                                  fontWeight: 500,
                                  color: 'var(--slate-700)',
                                  background: form.phone_country === c.code ? 'var(--slate-50)' : 'transparent',
                                  transition: 'background 0.2s'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-100)'}
                                onMouseLeave={e => e.currentTarget.style.background = form.phone_country === c.code ? 'var(--slate-50)' : 'transparent'}
                              >
                                <img 
                                  src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`} 
                                  alt="" 
                                  style={{ width: '20px', height: 'auto', borderRadius: '2px', border: '1px solid var(--slate-200)' }} 
                                />
                                <span style={{ flex: 1 }}>{c.name}</span>
                                <span style={{ color: 'var(--slate-400)', fontWeight: 600 }}>{c.prefix}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    {form.phone_country === 'BJ' && (
                      <div style={{ background: 'var(--slate-100)', border: '1px solid var(--slate-300)', borderRight: 'none', padding: '10px 14px', fontSize: '0.9rem', color: 'var(--slate-600)', fontWeight: 700, userSelect: 'none', height: '42px', display: 'flex', alignItems: 'center', boxSizing: 'border-box' }}>
                        01
                      </div>
                    )}
                    <input
                      type="text"
                      maxLength={form.phone_country === 'BJ' ? 8 : (COUNTRIES.find(c => c.code === form.phone_country)?.length || 10)}
                      className="form-input"
                      placeholder={form.phone_country === 'BJ' ? "XXXXXXXX" : "Numéro de téléphone"}
                      value={form.phone_suffix}
                      onChange={e => handleChange('phone_suffix', e.target.value.replace(/[^0-9]/g, ''))}
                      style={{ borderTopLeftRadius: '0', borderBottomLeftRadius: '0', flex: 1, height: '42px', boxSizing: 'border-box' }}
                    />
                  </div>
                  {errors.phone_number && (
                    <div style={{ color: 'var(--color-danger)', fontSize: '0.78rem', marginTop: '4px', fontWeight: 600 }}>
                      {errors.phone_number}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
 
          {/* Section 2 : Profil de l'entreprise / activité */}
          {showBusinessFields && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--slate-100)', paddingBottom: '8px', marginBottom: '16px' }}>
                <Briefcase size={18} style={{ color: 'var(--color-accent)' }} />
                <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#070E24' }}>Profil de l'entreprise / activité</h2>
              </div>
 
              <div className="profile-form-grid">
                <div className="form-group profile-form-span-2">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Nom de l'entreprise / projet</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: Ets Soglo &amp; Associés"
                    value={form.business_name}
                    onChange={e => handleChange('business_name', e.target.value)}
                  />
                </div>
 
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Département / Région <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                  <select 
                    className="form-input" 
                    value={form.region} 
                    onChange={e => handleChange('region', e.target.value)}
                  >
                    {REGIONS.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  {errors.region && (
                    <div style={{ color: 'var(--color-danger)', fontSize: '0.78rem', marginTop: '4px', fontWeight: 600 }}>
                      {errors.region}
                    </div>
                  )}
                </div>
 
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Commune <span style={{ color: 'var(--slate-400)', fontWeight: 400 }}>(facultatif)</span></label>
                  <select 
                    className="form-input" 
                    value={form.commune} 
                    onChange={e => handleChange('commune', e.target.value)}
                    disabled={communes.length === 0}
                  >
                    {communes.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
 
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Secteur d'activité <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                  <select 
                    className="form-input" 
                    value={form.sector} 
                    onChange={e => handleChange('sector', e.target.value)}
                  >
                    {SECTORS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.sector && (
                    <div style={{ color: 'var(--color-danger)', fontSize: '0.78rem', marginTop: '4px', fontWeight: 600 }}>
                      {errors.sector}
                    </div>
                  )}
                </div>
 
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Sous-secteur <span style={{ color: 'var(--slate-400)', fontWeight: 400 }}>(facultatif)</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: Transformation de manioc"
                    value={form.sub_sector}
                    onChange={e => handleChange('sub_sector', e.target.value)}
                  />
                </div>
 
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Année de création <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                  <select
                    className="form-input"
                    value={form.year_created}
                    onChange={e => handleChange('year_created', e.target.value)}
                  >
                    <option value="">Sélectionnez l'année</option>
                    {yearsList.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  {errors.year_created && (
                    <div style={{ color: 'var(--color-danger)', fontSize: '0.78rem', marginTop: '4px', fontWeight: 600 }}>
                      {errors.year_created}
                    </div>
                  )}
                </div>
 
                <div className="form-group profile-form-span-2">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Stade d'activité <span style={{ color: 'var(--color-danger)' }}>*</span></label>
                  <select 
                    className="form-input" 
                    value={form.activity_stage} 
                    onChange={e => handleChange('activity_stage', e.target.value)}
                  >
                    <option value="not_launched">Pas encore lancé (Idée / R&amp;D)</option>
                    <option value="occasional_sales">Ventes occasionnelles / Lancement</option>
                    <option value="regular_sales">Ventes régulières sur le marché</option>
                    <option value="structured_activity">Activité structurée avec équipe / Locaux</option>
                    <option value="declining_sales">Activité en baisse de régime / Restructuration nécessaire</option>
                  </select>
                  {errors.activity_stage && (
                    <div style={{ color: 'var(--color-danger)', fontSize: '0.78rem', marginTop: '4px', fontWeight: 600 }}>
                      {errors.activity_stage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Section 3 : Informations complémentaires / financières */}
          {showFinancialFields && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--slate-100)', paddingBottom: '8px', marginBottom: '16px' }}>
                <DollarSign size={18} style={{ color: 'var(--color-accent)' }} />
                <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#070E24' }}>Profil de l'entreprise / activité (Compléments)</h2>
              </div>
 
              <div className="profile-form-grid">
                <div className="form-group profile-form-span-2">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Nombre d'employés</label>
                  <select 
                    className="form-input" 
                    value={form.employee_count_range} 
                    onChange={e => handleChange('employee_count_range', e.target.value)}
                  >
                    <option value="1-10">1-10 personnes</option>
                    <option value="11-50">11-50 personnes</option>
                    <option value="51-100">51-100 personnes</option>
                    <option value="101-250">101-250 personnes</option>
                    <option value="251-500">251-500 personnes</option>
                    <option value="501+">Plus de 500 personnes</option>
                  </select>
                </div>
 
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Chiffre d'affaires de l'année dernière (FCFA) <span style={{ color: 'var(--slate-400)', fontWeight: 400 }}>(facultatif)</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: 5 000 000 FCFA"
                    value={form.ca_n_1}
                    onChange={e => handleChange('ca_n_1', e.target.value)}
                  />
                  {errors.ca_n_1 && (
                    <div style={{ color: 'var(--color-danger)', fontSize: '0.78rem', marginTop: '4px', fontWeight: 600 }}>
                      {errors.ca_n_1}
                    </div>
                  )}
                </div>
 
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Chiffre d'affaires du mois dernier (FCFA) <span style={{ color: 'var(--slate-400)', fontWeight: 400 }}>(facultatif)</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: 400 000 FCFA"
                    value={form.ca_m_1}
                    onChange={e => handleChange('ca_m_1', e.target.value)}
                  />
                  {errors.ca_m_1 && (
                    <div style={{ color: 'var(--color-danger)', fontSize: '0.78rem', marginTop: '4px', fontWeight: 600 }}>
                      {errors.ca_m_1}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
 
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {(onBack || (isInitial && initialStep === 2)) && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackClick}
                  style={{ flex: isMobile ? '1 1 100%' : '1', order: isMobile ? 2 : 1, justifyContent: 'center', height: '42px' }}
                >
                  Retour
                </Button>
              )}
              <Button
                type="submit"
                variant="primary"
                style={{ flex: isMobile ? '1 1 100%' : '2', order: isMobile ? 1 : 2, justifyContent: 'center', height: '42px' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enregistrement...' : (isInitial && initialStep === 1 ? 'Continuer →' : (isInitial ? 'Lancer le diagnostic →' : 'Valider et voir mon résultat →'))}
              </Button>
            </div>
          </div>
         </form>
      </div>
    </ScreenWrapper>
  );
};
