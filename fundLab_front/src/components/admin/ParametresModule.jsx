import React, { useState, useEffect } from 'react';
import { Check, Sliders, Settings, Globe, Mail, ShieldAlert, Award } from 'lucide-react';
import { AdministrationService } from '../../services/AdministrationService.js';

export const ParametresModule = () => {
  const [settings, setSettings] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('general'); // 'general' or 'scoring'

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

  if (!settings) {
    return (
      <div style={{ textAlign: 'center', padding: '80px', color: 'var(--slate-400)' }}>
        Chargement des paramètres système...
      </div>
    );
  }

  return (
    <div className="admin-page animate-fade-up">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Configuration système</h1>
        <p className="admin-page-sub">Ajustez les variables générales et les seuils d'analyse du diagnostic</p>
      </div>

      {/* Internal Tabs Navigation */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '24px', paddingBottom: '2px' }}>
        <button
          onClick={() => setActiveTab('general')}
          style={{
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'general' ? '3px solid var(--color-accent, #34BED5)' : '3px solid transparent',
            color: activeTab === 'general' ? '#0f172a' : '#64748b',
            fontWeight: activeTab === 'general' ? 700 : 500,
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <Settings size={16} />
          Variables Générales
        </button>
        <button
          onClick={() => setActiveTab('scoring')}
          style={{
            padding: '10px 18px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'scoring' ? '3px solid var(--color-accent, #34BED5)' : '3px solid transparent',
            color: activeTab === 'scoring' ? '#0f172a' : '#64748b',
            fontWeight: activeTab === 'scoring' ? 700 : 500,
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <Sliders size={16} />
          Seuils & Scoring
        </button>
      </div>

      <div style={{ maxWidth: '680px' }}>
        <form onSubmit={handleSave}>
          
          {/* TAB 1: GENERAL VARIABLES */}
          {activeTab === 'general' && (
            <div className="admin-card animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '0.96rem', fontWeight: 800, color: '#0f172a' }}>Identité de la plateforme</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', marginTop: '-12px' }}>Configurez le nom et les entités responsables de l'application.</p>
              
              <div className="admin-form-group">
                <label className="admin-form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Globe size={14} color="#64748b" /> Nom de l'application
                </label>
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
                  <label className="admin-form-label">Structure / Organisation</label>
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
                  <label className="admin-form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={14} color="#64748b" /> Email d'assistance CCI
                  </label>
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
            </div>
          )}

          {/* TAB 2: SCORING & THRESHOLDS */}
          {activeTab === 'scoring' && (
            <div className="admin-card animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '0.96rem', fontWeight: 800, color: '#0f172a' }}>Seuils d'analyse automatique</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', marginTop: '-12px' }}>Définissez les frontières de score qui qualifient le profil de l'entrepreneur.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="admin-form-group" style={{ background: '#fef2f2', padding: '16px', borderRadius: '12px', border: '1px solid #fee2e2' }}>
                  <label className="admin-form-label" style={{ color: '#991b1b', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <ShieldAlert size={14} /> Seuil Critique
                  </label>
                  <span style={{ fontSize: '0.74rem', color: '#7f1d1d', display: 'block', marginBottom: '8px', lineHeight: 1.3 }}>
                    Score maximal en-dessous duquel le dossier est marqué en urgence absolue (Suivi obligatoire).
                  </span>
                  <input 
                    type="number" 
                    value={settings.scoreThresholds.critique} 
                    onChange={e => setSettings({
                      ...settings,
                      scoreThresholds: { ...settings.scoreThresholds, critique: Number(e.target.value) }
                    })}
                    className="admin-form-input" 
                    style={{ background: 'white', borderColor: '#fca5a5' }}
                    min="0"
                    max="100"
                    required 
                  />
                </div>

                <div className="admin-form-group" style={{ background: '#fef3c7', padding: '16px', borderRadius: '12px', border: '1px solid #fef3c7' }}>
                  <label className="admin-form-label" style={{ color: '#92400e', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <Award size={14} /> Seuil Moyen
                  </label>
                  <span style={{ fontSize: '0.74rem', color: '#78350f', display: 'block', marginBottom: '8px', lineHeight: 1.3 }}>
                    Score à partir duquel le dossier passe d'un profil fragile à un profil solide/mature.
                  </span>
                  <input 
                    type="number" 
                    value={settings.scoreThresholds.moyen} 
                    onChange={e => setSettings({
                      ...settings,
                      scoreThresholds: { ...settings.scoreThresholds, moyen: Number(e.target.value) }
                    })}
                    className="admin-form-input" 
                    style={{ background: 'white', borderColor: '#fde68a' }}
                    min="0"
                    max="100"
                    required 
                  />
                </div>
              </div>

              {/* Score Bar Visual Representation */}
              <div style={{ marginTop: '12px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', margin: '0 0 12px 0' }}>Visualisation de la répartition</h4>
                <div style={{ display: 'flex', height: '14px', borderRadius: '8px', overflow: 'hidden', background: '#cbd5e1', marginBottom: '8px' }}>
                  <div style={{ width: `${settings.scoreThresholds.critique}%`, background: '#ef4444', height: '100%' }} title="Zone Critique" />
                  <div style={{ width: `${settings.scoreThresholds.moyen - settings.scoreThresholds.critique}%`, background: '#f59e0b', height: '100%' }} title="Zone Moyenne / Fragile" />
                  <div style={{ width: `${100 - settings.scoreThresholds.moyen}%`, background: '#10b981', height: '100%' }} title="Zone Solide" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>
                  <span>0 - {settings.scoreThresholds.critique} : Critique 🟥</span>
                  <span>{settings.scoreThresholds.critique + 1} - {settings.scoreThresholds.moyen} : Moyen 🟧</span>
                  <span>{settings.scoreThresholds.moyen + 1} - 100 : Excellent 🟩</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '24px' }}>
            <button className="btn btn-teal" type="submit" style={{ padding: '10px 24px', fontWeight: 700 }}>
              Enregistrer les paramètres
            </button>
            {saveSuccess && (
              <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-accent-dark, #1A9DB8)', fontSize: '0.86rem', fontWeight: 700 }}>
                <Check size={16} /> Modifications sauvegardées !
              </div>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};
