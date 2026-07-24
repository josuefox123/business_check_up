import React, { useState } from 'react';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { Button } from '../../ui/index.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';
import { REGIONS, SECTORS, DEPARTMENT_COMMUNES } from '../../../constants/locationData.js';
import { AlertOctagon } from 'lucide-react';

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
  { code: 'GN', name: 'Guinée', prefix: '+224', length: 9 },
  { code: 'FR', name: 'France', prefix: '+33', length: 9 },
];

export const S05Screen = ({ onContinue, onBack, initialAnswer }) => {
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

  const [data, setData] = useState(() => {
    const defaults = {
      business_name: '',
      region: '',
      commune: '',
      secteur: '',
      soussecteur: '',
      creation_year: '',
      last_year_turnover: '',
      last_month_turnover: '',
      phone_country: 'BJ',
      phone_suffix: '',
      whatsapp_country: 'BJ',
      whatsapp_suffix: '',
      email: ''
    };
    if (initialAnswer && typeof initialAnswer === 'object') {
      const parsedPhone = parsePhoneNumber(initialAnswer.phone_number);
      const parsedWA = parsePhoneNumber(initialAnswer.whatsapp_number);
      return { 
        ...defaults, 
        ...initialAnswer,
        phone_country: parsedPhone.countryCode,
        phone_suffix: parsedPhone.suffix,
        whatsapp_country: parsedWA.countryCode,
        whatsapp_suffix: parsedWA.suffix,
      };
    }
    return defaults;
  });
  
  const [errors, setErrors] = useState({});
  const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);
  const [whatsappDropdownOpen, setWhatsappDropdownOpen] = useState(false);

  const currentYear = new Date().getFullYear();
  const yearsList = [];
  for (let y = currentYear; y >= 1960; y--) {
    yearsList.push(y);
  }

  const handleRegionChange = (newRegion) => {
    setData(prev => ({
      ...prev,
      region: newRegion,
      commune: ''
    }));
  };

  const handleContinue = () => {
    const newErrors = {};

    // 1. Validation de l'année de création
    if (!data.creation_year) {
      newErrors.creation_year = "L'année de création est requise.";
    }

    // Trouver les configs de pays
    const phoneCountryConfig = COUNTRIES.find(c => c.code === data.phone_country) || COUNTRIES[0];
    const waCountryConfig = COUNTRIES.find(c => c.code === data.whatsapp_country) || COUNTRIES[0];

    // 2. Validation du numéro de téléphone
    if (!data.phone_suffix || data.phone_suffix.trim().length !== phoneCountryConfig.length) {
      newErrors.phone_number = `Le numéro de téléphone doit comporter exactement ${phoneCountryConfig.length} chiffres.`;
    }

    // 3. Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      newErrors.email = "L'adresse e-mail n'est pas valide (ex: contact@entreprise.com).";
    }

    // 4. Validation du WhatsApp (facultatif, mais s'il est fourni, format correct)
    if (data.whatsapp_suffix && data.whatsapp_suffix.trim() && data.whatsapp_suffix.trim().length !== waCountryConfig.length) {
      newErrors.whatsapp_number = `Le numéro WhatsApp doit comporter exactement ${waCountryConfig.length} chiffres.`;
    }

    // 5. Validation du CA annuel (facultatif)
    if (data.last_year_turnover && data.last_year_turnover.trim()) {
      const cleanTurnover = data.last_year_turnover.replace(/[\s\.FCAfca]/g, '');
      if (isNaN(Number(cleanTurnover))) {
        newErrors.last_year_turnover = "Le chiffre d'affaires annuel doit être un nombre.";
      }
    }

    // 6. Validation du CA mensuel (facultatif)
    if (data.last_month_turnover && data.last_month_turnover.trim()) {
      const cleanTurnover = data.last_month_turnover.replace(/[\s\.FCAfca]/g, '');
      if (isNaN(Number(cleanTurnover))) {
        newErrors.last_month_turnover = "Le chiffre d'affaires mensuel doit être un nombre.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    
    // Reconstruire le format complet attendu par l'API
    const finalPhonePrefix = phoneCountryConfig.code === 'BJ' ? '+22901' : phoneCountryConfig.prefix;
    const finalWAPrefix = waCountryConfig.code === 'BJ' ? '+22901' : waCountryConfig.prefix;

    const submitData = {
      ...data,
      phone_number: `${finalPhonePrefix}${data.phone_suffix}`,
      whatsapp_number: data.whatsapp_suffix ? `${finalWAPrefix}${data.whatsapp_suffix}` : ''
    };
    onContinue(submitData);
  };

  const filteredCommunes = DEPARTMENT_COMMUNES[data.region] || [];
  const canContinue = data.region && data.secteur && data.business_name.trim() && data.creation_year && data.phone_suffix.trim() && data.email.trim();

  return (
    <ScreenWrapper>
      {onBack && <TopBackLink onClick={onBack} />}
      <div className="question-wrap animate-fade-up">
        <h1 className="question-heading">Information Générale</h1>
        <p className="question-hint">Ces informations nous permettent de contextualiser votre diagnostic.</p>

        <div style={{display:'flex',flexDirection:'column',gap:'var(--space-4)',marginBottom:'var(--space-6)'}}>
          
          <div className="form-group">
            <label className="form-label">Nom de l'entreprise <span style={{color:'var(--color-danger)'}}>*</span></label>
            <input 
              className="form-input" 
              placeholder="Saisissez le nom de votre entreprise" 
              value={data.business_name} 
              onChange={e=>setData({...data,business_name:e.target.value})} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Département <span style={{color:'var(--color-danger)'}}>*</span></label>
            <select className="form-select" value={data.region} onChange={e=>handleRegionChange(e.target.value)}>
              <option value="">Sélectionnez votre département</option>
              {REGIONS.map(r=><option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Commune <span style={{color:'var(--slate-400)',fontWeight:400}}>(recommandé)</span></label>
            <select 
              className="form-select" 
              value={data.commune} 
              onChange={e=>setData({...data,commune:e.target.value})}
              disabled={!data.region || data.region === 'Autre'}
            >
              <option value="">
                {!data.region 
                  ? 'Sélectionnez d’abord un département' 
                  : data.region === 'Autre'
                    ? 'Non applicable'
                    : 'Sélectionnez votre commune'
                }
              </option>
              {filteredCommunes.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Secteur d'activité <span style={{color:'var(--color-danger)'}}>*</span></label>
            <select className="form-select" value={data.secteur} onChange={e=>setData({...data,secteur:e.target.value})}>
              <option value="">Sélectionnez un secteur</option>
              {SECTORS.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Sous-secteur <span style={{color:'var(--slate-400)',fontWeight:400}}>(facultatif)</span></label>
            <input className="form-input" placeholder="Ex: Restauration, E-commerce, Logistique..." value={data.soussecteur} onChange={e=>setData({...data,soussecteur:e.target.value})} />
          </div>

          <div className="form-group">
            <label className="form-label">Année de création <span style={{color:'var(--color-danger)'}}>*</span></label>
            <select 
              className="form-select" 
              value={data.creation_year} 
              onChange={e=>setData({...data,creation_year:e.target.value})} 
            >
              <option value="">Sélectionnez l'année</option>
              {yearsList.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            {errors.creation_year && (
              <div style={{ color: 'var(--color-danger)', fontSize: '0.78rem', marginTop: '4px', fontWeight: 600 }}>
                {errors.creation_year}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Chiffre d'affaires de l'année dernière (FCFA) <span style={{color:'var(--slate-400)',fontWeight:400}}>(facultatif)</span></label>
            <input 
              className="form-input" 
              placeholder="Ex: 5 000 000" 
              value={data.last_year_turnover} 
              onChange={e=>setData({...data,last_year_turnover:e.target.value})} 
            />
            {errors.last_year_turnover && (
              <div style={{ color: 'var(--color-danger)', fontSize: '0.78rem', marginTop: '4px', fontWeight: 600 }}>
                {errors.last_year_turnover}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Chiffre d'affaires du mois dernier (FCFA) <span style={{color:'var(--slate-400)',fontWeight:400}}>(facultatif)</span></label>
            <input 
              className="form-input" 
              placeholder="Ex: 450 000" 
              value={data.last_month_turnover} 
              onChange={e=>setData({...data,last_month_turnover:e.target.value})} 
            />
            {errors.last_month_turnover && (
              <div style={{ color: 'var(--color-danger)', fontSize: '0.78rem', marginTop: '4px', fontWeight: 600 }}>
                {errors.last_month_turnover}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Numéro de téléphone <span style={{color:'var(--color-danger)'}}>*</span></label>
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
                      src={`https://flagcdn.com/w20/${data.phone_country.toLowerCase()}.png`} 
                      alt="" 
                      style={{ width: '20px', height: 'auto', borderRadius: '2px', border: '1px solid var(--slate-200)' }} 
                    />
                    <span>{COUNTRIES.find(c => c.code === data.phone_country)?.prefix}</span>
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
                            setData({ ...data, phone_country: c.code, phone_suffix: '' });
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
                            background: data.phone_country === c.code ? 'var(--slate-50)' : 'transparent',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-100)'}
                          onMouseLeave={e => e.currentTarget.style.background = data.phone_country === c.code ? 'var(--slate-50)' : 'transparent'}
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
              {data.phone_country === 'BJ' && (
                <div style={{ background: 'var(--slate-100)', border: '1px solid var(--slate-300)', borderRight: 'none', padding: '10px 14px', fontSize: '0.9rem', color: 'var(--slate-600)', fontWeight: 700, userSelect: 'none', height: '42px', display: 'flex', alignItems: 'center', boxSizing: 'border-box' }}>
                  01
                </div>
              )}
              <input 
                className="form-input" 
                type="text"
                maxLength={data.phone_country === 'BJ' ? 8 : (COUNTRIES.find(c => c.code === data.phone_country)?.length || 10)}
                placeholder={data.phone_country === 'BJ' ? "XXXXXXXX" : "Numéro de téléphone"} 
                value={data.phone_suffix} 
                onChange={e=>setData({...data, phone_suffix: e.target.value.replace(/[^0-9]/g, '')})} 
                style={{ borderTopLeftRadius: '0', borderBottomLeftRadius: '0', flex: 1, height: '42px', boxSizing: 'border-box' }}
              />
            </div>
            {errors.phone_number && (
              <div style={{ color: 'var(--color-danger)', fontSize: '0.78rem', marginTop: '4px', fontWeight: 600 }}>
                {errors.phone_number}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Numéro WhatsApp <span style={{color:'var(--slate-400)',fontWeight:400}}>(facultatif)</span></label>
            <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setWhatsappDropdownOpen(!whatsappDropdownOpen)}
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
                      src={`https://flagcdn.com/w20/${data.whatsapp_country.toLowerCase()}.png`} 
                      alt="" 
                      style={{ width: '20px', height: 'auto', borderRadius: '2px', border: '1px solid var(--slate-200)' }} 
                    />
                    <span>{COUNTRIES.find(c => c.code === data.whatsapp_country)?.prefix}</span>
                  </div>
                  <span style={{ fontSize: '0.6rem', color: 'var(--slate-400)' }}>▼</span>
                </button>
                {whatsappDropdownOpen && (
                  <>
                    <div 
                      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }} 
                      onClick={() => setWhatsappDropdownOpen(false)} 
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
                            setData({ ...data, whatsapp_country: c.code, whatsapp_suffix: '' });
                            setWhatsappDropdownOpen(false);
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
                            background: data.whatsapp_country === c.code ? 'var(--slate-50)' : 'transparent',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-100)'}
                          onMouseLeave={e => e.currentTarget.style.background = data.whatsapp_country === c.code ? 'var(--slate-50)' : 'transparent'}
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
              {data.whatsapp_country === 'BJ' && (
                <div style={{ background: 'var(--slate-100)', border: '1px solid var(--slate-300)', borderRight: 'none', padding: '10px 14px', fontSize: '0.9rem', color: 'var(--slate-600)', fontWeight: 700, userSelect: 'none', height: '42px', display: 'flex', alignItems: 'center', boxSizing: 'border-box' }}>
                  01
                </div>
              )}
              <input 
                className="form-input" 
                type="text"
                maxLength={data.whatsapp_country === 'BJ' ? 8 : (COUNTRIES.find(c => c.code === data.whatsapp_country)?.length || 10)}
                placeholder={data.whatsapp_country === 'BJ' ? "XXXXXXXX" : "Numéro WhatsApp"} 
                value={data.whatsapp_suffix} 
                onChange={e=>setData({...data, whatsapp_suffix: e.target.value.replace(/[^0-9]/g, '')})} 
                style={{ borderTopLeftRadius: '0', borderBottomLeftRadius: '0', flex: 1, height: '42px', boxSizing: 'border-box' }}
              />
            </div>
            {errors.whatsapp_number && (
              <div style={{ color: 'var(--color-danger)', fontSize: '0.78rem', marginTop: '4px', fontWeight: 600 }}>
                {errors.whatsapp_number}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Adresse e-mail <span style={{color:'var(--color-danger)'}}>*</span></label>
            <input 
              type="email"
              className="form-input" 
              placeholder="Ex: contact@entreprise.com" 
              value={data.email} 
              onChange={e=>setData({...data,email:e.target.value})} 
            />
            {errors.email && (
              <div style={{ color: 'var(--color-danger)', fontSize: '0.78rem', marginTop: '4px', fontWeight: 600 }}>
                {errors.email}
              </div>
            )}
          </div>

        </div>
      </div>

      <div className="screen-nav">
        <Button variant="outline" onClick={onBack}>Retour</Button>
        <Button variant="primary" disabled={!canContinue} onClick={handleContinue}>Continuer</Button>
      </div>
    </ScreenWrapper>
  );
};
