import React, { useState, useEffect, useRef } from 'react';
import {
  FileText,
  Search,
  RotateCcw,
  AlertOctagon,
  ChevronLeft,
  ChevronRight,
  Send,
  CheckCircle2,
  Mail,
  User,
  Clock,
  AlertCircle,
  ExternalLink,
  Info,
  Calendar,
  Check,
} from 'lucide-react';
import { apiFetch } from '../../api/config.js';

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

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const ReportsModule = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsData, setReportsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'sent' | 'failed'

  // Action state per diagnostic run: { [diagnosticRunId]: { status: 'sending' | 'success' | 'error', message: string } }
  const [actionState, setActionState] = useState({});

  const fetchCompletedDiagnostics = async (page = 1) => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');
    try {
      const res = await apiFetch(`/admin/dashboard/diagnostics?page=${page}&per_page=30&completion_status=completed`);
      setReportsData(res || null);
      setCurrentPage(page);
    } catch (err) {
      console.error('[ReportsModule] fetch error:', err);
      setIsError(true);
      setErrorMessage(err?.message ?? 'Impossible de charger la liste des bilans finalisés pour les rapports.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedDiagnostics(currentPage);
  }, [currentPage]);

  // ─── Normalisation des données (Rule 9 & Rule 7) ───────────────────────────
  const rawItems = reportsData?.data ?? [];

  const normalizedItems = rawItems.map((item, idx) => {
    const business = item?.business ?? null;
    const businessName = business?.business_name ?? '[Entreprise non renseignée]';
    const sector = business?.sector ?? null;
    const subSector = business?.sub_sector ?? null;
    const region = business?.region ?? null;
    const commune = business?.commune ?? null;

    const user = item?.user ?? null;
    const userName = user?.full_name ?? '[Dirigeant non renseigné]';
    const userEmail = user?.email ?? null;
    const userPhone = user?.phone_number ?? null;

    const moduleCode = item?.module_code ?? 'MOD';
    const moduleName = MODULE_NAMES[moduleCode] || moduleCode;
    const completedAt = formatDate(item?.completed_at || item?.updated_at || item?.started_at);
    const rawReportStatus = item?.report_status ?? 'pending';
    const reportSentAt = item?.report_sent_at ? formatDate(item.report_sent_at) : null;

    return {
      diagnosticRunId: item?.diagnostic_run_id ?? `RUN-${idx}`,
      businessName,
      sector,
      subSector,
      region,
      commune,
      userName,
      userEmail,
      userPhone,
      moduleCode,
      moduleName,
      completedAt,
      reportStatus: rawReportStatus,
      reportSentAt,
      hasEmail: Boolean(userEmail),
      originalItem: item,
    };
  });

  // Client-side search and status filter
  const filteredItems = normalizedItems.filter((item) => {
    // Filtre statut d'expédition
    if (statusFilter === 'sent' && item.reportStatus !== 'sent') return false;
    if (statusFilter === 'pending' && item.reportStatus !== 'pending') return false;
    if (statusFilter === 'failed' && item.reportStatus !== 'failed') return false;

    // Filtre recherche
    if (!searchTerm.trim()) return true;
    const term = searchTerm.trim().toLowerCase();
    return (
      item.moduleCode.toLowerCase().includes(term) ||
      item.moduleName.toLowerCase().includes(term) ||
      item.businessName.toLowerCase().includes(term) ||
      item.userName.toLowerCase().includes(term) ||
      (item.userEmail && item.userEmail.toLowerCase().includes(term)) ||
      (item.userPhone && item.userPhone.toLowerCase().includes(term)) ||
      item.diagnosticRunId.toLowerCase().includes(term)
    );
  });

  const paginationInfo = {
    currentPage: reportsData?.current_page ?? 1,
    lastPage: reportsData?.last_page ?? 1,
    total: reportsData?.total ?? 0,
  };

  // ─── Relancer la génération IA et l'envoi du rapport ────────────────────────
  const handleResendReport = async (item) => {
    const runId = item.diagnosticRunId;
    setActionState((prev) => ({
      ...prev,
      [runId]: { status: 'sending', message: 'Génération IA & envoi en cours...' },
    }));

    try {
      // Déclenche l'appel webhook n8n / modèle IA pour régénérer le rapport et le réexpédier par email
      const res = await apiFetch(`/diagnostics/${runId}/details`);
      console.log('[ReportsModule] Resend response:', res);

      setActionState((prev) => ({
        ...prev,
        [runId]: { status: 'success', message: 'Rapport régénéré et transmis au destinataire !' },
      }));

      // Rafraîchir les données locales après un court délai
      setTimeout(() => {
        setActionState((prev) => {
          const next = { ...prev };
          delete next[runId];
          return next;
        });
        fetchCompletedDiagnostics(currentPage);
      }, 3500);
    } catch (err) {
      console.error('[ReportsModule] Resend error:', err);
      setActionState((prev) => ({
        ...prev,
        [runId]: { status: 'error', message: err?.message || "Échec lors de la régénération du rapport." },
      }));
    }
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
              Rapports PME — Relance & Expédition
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
              {paginationInfo.total} bilans finalisés
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '0.88rem' }}>
            Gestion des relances, régénération du contenu via le modèle IA et expédition des rapports PDF aux dirigeants.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchCompletedDiagnostics(currentPage)}
          disabled={isLoading}
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
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          <RotateCcw size={14} style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
          Actualiser
        </button>
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
              Guide de gestion des relances de rapports
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
            Cet écran recense l'ensemble des diagnostics complétés dont le rapport personnalisé doit être délivré à l'entreprise.
            À l'issue du questionnaire, le modèle IA synthétise l'évaluation avant sa mise en forme et son expédition par courriel.
            En cas d'interruption ou de non-délivrance, cliquez sur <strong>« Relancer l'envoi »</strong> pour solliciter à nouveau le modèle d'analyse et expédier directement le rapport PDF à l'adresse email rattachée au dirigeant.
          </p>
        </div>
      </div>

      {/* ── Filtres & Recherche ── */}
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
        {/* Onglets de filtrage par état d'expédition */}
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
            }}
          >
            Tous les bilans
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            style={{
              border: 'none',
              background: statusFilter === 'pending' ? '#17212D' : 'transparent',
              color: statusFilter === 'pending' ? '#FFFFFF' : '#475569',
              fontWeight: statusFilter === 'pending' ? 800 : 600,
              fontSize: '0.82rem',
              padding: '6px 14px',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            En attente
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('sent')}
            style={{
              border: 'none',
              background: statusFilter === 'sent' ? '#17212D' : 'transparent',
              color: statusFilter === 'sent' ? '#FFFFFF' : '#475569',
              fontWeight: statusFilter === 'sent' ? 800 : 600,
              fontSize: '0.82rem',
              padding: '6px 14px',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Envoyés
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('failed')}
            style={{
              border: 'none',
              background: statusFilter === 'failed' ? '#17212D' : 'transparent',
              color: statusFilter === 'failed' ? '#FFFFFF' : '#475569',
              fontWeight: statusFilter === 'failed' ? 800 : 600,
              fontSize: '0.82rem',
              padding: '6px 14px',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Échecs / Non expédiés
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
            placeholder="Rechercher entreprise, dirigeant, email..."
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

      {/* ── Table des Bilans & Relances ── */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '6px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)',
          overflow: 'hidden',
        }}
      >
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8', fontSize: '0.88rem' }}>
            <RotateCcw size={22} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 10px', display: 'block', color: '#0F7F90' }} />
            Chargement des rapports PME...
          </div>
        ) : isError ? (
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
              <AlertOctagon size={16} />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => fetchCompletedDiagnostics(currentPage)}
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
                    <th style={{ padding: '12px 16px', fontWeight: 800 }}>Destinataire / Contact</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800 }}>Module Diagnostic</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800 }}>Statut Rapport</th>
                    <th style={{ padding: '12px 16px', fontWeight: 800, textAlign: 'right' }}>Action Relance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => {
                    const state = actionState[item.diagnosticRunId];
                    const isSending = state?.status === 'sending';
                    const isSuccess = state?.status === 'success';
                    const isErr = state?.status === 'error';
                    const isSent = item.reportStatus === 'sent' || isSuccess;

                    return (
                      <tr
                        key={item.diagnosticRunId}
                        style={{
                          borderBottom: '1px solid #E2E8F0',
                          background: '#FFFFFF',
                          transition: 'background 0.15s ease',
                        }}
                      >
                        {/* 1. Entreprise */}
                        <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 800, color: '#17212D', fontSize: '0.88rem' }}>
                            {item.businessName}
                          </div>
                          {(item.sector || item.region || item.commune) && (
                            <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
                              {item.sector ? `${item.sector} • ` : ''}
                              {[item.commune, item.region].filter(Boolean).join(', ')}
                            </div>
                          )}
                        </td>

                        {/* 2. Destinataire */}
                        <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 700, color: '#17212D', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <User size={13} color="#0F7F90" /> {item.userName}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '4px', fontSize: '0.76rem', color: '#64748B' }}>
                            {item.userEmail ? (
                              <a href={`mailto:${item.userEmail}`} style={{ color: '#0F7F90', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                                <Mail size={12} color="#94A3B8" /> {item.userEmail}
                              </a>
                            ) : (
                              <span style={{ color: '#DC2626', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <AlertCircle size={12} /> Email manquant
                              </span>
                            )}
                            {item.userPhone && <span>{item.userPhone}</span>}
                          </div>
                        </td>

                        {/* 3. Module */}
                        <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                          <span
                            style={{
                              background: '#ECFDF5',
                              color: '#065F46',
                              fontWeight: 800,
                              fontSize: '0.76rem',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              border: '1px solid #A7F3D0',
                              display: 'inline-block',
                            }}
                          >
                            {item.moduleCode} — {item.moduleName}
                          </span>
                          <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={12} color="#94A3B8" /> Complété le {item.completedAt}
                          </div>
                        </td>

                        {/* 4. Statut Rapport */}
                        <td style={{ padding: '14px 16px', verticalAlign: 'top' }}>
                          {isSent ? (
                            <div>
                              <span
                                style={{
                                  background: '#DCFCE7',
                                  color: '#166534',
                                  fontWeight: 800,
                                  fontSize: '0.74rem',
                                  padding: '3px 8px',
                                  borderRadius: '4px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                <CheckCircle2 size={13} /> Rapport expédié
                              </span>
                              {item.reportSentAt && (
                                <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '3px' }}>
                                  Envoyé le {item.reportSentAt}
                                </div>
                              )}
                            </div>
                          ) : item.reportStatus === 'failed' ? (
                            <span
                              style={{
                                background: '#FEF2F2',
                                color: '#991B1B',
                                fontWeight: 800,
                                fontSize: '0.74rem',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <AlertCircle size={13} /> Non délivré / Échec
                            </span>
                          ) : (
                            <span
                              style={{
                                background: '#FFFBEB',
                                color: '#92400E',
                                fontWeight: 700,
                                fontSize: '0.74rem',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <Clock size={13} /> En attente d'envoi
                            </span>
                          )}
                        </td>

                        {/* 5. Action Relance */}
                        <td style={{ padding: '14px 16px', verticalAlign: 'top', textAlign: 'right' }}>
                          {isSending ? (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '0.76rem',
                                fontWeight: 700,
                                color: '#0F7F90',
                                background: '#E0F2FE',
                                padding: '6px 12px',
                                borderRadius: '6px',
                              }}
                            >
                              <RotateCcw size={13} style={{ animation: 'spin 1s linear infinite' }} />
                              Génération & Envoi...
                            </span>
                          ) : (
                            <div>
                              <button
                                type="button"
                                onClick={() => handleResendReport(item)}
                                disabled={!item.hasEmail}
                                style={{
                                  background: item.hasEmail ? '#17212D' : '#F1F5F9',
                                  color: item.hasEmail ? '#FFFFFF' : '#94A3B8',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '6px 12px',
                                  fontSize: '0.76rem',
                                  fontWeight: 800,
                                  cursor: item.hasEmail ? 'pointer' : 'not-allowed',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  transition: 'background 0.15s ease',
                                }}
                                title={
                                  item.hasEmail
                                    ? "Relancer le modèle IA et expédier le rapport PDF par email"
                                    : "Impossible de relancer : aucune adresse email renseignée pour ce dirigeant."
                                }
                              >
                                <Send size={12} />
                                <span>Relancer l'envoi</span>
                              </button>

                              {isSuccess && (
                                <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, marginTop: '3px' }}>
                                  ✓ Rapport régénéré & envoyé !
                                </div>
                              )}
                              {isErr && (
                                <div style={{ fontSize: '0.72rem', color: '#DC2626', fontWeight: 700, marginTop: '3px' }}>
                                  {state?.message || 'Erreur lors de la relance'}
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
                        Aucun bilan finalisé ne correspond aux filtres sélectionnés.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {paginationInfo.lastPage > 1 && (
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
                  Page <strong>{currentPage}</strong> sur <strong>{paginationInfo.lastPage}</strong> ({filteredItems.length} bilans affichés sur cette page)
                </span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    disabled={currentPage <= 1 || isLoading}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    style={{
                      border: '1px solid #CBD5E1',
                      background: currentPage <= 1 ? '#F1F5F9' : '#FFFFFF',
                      color: currentPage <= 1 ? '#94A3B8' : '#17212D',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
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
                    disabled={currentPage >= paginationInfo.lastPage || isLoading}
                    onClick={() => setCurrentPage((p) => Math.min(paginationInfo.lastPage, p + 1))}
                    style={{
                      border: '1px solid #CBD5E1',
                      background: currentPage >= paginationInfo.lastPage ? '#F1F5F9' : '#FFFFFF',
                      color: currentPage >= paginationInfo.lastPage ? '#94A3B8' : '#17212D',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      cursor: currentPage >= paginationInfo.lastPage ? 'not-allowed' : 'pointer',
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
    </div>
  );
};
