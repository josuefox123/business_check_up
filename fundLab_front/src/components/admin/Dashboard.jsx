import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Activity, Users, BarChart2, Award, Building2 } from 'lucide-react';
import { AdminTreeChart } from './charts/AdminTreeChart.jsx';
import { AdminBubbleChart } from './charts/AdminBubbleChart.jsx';
import { AdminBreakdownWidget } from './charts/AdminBreakdownWidget.jsx';

export const Dashboard = ({ stats, moduleStats, scoreDistrib, activityChart, topSectors, notifications, onMarkRead, onRefresh }) => {
  // --- Normalisation des données avant le JSX (Règle 9) ---
  // Chaque valeur est extraite avec un fallback explicite référençant son champ source (Règle 7).

  const totalVisitors = stats.traffic?.total_visitors ?? stats.started ?? 0;
  const newSessions = stats.traffic?.new_sessions ?? 0;
  const diagsStarted = stats.diagnostics?.started ?? stats.started ?? 0;
  const diagsCompleted = stats.diagnostics?.completed ?? stats.completed ?? 0;
  const diagsAbandoned = stats.diagnostics?.abandoned ?? stats.abandoned ?? 0;
  const completionRate = stats.diagnostics?.completion_rate ?? 0;
  const followUpTotal = stats.follow_ups?.total_requests ?? 0;
  const followUpNew = stats.follow_ups?.new ?? 0;
  const followUpUrgent = stats.follow_ups?.urgent ?? 0;
  const pmeCount = stats.pme ?? 0;

  const treeChartData = {
    total_visitors: stats.traffic?.total_visitors ?? stats.started ?? 0,
    started: stats.diagnostics?.started ?? stats.started ?? 0,
    abandoned_first_run: stats.diagnostics?.abandoned_first_run ?? stats.abandoned ?? 0,
    completed_first_only: stats.diagnostics?.completed_first_only ?? 0,
    completed_enrichment: stats.diagnostics?.completed_enrichment ?? 0,
    completed: stats.diagnostics?.completed ?? stats.completed ?? 0,
  };

  const recentDiags = stats._recentDiags ?? [];

  // Gestionnaire d'actualisation sans rechargement brutal de page (Règle 1)
  const handleRefresh = () => {
    if (typeof onRefresh === 'function') {
      onRefresh();
    }
  };

  return (
    <div className="admin-page animate-fade-up">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Tableau de bord</h1>
          <p className="admin-page-sub">Vue d'ensemble de l'activité en temps réel Business Check-up</p>
        </div>
        <button className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={handleRefresh}>
          <RefreshCw size={14} /> Actualiser
        </button>
      </div>

      {/* KPI Cards */}
      <div className="admin-stats-grid">
        {/* <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div>
              <div className="admin-stat-title">Sessions créées</div>
            </div>
            <div className="admin-stat-icon" style={{ color: 'var(--brand-blue)' }}><Activity size={20} /></div>
          </div>
          <div className="admin-stat-value">{totalVisitors}</div>
          <div className="admin-stat-trend" style={{ color: 'var(--slate-500)' }}>
            {newSessions} nouvelles sessions
          </div>
        </div> */}

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div>
              <div className="admin-stat-title">Diagnostics démarrés</div>
            </div>
            <div className="admin-stat-icon" style={{ color: 'var(--color-blue)' }}><BarChart2 size={20} /></div>
          </div>
          <div className="admin-stat-value">{diagsStarted}</div>
          <div className="admin-stat-trend" style={{ color: 'var(--color-teal)', fontWeight: 600 }}>
            {diagsCompleted} complétés
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div>
              <div className="admin-stat-title">Taux de complétion</div>
            </div>
            <div className="admin-stat-icon" style={{ color: 'var(--color-teal)' }}><Users size={20} /></div>
          </div>
          <div className="admin-stat-value">{completionRate}%</div>
          <div className="admin-stat-trend" style={{ color: '#ef4444' }}>
            {diagsAbandoned} abandonnés
          </div>
        </div>

        <Link to="/admin/pmes" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="admin-stat-card" style={{ cursor: 'pointer', height: '100%', boxSizing: 'border-box' }}>
            <div className="admin-stat-header">
              <div>
                <div className="admin-stat-title">Nombre de PME</div>
              </div>
              <div className="admin-stat-icon" style={{ color: 'var(--color-indigo, #6366f1)' }}><Building2 size={20} /></div>
            </div>
            <div className="admin-stat-value">{pmeCount}</div>
          </div>
        </Link>

        <Link to="/admin/rendezvous" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="admin-stat-card" style={{ cursor: 'pointer', height: '100%', boxSizing: 'border-box' }}>
            <div className="admin-stat-header">
              <div>
                <div className="admin-stat-title">Rendez-vous pris</div>
              </div>
              <div className="admin-stat-icon" style={{ color: 'var(--color-warning)' }}><Award size={20} /></div>
            </div>
            <div className="admin-stat-value">{followUpTotal}</div>
          </div>
        </Link>
      </div>

      {/* Row 2: Tree Chart — Tunnel de Conversion */}
      <div style={{ marginTop: '24px' }}>
        <AdminTreeChart data={treeChartData} />
      </div>

      {/* Row 3: Bubble Chart & Activity Chart Grid */}
      <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <AdminBubbleChart moduleStats={moduleStats} />

      </div>

      {/* Row 4: Multi-criteria Breakdown Widget (Région, Secteur, Profil) */}
      <AdminBreakdownWidget
        topSectors={topSectors}
        userProfiles={stats.user_profiles}
        sectorStats={stats.sectors}
      />


      {/* Recent Diagnostics Quick List */}
      <div className="admin-card" style={{ marginTop: '20px' }}>
        <div className="admin-card-header">
          <h2>Derniers diagnostics soumis</h2>
          <Link to="/admin/diagnostics" className="btn btn-ghost btn-sm">Voir tout</Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Entrepreneur</th>
                <th>Module</th>
                <th>Score</th>
                <th>Confiance</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentDiags.slice(0, 5).map(d => {
                const scoreBadge = (d.score ?? 0) >= 70 ? 'badge-green' : (d.score ?? 0) >= 40 ? 'badge-amber' : 'badge-red';
                const dateFormatted = d.date ? new Date(d.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '[date non disponible]';
                const userEmail = d.userEmail ?? '[userEmail non disponible]';
                const confidence = d.confidence ?? '—';
                return (
                  <tr key={d.id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{d.userName}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--adm-muted)' }}>{userEmail}</div>
                    </td>
                    <td><span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>{d.moduleId}</span></td>
                    <td>
                      <span className={`badge ${scoreBadge}`}>
                        {d.score ?? 0}/100
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--adm-muted)' }}>{confidence}</td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--adm-muted)' }}>{dateFormatted}</td>
                  </tr>
                );
              })}
              {recentDiags.length === 0 && (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--adm-muted)' }}>Aucun diagnostic pour le moment</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
