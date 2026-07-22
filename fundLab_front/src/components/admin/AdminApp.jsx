import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdministrationService } from '../../services/AdministrationService.js';
import { AdminLayout } from './AdminLayout.jsx';
import { Dashboard } from './Dashboard.jsx';
import { DiagnosticsModule } from './DiagnosticsModule.jsx';
import { QuestionnairesModule } from './QuestionnairesModule.jsx';
import { UtilisateursModule } from './UtilisateursModule.jsx';
import { NotificationsModule } from './NotificationsModule.jsx';
import { ParametresModule } from './ParametresModule.jsx';
import { AdminLogin } from './AdminLogin.jsx';
import './admin.css';

export const AdminApp = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem('admin_authenticated') === 'true'
  );
  // Core lists
  const [diagnostics, setDiagnostics] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  // Dashboard analytics
  const [stats, setStats] = useState({});
  const [moduleStats, setModuleStats] = useState([]);
  const [scoreDistrib, setScoreDistrib] = useState([]);
  const [activityChart, setActivityChart] = useState([]);
  const [topSectors, setTopSectors] = useState([]);

  const loadAllData = () => {
    if (!isAuthenticated) return;
    AdministrationService.diagnostics.getDiagnostics().then(list => {
      setDiagnostics(list);
      setStats(prev => ({ ...prev, _recentDiags: list.slice(0, 5) }));
    });
    AdministrationService.users.getUsers().then(setUsers);
    AdministrationService.notifications.getNotifications().then(setNotifications);
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
