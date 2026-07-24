import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Clock } from 'lucide-react';
import { questionnairesApi } from '../../api/questionnairesApi.js';

export const ModulesModule = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editModule, setEditModule] = useState(null);

  // Form states
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [family, setFamily] = useState('general');
  const [status, setStatus] = useState('mvp');
  const [duration, setDuration] = useState('5 min');
  const [questionCount, setQuestionCount] = useState(0);

  // Charger les modules
  const loadModules = () => {
    setLoading(true);
    // Charger d'abord depuis LocalStorage si existant, sinon depuis le backend
    const saved = localStorage.getItem('bc_custom_modules');
    if (saved) {
      setModules(JSON.parse(saved));
      setLoading(false);
    } else {
      questionnairesApi.getAll()
        .then(list => {
          // Normaliser et mapper avec les statuts du backend
          const normalized = list.map(m => ({
            code: m.id,
            name: m.name,
            family: m.family || 'general',
            status: m.status || 'mvp',
            target_duration: m.estimatedTime || '5 min',
            question_count: m.questionsCount || 0
          }));
          setModules(normalized);
          localStorage.setItem('bc_custom_modules', JSON.stringify(normalized));
        })
        .catch(() => {
          // Fallback par défaut si l'API échoue
          const fallback = [
            { code: 'FLH-01', name: 'Diagnostic Flash', family: 'general', status: 'mvp', target_duration: '5 min', question_count: 5 },
            { code: 'PRJ-02', name: 'Diagnostic Projet', family: 'project', status: 'mvp', target_duration: '10 min', question_count: 10 }
          ];
          setModules(fallback);
          localStorage.setItem('bc_custom_modules', JSON.stringify(fallback));
        })
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    loadModules();
  }, []);

  const saveToStorage = (updatedList) => {
    setModules(updatedList);
    localStorage.setItem('bc_custom_modules', JSON.stringify(updatedList));
  };

  const handleOpenAdd = () => {
    setEditModule(null);
    setCode('');
    setName('');
    setFamily('general');
    setStatus('mvp');
    setDuration('5 min');
    setQuestionCount(0);
    setShowModal(true);
  };

  const handleOpenEdit = (m) => {
    setEditModule(m);
    setCode(m.code);
    setName(m.name);
    setFamily(m.family);
    setStatus(m.status);
    setDuration(m.target_duration);
    setQuestionCount(m.question_count);
    setShowModal(true);
  };

  const handleDelete = (moduleCode) => {
    if (window.confirm(`Voulez-vous vraiment supprimer le module ${moduleCode} ?`)) {
      const updated = modules.filter(m => m.code !== moduleCode);
      saveToStorage(updated);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editModule) {
      // Edit
      const updated = modules.map(m => m.code === editModule.code ? {
        ...m,
        code,
        name,
        family,
        status,
        target_duration: duration,
        question_count: Number(questionCount)
      } : m);
      saveToStorage(updated);
    } else {
      // Add
      if (modules.some(m => m.code.toUpperCase() === code.toUpperCase())) {
        alert('Un module avec ce code unique existe déjà.');
        return;
      }
      const newM = {
        code: code.toUpperCase(),
        name,
        family,
        status,
        target_duration: duration,
        question_count: Number(questionCount)
      };
      saveToStorage([...modules, newM]);
    }
    setShowModal(false);
  };

  return (
    <div className="admin-page animate-fade-up">
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="admin-page-title">Modules de diagnostic</h1>
          <p className="admin-page-sub">Gérez le catalogue des modules de diagnostic du Business Check-up</p>
        </div>
        <button className="btn btn-teal btn-sm" onClick={handleOpenAdd} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Plus size={16} /> Ajouter un module
        </button>
      </div>

      <div className="admin-card" style={{ marginTop: '20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--slate-400)' }}>Chargement du catalogue des modules...</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Nom du module</th>
                  <th>Famille / Catégorie</th>
                  <th>Durée estimée</th>
                  <th>Questions</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {modules.map(m => (
                  <tr key={m.code}>
                    <td>
                      <span className="badge badge-blue" style={{ fontWeight: 700 }}>{m.code}</span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{m.name}</div>
                    </td>
                    <td>
                      <span style={{ textTransform: 'capitalize', fontSize: '0.85rem' }}>{m.family}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem' }}>
                        <Clock size={13} color="var(--slate-400)" />
                        {m.target_duration}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-slate">{m.question_count} question{m.question_count > 1 ? 's' : ''}</span>
                    </td>
                    <td>
                      <span className={`admin-badge-severity ${m.status === 'mvp' || m.status === 'mvp_recommended' ? 'moyen' : 'faible'}`} style={{ textTransform: 'uppercase', fontSize: '0.68rem', fontWeight: 700 }}>
                        {m.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleOpenEdit(m)} style={{ color: 'var(--color-blue)' }}>
                          <Edit size={15} />
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(m.code)} style={{ color: 'var(--color-danger)' }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {modules.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--slate-400)' }}>Aucun module enregistré</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSubmit}>
              <div className="admin-modal-header">
                <h3>{editModule ? 'Modifier le module ' + editModule.code : 'Ajouter un nouveau module'}</h3>
                <button className="admin-close-btn" type="button" onClick={() => setShowModal(false)}><X size={18} /></button>
              </div>
              <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Code unique</label>
                    <input 
                      type="text" 
                      placeholder="Ex: FLH-01" 
                      value={code} 
                      onChange={e => setCode(e.target.value)} 
                      disabled={!!editModule}
                      className="admin-form-input" 
                      required 
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Nom du module</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Diagnostic Flash" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      className="admin-form-input" 
                      required 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Catégorie / Famille</label>
                    <select value={family} onChange={e => setFamily(e.target.value)} className="admin-form-select">
                      <option value="general">Général / Global</option>
                      <option value="project">Porteur de Projet</option>
                      <option value="triage">Triage</option>
                      <option value="financial">Finance & Comptabilité</option>
                      <option value="commercial">Commercial & Marketing</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Statut</label>
                    <select value={status} onChange={e => setStatus(e.target.value)} className="admin-form-select">
                      <option value="mvp">MVP (Disponible)</option>
                      <option value="mvp_recommended">MVP Recommandé (Disponible)</option>
                      <option value="draft">Brouillon (Masqué)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Durée estimée</label>
                    <input 
                      type="text" 
                      placeholder="Ex: 5 min" 
                      value={duration} 
                      onChange={e => setDuration(e.target.value)} 
                      className="admin-form-input" 
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Nombre de questions</label>
                    <input 
                      type="number" 
                      min="0" 
                      value={questionCount} 
                      onChange={e => setQuestionCount(e.target.value)} 
                      className="admin-form-input" 
                    />
                  </div>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button className="btn btn-ghost" type="button" onClick={() => setShowModal(false)}>Annuler</button>
                <button className="btn btn-primary" type="submit">{editModule ? 'Sauvegarder' : 'Créer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
