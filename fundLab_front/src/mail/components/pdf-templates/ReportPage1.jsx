import React from 'react';
import logoUrl from '../../../assets/logo_compact.png';

export const ReportPage1 = () => {
  return (
    <main className="a4-page">
      {/* Background Decor */}
      <div className="bg-pattern"></div>

      {/* Header */}
      <header className="header" data-purpose="main-header">
        <div className="header-logo">
          <img alt="Business Check-up Logo" src={logoUrl} />
        </div>
        <div className="header-info">
          <span className="header-label">RAPPORT DE DIAGNOSTIC</span>
          <div className="page-number" data-purpose="page-number">01</div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero" data-purpose="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Votre situation<br />en bref
          </h1>
          <div className="hero-divider"></div>
          <p className="hero-desc">
            Voici une lecture synthétique de votre entreprise et des principaux enseignements de votre diagnostic.
          </p>
        </div>

        {/* Score Card */}
        <div className="score-card" data-purpose="score-summary">
          <h3 className="score-title">Score Indicatif</h3>
          {/* Circular Progress Chart */}
          <div className="circular-progress-container">
            <div className="circular-progress">
              <div className="score-value">
                <span className="score-number">62</span>
                <span className="score-max">/100</span>
              </div>
            </div>
          </div>
          <div>
            <p className="score-level">Niveau de preuve : <span>partiel</span></p>
            <div className="score-interpretation">
              <h4>Interprétation</h4>
              <p>Score indicatif à interpréter avec le niveau de preuve et les recommandations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Grid */}
      <section className="info-grid" data-purpose="business-info-grid">
        {/* Item 1 */}
        <div className="info-item">
          <div className="info-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
            </svg>
          </div>
          <div>
            <p className="info-label">Entreprise</p>
            <p className="info-value">Excellence BTP Bénin</p>
          </div>
        </div>
        {/* Item 2 */}
        <div className="info-item">
          <div className="info-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
            </svg>
          </div>
          <div>
            <p className="info-label">Module Réalisé</p>
            <p className="info-value">Finance &amp; Viabilité</p>
          </div>
        </div>
        {/* Item 3 */}
        <div className="info-item">
          <div className="info-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
              <path d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
            </svg>
          </div>
          <div>
            <p className="info-label">Secteur</p>
            <p className="info-value">BTP &amp; Construction</p>
          </div>
        </div>
        {/* Item 4 */}
        <div className="info-item">
          <div className="info-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
            </svg>
          </div>
          <div>
            <p className="info-label">Date du Diagnostic</p>
            <p className="info-value">Juillet 2026</p>
          </div>
        </div>
        {/* Item 5 */}
        <div className="info-item">
          <div className="info-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
            </svg>
          </div>
          <div>
            <p className="info-label">Zone</p>
            <p className="info-value">Littoral, Cotonou, Akpakpa</p>
          </div>
        </div>
        {/* Item 6 */}
        <div className="info-item">
          <div className="info-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
            </svg>
          </div>
          <div>
            <p className="info-label">Référence</p>
            <p className="info-value">BCU-2026-STRAT-001</p>
          </div>
        </div>
      </section>

      {/* Banner Message */}
      <section className="banner" data-purpose="summary-banner">
        <div className="banner-watermark">
          <img alt="" src={logoUrl} />
        </div>
        <div className="banner-content">
          <p className="banner-label">Lecture Générale</p>
          <p className="banner-text">
            Base opérationnelle existante,<br />mais trajectoire encore insuffisamment pilotée.
          </p>
        </div>
      </section>

      {/* Priorities Section */}
      <section className="priorities" data-purpose="priorities-section">
        <div className="priorities-header">
          <h2 className="priorities-title">
            Vos 3 priorités immédiates
          </h2>
        </div>
        <div className="priorities-grid">
          {/* Priority 1 */}
          <div className="priority-item">
            <div className="priority-number">01</div>
            <p className="priority-text">Sécuriser le besoin en fonds de roulement</p>
          </div>
          {/* Priority 2 */}
          <div className="priority-item">
            <div className="priority-number">02</div>
            <p className="priority-text">Renforcer la visibilité financière et la trésorerie</p>
          </div>
          {/* Priority 3 */}
          <div className="priority-item">
            <div className="priority-number">03</div>
            <p className="priority-text">Structurer l'organisation et le pilotage</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="report-footer" data-purpose="page-footer">
        <div className="footer-left">
          <svg style={{ width: '10px', height: '10px', color: 'var(--teal)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
          </svg>
          <a className="footer-link" href="https://checkup.business-assist.io">checkup.business-assist.io</a>
          <div className="footer-divider"></div>
          <span className="footer-confidential">STRICTEMENT CONFIDENTIEL</span>
        </div>
        <div className="footer-right">
          <div>Document généré à partir des informations<br />déclarées par l'utilisateur.</div>
          <div className="footer-divider footer-divider-tall"></div>
          <div className="footer-page">PAGE 1 SUR 3</div>
        </div>
      </footer>
    </main>
  );
};
