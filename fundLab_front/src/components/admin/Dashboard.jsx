import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  RotateCcw,
  BarChart2,
  CheckCircle2,
  Building2,
  CalendarCheck,
  MapPin,
  Clock,
  ArrowUpRight,
  Calendar,
  ChevronRight,
  XCircle,
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

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
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
  const diagsCompleted = Number(safeStats?.diagnostics?.completed ?? 0);
  const diagsAbandoned = Number(safeStats?.diagnostics?.abandoned ?? 0);
  const completionRate = Number(safeStats?.diagnostics?.completion_rate ?? 0);

  const pmeCount = Number(safeStats?.pme ?? 0);

  const followUpTotal = Number(safeStats?.follow_ups?.total_requests ?? 0);
  const followUpUrgent = Number(safeStats?.follow_ups?.urgent ?? 0);
  const followUpHigh = Number(safeStats?.follow_ups?.high ?? 0);
  const followUpNew = Number(safeStats?.follow_ups?.new ?? 0);

  const periodFrom = safeStats?.period?.from ?? null;
  const periodTo = safeStats?.period?.to ?? null;

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

  // Normalisation des régions
  const normalizedRegions = Array.isArray(topSectors)
    ? topSectors.map((r) => ({
        region: r.region || r.sector || '[Région non spécifiée]',
        count: Number(r.count ?? 0),
      }))
    : [];

  const maxRegionCount = Math.max(...normalizedRegions.map((r) => r.count), 1);

  // Récents diagnostics
  const recentDiags = Array.isArray(safeStats?._recentDiags) ? safeStats._recentDiags.slice(0, 5) : [];

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
          padding: 16px 18px;
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
          gap: 14px;
          margin-bottom: 24px;
        }

        @media (min-width: 600px) {
          .dash-kpis-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1080px) {
          .dash-kpis-grid {
            grid-template-columns: repeat(4, 1fr);
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

      {/* ── Page Header ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
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
            Vue d'ensemble en temps réel — performance des modules, maturité des entreprises et demandes de suivi.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {periodFrom && periodTo && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#F1F5F9',
                color: '#475569',
                fontSize: '0.76rem',
                fontWeight: 700,
                padding: '7px 12px',
                borderRadius: '6px',
              }}
            >
              <Calendar size={13} color="#64748B" />
              <span>
                {periodFrom} au {periodTo}
              </span>
            </div>
          )}

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
      </div>

      {/* ── 1. KPI Cards (4 cartes statutaires True North) ── */}
      <div className="dash-kpis-grid">
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="dash-kpi-card" style={{ borderLeftColor: '#E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div className="dash-shimmer" style={{ width: '90px', height: '12px' }} />
                  <div className="dash-shimmer" style={{ width: '32px', height: '32px', borderRadius: '6px' }} />
                </div>
                <div className="dash-shimmer" style={{ width: '65px', height: '30px', marginBottom: '12px' }} />
                <div className="dash-shimmer" style={{ width: '130px', height: '11px' }} />
              </div>
            ))}
          </>
        ) : (
          <>
            {/* KPI 1 : Diagnostics lancés */}
            <Link to="/admin/diagnostics" className="dash-kpi-card">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Diagnostics démarrés
                  </span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#F0FCFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F7F90' }}>
                    <BarChart2 size={16} />
                  </div>
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#17212D', lineHeight: 1.1 }}>
                  {diagsStarted}
                </div>
              </div>
              <div style={{ fontSize: '0.76rem', color: '#059669', fontWeight: 700, marginTop: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>{diagsCompleted} complétés</span>
                <span style={{ color: '#CBD5E1' }}>•</span>
                <span style={{ color: '#64748B', fontWeight: 600 }}>{Math.max(0, diagsStarted - diagsCompleted)} en cours</span>
              </div>
            </Link>

            {/* KPI 2 : Taux d'achèvement */}
            <div className="dash-kpi-card" style={{ borderLeftColor: '#059669' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Taux de complétion
                  </span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                    <CheckCircle2 size={16} />
                  </div>
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#17212D', lineHeight: 1.1 }}>
                  {completionRate}%
                </div>
              </div>
              <div style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 600, marginTop: '12px' }}>
                {diagsAbandoned > 0 ? (
                  <span style={{ color: '#DC2626', fontWeight: 700 }}>{diagsAbandoned} abandons enregistrés</span>
                ) : (
                  <span>Progression globale continue</span>
                )}
              </div>
            </div>

            {/* KPI 3 : Nombre de PME */}
            <Link to="/admin/pmes" className="dash-kpi-card" style={{ borderLeftColor: '#17212D' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Portefeuille PME
                  </span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#17212D' }}>
                    <Building2 size={16} />
                  </div>
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#17212D', lineHeight: 1.1 }}>
                  {pmeCount}
                </div>
              </div>
              <div style={{ fontSize: '0.76rem', color: '#0284C7', fontWeight: 700, marginTop: '12px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span>Entreprises enregistrées</span>
                <ArrowUpRight size={13} />
              </div>
            </Link>

            {/* KPI 4 : Demandes d'accompagnement */}
            <Link to="/admin/rendezvous" className="dash-kpi-card" style={{ borderLeftColor: followUpUrgent > 0 ? '#DC2626' : '#D97706' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Demandes d'accompagnement
                  </span>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                    <CalendarCheck size={16} />
                  </div>
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#17212D', lineHeight: 1.1 }}>
                  {followUpTotal}
                </div>
              </div>
              <div style={{ fontSize: '0.76rem', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {followUpUrgent > 0 ? (
                  <span style={{ color: '#DC2626', fontWeight: 800 }}>{followUpUrgent} urgentes</span>
                ) : (
                  <span style={{ color: '#059669', fontWeight: 700 }}>0 urgente</span>
                )}
                <span style={{ color: '#CBD5E1' }}>•</span>
                <span style={{ color: '#0284C7', fontWeight: 700 }}>{followUpNew} nouvelles</span>
              </div>
            </Link>
          </>
        )}
      </div>

      {/* ── 2. Cœur Analytique : Maturité Globale & Performance Modules ── */}
      <div className="dash-grid-2">
        {/* Panneau A : Répartition algorithmique des scores de maturité */}
        <div className="dash-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#17212D' }}>
                Maturité stratégique des entreprises
              </h2>
              <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#64748B' }}>
                Distribution consolidée par tranche de notation (ScoringResult)
              </p>
            </div>
            {!loading && (
              <span style={{ fontSize: '0.74rem', fontWeight: 800, background: '#F1F5F9', color: '#475569', padding: '3px 8px', borderRadius: '4px' }}>
                {totalScored} bilans
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
                          {count} PME <span style={{ color: '#64748B', fontWeight: 600 }}>({percentage}%)</span>
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
                    Aucun score algorithmique enregistré pour la période sélectionnée.
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
                Volume de passages et ratio d'achèvement par parcours
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
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#17212D' }}>
                          {m.count}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700 }}>
                          {m.rate}% finis
                        </div>
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

      {/* ── 3. Pilotage Opérationnel : Territoire & Demandes de RDV ── */}
      <div className="dash-grid-2">
        {/* Panneau A : Répartition territoriale */}
        <div className="dash-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#17212D' }}>
                Implantation territoriale
              </h2>
              <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#64748B' }}>
                Localisation géographique des PME ayant réalisé un diagnostic
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
            ) : normalizedRegions.length > 0 ? (
              normalizedRegions.map((r, idx) => {
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
                Aucune donnée de localisation enregistrée pour la période.
              </div>
            )}
          </div>
        </div>

        {/* Panneau B : File d'attente d'accompagnement & Rendez-vous */}
        <div className="dash-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#17212D' }}>
                  Demandes d'accompagnement
                </h2>
                <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#64748B' }}>
                  Priorisation des sollicitations et rendez-vous post-diagnostic
                </p>
              </div>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                <CalendarCheck size={15} />
              </div>
            </div>

            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{ background: '#F8FAFC', borderRadius: '6px', padding: '14px 10px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                    <div className="dash-shimmer" style={{ width: '50px', height: '10px', margin: '0 auto 8px' }} />
                    <div className="dash-shimmer" style={{ width: '30px', height: '22px', margin: '0 auto' }} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
                {/* Carte Urgent */}
                <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '6px', padding: '12px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Urgentes
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#DC2626', marginTop: '2px' }}>
                    {followUpUrgent}
                  </div>
                </div>

                {/* Carte Priorité haute */}
                <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '6px', padding: '12px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Prioritaires
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#D97706', marginTop: '2px' }}>
                    {followUpHigh}
                  </div>
                </div>

                {/* Carte Nouvelles */}
                <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '6px', padding: '12px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#0369A1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Nouvelles
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0284C7', marginTop: '2px' }}>
                    {followUpNew}
                  </div>
                </div>
              </div>
            )}

            <p style={{ fontSize: '0.78rem', color: '#64748B', lineHeight: 1.45, margin: 0 }}>
              Les dirigeants en situation critique ou nécessitant une orientation financière sont priorisés pour les entretiens CCIB / FUND.lab.
            </p>
          </div>

          <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #F1F5F9' }}>
            <Link
              to="/admin/rendezvous"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                background: '#17212D',
                color: '#FFFFFF',
                borderRadius: '6px',
                padding: '10px 16px',
                fontSize: '0.84rem',
                fontWeight: 800,
                textDecoration: 'none',
                boxSizing: 'border-box',
                transition: 'background 0.15s ease',
              }}
            >
              <span>Accéder à la gestion des rendez-vous</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── 4. Derniers diagnostics enregistrés (Table compacte) ── */}
      <div className="dash-card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid #E2E8F0',
            background: '#FAFAFA',
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#17212D' }}>
              Derniers diagnostics soumis
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: '#64748B' }}>
              Les 5 évaluations les plus récentes enregistrées sur la plateforme
            </p>
          </div>

          <Link
            to="/admin/diagnostics"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#17212D',
              textDecoration: 'none',
            }}
          >
            <span>Voir tout l'historique</span>
            <ChevronRight size={14} color="#34BED5" />
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '10px 16px', fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
                  Entreprise
                </th>
                <th style={{ padding: '10px 14px', fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
                  Module
                </th>
                <th style={{ padding: '10px 14px', fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
                  Statut
                </th>
                <th style={{ padding: '10px 14px', fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
                  Date
                </th>
                <th style={{ padding: '10px 16px', fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <>
                  {[1, 2, 3, 4, 5].map((row) => (
                    <tr key={row} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div className="dash-shimmer" style={{ width: '120px', height: '14px', marginBottom: '4px' }} />
                        <div className="dash-shimmer" style={{ width: '80px', height: '11px' }} />
                      </td>
                      <td style={{ padding: '14px 14px' }}>
                        <div className="dash-shimmer" style={{ width: '48px', height: '18px', borderRadius: '4px' }} />
                      </td>
                      <td style={{ padding: '14px 14px' }}>
                        <div className="dash-shimmer" style={{ width: '65px', height: '18px', borderRadius: '4px' }} />
                      </td>
                      <td style={{ padding: '14px 14px' }}>
                        <div className="dash-shimmer" style={{ width: '80px', height: '12px' }} />
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div className="dash-shimmer" style={{ width: '40px', height: '22px', marginLeft: 'auto', borderRadius: '4px' }} />
                      </td>
                    </tr>
                  ))}
                </>
              ) : recentDiags.length > 0 ? (
                recentDiags.map((d, idx) => {
                  const runId = d.diagnostic_run_id || d.id || `RUN-${idx}`;
                  const businessName = d.business?.business_name || d.businessName || 'PME non enregistrée';
                  const moduleCode = d.module_code || d.moduleId || 'MOD';
                  const isCompleted = d.completion_status === 'completed';
                  const hasAnswers = (d.question_count_answered ?? 0) > 0;
                  const dateFormatted = formatDate(d.started_at || d.date);

                  return (
                    <tr
                      key={runId}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#17212D' }}>
                          {businessName}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                          {d.business?.sector || 'Secteur non spécifié'}
                        </div>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            fontWeight: 800,
                            fontSize: '0.74rem',
                            background: '#17212D',
                            color: '#FFFFFF',
                            padding: '2px 7px',
                            borderRadius: '4px',
                          }}
                        >
                          {moduleCode}
                        </span>
                      </td>

                      <td style={{ padding: '12px 14px' }}>
                        {isCompleted ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', fontWeight: 800, color: '#065F46', background: '#ECFDF5', padding: '2px 6px', borderRadius: '4px' }}>
                            <CheckCircle2 size={11} /> Finalisé
                          </span>
                        ) : hasAnswers ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', fontWeight: 800, color: '#92400E', background: '#FEF3C7', padding: '2px 6px', borderRadius: '4px' }}>
                            <Clock size={11} /> En cours
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>
                            <XCircle size={11} color="#94A3B8" /> Non débuté
                          </span>
                        )}
                      </td>

                      <td style={{ padding: '12px 14px', fontSize: '0.78rem', color: '#64748B', whiteSpace: 'nowrap' }}>
                        {dateFormatted}
                      </td>

                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <Link
                          to={`/admin/diagnostics/${runId}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            color: '#17212D',
                            background: '#F1F5F9',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            textDecoration: 'none',
                          }}
                        >
                          <span>Voir</span>
                          <ArrowUpRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '28px', color: '#94A3B8', fontSize: '0.82rem' }}>
                    Aucun diagnostic récent enregistré.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
