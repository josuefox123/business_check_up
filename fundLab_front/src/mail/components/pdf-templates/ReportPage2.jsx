import React from 'react';
import logoUrl from '../../../assets/logo_compact.png';

export const ReportPage2 = () => {
  return (
    <main className="a4-page page-2">
      <div className="bg-accent-bar"></div>
      {/* Header */}
      <header className="header">
        <div className="header-logo">
          <img alt="Business Check-up Logo" src={logoUrl} />
        </div>
        <div className="header-info">
          <span className="header-label">Rapport de Diagnostic</span>
          <div className="page-number">02</div>
        </div>
      </header>
      {/* END: Header */}
      {/* BEGIN: AnalysisContent */}
      <div className="analysis-content">
        {/* Left Column (Title + Radar) */}
        <div className="analysis-left-column">
          {/* BEGIN: MainTitle */}
          <section className="main-title-section">
            <h1 className="title-large text-navy">Ce que révèle<br />votre diagnostic</h1>
            <div className="title-divider"></div>
            <p className="title-desc">
              Analyse des forces, fragilités et facteurs clés qui influencent votre performance.
            </p>
          </section>
          {/* END: MainTitle */}
          {/* Radar Chart Section */}
          <section className="radar-section" data-purpose="radar-chart-container">
            <h3 className="radar-title">Analyse Multidimensionnelle</h3>
            <p className="radar-subtitle">Niveau de maturité par axe</p>
            {/* Radar Chart Placeholder */}
            <div className="radar-chart-wrapper">
              <svg className="radar-chart-svg" viewBox="-100 -100 600 600">
                {/* Background Polygons (the grid) */}
                <polygon fill="none" points="200,40 338,120 338,280 200,360 62,280 62,120" stroke="#e2e8f0"
                  strokeWidth="1"></polygon>
                <polygon fill="none" points="200,80 304,140 304,260 200,320 96,260 96,140" stroke="#e2e8f0"
                  strokeWidth="1"></polygon>
                <polygon fill="none" points="200,120 269,160 269,240 200,280 131,240 131,160" stroke="#e2e8f0"
                  strokeWidth="1"></polygon>
                {/* Axes Lines */}
                <line stroke="#e2e8f0" x1="200" x2="200" y1="200" y2="40"></line>
                <line stroke="#e2e8f0" x1="200" x2="338" y1="200" y2="120"></line>
                <line stroke="#e2e8f0" x1="200" x2="338" y1="200" y2="280"></line>
                <line stroke="#e2e8f0" x1="200" x2="200" y1="200" y2="360"></line>
                <line stroke="#e2e8f0" x1="200" x2="62" y1="200" y2="280"></line>
                <line stroke="#e2e8f0" x1="200" x2="62" y1="200" y2="120"></line>
                {/* Actual Data Polygon (Simulated) */}
                <polygon fill="rgba(14, 165, 233, 0.2)" points="200,80 320,125 290,265 200,330 80,270 90,135"
                  stroke="#0ea5e9" strokeWidth="3"></polygon>
                {/* Target Level (Dashed) */}
                <polygon fill="none" points="200,60 325,130 325,270 200,340 75,270 75,130" stroke="#94a3b8"
                  strokeDasharray="4" strokeWidth="1"></polygon>
                {/* Labels */}
                <text className="fill-gray-600 font-bold" fill="#4b5563" fontSize="14" textAnchor="middle" x="200"
                  y="15">Finance &amp; Viabilité</text>
                <text className="fill-gray-600 font-bold" fill="#4b5563" fontSize="14" textAnchor="start" x="350"
                  y="115">Organisation &amp; Pilotage</text>
                <text className="fill-gray-600 font-bold" fill="#4b5563" fontSize="14" textAnchor="start" x="350"
                  y="295">Opérations &amp; Exécution</text>
                <text className="fill-gray-600 font-bold" fill="#4b5563" fontSize="14" textAnchor="middle" x="200"
                  y="395">Ressources Humaines</text>
                <text className="fill-gray-600 font-bold" fill="#4b5563" fontSize="14" textAnchor="end" x="50" y="295">Marché
                  &amp; Clients</text>
                <text className="fill-gray-600 font-bold" fill="#4b5563" fontSize="14" textAnchor="end" x="50" y="115">Offre
                  &amp; Positionnement</text>
              </svg>
            </div>
            {/* Legend */}
            <div className="radar-legend">
              <div className="legend-item">
                <span className="legend-line-solid"></span>
                <span>Votre niveau</span>
              </div>
              <div className="legend-item">
                <span className="legend-line-dashed"></span>
                <span>Niveau attendu</span>
              </div>
            </div>
          </section>
        </div>
        {/* Side Cards */}
        <aside className="side-cards">
          {/* Niveau de preuve */}
          <div className="card card-preuve">
            <div className="card-preuve-icon-wrap">
              <svg className="card-preuve-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth="2"></path>
              </svg>
            </div>
            <div>
              <h4 className="card-preuve-subtitle">Niveau de preuve</h4>
              <p className="card-preuve-title">PARTIEL</p>
              <p className="card-preuve-desc">4 éléments clés nécessitent des données ou preuves complémentaires.</p>
            </div>
          </div>
          {/* Points d'appui */}
          <div className="card card-appui">
            <div className="card-header">
              <div className="card-icon-wrap"><svg className="card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
              </svg></div>
              <h4 className="card-title">Points d'appui</h4>
            </div>
            <ul className="card-list">
              <li>Demande identifiée</li>
              <li>Clientèle existante</li>
              <li>Équipe engagée</li>
              <li>Base opérationnelle disponible</li>
            </ul>
          </div>
          {/* Vigilances */}
          <div className="card card-vigilances">
            <div className="card-header">
              <div className="card-icon-wrap"><svg className="card-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
              </svg></div>
              <h4 className="card-title">Vigilances</h4>
            </div>
            <ul className="card-list">
              <li>BFR non maîtrisé</li>
              <li>Trésorerie sous tension</li>
              <li>Processus non formalisés</li>
              <li>Pilotage financier insuffisant</li>
            </ul>
          </div>
          {/* Facteurs Limitants */}
          <div className="card card-limitants">
            <div className="card-header">
              <div className="card-icon-wrap">i</div>
              <h4 className="card-title">Facteurs Limitants</h4>
            </div>
            <p>La faible visibilité sur les flux, les coûts et les délais limite la capacité de décision.</p>
          </div>
        </aside>
      </div>
      {/* END: AnalysisContent */}
      {/* BEGIN: FactorsGrid */}
      <section className="factors-section">
        <h3 className="factors-title">Facteurs clés explicatifs</h3>
        <div className="factors-grid">
          <div data-purpose="factor-item">
            <div className="factor-header">
              <div className="factor-icon-wrap">
                <svg className="factor-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <span className="factor-name">Trésorerie</span>
            </div>
            <p className="factor-desc">La pression sur la trésorerie limite la capacité à saisir les opportunités.</p>
          </div>
          <div data-purpose="factor-item">
            <div className="factor-header">
              <div className="factor-icon-wrap">
                <svg className="factor-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <span className="factor-name">Organisation</span>
            </div>
            <p className="factor-desc">L'organisation actuelle ne permet pas un pilotage régulier et efficace.</p>
          </div>
          <div data-purpose="factor-item">
            <div className="factor-header">
              <div className="factor-icon-wrap">
                <svg className="factor-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <span className="factor-name">Données financières</span>
            </div>
            <p className="factor-desc">Les données sont encore partielles ou non structurées.</p>
          </div>
          <div data-purpose="factor-item">
            <div className="factor-header">
              <div className="factor-icon-wrap">
                <svg className="factor-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
              </div>
              <span className="factor-name">Ressources humaines</span>
            </div>
            <p className="factor-desc">Les rôles et responsabilités sont insuffisamment clarifiés et formalisés.</p>
          </div>
        </div>
      </section>
      {/* END: FactorsGrid */}
      {/* BEGIN: InterpretationNotes */}
      <section className="interpretation-notes">
        <div className="note-item">
          <svg className="note-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round"
              strokeLinejoin="round" strokeWidth="2"></path>
          </svg>
          <p className="note-text">Le score synthétise les réponses ; le radar montre la lecture par axe ; le niveau de preuve
            indique le degré de confiance dans cette lecture.</p>
        </div>
      </section>
      {/* END: InterpretationNotes */}
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
          <div className="footer-page">PAGE 2 SUR 3</div>
        </div>
      </footer>
    </main>
  );
};
