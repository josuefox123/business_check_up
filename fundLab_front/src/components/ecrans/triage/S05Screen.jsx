import React, { useState } from 'react';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { Button } from '../../ui/index.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';
import { REGIONS, SECTORS, DEPARTMENT_COMMUNES } from '../../../constants/locationData.js';

export const S05Screen = ({ onContinue, onBack, initialAnswer }) => {
  const [data, setData] = useState(() => {
    const defaults = {
      business_name: '',
      region: '',
      commune: '',
      secteur: '',
      soussecteur: '',
      creation_year: '',
      last_year_turnover: '',
      last_month_turnover: ''
    };
    if (initialAnswer && typeof initialAnswer === 'object') {
      return { ...defaults, ...initialAnswer };
    }
    return defaults;
  });
  
  const handleRegionChange = (newRegion) => {
    setData(prev => ({
      ...prev,
      region: newRegion,
      commune: ''
    }));
  };

  const filteredCommunes = DEPARTMENT_COMMUNES[data.region] || [];
  const canContinue = data.region && data.secteur && data.business_name.trim();

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
            <label className="form-label">Année de création <span style={{color:'var(--slate-400)',fontWeight:400}}>(facultatif)</span></label>
            <input 
              type="number"
              className="form-input" 
              placeholder="Ex: 2020" 
              value={data.creation_year} 
              onChange={e=>setData({...data,creation_year:e.target.value})} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Chiffre d'affaires de l'année dernière (FCFA) <span style={{color:'var(--slate-400)',fontWeight:400}}>(facultatif)</span></label>
            <input 
              className="form-input" 
              placeholder="Ex: 5 000 000" 
              value={data.last_year_turnover} 
              onChange={e=>setData({...data,last_year_turnover:e.target.value})} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Chiffre d'affaires du mois dernier (FCFA) <span style={{color:'var(--slate-400)',fontWeight:400}}>(facultatif)</span></label>
            <input 
              className="form-input" 
              placeholder="Ex: 450 000" 
              value={data.last_month_turnover} 
              onChange={e=>setData({...data,last_month_turnover:e.target.value})} 
            />
          </div>

        </div>
      </div>

      <div className="screen-nav">
        <Button variant="outline" onClick={onBack}>Retour</Button>
        <Button variant="primary" disabled={!canContinue} onClick={() => onContinue(data)}>Continuer</Button>
      </div>
    </ScreenWrapper>
  );
};
