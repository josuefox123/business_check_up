import React, { useState } from 'react';
import { Search, Eye, Trash2, X } from 'lucide-react';

export const DiagnosticsModule = ({ diagnostics, onDelete }) => {
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
                  if (qId.endsWith('_proof')) return null;
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
