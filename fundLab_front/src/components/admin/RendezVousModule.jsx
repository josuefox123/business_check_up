import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Calendar,
  User,
  Phone,
  Mail,
  Briefcase,
  Check,
  XCircle,
  ExternalLink,
  MapPin,
  RotateCcw,
  AlertCircle,
  Download,
  Info,
  Search,
  Clock,
  Video,
  X,
  Building2,
} from 'lucide-react';
import { AdministrationService } from '../../services/AdministrationService.js';
import { exportToExcel } from '../../utils/exportToExcel.js';

// Rule 7: Mapping complet des valeurs exactes de l'API vers des libellés lisibles
const RDV_TYPE_LABELS = {
  'urgent_stabilization': 'Stabilisation urgente',
  'pwin_opportunity': 'Opportunité pWIN',
  'orientation': 'Orientation stratégique',
  'project_framing': 'Cadrage de projet',
  'opportunity_study': 'Étude d\'opportunité',
  'general_support': 'Accompagnement général',
  'financing_prep': 'Préparation au financement',
};

const PRIORITY_LABELS = {
  'urgent': 'Urgent',
  'high': 'Haute',
  'normal': 'Normal',
};

const USER_PROFILE_LABELS = {
  'structured_sme': 'PME structurée',
  'active_entrepreneur': 'Entrepreneur actif',
  'informal_sme': 'PME / Indépendant',
  'project_holder': 'Porteur de projet',
  'cooperative': 'Coopérative / Groupement',
  'opportunity_seeker': 'Recherche d\'opportunité',
  'distressed_business': 'Entreprise en difficulté',
};

