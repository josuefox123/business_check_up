import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { questionnairesApi } from '../../api/questionnairesApi.js';

export const ModulesModule = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="admin-page animate-fade-up">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Modules de diagnostic</h1>
          <p className="admin-page-sub">Gérez le catalogue des modules de diagnostic du Business Check-up</p>
        </div>
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
                  </tr>
                ))}
                {modules.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--slate-400)' }}>Aucun module enregistré</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
