import React from 'react';
import { Award } from 'lucide-react';
import { Button } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';

export const FinParcoursScreen = ({ onRestart, onShare }) => (
  <ScreenWrapper>
    <div className="animate-scale-in" style={{ textAlign: 'center', maxWidth: '480px', margin: '0 auto', padding: 'var(--space-10) 0' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '96px', height: '96px', borderRadius: '50%', background: 'rgba(0, 184, 163, 0.08)', color: 'var(--color-teal)', marginBottom: '24px' }}>
        <Award size={48} />
      </div>
      <span className="section-tag" style={{ marginBottom: 'var(--space-4)', display: 'inline-flex' }}>Parcours terminé</span>
      <h1 style={{ fontSize: 'clamp(1.65rem, 4vw, 2.25rem)', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.025em', marginBottom: 'var(--space-5)' }}>
        Merci d'avoir réalisé votre diagnostic !
      </h1>
      <p style={{ fontSize: '1rem', color: 'var(--slate-500)', lineHeight: 1.7, marginBottom: 'var(--space-8)', maxWidth: '400px', margin: '0 auto var(--space-8)' }}>
        Votre rapport est prêt. Gardez vos priorités d'action en tête et revenez dans quelques semaines pour mesurer votre progression.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxWidth: '320px', margin: '0 auto' }}>
        <Button variant="primary" size="lg" full onClick={onRestart}>Faire un autre diagnostic</Button>
        <Button variant="outline" full onClick={onShare}>Partager ce lien</Button>
      </div>
      <p style={{ marginTop: 'var(--space-8)', fontSize: '0.8rem', color: 'var(--slate-400)' }}>
        FUND.lab — L'évaluation intelligente des entreprises
      </p>
    </div>
  </ScreenWrapper>
);
