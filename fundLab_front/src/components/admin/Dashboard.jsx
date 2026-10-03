import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  RotateCcw,
  BarChart2,
  Building2,
  CalendarCheck,
  MapPin,
  ArrowUpRight,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';

// Bandes officielles de maturité (Enum ScoreBand du backend)
const SCORE_BANDS_CONFIG = [
  {
    key: 'advanced',
    label: 'Maturité avancée',
    range: '> 85/100',
    color: '#059669',
    bg: '#ECFDF5',
    barColor: '#10B981',
  },
  {
    key: 'solid',
    label: 'Base solide à consolider',
    range: '71 - 85/100',
    color: '#0D9488',
    bg: '#F0FDFA',
    barColor: '#34BED5',
  },
  {
    key: 'stable',
    label: 'Base fonctionnelle à structurer',
    range: '56 - 70/100',
    color: '#0284C7',
    bg: '#F0F9FF',
    barColor: '#38BDF8',
  },
  {
    key: 'fragile',
    label: 'Base fragile à renforcer',
    range: '36 - 55/100',
    color: '#D97706',
    bg: '#FFFBEB',
    barColor: '#F59E0B',
  },
  {
    key: 'critical',
    label: 'Vigilance prioritaire',
    range: '0 - 35/100',
    color: '#DC2626',
    bg: '#FEF2F2',
    barColor: '#EF4444',
  },
];

const MODULE_NAMES_FALLBACK = {
  'FLH-01': 'Flash Diagnostic',
  'PRJ-02': 'Diagnostic Projet',
  'DIF-03': 'Difficultés & Restructuration',
  'OPP-04': 'Opportunités & Croissance',
  'PRO-05': 'Produits & Offre',
  'COM-06': 'Commercial & Marché',
  'FIN-07': 'Finance & Stratégie',
  'GOV-08': 'Gouvernance & Organisation',
  '360-09': 'Diagnostic Global 360°',
};

