import React, { useState } from 'react';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { Button } from '../../ui/index.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';
import { REGIONS, SECTORS, DEPARTMENT_COMMUNES } from '../../../constants/locationData.js';

export const S05Screen = ({ onContinue, onBack, initialAnswer }) => {
  const [data, setData] = useState(initialAnswer && typeof initialAnswer === 'object' ? initialAnswer : { region:'', commune:'', secteur:'', soussecteur:'' });
  
  const handleRegionChange = (newRegion) => {
    setData(prev => ({
      ...prev,
      region: newRegion,
      commune: ''
    }));
  };

  const filteredCommunes = DEPARTMENT_COMMUNES[data.region] || [];
  const canContinue = data.region && data.secteur;

  return (
    <ScreenWrapper>
      {onBack && <TopBackLink onClick={onBack} />}
      <div className="question-wrap animate-fade-up">
        <h1 className="question-heading">Département &amp; Secteur d'activité</h1>
        <p className="question-hint">Ces informations nous permettent de contextualiser votre diagnostic.</p>

        <div style={{display:'flex',flexDirection:'column',gap:'var(--space-4)',marginBottom:'var(--space-6)'}}>
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
        </div>
        <div className="screen-nav">
          <Button variant="outline" onClick={onBack}>Retour</Button>
          <Button variant="primary" disabled={!canContinue} onClick={() => onContinue(data)}>Continuer</Button>
        </div>
      </div>
    </ScreenWrapper>
  );
};
