import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, AlertTriangle, Info, Activity, Users, BarChart2, Award } from 'lucide-react';

export const Dashboard = ({ stats, moduleStats, scoreDistrib, activityChart, topSectors, notifications, onMarkRead }) => {
  const trend = (val) => {
    if (val === null || val === undefined) return null;
    if (val > 0) return { label: `+${val}% vs sem. passée`, cls: 'positive' };
    if (val < 0) return { label: `${val}% vs sem. passée`, cls: 'negative' };
    return { label: 'Stable cette semaine', cls: '' };
  };

  const diagsTrend = trend(stats.diagsTrend);
  const usersTrend = trend(stats.usersTrend);
  const scoreTrend = trend(stats.scoreTrend);

  const maxActivity = activityChart.length > 0 ? Math.max(...activityChart.map(d => d.count), 1) : 1;

  return (
    <div className="admin-page animate-fade-up">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Tableau de bord</h1>
          <p className="admin-page-sub">Vue d'ensemble de l'activité en temps réel · FUND.lab Business Check-up</p>
        </div>
        <button className="btn btn-ghost btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => window.location.reload()}>
          <RefreshCw size={14} /> Actualiser
        </button>
      </div>

      {/* KPI Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div>
              <div className="admin-stat-title">Sessions créées</div>
            </div>
            <div className="admin-stat-icon" style={{ color: 'var(--brand-blue)' }}><Activity size={20} /></div>
          </div>
          <div className="admin-stat-value">{stats.traffic?.total_visitors ?? 0}</div>
          <div className="admin-stat-trend" style={{ color: 'var(--slate-500)' }}>
            {stats.traffic?.new_sessions ?? 0} nouvelles sessions
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div>
              <div className="admin-stat-title">Diagnostics démarrés</div>
            </div>
            <div className="admin-stat-icon" style={{ color: 'var(--color-blue)' }}><BarChart2 size={20} /></div>
          </div>
          <div className="admin-stat-value">{stats.diagnostics?.started ?? 0}</div>
          <div className="admin-stat-trend" style={{ color: 'var(--color-teal)', fontWeight: 600 }}>
            {stats.diagnostics?.completed ?? 0} complétés
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div>
              <div className="admin-stat-title">Taux de complétion</div>
            </div>
            <div className="admin-stat-icon" style={{ color: 'var(--color-teal)' }}><Users size={20} /></div>
          </div>
          <div className="admin-stat-value">{stats.diagnostics?.completion_rate ?? 0}%</div>
          <div className="admin-stat-trend" style={{ color: '#ef4444' }}>
            {stats.diagnostics?.abandoned ?? 0} abandonnés
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div>
              <div className="admin-stat-title">Demandes d'accompagnement</div>
            </div>
            <div className="admin-stat-icon" style={{ color: 'var(--color-warning)' }}><Award size={20} /></div>
          </div>
          <div className="admin-stat-value">{stats.follow_ups?.total_requests ?? 0}</div>
          <div className="admin-stat-trend" style={{ color: 'var(--slate-500)' }}>
            {stats.follow_ups?.new ?? 0} nouveaux · {stats.follow_ups?.urgent ?? 0} urgents
          </div>
        </div>
      </div>

      {/* Row 2: Activity + Notifications */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Activity Chart */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Activité — 7 derniers jours</h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--adm-muted)', fontWeight: 600 }}>{stats.diagsThisWeek ?? 0} cette semaine</span>
          </div>
          <div style={{ padding: '20px 24px 16px' }}>
            {activityChart.length > 0 ? (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '90px' }}>
                {activityChart.map((day) => {
                  const h = maxActivity > 0 ? Math.round((day.count / maxActivity) * 90) : 0;
                  return (
                    <div key={day.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      <div
                        title={`${day.count} diagnostic(s)`}
                        style={{
                          width: '100%',
                          height: `${Math.max(h, day.count > 0 ? 6 : 3)}px`,
                          background: day.count > 0 ? 'var(--adm-accent-dk)' : '#e2e8f0',
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.4s ease',
                          cursor: 'default',
                        }}
                      />
                      <span style={{ fontSize: '0.62rem', color: 'var(--adm-muted)', textAlign: 'center', whiteSpace: 'nowrap' }}>{day.label}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: 'var(--adm-muted)', textAlign: 'center', padding: '20px 0', fontSize: '0.875rem' }}>Aucune activité récente</p>
            )}
          </div>
        </div>

        {/* Unread Alerts */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Alertes CCI en attente</h2>
            <Link to="/admin/notifications" className="btn btn-ghost btn-sm">Voir tout</Link>
          </div>
          <div style={{ padding: '8px 0' }}>
            {notifications.filter(n => !n.read).slice(0, 4).map(n => (
              <div key={n.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 20px', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <div style={{ marginTop: '2px', flexShrink: 0 }}>
                  {n.type === 'danger'
                    ? <AlertTriangle size={15} color="#ef4444" />
                    : <Info size={15} color="#3b82f6" />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.title}</div>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0' }}>{n.message}</p>
                </div>
                <button
                  onClick={() => onMarkRead(n.id)}
                  style={{ flexShrink: 0, background: 'none', border: 'none', color: '#0d9488', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}
                >✓ Lu</button>
              </div>
            ))}
            {notifications.filter(n => !n.read).length === 0 && (
              <p style={{ color: 'var(--adm-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '24px 20px' }}>Aucune alerte en attente</p>
            )}
          </div>
        </div>
      </div>



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
              {(stats._recentDiags || []).slice(0, 5).map(d => (
                <tr key={d.id}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{d.userName}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--adm-muted)' }}>{d.userEmail || 'Sans email'}</div>
                  </td>
                  <td><span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>{d.moduleId}</span></td>
                  <td>
                    <span className={`badge ${d.score >= 70 ? 'badge-green' : d.score >= 40 ? 'badge-amber' : 'badge-red'}`}>
                      {d.score}/100
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--adm-muted)' }}>{d.confidence || '—'}</td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--adm-muted)' }}>
                    {new Date(d.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
              {(!stats._recentDiags || stats._recentDiags.length === 0) && (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--adm-muted)' }}>Aucun diagnostic pour le moment</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
