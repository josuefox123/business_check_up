import React from 'react';
import { Target } from 'lucide-react';
import { Button } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';

export const PrioritesActionScreen = ({ score, onContinue, onBack, restitution }) => {
  const backendPriorities = restitution?.priority_actions || restitution?.priorities || [];

  const priorities = backendPriorities.length > 0
    ? backendPriorities.map((text, i) => {
      if (typeof text === 'object') return text;
      const labels = ['Action immédiate', 'Stabilisation à 30 jours', 'Plan de relance', 'Structuration', 'Capitalisation', 'Croissance'];
      return {
        label: labels[i] || 'Action recommandée',
        text: text
      };
    })
    : (score < 40 ? [
      { label: 'Action immédiate', text: 'Évaluer la trésorerie disponible et contacter votre banque ou un conseiller financier sous 48h.' },
      { label: 'Stabilisation à 30 jours', text: 'Identifier les charges non essentielles à réduire et les créances à recouvrer en priorité.' },
      { label: 'Plan de relance', text: 'Définir un plan commercial minimal pour retrouver un flux de revenus régulier d\'ici 60 jours.' },
    ] : score < 70 ? [
      { label: 'Action immédiate', text: 'Mettre en place un suivi mensuel de trésorerie avec un tableau de bord simple.' },
      { label: 'Structuration à 30 jours', text: 'Formaliser votre offre commerciale et votre processus de vente pour gagner en efficacité.' },
      { label: 'Préparation à 90 jours', text: 'Explorer les opportunités de financement (aides, prêts) pour financer votre développement.' },
    ] : [
      { label: 'Capitaliser', text: 'Documenter et formaliser vos pratiques qui fonctionnent pour les reproduire à l\'échelle.' },
      { label: 'Croissance', text: 'Identifier et tester un nouveau segment de marché ou canal d\'acquisition dans les 60 jours.' },
      { label: 'Préparation', text: 'Préparer votre entreprise pour une éventuelle levée de fonds ou un partenariat stratégique.' },
    ]);

  return (
    <ScreenWrapper>
      {onBack && <TopBackLink onClick={onBack} />}
      <div className="animate-fade-up">
        <div className="screen-header" style={{ marginBottom: '24px' }}>
          <h1 className="screen-title">Vos priorités d'action</h1>
          <p className="screen-desc">Ces actions sont personnalisées en fonction de votre score et de vos réponses.</p>
        </div>

        <div className="priority-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {priorities.map((p, i) => (
            <div key={i} className={`priority-item ${i === 0 && score < 40 ? 'danger' : i === 0 && score < 70 ? 'warning' : ''}`} style={{ display: 'flex', gap: '16px', padding: '18px', border: '1px solid var(--slate-200)', borderRadius: '16px', background: 'var(--bg-white)' }}>
              <div className="priority-icon" style={{ color: 'var(--color-blue)', background: 'var(--color-blue-light)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Target size={22} />
              </div>
              <div className="priority-content">
                <h4 style={{ fontSize: '0.95rem', fontWeight: 850, color: 'var(--slate-800)', marginBottom: '4px' }}>Priorité {i + 1} : {p.label}</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', lineHeight: '1.5' }}>{p.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="screen-nav" style={{ justifyContent: 'flex-end', marginTop: '32px' }}>
          <Button variant="primary" onClick={onContinue}>Continuer →</Button>
        </div>
      </div>
    </ScreenWrapper>
  );
};
