import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, ClipboardList, Settings, Users, 
  FileText, ChevronRight, Bell, Search, Menu, X, Layers
} from 'lucide-react';

import logoImg from '../../assets/white_logo.png';

export const AdminLayout = ({ children, notifications, onMarkRead, onLogout }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read);

  const MENU = [
    { name: 'Tableau de bord', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Modules', path: '/admin/modules', icon: <Layers size={20} /> },
    { name: 'Diagnostics', path: '/admin/diagnostics', icon: <ClipboardList size={20} /> },
    { name: 'Questionnaires', path: '/admin/questionnaires', icon: <FileText size={20} /> },
    { name: 'Utilisateurs', path: '/admin/utilisateurs', icon: <Users size={20} /> },
    { name: 'Paramètres', path: '/admin/parametres', icon: <Settings size={20} /> },
  ];

  return (
    <div className="admin-root">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo" style={{ display: 'flex', alignItems: 'center', padding: '0 4px' }}>
            <img src={logoImg} alt="Logo" style={{ height: '42px', width: 'auto' }} />
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
