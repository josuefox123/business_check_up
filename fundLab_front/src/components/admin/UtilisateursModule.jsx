import React, { useState } from 'react';
import { Search, Plus, Trash2, X } from 'lucide-react';

export const UtilisateursModule = ({ users, onDelete, onAdd }) => {
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
