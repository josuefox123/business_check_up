import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Search,
  Info,
  X,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Download,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { EntrepriseService } from '../../services/EntrepriseService.js';
import { exportToExcel } from '../../utils/exportToExcel.js';

// Rule 7: Mapping exact des valeurs API vers libellés français
const ACTIVITY_STAGE_LABELS = {
  'not_launched': 'Non lancée',
  'launched': 'En activité',
  'growth': 'En croissance',
  'restructuring': 'En restructuration',
  'structured_activity': 'Activité structurée',
  'occasional_sales': 'Ventes occasionnelles',
  'regular_sales': 'Ventes régulières',
  'declining_sales': 'Ventes en baisse',
  'project': 'En projet',
  'pre_launch': 'Pré-lancement',
  'stagnant': 'Activité stagnante',
  'pivot': 'En repositionnement',
};

const USER_PROFILE_LABELS = {
  'structured_sme': 'PME structurée',
  'informal_sme': 'PME / Indépendant',
  'opportunity_seeker': 'Chercheur d\'opportunité',
  'project_holder': 'Porteur de projet',
  'cooperative': 'Coopérative / Groupement',
  'entrepreneur': 'Entrepreneur',
  'individual': 'Particulier',
  'active_entrepreneur': 'Entrepreneur actif',
};

const MODULE_NAMES = {
  'FLH-01': 'Flash Diagnostic',
  'PRJ-02': 'Diagnostic Projet',
  'DIF-03': 'Difficultés & Restructuration',
  'OPP-04': 'Opportunités & Croissance',
  'PRO-05': 'Produits & Offre',
  'COM-06': 'Commercial & Marché',
  'FIN-07': 'Finance & Stratégie',
  'GOV-08': 'Gouvernance & Organisation',
  '360-09': 'Diagnostic Global 360°',
};

const formatActivityStage = (stage) => {
  if (!stage) return null;
  return ACTIVITY_STAGE_LABELS[stage] ?? stage;
};

