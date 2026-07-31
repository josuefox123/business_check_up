import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  RotateCcw,
  AlertOctagon,
  ChevronLeft,
  ChevronRight,
  Send,
  EyeOff,
  CheckCircle2,
  Building2,
  User,
  Mail,
  Calendar,
  ClipboardList,
  RefreshCw,
  Check,
  AlertCircle
} from 'lucide-react';
import { apiFetch } from '../../api/config.js';

const MODULE_FAMILY_LABELS = {
  situational: 'Situationnel',
  transversal: 'Transversal',
  functional: 'Fonctionnel',
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

  // Toast / notification state per action: { [diagnosticRunId]: { status: 'sending' | 'success' | 'error', message: string } }
  const [actionState, setActionState] = useState({});

  const fetchCompletedDiagnostics = async (page = 1) => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');
    try {
      const res = await apiFetch(`/admin/dashboard/diagnostics?page=${page}&per_page=30`);
      setReportsData(res || null);
      setCurrentPage(page);
    } catch (err) {
      console.error('[ReportsModule] fetch error:', err);
      setIsError(true);
      setErrorMessage(err?.message ?? '[fetch_reports_error] Impossible de charger la liste des rapports.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedDiagnostics(currentPage);
  }, [currentPage]);

  // ─── Normalization & STRICT DOUBLE FILTER (completed & PME/User réellement renseignés) ───
  const rawItems = reportsData?.data ?? [];

  const completedItems = rawItems
    .filter(item => {
      // Exigence 1 : Diagnostic complété
      const isCompleted = item?.completion_status === 'completed';

      // Exigence 2 : Informations Entreprise ou Utilisateur réellement rattachées (non nulles)
      const hasBusiness = item?.business && (item.business.business_name || item.business_id);
      const hasUser = item?.user && (item.user.full_name || item.user.email || item.user_id);

      return isCompleted && Boolean(hasBusiness || hasUser);
    })
    .map((item, idx) => {
      const business = item?.business ?? null;
      const businessName = business?.business_name ?? null;
      const sector = business?.sector ?? null;
      const subSector = business?.sub_sector ?? null;

      const user = item?.user ?? null;
      const userName = user?.full_name ?? null;
      const userEmail = user?.email ?? null;
      const userPhone = user?.phone_number ?? null;

      return {
        diagnosticRunId: item?.diagnostic_run_id ?? `RUN-${idx}`,
        userId: item?.user_id ?? null,
        businessId: item?.business_id ?? null,
        businessName,
        sector,
        subSector,
        userName,
        userEmail,
        userPhone,
        moduleCode: item?.module_code ?? '[module_code non disponible]',
        moduleFamily: item?.module_family ?? '[module_family non disponible]',
        moduleFamilyLabel: MODULE_FAMILY_LABELS[item?.module_family] ?? item?.module_family ?? '—',
        completedAt: formatDate(item?.completed_at || item?.updated_at || item?.started_at),
        originalItem: item,
      };
    });

  // Client-side search filtering
  const filteredItems = completedItems.filter(item => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;
    return (
      item.moduleCode.toLowerCase().includes(term) ||
      (item.businessName && item.businessName.toLowerCase().includes(term)) ||
      (item.userName && item.userName.toLowerCase().includes(term)) ||
      (item.userEmail && item.userEmail.toLowerCase().includes(term)) ||
      (item.userPhone && item.userPhone.toLowerCase().includes(term)) ||
      (item.diagnosticRunId && item.diagnosticRunId.toLowerCase().includes(term))
    );
  });

  const paginationInfo = {
    currentPage: reportsData?.current_page ?? 1,
    lastPage: reportsData?.last_page ?? 1,
    total: reportsData?.total ?? 0,
  };

  // ─── Relancer l'envoi du rapport ──────────────────────────────────────────
  const handleResendReport = async (item) => {
    const runId = item.diagnosticRunId;
    setActionState(prev => ({
      ...prev,
      [runId]: { status: 'sending', message: 'Envoi en cours...' }
    }));

    try {
      // Endpoint dynamique : GET /diagnostics/{diagnosticRunId}/details
      const res = await apiFetch(`/diagnostics/${runId}/details`);
      console.log('[ReportsModule] Resend response:', res);
      
      setActionState(prev => ({
        ...prev,
        [runId]: { status: 'success', message: 'Rapport réexpédié avec succès !' }
      }));

      // Effacer le message de succès après 4 secondes
      setTimeout(() => {
        setActionState(prev => {
          const next = { ...prev };
          delete next[runId];
          return next;
        });
      }, 4000);
    } catch (err) {
      console.error('[ReportsModule] Resend error:', err);
      setActionState(prev => ({
        ...prev,
        [runId]: { status: 'error', message: err?.message || 'Échec de l\'envoi du rapport.' }
      }));
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="admin-page animate-fade-up">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Rapports PME</h1>
          <p className="admin-page-sub">
            Gestion et relance de l'envoi dynamique des rapports pour les diagnostics complétés et identifiés.
          </p>
        </div>
        {!isLoading && (
          <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--brand-blue, #1A9DB8)', background: 'rgba(26,157,184,0.08)', padding: '6px 14px', borderRadius: '8px' }}>
            {filteredItems.length} rapport{filteredItems.length > 1 ? 's' : ''} PME identifiée{filteredItems.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Bar de recherche */}
      {!isError && (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ position: 'relative', flex: '1', maxWidth: '380px' }}>
            <Search size={15} color="var(--slate-400)" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Rechercher par PME, dirigeant, email, module..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', paddingLeft: '34px', height: '38px', borderRadius: '10px', border: '1px solid var(--adm-border)', outline: 'none', fontSize: '0.85rem', background: 'var(--adm-bg)', color: 'var(--adm-text)', boxSizing: 'border-box' }}
            />
          </div>
        </div>
      )}

      {/* Message d'erreur initial */}
      {isError && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '16px 20px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600, marginBottom: '20px' }}>
          <span>
            <AlertOctagon size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            {errorMessage}
          </span>
          <button
            onClick={() => fetchCompletedDiagnostics(currentPage)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '6px 12px', color: '#991B1B', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}
          >
            <RotateCcw size={14} /> Réessayer
          </button>
        </div>
      )}

      {/* Tableau des rapports */}
      <div className="admin-card">
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--slate-400)' }}>
            <div style={{ display: 'inline-block', width: '28px', height: '28px', border: '3px solid #E2E8F0', borderTopColor: '#1A9DB8', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '10px' }} />
            <p style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>Chargement des rapports PME…</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--slate-400)' }}>
            <FileText size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
            <p style={{ fontWeight: 600, margin: 0 }}>Aucun rapport finalisé et identifié trouvé.</p>
            <span style={{ fontSize: '0.82rem' }}>Seuls les diagnostics entièrement complétés avec coordonnées PME rattachées apparaissent ici.</span>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th><Building2 size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />Entreprise (PME)</th>
                  <th><User size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />Dirigeant</th>
                  <th><Mail size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />Contact</th>
                  <th><Calendar size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />Date de Fin</th>
                  <th><ClipboardList size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />Module</th>
                  <th style={{ textAlign: 'center' }}>Statut Envoi</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const state = actionState[item.diagnosticRunId];
                  const isSending = state?.status === 'sending';
                  const isSuccess = state?.status === 'success';
                  const isErr = state?.status === 'error';

                  return (
                    <tr key={item.diagnosticRunId}>
                      {/* PME */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Building2 size={15} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--adm-text)' }}>
                              {item.businessName || 'PME enregistrée'}
                            </div>
                            {item.sector && (
                              <div style={{ fontSize: '0.72rem', color: 'var(--slate-400)' }}>
                                {item.sector}{item.subSector ? ` · ${item.subSector}` : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Dirigeant */}
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--adm-text)' }}>
                          {item.userName || 'Dirigeant PME'}
                        </div>
                      </td>

                      {/* Contact */}
                      <td>
                        <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          {item.userEmail && (
                            <a href={`mailto:${item.userEmail}`} style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Mail size={12} color="var(--slate-400)" /> {item.userEmail}
                            </a>
                          )}
                          {item.userPhone && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>{item.userPhone}</span>
                          )}
                          {!item.userEmail && !item.userPhone && '—'}
                        </div>
                      </td>

                      {/* Date de fin */}
                      <td style={{ fontSize: '0.82rem', color: 'var(--slate-500)', whiteSpace: 'nowrap' }}>
                        {item.completedAt}
                      </td>

                      {/* Module */}
                      <td>
                        <div>
                          <span style={{ display: 'inline-block', fontWeight: 700, fontSize: '0.82rem', background: 'rgba(26,157,184,0.1)', color: '#1A9DB8', padding: '2px 8px', borderRadius: '6px' }}>
                            {item.moduleCode}
                          </span>
                          <div style={{ fontSize: '0.72rem', color: 'var(--slate-400)', marginTop: '2px' }}>{item.moduleFamilyLabel}</div>
                        </div>
                      </td>

                      {/* Statut d'envoi dynamique */}
                      <td style={{ textAlign: 'center' }}>
                        {isSending ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', background: '#EFF6FF', padding: '3px 10px', borderRadius: '20px' }}>
                            <RefreshCw size={12} className="spin-icon" /> Envoi...
                          </span>
                        ) : isSuccess ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: 700, color: '#166534', background: '#DCFCE7', padding: '3px 10px', borderRadius: '20px' }}>
                            <Check size={12} /> Envoyé avec succès
                          </span>
                        ) : isErr ? (
                          <span title={state.message} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: 700, color: '#991B1B', background: '#FEF2F2', padding: '3px 10px', borderRadius: '20px', cursor: 'help' }}>
                            <AlertCircle size={12} /> Échec d'envoi
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: 600, color: '#475569', background: '#F1F5F9', padding: '3px 10px', borderRadius: '20px' }}>
                            <CheckCircle2 size={12} color="#10B981" /> Prêt
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                          {/* Bouton Voir Rapport désactivé */}
                          <button
                            disabled
                            className="btn btn-ghost btn-sm"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              color: 'var(--slate-400, #94A3B8)',
                              cursor: 'not-allowed',
                              opacity: 0.7
                            }}
                            title="Visualisation du rapport PDF en cours de finalisation par l'équipe backend"
                          >
                            <EyeOff size={14} /> Voir Rapport
                          </button>

                          {/* Bouton Relancer Envoi */}
                          <button
                            onClick={() => handleResendReport(item)}
                            disabled={isSending}
                            className="btn btn-primary btn-sm"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#1A9DB8', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#FFF', cursor: isSending ? 'not-allowed' : 'pointer' }}
                            title="Relancer l'envoi dynamique du rapport"
                          >
                            {isSending ? (
                              <RefreshCw size={13} className="spin-icon" />
                            ) : (
                              <Send size={13} />
                            )}
                            Relancer
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {paginationInfo.lastPage > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '0 4px' }}>
          <span style={{ fontSize: '0.84rem', color: 'var(--slate-500)', fontWeight: 600 }}>
            Page {paginationInfo.currentPage} / {paginationInfo.lastPage}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn btn-ghost btn-sm"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <ChevronLeft size={15} /> Précédent
            </button>
            <button
              className="btn btn-ghost btn-sm"
              disabled={currentPage >= paginationInfo.lastPage || isLoading}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginationInfo.lastPage))}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              Suivant <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin-icon { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
};
