import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  AlertTriangle,
  RotateCcw,
  Building2,
  User,
  CheckCircle2,
  Clock,
  ClipboardList,
  MessageSquare,
  Flag,
  Calendar,
  ExternalLink,
  FileText,
  Mail,
  Phone,
  ShieldAlert,
  Sparkles,
  Info,
  Check,
  ChevronRight,
  Filter,
  CheckCircle,
  AlertCircle,
  XCircle,
} from 'lucide-react';
import { apiFetch } from '../../../api/config.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const DIMENSION_STYLES = {
  finance: { bg: '#EFF6FF', text: '#1D4ED8', label: 'Finance' },
  commercial: { bg: '#F5F3FF', text: '#6D28D9', label: 'Commercial' },
  operations: { bg: '#FFFBEB', text: '#B45309', label: 'Opérations' },
  gouvernance: { bg: '#F0FDF4', text: '#15803D', label: 'Gouvernance' },
  produit: { bg: '#FEF2F2', text: '#B91C1C', label: 'Produit / Offre' },
  rh: { bg: '#FDF2F8', text: '#BE185D', label: 'Ressources Humaines' },
  meta: { bg: '#F8FAFC', text: '#475569', label: 'Général' },
};

const getDimensionStyle = (dim) => {
  const key = (dim || 'meta').toLowerCase();
  return DIMENSION_STYLES[key] ?? { bg: '#F8FAFC', text: '#475569', label: dim || 'Général' };
};

const extractDiagnosticsList = (res) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data?.diagnostics)) return res.data.diagnostics;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.diagnostics)) return res.diagnostics;
  return [];
};

// ─── Component ────────────────────────────────────────────────────────────────

