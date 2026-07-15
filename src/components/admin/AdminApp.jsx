import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Activity, Settings, Users, FileText, ChevronRight, Bell, Search, Menu } from 'lucide-react';
import './admin.css';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const MENU = [
    { name: 'Tableau de bord', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Pré-diagnostics', path: '/admin/pre-diagnostics', icon: <Activity size={20} /> },
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
          <div className="admin-logo">
            <div className="admin-logo-icon">F</div>
            <span className="admin-logo-text">FUND<span>.admin</span></span>
          </div>
        </div>
        <nav className="admin-nav">
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
        </nav>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button className="admin-mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} color="var(--slate-700)" />
            </button>
            <div className="admin-search">
              <Search size={18} color="var(--slate-400)" />
              <input type="text" placeholder="Rechercher..." />
            </div>
          </div>
          <div className="admin-topbar-right">
            <button className="admin-icon-btn">
              <Bell size={20} />
              <span className="admin-badge">3</span>
            </button>
            <div className="admin-avatar">A</div>
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

const Dashboard = () => {
  return (
    <div className="admin-page animate-fade-up">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Tableau de bord</h1>
        <p className="admin-page-sub">Vue d'ensemble de l'activité sur le Bilan d'Entreprise</p>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div className="admin-stat-title">Diagnostics complétés</div>
            <Activity size={20} color="var(--brand-teal)" />
          </div>
          <div className="admin-stat-value">1,248</div>
          <div className="admin-stat-trend positive">↑ +12% ce mois</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div className="admin-stat-title">Nouveaux utilisateurs</div>
            <Users size={20} color="var(--brand-blue)" />
          </div>
          <div className="admin-stat-value">384</div>
          <div className="admin-stat-trend positive">↑ +5% ce mois</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div className="admin-stat-title">Module le plus utilisé</div>
            <FileText size={20} color="var(--color-warning)" />
          </div>
          <div className="admin-stat-value" style={{fontSize: '1.5rem'}}>DIF-03 (Difficulté)</div>
          <div className="admin-stat-trend">42% des diagnostics</div>
        </div>
      </div>

      <div className="admin-card mt-6">
        <div className="admin-card-header">
          <h2>Activité récente</h2>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Module</th>
                <th>Utilisateur</th>
                <th>Score</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4,5].map(i => (
                <tr key={i}>
                  <td>#DIAG-0{i}</td>
                  <td>DIF-03</td>
                  <td>Anonyme</td>
                  <td><span className="badge badge-warning">38/100</span></td>
                  <td>Il y a 2 heures</td>
                  <td><button className="btn btn-ghost btn-sm">Voir <ChevronRight size={16}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Placeholder = ({ title }) => (
  <div className="admin-page animate-fade-up">
    <div className="admin-page-header">
      <h1 className="admin-page-title">{title}</h1>
    </div>
    <div className="admin-card">
      <p style={{color: 'var(--slate-500)'}}>Module en cours de construction.</p>
    </div>
  </div>
);

export const AdminApp = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/pre-diagnostics" element={<Placeholder title="Pré-diagnostics" />} />
        <Route path="/diagnostics" element={<Placeholder title="Diagnostics" />} />
        <Route path="/questionnaires" element={<Placeholder title="Questionnaires" />} />
        <Route path="/utilisateurs" element={<Placeholder title="Utilisateurs" />} />
        <Route path="/parametres" element={<Placeholder title="Paramètres" />} />
      </Routes>
    </AdminLayout>
  );
};
