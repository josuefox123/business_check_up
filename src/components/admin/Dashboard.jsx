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
              <div className="admin-stat-title">Diagnostics complétés</div>
            </div>
            <div className="admin-stat-icon" style={{ color: 'var(--brand-blue)' }}><Activity size={20} /></div>
          </div>
          <div className="admin-stat-value">{stats.totalDiagnostics ?? 0}</div>
          {diagsTrend && (
            <div className={`admin-stat-trend ${diagsTrend.cls}`}>
              {diagsTrend.cls === 'positive' ? '↑' : diagsTrend.cls === 'negative' ? '↓' : '→'} {diagsTrend.label}
            </div>
          )}
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div>
              <div className="admin-stat-title">Prospects enregistrés</div>
            </div>
            <div className="admin-stat-icon" style={{ color: 'var(--color-teal)' }}><Users size={20} /></div>
          </div>
          <div className="admin-stat-value">{stats.totalUsers ?? 0}</div>
          {usersTrend && (
            <div className={`admin-stat-trend ${usersTrend.cls}`}>
              {usersTrend.cls === 'positive' ? '↑' : usersTrend.cls === 'negative' ? '↓' : '→'} {usersTrend.label}
            </div>
          )}
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div>
              <div className="admin-stat-title">Score moyen</div>
            </div>
            <div className="admin-stat-icon" style={{ color: 'var(--color-blue)' }}><BarChart2 size={20} /></div>
          </div>
          <div className="admin-stat-value">{stats.avgScore ?? 0}<span style={{ fontSize: '1rem', fontWeight: 500, color: 'var(--adm-muted)' }}>/100</span></div>
          {scoreTrend && (
            <div className={`admin-stat-trend ${scoreTrend.cls}`}>
              {scoreTrend.cls === 'positive' ? '↑' : scoreTrend.cls === 'negative' ? '↓' : '→'} {scoreTrend.label}
            </div>
          )}
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div>
              <div className="admin-stat-title">Module dominant</div>
            </div>
            <div className="admin-stat-icon" style={{ color: 'var(--color-warning)' }}><Award size={20} /></div>
          </div>
          <div className="admin-stat-value" style={{ fontSize: '1.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {stats.mostUsedModuleName || '—'}
          </div>
          <div className="admin-stat-trend">{stats.mostUsedModulePercentage ?? 0}% des sessions</div>
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

      {/* Row 3: Module Breakdown + Score Distribution + Top Sectors */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
        {/* Module Breakdown */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Modules — Répartition</h2>
            <Link to="/admin/diagnostics" className="btn btn-ghost btn-sm">Détails</Link>
          </div>
          <div style={{ padding: '16px 20px 20px' }}>
            {moduleStats.length > 0 ? moduleStats.map(m => (
              <div key={m.moduleId} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '5px', color: '#0f172a' }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>{m.name}</span>
                  <span style={{ color: 'var(--adm-muted)', fontWeight: 500, flexShrink: 0 }}>{m.count} session{m.count !== 1 ? 's' : ''} · {m.percentage}%</span>
                </div>
                <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: `${m.percentage}%`, height: '100%', background: 'linear-gradient(90deg, #5eead4, #0d9488)', borderRadius: '99px', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            )) : (
              <p style={{ color: 'var(--adm-muted)', textAlign: 'center', padding: '20px 0', fontSize: '0.875rem' }}>Aucune session enregistrée</p>
            )}
          </div>
        </div>

        {/* Score Distribution */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Distribution des scores</h2>
          </div>
          <div style={{ padding: '16px 20px 20px' }}>
            {scoreDistrib.map(b => (
              <div key={b.label} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
                  <span style={{ color: b.color, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: b.color, display: 'inline-block', flexShrink: 0 }} />
                    {b.label} ({b.min}–{b.max})
                  </span>
                  <span style={{ color: 'var(--adm-muted)' }}>{b.count} · {b.percentage}%</span>
                </div>
                <div style={{ height: '5px', background: '#f1f5f9', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: `${b.percentage}%`, height: '100%', background: b.color, borderRadius: '99px', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Sectors */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Top secteurs d'activité</h2>
            <Link to="/admin/utilisateurs" className="btn btn-ghost btn-sm">Prospects</Link>
          </div>
          <div style={{ padding: '8px 0 16px' }}>
            {topSectors.length > 0 ? topSectors.map((s, idx) => (
              <div key={s.sector} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 20px' }}>
                <span style={{ fontWeight: 800, fontSize: '0.75rem', color: 'var(--adm-muted)', width: '18px', textAlign: 'right', flexShrink: 0 }}>#{idx + 1}</span>
                <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.sector}</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--adm-accent-dk)', background: 'rgba(13,148,136,0.08)', padding: '2px 8px', borderRadius: '99px', flexShrink: 0 }}>{s.count}</span>
              </div>
            )) : (
              <p style={{ color: 'var(--adm-muted)', textAlign: 'center', padding: '24px 20px', fontSize: '0.875rem' }}>Aucun secteur enregistré</p>
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
