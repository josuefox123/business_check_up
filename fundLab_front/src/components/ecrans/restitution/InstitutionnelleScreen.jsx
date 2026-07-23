import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, FileText, Handshake } from 'lucide-react';
import { Button } from '../../ui/index.jsx';
import logoImg from '../../../assets/logo_compact.png';
import aboutIllustration from '../../../assets/about_illustration.png';

export const InstitutionnelleScreen = ({ onBack, onContact }) => (
  <div className="about-page animate-fade-up" style={{ paddingTop: '72px', paddingBottom: '96px' }}>
    {/* Hero Section */}
    <section className="section" style={{ background: 'var(--color-white)' }}>
      <div className="container" style={{ display: 'flex', gap: 'var(--spacing-2xl)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '320px' }}>
          <h1 style={{ fontSize: '40px', marginBottom: 'var(--spacing-xl)' }}>À propos du Business Check-up</h1>
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h5 style={{ marginBottom: 'var(--spacing-xs)', fontSize: '20px' }}>Notre mission</h5>
            <p style={{ color: 'var(--color-text)', fontSize: '16px', lineHeight: '1.6' }}>
              Accompagner activement les entrepreneurs et les entreprises africaines dans leur développement grâce à des outils d'évaluation intelligents, inclusifs et hautement accessibles.
            </p>
          </div>
          <div>
            <h5 style={{ marginBottom: 'var(--spacing-xs)', fontSize: '20px' }}>Notre vision</h5>
            <p style={{ color: 'var(--color-text)', fontSize: '16px', lineHeight: '1.6' }}>
              Devenir la plateforme numérique de référence incontournable pour l'évaluation et l'accompagnement des structures en Afrique francophone.
            </p>
          </div>
        </div>
        <div style={{ flex: '1', minWidth: '320px', display: 'flex', justifyContent: 'center' }}>
          <img
            src={aboutIllustration}
            alt="Entrepreneurs collaborant sur le Business Check-up"
            style={{
              width: '100%',
              maxWidth: '500px',
              height: 'auto',
              maxHeight: '350px',
              objectFit: 'cover',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--slate-200)'
            }}
          />
        </div>
      </div>
    </section>

    {/* Objectives Section */}
    <section className="section bg-light">
      <div className="container">
        <div className="section-header">
          <h2>Nos objectifs</h2>
          <p className="text-subtitle">Notre cadre d'action s'appuie sur trois piliers fondamentaux.</p>
        </div>
        <div className="grid-3">
          <div className="card">
            <div className="card-icon" style={{ color: 'var(--color-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '48px' }}><Globe size={24} /></div>
            <h5>Démocratiser l'accès</h5>
            <p>Permettre à chaque créateur de projet ou dirigeant de PME d'accéder sans frais à des outils d'audit d'un niveau digne des plus grands cabinets conseils.</p>
          </div>
          <div className="card">
            <div className="card-icon" style={{ color: 'var(--color-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '48px' }}><FileText size={24} /></div>
            <h5>Recommandations concrètes</h5>
            <p>Fournir un plan d'action balisé plutôt qu'une simple note. Chaque indicateur est corrélé à une opportunité d'optimisation.</p>
          </div>
          <div className="card">
            <div className="card-icon" style={{ color: 'var(--color-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '48px' }}><Handshake size={24} /></div>
            <h5>Créer un écosystème</h5>
            <p>Connecter les entreprises auditées avec les meilleurs accompagnateurs locaux pour initier et sécuriser leur croissance long terme.</p>
          </div>
        </div>
      </div>
    </section>

    {/* Actions Section */}
    <section className="section bg-light text-center">
      <div className="container" style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button variant="primary" onClick={onContact}>Nous contacter</Button>
        <Button variant="outline" onClick={onBack}>Revenir à l'accueil</Button>
      </div>
    </section>
  </div>
);
