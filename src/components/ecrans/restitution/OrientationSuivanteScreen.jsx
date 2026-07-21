import React from 'react';
import { Compass, Users, Target, Calendar, TrendingUp, FileText, AlertOctagon } from 'lucide-react';
import { Button } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';

export const OrientationSuivanteScreen = ({ score, onDownload, onRestart, onContact, onCatalog, restitution, onBack }) => {
  const isCritical = score < 40;
  const isMedium = score >= 40 && score < 70;
  const isHigh = score >= 70;

  const nextModuleCode = restitution?.next_module;
  const moduleLabels = {
    'PRJ-02': 'Diagnostic Projet',
    'FLH-01': 'Diagnostic Flash',
    'DIF-03': 'Diagnostic Difficulté',
    'OPP-04': 'Diagnostic Opportunité',
    'PRO-05': 'Diagnostic Offre/Produits',
    'COM-06': 'Diagnostic Commercial',
    'FIN-07': 'Diagnostic Finance',
    'GOV-08': 'Diagnostic Organisation',
    '360-09': 'Diagnostic Complet 360°',
  };
  const nextModuleName = nextModuleCode ? moduleLabels[nextModuleCode] : null;

  return (
    <ScreenWrapper>
      {onBack && <TopBackLink onClick={onBack} />}
      <div className="result-wrap animate-fade-up">
        <h1 className="screen-title" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '10px' }}>Quelle est la suite ?</h1>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.92rem', marginBottom: '24px', lineHeight: '1.5' }}>
          En fonction de votre score, notre outil vous propose plusieurs chemins possibles.
        </p>

        {isCritical && (
          <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-danger)', background: 'var(--color-danger-bg)', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.88rem', fontWeight: 600 }}>
            <AlertOctagon size={20} />
            <div>
              <strong>Situation qui nécessite une attention immédiate</strong>
              <p style={{ fontWeight: 400, marginTop: '2px', color: 'var(--slate-600)' }}>Nous vous recommandons de demander un accompagnement prioritaire pour vous aider à stabiliser votre activité.</p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {nextModuleName ? (
            <Button variant="primary" size="lg" onClick={() => onCatalog()} style={{ width: '100%', justifyContent: 'center', gap: '8px' }}>
              <Compass size={18} /> Commencer le module : {nextModuleName}
            </Button>
          ) : (
            <>
              {isCritical && (
                <Button variant="primary" size="lg" onClick={onContact} style={{ width: '100%', justifyContent: 'center', gap: '8px' }}>
                  <Users size={18} /> Demander un suivi prioritaire
                </Button>
              )}

              {isMedium && (
                <Button variant="primary" size="lg" onClick={onCatalog} style={{ width: '100%', justifyContent: 'center', gap: '8px' }}>
                  <Compass size={18} /> Structurer les pratiques (Voir les diagnostics)
                </Button>
              )}

              {isHigh && (
                <Button variant="primary" size="lg" onClick={onCatalog} style={{ width: '100%', justifyContent: 'center', gap: '8px' }}>
                  <Target size={18} /> Évaluer une opportunité (Module Opportunité)
                </Button>
              )}
            </>
          )}

          {isCritical && nextModuleName && (
            <Button variant="outline" onClick={onContact} style={{ width: '100%', justifyContent: 'center', gap: '8px' }}>
              <Users size={18} /> Demander un suivi prioritaire
            </Button>
          )}
          {isMedium && (
            <Button variant="outline" onClick={onContact} style={{ width: '100%', justifyContent: 'center', gap: '8px' }}>
              <Calendar size={18} /> Planifier un suivi conseil
            </Button>
          )}
          {isHigh && (
            <Button variant="outline" onClick={onContact} style={{ width: '100%', justifyContent: 'center', gap: '8px' }}>
              <TrendingUp size={18} /> Préparer une étape de croissance
            </Button>
          )}

          <div style={{ height: '1px', background: 'var(--slate-200)', margin: '12px 0' }} />

          <Button variant="teal" onClick={onDownload} style={{ width: '100%', justifyContent: 'center', gap: '8px', color: '#fff' }}>
            <FileText size={18} /> Télécharger mon résumé PDF
          </Button>
          <Button variant="outline" onClick={onRestart} style={{ width: '100%', justifyContent: 'center', gap: '8px' }}>
            <Compass size={18} /> Recommencer un autre diagnostic
          </Button>
        </div>

        <div style={{ padding: '16px', background: 'var(--slate-50)', borderRadius: '12px', border: '1px solid var(--slate-200)' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--slate-700)' }}>Rappel :</strong> Ce diagnostic est indicatif et ne remplace pas l\'analyse d\'un expert.
            Les recommandations proposées sont basées uniquement sur vos réponses déclaratives.
          </p>
        </div>
      </div>
    </ScreenWrapper>
  );
};
