import React from 'react';
import { ShieldCheck, CheckCircle, AlertTriangle, Target, Calendar, Download } from 'lucide-react';
import { Button, ScoreGauge } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';
import { generateDiagnosticPDF } from '../../../utils/generateDiagnosticPDF.js';
import { getRestitutionData } from '../../../utils/restitutionHelper.js';

export const getLevel = (s) => {
  if (s < 20) return { label: 'Critique', color: 'var(--score-critique)' };
  if (s < 40) return { label: 'Fragile', color: 'var(--score-fragile)' };
  if (s < 60) return { label: 'Stable', color: 'var(--score-stable)' };
  if (s < 80) return { label: 'Solide', color: 'var(--score-solide)' };
  return { label: 'Avancé', color: 'var(--score-avance)' };
};

export const getConfidence = (a) => {
  const values = Object.values(a || {});
  const e3Count = values.filter(v => v === 'E3').length;
  const e2e3Count = values.filter(v => v === 'E2' || v === 'E3').length;
  const e1e2e3Count = values.filter(v => v === 'E1' || v === 'E2' || v === 'E3').length;

  if (e3Count >= 2) return 'Vérifiable';
  if (e2e3Count >= 3) return 'Documenté';
  if (e1e2e3Count >= 1) return 'Partiel';
  return 'Déclaratif';
};

export const ResultatSyntheseScreen = ({ score, answers, moduleId, onDetail, onContact, onRestart, onBack, restitution }) => {
  const lvl = getLevel(score);
  const conf = getConfidence(answers);

  const moduleNames = {
    'PRJ-02': 'Diagnostic Projet',
    'DIF-03': 'Diagnostic Difficulté',
    'OPP-04': 'Diagnostic Opportunité',
    'FLH-01': 'Diagnostic Flash',
  };
  const cleanModuleName = moduleNames[moduleId] || moduleId;

  // Plan d'action détaillé
  const { forces, fragilites, priorityText, priorities } = getRestitutionData({
    score,
    answers,
    moduleId,
    restitution
  });

  return (
    <ScreenWrapper wide>
      <div className="animate-fade-up">
        {onBack && <TopBackLink onClick={onBack} />}
        {/* Dashboard Header */}
        <div className="results-header">
          <div className="results-header-info">
            <span className="badge badge-teal" style={{ marginBottom: 'var(--space-4)' }}>Rapport Généré</span>
            <h1>Tableau de bord : {cleanModuleName}</h1>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)', textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1 }}>{score}</div>
            <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 'var(--space-1)' }}>Score Global</div>
          </div>
        </div>

        {/* KPI Card */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '32px 0', marginBottom: '24px' }}>
          <ScoreGauge score={score} size={160} />
        </div>

        {/* Forces & Vigilances */}
        {(forces.length > 0 || fragilites.length > 0) && (
          <div style={{ marginTop: '40px', borderTop: '2px dashed var(--slate-200)', paddingTop: '40px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '24px' }}>
              Analyse des Forces & Points de vigilance
            </h2>

            <div className="ff-grid" style={{ display: 'grid', gridTemplateColumns: forces.length > 0 && fragilites.length > 0 ? '1fr 1fr' : '1fr', gap: '24px', marginBottom: '24px' }}>
              {forces.length > 0 && (
                <div className="ff-card" style={{ padding: '24px', border: '1px solid var(--slate-200)', borderRadius: '16px', background: 'var(--bg-white)' }}>
                  <div className="ff-card-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: 'var(--color-primary)', fontSize: '1.05rem', marginBottom: '16px' }}>
                    <CheckCircle size={18} style={{ color: 'var(--color-success, #10B981)' }} />
                    Points d'appui (Forces)
                  </div>
                  <ul className="ff-items" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0, margin: 0 }}>
                    {forces.map((f, i) => (
                      <li key={i} className="ff-item" style={{ fontSize: '0.9rem', color: 'var(--slate-600)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <span className="ff-item-dot green" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-success, #10B981)', marginTop: '6px', flexShrink: 0 }} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {fragilites.length > 0 && (
                <div className="ff-card" style={{ padding: '24px', border: '1px solid var(--slate-200)', borderRadius: '16px', background: 'var(--bg-white)' }}>
                  <div className="ff-card-header" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: 'var(--color-primary)', fontSize: '1.05rem', marginBottom: '16px' }}>
                    <AlertTriangle size={18} style={{ color: 'var(--color-warning, #F59E0B)' }} />
                    Points de vigilance (Fragilités)
                  </div>
                  <ul className="ff-items" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0, margin: 0 }}>
                    {fragilites.map((f, i) => (
                      <li key={i} className="ff-item" style={{ fontSize: '0.9rem', color: 'var(--slate-600)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <span className="ff-item-dot orange" style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-warning, #F59E0B)', marginTop: '6px', flexShrink: 0 }} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {priorityText && (
              <div className="ff-priority" style={{ padding: '20px', background: 'var(--slate-50)', borderRadius: '16px', border: '1px solid var(--slate-200)', marginBottom: '40px' }}>
                <div className="ff-priority-label" style={{ fontWeight: 800, color: 'var(--slate-800)', fontSize: '0.88rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Point prioritaire</div>
                <p className="ff-priority-text" style={{ fontSize: '0.92rem', color: 'var(--slate-600)', lineHeight: '1.6', margin: 0 }}>
                  {priorityText}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Priorités d'Action */}
        {priorities.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '12px' }}>
              Plan d'Actions Prioritaires
            </h2>
            <p className="screen-desc" style={{ marginBottom: '24px' }}>Actions ordonnées recommandées par notre algorithme de scoring :</p>

            <div className="priority-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {priorities.map((p, i) => (
                <div key={i} className={`priority-item ${i === 0 && score < 40 ? 'danger' : i === 0 && score < 70 ? 'warning' : ''}`} style={{ display: 'flex', gap: '16px', padding: '20px', border: '1px solid var(--slate-200)', borderRadius: '16px', background: 'var(--bg-white)' }}>
                  <div className="priority-icon" style={{ color: 'var(--color-blue)', background: 'var(--color-blue-light)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Target size={22} />
                  </div>
                  <div className="priority-content">
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 850, color: 'var(--slate-800)', marginBottom: '6px' }}>Priorité {i + 1}</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: '1.55', margin: 0 }}>{p.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions Footer */}
        <div className="results-actions" style={{ marginTop: '40px', borderTop: '1px solid var(--slate-200)', paddingTop: '28px' }}>
          <Button variant="outline" onClick={onContact}><Download size={18} /> Exporter PDF</Button>
          <Button variant="teal" onClick={onContact}><Calendar size={18} /> Planifier un suivi</Button>
        </div>
      </div>
    </ScreenWrapper>
  );
};
