import React from 'react';
import {
  PieChart,
  BarChart2,
  MapPin,
  Target,
  Layers,
  Award,
  Building2,
  Users,
  CheckCircle2,
  Clock,
  UserX
} from 'lucide-react';
import logoCompact from '../../assets/logo_compact.png';
import logoCcib from '../../assets/logo_ccib.png';
import logoFundlab from '../../assets/logo_fundlab.png';

export const CcibReportPreview = ({ reportRef, periodLabel, reportData }) => {
  const formatPct = (val) => {
    if (val === null || val === undefined) return '0';
    const num = Number(val);
    if (isNaN(num)) return '0';
    return num % 1 === 0 ? num.toString() : num.toFixed(1);
  };

  // ── Normalization of API Data (Rule 9) ──
  const kpiPmeCount = reportData?.totalPme ?? 0;
  const kpiCompletedCount = reportData?.completedPmeCount ?? 0;
  const kpiIncompleteCount = reportData?.incompletePmeCount ?? 0;
  const kpiNoDiagCount = reportData?.noDiagPmeCount ?? 0;
  const kpiRdvCount = reportData?.rdvCount ?? 0;
  const kpiScore = reportData?.avgScore ?? 58;

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

  // Dynamic Multi-page PMEs Lists
  const completedPmeRows = reportData?.completedPmeRows ?? [];
  const incompletePmeRows = reportData?.incompletePmeRows ?? [];
  const noDiagPmeRows = reportData?.noDiagPmeRows ?? [];
  const ITEMS_PER_PAGE = 10;

  const completedPages = [];
  if (completedPmeRows.length > 0) {
    for (let i = 0; i < completedPmeRows.length; i += ITEMS_PER_PAGE) {
      completedPages.push(completedPmeRows.slice(i, i + ITEMS_PER_PAGE));
    }
  }

  const incompletePages = [];
  if (incompletePmeRows.length > 0) {
    for (let i = 0; i < incompletePmeRows.length; i += ITEMS_PER_PAGE) {
      incompletePages.push(incompletePmeRows.slice(i, i + ITEMS_PER_PAGE));
    }
  }

  const noDiagPages = [];
  if (noDiagPmeRows.length > 0) {
    for (let i = 0; i < noDiagPmeRows.length; i += ITEMS_PER_PAGE) {
      noDiagPages.push(noDiagPmeRows.slice(i, i + ITEMS_PER_PAGE));
    }
  }

  if (completedPages.length === 0 && incompletePages.length === 0 && noDiagPages.length === 0) {
    completedPages.push([]);
  }

  const totalPages = 1 + completedPages.length + incompletePages.length + noDiagPages.length;
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
        www.cci.bj &nbsp;•&nbsp; info@fund-lab.org &nbsp;&nbsp;|&nbsp;&nbsp; Généré le {generationDate} | PAGE {pageNum}/{totalPages}
      </div>
    </div>
  );

  let currentPageCounter = 2;

  return (
    <div ref={reportRef} className="ccib-report-paper-container">
      {/* ── PAGE 1: PILOTAGE SYNTHÉTIQUE & GRAPHIQUES ── */}
      <div className="ccib-report-page">
        <div>
          <SharedHeader pageNum={1} />

          {/* Top 6 KPI Summary Grid (2 rows of 3 cards) */}
          <div className="ccib-kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
            {/* Row 1 */}
            <div className="ccib-kpi-card">
              <div className="ccib-kpi-icon-wrap"><Building2 size={18} /></div>
              <div className="ccib-kpi-value">{kpiPmeCount.toLocaleString('fr-FR')}</div>
              <div className="ccib-kpi-label">TOTAL PME INSCRITES</div>
            </div>
            <div className="ccib-kpi-card">
              <div className="ccib-kpi-icon-wrap" style={{ color: '#007A3D' }}><CheckCircle2 size={18} /></div>
              <div className="ccib-kpi-value" style={{ color: '#007A3D' }}>{kpiCompletedCount}</div>
              <div className="ccib-kpi-label">PME AVEC DIAGNOSTIC FINALISÉ</div>
            </div>
            <div className="ccib-kpi-card">
              <div className="ccib-kpi-icon-wrap" style={{ color: '#D97706' }}><Clock size={18} /></div>
              <div className="ccib-kpi-value" style={{ color: '#D97706' }}>{kpiIncompleteCount}</div>
              <div className="ccib-kpi-label">PME AVEC DIAGNOSTIC INCOMPLET</div>
            </div>

            {/* Row 2 */}
            <div className="ccib-kpi-card">
              <div className="ccib-kpi-icon-wrap" style={{ color: '#64748B' }}><UserX size={18} /></div>
              <div className="ccib-kpi-value" style={{ color: '#64748B' }}>{kpiNoDiagCount}</div>
              <div className="ccib-kpi-label">PME SANS DIAGNOSTIC</div>
            </div>
            <div className="ccib-kpi-card">
              <div className="ccib-kpi-icon-wrap"><Users size={18} /></div>
              <div className="ccib-kpi-value">{kpiRdvCount}</div>
              <div className="ccib-kpi-label">PME AVEC RDV EXPERT</div>
            </div>
            <div className="ccib-kpi-card">
              <div className="ccib-kpi-icon-wrap" style={{ color: '#007A3D' }}><Award size={18} /></div>
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
                    {/* Critique / Risque (Red) */}
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#DC2626" strokeWidth="18" strokeDasharray={`${(maturityData.risque ?? 0) * 2.38} 238`} transform="rotate(-90 50 50)" />

                    {/* Fragile / Moyen (Yellow/Orange) */}
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#F59E0B" strokeWidth="18" strokeDasharray={`${(maturityData.moyen ?? 0) * 2.38} 238`} strokeDashoffset={`-${(maturityData.risque ?? 0) * 2.38}`} transform="rotate(-90 50 50)" />

                    {/* Stable (Light Green) */}
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#10B981" strokeWidth="18" strokeDasharray={`${(maturityData.stable ?? 0) * 2.38} 238`} strokeDashoffset={`-${((maturityData.risque ?? 0) + (maturityData.moyen ?? 0)) * 2.38}`} transform="rotate(-90 50 50)" />

                    {/* Solide (Dark Green) */}
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#059669" strokeWidth="18" strokeDasharray={`${(maturityData.solide ?? 0) * 2.38} 238`} strokeDashoffset={`-${((maturityData.risque ?? 0) + (maturityData.moyen ?? 0) + (maturityData.stable ?? 0)) * 2.38}`} transform="rotate(-90 50 50)" />

                    {/* Avancé (Blue) */}
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#3B82F6" strokeWidth="18" strokeDasharray={`${(maturityData.avance ?? 0) * 2.38} 238`} strokeDashoffset={`-${((maturityData.risque ?? 0) + (maturityData.moyen ?? 0) + (maturityData.stable ?? 0) + (maturityData.solide ?? 0)) * 2.38}`} transform="rotate(-90 50 50)" />
                  </svg>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '0.66rem', fontWeight: 700 }}>
                  <span style={{ color: '#DC2626', display: 'flex', alignItems: 'center', gap: '3px' }}>■ Critique ({formatPct(maturityData.risque)}%)</span>
                  <span style={{ color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '3px' }}>■ Fragile ({formatPct(maturityData.moyen)}%)</span>
                  <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '3px' }}>■ Stable ({formatPct(maturityData.stable)}%)</span>
                  <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '3px' }}>■ Solide ({formatPct(maturityData.solide)}%)</span>
                  <span style={{ color: '#3B82F6', display: 'flex', alignItems: 'center', gap: '3px' }}>■ Avancé ({formatPct(maturityData.avance)}%)</span>
                </div>
              </div>
              <div className="ccib-commentary-box">
                <strong>{formatPct(maturityData.risque)}%</strong> des entreprises présentent des vulnérabilités critiques nécessitant un accompagnement immédiat.
              </div>
            </div>

            {/* Section 3: Répartition Géographique */}
            <div className="ccib-section-box" style={{ gridColumn: 'span 2' }}>
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

      {/* ── TABLEAU 1 : PME AVEC DIAGNOSTIC FINALISÉ ── */}
      {completedPages.map((pageItems, pageIdx) => {
        const pageNum = currentPageCounter++;
        return (
          <div key={`comp-${pageIdx}`} className="ccib-report-page">
            <div>
              <SharedHeader pageNum={pageNum} />

              <div className="ccib-table-header-block">
                <div className="ccib-table-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>1. PME avec Diagnostic Finalisé (P. {pageIdx + 1})</span>
                </div>
                <p className="ccib-table-sub">
                  Liste des entreprises ayant accompli l'intégralité du questionnaire principal de diagnostic Business Check-up.
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
                        Aucune PME avec diagnostic finalisé répertoriée sur la période.
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

              <div className="ccib-note-box">
                <strong>NOTE EXPLICATIVE — DIAGNOSTICS FINALISÉS</strong><br />
                Ce tableau recense les PME ayant complété l'intégralité du questionnaire de diagnostic et disposant d'un bilan de maturité.
              </div>
            </div>

            <SharedFooter pageNum={pageNum} />
          </div>
        );
      })}

      {/* ── TABLEAU 2 : PME AVEC DIAGNOSTIC INCOMPLET ── */}
      {incompletePages.map((pageItems, pageIdx) => {
        const pageNum = currentPageCounter++;
        return (
          <div key={`incomp-${pageIdx}`} className="ccib-report-page">
            <div>
              <SharedHeader pageNum={pageNum} />

              <div className="ccib-table-header-block">
                <div className="ccib-table-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>2. PME avec Diagnostic Incomplet (P. {pageIdx + 1})</span>
                </div>
                <p className="ccib-table-sub">
                  Entreprises ayant initié un parcours de diagnostic mais sans aller jusqu'au bout du questionnaire principal.
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
                        Aucune PME avec diagnostic incomplet répertoriée sur la période.
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

              <div className="ccib-note-box" style={{ borderColor: '#F59E0B' }}>
                <strong>NOTE EXPLICATIVE — DIAGNOSTICS INCOMPLETS</strong><br />
                Ce tableau recense les PME ayant initié un parcours de diagnostic sans être allées jusqu'au terme du questionnaire principal.
              </div>
            </div>

            <SharedFooter pageNum={pageNum} />
          </div>
        );
      })}

      {/* ── TABLEAU 3 : PME INSCRITES SANS DIAGNOSTIC ── */}
      {noDiagPages.map((pageItems, pageIdx) => {
        const pageNum = currentPageCounter++;
        return (
          <div key={`nodiag-${pageIdx}`} className="ccib-report-page">
            <div>
              <SharedHeader pageNum={pageNum} />

              <div className="ccib-table-header-block">
                <div className="ccib-table-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>3. PME Inscrites sans Diagnostic (P. {pageIdx + 1})</span>
                </div>
                <p className="ccib-table-sub">
                  Entreprises s'étant inscrites sur la plateforme mais n'ayant initié aucun parcours de diagnostic.
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
                        Aucune PME inscrite sans diagnostic répertoriée sur la période.
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

              <div className="ccib-note-box" style={{ borderColor: '#94A3B8' }}>
                <strong>NOTE EXPLICATIVE — COMPTES CRÉÉS SANS DIAGNOSTIC</strong><br />
                Ce tableau recense les PME enregistrées sur la plateforme n'ayant encore initié aucun questionnaire de diagnostic.
              </div>
            </div>

            <SharedFooter pageNum={pageNum} />
          </div>
        );
      })}
    </div>
  );
};
