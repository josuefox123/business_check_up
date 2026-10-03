import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  CheckCheck,
  XCircle,
  X,
  Info,
} from 'lucide-react';
import { apiFetch } from '../../../api/config.js';

// ─── Constants & Helpers ──────────────────────────────────────────────────────

const ALL_MODULES = [
  { code: 'FLH-01', label: 'FLH-01 — Flash Diagnostic' },
  { code: 'PRJ-02', label: 'PRJ-02 — Diagnostic Projet' },
  { code: 'DIF-03', label: 'DIF-03 — Difficultés & Restructuration' },
  { code: 'OPP-04', label: 'OPP-04 — Opportunités & Croissance' },
  { code: 'PRO-05', label: 'PRO-05 — Produits & Offre' },
  { code: 'COM-06', label: 'COM-06 — Commercial & Marché' },
  { code: 'FIN-07', label: 'FIN-07 — Finance & Stratégie' },
  { code: 'GOV-08', label: 'GOV-08 — Gouvernance & Organisation' },
  { code: '360-09', label: '360-09 — Diagnostic Global 360°' },
];

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
  const location = useLocation();
  const passedState = location.state || {};
  const initialSearch = passedState.searchTerm || '';

  // ── State ──
  const [currentPage, setCurrentPage] = useState(1);
  const [historyData, setHistoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [moduleFilter, setModuleFilter] = useState('');
  const [statusTab, setStatusTab] = useState('all'); // 'all' | 'completed' | 'in_progress'

  // Debounce search input (350ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch diagnostics with backend filtering & pagination
  const fetchDiagnostics = async (page = 1) => {
    setIsLoading(true);
    setIsError(false);
    setErrorMessage('');
    try {
      const params = new URLSearchParams();
      params.set('page', page);
      params.set('per_page', 30);

      if (statusTab !== 'all') {
        params.set('completion_status', statusTab);
      }
      if (moduleFilter) {
        params.set('module_code', moduleFilter);
      }
      if (debouncedSearch.trim()) {
        params.set('search', debouncedSearch.trim());
      }

      const res = await apiFetch(`/admin/dashboard/diagnostics?${params.toString()}`);
      setHistoryData(res || null);
      setCurrentPage(page);
    } catch (err) {
      console.error('[DiagnosticHistoryScreen] fetch error:', err);
      setIsError(true);
      setErrorMessage(err?.message ?? 'Impossible de charger la liste des diagnostics.');
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch when page or any filter changes
  useEffect(() => {
    fetchDiagnostics(currentPage);
  }, [currentPage, statusTab, moduleFilter, debouncedSearch]);

  // Reset to page 1 whenever filters change
  const handleStatusTabChange = (newTab) => {
    if (newTab !== statusTab) {
      setStatusTab(newTab);
      setCurrentPage(1);
    }
  };

  const handleModuleChange = (newModule) => {
    setModuleFilter(newModule);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setModuleFilter('');
    setStatusTab('all');
    setCurrentPage(1);
  };

  // ─── Normalization (Rule 9) ─────────────────────────────────────────────────

  const rawItems = historyData?.data ?? [];

  const paginationInfo = {
    currentPage: historyData?.current_page ?? 1,
    lastPage: historyData?.last_page ?? 1,
    total: historyData?.total ?? 0,
    perPage: historyData?.per_page ?? 30,
  };

  const normalizedItems = rawItems.map((item, idx) => {
    const user = item?.user ?? null;
    const userName = user?.full_name ?? null;
    const userEmail = user?.email ?? null;
    const userPhone = user?.phone_number ?? null;

    const rawStatus = item?.completion_status ?? 'in_progress';
    const isCompleted = rawStatus === 'completed';
    const questionCountExpected = item?.question_count_expected ?? 0;
    const questionCountAnswered = item?.question_count_answered ?? 0;
    const hasAnswers = questionCountAnswered > 0;

    const business = item?.business ?? null;
    const businessName = business?.business_name ?? null;
    const sector = business?.sector ?? null;
    const subSector = business?.sub_sector ?? null;

    return {
      diagnosticRunId: item?.diagnostic_run_id ?? `RUN-${idx}`,
      userId: item?.user_id ?? item?.user?.id ?? item?.user?.user_id ?? null,
      businessId: item?.business_id ?? item?.business?.id ?? null,
      businessName,
      sector,
      subSector,
      userName,
      userEmail,
      userPhone,
      moduleCode: item?.module_code ?? 'Module',
      moduleFamily: item?.module_family ?? 'Diagnostic',
      completionStatus: rawStatus,
      isCompleted,
      hasAnswers,
      startedAt: formatDate(item?.started_at),
      completedAt: item?.completed_at ? formatDate(item.completed_at) : null,
      questionCountExpected,
      questionCountAnswered,
      originalItem: item,
    };
  });

  const hasItems = !isLoading && !isError && normalizedItems.length > 0;
  const showEmpty = !isLoading && !isError && normalizedItems.length === 0;

  // ── Navigate to detail page ──
  const handleRowClick = (item) => {
    navigate(`/admin/diagnostics/${item.diagnosticRunId}`, {
      state: {
        run: item.originalItem,
        userId: item.userId,
        businessName: item.businessName,
        userName: item.userName,
        userEmail: item.userEmail,
        userPhone: item.userPhone,
        sector: item.sector,
        moduleCode: item.moduleCode,
      },
    });
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="admin-page animate-fade-up" style={{ fontFamily: 'Lato, -apple-system, BlinkMacSystemFont, sans-serif' }}>

      {/* ── Page Header ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid #E2E8F0',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{
              margin: 0,
              fontSize: '1.65rem',
              fontWeight: 900,
              color: '#17212D',
              letterSpacing: '-0.02em',
            }}>
              Historique des Diagnostics
            </h1>
            <span style={{
              background: '#17212D',
              color: '#FFFFFF',
              fontSize: '0.78rem',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: '6px',
            }}>
              {paginationInfo.total} diagnostics
            </span>
          </div>
          <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '0.88rem' }}>
            Suivi consolidé des diagnostics d'entreprises — bilans finalisés, progressions et rapports stratégiques.
          </p>
        </div>

        <button
          onClick={() => fetchDiagnostics(currentPage)}
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
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={15} style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }} />
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
              Guide de lecture du registre
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
              Précision de suivi
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: 1.5 }}>
            Ce registre recense l'intégralité des parcours thématiques enregistrés sur la plateforme. Utilisez les filtres ci-dessous pour distinguer les <strong>bilans finalisés</strong> (disposant d'un calcul de score et d'un rapport de restitution) des <strong>parcours en cours ou non débutés</strong>.
            Pour certains dossiers complétés, le total de questions répondues peut être supérieur au format standard (ex. 19/14) lorsque le déclarant a répondu aux questions d'enrichissement supplémentaires.
          </p>
        </div>
      </div>

      {/* ── Filter Bar (Segmented Tabs + Search + Module Dropdown) ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '16px',
      }}>

        {/* Tabs de Statut sans compteurs factices */}
        <div style={{
          display: 'inline-flex',
          background: '#F1F5F9',
          padding: '3px',
          borderRadius: '6px',
          gap: '2px',
        }}>
          <button
            type="button"
            onClick={() => handleStatusTabChange('all')}
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
            }}
          >
            Tous
          </button>

          <button
            type="button"
            onClick={() => handleStatusTabChange('completed')}
            style={{
              border: 'none',
              background: statusTab === 'completed' ? '#17212D' : 'transparent',
              color: statusTab === 'completed' ? '#FFFFFF' : '#475569',
              fontWeight: statusTab === 'completed' ? 800 : 600,
              fontSize: '0.82rem',
              padding: '6px 14px',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Finalisés
          </button>

          <button
            type="button"
            onClick={() => handleStatusTabChange('in_progress')}
            style={{
              border: 'none',
              background: statusTab === 'in_progress' ? '#17212D' : 'transparent',
              color: statusTab === 'in_progress' ? '#FFFFFF' : '#475569',
              fontWeight: statusTab === 'in_progress' ? 800 : 600,
              fontSize: '0.82rem',
              padding: '6px 14px',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            En cours / Non débutés
          </button>
        </div>

        {/* Search input + Module dropdown */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>

          {/* Champ de recherche */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Rechercher entreprise, déclarant..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '34px',
                paddingRight: searchTerm ? '30px' : '12px',
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
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '2px',
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sélecteur de module */}
          <select
            value={moduleFilter}
            onChange={e => handleModuleChange(e.target.value)}
            style={{
              height: '36px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#17212D',
              fontSize: '0.82rem',
              fontWeight: 600,
              padding: '0 12px',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="">Tous les modules</option>
            {ALL_MODULES.map(mod => (
              <option key={mod.code} value={mod.code}>{mod.label}</option>
            ))}
          </select>

          {/* Reset Filters button if active */}
          {(searchTerm || moduleFilter || statusTab !== 'all') && (
            <button
              onClick={handleClearFilters}
              style={{
                height: '36px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1',
                background: '#F8FAFC',
                color: '#64748B',
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '0 10px',
                cursor: 'pointer',
              }}
              title="Réinitialiser tous les filtres"
            >
              Effacer
            </button>
          )}
        </div>
      </div>

      {/* ── Table Card ── */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '6px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        overflow: 'hidden',
      }}>

        {/* Loading State */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
            <RotateCcw size={28} style={{ animation: 'spin 1s linear infinite', marginBottom: '10px', color: '#34BED5' }} />
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#17212D' }}>Chargement des diagnostics...</div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && isError && (
          <div style={{ textAlign: 'center', padding: '48px 20px' }}>
            <AlertOctagon size={32} color="#DC2626" style={{ marginBottom: '10px' }} />
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#991B1B', marginBottom: '6px' }}>Erreur de chargement</div>
            <p style={{ color: '#B91C1C', fontSize: '0.85rem', margin: '0 0 16px' }}>{errorMessage}</p>
            <button
              onClick={() => fetchDiagnostics(currentPage)}
              style={{
                borderRadius: '6px',
                background: '#17212D',
                border: 'none',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.82rem',
                padding: '8px 16px',
                cursor: 'pointer',
              }}
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Empty State */}
        {showEmpty && (
          <div style={{ textAlign: 'center', padding: '56px 20px' }}>
            <Search size={32} color="#94A3B8" style={{ marginBottom: '10px' }} />
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#17212D', marginBottom: '6px' }}>
              Aucun diagnostic ne correspond à vos critères
            </div>
            <p style={{ color: '#64748B', fontSize: '0.85rem', margin: '0 0 16px' }}>
              Essayez de modifier votre recherche ou de réinitialiser les filtres appliqués.
            </p>
            <button
              onClick={handleClearFilters}
              style={{
                borderRadius: '6px',
                background: '#17212D',
                border: 'none',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.82rem',
                padding: '8px 16px',
                cursor: 'pointer',
              }}
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Table View */}
        {hasItems && (
          <div className="admin-table-wrap" style={{ overflowX: 'auto' }}>
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '12px 16px', fontSize: '0.74rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Entreprise &amp; Déclarant
                  </th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Module
                  </th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Statut &amp; Réponses
                  </th>
                  <th style={{ padding: '12px 14px', fontSize: '0.74rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Date
                  </th>
                  <th style={{ padding: '12px 16px', fontSize: '0.74rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {normalizedItems.map((item) => (
                  <tr
                    key={item.diagnosticRunId}
                    onClick={() => handleRowClick(item)}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      cursor: 'pointer',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
                    onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
                  >
                    {/* Colonne 1 : Entreprise & Déclarant */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          background: item.businessName ? '#EFF6FF' : '#F1F5F9',
                          color: item.businessName ? '#34BED5' : '#94A3B8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <Building2 size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#17212D' }}>
                            {item.businessName || 'PME non enregistrée'}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <span>{item.sector ? item.sector : 'Secteur non spécifié'}</span>
                            {item.userName && (
                              <>
                                <span style={{ color: '#CBD5E1' }}>•</span>
                                <span style={{ color: '#0284C7', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                  <User size={11} />
                                  {item.userName}
                                  {item.userEmail ? ` (${item.userEmail})` : ''}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Colonne 2 : Module */}
                    <td style={{ padding: '14px 14px' }}>
                      <div>
                        <span style={{
                          display: 'inline-block',
                          fontWeight: 800,
                          fontSize: '0.78rem',
                          background: '#17212D',
                          color: '#FFFFFF',
                          padding: '2px 7px',
                          borderRadius: '4px',
                          letterSpacing: '0.02em',
                        }}>
                          {item.moduleCode}
                        </span>
                        <div style={{ fontSize: '0.73rem', color: '#64748B', marginTop: '3px' }}>
                          {item.moduleFamilyLabel}
                        </div>
                      </div>
                    </td>

                    {/* Colonne 3 : Statut & Réponses */}
                    <td style={{ padding: '14px 14px' }}>
                      <div>
                        {item.isCompleted ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 800,
                            fontSize: '0.76rem',
                            color: '#065F46',
                            background: '#ECFDF5',
                            padding: '3px 8px',
                            borderRadius: '4px',
                          }}>
                            <CheckCircle2 size={12} /> Finalisé
                          </span>
                        ) : item.hasAnswers ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 800,
                            fontSize: '0.76rem',
                            color: '#92400E',
                            background: '#FEF3C7',
                            padding: '3px 8px',
                            borderRadius: '4px',
                          }}>
                            <Clock size={12} /> En cours
                          </span>
                        ) : (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 700,
                            fontSize: '0.74rem',
                            color: '#64748B',
                            background: '#F1F5F9',
                            padding: '3px 8px',
                            borderRadius: '4px',
                          }}>
                            <XCircle size={12} color="#94A3B8" /> Non débuté
                          </span>
                        )}

                        <div style={{ fontSize: '0.73rem', color: '#64748B', marginTop: '3px', fontWeight: 600 }}>
                          {item.questionCountAnswered > 0 ? (
                            item.questionCountExpected > 0 && item.questionCountAnswered > item.questionCountExpected ? (
                              <span>
                                {item.questionCountAnswered} / {item.questionCountExpected} questions{' '}
                                <span style={{ color: '#0284C7', fontWeight: 700 }} title="Questions de base + enrichissement complétées">
                                  (+{item.questionCountAnswered - item.questionCountExpected} enrichies)
                                </span>
                              </span>
                            ) : (
                              `${item.questionCountAnswered} / ${item.questionCountExpected || '14'} questions`
                            )
                          ) : (
                            '0 question répondue'
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Colonne 5 : Date */}
                    <td style={{ padding: '14px 14px', fontSize: '0.8rem', color: '#475569', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: 600 }}>{item.startedAt}</div>
                      {item.completedAt && (
                        <div style={{ fontSize: '0.72rem', color: '#059669', marginTop: '2px' }}>
                          Fini : {item.completedAt}
                        </div>
                      )}
                    </td>

                    {/* Colonne 6 : Actions */}
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }} onClick={e => e.stopPropagation()}>

                        {/* Bouton Voir */}
                        <a
                          href={`/admin/diagnostics/${item.diagnosticRunId}?userId=${item.userId || ''}&businessName=${encodeURIComponent(item.businessName || '')}&userName=${encodeURIComponent(item.userName || '')}&userEmail=${encodeURIComponent(item.userEmail || '')}&userPhone=${encodeURIComponent(item.userPhone || '')}&sector=${encodeURIComponent(item.sector || '')}&moduleCode=${encodeURIComponent(item.moduleCode || '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            borderRadius: '6px',
                            border: '1px solid #CBD5E1',
                            background: '#FFFFFF',
                            color: '#17212D',
                            padding: '5px 10px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = '#34BED5';
                            e.currentTarget.style.color = '#34BED5';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = '#CBD5E1';
                            e.currentTarget.style.color = '#17212D';
                          }}
                          title="Consulter les détails du diagnostic (nouvel onglet)"
                        >
                          <ExternalLink size={13} /> Voir
                        </a>

                        {/* Bouton Rapport PDF */}
                        {item.isCompleted || item.questionCountAnswered > 0 ? (
                          <a
                            href={`/admin/diagnostics/${item.diagnosticRunId}/report?userId=${item.userId || ''}&businessName=${encodeURIComponent(item.businessName || '')}&userName=${encodeURIComponent(item.userName || '')}&userEmail=${encodeURIComponent(item.userEmail || '')}&userPhone=${encodeURIComponent(item.userPhone || '')}&sector=${encodeURIComponent(item.sector || '')}&moduleCode=${encodeURIComponent(item.moduleCode || '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              borderRadius: '6px',
                              border: '1px solid #059669',
                              background: '#ECFDF5',
                              color: '#065F46',
                              padding: '5px 10px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              textDecoration: 'none',
                              transition: 'all 0.15s ease',
                            }}
                            title="Consulter le rapport stratégique & PDF (nouvel onglet)"
                          >
                            <FileText size={13} /> PDF
                          </a>
                        ) : (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              color: '#94A3B8',
                              background: '#F1F5F9',
                              padding: '5px 8px',
                              borderRadius: '4px',
                              fontWeight: 600,
                            }}
                            title="Ce diagnostic n'a pas été complété. Aucun rapport disponible."
                          >
                            Non débuté
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination Footer ── */}
        {hasItems && paginationInfo.lastPage > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 18px',
            borderTop: '1px solid #E2E8F0',
            background: '#F8FAFC',
            flexWrap: 'wrap',
            gap: '10px',
          }}>
            <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>
              Page {paginationInfo.currentPage} sur {paginationInfo.lastPage} · {paginationInfo.total} diagnostics
            </span>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => fetchDiagnostics(currentPage - 1)}
                disabled={currentPage <= 1 || isLoading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: currentPage <= 1 ? '#94A3B8' : '#17212D',
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                }}
              >
                <ChevronLeft size={14} /> Précédent
              </button>

              <button
                onClick={() => fetchDiagnostics(currentPage + 1)}
                disabled={currentPage >= paginationInfo.lastPage || isLoading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  borderRadius: '6px',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: currentPage >= paginationInfo.lastPage ? '#94A3B8' : '#17212D',
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: currentPage >= paginationInfo.lastPage ? 'not-allowed' : 'pointer',
                }}
              >
                Suivant <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default DiagnosticHistoryScreen;
