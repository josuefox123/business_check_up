import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { AdministrationService } from '../../services/AdministrationService.js';

export const ParametresModule = () => {
  const [settings, setSettings] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    AdministrationService.settings.getSettings().then(setSettings);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    AdministrationService.settings.saveSettings(settings).then(() => {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    });
  };

  if (!settings) return <p>Chargement des paramètres...</p>;

  return (
    <div className="admin-page animate-fade-up">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Configuration système</h1>
        <p className="admin-page-sub">Ajustez les variables générales et les seuils d'analyse du diagnostic</p>
      </div>

      <div className="admin-card" style={{ maxWidth: '640px' }}>
        <div className="admin-card-header">
          <h2>Seuils d'analyse de score</h2>
        </div>
        <form onSubmit={handleSave} style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Seuil Critique (Score en dessous duquel l'urgence s'active)</label>
              <input 
                type="number" 
                value={settings.scoreThresholds.critique} 
                onChange={e => setSettings({
                  ...settings,
                  scoreThresholds: { ...settings.scoreThresholds, critique: Number(e.target.value) }
                })}
                className="admin-form-input" 
                required 
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Seuil Moyen (Pour passage au niveau Solide)</label>
              <input 
                type="number" 
                value={settings.scoreThresholds.moyen} 
                onChange={e => setSettings({
                  ...settings,
                  scoreThresholds: { ...settings.scoreThresholds, moyen: Number(e.target.value) }
                })}
                className="admin-form-input" 
                required 
              />
            </div>
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '20px 0 10px 0', borderBottom: '1px solid var(--slate-100)', paddingBottom: '8px' }}>Variables Générales</h3>
          
          <div className="admin-form-group">
            <label className="admin-form-label">Nom de l'application</label>
            <input 
              type="text" 
              value={settings.general.appName} 
              onChange={e => setSettings({
                ...settings,
                general: { ...settings.general, appName: e.target.value }
              })}
              className="admin-form-input" 
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Organisation / CCI</label>
              <input 
                type="text" 
                value={settings.general.organizationName} 
                onChange={e => setSettings({
                  ...settings,
                  general: { ...settings.general, organizationName: e.target.value }
                })}
                className="admin-form-input" 
                required 
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Email de contact d'assistance</label>
              <input 
                type="email" 
                value={settings.general.contactEmail} 
                onChange={e => setSettings({
                  ...settings,
                  general: { ...settings.general, contactEmail: e.target.value }
                })}
                className="admin-form-input" 
                required 
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button className="btn btn-primary" type="submit">Enregistrer les paramètres</button>
            {saveSuccess && (
              <span style={{ color: 'var(--color-success)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
                <Check size={16} /> Enregistré avec succès !
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
