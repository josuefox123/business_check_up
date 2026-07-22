import React from 'react';
import { Clock, FileText, BarChart2, AlertTriangle } from 'lucide-react';
import { Button } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';

export const RouteScreen = ({ routeKey, recommendedModule, onStart, onCatalog, onBack }) => {
  const modName = recommendedModule?.name || '';
  const modDuration = recommendedModule?.duration || '';
  const modDescription = recommendedModule?.description || '';

  const routeDisplay = {
    S10: {
      cardTitle: `Votre orientation recommandée : ${modName}`,
      body: modDescription || `Votre situation correspond à un projet ou une activité en préparation. Le module "${modName}" est conçu pour vous aider à valider vos hypothèses et identifier vos prochaine étapes.`,
      cta: `Démarrer ${modName}`,
      warning: null,
    },
    S11: {
      cardTitle: `Votre entreprise traverse une difficulté`,
      body: modDescription || `Votre entreprise semble traverser une difficulté. Notre outil vous recommande le module "${modName}" — conçu pour identifier rapidement les causes et les actions de stabilisation.`,
      cta: `Démarrer ${modName}`,
      warning: 'Ce module est prioritaire. Il est fortement recommandé de le compléter avant tout autre diagnostic.',
    },
    S12: {
      cardTitle: `Vous cherchez à saisir une opportunité`,
      body: modDescription || `Vous cherchez à saisir une opportunité. Le module "${modName}" vérifie si votre entreprise est prête et sous quelles conditions le succès est envisageable.`,
      cta: `Démarrer ${modName}`,
      warning: 'Ce diagnostic ne constitue PAS une validation d\'éligibilité à un financement.',
    },
  };

  const cfg = routeDisplay[routeKey] || {
    cardTitle: `Votre orientation recommandée : ${modName}`,
    body: modDescription || `Notre outil vous recommande le module "${modName}" sur la base de votre profil et de vos réponses au triage.`,
    cta: `Démarrer ${modName}`,
    warning: null,
  };

  return (
    <ScreenWrapper>
      {onBack && <TopBackLink onClick={onBack} />}
      <div className="route-wrap animate-fade-up">
        <div className="route-card" style={{ padding: '24px', border: '1px solid var(--slate-200)', borderRadius: '16px', background: 'var(--bg-white)', marginTop: '0' }}>
          <h1 className="route-title" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '12px' }}>
            {cfg.cardTitle}
          </h1>
          <p className="route-body" style={{ color: 'var(--slate-600)', fontSize: '0.92rem', lineHeight: '1.55', marginBottom: '20px' }}>
            {cfg.body}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            {modDuration && (
              <div className="route-detail-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                <Clock size={15} className="text-blue" />
                <span>Durée estimée : <strong>{modDuration}</strong></span>
              </div>
            )}
            {recommendedModule?.question_count && (
              <div className="route-detail-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                <FileText size={15} className="text-blue" />
                <span>Nombre de questions : <strong>{recommendedModule.question_count} questions</strong></span>
              </div>
            )}
            <div className="route-detail-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
              <BarChart2 size={15} className="text-blue" />
              <span>Vous recevrez : <strong>Score, forces, fragilités, priorités d\'action, orientation</strong></span>
            </div>
            <div className="route-detail-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
              <FileText size={15} className="text-blue" />
              <span>Vous pouvez répondre avec des <strong>estimations</strong>. Option "Je ne sais pas" disponible.</span>
            </div>
          </div>

          {cfg.warning && (
            <div className="alert alert-warning" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-warning)', background: 'var(--color-warning-bg)', padding: '10px 14px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.82rem', fontWeight: 600 }}>
              <AlertTriangle size={15} />
              <span>{cfg.warning}</span>
            </div>
          )}

          <div className="route-actions">
            <Button variant="primary" size="lg" onClick={onStart} style={{ width: '100%', justifyContent: 'center' }}>
              {cfg.cta}
            </Button>
            <div className="route-actions-secondary">
              <Button variant="outline" onClick={onCatalog} style={{ width: '100%', justifyContent: 'center' }}>
                Voir les autres diagnostics
              </Button>
              <Button variant="outline" onClick={onBack} style={{ width: '100%', justifyContent: 'center' }}>
                Modifier mes réponses
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ScreenWrapper>
  );
};
