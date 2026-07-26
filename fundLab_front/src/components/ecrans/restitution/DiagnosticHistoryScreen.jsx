import React from 'react';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { History, Construction, ArrowLeft } from 'lucide-react';
import { Button } from '../../ui/index.jsx';

export const DiagnosticHistoryScreen = ({ onBack, userEmail }) => {
  return (
    <ScreenWrapper wide>
      <div style={{ maxWidth: '640px', margin: '40px auto', padding: '0 20px', textAlign: 'center' }}>
        <div style={{
          width: '72px', height: '72px',
          borderRadius: '24px',
          background: 'rgba(52, 190, 213, 0.12)',
          color: '#1A9DB8',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px auto',
          boxShadow: '0 8px 24px rgba(52, 190, 213, 0.15)'
        }}>
          <History size={36} />
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#17212D', marginBottom: '12px', letterSpacing: '-0.02em' }}>
          Historique de vos Diagnostics
        </h1>

        {userEmail && (
          <div style={{ display: 'inline-block', background: '#F1F5F9', padding: '6px 16px', borderRadius: '9999px', fontSize: '0.86rem', fontWeight: 600, color: '#475569', marginBottom: '24px' }}>
            Compte : {userEmail}
          </div>
        )}

        <div style={{
          background: '#FFFFFF',
          border: '1.5px dashed #CBD5E1',
          borderRadius: '20px',
          padding: '40px 24px',
          marginBottom: '32px'
        }}>
          <Construction size={40} style={{ color: '#F59E0B', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>
            Espace Historique en construction
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto' }}>
            Cet espace vous permettra de retrouver l'ensemble de vos diagnostics passés, vos scores et vos rapports PDF téléchargeables.
          </p>
        </div>

        {onBack && (
          <Button variant="outline" onClick={onBack} style={{ borderRadius: '12px', fontWeight: 700 }}>
            <ArrowLeft size={16} style={{ marginRight: '8px' }} />
            <span>Retour à l'accueil</span>
          </Button>
        )}
      </div>
    </ScreenWrapper>
  );
};
