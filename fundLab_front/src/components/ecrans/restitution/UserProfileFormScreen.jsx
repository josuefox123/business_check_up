import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { AlertOctagon, User, Briefcase, MapPin, TrendingUp } from 'lucide-react';
import { REGIONS, DEPARTMENT_COMMUNES, SECTORS } from '../../../constants/locationData.js';

export const UserProfileFormScreen = ({ onSubmit, onSkip }) => {
  const [form, setForm] = useState({
    // Profil utilisateur
    user_profile_type: 'active_entrepreneur',
    full_name: '',
    phone_number: '',
    whatsapp_number: '',
    email: '',

    // Profil business
    business_name: '',
    region: 'Atlantique',
    commune: '',
    sector: 'Services',
    sub_sector: '',
    year_created: new Date().getFullYear().toString(),
    ca_n_1: '',
    ca_m_1: '',
    activity_stage: 'regular_sales',
    years_in_activity: '',
    employee_count_range: '1-10'
  });

  const [communes, setCommunes] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations requises par la validation backend
    if (!form.user_profile_type) {
      setErrorMsg('Le type de profil utilisateur est requis.');
      return;
    }
    if (!form.region) {
      setErrorMsg('La région / département est requise.');
      return;
    }
    if (!form.sector) {
      setErrorMsg('Le secteur d\'activité est requis.');
      return;
    }
    if (!form.year_created || isNaN(Number(form.year_created))) {
      setErrorMsg('L\'année de création doit être une année valide.');
      return;
    }
    if (!form.activity_stage) {
      setErrorMsg('Le stade d\'activité est requis.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Calculer years_in_activity automatiquement si l'année est fournie
      let calculatedYears = '';
      const year = parseInt(form.year_created, 10);
      if (!isNaN(year)) {
        calculatedYears = Math.max(0, new Date().getFullYear() - year);
      }

      await onSubmit({
        ...form,
        years_in_activity: calculatedYears !== '' ? calculatedYears : null
      });
    } catch (err) {
      console.error('Submit error:', err);
      setErrorMsg(err.message || 'Une erreur est survenue lors de l\'enregistrement de votre profil.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenWrapper>
      <div className="animate-fade-up" style={{ maxWidth: '680px', margin: '0 auto', padding: '20px 20px' }}>
        <div style={{ marginBottom: '28px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '10px' }}>
            Finalisez votre profil
          </h1>
          <p style={{ fontSize: '0.92rem', color: 'var(--slate-500)', lineHeight: 1.6 }}>
            Pour recevoir votre rapport et être recontacté, merci de compléter les informations ci-dessous.
          </p>
        </div>

        <form onSubmit={handleFormSubmit} style={{ background: 'var(--bg-white)', border: '1px solid var(--slate-200)', padding: '28px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {errorMsg && (
            <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-danger)', background: 'var(--color-danger-bg)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600 }}>
              <AlertOctagon size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1 : Profil Utilisateur */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--slate-100)', paddingBottom: '8px', marginBottom: '16px' }}>
              <User size={18} style={{ color: 'var(--color-teal)' }} />
              <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#070E24' }}>Profil Utilisateur</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
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
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Téléphone</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="Ex: +229 01 90 90 90 90"
                  value={form.phone_number}
                  onChange={e => handleChange('phone_number', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Numéro WhatsApp <span style={{ color: 'var(--slate-400)', fontWeight: 400 }}>(facultatif)</span></label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="Ex: +229 01 90 90 90 90"
                  value={form.whatsapp_number}
                  onChange={e => handleChange('whatsapp_number', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section 2 : Profil Entreprise */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--slate-100)', paddingBottom: '8px', marginBottom: '16px' }}>
              <Briefcase size={18} style={{ color: 'var(--color-teal)' }} />
              <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#070E24' }}>Profil de l'entreprise / activité</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
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
                <input
                  type="number"
                  className="form-input"
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="Ex: 2022"
                  value={form.year_created}
                  onChange={e => handleChange('year_created', e.target.value)}
                />
              </div>

              <div className="form-group">
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
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Chiffre d'affaires N-1 <span style={{ color: 'var(--slate-400)', fontWeight: 400 }}>(facultatif)</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: 5 000 000 FCFA"
                  value={form.ca_n_1}
                  onChange={e => handleChange('ca_n_1', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Chiffre d'affaires moyen mensuel <span style={{ color: 'var(--slate-400)', fontWeight: 400 }}>(facultatif)</span></label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: 400 000 FCFA"
                  value={form.ca_m_1}
                  onChange={e => handleChange('ca_m_1', e.target.value)}
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
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
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
            <Button
              type="submit"
              variant="primary"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer et terminer'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onSkip}
              style={{ width: '100%', justifyContent: 'center', border: 'none', color: 'var(--slate-500)', textDecoration: 'underline' }}
            >
              Ignorer et terminer
            </Button>
          </div>

        </form>
      </div>
    </ScreenWrapper>
  );
};
