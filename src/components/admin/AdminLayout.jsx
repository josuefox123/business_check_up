import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, ClipboardList, Settings, Users, 
  FileText, ChevronRight, Bell, Search, Menu, X 
} from 'lucide-react';

export const AdminLayout = ({ children, notifications, onMarkRead, onLogout }) => {
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
