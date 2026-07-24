import React, { useState, useEffect } from 'react';
import { Calendar, User, Phone, Mail, Briefcase, HelpCircle, Check, XCircle, AlertCircle, ExternalLink, MapPin } from 'lucide-react';
import { AdministrationService } from '../../services/AdministrationService.js';

export const RendezVousModule = ({ users }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  
  // Modal states for confirmation
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [confirmedDate, setConfirmedDate] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [meetingLocation, setMeetingLocation] = useState('');

  const loadAppointments = () => {
    setLoading(true);
    AdministrationService.appointments.getAppointments()
      .then(data => {
        setAppointments(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleOpenConfirm = (appt) => {
    setSelectedAppt(appt);
    // Préremplir avec la date souhaitée
    const dt = appt.requested_starts_at ? new Date(appt.requested_starts_at) : new Date();
    // Convertir au format YYYY-MM-DDTHH:mm compatible datetime-local input
    try {
      const offset = dt.getTimezoneOffset();
      const localDt = new Date(dt.getTime() - (offset * 60 * 1000));
      setConfirmedDate(localDt.toISOString().slice(0, 16));
    } catch {
      setConfirmedDate('');
    }
    setMeetingLink('');
    setMeetingLocation('');
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = (e) => {
    e.preventDefault();
    if (!selectedAppt) return;
    
    // Envoyer au format ISO 8601 UTC
    const dateUtc = new Date(confirmedDate).toISOString();

    AdministrationService.appointments.confirmAppointment(
      selectedAppt.id,
      dateUtc,
      meetingLink,
      meetingLocation
    )
    .then(() => {
      setShowConfirmModal(false);
      loadAppointments();
    })
    .catch(err => {
      alert('Erreur lors de la confirmation du rendez-vous.');
    });
  };

  const handleCancel = (id) => {
    if (window.confirm('Voulez-vous vraiment annuler ce rendez-vous ?')) {
      AdministrationService.appointments.cancelAppointment(id)
        .then(loadAppointments)
        .catch(() => alert('Erreur lors de l\'annulation.'));
    }
  };

  const handleComplete = (id) => {
    if (window.confirm('Marquer ce rendez-vous comme réalisé ?')) {
      AdministrationService.appointments.completeAppointment(id)
        .then(loadAppointments)
        .catch(() => alert('Erreur.'));
    }
  };

  // Trouver l'utilisateur correspondant localement pour afficher les infos
  const getUserInfo = (userId) => {
    const u = users.find(user => user.id === userId || user.user_id === userId);
    if (!u) return { name: 'Utilisateur inconnu', email: '', phone: '', companyName: '' };
    return u;
  };

  const filtered = appointments.filter(appt => {
    if (!filterStatus) return true;
    return appt.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'requested':
        return <span className="admin-badge-severity critique" style={{ background: '#fef3c7', color: '#d97706' }}>Demandé</span>;
      case 'confirmed':
        return <span className="admin-badge-severity moyen" style={{ background: '#e0f2fe', color: '#0284c7' }}>Confirmé</span>;
      case 'completed':
        return <span className="admin-badge-severity faible" style={{ background: '#d1fae5', color: '#059669' }}>Réalisé</span>;
      case 'cancelled':
        return <span className="admin-badge-severity faible" style={{ background: '#fee2e2', color: '#dc2626' }}>Annulé</span>;
      default:
        return <span className="admin-badge-severity faible">{status}</span>;
    }
  };

  return (
    <div className="admin-page animate-fade-up">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Rendez-vous</h1>
        <p className="admin-page-sub">Gérez et planifiez les rendez-vous d'accompagnement demandés par les entrepreneurs</p>
      </div>

      <div className="admin-actions-bar">
        <div className="admin-filters-group">
          <select 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)}
            className="admin-filter-select"
          >
            <option value="">Tous les statuts</option>
            <option value="requested">Demandés</option>
            <option value="confirmed">Confirmés</option>
            <option value="completed">Réalisés</option>
            <option value="cancelled">Annulés</option>
          </select>
        </div>
      </div>

      <div className="admin-card">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--slate-400)' }}>Chargement des rendez-vous...</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date & Heure</th>
                  <th>Entrepreneur</th>
                  <th>Type & Priorité</th>
                  <th>Question principale</th>
                  <th>Statut</th>
                  <th>Planification / Lieu</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(appt => {
                  const u = getUserInfo(appt.user_id);
                  const dateToDisplay = appt.status === 'confirmed' ? appt.confirmed_starts_at : appt.requested_starts_at;
                  const formattedDate = dateToDisplay
                    ? new Date(dateToDisplay).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'Non spécifiée';

                  return (
                    <tr key={appt.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: 'var(--color-primary)' }}>
                          <Calendar size={15} color="var(--color-accent, #34BED5)" />
                          {formattedDate}
                        </div>
                      </td>
                      <td>
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{u.name || 'Nom non spécifié'}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px', fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                            {u.email && <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={12} /> {u.email}</div>}
                            {u.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12} /> {u.phone}</div>}
                            {u.companyName && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: 'var(--color-teal)' }}><Briefcase size={12} /> {u.companyName}</div>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ textTransform: 'capitalize', fontSize: '0.85rem', fontWeight: 600 }}>
                          {appt.rdv_type === 'project_framing' ? 'Cadrage Projet' : appt.rdv_type || '—'}
                          <div style={{ marginTop: '4px' }}>
                            {appt.priority === 'urgent' ? (
                              <span className="admin-badge-severity critique" style={{ fontSize: '0.66rem', padding: '2px 6px' }}>Urgent</span>
                            ) : (
                              <span className="admin-badge-severity faible" style={{ fontSize: '0.66rem', padding: '2px 6px', background: '#f1f5f9', color: '#64748b' }}>Normal</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ maxWidth: '240px' }}>
                        <div style={{ fontSize: '0.82rem', color: 'var(--slate-600)', fontStyle: appt.main_question ? 'normal' : 'italic' }}>
                          {appt.main_question ? `« ${appt.main_question} »` : 'Aucune question spécifiée'}
                        </div>
                      </td>
                      <td>{getStatusBadge(appt.status)}</td>
                      <td>
                        <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>
                          {appt.meeting_link && (
                            <a href={appt.meeting_link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-accent, #34BED5)', fontWeight: 600 }}>
                              <ExternalLink size={13} /> Lien Réunion
                            </a>
                          )}
                          {appt.location && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: appt.meeting_link ? '4px' : 0 }}>
                              <MapPin size={13} color="var(--slate-400)" /> {appt.location}
                            </div>
                          )}
                          {!appt.meeting_link && !appt.location && <span style={{ color: 'var(--slate-400)', fontStyle: 'italic' }}>—</span>}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                          {appt.status === 'requested' && (
                            <>
                              <button className="btn btn-teal btn-xs" onClick={() => handleOpenConfirm(appt)} title="Confirmer le créneau">
                                <Check size={14} /> Confirmer
                              </button>
                              <button className="btn btn-ghost btn-xs" onClick={() => handleCancel(appt.id)} style={{ color: '#dc2626' }} title="Annuler">
                                <XCircle size={14} />
                              </button>
                            </>
                          )}
                          {appt.status === 'confirmed' && (
                            <>
                              <button className="btn btn-teal btn-xs" onClick={() => handleComplete(appt.id)} title="Marquer comme réalisé">
                                <Check size={14} /> Réalisé
                              </button>
                              <button className="btn btn-ghost btn-xs" onClick={() => handleCancel(appt.id)} style={{ color: '#dc2626' }} title="Annuler">
                                <XCircle size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--slate-400)' }}>Aucun rendez-vous enregistré</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedAppt && (
        <div className="admin-modal-backdrop" onClick={() => setShowConfirmModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleConfirmSubmit}>
              <div className="admin-modal-header">
                <h3>Confirmer la planification du RDV</h3>
                <button className="admin-close-btn" type="button" onClick={() => setShowConfirmModal(false)}><XCircle size={18} /></button>
              </div>
              <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Date & Heure de réunion finale</label>
                  <input 
                    type="datetime-local" 
                    value={confirmedDate} 
                    onChange={e => setConfirmedDate(e.target.value)} 
                    className="admin-form-input" 
                    required 
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Lien de réunion (facultatif - ex: Zoom, Meet...)</label>
                  <input 
                    type="url" 
                    placeholder="https://meet.google.com/..." 
                    value={meetingLink} 
                    onChange={e => setMeetingLink(e.target.value)} 
                    className="admin-form-input" 
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Lieu physique (facultatif - ex: Bureau CCI...)</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Bureau de la CCI, Cotonou" 
                    value={meetingLocation} 
                    onChange={e => setMeetingLocation(e.target.value)} 
                    className="admin-form-input" 
                  />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button className="btn btn-ghost" type="button" onClick={() => setShowConfirmModal(false)}>Annuler</button>
                <button className="btn btn-teal" type="submit">Valider et Confirmer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
