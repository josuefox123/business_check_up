import React from 'react';
import {
  PieChart,
  BarChart2,
  MapPin,
  Target,
  Layers,
  Award,
  Building2,
  Users
} from 'lucide-react';
import logoCompact from '../../assets/logo_compact.png';
import logoCcib from '../../assets/logo_ccib.png';
import logoFundlab from '../../assets/logo_fundlab.png';

export const CcibReportPreview = ({ reportRef, periodLabel, reportData }) => {
  // ── Normalization of API Data (Rule 9) ──
  const kpiPmeCount = reportData?.totalPme ?? 0;
  const kpiRdvCount = reportData?.rdvCount ?? 0;
  const kpiRdvPct = reportData?.rdvPct ?? 0;
  const kpiScore = reportData?.avgScore ?? 0;

  // Sectors breakdown
  const sectors = reportData?.sectors ?? [];
  const topSector = sectors[0] || { label: 'Non disponible', pct: 0 };

  // Maturity distribution
  const maturityData = reportData?.maturity ?? { risque: 0, moyen: 0, stable: 0 };

  // Geographical distribution
  const geoData = reportData?.geography ?? [];
  const topGeo = geoData[0] || { zone: 'Non disponible', count: 0, pct: 0 };

  // Needs per service
  const serviceNeeds = reportData?.serviceNeeds ?? [];
  const topNeed = serviceNeeds[0] || { name: 'Non disponible', value: 0 };

  // Top 5 services impact
  const topServices = reportData?.topServices ?? [];
  const topBubble1 = topServices[0]?.name || 'TRÉSORERIE';
  const topBubble2 = topServices[1]?.name || 'DIGITAL';

  // Dynamic Multi-page PMEs List (Split into chunks of 10 items per page)
  const enterpriseRows = reportData?.enterpriseRows ?? [];
  const ITEMS_PER_PAGE = 10;

  const enterprisePages = [];
  if (enterpriseRows.length === 0) {
    enterprisePages.push([]);
  } else {
    for (let i = 0; i < enterpriseRows.length; i += ITEMS_PER_PAGE) {
      enterprisePages.push(enterpriseRows.slice(i, i + ITEMS_PER_PAGE));
    }
  }

  const totalPages = 1 + enterprisePages.length; // Page 1 (KPI & Charts) + Page 2..N (Enterprise table pages)
  const generationDate = new Date().toLocaleDateString('fr-FR');

  // Shared Header Component for uniform header across ALL pages
  const SharedHeader = ({ pageNum }) => (
    <div className="ccib-doc-header">
      <div className="ccib-doc-brand">
        <img src={logoCompact} alt="Business Check-up Logo" className="ccib-doc-logo" />
      </div>
      <div className="ccib-doc-title-block">
        <h1 className="ccib-doc-main-title">RAPPORT DE PILOTAGE</h1>
        <span className="ccib-period-badge">Période : {periodLabel}</span>
      </div>
    </div>
  );

  // Shared Footer Component for uniform footer across ALL pages
  const SharedFooter = ({ pageNum }) => (
    <div className="ccib-doc-footer">
      <div className="ccib-footer-logos">
        <img src={logoCcib} alt="CCIB Logo" className="ccib-footer-logo-ccib" />
        <img src={logoFundlab} alt="FUND.lab Logo" className="ccib-footer-logo-fundlab" />
      </div>
      <div className="ccib-footer-meta">
        www.cci.bj &nbsp;•&nbsp; contact@fundlab.bj &nbsp;&nbsp;|&nbsp;&nbsp; Généré le {generationDate} | PAGE {pageNum}/{totalPages}
      </div>
    </div>
  );

  return (
    <div ref={reportRef} className="ccib-report-paper-container">
      {/* ── PAGE 1: PILOTAGE SYNTHÉTIQUE & GRAPHIQUES ── */}
      <div className="ccib-report-page">
        <div>
          <SharedHeader pageNum={1} />

          {/* Top 3 KPI Summary Grid */}
          <div className="ccib-kpi-grid">
            <div className="ccib-kpi-card">
              <div className="ccib-kpi-icon-wrap"><Building2 size={20} /></div>
              <div className="ccib-kpi-value">{kpiPmeCount.toLocaleString('fr-FR')}</div>
              <div className="ccib-kpi-label">NOMBRE TOTAL DE PME</div>
            </div>
            <div className="ccib-kpi-card">
              <div className="ccib-kpi-icon-wrap"><Users size={20} /></div>
              <div className="ccib-kpi-value">
                {kpiRdvCount} <span className="ccib-kpi-sub">({kpiRdvPct}%)</span>
              </div>
              <div className="ccib-kpi-label">ENTREPRISES AVEC RDV EXPERT</div>
            </div>
            <div className="ccib-kpi-card">
              <div className="ccib-kpi-icon-wrap"><Award size={20} /></div>
              <div className="ccib-kpi-value">{kpiScore}<span style={{ fontSize: '0.85rem', color: '#64748b' }}>/100</span></div>
              <div className="ccib-kpi-label">SCORE DE MATURITÉ MOYEN</div>
            </div>
          </div>

          {/* Page 1 Grid Sections */}
          <div className="ccib-sections-grid">
            {/* Section 1: Répartition Sectorielle */}
            <div className="ccib-section-box">
              <div>
                <div className="ccib-section-header">
                  <BarChart2 size={16} color="#007A3D" />
                  <span>Répartition Sectorielle</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                  {sectors.length === 0 ? (
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>[Aucune donnée sectorielle disponible]</div>
                  ) : (
                    sectors.slice(0, 5).map((sec, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', minHeight: '26px', padding: '2px 0' }}>
                        <span style={{ width: '135px', flexShrink: 0, fontWeight: 600, fontSize: '0.72rem', color: '#334155', lineHeight: '1.5', display: 'inline-block' }}>
                          {sec.label}
                        </span>
                        <div style={{ flex: 1, background: '#f1f5f9', height: '12px', borderRadius: '6px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${sec.pct}%`,
                              background: idx === 0 ? '#007A3D' : idx === 1 ? '#0B2545' : idx === 2 ? '#1E3A8A' : '#64748B',
                              height: '100%',
                              borderRadius: '6px',
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#475569', minWidth: '30px', textAlign: 'right', lineHeight: '1.5' }}>
                          {sec.pct}%
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="ccib-commentary-box">
                Le secteur <strong>{topSector.label}</strong> représente {topSector.pct}% des PME évaluées, constituant la priorité d'intervention sur la période.
              </div>
            </div>

            {/* Section 2: Niveau de Maturité */}
            <div className="ccib-section-box">
              <div>
                <div className="ccib-section-header">
                  <PieChart size={16} color="#007A3D" />
                  <span>Niveau de Maturité</span>
                </div>
                {/* SVG Donut Chart */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '8px 0' }}>
                  <svg viewBox="0 0 100 100" width="110" height="110">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#DC2626" strokeWidth="18" strokeDasharray={`${maturityData.risque * 2.38} 238`} transform="rotate(-90 50 50)" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#F59E0B" strokeWidth="18" strokeDasharray={`${maturityData.moyen * 2.38} 238`} strokeDashoffset={`-${maturityData.risque * 2.38}`} transform="rotate(-90 50 50)" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#007A3D" strokeWidth="18" strokeDasharray={`${maturityData.stable * 2.38} 238`} strokeDashoffset={`-${(maturityData.risque + maturityData.moyen) * 2.38}`} transform="rotate(-90 50 50)" />
                  </svg>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', fontSize: '0.68rem', fontWeight: 700 }}>
                  <span style={{ color: '#DC2626', display: 'flex', alignItems: 'center', gap: '4px' }}>■ Risque ({maturityData.risque}%)</span>
                  <span style={{ color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '4px' }}>■ Moyen ({maturityData.moyen}%)</span>
                  <span style={{ color: '#007A3D', display: 'flex', alignItems: 'center', gap: '4px' }}>■ Stable ({maturityData.stable}%)</span>
                </div>
              </div>
              <div className="ccib-commentary-box">
                {maturityData.risque}% des entreprises présentent des vulnérabilités critiques nécessitant un accompagnement immédiat.
              </div>
            </div>

            {/* Section 3: Répartition Géographique */}
            <div className="ccib-section-box">
              <div>
                <div className="ccib-section-header">
                  <MapPin size={16} color="#007A3D" />
                  <span>Répartition Géographique</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '80px', paddingTop: '10px' }}>
                  {geoData.length === 0 ? (
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>[Données géographiques indisponibles]</div>
                  ) : (
                    geoData.slice(0, 5).map((g, idx) => (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <div
                          style={{
                            width: '24px',
                            height: `${Math.min(60, Math.max(8, g.count * 1.2))}px`,
                            background: '#007A3D',
                            borderRadius: '4px 4px 0 0',
                          }}
                        />
                        <span style={{ fontSize: '0.64rem', fontWeight: 600, color: '#475569' }}>{g.zone}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="ccib-commentary-box">
                La zone <strong>{topGeo.zone}</strong> concentre le volume principal d'activité des PME recensées.
              </div>
            </div>

            {/* Section 4: Besoins par Type de Service */}
            <div className="ccib-section-box">
              <div>
                <div className="ccib-section-header">
                  <Target size={16} color="#007A3D" />
                  <span>Besoins par Type de Service</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90px' }}>
                  <svg viewBox="0 0 100 100" width="100" height="100">
                    <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                    <polygon points="50,25 72,38 72,62 50,75 28,62 28,38" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                    <polygon points="50,15 80,33 76,68 50,82 22,65 18,32" fill="rgba(0,122,61,0.15)" stroke="#007A3D" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              <div className="ccib-commentary-box">
                Le besoin <strong>{topNeed.name}</strong> s'impose comme le levier de soutien n°1 ({topNeed.value}% de sollicitation).
              </div>
            </div>
          </div>

          {/* Section 5: Top 5 des Services Sollicités (Visualisation d'Impact) */}
          <div className="ccib-section-box" style={{ marginBottom: '10px' }}>
            <div className="ccib-section-header">
              <Layers size={16} color="#007A3D" />
              <span>Top 5 des services sollicités</span>
            </div>
            <div className="ccib-bubbles-container">
              {topServices.length === 0 ? (
                <div style={{ fontSize: '0.32rem', color: '#94a3b8' }}>[Aucun service enregistré sur la période]</div>
              ) : (
                topServices.slice(0, 5).map((srv, idx) => (
                  <div
                    key={idx}
                    className="ccib-bubble-node"
                    style={{
                      width: `${srv.size}px`,
                      height: `${srv.size}px`,
                      background: srv.color,
                    }}
                  >
                    {srv.name}
                  </div>
                ))
              )}
            </div>
            <div className="ccib-commentary-box">
              Les axes <strong>{topBubble1}</strong> et <strong>{topBubble2}</strong> constituent les leviers d'intervention les plus denses.
            </div>
          </div>
        </div>

        <SharedFooter pageNum={1} />
      </div>

      {/* ── PAGES 2 À N: DÉTAIL OPÉRATIONNEL DES ENTREPRISES (MULTl-PAGE DYNAMIQUE) ── */}
      {enterprisePages.map((pageItems, pageIdx) => {
        const currentPageNum = 2 + pageIdx;
        return (
          <div key={pageIdx} className="ccib-report-page">
            <div>
              <SharedHeader pageNum={currentPageNum} />

              <div className="ccib-table-header-block">
                <div className="ccib-table-title">
                  <span>Détail Opérationnel des Entreprises (P. {pageIdx + 1})</span>
                </div>
                <p className="ccib-table-sub">
                  Inventaire dynamique des entreprises ayant complété un diagnostic Business Check-up pour la période sélectionnée.
                </p>
              </div>

              {/* Dynamic Table */}
              <table className="ccib-op-table">
                <thead>
                  <tr>
                    <th>Entreprise</th>
                    <th>Secteur</th>
                    <th>Zone / Localisation</th>
                    <th>Contact Dirigeant</th>
                    <th>E-mail</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                        Aucune PME répertoriée sur la période sélectionnée.
                      </td>
                    </tr>
                  ) : (
                    pageItems.map((row, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 800, color: '#0b2545' }}>{row.name}</td>
                        <td>{row.sector}</td>
                        <td>{row.zone}</td>
                        <td style={{ fontWeight: 700 }}>{row.contact}</td>
                        <td style={{ fontSize: '0.68rem', color: '#64748b' }}>{row.email}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Note d'analyse */}
              <div className="ccib-note-box">
                <strong>NOTE DE SUIVI OPÉRATIONNEL CCIB</strong><br />
                Ce tableau recense de manière continue la liste des PME enregistrées et ayant initié un parcours de diagnostic Business Check-up.
              </div>
            </div>

            <SharedFooter pageNum={currentPageNum} />
          </div>
        );
      })}
    </div>
  );
};
