import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, ClipboardList, Activity, Settings, Users, 
  FileText, ChevronRight, Bell, Search, Menu, X, Filter, Trash2, 
  Eye, Edit, Plus, Check, Download, AlertTriangle, Info, Calendar, RefreshCw
} from 'lucide-react';
import { AdministrationService } from '../../services/AdministrationService.js';
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
            <div className="admin-logo-icon" style={{ background: 'var(--color-accent)', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'var(--color-primary)' }}>F</div>
            <span className="admin-logo-text" style={{ fontWeight: '800', color: 'var(--color-primary)' }}>FUND<span style={{ color: 'var(--color-accent)' }}>.admin</span></span>
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
          <div style={{ marginTop: 'auto', padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Link to="/" className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
              ← Retour au site
            </Link>
            <button 
              onClick={onLogout} 
              className="btn btn-sm" 
              style={{ width: '100%', justifyContent: 'center', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.2)', fontWeight: '700' }}
            >
              Déconnexion
            </button>
          </div>
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
            <div className="admin-search" style={{ background: 'var(--slate-50)', border: '1px solid var(--slate-200)' }}>
              <Search size={18} color="var(--slate-400)" />
              <input type="text" placeholder="Recherche globale..." disabled />
            </div>
          </div>
          <div className="admin-topbar-right" style={{ position: 'relative' }}>
            <button className="admin-icon-btn" onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}>
              <Bell size={20} />
              {unreadNotifications.length > 0 && (
                <span className="admin-badge">{unreadNotifications.length}</span>
              )}
            </button>

            {notifDropdownOpen && (
              <div style={{ position: 'absolute', top: '50px', right: 0, width: '320px', background: 'white', border: '1px solid var(--slate-200)', borderRadius: '12px', boxShadow: 'var(--shadow-lg)', zIndex: 1000, padding: '12px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: 800 }}>Notifications récentes</h4>
                <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <p style={{ fontSize: '0.8rem', color: 'var(--slate-400)', margin: '10px 0' }}>Aucune notification</p>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} style={{ padding: '8px', borderBottom: '1px solid var(--slate-100)', opacity: n.read ? 0.6 : 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>{n.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{n.message}</div>
                        {!n.read && (
                          <button onClick={() => { onMarkRead(n.id); setNotifDropdownOpen(false); }} style={{ background: 'none', border: 'none', color: 'var(--color-blue)', fontSize: '0.7rem', padding: '2px 0', cursor: 'pointer', textDecoration: 'underline' }}>
                            Marquer comme lu
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            <div className="admin-avatar">CCI</div>
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
const Dashboard = ({ stats, notifications, onMarkRead }) => {
  return (
    <div className="admin-page animate-fade-up">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Tableau de bord</h1>
        <p className="admin-page-sub">Vue d'ensemble de l'activité sur le Business Check-up</p>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div className="admin-stat-title">Diagnostics complétés</div>
            <Activity size={20} color="var(--brand-teal)" />
          </div>
          <div className="admin-stat-value">{stats.totalDiagnostics || 0}</div>
          <div className="admin-stat-trend positive">↑ +{stats.monthlyProgress}% ce mois</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div className="admin-stat-title">Prospects enregistrés</div>
            <Users size={20} color="var(--brand-blue)" />
          </div>
          <div className="admin-stat-value">{stats.totalUsers || 0}</div>
          <div className="admin-stat-trend positive">↑ +{stats.userProgress}% ce mois</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <div className="admin-stat-title">Module le plus demandé</div>
            <FileText size={20} color="var(--color-warning)" />
          </div>
          <div className="admin-stat-value" style={{ fontSize: '1.4rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {stats.mostUsedModule || 'Flash'}
          </div>
          <div className="admin-stat-trend">{stats.mostUsedModulePercentage || 0}% des sessions</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', marginTop: '24px' }}>
        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Notifications CCI en attente</h2>
            <Link to="/admin/notifications" className="btn btn-ghost btn-sm">Voir tout</Link>
          </div>
          <div style={{ padding: '16px' }}>
            {notifications.filter(n => !n.read).slice(0, 4).map(n => (
              <div key={n.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--slate-100)' }}>
                <div style={{ marginTop: '2px' }}>
                  {n.type === 'danger' ? <AlertTriangle size={16} color="var(--color-danger)" /> : <Info size={16} color="var(--color-blue)" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{n.title}</div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', margin: '2px 0' }}>{n.message}</p>
                </div>
                <button className="btn btn-ghost btn-xs" onClick={() => onMarkRead(n.id)} style={{ color: 'var(--color-blue)' }}>lu</button>
              </div>
            ))}
            {notifications.filter(n => !n.read).length === 0 && (
              <p style={{ color: 'var(--slate-400)', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>Aucune notification en attente</p>
            )}
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h2>Répartition des sessions</h2>
          </div>
          <div style={{ padding: '24px' }}>
            {stats.moduleCounts && Object.entries(stats.moduleCounts).map(([moduleId, count]) => {
              const pct = stats.totalDiagnostics > 0 ? Math.round((count / stats.totalDiagnostics) * 100) : 0;
              return (
                <div key={moduleId} style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                    <span>{moduleId}</span>
                    <span>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--slate-100)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'var(--color-accent)' }} />
                  </div>
                </div>
              );
            })}
          </div>
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
    const matchesSearch = d.userName.toLowerCase().includes(searchTerm.toLowerCase()) || d.id.toLowerCase().includes(searchTerm.toLowerCase());
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
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (u.companyName && u.companyName.toLowerCase().includes(searchTerm.toLowerCase())) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLogin();
    } else {
      setError('Identifiant ou mot de passe incorrect.');
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <div className="admin-login-logo-icon">F</div>
          <span className="admin-login-logo-text">FUND<span>.admin</span></span>
        </div>
        <h2 className="admin-login-title">Connexion Administration</h2>
        <p className="admin-login-sub">Veuillez entrer vos identifiants pour continuer.</p>
        
        {error && (
          <div className="admin-login-error">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="admin-form-group" style={{ marginBottom: 0 }}>
            <label className="admin-form-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Identifiant</label>
            <input 
              type="text" 
              placeholder="Ex: admin" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              className="admin-login-input"
              required 
            />
          </div>
          <div className="admin-form-group" style={{ marginBottom: 0 }}>
            <label className="admin-form-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Mot de passe</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="admin-login-input"
              required 
            />
          </div>
          <button 
            type="submit" 
            className="hero-cta-primary" 
            style={{ marginTop: '8px', minHeight: '46px', background: 'var(--color-accent)', color: 'var(--color-primary)', fontWeight: 'bold' }}
          >
            Se connecter
          </button>
        </form>
        
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textDecoration: 'underline' }}>
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
  const [stats, setStats] = useState({});
  const [diagnostics, setDiagnostics] = useState([]);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Fetch all dynamic data in state
  const loadAllData = () => {
    if (!isAuthenticated) return;
    AdministrationService.statistics.getOverview().then(setStats);
    AdministrationService.diagnostics.getDiagnostics().then(setDiagnostics);
    AdministrationService.users.getUsers().then(setUsers);
    AdministrationService.notifications.getNotifications().then(setNotifications);
  };

  useEffect(() => {
    loadAllData();
  }, [isAuthenticated]);

  const handleLogin = () => {
    sessionStorage.setItem('admin_authenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
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
