import React, { useState } from 'react';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';
import { AnswerConfirmModal } from './S04Screen.jsx';
import { PROFILES_LIST, PROFILE_GOOGLE_ICONS } from '../../../constants/triageChoices.js';

const CheckIcon = () => (
  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
    <path d="M1 5L4 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const S03Screen = ({ onContinue, onSelect, onBack, initialAnswer }) => {
  const [selected, setSelected] = useState(initialAnswer || null);
  const handleCb = onContinue || onSelect;

  return (
    <ScreenWrapper wide>
      {onBack && <TopBackLink onClick={onBack} />}
      <div className="animate-fade-up" style={{ maxWidth: '920px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <span className="section-tag" style={{ marginBottom: '14px', display: 'inline-flex' }}>
            Étape 1 sur 5
          </span>
          <h1 className="screen-title" style={{ textAlign: 'center' }}>
            Quel est votre profil ?
          </h1>
          <p className="screen-subtitle" style={{ textAlign: 'center', margin: '0 auto', maxWidth: '500px' }}>
            Sélectionnez la situation qui vous décrit le mieux. Nous adapterons le questionnaire à votre contexte.
          </p>
        </div>

        <div className="profile-select-grid">
          {PROFILES_LIST.map((profile, i) => {
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

        {/* Boutons d'action simples Retour et Continuer intégrés en bas de page */}
        <div className="screen-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', gap: '12px' }}>
          {onBack && <Button variant="outline" onClick={onBack}>Retour</Button>}
          <Button variant="primary" disabled={!selected} onClick={() => { if (handleCb) handleCb(selected); }}>Continuer</Button>
        </div>
      </div>
    </ScreenWrapper>
  );
};
