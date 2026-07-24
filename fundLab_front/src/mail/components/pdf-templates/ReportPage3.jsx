import React from 'react';
import logoUrl from '../../../assets/logo_compact.png';

export const ReportPage3 = () => {
  return (
    <main className="a4-page page-3">
      <div className="bg-accent-bar"></div>

      {/* Watermark Elements */}
      <div className="watermark-top-right"></div>

      {/* Header */}
      <header className="header">
        <div className="header-logo">
          <img alt="Business Check-up Logo" src={logoUrl} />
        </div>
        <div className="header-info">
          <span className="header-label">Rapport de Diagnostic</span>
          <div className="page-number">03</div>
        </div>
      </header>

      {/* BEGIN: SectionTitle */}
      <section className="section-title">
        <h1>VOTRE PLAN DE TRAVAIL PRIORITAIRE</h1>
        <div className="title-divider"></div>
        <p>Des actions concrètes pour améliorer votre performance et renforcer votre trajectoire.</p>
      </section>
      {/* END: SectionTitle */}
      {/* BEGIN: PriorityColumns */}
      <section className="priority-grid" data-purpose="priority-grid">
        {/* Priority 01: Immediate */}
        <article className="priority-card cyan">
          <div className="card-header">
            <div className="card-badge-row">
              <span className="badge-number cyan">01</span>
              <h3 className="card-subtitle cyan">Priorité immédiate</h3>
            </div>
            {/* <div className="card-icon-container">
              <div className="card-icon cyan">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
            </div> */}
            <h2 className="card-title">Sécuriser le besoin en fonds de roulement</h2>
            <p className="card-desc">Améliorer la visibilité sur les entrées/sorties de trésorerie et réduire les tensions.
            </p>
          </div>
          <div className="card-body">
            <h4 className="actions-title cyan">Actions clés</h4>
            <ul className="actions-list">
              <li>
                <span className="bullet cyan">•</span>
                Chiffrer le BFR par activité / chantier
              </li>
              <li>
                <span className="bullet cyan">•</span>
                Mettre en place un suivi hebdomadaire de trésorerie
              </li>
              <li>
                <span className="bullet cyan">•</span>
                Négocier les délais fournisseurs
              </li>
            </ul>
          </div>
          <div className="card-footer cyan">
            <div className="footer-title-row cyan">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              <span>Données / preuves à préparer</span>
            </div>
            <p>Tableau BFR, encours chantiers, relevés bancaires récents, conditions fournisseurs.</p>
          </div>
        </article>
        {/* Priority 02: Important */}
        <article className="priority-card orange">
          <div className="card-header">
            <div className="card-badge-row">
              <span className="badge-number orange">02</span>
              <h3 className="card-subtitle orange">Priorité importante</h3>
            </div>
            {/* <div className="card-icon-container">
              <div className="card-icon orange">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round"
                    strokeWidth="2"></path>
                </svg>
              </div>
            </div> */}
            <h2 className="card-title">Renforcer la visibilité financière et la trésorerie</h2>
            <p className="card-desc">Mettre en place des outils simples qui améliorent la qualité des décisions.</p>
          </div>
          <div className="card-body">
            <h4 className="actions-title orange">Actions clés</h4>
            <ul className="actions-list">
              <li>
                <span className="bullet orange">•</span>
                Construire un tableau de bord financier mensuel
              </li>
              <li>
                <span className="bullet orange">•</span>
                Suivre les marges par chantier / activité
              </li>
              <li>
                <span className="bullet orange">•</span>
                Prévoir le cash-flow sur 3 mois
              </li>
            </ul>
          </div>
          <div className="card-footer orange">
            <div className="footer-title-row orange">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              <span>Données / preuves à préparer</span>
            </div>
            <p>États financiers, détail des coûts, prévisions de trésorerie, portefeuille de commandes.</p>
          </div>
        </article>
        {/* Priority 03: Structural */}
        <article className="priority-card slate">
          <div className="card-header">
            <div className="card-badge-row">
              <span className="badge-number indigo">03</span>
              <h3 className="card-subtitle indigo">Priorité structurante</h3>
            </div>
            {/* <div className="card-icon-container">
              <div className="card-icon slate">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
            </div> */}
            <h2 className="card-title">Structurer l'organisation et le pilotage</h2>
            <p className="card-desc">Clarifier les rôles, formaliser les processus et renforcer le suivi opérationnel.</p>
          </div>
          <div className="card-body">
            <h4 className="actions-title slate">Actions clés</h4>
            <ul className="actions-list">
              <li>
                <span className="bullet slate">•</span>
                Formaliser les processus clés (achats, exécution, reporting)
              </li>
              <li>
                <span className="bullet slate">•</span>
                Définir des indicateurs de suivi par responsable
              </li>
              <li>
                <span className="bullet slate">•</span>
                Mettre en place des réunions de pilotage
              </li>
            </ul>
          </div>
          <div className="card-footer slate">
            <div className="footer-title-row slate">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
              <span>Données / preuves à préparer</span>
            </div>
            <p>Organigramme, fiches de poste, processus existants, indicateurs actuels.</p>
          </div>
        </article>
      </section>
      {/* END: PriorityColumns */}
      {/* BEGIN: NextStepsBanner */}
      <section className="banners-grid">
        {/* Recommendation Box */}
        <div className="banner-box cyan" data-purpose="step-recommendation">
          <div className="banner-icon-container">
            <div className="banner-icon cyan">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                </path>
              </svg>
            </div>
          </div>
          <div>
            <h4 className="banner-title cyan">Prochaine étape recommandée</h4>
            <p className="banner-desc">Approfondir votre diagnostic sur Finance &amp; Viabilité pour obtenir une analyse plus
              détaillée et un plan d'action chiffré.</p>
          </div>
        </div>
        {/* Expert Box */}
        <div className="banner-box blue" data-purpose="expert-call">
          <div className="banner-icon-container">
            <div className="banner-icon blue">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
              </svg>
            </div>
          </div>
          <div>
            <h4 className="banner-title blue">Besoin d'un échange avec un expert ?</h4>
            <p className="banner-desc">Nous pouvons vous accompagner pour prioriser vos actions et sécuriser vos décisions.
            </p>
          </div>
        </div>
      </section>
      {/* END: NextStepsBanner */}

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
          <div className="footer-page">PAGE 3 SUR 3</div>
        </div>
      </footer>


    </main>
  );
};