export const DiagnosticRunDetailScreen = () => {
  const { runId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Data passed from list via navigation state (fast initial render)
  const passedState = location.state || {};
  const passedRun = passedState.run ?? null;

  // Search parameters from URL query string
  const queryParams = new URLSearchParams(location.search);
  const rawQueryUserId = queryParams.get('userId');
  const cleanQueryUserId = (rawQueryUserId && rawQueryUserId !== 'null' && rawQueryUserId !== 'undefined') ? rawQueryUserId : null;
  const queryBusinessName = queryParams.get('businessName') ? decodeURIComponent(queryParams.get('businessName')) : null;
  const queryUserName = queryParams.get('userName') ? decodeURIComponent(queryParams.get('userName')) : null;
  const queryUserEmail = queryParams.get('userEmail') ? decodeURIComponent(queryParams.get('userEmail')) : null;
  const queryUserPhone = queryParams.get('userPhone') ? decodeURIComponent(queryParams.get('userPhone')) : null;
  const querySector = queryParams.get('sector') ? decodeURIComponent(queryParams.get('sector')) : null;
  const queryModuleCode = queryParams.get('moduleCode') ? decodeURIComponent(queryParams.get('moduleCode')) : null;

  const passedUserId = passedState.userId ?? cleanQueryUserId ?? passedRun?.user_id ?? null;

  // ── State ──
  const [detailData, setDetailData] = useState(passedState.detail || passedRun || null);
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichError, setEnrichError] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState('all');

  // Helper function to merge user, business and question responses non-destructively
  const mergeDetails = (existing, incoming, rootUser = null) => {
    if (!incoming) return existing;
    if (!existing) return incoming;

    const userA = existing?.user ?? null;
    const userB = incoming?.user ?? rootUser ?? null;
    const businessA = existing?.business ?? null;
    const businessB = incoming?.business ?? null;

    const mergedUser = (userA || userB) ? {
      ...(userB || {}),
      ...(userA || {}),
    } : null;

    if (mergedUser) {
      if (!mergedUser.full_name && userB?.full_name) mergedUser.full_name = userB.full_name;
      if (!mergedUser.email && userB?.email) mergedUser.email = userB.email;
      if (!mergedUser.phone_number && (userB?.phone_number || userB?.phone)) {
        mergedUser.phone_number = userB?.phone_number || userB?.phone;
      }
    }

    const mergedBusiness = (businessA || businessB) ? {
      ...(businessB || {}),
      ...(businessA || {}),
    } : null;

    if (mergedBusiness) {
      if (!mergedBusiness.business_name && businessB?.business_name) mergedBusiness.business_name = businessB.business_name;
      if (!mergedBusiness.sector && businessB?.sector) mergedBusiness.sector = businessB.sector;
    }

    const rawExistingResp = existing?.question_responses || existing?.responses || [];
    const rawIncomingResp = incoming?.question_responses || incoming?.responses || [];

    const resp = (Array.isArray(rawExistingResp) && rawExistingResp.length > 0)
      ? rawExistingResp
      : (Array.isArray(rawIncomingResp) && rawIncomingResp.length > 0)
        ? rawIncomingResp
        : [];

    return {
      ...incoming,
      ...existing,
      user: mergedUser,
      business: mergedBusiness,
      question_responses: resp,
    };
  };

  // Eager enrichment from admin diagnostics list and direct details endpoint
  const tryEnrichDetail = async () => {
    setIsEnriching(true);
    setEnrichError(false);
    try {
      let matched = detailData ? { ...detailData } : null;

      // 1. Appel direct du diagnostic avec ses relations (questionResponses, user, business, etc.)
      const resDirect = await apiFetch(`/diagnostics/${runId}/details`).catch(() => null);
      const directData = resDirect?.data || resDirect;
      if (directData && typeof directData === 'object' && directData.diagnostic_run_id) {
        matched = mergeDetails(matched, directData);
      }

      // 2. Recherche complémentaire dans la liste paginée des diagnostics admin
      if (!matched?.user?.full_name || !matched?.business?.business_name) {
        const resDiag = await apiFetch(`/admin/dashboard/diagnostics?per_page=100`).catch(() => null);
        const list = extractDiagnosticsList(resDiag);
        let found = list.find(r => r?.diagnostic_run_id === runId);

        if (!found && resDiag?.data?.pagination?.total_pages > 1) {
          const resDiagP2 = await apiFetch(`/admin/dashboard/diagnostics?page=2&per_page=100`).catch(() => null);
          const listP2 = extractDiagnosticsList(resDiagP2);
          found = listP2.find(r => r?.diagnostic_run_id === runId);
        }

        if (found) {
          matched = mergeDetails(matched, found);
        }
      }

      // 3. Fallback d'enrichissement historique par utilisateur si les réponses ne sont pas encore chargées
      const currentResponses = matched?.question_responses || matched?.questionResponses || [];
      if (!currentResponses || currentResponses.length === 0) {
        const targetUserId =
          matched?.user_id
          ?? matched?.user?.user_id
          ?? matched?.user?.id
          ?? matched?.business?.user_id
          ?? passedUserId
          ?? null;

        if (targetUserId) {
          const resHist = await apiFetch(`/admin/dashboard/${targetUserId}/historical`).catch(() => null);
          let histList = [];
          if (Array.isArray(resHist)) {
            histList = resHist;
          } else if (Array.isArray(resHist?.data)) {
            histList = resHist.data;
          }

          const histMatched = histList.find(r => r?.diagnostic_run_id === runId);
          if (histMatched) {
            matched = mergeDetails(matched, histMatched, matched?.user || null);
          }
        }
      }

      if (matched) {
        setDetailData(matched);
      }
    } catch (err) {
      console.warn('[DiagnosticRunDetailScreen] Enrichment error:', err);
      setEnrichError(true);
    } finally {
      setIsEnriching(false);
    }
  };

  useEffect(() => {
    tryEnrichDetail();
  }, [runId]);

  // ─── Normalization (Rule 9) ─────────────────────────────────────────────────

  const run = detailData ?? passedRun ?? {};
  const business = detailData?.business ?? run?.business ?? null;

  const runIdDisplay = run?.diagnostic_run_id ?? runId ?? 'Non identifié';
  const moduleCode = run?.module_code ?? passedState.moduleCode ?? queryModuleCode ?? 'Module stratégique';
  const moduleFamily = run?.module_family ?? passedState.moduleFamily ?? 'Diagnostic';
  const completionStatus = run?.completion_status ?? (run?.completed_at ? 'completed' : 'in_progress');
  const isCompleted = completionStatus === 'completed';
  const startedAt = formatDate(run?.started_at);
  const completedAt = run?.completed_at ? formatDate(run.completed_at) : null;
  const questionCountExpected = run?.question_count_expected ?? 0;
  const questionCountAnswered = run?.question_count_answered ?? 0;

  // Entreprise
  const rawBusinessName = business?.business_name ?? passedState.businessName ?? queryBusinessName ?? null;
  const businessName = (rawBusinessName && !rawBusinessName.includes('[')) ? rawBusinessName : null;
  const businessSector = business?.sector ?? passedState.sector ?? querySector ?? null;
  const businessRegion = business?.region ?? null;
  const businessCountry = business?.country ?? null;

  // Déclarant / Contact (avec repli poli et sans crochets bruts)
  const userObj = run?.user ?? business?.user ?? run?.business?.user ?? detailData?.user ?? null;

  const rawUserName = userObj?.full_name ?? passedState.userName ?? queryUserName ?? null;
  const userName = (rawUserName && !rawUserName.includes('[') && rawUserName.trim() !== '') ? rawUserName : null;

  const rawUserEmail = userObj?.email ?? passedState.userEmail ?? queryUserEmail ?? null;
  const userEmail = (rawUserEmail && !rawUserEmail.includes('[') && rawUserEmail.trim() !== '') ? rawUserEmail : null;

  const rawUserPhone = userObj?.phone_number ?? userObj?.phone ?? passedState.userPhone ?? queryUserPhone ?? null;
  const userPhone = (rawUserPhone && !rawUserPhone.includes('[') && rawUserPhone.trim() !== '') ? rawUserPhone : null;

  // Questions & Réponses Normalization
  const rawResponses = detailData?.question_responses
    || detailData?.questionResponses
    || detailData?.responses
    || [];

  const normalizedResponses = rawResponses.map((resp, idx) => {
    const questionText = resp?.question?.text
      ?? resp?.question_text
      ?? (resp?.question_id ? `Question réf. ${resp.question_id}` : `Question #${idx + 1}`);

    const answerLabel = resp?.answer_label ?? null;
    const answerText = resp?.answer_text ?? null;
    const answerValue = resp?.answer_value ?? null;

    let displayAnswer = answerLabel || answerText;
    if (!displayAnswer && answerValue) {
      if (typeof answerValue === 'string') {
        try {
          const parsed = JSON.parse(answerValue);
          if (Array.isArray(parsed)) {
            displayAnswer = parsed.join(', ');
          } else if (typeof parsed === 'string') {
            displayAnswer = parsed;
          } else {
            displayAnswer = String(parsed);
          }
        } catch {
          displayAnswer = answerValue.replace(/^"|"$/g, '').replace(/\\"/g, '"');
        }
      } else if (Array.isArray(answerValue)) {
        displayAnswer = answerValue.join(', ');
      } else {
        displayAnswer = JSON.stringify(answerValue);
      }
    }
    if (!displayAnswer) displayAnswer = 'Non renseigné';

    const dim = (resp?.question_dimension || resp?.dimension || 'meta').toLowerCase();

    return {
      id: resp?.response_id ?? `RESP-${idx}`,
      questionId: resp?.question_id ?? `Q-${idx + 1}`,
      questionText,
      displayAnswer,
      dimension: dim,
      isCritical: Boolean(resp?.is_critical_question),
      redFlagTriggered: Boolean(resp?.red_flag_triggered),
      redFlagCode: resp?.red_flag_code ?? null,
      score15: resp?.score_1_5 ?? null,
      answeredAt: resp?.answered_at ? formatDate(resp.answered_at) : null,
    };
  });

  const hasResponses = normalizedResponses.length > 0;
  const redFlagCount = normalizedResponses.filter(r => r.redFlagTriggered).length;

  // Contrôle rigoureux de l'état réel du diagnostic
  const hasAnsweredQuestions = (questionCountAnswered > 0) || hasResponses;
  const canViewReport = hasAnsweredQuestions && isCompleted;

  // Filtrage par dimension
  const availableDimensions = ['all', ...new Set(normalizedResponses.map(r => r.dimension))];
  const filteredResponses = selectedDimension === 'all'
    ? normalizedResponses
    : normalizedResponses.filter(r => r.dimension === selectedDimension);

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="admin-page animate-fade-up" style={{ fontFamily: 'Lato, -apple-system, BlinkMacSystemFont, sans-serif' }}>

      {/* ── Top Header Bar ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid #E2E8F0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => navigate('/admin/diagnostics')}
            className="btn btn-ghost btn-sm"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#17212D',
              fontWeight: 700,
              padding: '8px 14px',
            }}
          >
            <ArrowLeft size={16} /> Retour aux diagnostics
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{
                margin: 0,
                fontSize: '1.45rem',
                fontWeight: 900,
                color: '#17212D',
                letterSpacing: '-0.02em',
              }}>
                Détail du diagnostic
              </h1>
              <span style={{
                background: '#17212D',
                color: '#FFFFFF',
                fontSize: '0.78rem',
                fontWeight: 800,
                padding: '3px 9px',
                borderRadius: '6px',
                letterSpacing: '0.04em',
              }}>
                {moduleCode}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={tryEnrichDetail}
            disabled={isEnriching}
            className="btn btn-ghost btn-sm"
            title="Rafraîchir les données"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#475569',
              fontWeight: 600,
              padding: '8px 14px',
            }}
          >
            <RotateCcw size={15} style={{ animation: isEnriching ? 'spin 1s linear infinite' : 'none' }} />
            {isEnriching ? 'Actualisation...' : 'Actualiser'}
          </button>

          {/* Bouton Voir le rapport - Seulement si le diagnostic a des réponses et est complété ! */}
          {canViewReport ? (
            <button
              onClick={() => navigate(`/admin/diagnostics/${runId}/report`, {
                state: {
                  run,
                  userId: passedUserId,
                  userName: userName || 'Déclarant non renseigné',
                  userEmail: userEmail || '',
                  userPhone: userPhone || '',
                  businessName: businessName || 'PME',
                  sector: businessSector,
                }
              })}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '6px',
                background: '#17212D',
                border: '1px solid #17212D',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.88rem',
                padding: '8px 18px',
                cursor: 'pointer',
                transition: 'background 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#34BED5';
                e.currentTarget.style.borderColor = '#34BED5';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = '#17212D';
                e.currentTarget.style.borderColor = '#17212D';
              }}
            >
              <FileText size={16} />
              Consulter le rapport stratégique
            </button>
          ) : (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#F1F5F9',
                border: '1px solid #E2E8F0',
                color: '#64748B',
                borderRadius: '6px',
                padding: '8px 14px',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
              title="Le diagnostic n'a pas été renseigné. Aucun rapport n'est disponible."
            >
              <AlertCircle size={15} />
              Rapport indisponible (0 réponse)
            </div>
          )}
        </div>
      </div>

      {/* ── Notification Banner if sync warning ── */}
      {enrichError && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#FFFBEB',
          border: '1px solid #FCD34D',
          borderLeft: '4px solid #D97706',
          borderRadius: '6px',
          padding: '12px 16px',
          marginBottom: '20px',
          fontSize: '0.85rem',
          color: '#92400E',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="#D97706" />
            <span>
              Certaines métadonnées n'ont pas pu être synchronisées automatiquement depuis le serveur. Les données locales disponibles sont affichées.
            </span>
          </div>
          <button
            onClick={tryEnrichDetail}
            style={{
              background: 'transparent',
              border: '1px solid #D97706',
              borderRadius: '4px',
              color: '#92400E',
              fontWeight: 700,
              fontSize: '0.78rem',
              padding: '4px 10px',
              cursor: 'pointer',
            }}
          >
            Réessayer
          </button>
        </div>
      )}

      {/* ── Summary Cards Grid (True North Style: 6px radii, #34BED5 left border) ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '16px',
        marginBottom: '28px',
      }}>

        {/* Carte 1 : Entreprise */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderLeft: '3px solid #34BED5',
          borderRadius: '6px',
          padding: '18px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Building2 size={16} color="#34BED5" />
            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B' }}>
              Entreprise
            </span>
          </div>
          <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#17212D', lineHeight: 1.3 }}>
            {businessName || 'PME en qualification'}
          </div>
          {businessSector ? (
            <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '4px', fontWeight: 500 }}>
              {businessSector}
            </div>
          ) : (
            <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginTop: '4px', fontStyle: 'italic' }}>
              Secteur non spécifié
            </div>
          )}
          {(businessRegion || businessCountry) && (
            <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
              {[businessRegion, businessCountry].filter(Boolean).join(' · ')}
            </div>
          )}
        </div>

        {/* Carte 2 : Renseigné par / Contact */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderLeft: '3px solid #17212D',
          borderRadius: '6px',
          padding: '18px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <User size={16} color="#17212D" />
            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B' }}>
              Renseigné par
            </span>
          </div>

          {userName ? (
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#17212D' }}>
                {userName}
              </div>
              {userEmail && (
                <div style={{ marginTop: '4px' }}>
                  <a
                    href={`mailto:${userEmail}`}
                    style={{
                      fontSize: '0.78rem',
                      color: '#0284C7',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: 600,
                    }}
                  >
                    <Mail size={12} /> {userEmail}
                  </a>
                </div>
              )}
              {userPhone && (
                <div style={{ marginTop: '2px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Phone size={12} /> {userPhone}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: '#F1F5F9',
                color: '#475569',
                fontSize: '0.76rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '4px',
              }}>
                Session libre (Anonyme)
              </div>
              <div style={{ fontSize: '0.73rem', color: '#64748B', marginTop: '4px' }}>
                Diagnostic réalisé sans création préalable de compte utilisateur
              </div>
            </div>
          )}
        </div>

        {/* Carte 3 : Module d'audit */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderLeft: '3px solid #34BED5',
          borderRadius: '6px',
          padding: '18px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <ClipboardList size={16} color="#34BED5" />
            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B' }}>
              Module d'audit
            </span>
          </div>
          <div style={{ fontWeight: 900, fontSize: '1.25rem', color: '#17212D' }}>
            {moduleCode}
          </div>
          <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '2px', textTransform: 'capitalize' }}>
            {moduleFamily}
          </div>
        </div>

        {/* Carte 4 : Statut & Horodatage */}
        <div style={{
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderLeft: `3px solid ${hasAnsweredQuestions ? (isCompleted ? '#10B981' : '#D97706') : '#94A3B8'}`,
          borderRadius: '6px',
          padding: '18px 20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Calendar size={16} color={hasAnsweredQuestions ? (isCompleted ? '#10B981' : '#D97706') : '#94A3B8'} />
            <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B' }}>
              Statut du parcours
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            {hasAnsweredQuestions ? (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: 800,
                fontSize: '0.82rem',
                color: isCompleted ? '#065F46' : '#92400E',
                background: isCompleted ? '#ECFDF5' : '#FEF3C7',
                padding: '3px 8px',
                borderRadius: '4px',
              }}>
                {isCompleted ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                {isCompleted ? 'Finalisé' : 'En cours'}
              </span>
            ) : (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: 800,
                fontSize: '0.82rem',
                color: '#475569',
                background: '#F1F5F9',
                padding: '3px 8px',
                borderRadius: '4px',
              }}>
                <XCircle size={13} color="#94A3B8" />
                Non débuté / Abandonné
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
            {hasAnsweredQuestions ? `Débuté : ${startedAt}` : 'Aucune question répondue'}
          </div>
          {completedAt && hasAnsweredQuestions && (
            <div style={{ fontSize: '0.73rem', color: '#065F46', marginTop: '2px', fontWeight: 600 }}>
              Terminé : {completedAt}
            </div>
          )}
        </div>

        {/* Carte 5 (Conditionnelle) : Red flags */}
        {redFlagCount > 0 && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderLeft: '4px solid #EF4444',
            borderRadius: '6px',
            padding: '18px 20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Flag size={16} color="#DC2626" />
              <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#B91C1C' }}>
                Signaux d'alerte
              </span>
            </div>
            <div style={{ fontWeight: 900, fontSize: '1.45rem', color: '#DC2626', lineHeight: 1 }}>
              {redFlagCount}
            </div>
            <div style={{ fontSize: '0.74rem', color: '#B91C1C', marginTop: '4px', fontWeight: 600 }}>
              point{redFlagCount > 1 ? 's' : ''} d'attention critique{redFlagCount > 1 ? 's' : ''} détecté{redFlagCount > 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>

      {/* ── Questionnaire & Réponses Section ── */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '6px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
        overflow: 'hidden',
      }}>

        {/* Section Header */}
        <div style={{
          padding: '16px 22px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          background: '#F8FAFC',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare size={18} color="#17212D" />
            <h2 style={{
              margin: 0,
              fontSize: '1rem',
              fontWeight: 800,
              color: '#17212D',
              letterSpacing: '-0.01em',
            }}>
              Questionnaire &amp; Réponses du diagnostic
            </h2>
            <span style={{
              fontSize: '0.76rem',
              fontWeight: 700,
              color: '#64748B',
              background: '#E2E8F0',
              padding: '2px 8px',
              borderRadius: '4px',
            }}>
              {hasResponses
                ? `${normalizedResponses.length} question(s)`
                : (hasAnsweredQuestions ? 'Synthèse consolidée' : 'Non débuté (0 réponse)')
              }
            </span>
          </div>

          {/* Dimension Filter Tabs (when responses exist) */}
          {hasResponses && availableDimensions.length > 2 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {availableDimensions.map(dim => {
                const isSelected = selectedDimension === dim;
                const label = dim === 'all' ? 'Toutes' : (getDimensionStyle(dim).label);
                const count = dim === 'all' ? normalizedResponses.length : normalizedResponses.filter(r => r.dimension === dim).length;
                return (
                  <button
                    key={dim}
                    onClick={() => setSelectedDimension(dim)}
                    style={{
                      background: isSelected ? '#17212D' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : '#475569',
                      border: `1px solid ${isSelected ? '#17212D' : '#CBD5E1'}`,
                      borderRadius: '4px',
                      padding: '4px 10px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {label} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Conditional Body ── */}
        {!hasAnsweredQuestions ? (
          /* CAS 1 : AUCUN DIAGNOSTIC EFFECTUÉ (0 réponse) -> Message clair et honnête */
          <div style={{ padding: '36px 28px' }}>
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderLeft: '4px solid #64748B',
              borderRadius: '6px',
              padding: '28px 24px',
              maxWidth: '850px',
              margin: '0 auto',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '6px',
                  background: '#F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <AlertCircle size={22} color="#64748B" />
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{
                    margin: '0 0 6px 0',
                    fontSize: '1.08rem',
                    fontWeight: 800,
                    color: '#17212D',
                  }}>
                    Aucun diagnostic effectué — Aucune réponse enregistrée
                  </h3>

                  <p style={{
                    margin: '0 0 16px 0',
                    fontSize: '0.86rem',
                    color: '#475569',
                    lineHeight: 1.5,
                  }}>
                    Ce diagnostic a été créé dans le système (lors de l'étape de triage ou par sélection du module), mais l'entreprise n'a répondu à aucune question. En l'absence de saisie, aucun rapport d'analyse, scoring ou recommandation ne peut être généré.
                  </p>

                  {/* État récapitulatif */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '12px',
                    padding: '14px',
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    marginBottom: '20px',
                  }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                        Progression
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#64748B', marginTop: '2px' }}>
                        0 question répondue
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                        Volume attendu
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#17212D', marginTop: '2px' }}>
                        {questionCountExpected > 0 ? `${questionCountExpected} questions prévues` : 'Module standard'}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                        Livrable / Rapport
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#94A3B8', marginTop: '2px' }}>
                        Indisponible (non renseigné)
                      </div>
                    </div>
                  </div>

                  {/* Actions sans lien trompeur vers un rapport inexistant */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => navigate('/admin/diagnostics')}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#17212D',
                        border: '1px solid #17212D',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        padding: '9px 18px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#34BED5'}
                      onMouseLeave={e => e.currentTarget.style.background = '#17212D'}
                    >
                      <ArrowLeft size={15} />
                      Retourner à la liste des diagnostics
                    </button>

                    <button
                      onClick={tryEnrichDetail}
                      disabled={isEnriching}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        color: '#475569',
                        fontWeight: 600,
                        fontSize: '0.82rem',
                        padding: '9px 14px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                      }}
                    >
                      <RotateCcw size={14} style={{ animation: isEnriching ? 'spin 1s linear infinite' : 'none' }} />
                      Vérifier si des réponses ont été soumises
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : !hasResponses ? (
          /* CAS 2 : DIAGNOSTIC EFFECTUÉ MAIS RÉPONSES CONSOLIDÉES */
          <div style={{ padding: '36px 28px' }}>
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderLeft: '4px solid #34BED5',
              borderRadius: '6px',
              padding: '28px 24px',
              maxWidth: '850px',
              margin: '0 auto',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '6px',
                  background: '#EFF6FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Sparkles size={22} color="#34BED5" />
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{
                    margin: '0 0 6px 0',
                    fontSize: '1.08rem',
                    fontWeight: 800,
                    color: '#17212D',
                  }}>
                    Synthèse stratégique &amp; Évaluation consolidée
                  </h3>

                  <p style={{
                    margin: '0 0 16px 0',
                    fontSize: '0.85rem',
                    color: '#475569',
                    lineHeight: 1.5,
                  }}>
                    Ce diagnostic a été finalisé avec succès. Les réponses fournies ont été directement compilées et pondérées par le moteur algorithmique pour générer la notation par dimension, les constats clés et la feuille de route d'accompagnement.
                  </p>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => navigate(`/admin/diagnostics/${runId}/report`, {
                        state: {
                          run,
                          userId: passedUserId,
                          userName: userName || 'Déclarant non renseigné',
                          userEmail: userEmail || '',
                          userPhone: userPhone || '',
                          businessName: businessName || 'PME',
                          sector: businessSector,
                        }
                      })}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#17212D',
                        border: '1px solid #17212D',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        padding: '9px 18px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#34BED5'}
                      onMouseLeave={e => e.currentTarget.style.background = '#17212D'}
                    >
                      <FileText size={15} />
                      Accéder au rapport complet &amp; scores
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* CAS 3 : QUESTIONS & RÉPONSES DÉTAILLÉES PRÉSENTES */
          <div className="admin-table-wrap">
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ width: '40px', padding: '12px 14px', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>#</th>
                  <th style={{ width: '110px', padding: '12px 14px', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Réf.</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Question posée</th>
                  <th style={{ padding: '12px 14px', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Réponse formulée</th>
                  <th style={{ width: '120px', padding: '12px 14px', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>Dimension</th>
                  <th style={{ width: '70px', padding: '12px 14px', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', textAlign: 'center' }}>Score</th>
                  <th style={{ width: '85px', padding: '12px 14px', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', textAlign: 'center' }}>Signal</th>
                </tr>
              </thead>
              <tbody>
                {filteredResponses.map((resp, i) => {
                  const dimStyle = getDimensionStyle(resp.dimension);
                  return (
                    <tr
                      key={resp.id}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        background: resp.redFlagTriggered ? 'rgba(239, 68, 68, 0.03)' : '#FFFFFF',
                        borderLeft: resp.redFlagTriggered ? '3px solid #EF4444' : '3px solid transparent',
                      }}
                    >
                      {/* # */}
                      <td style={{ padding: '12px 14px', fontSize: '0.76rem', color: '#94A3B8', fontWeight: 700 }}>
                        {i + 1}
                      </td>

                      {/* Réf ID */}
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#17212D', fontWeight: 700 }}>
                          {resp.questionId}
                        </span>
                      </td>

                      {/* Question */}
                      <td style={{ padding: '12px 14px', maxWidth: '320px' }}>
                        <span style={{ fontSize: '0.86rem', color: '#17212D', fontWeight: 600, lineHeight: 1.45 }}>
                          {resp.questionText}
                        </span>
                      </td>

                      {/* Réponse */}
                      <td style={{ padding: '12px 14px', maxWidth: '260px' }}>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          color: '#0F172A',
                          background: '#F1F5F9',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          lineHeight: 1.4,
                        }}>
                          {resp.displayAnswer}
                        </span>
                      </td>

                      {/* Dimension */}
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background: dimStyle.bg,
                          color: dimStyle.text,
                          padding: '3px 8px',
                          borderRadius: '4px',
                        }}>
                          {dimStyle.label}
                        </span>
                      </td>

                      {/* Score */}
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        {resp.score15 !== null ? (
                          <span style={{
                            fontWeight: 800,
                            fontSize: '0.88rem',
                            color: resp.score15 >= 4 ? '#059669' : resp.score15 >= 2.5 ? '#D97706' : '#DC2626',
                          }}>
                            {resp.score15}/5
                          </span>
                        ) : (
                          <span style={{ color: '#CBD5E1', fontSize: '0.8rem' }}>—</span>
                        )}
                      </td>

                      {/* Red flag signal */}
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        {resp.redFlagTriggered ? (
                          <span
                            title={resp.redFlagCode ?? 'Signal critique déclenché'}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              color: '#DC2626',
                              background: '#FEE2E2',
                              padding: '2px 7px',
                              borderRadius: '4px',
                            }}
                          >
                            <Flag size={11} /> Alerte
                          </span>
                        ) : (
                          <span style={{ color: '#CBD5E1', fontSize: '0.8rem' }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default DiagnosticRunDetailScreen;
