import React, { useState } from 'react';
import { Compass, Users, Target, Calendar, TrendingUp, FileText, AlertOctagon, Loader2, RotateCcw } from 'lucide-react';
import { Button } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';
import { generateReportPDF } from '../../../utils/generateReportPDF.js';

export const OrientationSuivanteScreen = ({ score, onDownload, onRestart, onContact, onCatalog, restitution, onBack }) => {
  const restData = restitution?.restitution || restitution || {};
  const scoring = restitution?.scoring || {};

  const isCritical = Boolean(scoring?.has_critical_red_flag) || score < 40;
  const isMedium = score >= 40 && score < 70;
  const isHigh = score >= 70;
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfError, setPdfError] = useState('');

  const handleDownload = async () => {
    setIsGeneratingPDF(true);
    setPdfError('');
    try {
      if (onDownload) {
        await onDownload();
      } else {
        await generateReportPDF();
      }
    } catch (err) {
      console.error('Erreur génération PDF:', err);
      setPdfError(err?.message || '[generate_pdf_error] Échec de la génération du rapport PDF. Veuillez ré-essayer.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const nextModuleCode = restData?.next_module || restitution?.next_module;
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
  const nextModuleName = nextModuleCode ? (moduleLabels[nextModuleCode] || nextModuleCode) : null;
  const orientationText = restData?.orientation_text || restitution?.orientation_text;

  return (
    <ScreenWrapper>
      {onBack && <TopBackLink onClick={onBack} />}
      <div className="result-wrap animate-fade-up">
        <h1 className="screen-title" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '10px' }}>Quelle est la suite ?</h1>
        <p style={{ color: 'var(--slate-500)', fontSize: '0.92rem', marginBottom: '24px', lineHeight: '1.5' }}>
          En fonction de votre score, notre outil vous propose plusieurs chemins possibles.
        </p>

        {/* Dynamic Backend Orientation Text if present */}
        {orientationText && (
          <div style={{ background: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: '12px', padding: '14px 18px', marginBottom: '24px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0D9488', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              RECOMMANDATION D'ORIENTATION
            </span>
            <p style={{ fontSize: '0.9rem', color: '#134E4A', lineHeight: 1.5, margin: 0 }}>
              {orientationText}
            </p>
          </div>
        )}

        {isCritical && (
          <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-danger)', background: 'var(--color-danger-bg)', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.88rem', fontWeight: 600 }}>
            <AlertOctagon size={20} style={{ flexShrink: 0 }} />
            <div>
              <strong>Situation qui nécessite une attention immédiate</strong>
              <p style={{ fontWeight: 400, marginTop: '2px', color: 'var(--slate-600)', margin: 0 }}>Nous vous recommandons de demander un accompagnement prioritaire pour vous aider à stabiliser votre activité.</p>
            </div>
          </div>
        )}

        {/* PDF error boundary alert */}
        {pdfError && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.84rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{pdfError}</span>
            <Button variant="outline" size="sm" onClick={handleDownload} style={{ gap: '4px' }}>
              <RotateCcw size={12} /> Réessayer
            </Button>
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

          <Button
            variant="teal"
            onClick={handleDownload}
            disabled={isGeneratingPDF}
            style={{ width: '100%', justifyContent: 'center', gap: '8px', color: '#fff', opacity: isGeneratingPDF ? 0.7 : 1 }}
          >
            {isGeneratingPDF ? (
              <><Loader2 size={18} className="animate-spin" /> Génération en cours...</>
            ) : (
              <><FileText size={18} /> Télécharger mon rapport PDF</>
            )}
          </Button>
          <Button variant="outline" onClick={onRestart} style={{ width: '100%', justifyContent: 'center', gap: '8px' }}>
            <Compass size={18} /> Recommencer un autre diagnostic
          </Button>
        </div>

        <div style={{ padding: '16px', background: 'var(--slate-50)', borderRadius: '12px', border: '1px solid var(--slate-200)' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', lineHeight: 1.6, margin: 0 }}>
            <strong style={{ color: 'var(--slate-700)' }}>Rappel :</strong> Ce diagnostic est indicatif et ne remplace pas l'analyse d'un expert.
            Les recommandations proposées sont basées uniquement sur vos réponses déclaratives.
          </p>
        </div>
      </div>
    </ScreenWrapper>
  );
};
