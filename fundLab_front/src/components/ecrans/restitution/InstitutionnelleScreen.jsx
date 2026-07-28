import React from 'react';
import { Globe, FileText, Handshake, ArrowLeft } from 'lucide-react';
import { Button } from '../../ui/index.jsx';
import { ScreenWrapper } from '../../layout/Navbar.jsx';
import { TopBackLink } from '../partage/sharedUI.jsx';
import aboutIllustration from '../../../assets/about_illustration.png';

const OBJECTIVES = [
  {
    icon: Globe,
    title: "Démocratiser l'accès",
    description: "Permettre à chaque créateur de projet ou dirigeant de PME d'accéder sans frais à des outils d'audit d'un niveau digne des plus grands cabinets conseils."
  },
  {
    icon: FileText,
    title: "Recommandations concrètes",
    description: "Fournir un plan d'action balisé plutôt qu'une simple note. Chaque indicateur est corrélé à une opportunité d'optimisation."
  },
  {
    icon: Handshake,
    title: "Créer un écosystème",
    description: "Connecter les entreprises auditées avec les meilleurs accompagnateurs locaux pour initier et sécuriser leur croissance long terme."
  }
];

export const InstitutionnelleScreen = ({ onBack, onContact }) => (
  <ScreenWrapper wide>
    {onBack && <TopBackLink onClick={onBack} />}
    <div className="about-page animate-fade-up" style={{ paddingTop: '24px', paddingBottom: '64px' }}>
      {/* Hero Section */}
      <section className="section" style={{ background: 'var(--color-white)', borderRadius: '16px', padding: '32px 24px', marginBottom: '32px' }}>
        <div className="container" style={{ display: 'flex', gap: 'var(--spacing-2xl)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: 'var(--spacing-lg)', letterSpacing: '-0.02em' }}>À propos du Business Check-up</h1>
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <h3 style={{ marginBottom: 'var(--spacing-xs)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-800)' }}>Notre mission</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '1rem', lineHeight: '1.6' }}>
                Accompagner activement les entrepreneurs et les entreprises africaines dans leur développement grâce à des outils d'évaluation intelligents, inclusifs et hautement accessibles.
              </p>
            </div>
            <div>
              <h3 style={{ marginBottom: 'var(--spacing-xs)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--slate-800)' }}>Notre vision</h3>
              <p style={{ color: 'var(--slate-600)', fontSize: '1rem', lineHeight: '1.6' }}>
                Devenir la plateforme numérique de référence incontournable pour l'évaluation et l'accompagnement des structures en Afrique francophone.
              </p>
            </div>
          </div>
          <div style={{ flex: '1', minWidth: '300px', display: 'flex', justifyContent: 'center' }}>
            <img
              src={aboutIllustration}
              alt="Entrepreneurs collaborant sur le Business Check-up"
              style={{
                width: '100%',
                maxWidth: '480px',
                height: 'auto',
                maxHeight: '340px',
                objectFit: 'cover',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-md)',
                border: '1px solid var(--slate-200)'
              }}
            />
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="section bg-light" style={{ borderRadius: '16px', padding: '32px 24px', marginBottom: '32px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '28px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)' }}>Nos objectifs</h2>
            <p className="text-subtitle" style={{ color: '#64748B', fontSize: '0.95rem' }}>Notre cadre d'action s'appuie sur trois piliers fondamentaux.</p>
          </div>
          <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {OBJECTIVES.map((obj, idx) => {
              const IconComp = obj.icon;
              return (
                <div key={idx} className="card" style={{ background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <div className="card-icon" style={{ color: 'var(--color-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '48px', width: '48px', borderRadius: '12px', background: 'rgba(52, 190, 213, 0.1)', marginBottom: '16px' }}>
                    <IconComp size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>{obj.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: '1.5', margin: 0 }}>{obj.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Actions Section */}
      <section className="section bg-light text-center">
        <div className="container" style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
          {onContact && <Button variant="primary" onClick={onContact}>Nous contacter</Button>}
          {onBack && (
            <Button variant="outline" onClick={onBack} style={{ gap: '8px' }}>
              <ArrowLeft size={16} />
              <span>Revenir à l'accueil</span>
            </Button>
          )}
        </div>
      </section>
    </div>
  </ScreenWrapper>
);
