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
  Calendar,
  FileText,
  Download
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

  // ── List State ──
  const [currentPage, setCurrentPage] = useState(1);
  const [historyData, setHistoryData]   = useState(null);
  const [isLoading, setIsLoading]       = useState(true);
  const [isError, setIsError]           = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm]     = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // ── Enrichment cache  { [user_id]: { business, question_responses, … } } ──
  const [detailCache, setDetailCache]   = useState({});
  const [enrichLoading, setEnrichLoading] = useState(false);

  // ── Fetch paginated list ──
  const fetchDiagnostics = async (page = 1) => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');
    try {
      const res = await apiFetch(`/admin/dashboard/diagnostics?page=${page}`);
      setHistoryData(res || null);
      setCurrentPage(page);
    } catch (err) {
      console.error('[DiagnosticHistoryScreen] fetch error:', err);
      setIsError(true);
      setErrorMessage(err?.message || '[fetch_diagnostics_error] Impossible de charger les diagnostics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics(currentPage);
  }, [currentPage]);

  // ── Enrichment: after list loads, fetch historical detail for each unique user_id ──
  useEffect(() => {
    if (!historyData?.data?.length) return;

    const uniqueUserIds = [
      ...new Set(
        historyData.data
          .map(item => item?.user_id)
          .filter(Boolean)
          .filter(uid => !detailCache[uid])
      ),
    ];

    if (uniqueUserIds.length === 0) return;

    setEnrichLoading(true);

    Promise.allSettled(
      uniqueUserIds.map(uid =>
        apiFetch(`/admin/dashboard/${uid}/historical`)
          .then(res => {
            const list = Array.isArray(res) ? res : (res?.data || []);
            return { uid, list };
          })
          .catch(() => ({ uid, list: [] }))
      )
    ).then(results => {
      const newCache = {};
      results.forEach(r => {
        if (r.status === 'fulfilled') {
          const { uid, list } = r.value;
          newCache[uid] = list; // array of diagnostic runs for this user
        }
      });
      setDetailCache(prev => ({ ...prev, ...newCache }));
      setEnrichLoading(false);
    });
  }, [historyData]);

  // ─── Normalization (Rule 9) ───────────────────────────────────────────────
  const rawItems = historyData?.data || [];

  const normalizedItems = rawItems.map((item, idx) => {
    const rawStatus      = item?.completion_status ?? '[completion_status non disponible]';
    const isCompleted    = rawStatus === 'completed';
    const userId         = item?.user_id         ?? null;
    const diagnosticRunId = item?.diagnostic_run_id ?? `RUN-${idx}`;

    // Enriched detail: find matching run in the user's historical
    const userHistory    = userId ? (detailCache[userId] || null) : null;
    const matchedDetail  = userHistory
      ? userHistory.find(r => r?.diagnostic_run_id === diagnosticRunId) || null
      : null;

    const business       = matchedDetail?.business ?? null;
    const businessName   = business?.business_name ?? '[business_name non disponible]';
    const businessSector = business?.sector        ?? null;

    // User info may live on matched detail (no direct field in list)
    const userName       = matchedDetail?.user?.full_name ?? null;
    const userEmail      = matchedDetail?.user?.email     ?? null;

    return {
      diagnosticRunId,
      userId,
      businessId:        item?.business_id           ?? null,
      moduleCode:        item?.module_code            ?? '[module_code non disponible]',
      moduleFamily:      item?.module_family          ?? '[module_family non disponible]',
      moduleFamilyLabel: MODULE_FAMILY_LABELS[item?.module_family] ?? item?.module_family ?? '—',
      completionStatus:  rawStatus,
      statusLabel:       isCompleted ? 'Terminé' : 'En cours',
      isCompleted,
      startedAt:         formatDate(item?.started_at),
      completedAt:       item?.completed_at ? formatDate(item.completed_at) : null,
      questionCountExpected: item?.question_count_expected ?? 0,
      questionCountAnswered: item?.question_count_answered ?? 0,
      isRecommended:     Boolean(item?.is_recommended_module),
      isOverride:        Boolean(item?.is_user_override),
      businessName,
      businessSector,
      userName,
      userEmail,
      // for the detail page
      hasDetail:         Boolean(matchedDetail),
      matchedDetail,
      originalItem:      item,
    };
  });

  // ── Client-side filters ──
  const filteredItems = normalizedItems.filter(item => {
    const term = searchTerm.toLowerCase();
    const matchSearch = !term || (
      item.moduleCode.toLowerCase().includes(term) ||
      item.businessName.toLowerCase().includes(term) ||
      (item.userName  && item.userName.toLowerCase().includes(term)) ||
      (item.userEmail && item.userEmail.toLowerCase().includes(term)) ||
      item.userId?.toLowerCase().includes(term)
    );
    const matchModule = !moduleFilter || item.moduleCode === moduleFilter;
    const matchStatus = !statusFilter || item.completionStatus === statusFilter;
    return matchSearch && matchModule && matchStatus;
  });

  const paginationInfo = {
    currentPage: historyData?.current_page ?? 1,
    lastPage:    historyData?.last_page    ?? 1,
    total:       historyData?.total        ?? 0,
    from:        historyData?.from         ?? 0,
    to:          historyData?.to           ?? 0,
  };

  const hasItems     = !isLoading && !isError && normalizedItems.length > 0;
  const showEmpty    = !isLoading && !isError && normalizedItems.length === 0;

  // ── Unique module codes for filter dropdown ──
  const uniqueModules = [...new Set(rawItems.map(i => i?.module_code).filter(Boolean))].sort();

  // ── Navigate to detail page ──
  const handleRowClick = (item) => {
    navigate(`/admin/diagnostics/${item.diagnosticRunId}`, {
      state: {
        run:        item.originalItem,
        detail:     item.matchedDetail,
        businessName: item.businessName,
        userName:   item.userName,
        userEmail:  item.userEmail,
      }
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
            Consultez tous les diagnostics réalisés — entreprise, contact, module, date et progression.
          </p>
        </div>
        {!isLoading && paginationInfo.total > 0 && (
          <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--brand-blue, #1A9DB8)', background: 'rgba(26,157,184,0.08)', padding: '6px 14px', borderRadius: '8px' }}>
            {paginationInfo.total} diagnostic{paginationInfo.total > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Error state */}
      {isError && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '16px 20px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600, marginBottom: '20px' }}>
          <span><AlertOctagon size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />{errorMessage}</span>
          <button
            onClick={() => fetchDiagnostics(currentPage)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'none', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '6px 12px', color: '#991B1B', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem' }}
          >
            <RotateCcw size={14} /> Réessayer
          </button>
        </div>
      )}

      {/* Filters bar */}
      {!isError && (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: '220px', maxWidth: '340px' }}>
            <Search size={15} color="var(--slate-400)" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Rechercher par entreprise, contact, module…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', paddingLeft: '34px', height: '38px', borderRadius: '10px', border: '1px solid var(--adm-border)', outline: 'none', fontSize: '0.85rem', background: 'var(--adm-bg)', color: 'var(--adm-text)', boxSizing: 'border-box' }}
            />
          </div>

          {/* Module filter */}
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

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ height: '38px', borderRadius: '10px', border: '1px solid var(--adm-border)', background: 'var(--adm-bg)', color: 'var(--adm-text)', fontSize: '0.85rem', padding: '0 10px', cursor: 'pointer' }}
          >
            <option value="">Tous les statuts</option>
            <option value="completed">Terminé</option>
            <option value="started">En cours</option>
          </select>

          {enrichLoading && (
            <span style={{ fontSize: '0.78rem', color: 'var(--slate-400)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid #CBD5E1', borderTopColor: '#1A9DB8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              Enrichissement en cours…
            </span>
          )}
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
            <p style={{ fontWeight: 600 }}>Aucun résultat pour ces filtres</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th><Building2 size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} />Entreprise</th>
                  <th><User size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} />Renseigné par</th>
                  <th><Mail size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} />Email</th>
                  <th><Calendar size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} />Date</th>
                  <th><ClipboardList size={14} style={{ marginRight: '5px', verticalAlign: 'middle' }} />Module</th>
                  <th>Progression</th>
                  <th>Statut</th>
                  <th style={{ textAlign: 'right' }}>Détail</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr
                    key={item.diagnosticRunId}
                    onClick={() => handleRowClick(item)}
                    style={{ cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,157,184,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = ''}
                  >
                    {/* Entreprise */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Building2 size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--adm-text)' }}>
                            {item.businessName !== '[business_name non disponible]' ? item.businessName : (item.businessId ? `…${item.businessId.slice(-8)}` : '—')}
                          </div>
                          {item.businessSector && (
                            <div style={{ fontSize: '0.72rem', color: 'var(--slate-400)' }}>{item.businessSector}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Nom */}
                    <td style={{ fontSize: '0.86rem', color: 'var(--adm-text)', fontWeight: 600 }}>
                      {item.userName || (item.userId ? `…${item.userId.slice(-8)}` : '—')}
                    </td>

                    {/* Email */}
                    <td style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
                      {item.userEmail ? (
                        <a href={`mailto:${item.userEmail}`} onClick={e => e.stopPropagation()} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {item.userEmail}
                        </a>
                      ) : '—'}
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

                    {/* Progression */}
                    <td>
                      <div style={{ minWidth: '100px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--slate-500)', fontWeight: 600 }}>
                            {item.questionCountAnswered}/{item.questionCountExpected}
                          </span>
                        </div>
                        <div style={{ height: '5px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%',
                            width: `${item.questionCountExpected > 0 ? Math.min((item.questionCountAnswered / item.questionCountExpected) * 100, 100) : 0}%`,
                            background: item.isCompleted ? '#10B981' : '#F59E0B',
                            borderRadius: '4px',
                            transition: 'width 0.4s ease',
                          }} />
                        </div>
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

      {/* Spin animation */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
