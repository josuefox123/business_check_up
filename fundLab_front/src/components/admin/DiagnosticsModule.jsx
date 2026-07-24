import React, { useState } from 'react';
import { Search, Eye, Trash2, X, Mail, Send, Check } from 'lucide-react';
import { apiFetch } from '../../api/config.js';

export const DiagnosticsModule = ({ diagnostics, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedDiag, setSelectedDiag] = useState(null);
  
  // Selection state
  const [selectedIds, setSelectedIds] = useState([]);
  
  // Email sending modal states
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [sendToSelf, setSendToSelf] = useState(true); // true = send to entrepreneurs, false = send to specific email
  const [customEmail, setCustomEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState('');

  // Search & Filter
  const filtered = diagnostics.filter(d => {
    const matchesSearch = (d.userName && d.userName.toLowerCase().includes(searchTerm.toLowerCase())) || 
                          (d.userEmail && d.userEmail.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesModule = selectedModule ? d.moduleId === selectedModule : true;
    return matchesSearch && matchesModule;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filtered.map(d => d.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSendEmailsSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setSendSuccess('');

    let successCount = 0;
    let failCount = 0;

    // Lancer tous les envois d'emails en parallèle
    await Promise.all(
      selectedIds.map(async (id) => {
        const diag = diagnostics.find(d => d.id === id);
        if (!diag) return;

        const targetEmail = sendToSelf ? diag.userEmail : customEmail;
        if (!targetEmail) {
          failCount++;
          return;
        }

        try {
          await apiFetch(`/diagnostics/${diag.id}/report/email`, {
            method: 'POST',
            body: JSON.stringify({
              email: targetEmail,
              full_name: diag.userName || 'Entrepreneur'
            })
          });
          successCount++;
        } catch (err) {
          console.error(`Error sending email for diagnostic ${diag.id}:`, err);
          failCount++;
        }
      })
    );

    setSending(false);
    if (failCount === 0) {
      setSendSuccess(`${successCount} rapport(s) envoyé(s) avec succès !`);
    } else {
      setSendSuccess(`${successCount} envoyé(s) avec succès, ${failCount} échec(s).`);
    }
    
    // Vider la sélection après envoi
    setTimeout(() => {
      setSelectedIds([]);
      setShowEmailModal(false);
      setSendSuccess('');
    }, 2500);
  };

  return (
    <div className="admin-page animate-fade-up">
      <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="admin-page-title">Historique des Diagnostics</h1>
          <p className="admin-page-sub">Consultez et inspectez tous les rapports de diagnostics soumis par les entrepreneurs</p>
        </div>
        <button
          className="btn btn-teal"
          disabled={selectedIds.length === 0}
          onClick={() => {
            setSendSuccess('');
            setCustomEmail('');
            setShowEmailModal(true);
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: selectedIds.length === 0 ? 0.5 : 1, transition: 'all 0.25s ease' }}
        >
          <Mail size={16} /> Envoyer par mail ({selectedIds.length})
        </button>
      </div>

      <div className="admin-actions-bar">
        <div className="admin-filters-group">
          <div style={{ position: 'relative', flex: 1, maxWidth: '280px' }}>
            <input 
              type="text" 
              placeholder="Rechercher par nom ou e-mail..." 
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
                <th style={{ width: '40px', paddingLeft: '20px' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length === filtered.length && filtered.length > 0} 
                    onChange={handleSelectAll} 
                  />
                </th>
                <th>Entrepreneur</th>
                <th>Module</th>
                <th>Score</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id} style={{ background: selectedIds.includes(d.id) ? 'rgba(52, 190, 213, 0.04)' : '' }}>
                  <td style={{ paddingLeft: '20px' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(d.id)} 
                      onChange={() => handleSelectRow(d.id)} 
                    />
                  </td>
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

      {/* Email sending modal */}
      {showEmailModal && (
        <div className="admin-modal-backdrop" onClick={() => !sending && setShowEmailModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleSendEmailsSubmit}>
              <div className="admin-modal-header">
                <h3>Envoyer les diagnostics par e-mail</h3>
                <button className="admin-close-btn" type="button" disabled={sending} onClick={() => setShowEmailModal(false)}><X size={18} /></button>
              </div>
              <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {sendSuccess && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(52, 190, 213, 0.1)', border: '1px solid rgba(52, 190, 213, 0.2)', borderRadius: '8px', padding: '12px', color: 'var(--color-accent-dark, #1A9DB8)', fontSize: '0.86rem', fontWeight: 600 }}>
                    <Check size={16} />
                    <span>{sendSuccess}</span>
                  </div>
                )}
                
                <p style={{ fontSize: '0.88rem', color: 'var(--slate-600)', margin: 0 }}>
                  Vous avez sélectionné <strong>{selectedIds.length}</strong> diagnostic(s). Choisissez l'adresse d'envoi :
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
                    <input 
                      type="radio" 
                      name="emailDest" 
                      checked={sendToSelf} 
                      onChange={() => setSendToSelf(true)} 
                      disabled={sending}
                    />
                    Envoyer directement aux entrepreneurs correspondants
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}>
                    <input 
                      type="radio" 
                      name="emailDest" 
                      checked={!sendToSelf} 
                      onChange={() => setSendToSelf(false)}
                      disabled={sending}
                    />
                    Envoyer à une adresse e-mail spécifique
                  </label>
                </div>

                {!sendToSelf && (
                  <div className="admin-form-group animate-fade-in" style={{ marginTop: '4px' }}>
                    <label className="admin-form-label">Adresse e-mail de destination</label>
                    <input 
                      type="email" 
                      placeholder="cci@direction.com" 
                      value={customEmail} 
                      onChange={e => setCustomEmail(e.target.value)} 
                      className="admin-form-input" 
                      required={!sendToSelf}
                      disabled={sending}
                    />
                  </div>
                )}
              </div>
              <div className="admin-modal-footer">
                <button className="btn btn-ghost" type="button" disabled={sending} onClick={() => setShowEmailModal(false)}>Annuler</button>
                <button className="btn btn-teal" type="submit" disabled={sending || (!sendToSelf && !customEmail)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Send size={14} /> {sending ? 'Envoi...' : 'Envoyer par mail'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Diagnostics Detail Modal */}
      {selectedDiag && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedDiag(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Détails du Diagnostic</h3>
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
