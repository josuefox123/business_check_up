import React, { useState, useEffect } from 'react';
import { Calendar, User, Phone, Mail, Briefcase, Check, XCircle, ExternalLink, MapPin, RotateCcw, AlertCircle } from 'lucide-react';
import { AdministrationService } from '../../services/AdministrationService.js';

// Rule 7: Mapping complet des valeurs exactes de l'API vers des libellés lisibles
const RDV_TYPE_LABELS = {
  'urgent_stabilization': 'Stabilisation urgente',
  'project_framing': 'Cadrage projet',
  'opportunity_study': 'Étude d\'opportunité',
  'general_support': 'Accompagnement général',
  'financing_prep': 'Préparation financement',
};

const PRIORITY_LABELS = {
  'urgent': 'Urgent',
  'high': 'Haute',
  'normal': 'Normal',
};

export const RendezVousModule = ({ users }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [actionErrorMsg, setActionErrorMsg] = useState('');

  // Modal states for confirmation
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [confirmedDate, setConfirmedDate] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [meetingLocation, setMeetingLocation] = useState('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const loadAppointments = () => {
    setLoading(true);
    setErrorMsg('');
    AdministrationService.appointments.getAppointments()
      .then(data => {
        setAppointments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('[RendezVousModule] loadAppointments error:', err);
        setErrorMsg(err?.message ?? '[appointments_fetch_error] Impossible de charger les rendez-vous. Veuillez ré-essayer.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleOpenConfirm = (appt) => {
    setSelectedAppt(appt);
    setActionErrorMsg('');
    const dt = appt.requested_starts_at ? new Date(appt.requested_starts_at) : new Date();
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

  const handleConfirmSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppt || isSubmittingAction) return;

    setIsSubmittingAction(true);
    setActionErrorMsg('');
    const dateUtc = new Date(confirmedDate).toISOString();

    try {
      await AdministrationService.appointments.confirmAppointment(selectedAppt.id, dateUtc, meetingLink, meetingLocation);
      setShowConfirmModal(false);
      loadAppointments();
    } catch (err) {
      console.error('[RendezVousModule] confirmAppointment error:', err);
      setActionErrorMsg(err?.message ?? '[confirm_appointment_error] Échec de la confirmation du rendez-vous. Veuillez ré-essayer.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleCancel = async (id) => {
    setActionErrorMsg('');
    setIsSubmittingAction(true);
    try {
      await AdministrationService.appointments.cancelAppointment(id);
      loadAppointments();
    } catch (err) {
      console.error('[RendezVousModule] cancelAppointment error:', err);
      setActionErrorMsg(err?.message ?? '[cancel_appointment_error] Échec de l\'annulation du rendez-vous. Veuillez ré-essayer.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleComplete = async (id) => {
    setActionErrorMsg('');
    setIsSubmittingAction(true);
    try {
      await AdministrationService.appointments.completeAppointment(id);
      loadAppointments();
    } catch (err) {
      console.error('[RendezVousModule] completeAppointment error:', err);
      setActionErrorMsg(err?.message ?? '[complete_appointment_error] Échec de la clôture du rendez-vous. Veuillez ré-essayer.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // Rule 9: Normalisation des données avant le rendu
  // getUserInfo cherche d'abord dans la liste users passée en props
  // Si l'utilisateur est inconnu (diagnostic_run === null côté API), on affiche le user_id en fallback
  const getUserInfo = (appt) => {
    const userId = appt.user_id ?? null;
    const u = users?.find(user => user.id === userId || user.user_id === userId);
    if (u) return { name: u.name ?? u.full_name ?? '[name non disponible]', email: u.email ?? '', phone: u.phone ?? u.phone_number ?? '', companyName: u.companyName ?? u.business_name ?? '' };
    return { name: 'Entrepreneur inconnu', email: '', phone: '', companyName: '' };
  };



  const getRdvTypeLabel = (rdvType) =>
    RDV_TYPE_LABELS[rdvType] ?? rdvType ?? '[rdv_type non disponible]';

  const getPriorityLabel = (priority) =>
    PRIORITY_LABELS[priority] ?? priority ?? '[priority non disponible]';

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
        return <span className="admin-badge-severity faible">{status ?? '[status non disponible]'}</span>;
    }
  };

  return (
    <div className="admin-page animate-fade-up">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Rendez-vous</h1>
        <p className="admin-page-sub">Gérez et planifiez les rendez-vous d'accompagnement demandés par les entrepreneurs</p>
      </div>

      {/* Rule 4: Feedback contextuel d'erreur localisé */}
      {actionErrorMsg && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '12px 16px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.88rem', fontWeight: 600 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{actionErrorMsg}</span>
          </div>
          <button onClick={() => setActionErrorMsg('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991B1B', padding: '4px' }}>
            <XCircle size={16} />
          </button>
        </div>
      )}

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
        ) : errorMsg ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '16px 20px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600 }}>
            <span>{errorMsg}</span>
            <button onClick={loadAppointments} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '6px 12px', color: '#991B1B', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}>
              <RotateCcw size={14} /> Réessayer
            </button>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date &amp; Heure</th>
                  <th>Entrepreneur</th>
                  <th>Type &amp; Priorité</th>
                  <th>Question principale</th>
                  <th>Statut</th>
                  <th>Planification / Lieu</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(appt => {
                  // Rule 9: Normalisation des données au début du bloc map
                  const userInfo = getUserInfo(appt);
                  const rdvTypeLabel = getRdvTypeLabel(appt.rdv_type);
                  const priorityLabel = getPriorityLabel(appt.priority);
                  const dateToDisplay = appt.status === 'confirmed' ? appt.confirmed_starts_at : appt.requested_starts_at;
                  const formattedDate = dateToDisplay
                    ? new Date(dateToDisplay).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })
                    : '[requested_starts_at non disponible]';
                  const mainQuestion = appt.main_question ?? null;
                  const meetingLinkVal = appt.meeting_link ?? null;
                  const locationVal = appt.location ?? null;

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
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{userInfo.name}</div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px', fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                            {userInfo.email && <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={12} /> {userInfo.email}</div>}
                            {userInfo.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={12} /> {userInfo.phone}</div>}
                            {userInfo.companyName && <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: 'var(--color-teal)' }}><Briefcase size={12} /> {userInfo.companyName}</div>}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                          {rdvTypeLabel}
                          <div style={{ marginTop: '4px' }}>
                            {appt.priority === 'urgent' ? (
                              <span className="admin-badge-severity critique" style={{ fontSize: '0.66rem', padding: '2px 6px' }}>{priorityLabel}</span>
                            ) : (
                              <span className="admin-badge-severity faible" style={{ fontSize: '0.66rem', padding: '2px 6px', background: '#f1f5f9', color: '#64748b' }}>{priorityLabel}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td style={{ maxWidth: '240px' }}>
                        <div style={{ fontSize: '0.82rem', color: 'var(--slate-600)', fontStyle: mainQuestion ? 'normal' : 'italic' }}>
                          {mainQuestion ? `« ${mainQuestion} »` : 'Aucune question spécifiée'}
                        </div>
                      </td>
                      <td>{getStatusBadge(appt.status)}</td>
                      <td>
                        <div style={{ fontSize: '0.8rem', color: 'var(--slate-600)' }}>
                          {meetingLinkVal && (
                            <a href={meetingLinkVal} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-accent, #34BED5)', fontWeight: 600 }}>
                              <ExternalLink size={13} /> Lien Réunion
                            </a>
                          )}
                          {locationVal && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: meetingLinkVal ? '4px' : 0 }}>
                              <MapPin size={13} color="var(--slate-400)" /> {locationVal}
                            </div>
                          )}
                          {!meetingLinkVal && !locationVal && <span style={{ color: 'var(--slate-400)', fontStyle: 'italic' }}>—</span>}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          {appt.status === 'requested' && (
                            <>
                              <button className="btn btn-teal btn-xs" onClick={() => handleOpenConfirm(appt)} disabled={isSubmittingAction} style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title="Confirmer le créneau">
                                <Check size={14} /> Confirmer
                              </button>
                              <button className="btn btn-ghost btn-xs" onClick={() => handleCancel(appt.id)} disabled={isSubmittingAction} style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '4px' }} title="Annuler le rendez-vous">
                                <XCircle size={14} /> Annuler
                              </button>
                            </>
                          )}
                          {appt.status === 'confirmed' && (
                            <>
                              <button className="btn btn-teal btn-xs" onClick={() => handleComplete(appt.id)} disabled={isSubmittingAction} style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title="Marquer comme réalisé">
                                <Check size={14} /> Terminer
                              </button>
                              <button className="btn btn-ghost btn-xs" onClick={() => handleCancel(appt.id)} disabled={isSubmittingAction} style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '4px' }} title="Annuler le rendez-vous">
                                <XCircle size={14} /> Annuler
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

      {/* Modal de confirmation — Rule 4: Feedback contextuel localisé */}
      {showConfirmModal && selectedAppt && (
        <div className="admin-modal-backdrop" onClick={() => setShowConfirmModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <form onSubmit={handleConfirmSubmit}>
              <div className="admin-modal-header">
                <h3>Confirmer la planification du RDV</h3>
                <button className="admin-close-btn" type="button" onClick={() => setShowConfirmModal(false)}><XCircle size={18} /></button>
              </div>
              <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {actionErrorMsg && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                    <AlertCircle size={15} />
                    <span>{actionErrorMsg}</span>
                  </div>
                )}
                <div className="admin-form-group">
                  <label className="admin-form-label">Date &amp; Heure de réunion finale</label>
                  <input
                    type="datetime-local"
                    value={confirmedDate}
                    onChange={e => setConfirmedDate(e.target.value)}
                    className="admin-form-input"
                    required
                    disabled={isSubmittingAction}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Lien de réunion (facultatif — ex: Zoom, Meet...)</label>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/..."
                    value={meetingLink}
                    onChange={e => setMeetingLink(e.target.value)}
                    className="admin-form-input"
                    disabled={isSubmittingAction}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Lieu physique (facultatif — ex: Bureau CCI...)</label>
                  <input
                    type="text"
                    placeholder="Ex: Bureau de la CCI, Cotonou"
                    value={meetingLocation}
                    onChange={e => setMeetingLocation(e.target.value)}
                    className="admin-form-input"
                    disabled={isSubmittingAction}
                  />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button className="btn btn-ghost" type="button" onClick={() => setShowConfirmModal(false)} disabled={isSubmittingAction}>Annuler</button>
                <button className="btn btn-teal" type="submit" disabled={isSubmittingAction}>
                  {isSubmittingAction ? 'Confirmation...' : 'Valider et Confirmer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
