import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';

export const VerifModuleScreen = ({ chosenModule, warningMessage, onConfirm, onAcceptReco, recoModule, onBack }) => (
  <ScreenWrapper>
    {onBack && <TopBackLink onClick={onBack} />}
    <div className="route-wrap animate-fade-up">
      <div className="alert alert-warning" style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <AlertTriangle size={18} className="text-warning" />
        <div>
          <strong>Point d'attention</strong>
          <p style={{ marginTop: 'var(--space-1)', fontSize: '0.88rem' }}>{warningMessage}</p>
        </div>
      </div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>Vous avez choisi : {chosenModule?.name}</h2>
      <p style={{ color: 'var(--slate-500)', marginBottom: 'var(--space-6)' }}>Comment souhaitez-vous procéder ?</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <Button variant="primary" onClick={onConfirm}>Confirmer mon choix et continuer</Button>
        {recoModule && <Button variant="outline" onClick={onAcceptReco}>Suivre la recommandation → {recoModule.name}</Button>}
      </div>
    </div>
  </ScreenWrapper>
);
