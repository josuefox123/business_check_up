import React, { useState } from 'react';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { Button } from '../../ui/index.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';
import { REGIONS, SECTORS, DEPARTMENT_COMMUNES } from '../../../constants/locationData.js';

const COUNTRIES = [
  { code: 'BJ', name: 'Bénin', prefix: '+229', length: 8, extra: '01' },
  { code: 'CI', name: "Côte d'Ivoire", prefix: '+225', length: 10 },
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

/* ─── Indicateur de progression ─── */
const StepDots = ({ current, total }) => (
  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '28px' }}>
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        style={{
          width: i === current ? '28px' : '8px',
          height: '8px',
          borderRadius: '999px',
          background: i === current ? 'var(--color-primary, #14B8A6)' : 'var(--slate-200, #e2e8f0)',
          transition: 'all 0.3s ease',
        }}
      />
    ))}
    <span style={{ marginLeft: '4px', fontSize: '0.78rem', color: 'var(--slate-400)', fontWeight: 500 }}>
      {current + 1}/{total}
    </span>
  </div>
);

/* ─── Champ avec label et message d'erreur ─── */
const Field = ({ label, required, optional, error, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--slate-700)' }}>
      {label}
      {required && <span style={{ color: 'var(--color-danger, #ef4444)', marginLeft: '3px' }}>*</span>}
      {optional && (
        <span style={{ color: 'var(--slate-400)', fontWeight: 400, marginLeft: '4px', fontSize: '0.8rem' }}>
          (facultatif)
        </span>
      )}
    </label>
    {children}
    {error && (
      <span style={{ color: 'var(--color-danger, #ef4444)', fontSize: '0.76rem', fontWeight: 600 }}>
        {error}
      </span>
    )}
  </div>
);

/* ─── Input stylisé ─── */
const inputStyle = {
  width: '100%',
  height: '46px',
  padding: '0 14px',
  fontSize: '0.92rem',
  borderRadius: '12px',
  border: '1.5px solid var(--slate-200, #e2e8f0)',
  background: '#F8FAFC',
  color: 'var(--slate-800)',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const selectStyle = { ...inputStyle, cursor: 'pointer', appearance: 'none' };

/* ─── Sélecteur téléphonique ─── */
const PhoneInput = ({ countryCode, suffix, onCountryChange, onSuffixChange, dropdownOpen, setDropdownOpen }) => {
  const config = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0];
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', position: 'relative' }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--slate-50)',
            border: '1.5px solid var(--slate-200)',
            borderRight: 'none',
            padding: '0 12px',
            borderTopLeftRadius: '12px',
            borderBottomLeftRadius: '12px',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'var(--slate-700)',
            cursor: 'pointer',
            outline: 'none',
            width: '105px',
            height: '46px',
            boxSizing: 'border-box',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <img
              src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`}
              alt=""
              style={{ width: '20px', height: 'auto', borderRadius: '2px', border: '1px solid var(--slate-200)' }}
            />
            <span>{config.prefix}</span>
          </div>
          <span style={{ fontSize: '0.6rem', color: 'var(--slate-400)' }}>▼</span>
        </button>
        {dropdownOpen && (
          <>
            <div
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
              onClick={() => setDropdownOpen(false)}
            />
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              zIndex: 1000,
              background: 'white',
              border: '1px solid var(--slate-200)',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
              maxHeight: '200px',
              overflowY: 'auto',
              width: '240px',
              marginTop: '4px',
            }}>
              {COUNTRIES.map(c => (
                <div
                  key={c.code}
                  onClick={() => { onCountryChange(c.code); setDropdownOpen(false); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                    fontWeight: 500,
                    color: 'var(--slate-700)',
                    background: countryCode === c.code ? 'var(--slate-50)' : 'transparent',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--slate-100)'}
                  onMouseLeave={e => e.currentTarget.style.background = countryCode === c.code ? 'var(--slate-50)' : 'transparent'}
                >
                  <img src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`} alt="" style={{ width: '20px', height: 'auto', borderRadius: '2px' }} />
                  <span style={{ flex: 1 }}>{c.name}</span>
                  <span style={{ color: 'var(--slate-400)', fontWeight: 600 }}>{c.prefix}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {countryCode === 'BJ' && (
        <div style={{
          background: 'var(--slate-100)',
          border: '1.5px solid var(--slate-200)',
          borderRight: 'none',
          padding: '0 14px',
          fontSize: '0.9rem',
          color: 'var(--slate-600)',
          fontWeight: 700,
          userSelect: 'none',
          height: '46px',
          display: 'flex',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}>01</div>
      )}
      <input
        type="text"
        maxLength={countryCode === 'BJ' ? 8 : (config.length || 10)}
        placeholder={countryCode === 'BJ' ? 'XXXXXXXX' : 'Numéro de téléphone'}
        value={suffix}
        onChange={e => onSuffixChange(e.target.value.replace(/[^0-9]/g, ''))}
        style={{
          ...inputStyle,
          borderTopLeftRadius: '0',
          borderBottomLeftRadius: '0',
          flex: 1,
          borderLeft: 'none',
        }}
      />
    </div>
  );
};

