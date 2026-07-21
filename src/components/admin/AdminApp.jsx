import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, ClipboardList, Activity, Settings, Users, 
  FileText, ChevronRight, Bell, Search, Menu, X, Filter, Trash2, 
  Eye, EyeOff, Edit, Plus, Check, Download, AlertTriangle, Info, Calendar, RefreshCw,
  User, Lock, Mail
} from 'lucide-react';
import { AdministrationService } from '../../services/AdministrationService.js';
import { apiFetch, API_BASE_URL } from '../../api/config.js';
import logoImg from '../../assets/logo.png';
import './admin.css';

// Admin layout shell
const AdminLayout = ({ children, notifications, onMarkRead, onLogout }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read);

  const MENU = [
    { name: 'Tableau de bord', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Diagnostics', path: '/admin/diagnostics', icon: <ClipboardList size={20} /> },
    { name: 'Questionnaires', path: '/admin/questionnaires', icon: <FileText size={20} /> },
    { name: 'Utilisateurs', path: '/admin/utilisateurs', icon: <Users size={20} /> },
    { name: 'Notifications', path: '/admin/notifications', icon: <Bell size={20} /> },
    { name: 'Paramètres', path: '/admin/parametres', icon: <Settings size={20} /> },
  ];

  return (
    <div className="admin-root">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <div className="admin-logo-icon">F</div>
            <span className="admin-logo-text">FUND<span>.admin</span></span>
          </div>
        </div>

        <nav className="admin-nav">
          <span className="admin-nav-label">Navigation</span>
          {MENU.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}

          <span className="admin-nav-label" style={{ marginTop: '8px' }}>Accès rapide</span>
          <Link to="/" className="admin-nav-item" onClick={() => setSidebarOpen(false)}>
            <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />
            <span>Retour au site</span>
          </Link>
        </nav>

        {/* Sidebar user profile footer */}
        <div className="admin-sidebar-bottom">
          <div className="admin-sidebar-user">
            <div className="admin-sidebar-avatar">AD</div>
            <div className="admin-sidebar-user-info">
              <div className="admin-sidebar-user-name">Administrateur</div>
              <div className="admin-sidebar-user-role">CCI Bénin</div>
            </div>
          </div>
          <button 
            onClick={onLogout} 
            className="admin-nav-item"
            style={{ background: 'rgba(239,68,68,0.08)', color: 'rgba(252,165,165,0.9)', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
          >
            <X size={16} style={{ opacity: 0.7 }} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button className="admin-mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <div className="admin-search">
              <Search size={16} color="var(--adm-muted)" />
              <input type="text" placeholder="Recherche globale..." disabled />
            </div>
          </div>
          <div className="admin-topbar-right" style={{ position: 'relative' }}>
            <button className="admin-icon-btn" onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}>
              <Bell size={18} />
              {unreadNotifications.length > 0 && (
                <span className="admin-badge">{unreadNotifications.length}</span>
              )}
            </button>

            {notifDropdownOpen && (
              <div style={{ position: 'absolute', top: '52px', right: 0, width: '320px', background: 'white', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', boxShadow: '0 8px 40px rgba(0,0,0,0.12)', zIndex: 1000, padding: '16px', overflow: 'hidden' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.875rem', fontWeight: 800, color: '#0f172a' }}>Notifications récentes</h4>
                <div style={{ maxHeight: '260px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {notifications.length === 0 ? (
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '10px 0', textAlign: 'center' }}>Aucune notification</p>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} style={{ padding: '10px', borderRadius: '8px', background: n.read ? 'transparent' : '#f0fdf9', border: '1px solid', borderColor: n.read ? 'transparent' : '#99f6e4', opacity: n.read ? 0.7 : 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#0f172a' }}>{n.title}</div>
                        <div style={{ fontSize: '0.73rem', color: '#64748b', marginTop: '2px' }}>{n.message}</div>
                        {!n.read && (
                          <button onClick={() => { onMarkRead(n.id); setNotifDropdownOpen(false); }} style={{ background: 'none', border: 'none', color: '#0d9488', fontSize: '0.7rem', padding: '4px 0 0', cursor: 'pointer', fontWeight: 700 }}>
                            ✓ Marquer comme lu
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            <div className="admin-avatar">AD</div>
          </div>
        </header>

        {/* Content */}
        <main className="admin-content">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

// ─── DASHBOARD MODULE ───
const Dashboard = ({ stats, moduleStats, scoreDistrib, activityChart, topSectors, notifications, onMarkRead }) => {
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

      {/* ── KPI Cards ── */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div>
              <div className="admin-stat-title">Diagnostics complétés</div>
            </div>
            <div className="admin-stat-icon">🩺</div>
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
            <div className="admin-stat-icon">👥</div>
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
            <div className="admin-stat-icon">📊</div>
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
            <div className="admin-stat-icon">🏆</div>
          </div>
          <div className="admin-stat-value" style={{ fontSize: '1.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {stats.mostUsedModuleName || '—'}
          </div>
          <div className="admin-stat-trend">{stats.mostUsedModulePercentage ?? 0}% des sessions</div>
        </div>
      </div>

      {/* ── Row 2: Activity + Notifications ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>

        {/* Activity bar chart */}
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

        {/* Unread notifications */}
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
              <p style={{ color: 'var(--adm-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '24px 20px' }}>✅ Aucune alerte en attente</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Row 3: Module breakdown + Score distribution + Top sectors ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>

        {/* Module breakdown */}
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

        {/* Score distribution */}
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

        {/* Top sectors */}
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

      {/* ── Recent diagnostics quick list ── */}
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

// ─── DIAGNOSTICS MODULE ───
const DiagnosticsModule = ({ diagnostics, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedDiag, setSelectedDiag] = useState(null);

  // Search & Filter
  const filtered = diagnostics.filter(d => {
    const matchesSearch = (d.userName && d.userName.toLowerCase().includes(searchTerm.toLowerCase())) || 
                          (d.id && d.id.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesModule = selectedModule ? d.moduleId === selectedModule : true;
    return matchesSearch && matchesModule;
  });

  return (
    <div className="admin-page animate-fade-up">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Historique des Diagnostics</h1>
        <p className="admin-page-sub">Consultez et inspectez tous les rapports de diagnostics soumis par les entrepreneurs</p>
      </div>

      <div className="admin-actions-bar">
        <div className="admin-filters-group">
          <div style={{ position: 'relative', flex: 1, maxWidth: '280px' }}>
            <input 
              type="text" 
              placeholder="Rechercher par nom ou ID..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="admin-filter-input"
              style={{ width: '100%', paddingLeft: '36px' }}
            />
            <Search size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
          <select 
            value={selectedModule} 
            onChange={e => setSelectedModule(e.target.value)}
            className="admin-filter-select"
          >
            <option value="">Tous les modules</option>
            <option value="FLH-01">Diagnostic Flash</option>
            <option value="PRJ-02">Diagnostic Projet</option>
            <option value="DIF-03">Diagnostic Difficulté</option>
            <option value="OPP-04">Diagnostic Opportunité</option>
            <option value="PRO-05">Diagnostic Offre & Produits</option>
            <option value="COM-06">Diagnostic Commercial</option>
            <option value="FIN-07">Diagnostic Financier</option>
            <option value="GOV-08">Diagnostic Organisation</option>
          </select>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Entrepreneur</th>
                <th>Module</th>
                <th>Score</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id}>
                  <td style={{ fontWeight: 700 }}>#{d.id}</td>
                  <td>
                    <div>
                      <div style={{ fontWeight: 600 }}>{d.userName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{d.userEmail || 'Sans email'}</div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-blue">{d.moduleId}</span>
                  </td>
                  <td>
                    <span className={`badge ${d.score >= 70 ? 'badge-green' : d.score >= 40 ? 'badge-amber' : 'badge-red'}`}>
                      {d.score}/100
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                    {new Date(d.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setSelectedDiag(d)} style={{ color: 'var(--color-blue)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Eye size={15} /> Voir
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => onDelete(d.id)} style={{ color: 'var(--color-danger)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--slate-400)' }}>Aucun diagnostic trouvé</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Diagnostics Detail Modal */}
      {selectedDiag && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedDiag(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Détails du Diagnostic #{selectedDiag.id}</h3>
              <button className="admin-close-btn" onClick={() => setSelectedDiag(null)}><X size={18} /></button>
            </div>
            <div className="admin-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px', padding: '16px', background: 'var(--slate-50)', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', textTransform: 'uppercase' }}>Entrepreneur</div>
                  <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{selectedDiag.userName}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', textTransform: 'uppercase' }}>Module</div>
                  <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{selectedDiag.moduleName} ({selectedDiag.moduleId})</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', textTransform: 'uppercase' }}>Score Global</div>
                  <div style={{ fontWeight: 900, color: selectedDiag.score >= 70 ? 'var(--color-success)' : selectedDiag.score >= 40 ? 'var(--color-warning)' : 'var(--color-danger)' }}>{selectedDiag.score}/100</div>
                </div>
              </div>

              <h4 style={{ marginBottom: '12px', fontSize: '0.95rem', fontWeight: 800 }}>Réponses fournies</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.entries(selectedDiag.answers).map(([qId, val]) => {
                  if (qId.endsWith('_proof')) return null; // skip proof text render here
                  const proofVal = selectedDiag.answers[`${qId}_proof`];
                  return (
                    <div key={qId} style={{ borderBottom: '1px solid var(--slate-100)', paddingBottom: '8px' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-500)' }}>Question ID: {qId}</div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--slate-800)', marginTop: '2px' }}>
                        Réponse : <strong>{Array.isArray(val) ? val.join(', ') : String(val)}</strong>
                      </div>
                      {proofVal && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-blue)', background: 'var(--color-blue-light)', padding: '4px 8px', borderRadius: '4px', marginTop: '4px' }}>
                          Preuve d'activité : <em>{proofVal}</em>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="btn btn-ghost" onClick={() => setSelectedDiag(null)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── QUESTIONNAIRES MODULE (CRUD) ───
const QuestionnairesModule = () => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [editQuestion, setEditQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState(false);

  // Form states for adding/editing questions
  const [qId, setQId] = useState('');
  const [qText, setQText] = useState('');
  const [qType, setQType] = useState('single');
  const [qAxe, setQAxe] = useState('');
  const [qWeight, setQWeight] = useState(15);
  const [qChoices, setQChoices] = useState([{ id: 'opt1', label: '', score: 10 }]);

  useEffect(() => {
    AdministrationService.questionnaires.getQuestionnaires().then(setQuestionnaires);
  }, []);

  const handleSelectQuestionnaire = (moduleId) => {
    setSelectedModuleId(moduleId);
    AdministrationService.questionnaires.getQuestionnaireById(moduleId).then(res => {
      setSelectedQuestionnaire(res);
      setQuestions(res?.questions || []);
    });
  };

  const handleEditClick = (q) => {
    setEditQuestion(q);
    setQId(q.id);
    setQText(q.question);
    setQType(q.type);
    setQAxe(q.axe || '');
    setQWeight(q.weight || 0);
    setQChoices(q.choices || [{ id: 'opt1', label: '', score: 10 }]);
    setNewQuestion(false);
  };

  const handleAddClick = () => {
    setEditQuestion(null);
    setQId(`q${questions.length + 1}`);
    setQText('');
    setQType('single');
    setQAxe('');
    setQWeight(15);
    setQChoices([{ id: 'opt1', label: '', score: 15 }]);
    setNewQuestion(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updatedQuestion = {
      id: qId,
      question: qText,
      type: qType,
      axe: qAxe,
      weight: Number(qWeight),
      choices: qChoices.filter(c => c.label !== '')
    };

    AdministrationService.questions.saveQuestion(selectedModuleId, updatedQuestion).then(() => {
      handleSelectQuestionnaire(selectedModuleId);
      setEditQuestion(null);
      setNewQuestion(false);
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette question ?')) {
      AdministrationService.questions.deleteQuestion(selectedModuleId, id).then(() => {
        handleSelectQuestionnaire(selectedModuleId);
      });
    }
  };

  const addChoice = () => {
    setQChoices([...qChoices, { id: `opt${qChoices.length + 1}`, label: '', score: 10 }]);
  };

  const updateChoice = (idx, field, value) => {
    const updated = [...qChoices];
    updated[idx][field] = field === 'score' ? Number(value) : value;
    setQChoices(updated);
  };

  const removeChoice = (idx) => {
    setQChoices(qChoices.filter((_, i) => i !== idx));
  };

  return (
    <div className="admin-page animate-fade-up">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Gestion des Questionnaires</h1>
        <p className="admin-page-sub">Configurez les questions de chaque diagnostic et adaptez le moteur de scoring en direct</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'start' }}>
        {/* Module Selection Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Sélectionnez un diagnostic</h2>
          </div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {questionnaires.map(q => (
              <button 
                key={q.id}
                onClick={() => handleSelectQuestionnaire(q.id)}
                style={{ 
                  textAlign: 'left', 
                  padding: '12px 16px', 
                  borderRadius: '10px', 
                  border: '1px solid var(--slate-200)',
                  background: selectedModuleId === q.id ? 'var(--brand-blue-light)' : 'white',
                  color: selectedModuleId === q.id ? 'var(--color-primary)' : 'var(--slate-700)',
                  fontWeight: selectedModuleId === q.id ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{q.name} ({q.id})</span>
                <span className="badge badge-slate" style={{ background: 'var(--slate-100)' }}>{q.questionsCount} questions</span>
              </button>
            ))}
          </div>
        </div>

        {/* Questions List Card */}
        <div className="admin-card" style={{ gridColumn: 'span 2' }}>
          <div className="admin-card-header">
            <h2>Questions de : {selectedQuestionnaire?.name || 'Aucun sélectionné'}</h2>
            {selectedQuestionnaire && (
              <button className="btn btn-teal btn-sm" onClick={handleAddClick} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Plus size={16} /> Ajouter une question
              </button>
            )}
          </div>
          <div style={{ padding: '16px' }}>
            {!selectedQuestionnaire ? (
              <p style={{ color: 'var(--slate-400)', textAlign: 'center', padding: '40px' }}>Veuillez sélectionner un diagnostic dans la colonne de gauche.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {questions.map((q, idx) => (
                  <div key={q.id} className="admin-sub-item-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                      <div>
                        <span className="badge badge-blue" style={{ marginRight: '6px' }}>{q.id}</span>
                        {q.axe && <span className="admin-badge-severity moyen" style={{ marginRight: '6px' }}>{q.axe}</span>}
                        <span className="admin-badge-severity élevé" style={{ marginRight: '6px' }}>Coef: {q.weight || 0}</span>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginTop: '6px', color: 'var(--color-primary)' }}>{q.question}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleEditClick(q)} style={{ color: 'var(--color-blue)' }}><Edit size={14} /> Éditer</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(q.id)} style={{ color: 'var(--color-danger)' }}><Trash2 size={14} /></button>
                      </div>
                    </div>

                    {q.choices && q.choices.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                        {q.choices.map((c, i) => (
                          <span key={i} style={{ fontSize: '0.78rem', padding: '3px 8px', background: 'white', border: '1px solid var(--slate-200)', borderRadius: '6px' }}>
                            {c.icon && <span style={{ marginRight: '4px' }}>{c.icon}</span>}
                            {c.label} <strong style={{ color: 'var(--color-blue)' }}>({c.score} pts)</strong>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Question Modal */}
      {(editQuestion || newQuestion) && (
        <div className="admin-modal-backdrop" onClick={() => { setEditQuestion(null); setNewQuestion(false); }}>
          <div className="admin-modal wide" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSave}>
              <div className="admin-modal-header">
                <h3>{newQuestion ? 'Ajouter une question' : 'Éditer la question ' + qId}</h3>
                <button className="admin-close-btn" type="button" onClick={() => { setEditQuestion(null); setNewQuestion(false); }}><X size={18} /></button>
              </div>
              <div className="admin-modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">ID Unique</label>
                    <input 
                      type="text" 
                      value={qId} 
                      onChange={e => setQId(e.target.value)} 
                      disabled={!newQuestion}
                      className="admin-form-input" 
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Axe diagnostique (Catégorie)</label>
                    <input 
                      type="text" 
                      value={qAxe} 
                      onChange={e => setQAxe(e.target.value)} 
                      className="admin-form-input"
                      placeholder="Ex: Finance, Commercial, ..."
                    />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Libellé de la question</label>
                  <input 
                    type="text" 
                    value={qText} 
                    onChange={e => setQText(e.target.value)} 
                    className="admin-form-input" 
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Type de réponse</label>
                    <select value={qType} onChange={e => setQType(e.target.value)} className="admin-form-select">
                      <option value="single">Choix unique (Radio)</option>
                      <option value="multi">Choix multiples (Checkbox)</option>
                      <option value="scale_1_5">Curseur linéaire (1 à 5)</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Coefficient / Poids (score total)</label>
                    <input 
                      type="number" 
                      value={qWeight} 
                      onChange={e => setQWeight(e.target.value)} 
                      className="admin-form-input" 
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                {qType !== 'scale_1_5' && (
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 800 }}>Options de choix de réponse</h4>
                      <button className="btn btn-ghost btn-sm" type="button" onClick={addChoice} style={{ color: 'var(--color-blue)' }}>
                        <Plus size={14} /> Ajouter une option
                      </button>
                    </div>
                    {qChoices.map((choice, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                        <input 
                          type="text" 
                          placeholder="Icône/Emoji (Optionnel)" 
                          value={choice.icon || ''}
                          onChange={e => updateChoice(idx, 'icon', e.target.value)}
                          className="admin-form-input"
                          style={{ maxWidth: '80px' }}
                        />
                        <input 
                          type="text" 
                          placeholder="Intitulé du choix de réponse" 
                          value={choice.label}
                          onChange={e => updateChoice(idx, 'label', e.target.value)}
                          className="admin-form-input"
                          required
                        />
                        <input 
                          type="number" 
                          placeholder="Score" 
                          value={choice.score}
                          onChange={e => updateChoice(idx, 'score', e.target.value)}
                          className="admin-form-input"
                          style={{ maxWidth: '80px' }}
                          required
                        />
                        <button type="button" onClick={() => removeChoice(idx)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="admin-modal-footer">
                <button className="btn btn-ghost" type="button" onClick={() => { setEditQuestion(null); setNewQuestion(false); }}>Annuler</button>
                <button className="btn btn-primary" type="submit">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── UTILISATEURS MODULE (CRUD) ───
const UtilisateursModule = ({ users, onDelete, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // User Form State
  const [uName, setUName] = useState('');
  const [uEmail, setUEmail] = useState('');
  const [uPhone, setUPhone] = useState('');
  const [uCompany, setUCompany] = useState('');
  const [uSector, setUSector] = useState('');
  const [uDept, setUDept] = useState('');
  const [uCommune, setUCommune] = useState('');
  const [uProfile, setUProfile] = useState('active');

  const filtered = users.filter(u => {
    const matchesSearch = (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
                          (u.companyName && u.companyName.toLowerCase().includes(searchTerm.toLowerCase())) || 
                          (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesProfile = selectedProfile ? u.profile === selectedProfile : true;
    return matchesSearch && matchesProfile;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      name: uName,
      email: uEmail,
      phone: uPhone,
      companyName: uCompany,
      sector: uSector,
      department: uDept,
      commune: uCommune,
      profile: uProfile
    };
    onAdd(newUser);
    setShowAddModal(false);
    // clear form
    setUName('');
    setUEmail('');
    setUPhone('');
    setUCompany('');
    setUSector('');
    setUDept('');
    setUCommune('');
  };

  return (
    <div className="admin-page animate-fade-up">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Prospects &amp; Utilisateurs</h1>
        <p className="admin-page-sub">Gérez la liste des entrepreneurs ayant complété une évaluation ou demandé un suivi CCI</p>
      </div>

      <div className="admin-actions-bar">
        <div className="admin-filters-group">
          <div style={{ position: 'relative', flex: 1, maxWidth: '280px' }}>
            <input 
              type="text" 
              placeholder="Rechercher par nom, email..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="admin-filter-input"
              style={{ width: '100%', paddingLeft: '36px' }}
            />
            <Search size={16} color="var(--slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>
          <select 
            value={selectedProfile} 
            onChange={e => setSelectedProfile(e.target.value)}
            className="admin-filter-select"
          >
            <option value="">Tous les profils</option>
            <option value="active">Actif / En cours</option>
            <option value="project">Porteur de projet</option>
            <option value="diffic">En difficulté</option>
            <option value="pme">Entreprise établie (PME)</option>
          </select>
        </div>
        <button className="btn btn-teal btn-sm" onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Plus size={16} /> Ajouter un prospect
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Entrepreneur</th>
                <th>Entreprise</th>
                <th>Localisation</th>
                <th>Profil</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{u.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{u.email}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{u.phone}</div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div style={{ fontWeight: 600 }}>{u.companyName || 'Non renseigné'}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--slate-400)' }}>{u.sector || 'Sans secteur'}</div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.85rem' }}>{u.commune || '—'}, {u.department || '—'}</div>
                  </td>
                  <td>
                    <span className="badge badge-slate" style={{ background: 'var(--slate-100)' }}>{u.profile}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {u.contactRequested && <span className="admin-badge-severity moyen">Suivi</span>}
                      {u.pdfDownloaded && <span className="admin-badge-severity critique" style={{ background: 'var(--color-blue-light)', color: 'var(--color-blue)' }}>PDF</span>}
                    </div>
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => onDelete(u.id)} style={{ color: 'var(--color-danger)' }}><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--slate-400)' }}>Aucun utilisateur enregistré</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleAddSubmit}>
              <div className="admin-modal-header">
                <h3>Ajouter un nouveau prospect</h3>
                <button className="admin-close-btn" type="button" onClick={() => setShowAddModal(false)}><X size={18} /></button>
              </div>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label className="admin-form-label">Nom complet</label>
                  <input type="text" value={uName} onChange={e => setUName(e.target.value)} className="admin-form-input" required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Email</label>
                    <input type="email" value={uEmail} onChange={e => setUEmail(e.target.value)} className="admin-form-input" required />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Téléphone</label>
                    <input type="text" value={uPhone} onChange={e => setUPhone(e.target.value)} className="admin-form-input" required />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Raison sociale / Entreprise</label>
                    <input type="text" value={uCompany} onChange={e => setUCompany(e.target.value)} className="admin-form-input" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Secteur d'activité</label>
                    <input type="text" value={uSector} onChange={e => setUSector(e.target.value)} className="admin-form-input" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Département (Bénin)</label>
                    <input type="text" value={uDept} onChange={e => setUDept(e.target.value)} className="admin-form-input" placeholder="Ex: Littoral" />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Commune</label>
                    <input type="text" value={uCommune} onChange={e => setUCommune(e.target.value)} className="admin-form-input" placeholder="Ex: Cotonou" />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Profil d'entrée</label>
                  <select value={uProfile} onChange={e => setUProfile(e.target.value)} className="admin-form-select">
                    <option value="active">Actif / En cours</option>
                    <option value="project">Porteur de projet</option>
                    <option value="diffic">En difficulté</option>
                    <option value="pme">Entreprise établie (PME)</option>
                  </select>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button className="btn btn-ghost" type="button" onClick={() => setShowAddModal(false)}>Annuler</button>
                <button className="btn btn-primary" type="submit">Créer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── NOTIFICATIONS MODULE ───
const NotificationsModule = ({ notifications, onMarkRead, onDelete }) => {
  return (
    <div className="admin-page animate-fade-up">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Notifications système</h1>
        <p className="admin-page-sub">Gérez et suivez les alertes de l'application</p>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <h2>Toutes les notifications ({notifications.length})</h2>
        </div>
        <div style={{ padding: '20px' }}>
          {notifications.map(n => (
            <div 
              key={n.id} 
              style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '16px', 
                padding: '16px', 
                borderBottom: '1px solid var(--slate-100)',
                background: n.read ? 'transparent' : 'var(--color-blue-light)',
                borderRadius: '8px',
                marginBottom: '10px'
              }}
            >
              <div style={{ marginTop: '2px' }}>
                {n.type === 'danger' ? <AlertTriangle size={18} color="var(--color-danger)" /> : <Info size={18} color="var(--color-blue)" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{n.title}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{new Date(n.date).toLocaleDateString()}</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--slate-600)', margin: '4px 0 0 0' }}>{n.message}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {!n.read && (
                  <button className="btn btn-ghost btn-sm" onClick={() => onMarkRead(n.id)} style={{ color: 'var(--color-blue)' }}>lu</button>
                )}
                <button className="btn btn-ghost btn-sm" onClick={() => onDelete(n.id)} style={{ color: 'var(--color-danger)' }}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <p style={{ color: 'var(--slate-400)', textAlign: 'center', padding: '40px' }}>Aucune notification</p>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── PARAMÈTRES MODULE ───
const ParametresModule = () => {
  const [settings, setSettings] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    AdministrationService.settings.getSettings().then(setSettings);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    AdministrationService.settings.saveSettings(settings).then(() => {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    });
  };

  if (!settings) return <p>Chargement des paramètres...</p>;

  return (
    <div className="admin-page animate-fade-up">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Configuration système</h1>
        <p className="admin-page-sub">Ajustez les variables générales et les seuils d'analyse du diagnostic</p>
      </div>

      <div className="admin-card" style={{ maxWidth: '640px' }}>
        <div className="admin-card-header">
          <h2>Seuils d'analyse de score</h2>
        </div>
        <form onSubmit={handleSave} style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Seuil Critique (Score en dessous duquel l'urgence s'active)</label>
              <input 
                type="number" 
                value={settings.scoreThresholds.critique} 
                onChange={e => setSettings({
                  ...settings,
                  scoreThresholds: { ...settings.scoreThresholds, critique: Number(e.target.value) }
                })}
                className="admin-form-input" 
                required 
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Seuil Moyen (Pour passage au niveau Solide)</label>
              <input 
                type="number" 
                value={settings.scoreThresholds.moyen} 
                onChange={e => setSettings({
                  ...settings,
                  scoreThresholds: { ...settings.scoreThresholds, moyen: Number(e.target.value) }
                })}
                className="admin-form-input" 
                required 
              />
            </div>
          </div>

          <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '20px 0 10px 0', borderBottom: '1px solid var(--slate-100)', paddingBottom: '8px' }}>Variables Générales</h3>
          
          <div className="admin-form-group">
            <label className="admin-form-label">Nom de l'application</label>
            <input 
              type="text" 
              value={settings.general.appName} 
              onChange={e => setSettings({
                ...settings,
                general: { ...settings.general, appName: e.target.value }
              })}
              className="admin-form-input" 
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="admin-form-group">
              <label className="admin-form-label">Organisation / CCI</label>
              <input 
                type="text" 
                value={settings.general.organizationName} 
                onChange={e => setSettings({
                  ...settings,
                  general: { ...settings.general, organizationName: e.target.value }
                })}
                className="admin-form-input" 
                required 
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Email de contact d'assistance</label>
              <input 
                type="email" 
                value={settings.general.contactEmail} 
                onChange={e => setSettings({
                  ...settings,
                  general: { ...settings.general, contactEmail: e.target.value }
                })}
                className="admin-form-input" 
                required 
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button className="btn btn-primary" type="submit">Enregistrer les paramètres</button>
            {saveSuccess && (
              <span style={{ color: 'var(--color-success)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
                <Check size={16} /> Enregistré avec succès !
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── ADMIN LOGIN COMPONENT ───
const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [mode, setMode] = useState('login'); // 'login' or 'forgot'
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateEmailFormat = (val) => {
    if (!val) {
      setEmailError("L'adresse e-mail est requise.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      setEmailError("Format d'e-mail incorrect (ex: nom@domaine.com).");
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePasswordFormat = (val) => {
    if (!val) {
      setPasswordError("Le mot de passe est requis.");
      return false;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(val)) {
      setPasswordError("Doit faire au moins 8 caractères, une majuscule et un chiffre.");
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    // If error was already shown, validate live
    if (emailError) {
      validateEmailFormat(val);
    }
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    // If error was already shown, validate live
    if (passwordError) {
      validatePasswordFormat(val);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!validateEmailFormat(email)) {
      return;
    }
    setError('');
    setSuccessMessage(`Un lien de récupération a été envoyé à l'adresse : ${email}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const isEmailValid = validateEmailFormat(email);
    const isPasswordValid = validatePasswordFormat(password);

    if (!isEmailValid || !isPasswordValid) {
      setError('Veuillez corriger les erreurs de saisie.');
      return;
    }

    setError('');
    
    // Tenter de se connecter via l'API du backend en ligne (préfixe /api/auth/login)
    const loginUrl = `${API_BASE_URL.replace('/api/bc', '')}/auth/login`;
    apiFetch(loginUrl, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    .then(res => {
      const token = res?.data?.access_token || res?.access_token;
      if (token) {
        onLogin(token);
      } else {
        // En cas de succès sans token renvoyé, utiliser le mode local
        onLogin();
      }
    })
    .catch(err => {
      console.warn('Backend login failed, trying local fallback:', err);
      // Valid credentials (standard admin email/pass mock local)
      if (email === 'admin@fundlab.com' && password === 'Admin123') {
        onLogin();
      } else {
        setError('Identifiants incorrects. Veuillez réessayer.');
      }
    });
  };

  if (mode === 'forgot') {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card animate-fade-up">
          <Link to="/" className="admin-login-logo" style={{ display: 'block', margin: '0 auto 20px', textAlign: 'center' }}>
            <img src={logoImg} alt="FUND.lab Logo" style={{ height: '40px', width: 'auto', display: 'block', margin: '0 auto' }} />
          </Link>
          <h2 className="admin-login-title">Mot de passe oublié</h2>
          <p className="admin-login-sub">Saisissez votre adresse e-mail pour recevoir un lien de réinitialisation.</p>
          
          {error && (
            <div className="admin-login-error">
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="admin-login-success" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(52, 190, 213, 0.1)',
              border: '1px solid rgba(52, 190, 213, 0.2)',
              borderRadius: '8px',
              padding: '12px',
              color: 'var(--color-accent-dark, #1A9DB8)',
              fontSize: '0.84rem',
              fontWeight: 500,
              lineHeight: 1.4,
              marginBottom: '20px'
            }}>
              <Check size={16} style={{ flexShrink: 0 }} />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="admin-login-field-group">
              <label className="admin-login-field-label">Adresse e-mail</label>
              <div className="admin-login-input-container" style={{ border: emailError ? '1px solid #ef4444' : '' }}>
                <Mail size={18} className="admin-login-field-icon" style={{ color: emailError ? '#ef4444' : '' }} />
                <input 
                  type="email" 
                  placeholder="exemple@domaine.com" 
                  value={email} 
                  onChange={handleEmailChange} 
                  onBlur={() => validateEmailFormat(email)}
                  className="admin-login-input"
                  required 
                />
              </div>
              {emailError && (
                <span style={{ color: '#ef4444', fontSize: '0.74rem', marginTop: '4px', display: 'block', fontWeight: 500 }}>
                  {emailError}
                </span>
              )}
            </div>

            <button type="submit" className="admin-login-submit-btn">
              Envoyer le lien
            </button>
          </form>
          
          <div style={{ marginTop: '28px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
            <button 
              type="button" 
              onClick={() => {
                setMode('login');
                setError('');
                setEmailError('');
                setPasswordError('');
                setSuccessMessage('');
              }}
              style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.8rem', textDecoration: 'underline', cursor: 'pointer' }}
            >
              Retourner à la connexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card animate-fade-up">
        <Link to="/" className="admin-login-logo" style={{ display: 'block', margin: '0 auto 20px', textAlign: 'center' }}>
          <img src={logoImg} alt="FUND.lab Logo" style={{ height: '40px', width: 'auto', display: 'block', margin: '0 auto' }} />
        </Link>
        <h2 className="admin-login-title">Espace Administration</h2>
        <p className="admin-login-sub">Identifiez-vous pour accéder au tableau de bord.</p>
        
        {error && (
          <div className="admin-login-error">
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="admin-login-field-group">
            <label className="admin-login-field-label">Adresse e-mail</label>
            <div className="admin-login-input-container" style={{ border: emailError ? '1px solid #ef4444' : '' }}>
              <Mail size={18} className="admin-login-field-icon" style={{ color: emailError ? '#ef4444' : '' }} />
              <input 
                type="email" 
                placeholder="exemple@domaine.com" 
                value={email} 
                onChange={handleEmailChange} 
                onBlur={() => validateEmailFormat(email)}
                className="admin-login-input"
                required 
              />
            </div>
            {emailError && (
              <span style={{ color: '#ef4444', fontSize: '0.74rem', marginTop: '4px', display: 'block', fontWeight: 500 }}>
                {emailError}
              </span>
            )}
          </div>
          
          <div className="admin-login-field-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="admin-login-field-label" style={{ marginBottom: 0 }}>Mot de passe</label>
              <button 
                type="button" 
                onClick={() => {
                  setMode('forgot');
                  setError('');
                  setEmailError('');
                  setPasswordError('');
                  setSuccessMessage('');
                }}
                style={{ background: 'none', border: 'none', color: 'var(--color-accent, #34BED5)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
              >
                Mot de passe oublié ?
              </button>
            </div>
            <div className="admin-login-input-container" style={{ border: passwordError ? '1px solid #ef4444' : '' }}>
              <Lock size={18} className="admin-login-field-icon" style={{ color: passwordError ? '#ef4444' : '' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                value={password} 
                onChange={handlePasswordChange} 
                onBlur={() => validatePasswordFormat(password)}
                className="admin-login-input"
                style={{ paddingRight: '44px' }}
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  cursor: 'pointer',
                  color: showPassword ? 'var(--color-accent, #34BED5)' : '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.2s ease',
                  borderRadius: '6px'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordError && (
              <span style={{ color: '#ef4444', fontSize: '0.74rem', marginTop: '4px', display: 'block', fontWeight: 500 }}>
                {passwordError}
              </span>
            )}
          </div>

          <button 
            type="submit" 
            className="admin-login-submit-btn"
          >
            Se connecter au Panel
          </button>
        </form>
        
        <div style={{ marginTop: '28px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#64748b', fontSize: '0.8rem', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
            Retourner au site principal
          </Link>
        </div>
      </div>
    </div>
  );
};

// ─── ADMIN MAIN CONTROLLER ───
export const AdminApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('admin_authenticated') === 'true'
  );
  // Core lists
  const [diagnostics, setDiagnostics] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  // Dashboard analytics — each maps to a distinct API endpoint
  const [stats, setStats] = useState({});              // GET /api/admin/stats/overview
  const [moduleStats, setModuleStats] = useState([]);  // GET /api/admin/stats/modules
  const [scoreDistrib, setScoreDistrib] = useState([]); // GET /api/admin/stats/scores/distribution
  const [activityChart, setActivityChart] = useState([]); // GET /api/admin/stats/activity
  const [topSectors, setTopSectors] = useState([]);   // GET /api/admin/stats/sectors

  // Fetch all dynamic data — each call is independent & async
  const loadAllData = () => {
    if (!isAuthenticated) return;
    // Core data
    AdministrationService.diagnostics.getDiagnostics().then(list => {
      setDiagnostics(list);
      // Inject recent 5 diagnostics directly into stats for the Dashboard table
      setStats(prev => ({ ...prev, _recentDiags: list.slice(0, 5) }));
    });
    AdministrationService.users.getUsers().then(setUsers);
    AdministrationService.notifications.getNotifications().then(setNotifications);
    // Analytics endpoints
    AdministrationService.statistics.getOverview().then(data => setStats(prev => ({ ...prev, ...data })));
    AdministrationService.statistics.getModuleStats().then(setModuleStats);
    AdministrationService.statistics.getScoreDistribution().then(setScoreDistrib);
    AdministrationService.statistics.getActivityChart(7).then(setActivityChart);
    AdministrationService.statistics.getTopSectors().then(setTopSectors);
  };

  useEffect(() => {
    loadAllData();
  }, [isAuthenticated]);

  const handleLogin = (token = null) => {
    if (token) {
      localStorage.setItem('admin_token', token);
    }
    sessionStorage.setItem('admin_authenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
  };

  const handleMarkReadNotif = (id) => {
    AdministrationService.notifications.markAsRead(id).then(loadAllData);
  };

  const handleDeleteNotif = (id) => {
    AdministrationService.notifications.deleteNotification(id).then(loadAllData);
  };

  const handleDeleteDiag = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce diagnostic ?')) {
      AdministrationService.diagnostics.deleteDiagnostic(id).then(loadAllData);
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      AdministrationService.users.deleteUser(id).then(loadAllData);
    }
  };

  const handleAddUser = (user) => {
    AdministrationService.users.registerUser(user).then(loadAllData);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <AdminLayout notifications={notifications} onMarkRead={handleMarkReadNotif} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={
          <Dashboard 
            stats={stats}
            moduleStats={moduleStats}
            scoreDistrib={scoreDistrib}
            activityChart={activityChart}
            topSectors={topSectors}
            notifications={notifications} 
            onMarkRead={handleMarkReadNotif} 
          />
        } />
        <Route path="/diagnostics" element={
          <DiagnosticsModule 
            diagnostics={diagnostics} 
            onDelete={handleDeleteDiag} 
          />
        } />
        <Route path="/questionnaires" element={<QuestionnairesModule />} />
        <Route path="/utilisateurs" element={
          <UtilisateursModule 
            users={users} 
            onDelete={handleDeleteUser} 
            onAdd={handleAddUser}
          />
        } />
        <Route path="/notifications" element={
          <NotificationsModule 
            notifications={notifications} 
            onMarkRead={handleMarkReadNotif}
            onDelete={handleDeleteNotif}
          />
        } />
        <Route path="/parametres" element={<ParametresModule />} />
      </Routes>
    </AdminLayout>
  );
};
