import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Search,
  RotateCcw,
  AlertOctagon,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  Building2,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  Filter,
  PieChart,
  UserX,
  CheckCheck
} from 'lucide-react';
import { apiFetch } from '../../../api/config.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MODULE_FAMILY_LABELS = {
  situational:  'Situationnel',
  transversal:  'Transversal',
  functional:   'Fonctionnel',
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

// ─── Main Component ───────────────────────────────────────────────────────────

export const DiagnosticHistoryScreen = () => {
  const navigate = useNavigate();

  // ── State ──
  const [currentPage, setCurrentPage]   = useState(1);
  const [historyData, setHistoryData]   = useState(null);
  const [isLoading, setIsLoading]       = useState(true);
  const [isError, setIsError]           = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm]     = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [statusTab, setStatusTab]       = useState('completed'); // 'completed' | 'all' | 'started'

  // ── Fetch paginated list ──
  const fetchDiagnostics = async (page = 1) => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');
    try {
      const res = await apiFetch(`/admin/dashboard/diagnostics?page=${page}&per_page=30`);
      setHistoryData(res || null);
      setCurrentPage(page);
    } catch (err) {
      console.error('[DiagnosticHistoryScreen] fetch error:', err);
      setIsError(true);
      setErrorMessage(err?.message ?? '[fetch_diagnostics_error] Impossible de charger les diagnostics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics(currentPage);
  }, [currentPage]);

  // ─── Normalization (Rule 9) ────────────────────────────────────────────────
  const rawItems = historyData?.data ?? [];

  const normalizedItems = rawItems.map((item, idx) => {
    const rawStatus  = item?.completion_status ?? '[completion_status non disponible]';
    const isCompleted = rawStatus === 'completed';

    // Extraction entreprise
    const business     = item?.business ?? null;
    const businessName = business?.business_name ?? null;
    const sector       = business?.sector ?? null;
    const subSector    = business?.sub_sector ?? null;

    // Extraction utilisateur
    const user        = item?.user ?? null;
    const userName    = user?.full_name ?? null;
    const userEmail   = user?.email ?? null;
    const userPhone   = user?.phone_number ?? null;

    return {
      diagnosticRunId:        item?.diagnostic_run_id        ?? `RUN-${idx}`,
      userId:                 item?.user_id                   ?? null,
      businessId:             item?.business_id               ?? null,
      businessName,
      sector,
      subSector,
      userName,
      userEmail,
      userPhone,
      moduleCode:             item?.module_code               ?? '[module_code non disponible]',
      moduleFamily:           item?.module_family             ?? '[module_family non disponible]',
      moduleFamilyLabel:      MODULE_FAMILY_LABELS[item?.module_family] ?? item?.module_family ?? '—',
      completionStatus:       rawStatus,
      statusLabel:            isCompleted ? 'Terminé' : 'En cours',
      isCompleted,
      startedAt:              formatDate(item?.started_at),
      completedAt:            item?.completed_at ? formatDate(item.completed_at) : null,
      questionCountExpected:  item?.question_count_expected   ?? 0,
      questionCountAnswered:  item?.question_count_answered   ?? 0,
      isRecommended:          Boolean(item?.is_recommended_module),
      isOverride:             Boolean(item?.is_user_override),
      originalItem:           item,
    };
  });

  // ── Stats calculées sur la page courante ──
  const totalOnPage = normalizedItems.length;
  const completedCount = normalizedItems.filter(i => i.isCompleted).length;
  const startedCount = totalOnPage - completedCount;
  const completionRate = totalOnPage > 0 ? Math.round((completedCount / totalOnPage) * 100) : 0;

  // ── Client-side filters ──
  const filteredItems = normalizedItems.filter(item => {
    const term = searchTerm.toLowerCase();
    const matchSearch = !term || (
      item.moduleCode.toLowerCase().includes(term) ||
      (item.businessName && item.businessName.toLowerCase().includes(term)) ||
      (item.userName     && item.userName.toLowerCase().includes(term)) ||
      (item.userEmail    && item.userEmail.toLowerCase().includes(term)) ||
      (item.userPhone    && item.userPhone.toLowerCase().includes(term)) ||
      (item.businessId   && item.businessId.toLowerCase().includes(term)) ||
      (item.userId       && item.userId.toLowerCase().includes(term))
    );
    const matchModule = !moduleFilter || item.moduleCode === moduleFilter;
    
    let matchTab = true;
    if (statusTab === 'completed') matchTab = item.isCompleted;
    if (statusTab === 'started')   matchTab = !item.isCompleted;

    return matchSearch && matchModule && matchTab;
  });

  const paginationInfo = {
    currentPage: historyData?.current_page ?? 1,
    lastPage:    historyData?.last_page    ?? 1,
    total:       historyData?.total        ?? 0,
  };

  const hasItems  = !isLoading && !isError && normalizedItems.length > 0;
  const showEmpty = !isLoading && !isError && normalizedItems.length === 0;

  const uniqueModules = [...new Set(rawItems.map(i => i?.module_code).filter(Boolean))].sort();

  // ── Navigate to detail page ──
  const handleRowClick = (item) => {
    navigate(`/admin/diagnostics/${item.diagnosticRunId}`, {
      state: {
        run:          item.originalItem,
        userId:       item.userId,
        businessName: item.businessName,
        userName:     item.userName,
        userEmail:    item.userEmail,
      },
    });
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="admin-page animate-fade-up">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Historique des Diagnostics</h1>
          <p className="admin-page-sub">
            Suivi des diagnostics PME — bilans finalisés et parcours d'évaluation.
          </p>
        </div>
        {!isLoading && paginationInfo.total > 0 && (
          <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--brand-blue, #1A9DB8)', background: 'rgba(26,157,184,0.08)', padding: '6px 14px', borderRadius: '8px' }}>
            {paginationInfo.total} au total
          </span>
        )}
      </div>

      {/* KPI Cards */}
      {!isLoading && !isError && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {/* Card 1: Complétés */}
          <div className="admin-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CheckCheck size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase' }}>Complétés (page)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#166534', lineHeight: 1.2 }}>{completedCount}</div>
            </div>
          </div>

          {/* Card 2: En cours / Non finalisés */}
          <div className="admin-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#FEF3C7', color: '#92400E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Clock size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase' }}>En cours / Non finalisés</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#92400E', lineHeight: 1.2 }}>{startedCount}</div>
            </div>
          </div>

          {/* Card 3: Taux de finalisation */}
          <div className="admin-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <PieChart size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase' }}>Taux de complétion</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#2563EB', lineHeight: 1.2 }}>{completionRate}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Segmented Status Tabs */}
      {!isError && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', background: 'var(--slate-100, #F1F5F9)', padding: '4px', borderRadius: '12px', gap: '4px' }}>
            <button
              type="button"
              onClick={() => setStatusTab('completed')}
              style={{
                border: 'none',
                background: statusTab === 'completed' ? '#FFFFFF' : 'transparent',
                color: statusTab === 'completed' ? '#0F172A' : '#64748B',
                fontWeight: statusTab === 'completed' ? 700 : 500,
                fontSize: '0.85rem',
                padding: '6px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: statusTab === 'completed' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Diagnostics finalisés ({completedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusTab('all')}
              style={{
                border: 'none',
                background: statusTab === 'all' ? '#FFFFFF' : 'transparent',
                color: statusTab === 'all' ? '#0F172A' : '#64748B',
                fontWeight: statusTab === 'all' ? 700 : 500,
                fontSize: '0.85rem',
                padding: '6px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: statusTab === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Tous ({totalOnPage})
            </button>
            <button
              type="button"
              onClick={() => setStatusTab('started')}
              style={{
                border: 'none',
                background: statusTab === 'started' ? '#FFFFFF' : 'transparent',
                color: statusTab === 'started' ? '#0F172A' : '#64748B',
                fontWeight: statusTab === 'started' ? 700 : 500,
                fontSize: '0.85rem',
                padding: '6px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: statusTab === 'started' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              En cours / Non finalisés ({startedCount})
            </button>
          </div>

          {/* Search & Module filter */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', minWidth: '220px', maxWidth: '300px' }}>
              <Search size={15} color="var(--slate-400)" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Rechercher entreprise, déclarant, email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: '100%', paddingLeft: '34px', height: '38px', borderRadius: '10px', border: '1px solid var(--adm-border)', outline: 'none', fontSize: '0.85rem', background: 'var(--adm-bg)', color: 'var(--adm-text)', boxSizing: 'border-box' }}
              />
            </div>

            <select
              value={moduleFilter}
              onChange={e => setModuleFilter(e.target.value)}
              style={{ height: '38px', borderRadius: '10px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)', color: 'var(--adm-text)', fontSize: '0.85rem', padding: '0 10px', cursor: 'pointer' }}
            >
              <option value="">Tous les modules</option>
              {uniqueModules.map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '16px 20px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600, marginBottom: '20px' }}>
          <span>
            <AlertOctagon size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            {errorMessage}
          </span>
          <button
            onClick={() => fetchDiagnostics(currentPage)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '6px 12px', color: '#991B1B', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}
          >
            <RotateCcw size={14} /> Réessayer
          </button>
        </div>
      )}

      {/* Table */}
      <div className="admin-card">
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--slate-400)' }}>
            <div style={{ display: 'inline-block', width: '28px', height: '28px', border: '3px solid #E2E8F0', borderTopColor: '#1A9DB8', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '10px' }} />
            <p style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>Chargement des diagnostics…</p>
          </div>
        ) : showEmpty ? (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--slate-400)' }}>
            <FileText size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
            <p style={{ fontWeight: 600 }}>Aucun diagnostic enregistré</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px', color: 'var(--slate-400)' }}>
            <Search size={32} style={{ marginBottom: '10px', opacity: 0.4 }} />
            <p style={{ fontWeight: 600 }}>Aucun résultat pour ce filtre</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th><Building2 size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />Entreprise</th>
                  <th><User size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />Renseigné par</th>
                  <th><Mail size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />Email / Téléphone</th>
                  <th><Calendar size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />Date</th>
                  <th><ClipboardList size={13} style={{ marginRight: '5px', verticalAlign: 'middle' }} />Module</th>
                  <th>Statut</th>
                  <th style={{ textAlign: 'right' }}>Détail</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr
                    key={item.diagnosticRunId}
                    onClick={() => handleRowClick(item)}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,157,184,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                  >
                    {/* Entreprise */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '8px',
                          background: item.businessName ? '#EFF6FF' : '#F1F5F9',
                          color: item.businessName ? '#2563EB' : '#94A3B8',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                          <Building2 size={15} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: item.businessName ? 'var(--adm-text)' : 'var(--slate-400)' }}>
                            {item.businessName || 'PME non renseignée'}
                          </div>
                          {item.sector ? (
                            <div style={{ fontSize: '0.72rem', color: 'var(--slate-400)' }}>
                              {item.sector}{item.subSector ? ` · ${item.subSector}` : ''}
                            </div>
                          ) : (
                            <div style={{ fontSize: '0.71rem', color: '#94A3B8', fontStyle: 'italic' }}>Parcours non finalisé</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Renseigné par */}
                    <td>
                      {item.userName ? (
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--adm-text)' }}>
                          {item.userName}
                        </div>
                      ) : (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.76rem', color: '#64748B', background: '#F1F5F9', padding: '2px 8px', borderRadius: '6px' }}>
                          <UserX size={12} /> Diagnostic en cours
                        </div>
                      )}
                    </td>

                    {/* Email / Téléphone */}
                    <td>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {item.userEmail ? (
                          <a href={`mailto:${item.userEmail}`} onClick={e => e.stopPropagation()} style={{ color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Mail size={12} color="var(--slate-400)" /> {item.userEmail}
                          </a>
                        ) : null}
                        {item.userPhone ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                            <Phone size={12} color="var(--slate-400)" /> {item.userPhone}
                          </span>
                        ) : null}
                        {!item.userEmail && !item.userPhone && (
                          <span style={{ fontSize: '0.76rem', color: '#94A3B8', fontStyle: 'italic' }}>Non renseigné</span>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td style={{ fontSize: '0.82rem', color: 'var(--slate-500)', whiteSpace: 'nowrap' }}>
                      {item.startedAt}
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

                    {/* Statut */}
                    <td>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px',
                        borderRadius: '20px', textTransform: 'uppercase',
                        background: item.isCompleted ? '#DCFCE7' : '#FEF3C7',
                        color: item.isCompleted ? '#166534' : '#92400E',
                      }}>
                        {item.isCompleted ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {item.statusLabel}
                      </span>
                    </td>

                    {/* Action */}
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleRowClick(item)}
                        className="btn btn-ghost btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--brand-blue, #1A9DB8)' }}
                        title="Voir les réponses"
                      >
                        <ExternalLink size={14} /> Voir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {hasItems && paginationInfo.lastPage > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '0 4px' }}>
          <span style={{ fontSize: '0.84rem', color: 'var(--slate-500)', fontWeight: 600 }}>
            Page {paginationInfo.currentPage} / {paginationInfo.lastPage} · {paginationInfo.total} diagnostics
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
      `}</style>
    </div>
  );
};