/* ════════════════════════════════════════════
   COMPOSANT PRINCIPAL
════════════════════════════════════════════ */
export const S05Screen = ({ onContinue, onBack, initialAnswer }) => {
  const parsePhoneNumber = (num) => {
    if (!num) return { countryCode: 'BJ', suffix: '' };
    const clean = num.replace(/[\s\-\(\)]/g, '');
    if (clean.startsWith('+22901')) return { countryCode: 'BJ', suffix: clean.slice(6) };
    if (clean.startsWith('22901')) return { countryCode: 'BJ', suffix: clean.slice(5) };
    for (const c of COUNTRIES) {
      if (clean.startsWith(c.prefix)) return { countryCode: c.code, suffix: clean.slice(c.prefix.length) };
      const rawPrefix = c.prefix.slice(1);
      if (clean.startsWith(rawPrefix)) return { countryCode: c.code, suffix: clean.slice(rawPrefix.length) };
    }
    if (clean.startsWith('01') && clean.length === 10) return { countryCode: 'BJ', suffix: clean.slice(2) };
    if (clean.length === 8) return { countryCode: 'BJ', suffix: clean };
    return { countryCode: 'BJ', suffix: clean };
  };

  const [step, setStep] = useState(1); // 1 = contact, 2 = entreprise
  const [errors, setErrors] = useState({});
  const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);

  const [data, setData] = useState(() => {
    const defaults = {
      full_name: '',
      email: '',
      phone_country: 'BJ',
      phone_suffix: '',
      business_name: '',
      region: '',
      commune: '',
      secteur: '',
      soussecteur: '',
      creation_year: '',
      last_year_turnover: '',
      last_month_turnover: '',
    };
    if (initialAnswer && typeof initialAnswer === 'object') {
      const parsedPhone = parsePhoneNumber(initialAnswer.phone_number);
      return {
        ...defaults,
        ...initialAnswer,
        phone_country: parsedPhone.countryCode,
        phone_suffix: parsedPhone.suffix,
      };
    }
    return defaults;
  });

  const currentYear = new Date().getFullYear();
  const yearsList = [];
  for (let y = currentYear; y >= 1960; y--) yearsList.push(y);

  const filteredCommunes = DEPARTMENT_COMMUNES[data.region] || [];

  /* ─── Validation Étape 1 ─── */
  const validateStep1 = () => {
    const newErrors = {};
    if (!data.full_name.trim()) newErrors.full_name = 'Le nom et prénom sont requis.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) newErrors.email = "L'adresse e-mail n'est pas valide.";
    const phoneConfig = COUNTRIES.find(c => c.code === data.phone_country) || COUNTRIES[0];
    if (!data.phone_suffix || data.phone_suffix.trim().length !== phoneConfig.length) {
      newErrors.phone_number = `Le numéro doit comporter exactement ${phoneConfig.length} chiffres.`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ─── Validation Étape 2 + soumission ─── */
  const handleFinalSubmit = () => {
    const newErrors = {};
    if (!data.region) newErrors.region = 'Le département est requis.';
    if (!data.secteur) newErrors.secteur = "Le secteur d'activité est requis.";
    if (!data.creation_year) newErrors.creation_year = "L'année de création est requise.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const phoneConfig = COUNTRIES.find(c => c.code === data.phone_country) || COUNTRIES[0];
    const finalPhonePrefix = phoneConfig.code === 'BJ' ? '+22901' : phoneConfig.prefix;

    const submitData = {
      ...data,
      phone_number: `${finalPhonePrefix}${data.phone_suffix}`,
      whatsapp_number: '',
    };
    onContinue(submitData);
  };

  const set = (field) => (e) => setData(prev => ({ ...prev, [field]: e.target.value }));

  /* ─── STEP 1 ─── */
  const renderStep1 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Field label="Nom & Prénom" required error={errors.full_name}>
        <input
          style={inputStyle}
          placeholder="Ex: Koffi SOGLO"
          value={data.full_name}
          onChange={set('full_name')}
          onFocus={e => { e.target.style.borderColor = '#14B8A6'; e.target.style.boxShadow = '0 0 0 3px rgba(20,184,166,0.12)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--slate-200)'; e.target.style.boxShadow = 'none'; }}
        />
      </Field>

      <Field label="Adresse e-mail" required error={errors.email}>
        <input
          type="email"
          style={inputStyle}
          placeholder="Ex: koffi@soglo.bj"
          value={data.email}
          onChange={set('email')}
          onFocus={e => { e.target.style.borderColor = '#14B8A6'; e.target.style.boxShadow = '0 0 0 3px rgba(20,184,166,0.12)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--slate-200)'; e.target.style.boxShadow = 'none'; }}
        />
      </Field>

      <Field label="Téléphone" required error={errors.phone_number}>
        <PhoneInput
          countryCode={data.phone_country}
          suffix={data.phone_suffix}
          onCountryChange={(code) => setData(prev => ({ ...prev, phone_country: code, phone_suffix: '' }))}
          onSuffixChange={(val) => setData(prev => ({ ...prev, phone_suffix: val }))}
          dropdownOpen={phoneDropdownOpen}
          setDropdownOpen={setPhoneDropdownOpen}
        />
      </Field>
    </div>
  );

  /* ─── STEP 2 ─── */
  const renderStep2 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Field label="Nom de l'entreprise / projet" optional>
        <input
          style={inputStyle}
          placeholder="Ex: Ets Soglo & Associés"
          value={data.business_name}
          onChange={set('business_name')}
          onFocus={e => { e.target.style.borderColor = '#14B8A6'; e.target.style.boxShadow = '0 0 0 3px rgba(20,184,166,0.12)'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--slate-200)'; e.target.style.boxShadow = 'none'; }}
        />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Field label="Département / Région" required error={errors.region}>
          <div style={{ position: 'relative' }}>
            <select
              style={selectStyle}
              value={data.region}
              onChange={(e) => setData(prev => ({ ...prev, region: e.target.value, commune: '' }))}
            >
              <option value="">Sélectionnez</option>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.65rem', color: 'var(--slate-400)', pointerEvents: 'none' }}>▼</span>
          </div>
        </Field>

        <Field label="Commune" optional>
          <div style={{ position: 'relative' }}>
            <select
              style={{ ...selectStyle, opacity: !data.region ? 0.6 : 1 }}
              value={data.commune}
              onChange={set('commune')}
              disabled={!data.region || data.region === 'Autre'}
            >
              <option value="">{!data.region ? "Département d'abord" : 'Sélectionnez'}</option>
              {filteredCommunes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.65rem', color: 'var(--slate-400)', pointerEvents: 'none' }}>▼</span>
          </div>
        </Field>
      </div>

      <Field label="Secteur d'activité" required error={errors.secteur}>
        <div style={{ position: 'relative' }}>
          <select style={selectStyle} value={data.secteur} onChange={set('secteur')}>
            <option value="">Sélectionnez un secteur</option>
            {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.65rem', color: 'var(--slate-400)', pointerEvents: 'none' }}>▼</span>
        </div>
      </Field>

      <Field label="Année de création" required error={errors.creation_year}>
        <div style={{ position: 'relative' }}>
          <select style={selectStyle} value={data.creation_year} onChange={set('creation_year')}>
            <option value="">Sélectionnez l'année</option>
            {yearsList.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.65rem', color: 'var(--slate-400)', pointerEvents: 'none' }}>▼</span>
        </div>
      </Field>
    </div>
  );

  return (
    <ScreenWrapper>
      {step === 1 && onBack && <TopBackLink onClick={onBack} />}
      {step === 2 && <TopBackLink onClick={() => { setStep(1); setErrors({}); }} />}

      <div className="question-wrap animate-fade-up">
        <StepDots current={step - 1} total={2} />

        {step === 1 ? (
          <>
            <h1 className="question-heading" style={{ marginBottom: '8px' }}>
              Peut-on en savoir plus sur vous ?
            </h1>
            <p className="question-hint" style={{ marginBottom: '28px' }}>
              Ces informations nous permettent de personnaliser votre diagnostic.
            </p>
            {renderStep1()}
          </>
        ) : (
          <>
            <h1 className="question-heading" style={{ marginBottom: '8px' }}>
              Parlez-nous de votre activité
            </h1>
            <p className="question-hint" style={{ marginBottom: '28px' }}>
              Aidez-nous à comprendre le contexte de votre entreprise.
            </p>
            {renderStep2()}
          </>
        )}
      </div>

      <div className="screen-nav">
        {step === 1 ? (
          <>
            <Button variant="outline" onClick={onBack}>Retour</Button>
            <Button
              variant="primary"
              onClick={() => { if (validateStep1()) { setStep(2); setErrors({}); } }}
            >
              Continuer
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => { setStep(1); setErrors({}); }}>Retour</Button>
            <Button
              variant="primary"
              disabled={!data.region || !data.secteur || !data.creation_year}
              onClick={handleFinalSubmit}
            >
              Continuer
            </Button>
          </>
        )}
      </div>
    </ScreenWrapper>
  );
};