const formatUserProfile = (profile) => {
  if (!profile) return null;
  return USER_PROFILE_LABELS[profile] ?? profile;
};

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const CompanyProfileModal = ({ pme, onClose }) => {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const user = pme.user ?? null;

  const fields = [
    pme.legal_status && { label: 'Statut légal', value: pme.legal_status },
    pme.maturity_phase && { label: 'Phase de maturité', value: pme.maturity_phase },
    pme.employee_count_range && { label: 'Effectif', value: `${pme.employee_count_range} employés` },
    pme.monthly_revenue_range_xof && { label: 'CA mensuel', value: `${pme.monthly_revenue_range_xof} FCFA` },
    pme.ca_n_1 && { label: 'CA N-1', value: pme.ca_n_1 },
    pme.ca_m_1 && { label: 'CA M-1', value: pme.ca_m_1 },
    pme.customer_type && { label: 'Clients cibles', value: pme.customer_type },
    pme.sales_channel_main && { label: 'Canal de vente principal', value: pme.sales_channel_main },
    pme.years_in_activity != null && { label: 'Années d\'activité', value: `${pme.years_in_activity} an(s)` },
    pme.description && { label: 'Description', value: pme.description },
    user?.preferred_contact_channel && { label: 'Canal de contact préféré', value: user.preferred_contact_channel },
    user?.user_profile_type && { label: 'Profil déclarant', value: formatUserProfile(user.user_profile_type) },
  ].filter(Boolean);

  const docs = [];
  if (pme.ifu_available != null) docs.push({ label: 'IFU', ok: Boolean(pme.ifu_available) });
  if (pme.rccm_available != null) docs.push({ label: 'RCCM', ok: Boolean(pme.rccm_available) });
  if (pme.bank_account_available != null) docs.push({ label: 'Compte bancaire', ok: Boolean(pme.bank_account_available) });

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
          maxWidth: '560px',
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.35)',
          padding: '24px 28px',
          boxSizing: 'border-box',
          fontFamily: 'Lato, -apple-system, BlinkMacSystemFont, sans-serif',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800, color: '#64748B' }}>
              Fiche Entreprise
            </div>
            <h3 style={{ margin: '4px 0 0', fontSize: '1.25rem', fontWeight: 900, color: '#17212D' }}>
              {pme.business_name || '[Entreprise sans nom]'}
            </h3>
            {pme.sector && (
              <div style={{ fontSize: '0.82rem', color: '#0F7F90', fontWeight: 700, marginTop: '2px' }}>
                {pme.sector} {pme.sub_sector ? `• ${pme.sub_sector}` : ''}
              </div>
            )}
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Coordonnées déclarant */}
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '12px 14px', marginBottom: '16px' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
            Coordonnées du dirigeant / déclarant
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.82rem' }}>
            <div style={{ fontWeight: 700, color: '#17212D' }}>
              {user?.full_name || '[Nom non renseigné]'}
            </div>
            {user?.email && (
              <div style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={13} color="#94A3B8" /> {user.email}
              </div>
            )}
            {user?.phone_number && (
              <div style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={13} color="#94A3B8" /> {user.phone_number}
              </div>
            )}
            {user?.whatsapp_number && (
              <div style={{ color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={13} /> WhatsApp: {user.whatsapp_number}
              </div>
            )}
          </div>
        </div>

        {/* Détails d'activité */}
        {fields.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '2px' }}>
              Caractéristiques économiques
            </div>
            {fields.map((f, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '8px', fontSize: '0.8rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '6px' }}>
                <span style={{ color: '#64748B', fontWeight: 600 }}>{f.label}</span>
                <span style={{ color: '#17212D', fontWeight: 700, wordBreak: 'break-word' }}>{f.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Formalisation */}
        {docs.length > 0 && (
          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '12px', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '8px' }}>
              Statut de formalisation
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {docs.map((d, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: '4px',
                    background: d.ok ? '#ECFDF5' : '#FEF2F2',
                    color: d.ok ? '#065F46' : '#991B1B',
                    border: `1px solid ${d.ok ? '#A7F3D0' : '#FECACA'}`,
                  }}
                >
                  {d.ok ? <CheckCircle2 size={13} /> : <XCircle size={13} />} {d.label} : {d.ok ? 'Disponible' : 'Non renseigné'}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            padding: '10px',
            background: '#17212D',
            color: '#FFFFFF',
            borderRadius: '6px',
            border: 'none',
            fontWeight: 800,
            fontSize: '0.84rem',
            cursor: 'pointer',
          }}
        >
          Fermer la fiche
        </button>
      </div>
    </div>,
    document.body
  );
};

export const PmeModule = () => {
  const navigate = useNavigate();
  const [pmes, setPmes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusTab, setStatusTab] = useState('all'); // 'all' | 'with_diags' | 'without_diags'
  const [selectedPmeForModal, setSelectedPmeForModal] = useState(null);
  const [expandedPmeId, setExpandedPmeId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const loadPmes = () => {
    setLoading(true);
    setErrorMsg('');
    EntrepriseService.getEnterprises()
      .then((data) => {
        setPmes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('[PmeModule] Error loading PMEs:', err);
        setErrorMsg('[pmes_fetch_error] Impossible de charger le répertoire des entreprises. Veuillez ré-essayer.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadPmes();
  }, []);

  // ─── Normalisation des données (Rule 9 & Rule 7) ───────────────────────────
  const normalizedPmes = pmes.map((pme, idx) => {
    const pmeId = pme.business_id ?? pme.id ?? `PME-${idx}`;
    const name = pme.business_name || '[Entreprise sans nom]';
    const sector = pme.sector || null;
    const subSector = pme.sub_sector || null;
    const region = pme.region || null;
    const commune = pme.commune || null;
    const country = pme.country || 'Bénin';
    const user = pme.user ?? null;
    const contactName = user?.full_name ?? null;
    const contactEmail = user?.email ?? null;
    const contactPhone = user?.phone_number ?? null;
    const contactWhatsapp = user?.whatsapp_number ?? null;
    const userProfileLabel = formatUserProfile(user?.user_profile_type);
    const activityStageLabel = formatActivityStage(pme.activity_stage);

    // Filtrage strict : exclure le module de pré-qualification TRI-00
    const rawRuns = Array.isArray(pme.diagnostic_runs) ? pme.diagnostic_runs : [];
    const validRuns = rawRuns.filter((r) => r.module_code !== 'TRI-00');
    const runsCount = validRuns.length;
    const completedRuns = validRuns.filter((r) => r.completion_status === 'completed');
    const inProgressRuns = validRuns.filter((r) => r.completion_status !== 'completed');
    const hasDiagnostics = runsCount > 0;

    return {
      ...pme,
      pmeId,
      name,
      sector,
      subSector,
      region,
      commune,
      country,
      contactName,
      contactEmail,
      contactPhone,
      contactWhatsapp,
      userProfileLabel,
      activityStageLabel,
      validRuns,
      runsCount,
      completedCount: completedRuns.length,
      inProgressCount: inProgressRuns.length,
      hasDiagnostics,
    };
  });

  // Compteurs pour la segmentation
  const totalCount = normalizedPmes.length;
  const withDiagsCount = normalizedPmes.filter((p) => p.hasDiagnostics).length;
  const withoutDiagsCount = normalizedPmes.filter((p) => !p.hasDiagnostics).length;

  // Filtrage selon onglet et recherche textuelle
  const filteredPmes = normalizedPmes.filter((pme) => {
    if (statusTab === 'with_diags' && !pme.hasDiagnostics) return false;
    if (statusTab === 'without_diags' && pme.hasDiagnostics) return false;

    if (!searchTerm.trim()) return true;
    const term = searchTerm.trim().toLowerCase();
    return (
      pme.name.toLowerCase().includes(term) ||
      (pme.sector && pme.sector.toLowerCase().includes(term)) ||
      (pme.region && pme.region.toLowerCase().includes(term)) ||
      (pme.commune && pme.commune.toLowerCase().includes(term)) ||
      (pme.contactName && pme.contactName.toLowerCase().includes(term)) ||
      (pme.contactEmail && pme.contactEmail.toLowerCase().includes(term)) ||
      (pme.contactPhone && pme.contactPhone.toLowerCase().includes(term))
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredPmes.length / itemsPerPage));
  const paginatedPmes = filteredPmes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleTabChange = (newTab) => {
    setStatusTab(newTab);
    setCurrentPage(1);
    setExpandedPmeId(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    setExpandedPmeId(null);
  };

  const handleExport = () => {
    const headers = [
      'Nom Entreprise',
      'Contact Nom',
      'Email',
      'Téléphone',
      'WhatsApp',
      'Secteur',
      'Sous-secteur',
      'Région',
      'Commune',
      'Pays',
      'Stade d\'activité',
      'Diagnostics Totaux',
      'Diagnostics Finalisés',
      'Diagnostics En cours',
      'Statut légal',
      'Effectif',
      'CA mensuel (FCFA)',
      'Années d\'activité',
      'IFU',
      'RCCM',
      'Compte bancaire',
    ];
    const rows = filteredPmes.map((p) => {
      return [
        p.name,
        p.contactName ?? '',
        p.contactEmail ?? '',
        p.contactPhone ?? '',
        p.contactWhatsapp ?? '',
        p.sector ?? '',
        p.subSector ?? '',
        p.region ?? '',
        p.commune ?? '',
        p.country ?? '',
        p.activityStageLabel ?? '',
        p.runsCount,
        p.completedCount,
        p.inProgressCount,
        p.legal_status ?? '',
        p.employee_count_range ?? '',
        p.monthly_revenue_range_xof ?? '',
        p.years_in_activity != null ? String(p.years_in_activity) : '',
        p.ifu_available ? 'Oui' : 'Non',
        p.rccm_available ? 'Oui' : 'Non',
        p.bank_account_available ? 'Oui' : 'Non',
      ];
    });
    exportToExcel([headers, ...rows], 'repertoire_entreprises_pme');
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
              Répertoire des Entreprises (PME)
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
              {totalCount} entreprises
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '0.88rem' }}>
            Suivi des entreprises identifiées lors des étapes de pré-qualification, d'orientation et de diagnostic.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={loadPmes}
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
            title="Exporter la sélection en Excel"
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
              Guide de lecture du répertoire
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
            Ce répertoire recense l'ensemble des entreprises enregistrées sur la plateforme. Une entreprise (fiche PME) est initialisée dès le formulaire de triage ou d'orientation, même si elle n'a pas encore validé de questionnaire thématique.
            Utilisez les filtres ci-dessous pour distinguer les entreprises ayant des <strong>diagnostics actifs</strong> de celles <strong>inscrites sans diagnostic</strong>.
            Cliquez sur l'indicateur d'activité diagnostic d'une entreprise pour dérouler directement ses parcours et accéder à ses bilans.
          </p>
        </div>
      </div>

      {/* ── Filtres de segmentation (Tabs discrets + Recherche textuelle) ── */}
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
        {/* Tabs de segmentation */}
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
            onClick={() => handleTabChange('all')}
            style={{
              border: 'none',
              background: statusTab === 'all' ? '#17212D' : 'transparent',
              color: statusTab === 'all' ? '#FFFFFF' : '#475569',
              fontWeight: statusTab === 'all' ? 800 : 600,
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
            <span>Toutes les entreprises</span>
            <span
              style={{
                fontSize: '0.72rem',
                background: statusTab === 'all' ? 'rgba(255,255,255,0.2)' : '#E2E8F0',
                padding: '1px 6px',
                borderRadius: '4px',
              }}
            >
              {totalCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('with_diags')}
            style={{
              border: 'none',
              background: statusTab === 'with_diags' ? '#17212D' : 'transparent',
              color: statusTab === 'with_diags' ? '#FFFFFF' : '#475569',
              fontWeight: statusTab === 'with_diags' ? 800 : 600,
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
            <span>Avec diagnostics actifs</span>
            <span
              style={{
                fontSize: '0.72rem',
                background: statusTab === 'with_diags' ? '#059669' : '#DCFCE7',
                color: statusTab === 'with_diags' ? '#FFFFFF' : '#166534',
                padding: '1px 6px',
                borderRadius: '4px',
                fontWeight: 700,
              }}
            >
              {withDiagsCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('without_diags')}
            style={{
              border: 'none',
              background: statusTab === 'without_diags' ? '#17212D' : 'transparent',
              color: statusTab === 'without_diags' ? '#FFFFFF' : '#475569',
              fontWeight: statusTab === 'without_diags' ? 800 : 600,
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
            <span>Sans diagnostic initié</span>
            <span
              style={{
                fontSize: '0.72rem',
                background: statusTab === 'without_diags' ? '#D97706' : '#FEF3C7',
                color: statusTab === 'without_diags' ? '#FFFFFF' : '#92400E',
                padding: '1px 6px',
                borderRadius: '4px',
                fontWeight: 700,
              }}
            >
              {withoutDiagsCount}
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
            placeholder="Rechercher PME, dirigeant, secteur..."
            value={searchTerm}
            onChange={handleSearchChange}
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

      {/* ── Table des Entreprises ── */}
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
            Chargement du répertoire des entreprises...
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
              onClick={loadPmes}
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
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 800 }}>Entreprise</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800 }}>Contact / Dirigeant</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800 }}>Secteur & Localisation</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800 }}>Activité Diagnostics</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPmes.map((pme) => {
                    const isExpanded = expandedPmeId === pme.pmeId;

                    return (
                      <React.Fragment key={pme.pmeId}>
                        <tr
                          style={{
                            borderBottom: '1px solid #E2E8F0',
                            background: isExpanded ? '#F0FCFF' : '#FFFFFF',
                            transition: 'background 0.15s ease',
                          }}
                        >
                          {/* 1. Entreprise */}
                          <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                            <div>
                              <div style={{ fontWeight: 800, color: '#17212D', fontSize: '0.88rem' }}>
                                {pme.name}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                                {pme.year_created && (
                                  <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                                    Créée en {pme.year_created}
                                  </span>
                                )}
                                {pme.activityStageLabel && (
                                  <span
                                    style={{
                                      background: '#E0F2FE',
                                      color: '#0369A1',
                                      fontWeight: 700,
                                      fontSize: '0.68rem',
                                      padding: '1px 6px',
                                      borderRadius: '4px',
                                    }}
                                  >
                                    {pme.activityStageLabel}
                                  </span>
                                )}
                                {pme.ifu_available && (
                                  <span
                                    style={{
                                      background: '#ECFDF5',
                                      color: '#065F46',
                                      fontWeight: 700,
                                      fontSize: '0.68rem',
                                      padding: '1px 5px',
                                      borderRadius: '3px',
                                    }}
                                  >
                                    IFU ✓
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* 2. Contact / Dirigeant */}
                          <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                            {pme.contactName || pme.contactEmail || pme.contactPhone ? (
                              <div>
                                {pme.contactName && (
                                  <div style={{ fontWeight: 700, color: '#17212D', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <User size={13} color="#0F7F90" /> {pme.contactName}
                                  </div>
                                )}
                                {pme.userProfileLabel && (
                                  <div
                                    style={{
                                      fontSize: '0.7rem',
                                      color: '#475569',
                                      background: '#F1F5F9',
                                      padding: '1px 6px',
                                      borderRadius: '4px',
                                      width: 'fit-content',
                                      marginTop: '3px',
                                      fontWeight: 600,
                                    }}
                                  >
                                    {pme.userProfileLabel}
                                  </div>
                                )}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '4px', fontSize: '0.76rem', color: '#64748B' }}>
                                  {pme.contactEmail && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                      <Mail size={12} color="#94A3B8" />
                                      <a href={`mailto:${pme.contactEmail}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                        {pme.contactEmail}
                                      </a>
                                    </div>
                                  )}
                                  {pme.contactPhone && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                      <Phone size={12} color="#94A3B8" />
                                      <a href={`tel:${pme.contactPhone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                        {pme.contactPhone}
                                      </a>
                                    </div>
                                  )}
                                  {pme.contactWhatsapp && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#059669', fontWeight: 700 }}>
                                      <Phone size={12} /> WA: {pme.contactWhatsapp}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontStyle: 'italic' }}>
                                Coordonnées non renseignées
                              </span>
                            )}
                          </td>

                          {/* 3. Secteur & Localisation */}
                          <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                            <div>
                              <div style={{ fontWeight: 700, color: '#17212D', fontSize: '0.82rem' }}>
                                {pme.sector || '[Secteur non spécifié]'}
                              </div>
                              {pme.subSector && (
                                <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '1px' }}>
                                  {pme.subSector}
                                </div>
                              )}
                              {(pme.commune || pme.region) && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', color: '#64748B', marginTop: '4px' }}>
                                  <MapPin size={12} color="#94A3B8" />
                                  {[pme.commune, pme.region].filter(Boolean).join(', ')}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* 4. Activité Diagnostics (unifié et interactif) */}
                          <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                            {pme.hasDiagnostics ? (
                              <button
                                type="button"
                                onClick={() => setExpandedPmeId(isExpanded ? null : pme.pmeId)}
                                style={{
                                  background: isExpanded ? '#0F7F90' : '#F0FCFF',
                                  border: '1px solid',
                                  borderColor: isExpanded ? '#0F7F90' : '#BAE6FD',
                                  borderRadius: '6px',
                                  padding: '6px 10px',
                                  cursor: 'pointer',
                                  textAlign: 'left',
                                  display: 'inline-flex',
                                  flexDirection: 'column',
                                  gap: '2px',
                                  transition: 'all 0.15s ease',
                                }}
                                title={isExpanded ? 'Masquer les parcours de cette entreprise' : 'Cliquer pour afficher les parcours de cette entreprise'}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <span style={{ fontWeight: 800, fontSize: '0.78rem', color: isExpanded ? '#FFFFFF' : '#0369A1' }}>
                                    {pme.runsCount} diagnostic{pme.runsCount > 1 ? 's' : ''}
                                  </span>
                                  {isExpanded ? (
                                    <ChevronUp size={13} color={isExpanded ? '#FFFFFF' : '#0369A1'} />
                                  ) : (
                                    <ChevronDown size={13} color="#0369A1" />
                                  )}
                                </div>
                              </button>
                            ) : (
                              <div>
                                <span
                                  style={{
                                    background: '#F1F5F9',
                                    color: '#64748B',
                                    fontWeight: 700,
                                    fontSize: '0.74rem',
                                    padding: '3px 8px',
                                    borderRadius: '4px',
                                    border: '1px solid #E2E8F0',
                                  }}
                                >
                                  0 diagnostic
                                </span>
                                <div style={{ fontSize: '0.71rem', color: '#94A3B8', marginTop: '3px' }}>
                                  Inscrite au triage
                                </div>
                              </div>
                            )}
                          </td>

                          {/* 5. Actions (uniquement la Fiche entreprise) */}
                          <td style={{ padding: '14px 16px', verticalAlign: 'top', textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={() => setSelectedPmeForModal(pme)}
                              style={{
                                background: '#FFFFFF',
                                border: '1px solid #CBD5E1',
                                color: '#17212D',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                fontSize: '0.76rem',
                                fontWeight: 700,
                                transition: 'all 0.15s ease',
                              }}
                              title="Consulter la fiche détaillée de l'entreprise"
                            >
                              <Info size={14} color="#0F7F90" />
                              <span>Fiche</span>
                            </button>
                          </td>
                        </tr>

                        {/* ── Accordion déroulant des diagnostics de l'entreprise ── */}
                        {isExpanded && (
                          <tr style={{ background: '#F8FAFC' }}>
                            <td colSpan="5" style={{ padding: '16px 20px', borderBottom: '2px solid #34BED5' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <div>
                                  <span style={{ fontSize: '0.84rem', fontWeight: 900, color: '#17212D' }}>
                                    Parcours diagnostics rattachés à « {pme.name} »
                                  </span>
                                  <span style={{ fontSize: '0.76rem', color: '#64748B', marginLeft: '8px' }}>
                                    ({pme.runsCount} session{pme.runsCount > 1 ? 's' : ''} enregistrée{pme.runsCount > 1 ? 's' : ''})
                                  </span>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => navigate('/admin/diagnostics', { state: { searchTerm: pme.name } })}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: '#0F7F90',
                                    cursor: 'pointer',
                                    fontSize: '0.78rem',
                                    fontWeight: 800,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                  }}
                                >
                                  <span>Voir dans le registre global</span>
                                  <ExternalLink size={13} />
                                </button>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {pme.validRuns.map((run, rIdx) => {
                                  const isComp = run.completion_status === 'completed';
                                  const modName = MODULE_NAMES[run.module_code] || run.module_code || 'Module';
                                  const answered = run.question_count_answered ?? 0;
                                  const expected = run.question_count_expected ?? 0;

                                  return (
                                    <div
                                      key={run.diagnostic_run_id || rIdx}
                                      style={{
                                        background: '#FFFFFF',
                                        border: '1px solid #E2E8F0',
                                        borderLeft: `3px solid ${isComp ? '#059669' : '#D97706'}`,
                                        borderRadius: '6px',
                                        padding: '10px 14px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        gap: '10px',
                                      }}
                                    >
                                      <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                          <span style={{ fontWeight: 800, color: '#17212D', fontSize: '0.82rem' }}>
                                            {run.module_code} — {modName}
                                          </span>
                                          <span
                                            style={{
                                              fontSize: '0.68rem',
                                              fontWeight: 800,
                                              padding: '1px 6px',
                                              borderRadius: '4px',
                                              background: isComp ? '#DCFCE7' : '#FEF3C7',
                                              color: isComp ? '#166534' : '#92400E',
                                            }}
                                          >
                                            {isComp ? 'Finalisé' : 'En cours'}
                                          </span>
                                        </div>
                                        <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                          <span>
                                            Progression : <strong>{answered}</strong> / {expected} questions
                                          </span>
                                          <span>•</span>
                                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                            <Calendar size={12} color="#94A3B8" /> {formatDate(run.started_at)}
                                          </span>
                                        </div>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          navigate(`/admin/diagnostics/${run.diagnostic_run_id}`, {
                                            state: {
                                              run,
                                              businessName: pme.name,
                                              userName: pme.contactName,
                                              userEmail: pme.contactEmail,
                                              moduleCode: run.module_code,
                                            },
                                          })
                                        }
                                        style={{
                                          background: '#17212D',
                                          color: '#FFFFFF',
                                          border: 'none',
                                          borderRadius: '6px',
                                          padding: '5px 12px',
                                          fontSize: '0.74rem',
                                          fontWeight: 800,
                                          cursor: 'pointer',
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                        }}
                                      >
                                        <span>Consulter le bilan</span>
                                        <ExternalLink size={12} />
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}

                  {filteredPmes.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
                        Aucune entreprise ne correspond aux critères sélectionnés.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 18px',
                  borderTop: '1px solid #E2E8F0',
                  background: '#F8FAFC',
                }}
              >
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
                  Page <strong>{currentPage}</strong> sur <strong>{totalPages}</strong> ({filteredPmes.length} entreprises affichées)
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    style={{
                      border: '1px solid #CBD5E1',
                      background: currentPage === 1 ? '#F1F5F9' : '#FFFFFF',
                      color: currentPage === 1 ? '#94A3B8' : '#17212D',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                    }}
                  >
                    <ChevronLeft size={14} /> Précédent
                  </button>
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    style={{
                      border: '1px solid #CBD5E1',
                      background: currentPage === totalPages ? '#F1F5F9' : '#FFFFFF',
                      color: currentPage === totalPages ? '#94A3B8' : '#17212D',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                    }}
                  >
                    Suivant <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modal Fiche Entreprise Complète ── */}
      {selectedPmeForModal && (
        <CompanyProfileModal
          pme={selectedPmeForModal}
          onClose={() => setSelectedPmeForModal(null)}
        />
      )}
    </div>
  );
};
