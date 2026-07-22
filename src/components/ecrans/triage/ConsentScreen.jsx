import React from 'react';
import { Lock } from 'lucide-react';
import { Button } from '../../ui/index.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';

export const ConsentScreen = ({ onContinue, onBack }) => {
  const handleSubmit = () => {
    onContinue({ diag: true, stats: true, contact: true });
  };

  return (
    <ScreenWrapper>
      {onBack && <TopBackLink onClick={onBack} />}
      <div className="consent-wrap animate-fade-up" style={{ maxWidth: '580px', margin: '0 auto' }}>
        <div className="screen-icon-header" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div className="screen-icon" style={{ background: 'rgba(23, 33, 45, 0.04)', color: '#17212D', padding: '12px', borderRadius: '50%' }}>
            <Lock size={32} />
          </div>
        </div>
        
        <h1 className="screen-title" style={{ textAlign: 'center', marginBottom: '24px' }}>Avant de commencer</h1>
        
        <div style={{ 
          background: '#ffffff', 
          padding: '24px', 
          borderRadius: '16px', 
          border: '1px solid rgba(23, 33, 45, 0.15)', 
          lineHeight: '1.6', 
          color: 'var(--slate-800)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <p style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--slate-900)', margin: 0 }}>
            Vos réponses serviront à produire votre diagnostic, à vous orienter et à produire des statistiques agrégées pour mieux comprendre les besoins des entrepreneurs.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', fontWeight: 500 }}>
              <span style={{ color: '#17212D', fontSize: '1.2rem', lineHeight: 1 }}>•</span>
              <span>J'accepte l'utilisation de mes réponses pour le diagnostic</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', fontWeight: 500 }}>
              <span style={{ color: '#17212D', fontSize: '1.2rem', lineHeight: 1 }}>•</span>
              <span>J'accepte l'usage agrégé des données</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', fontWeight: 500 }}>
              <span style={{ color: '#17212D', fontSize: '1.2rem', lineHeight: 1 }}>•</span>
              <span>J'accepte d'être recontacté</span>
            </div>
          </div>
        </div>
      </div>

      {/* Boutons d'action simples Retour et Continuer intégrés en bas de page */}
      <div className="screen-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', gap: '12px' }}>
        {onBack && <Button variant="outline" onClick={onBack}>Retour</Button>}
        <Button variant="primary" style={{ marginLeft: 'auto' }} onClick={handleSubmit}>Accepter et continuer</Button>
      </div>
    </ScreenWrapper>
  );
};
