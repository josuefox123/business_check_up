import React, { useState } from 'react';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { Button, ProgressBar } from '../../ui/index.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';
import { useReferences } from '../../../contexts/ReferencesContext.jsx';

const PROFILE_GOOGLE_ICONS = {
  project_holder: 'lightbulb',
  active_entrepreneur: 'store',
  structured_sme: 'corporate_fare',
  distressed_business: 'warning',
  opportunity_seeker: 'trending_up',
  institutional_curious: 'visibility'
};

const CheckIcon = () => (
  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
    <path d="M1 5L4 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const S03Screen = ({ question, currentStep, totalSteps, onContinue, onSelect, onBack, initialAnswer }) => {
  const { references } = useReferences();
  const rawProfiles = references?.user_profile_type || [];

  const sublabelMapping = {
    'project_holder': 'Idée en cours de validation ou étude de marché',
    'active_entrepreneur': 'Ventes régulières ou structure déjà lancée',
    'structured_sme': 'Activité structurée avec équipe en place',
    'distressed_business': 'Baisse de ventes ou tension financière critique',
    'opportunity_seeker': 'Projet de développement ou nouveau marché',
    'institutional_curious': 'Découvrir la plateforme et ses modules'
  };

  const resolvedChoices = question?.choices || rawProfiles.map(p => ({
    id: p.value || p.id,
    label: p.label,
    desc: p.desc || p.description
  }));

  const profilesList = resolvedChoices.map(p => ({
    id: p.id,
    label: p.label,
    sublabel: p.desc || sublabelMapping[p.id] || '',
    color: '#17212D',
    colorLight: 'rgba(23, 33, 45, 0.04)',
    colorBorder: 'rgba(23, 33, 45, 0.15)'
  }));

  const [selected, setSelected] = useState(initialAnswer || null);
  const handleCb = onContinue || onSelect;

  const titleText = question?.question || 'Quel est votre profil ?';
  const subtitleText = question?.hint || 'Sélectionnez la situation qui vous décrit le mieux. Nous adapterons le questionnaire à votre contexte.';

  return (
    <ScreenWrapper wide>
      {onBack && <TopBackLink onClick={onBack} />}
      <div className="animate-fade-up" style={{ maxWidth: '920px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div style={{ marginBottom: 'var(--space-6)', maxWidth: '420px', margin: '0 auto var(--space-6) auto' }}>
            <ProgressBar current={currentStep !== undefined ? currentStep : 0} total={totalSteps || 6} />
          </div>
          <h1 className="screen-title" style={{ textAlign: 'center' }}>
            {titleText}
          </h1>
          <p className="screen-subtitle" style={{ textAlign: 'center', margin: '0 auto', maxWidth: '500px', fontSize: '0.82rem', opacity: 0.9 }}>
            {subtitleText}
          </p>
        </div>

        <div className="profile-select-grid">
          {profilesList.map((profile, i) => {
            const isSelected = selected === profile.id;
            const googleIcon = PROFILE_GOOGLE_ICONS[profile.id] || 'help';

            return (
              <button
                key={profile.id}
                className={`profile-select-card animate-fade-up delay-${Math.min(i + 1, 6) * 100}${isSelected ? ' selected' : ''}`}
                onClick={() => {
                  setSelected(profile.id);
                }}
                style={{
                  '--p-color':  profile.color,
                  '--p-light':  profile.colorLight,
                  '--p-border': profile.colorBorder,
                }}
              >
                <div className="profile-card-icon" style={{
                  background: isSelected ? profile.color : profile.colorLight,
                }}>
                  <span
                    className="material-symbols-outlined"
                    style={{
                      color: isSelected ? '#fff' : profile.color,
                      fontSize: '24px',
                      userSelect: 'none'
                    }}
                  >
                    {googleIcon}
                  </span>
                </div>

                <div className="profile-card-body">
                  <div className="profile-card-label">{profile.label}</div>
                  <div className="profile-card-sublabel">{profile.sublabel}</div>
                </div>

                <div className="profile-card-check" style={{
                  borderColor: isSelected ? profile.color : 'var(--slate-300)',
                  background: isSelected ? profile.color : 'transparent',
                }}>
                  {isSelected && <CheckIcon />}
                </div>
              </button>
            );
          })}
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--slate-400)', marginTop: 'var(--space-5)', fontWeight: 500 }}>
          Pas sûr ? Sélectionnez le profil le plus proche — vous pourrez préciser ensuite.
        </p>

      </div>

      {/* Boutons d'action simples Retour et Continuer intégrés en bas de page (Hors de l'animation transform) */}
      <div className="screen-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', gap: '12px' }}>
        {onBack && <Button variant="outline" onClick={onBack}>Retour</Button>}
        <Button variant="primary" disabled={!selected} onClick={() => { if (handleCb) handleCb(selected); }}>Continuer</Button>
      </div>
    </ScreenWrapper>
  );
};