export const Dashboard = ({
  stats = {},
  moduleStats = [],
  scoreDistrib = [],
  topSectors = [],
  loading = false,
  onRefresh,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ─── Normalisation des données (Rule 9 & Rule 7) ───────────────────────────
  const safeStats = stats || {};
  const diagsStarted = Number(safeStats?.diagnostics?.started ?? 0);
  const pmeCount = Number(safeStats?.pme ?? 0);
  const followUpTotal = Number(safeStats?.follow_ups?.total_requests ?? 0);

  const rawScoreBands = safeStats?.score_band ?? {};

  // Calcul du total des diagnostics évalués pour les barres de score
  const totalScored = Object.values(rawScoreBands).reduce((acc, b) => acc + (Number(b?.count) || 0), 0);

  // Normalisation des modules
  const normalizedModules = Array.isArray(moduleStats)
    ? moduleStats.map((m) => {
        const count = Number(m.count ?? 0);
        const completed = Number(m.completed ?? 0);
        const rate = count > 0 ? Math.round((completed / count) * 100) : 0;
        return {
          code: m.moduleId || m.module_code || 'MOD',
          name: m.name || MODULE_NAMES_FALLBACK[m.moduleId] || m.moduleId || 'Module',
          count,
          completed,
          rate,
        };
      })
    : [];

  const maxModuleCount = Math.max(...normalizedModules.map((m) => m.count), 1);

  // Normalisation des régions (Top 5)
  const normalizedRegions = Array.isArray(topSectors)
    ? topSectors.map((r) => ({
        region: r.region || r.sector || '[Région non spécifiée]',
        count: Number(r.count ?? 0),
      }))
    : [];

  const topRegions = normalizedRegions.slice(0, 5);
  const maxRegionCount = Math.max(...topRegions.map((r) => r.count), 1);

  // Normalisation des scores moyens par module
  const normalizedScoresByModule = Array.isArray(scoreDistrib)
    ? scoreDistrib.map((s) => {
        const score = Math.round(Number(s.avg_credibilized_score || s.avg_score || 0));
        return {
          code: s.module_code,
          name: MODULE_NAMES_FALLBACK[s.module_code] || s.module_code || 'Module',
          score,
          total: Number(s.total ?? 0),
        };
      })
    : [];

  const handleRefreshClick = async () => {
    if (typeof onRefresh === 'function') {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setTimeout(() => setIsRefreshing(false), 400);
      }
    }
  };

  return (
    <div
      className="admin-page animate-fade-up"
      style={{
        fontFamily: 'Lato, -apple-system, BlinkMacSystemFont, sans-serif',
        paddingBottom: '40px',
      }}
    >
      <style>{`
        .dash-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 6px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
          box-sizing: border-box;
          overflow: hidden;
        }

        .dash-kpi-card {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-left: 3px solid #34BED5;
          border-radius: 6px;
          padding: 18px 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-decoration: none;
          color: inherit;
        }

        .dash-kpi-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(23, 33, 45, 0.08);
          border-color: #CBD5E1;
          border-left-color: #34BED5;
        }

        .dash-grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        @media (min-width: 900px) {
          .dash-grid-2 {
            grid-template-columns: 1fr 1fr;
          }
        }

        .dash-kpis-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }

        @media (min-width: 680px) {
          .dash-kpis-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .dash-shimmer {
          background: linear-gradient(90deg, #F1F5F9 25%, #E2E8F0 50%, #F1F5F9 75%);
          background-size: 200% 100%;
          animation: dashShimmerAnimation 1.5s infinite ease-in-out;
          border-radius: 4px;
        }

        @keyframes dashShimmerAnimation {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* ── Page Header (Sans période inutile) ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '22px',
          paddingBottom: '16px',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1
              style={{
                margin: 0,
                fontSize: '1.65rem',
                fontWeight: 900,
                color: '#17212D',
                letterSpacing: '-0.02em',
              }}
            >
              Tableau de bord de pilotage
            </h1>
            <span
              style={{
                background: '#17212D',
                color: '#FFFFFF',
                fontSize: '0.74rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '4px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Exécutif
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '0.86rem' }}>
            Synthèse d'activité — progression des diagnostics, maturité des entreprises et demandes d'accompagnement.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefreshClick}
          disabled={isRefreshing || loading}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
            background: '#FFFFFF',
            color: '#17212D',
            fontWeight: 700,
            fontSize: '0.82rem',
            padding: '8px 14px',
            cursor: isRefreshing || loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s ease',
          }}
        >
          <RotateCcw
            size={14}
            style={{ animation: isRefreshing || loading ? 'spin 1s linear infinite' : 'none' }}
          />
          <span>Actualiser</span>
        </button>
      </div>

      {/* ── 1. KPI Cards (3 piliers statutaires sans redondance) ── */}
      <div className="dash-kpis-grid">
        {loading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="dash-kpi-card" style={{ borderLeftColor: '#E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div className="dash-shimmer" style={{ width: '110px', height: '12px' }} />
                  <div className="dash-shimmer" style={{ width: '32px', height: '32px', borderRadius: '6px' }} />
                </div>
                <div className="dash-shimmer" style={{ width: '70px', height: '32px', marginBottom: '12px' }} />
                <div className="dash-shimmer" style={{ width: '140px', height: '11px' }} />
              </div>
            ))}
          </>
        ) : (
          <>
            {/* KPI 1 : Diagnostics initiés (excluant le triage) */}
            <Link to="/admin/diagnostics" className="dash-kpi-card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Diagnostics initiés
                  </span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#F0FCFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F7F90' }}>
                    <BarChart2 size={16} />
                  </div>
                </div>
                <div style={{ fontSize: '1.95rem', fontWeight: 900, color: '#17212D', lineHeight: 1.1 }}>
                  {diagsStarted}
                </div>
              </div>
              <div style={{ fontSize: '0.76rem', color: '#0F7F90', fontWeight: 700, marginTop: '12px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span>Parcours thématiques engagés</span>
                <ArrowUpRight size={13} />
              </div>
            </Link>

            {/* KPI 2 : Portefeuille PME */}
            <Link to="/admin/pmes" className="dash-kpi-card" style={{ borderLeftColor: '#17212D' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Portefeuille Entreprises
                  </span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#17212D' }}>
                    <Building2 size={16} />
                  </div>
                </div>
                <div style={{ fontSize: '1.95rem', fontWeight: 900, color: '#17212D', lineHeight: 1.1 }}>
                  {pmeCount}
                </div>
              </div>
              <div style={{ fontSize: '0.76rem', color: '#0284C7', fontWeight: 700, marginTop: '12px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span>Comptes entreprises créés</span>
                <ArrowUpRight size={13} />
              </div>
            </Link>

            {/* KPI 3 : Demandes d'accompagnement */}
            <Link to="/admin/rendezvous" className="dash-kpi-card" style={{ borderLeftColor: '#D97706' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Demandes d'accompagnement
                  </span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                    <CalendarCheck size={16} />
                  </div>
                </div>
                <div style={{ fontSize: '1.95rem', fontWeight: 900, color: '#17212D', lineHeight: 1.1 }}>
                  {followUpTotal}
                </div>
              </div>
              <div style={{ fontSize: '0.76rem', color: '#D97706', fontWeight: 700, marginTop: '12px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span>Entretiens et rendez-vous sollicités</span>
                <ArrowUpRight size={13} />
              </div>
            </Link>
          </>
        )}
      </div>

      {/* ── 2. Cœur Analytique : Maturité Globale & Activité Modules ── */}
      <div className="dash-grid-2">
        {/* Panneau A : Répartition algorithmique des scores de maturité */}
        <div className="dash-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#17212D' }}>
                Maturité stratégique des entreprises
              </h2>
              <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#64748B' }}>
                Distribution par tranche de notation (ScoringResult)
              </p>
            </div>
            {!loading && (
              <span style={{ fontSize: '0.74rem', fontWeight: 800, background: '#F1F5F9', color: '#475569', padding: '3px 8px', borderRadius: '4px' }}>
                {totalScored} bilans évalués
              </span>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {loading ? (
              <>
                {[1, 2, 3, 4, 5].map((idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div className="dash-shimmer" style={{ width: '130px', height: '12px' }} />
                      <div className="dash-shimmer" style={{ width: '50px', height: '12px' }} />
                    </div>
                    <div className="dash-shimmer" style={{ width: '100%', height: '8px', borderRadius: '4px' }} />
                  </div>
                ))}
              </>
            ) : (
              <>
                {SCORE_BANDS_CONFIG.map((band) => {
                  const bandData = rawScoreBands[band.key] ?? {};
                  const count = Number(bandData?.count ?? 0);
                  const percentage = Number(bandData?.percentage ?? 0);

                  return (
                    <div key={band.key}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: band.barColor,
                              flexShrink: 0,
                            }}
                          />
                          <span style={{ fontWeight: 800, color: '#17212D' }}>{band.label}</span>
                          <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 600 }}>({band.range})</span>
                        </div>
                        <div style={{ fontWeight: 800, color: '#17212D', fontSize: '0.82rem' }}>
                          {count} bilans <span style={{ color: '#64748B', fontWeight: 600 }}>({percentage}%)</span>
                        </div>
                      </div>

                      <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${Math.min(100, percentage)}%`,
                            height: '100%',
                            background: band.barColor,
                            borderRadius: '4px',
                            transition: 'width 0.4s ease',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}

                {totalScored === 0 && (
                  <div style={{ textAlign: 'center', padding: '16px 0 6px', color: '#94A3B8', fontSize: '0.78rem' }}>
                    Aucun score algorithmique enregistré.
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Panneau B : Activité & Complétion par Module */}
        <div className="dash-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#17212D' }}>
                Activité par Module de Diagnostic
              </h2>
              <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#64748B' }}>
                Volume de passages par thématique
              </p>
            </div>
            <Link
              to="/admin/diagnostics"
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#0284C7',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <span>Détails</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {loading ? (
              <>
                {[1, 2, 3, 4].map((idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px',
                      background: '#F8FAFC',
                      borderRadius: '6px',
                      border: '1px solid #F1F5F9',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="dash-shimmer" style={{ width: '45px', height: '18px', borderRadius: '4px' }} />
                      <div className="dash-shimmer" style={{ width: '120px', height: '14px' }} />
                    </div>
                    <div className="dash-shimmer" style={{ width: '60px', height: '14px' }} />
                  </div>
                ))}
              </>
            ) : normalizedModules.length > 0 ? (
              normalizedModules.map((m) => {
                const relativeWidth = Math.round((m.count / maxModuleCount) * 100);

                return (
                  <div
                    key={m.code}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      padding: '8px 10px',
                      background: '#F8FAFC',
                      borderRadius: '6px',
                      border: '1px solid #F1F5F9',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '150px' }}>
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: '0.72rem',
                          background: '#17212D',
                          color: '#FFFFFF',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          letterSpacing: '0.03em',
                        }}
                      >
                        {m.code}
                      </span>
                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: '#17212D',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '180px',
                        }}
                      >
                        {m.name}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#17212D' }}>
                        {m.count}
                      </div>

                      <div style={{ width: '60px', height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${relativeWidth}%`,
                            height: '100%',
                            background: '#34BED5',
                            borderRadius: '3px',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#94A3B8', fontSize: '0.82rem' }}>
                Aucune donnée d'activité par module disponible.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 3. Pilotage Stratégique : Territoire (Top 5) & Performance par module ── */}
      <div className="dash-grid-2">
        {/* Panneau A : Implantation territoriale (Top 5) */}
        <div className="dash-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#17212D' }}>
                Implantation territoriale (Top 5)
              </h2>
              <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#64748B' }}>
                Départements les plus représentés par les diagnostics initiés
              </p>
            </div>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#F0FCFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F7F90' }}>
              <MapPin size={15} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {loading ? (
              <>
                {[1, 2, 3].map((idx) => (
                  <div key={idx} style={{ padding: '10px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div className="dash-shimmer" style={{ width: '100px', height: '12px' }} />
                      <div className="dash-shimmer" style={{ width: '60px', height: '12px' }} />
                    </div>
                    <div className="dash-shimmer" style={{ width: '100%', height: '5px' }} />
                  </div>
                ))}
              </>
            ) : topRegions.length > 0 ? (
              topRegions.map((r, idx) => {
                const relativeWidth = Math.round((r.count / maxRegionCount) * 100);

                return (
                  <div key={idx} style={{ padding: '8px 10px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', fontSize: '0.8rem' }}>
                      <span style={{ fontWeight: 800, color: '#17212D' }}>{r.region}</span>
                      <span style={{ fontWeight: 800, color: '#17212D' }}>{r.count} diagnostics</span>
                    </div>
                    <div style={{ width: '100%', height: '5px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${relativeWidth}%`,
                          height: '100%',
                          background: '#17212D',
                          borderRadius: '3px',
                        }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#94A3B8', fontSize: '0.82rem' }}>
                Aucune donnée de localisation enregistrée.
              </div>
            )}
          </div>
        </div>

        {/* Panneau B : Scores moyens obtenus par thématique (Remplace la carte redondante des RDV) */}
        <div className="dash-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#17212D' }}>
                Performance moyenne par thématique
              </h2>
              <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#64748B' }}>
                Score moyen sur 100 obtenu par les entreprises selon le module
              </p>
            </div>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
              <TrendingUp size={15} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {loading ? (
              <>
                {[1, 2, 3].map((idx) => (
                  <div key={idx} style={{ padding: '10px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div className="dash-shimmer" style={{ width: '120px', height: '12px' }} />
                      <div className="dash-shimmer" style={{ width: '40px', height: '12px' }} />
                    </div>
                    <div className="dash-shimmer" style={{ width: '100%', height: '5px' }} />
                  </div>
                ))}
              </>
            ) : normalizedScoresByModule.length > 0 ? (
              normalizedScoresByModule.map((s, idx) => {
                const scoreColor = s.score >= 70 ? '#059669' : s.score >= 50 ? '#0284C7' : '#D97706';

                return (
                  <div key={idx} style={{ padding: '8px 10px', background: '#F8FAFC', borderRadius: '6px', border: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#17212D', color: '#FFFFFF', padding: '1px 5px', borderRadius: '3px' }}>
                          {s.code}
                        </span>
                        <span style={{ fontWeight: 800, color: '#17212D' }}>{s.name}</span>
                      </div>
                      <span style={{ fontWeight: 900, color: scoreColor, fontSize: '0.84rem' }}>
                        {s.score}/100
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '5px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${Math.min(100, s.score)}%`,
                          height: '100%',
                          background: scoreColor,
                          borderRadius: '3px',
                        }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#94A3B8', fontSize: '0.82rem' }}>
                Aucune évaluation scorée disponible par thématique.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