// Modal de confirmation de rendez-vous avec createPortal pour centrage parfait
const ConfirmAppointmentModal = ({
  appt,
  confirmedDate,
  setConfirmedDate,
  meetingLink,
  setMeetingLink,
  meetingLocation,
  setMeetingLocation,
  isSubmittingAction,
  actionErrorMsg,
  onSubmit,
  onClose,
}) => {
  useEffect(() => {
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = orig;
    };
  }, []);

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: 'rgba(15, 23, 42, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '6px',
          borderTop: '4px solid #34BED5',
          maxWidth: '540px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.35)',
          padding: '24px 28px',
          boxSizing: 'border-box',
          fontFamily: 'Lato, -apple-system, BlinkMacSystemFont, sans-serif',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800, color: '#64748B' }}>
              Planification & Validation
            </div>
            <h3 style={{ margin: '4px 0 0', fontSize: '1.25rem', fontWeight: 900, color: '#17212D' }}>
              Confirmer le rendez-vous
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '6px',
              padding: '6px',
              cursor: 'pointer',
              color: '#64748B',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {actionErrorMsg && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              padding: '10px 14px',
              borderRadius: '6px',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: '16px',
            }}
          >
            <AlertCircle size={15} />
            <span>{actionErrorMsg}</span>
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#17212D', marginBottom: '5px' }}>
                Date &amp; Heure de l'entretien *
              </label>
              <input
                type="datetime-local"
                value={confirmedDate}
                onChange={(e) => setConfirmedDate(e.target.value)}
                required
                disabled={isSubmittingAction}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.84rem',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#17212D', marginBottom: '5px' }}>
                Lien de visioconférence (facultatif — Google Meet, Zoom...)
              </label>
              <input
                type="url"
                placeholder="https://meet.google.com/..."
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                disabled={isSubmittingAction}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.84rem',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#17212D', marginBottom: '5px' }}>
                Lieu physique de rencontre (facultatif — au sein du cabinet)
              </label>
              <input
                type="text"
                placeholder="Ex: Siège du cabinet / Salle de conseil"
                value={meetingLocation}
                onChange={(e) => setMeetingLocation(e.target.value)}
                disabled={isSubmittingAction}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.84rem',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmittingAction}
              style={{
                background: '#F1F5F9',
                color: '#475569',
                border: 'none',
                borderRadius: '6px',
                padding: '9px 16px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmittingAction}
              style={{
                background: '#0F7F90',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '9px 18px',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: isSubmittingAction ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {isSubmittingAction ? 'Validation en cours...' : 'Valider et Confirmer le créneau'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export const RendezVousModule = ({ users }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'requested' | 'confirmed' | 'completed' | 'cancelled'
  const [searchTerm, setSearchTerm] = useState('');
  const [actionErrorMsg, setActionErrorMsg] = useState('');

  // Modal confirmation states
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
      .then((data) => {
        setAppointments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('[RendezVousModule] loadAppointments error:', err);
        setErrorMsg(err?.message ?? 'Impossible de charger la liste des rendez-vous. Veuillez ré-essayer.');
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
      const localDt = new Date(dt.getTime() - offset * 60 * 1000);
      setConfirmedDate(localDt.toISOString().slice(0, 16));
    } catch {
      setConfirmedDate('');
    }
    setMeetingLink(appt.meeting_link ?? '');
    setMeetingLocation(appt.location ?? '');
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppt || isSubmittingAction) return;

    setIsSubmittingAction(true);
    setActionErrorMsg('');

    try {
      if (!confirmedDate) {
        throw new Error('Veuillez sélectionner une date et une heure valides.');
      }
      const parsedDate = new Date(confirmedDate);
      if (isNaN(parsedDate.getTime())) {
        throw new Error('La date sélectionnée est invalide.');
      }
      const dateUtc = parsedDate.toISOString();

      await AdministrationService.appointments.confirmAppointment(selectedAppt.id, dateUtc, meetingLink, meetingLocation);
      setShowConfirmModal(false);
      setSelectedAppt(null);
      loadAppointments();
    } catch (err) {
      const isAlreadyProcessed = err?.message?.includes('déjà traité');
      if (isAlreadyProcessed) {
        setShowConfirmModal(false);
        setSelectedAppt(null);
        loadAppointments();
      } else {
        console.error('[RendezVousModule] confirmAppointment error:', err);
      }
      setActionErrorMsg(err?.message ?? 'Échec de la confirmation du rendez-vous. Veuillez ré-essayer.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Voulez-vous vraiment annuler ce rendez-vous ?')) return;
    setActionErrorMsg('');
    setIsSubmittingAction(true);
    try {
      await AdministrationService.appointments.cancelAppointment(id);
      loadAppointments();
    } catch (err) {
      const isAlreadyProcessed = err?.message?.includes('déjà traité');
      if (isAlreadyProcessed) {
        loadAppointments();
      } else {
        console.error('[RendezVousModule] cancelAppointment error:', err);
      }
      setActionErrorMsg(err?.message ?? 'Échec de l\'annulation du rendez-vous. Veuillez ré-essayer.');
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
      const isAlreadyProcessed = err?.message?.includes('déjà traité');
      if (isAlreadyProcessed) {
        loadAppointments();
      } else {
        console.error('[RendezVousModule] completeAppointment error:', err);
      }
      setActionErrorMsg(err?.message ?? 'Échec de la clôture du rendez-vous. Veuillez ré-essayer.');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // ─── Normalisation des données (Rule 9 & Rule 7) ───────────────────────────
  const normalizedAppointments = appointments.map((appt) => {
    const apiUser = appt.user ?? null;
    let name = '[Nom non renseigné]';
    let email = null;
    let phone = null;
    let whatsapp = null;
    let companyName = null;
    let profileType = null;
    let channel = null;

    if (apiUser) {
      name = apiUser.full_name ?? apiUser.name ?? name;
      email = apiUser.email ?? null;
      phone = apiUser.phone_number ?? apiUser.phone ?? null;
      whatsapp = apiUser.whatsapp_number ?? null;
      companyName = apiUser.institution_name ?? apiUser.companyName ?? null;
      profileType = USER_PROFILE_LABELS[apiUser.user_profile_type] ?? apiUser.user_profile_type ?? null;
      channel = apiUser.preferred_contact_channel ?? null;
    } else {
      const u = users?.find((user) => user.id === appt.user_id || user.user_id === appt.user_id);
      if (u) {
        name = u.name ?? u.full_name ?? name;
        email = u.email ?? null;
        phone = u.phone ?? u.phone_number ?? null;
        whatsapp = u.whatsapp_number ?? null;
        companyName = u.companyName ?? u.business_name ?? null;
        profileType = USER_PROFILE_LABELS[u.user_profile_type] ?? u.user_profile_type ?? null;
        channel = u.preferred_contact_channel ?? null;
      }
    }

    const rdvTypeLabel = RDV_TYPE_LABELS[appt.rdv_type] ?? appt.rdv_type ?? 'Entretien';
    const priorityLabel = PRIORITY_LABELS[appt.priority] ?? appt.priority ?? 'Normal';
    const isUrgent = appt.priority === 'urgent' || appt.priority === 'high';

    const requestedDate = appt.requested_starts_at
      ? new Date(appt.requested_starts_at).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      : null;

    const confirmedDateDisplay = appt.confirmed_starts_at
      ? new Date(appt.confirmed_starts_at).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      : null;

    return {
      ...appt,
      name,
      email,
      phone,
      whatsapp,
      companyName,
      profileType,
      channel,
      rdvTypeLabel,
      priorityLabel,
      isUrgent,
      requestedDate,
      confirmedDateDisplay,
    };
  });

  // Compteurs par statut
  const totalCount = normalizedAppointments.length;
  const requestedCount = normalizedAppointments.filter((a) => a.status === 'requested').length;
  const confirmedCount = normalizedAppointments.filter((a) => a.status === 'confirmed').length;
  const completedCount = normalizedAppointments.filter((a) => a.status === 'completed').length;
  const cancelledCount = normalizedAppointments.filter((a) => a.status === 'cancelled').length;

  // Filtrage selon onglet et recherche
  const filtered = normalizedAppointments.filter((appt) => {
    if (statusFilter !== 'all' && appt.status !== statusFilter) return false;

    if (!searchTerm.trim()) return true;
    const term = searchTerm.trim().toLowerCase();
    return (
      appt.name.toLowerCase().includes(term) ||
      (appt.companyName && appt.companyName.toLowerCase().includes(term)) ||
      (appt.email && appt.email.toLowerCase().includes(term)) ||
      (appt.phone && appt.phone.toLowerCase().includes(term)) ||
      appt.rdvTypeLabel.toLowerCase().includes(term)
    );
  });

  const handleExport = () => {
    const headers = [
      'Date demandée',
      'Entrepreneur',
      'Entreprise',
      'Email',
      'Téléphone',
      'WhatsApp',
      'Type RDV',
      'Priorité',
      'Statut',
      'Date confirmée',
      'Lien réunion',
      'Lieu',
    ];
    const rows = filtered.map((appt) => {
      return [
        appt.requestedDate ?? '',
        appt.name,
        appt.companyName ?? '',
        appt.email ?? '',
        appt.phone ?? '',
        appt.whatsapp ?? '',
        appt.rdvTypeLabel,
        appt.priorityLabel,
        appt.status ?? '',
        appt.confirmedDateDisplay ?? '',
        appt.meeting_link ?? '',
        appt.location ?? '',
      ];
    });
    exportToExcel([headers, ...rows], 'rendezvous_export');
  };

  return (
    <div
      className="admin-page animate-fade-up"
      style={{
        fontFamily: 'Lato, -apple-system, BlinkMacSystemFont, sans-serif',
        paddingBottom: '40px',
      }}
    >
      {/* ── En-tête de page ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid #E2E8F0',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1
              style={{
                margin: 0,
                fontSize: '1.65rem',
                fontWeight: 900,
                color: '#17212D',
                letterSpacing: '-0.02em',
              }}
            >
              Rendez-vous &amp; Accompagnement
            </h1>
            <span
              style={{
                background: '#17212D',
                color: '#FFFFFF',
                fontSize: '0.78rem',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '6px',
              }}
            >
              {totalCount} rendez-vous
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '0.88rem' }}>
            Registre des demandes d'entretien et de cadrage prises par les dirigeants auprès du cabinet.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={loadAppointments}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#17212D',
              fontWeight: 700,
              fontSize: '0.82rem',
              padding: '8px 14px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            <RotateCcw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Actualiser
          </button>

          <button
            type="button"
            onClick={handleExport}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '6px',
              border: 'none',
              background: '#0F7F90',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.82rem',
              padding: '8px 14px',
              cursor: 'pointer',
            }}
            title="Exporter en Excel"
          >
            <Download size={14} /> Exporter Excel
          </button>
        </div>
      </div>

      {/* ── Cadrage méthodologique & Guide de lecture ── */}
      <div
        style={{
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderLeft: '4px solid #0F7F90',
          borderRadius: '6px',
          padding: '14px 18px',
          marginBottom: '20px',
          display: 'flex',
          gap: '14px',
          alignItems: 'flex-start',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: '#E0F2FE',
            color: '#0F7F90',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '2px',
          }}
        >
          <Info size={16} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#17212D' }}>
              Guide de suivi des rendez-vous
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                background: '#E2E8F0',
                color: '#475569',
                padding: '1px 6px',
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
              }}
            >
              Cadrage opérationnel
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
            Cet espace centralise les demandes d'entretien et d'accompagnement direct formulées par les entreprises.
            Chaque demande détaille le profil du dirigeant, l'objet de l'échange et son degré d'urgence.
            Vous pouvez confirmer la date définitive (au cabinet ou en visioconférence) puis clôturer les entretiens une fois réalisés.
          </p>
        </div>
      </div>

      {/* ── Alerte d'action localisée ── */}
      {actionErrorMsg && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#991B1B',
            padding: '12px 16px',
            borderRadius: '6px',
            marginBottom: '16px',
            fontSize: '0.84rem',
            fontWeight: 600,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{actionErrorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionErrorMsg('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991B1B', padding: '4px' }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* ── Filtres de segmentation & Recherche ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        {/* Onglets de filtrage par statut */}
        <div
          style={{
            display: 'inline-flex',
            background: '#F1F5F9',
            padding: '3px',
            borderRadius: '6px',
            gap: '2px',
          }}
        >
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            style={{
              border: 'none',
              background: statusFilter === 'all' ? '#17212D' : 'transparent',
              color: statusFilter === 'all' ? '#FFFFFF' : '#475569',
              fontWeight: statusFilter === 'all' ? 800 : 600,
              fontSize: '0.82rem',
              padding: '6px 14px',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Tous</span>
            <span style={{ fontSize: '0.72rem', background: statusFilter === 'all' ? 'rgba(255,255,255,0.2)' : '#E2E8F0', padding: '1px 6px', borderRadius: '4px' }}>
              {totalCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('requested')}
            style={{
              border: 'none',
              background: statusFilter === 'requested' ? '#17212D' : 'transparent',
              color: statusFilter === 'requested' ? '#FFFFFF' : '#475569',
              fontWeight: statusFilter === 'requested' ? 800 : 600,
              fontSize: '0.82rem',
              padding: '6px 14px',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Demandés</span>
            <span style={{ fontSize: '0.72rem', background: statusFilter === 'requested' ? '#D97706' : '#FEF3C7', color: statusFilter === 'requested' ? '#FFFFFF' : '#92400E', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
              {requestedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('confirmed')}
            style={{
              border: 'none',
              background: statusFilter === 'confirmed' ? '#17212D' : 'transparent',
              color: statusFilter === 'confirmed' ? '#FFFFFF' : '#475569',
              fontWeight: statusFilter === 'confirmed' ? 800 : 600,
              fontSize: '0.82rem',
              padding: '6px 14px',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Confirmés</span>
            <span style={{ fontSize: '0.72rem', background: statusFilter === 'confirmed' ? '#0284C7' : '#E0F2FE', color: statusFilter === 'confirmed' ? '#FFFFFF' : '#0369A1', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
              {confirmedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('completed')}
            style={{
              border: 'none',
              background: statusFilter === 'completed' ? '#17212D' : 'transparent',
              color: statusFilter === 'completed' ? '#FFFFFF' : '#475569',
              fontWeight: statusFilter === 'completed' ? 800 : 600,
              fontSize: '0.82rem',
              padding: '6px 14px',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Réalisés</span>
            <span style={{ fontSize: '0.72rem', background: statusFilter === 'completed' ? '#059669' : '#DCFCE7', color: statusFilter === 'completed' ? '#FFFFFF' : '#166534', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
              {completedCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('cancelled')}
            style={{
              border: 'none',
              background: statusFilter === 'cancelled' ? '#17212D' : 'transparent',
              color: statusFilter === 'cancelled' ? '#FFFFFF' : '#475569',
              fontWeight: statusFilter === 'cancelled' ? 800 : 600,
              fontSize: '0.82rem',
              padding: '6px 14px',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Annulés</span>
            <span style={{ fontSize: '0.72rem', background: statusFilter === 'cancelled' ? '#64748B' : '#E2E8F0', color: statusFilter === 'cancelled' ? '#FFFFFF' : '#475569', padding: '1px 6px', borderRadius: '4px' }}>
              {cancelledCount}
            </span>
          </button>
        </div>

        {/* Champ de recherche */}
        <div style={{ position: 'relative', width: '320px' }}>
          <Search
            size={15}
            color="#94A3B8"
            style={{
              position: 'absolute',
              left: '11px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
          />
          <input
            type="text"
            placeholder="Rechercher dirigeant, entreprise, objet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '34px',
              paddingRight: '12px',
              height: '36px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              outline: 'none',
              fontSize: '0.82rem',
              background: '#FFFFFF',
              color: '#17212D',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* ── Table des Rendez-vous ── */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '6px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8', fontSize: '0.88rem' }}>
            <RotateCcw size={22} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 10px', display: 'block', color: '#0F7F90' }} />
            Chargement des rendez-vous...
          </div>
        ) : errorMsg ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              padding: '16px 20px',
              margin: '16px',
              borderRadius: '6px',
              fontSize: '0.86rem',
              fontWeight: 600,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={loadAppointments}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#FFFFFF',
                border: '1px solid #FCA5A5',
                borderRadius: '6px',
                padding: '6px 12px',
                color: '#991B1B',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.8rem',
              }}
            >
              <RotateCcw size={13} /> Réessayer
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 800 }}>Date &amp; Créneau</th>
                  <th style={{ padding: '12px 16px', fontWeight: 800 }}>Entreprise &amp; Dirigeant</th>
                  <th style={{ padding: '12px 16px', fontWeight: 800 }}>Objet &amp; Urgence</th>
                  <th style={{ padding: '12px 16px', fontWeight: 800 }}>Statut &amp; Lieu</th>
                  <th style={{ padding: '12px 16px', fontWeight: 800, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((appt) => {
                  return (
                    <tr
                      key={appt.id}
                      style={{
                        borderBottom: '1px solid #E2E8F0',
                        background: '#FFFFFF',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      {/* 1. Date & Créneau */}
                      <td style={{ padding: '14px 16px', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                        {appt.status === 'confirmed' && appt.confirmedDateDisplay ? (
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, color: '#0F7F90', fontSize: '0.86rem' }}>
                              <Calendar size={14} color="#0F7F90" />
                              <span>{appt.confirmedDateDisplay}</span>
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#0284C7', fontWeight: 700, background: '#E0F2FE', padding: '1px 6px', borderRadius: '4px', marginTop: '3px', display: 'inline-block' }}>
                              Confirmé
                            </span>
                          </div>
                        ) : (
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#17212D', fontSize: '0.84rem' }}>
                              <Calendar size={14} color="#94A3B8" />
                              <span>{appt.requestedDate || 'Date non précisée'}</span>
                            </div>
                            <span style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '3px', display: 'inline-block' }}>
                              Créneau souhaité
                            </span>
                          </div>
                        )}
                      </td>

                      {/* 2. Entreprise & Dirigeant */}
                      <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                        <div>
                          {appt.companyName && (
                            <div style={{ fontWeight: 800, color: '#17212D', fontSize: '0.88rem' }}>
                              {appt.companyName}
                            </div>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px', fontWeight: 700, color: '#334155', fontSize: '0.82rem' }}>
                            <User size={13} color="#0F7F90" /> {appt.name}
                          </div>
                          {appt.profileType && (
                            <span style={{ display: 'inline-block', fontSize: '0.68rem', fontWeight: 600, color: '#475569', background: '#F1F5F9', padding: '1px 6px', borderRadius: '4px', marginTop: '3px' }}>
                              {appt.profileType}
                            </span>
                          )}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px', fontSize: '0.76rem', color: '#64748B' }}>
                            {appt.email && (
                              <a href={`mailto:${appt.email}`} style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <Mail size={12} color="#94A3B8" /> {appt.email}
                              </a>
                            )}
                            {appt.phone && (
                              <a href={`tel:${appt.phone}`} style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <Phone size={12} color="#94A3B8" /> {appt.phone}
                              </a>
                            )}
                            {appt.whatsapp && (
                              <span style={{ color: '#059669', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <Phone size={12} /> WA: {appt.whatsapp}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* 3. Objet & Urgence */}
                      <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                        <div>
                          <div style={{ fontWeight: 800, color: '#17212D', fontSize: '0.84rem' }}>
                            {appt.rdvTypeLabel}
                          </div>
                          <div style={{ marginTop: '4px' }}>
                            <span
                              style={{
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                padding: '2px 7px',
                                borderRadius: '4px',
                                background: appt.priority === 'urgent' ? '#FEF2F2' : appt.priority === 'high' ? '#FFFBEB' : '#F1F5F9',
                                color: appt.priority === 'urgent' ? '#DC2626' : appt.priority === 'high' ? '#D97706' : '#475569',
                                border: `1px solid ${appt.priority === 'urgent' ? '#FECACA' : appt.priority === 'high' ? '#FDE68A' : '#E2E8F0'}`,
                              }}
                            >
                              Priorité : {appt.priorityLabel}
                            </span>
                          </div>
                          {appt.main_question && (
                            <p style={{ margin: '6px 0 0', fontSize: '0.76rem', color: '#64748B', fontStyle: 'italic', lineHeight: 1.4 }}>
                              « {appt.main_question} »
                            </p>
                          )}
                        </div>
                      </td>

                      {/* 4. Statut & Lieu */}
                      <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                        <div>
                          {appt.status === 'requested' && (
                            <span style={{ background: '#FFFBEB', color: '#92400E', fontWeight: 800, fontSize: '0.74rem', padding: '3px 8px', borderRadius: '4px', border: '1px solid #FDE68A', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={12} /> Demandé
                            </span>
                          )}
                          {appt.status === 'confirmed' && (
                            <span style={{ background: '#E0F2FE', color: '#0369A1', fontWeight: 800, fontSize: '0.74rem', padding: '3px 8px', borderRadius: '4px', border: '1px solid #BAE6FD', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Check size={12} /> Confirmé
                            </span>
                          )}
                          {appt.status === 'completed' && (
                            <span style={{ background: '#DCFCE7', color: '#166534', fontWeight: 800, fontSize: '0.74rem', padding: '3px 8px', borderRadius: '4px', border: '1px solid #BBF7D0', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Check size={12} /> Réalisé
                            </span>
                          )}
                          {appt.status === 'cancelled' && (
                            <span style={{ background: '#F1F5F9', color: '#64748B', fontWeight: 700, fontSize: '0.74rem', padding: '3px 8px', borderRadius: '4px', border: '1px solid #E2E8F0', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <XCircle size={12} /> Annulé
                            </span>
                          )}

                          <div style={{ marginTop: '6px', fontSize: '0.76rem', color: '#475569' }}>
                            {appt.meeting_link && (
                              <div>
                                <a
                                  href={appt.meeting_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: '#0F7F90', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                >
                                  <Video size={13} /> Visioconférence <ExternalLink size={11} />
                                </a>
                              </div>
                            )}
                            {appt.location && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', color: '#64748B' }}>
                                <MapPin size={12} color="#94A3B8" /> {appt.location}
                              </div>
                            )}
                            {!appt.meeting_link && !appt.location && appt.status === 'requested' && (
                              <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Lieu à définir à la confirmation</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* 5. Actions */}
                      <td style={{ padding: '14px 16px', verticalAlign: 'top', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                          {appt.status === 'requested' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenConfirm(appt)}
                                disabled={isSubmittingAction}
                                style={{
                                  background: '#0F7F90',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '6px 12px',
                                  fontSize: '0.76rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                                title="Définir la date et confirmer le rendez-vous"
                              >
                                <Check size={13} /> Confirmer
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCancel(appt.id)}
                                disabled={isSubmittingAction}
                                style={{
                                  background: '#FFFFFF',
                                  color: '#DC2626',
                                  border: '1px solid #FECACA',
                                  borderRadius: '6px',
                                  padding: '6px 10px',
                                  fontSize: '0.76rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                }}
                                title="Annuler le rendez-vous"
                              >
                                Annuler
                              </button>
                            </>
                          )}

                          {appt.status === 'confirmed' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleComplete(appt.id)}
                                disabled={isSubmittingAction}
                                style={{
                                  background: '#166534',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '6px 12px',
                                  fontSize: '0.76rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                                title="Marquer le rendez-vous comme réalisé"
                              >
                                <Check size={13} /> Clôturer
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCancel(appt.id)}
                                disabled={isSubmittingAction}
                                style={{
                                  background: '#FFFFFF',
                                  color: '#DC2626',
                                  border: '1px solid #FECACA',
                                  borderRadius: '6px',
                                  padding: '6px 10px',
                                  fontSize: '0.76rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                }}
                                title="Annuler le rendez-vous"
                              >
                                Annuler
                              </button>
                            </>
                          )}

                          {(appt.status === 'completed' || appt.status === 'cancelled') && (
                            <span style={{ fontSize: '0.74rem', color: '#94A3B8', fontStyle: 'italic' }}>
                              Dossier clos
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
                      Aucun rendez-vous ne correspond aux critères sélectionnés.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal de Confirmation (via createPortal) ── */}
      {showConfirmModal && selectedAppt && (
        <ConfirmAppointmentModal
          appt={selectedAppt}
          confirmedDate={confirmedDate}
          setConfirmedDate={setConfirmedDate}
          meetingLink={meetingLink}
          setMeetingLink={setMeetingLink}
          meetingLocation={meetingLocation}
          setMeetingLocation={setMeetingLocation}
          isSubmittingAction={isSubmittingAction}
          actionErrorMsg={actionErrorMsg}
          onSubmit={handleConfirmSubmit}
          onClose={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};
