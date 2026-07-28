import React from 'react';
import { Button } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { ClipboardCheck, ArrowRight, ArrowLeft, Check } from 'lucide-react';

export const EnrichmentConsentScreen = ({ onConfirm, onCancel, isLoading = false, estimatedDuration, moduleName }) => {
  // Rule 9: Normalisation des données et des chaînes de texte au début du composant
  const displayTitle = moduleName ? `Enrichir mon diagnostic — ${moduleName}` : 'Enrichir mon diagnostic';
  const displayDuration = estimatedDuration ? `Environ ${estimatedDuration}` : '[estimated_duration non disponible]';
  const confirmBtnText = isLoading ? 'Chargement...' : 'Accepter et continuer';

  return (
    <ScreenWrapper>
      <div className="animate-fade-up" style={{ maxWidth: '560px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(52, 190, 213, 0.1)',
          color: '#34BED5',
          marginBottom: '24px'
        }}>
          <ClipboardCheck size={36} />
        </div>

        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#070E24', marginBottom: '16px', lineHeight: '1.3' }}>
          {displayTitle}
        </h1>

        <p style={{ fontSize: '1rem', color: '#64748B', lineHeight: '1.6', marginBottom: '24px' }}>
          Afin de vous donner le diagnostic le plus complet possible, nous vous demandons encore quelques
          minutes qui nous permettront de vous fournir un diagnostic personnalisé et adapté à votre structure.
        </p>

        <div style={{
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'left',
          marginBottom: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ minWidth: '20px', height: '20px', borderRadius: '50%', background: '#34BED5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px' }}>
              <Check size={12} strokeWidth={3} />
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', lineHeight: '1.4' }}>
              <strong>Recommandations précises :</strong> Une analyse plus fine de vos forces et axes d'amélioration.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ minWidth: '20px', height: '20px', borderRadius: '50%', background: '#34BED5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px' }}>
              <Check size={12} strokeWidth={3} />
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', lineHeight: '1.4' }}>
              <strong>Rapport sur-mesure :</strong> Accès à un plan d'actions détaillé à la fin.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <div style={{ minWidth: '20px', height: '20px', borderRadius: '50%', background: '#34BED5', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px' }}>
              <Check size={12} strokeWidth={3} />
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', lineHeight: '1.4' }}>
              <strong>Durée estimée :</strong> {displayDuration}
            </p>
          </div>
        </div>

        <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '32px' }}>
          En continuant, vous acceptez de répondre aux questions complémentaires pour affiner vos résultats.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={isLoading}
            style={{ width: '100%', justifyContent: 'center', gap: '8px', height: '48px', fontSize: '0.95rem', fontWeight: 600, opacity: isLoading ? 0.7 : 1 }}
          >
            <span>{confirmBtnText}</span>
            {!isLoading && <ArrowRight size={16} />}
          </Button>

          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            style={{ width: '100%', justifyContent: 'center', gap: '8px', height: '48px', fontSize: '0.95rem', fontWeight: 600 }}
          >
            <ArrowLeft size={16} /> <span>Retour à la synthèse</span>
          </Button>
        </div>

      </div>
    </ScreenWrapper>
  );
};
