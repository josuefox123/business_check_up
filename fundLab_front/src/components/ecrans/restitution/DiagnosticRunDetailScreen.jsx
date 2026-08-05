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
  Download,
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

const DIMENSION_COLORS = {
  finance: { bg: '#EFF6FF', text: '#2563EB' },
  commercial: { bg: '#FDF4FF', text: '#9333EA' },
  operations: { bg: '#FFF7ED', text: '#D97706' },
  gouvernance: { bg: '#F0FDF4', text: '#16A34A' },
  produit: { bg: '#FEF2F2', text: '#DC2626' },
  meta: { bg: '#F8FAFC', text: '#475569' },
};

const dimensionStyle = (dim) =>
  DIMENSION_COLORS[dim] ?? { bg: '#F8FAFC', text: '#64748B' };

const normalizeToArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);

  if (typeof value === 'string') {
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed.filter(Boolean);
        }
      } catch (e) { }
    }
    return value
      .split(/[\n;|]+/)
      .map(item => item.trim())
      .filter(Boolean);
  }
  return [];
};

// ─── Component ────────────────────────────────────────────────────────────────

export const DiagnosticRunDetailScreen = () => {
  const { runId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Data passed from list via navigation state (used as fast initial render)
  const passedState = location.state || {};

  // ── Fetch state ──
  const [detailData, setDetailData] = useState(passedState.detail || null);
  // Data passed via navigation state — always available from the list
  const passedRun = passedState.run ?? null;
  const passedUserId = passedState.userId ?? passedRun?.user_id ?? null;

  // detailData: richer data from /historical if available, falls back to passedRun
  const [enrichError, setEnrichError] = useState(false);

  // Modal states for diagnostic results removed in favor of report route preview

  // Attempt silent enrichment from /historical — non-blocking, errors are silent
  const tryEnrichDetail = async () => {
    if (!passedUserId) return;
    try {
      const res = await apiFetch(`/admin/dashboard/${passedUserId}/historical`);
      const list = Array.isArray(res) ? res : (res?.data ?? []);
      const matched = list.find(r => r?.diagnostic_run_id === runId) ?? list[0] ?? null;
      if (matched) setDetailData(matched);
    } catch {
      // Silent failure — detail page still renders from passedRun data
      setEnrichError(true);
    }
  };

  useEffect(() => {
    tryEnrichDetail();
  }, [runId]);

  // ─── Normalization (Rule 9) ───────────────────────────────────────────────

  const run = detailData ?? passedState.run ?? {};
  const business = detailData?.business ?? null;

  const runId_display = run?.diagnostic_run_id ?? runId ?? '[diagnostic_run_id non disponible]';
  const moduleCode = run?.module_code ?? '[module_code non disponible]';
  const moduleFamily = run?.module_family ?? '[module_family non disponible]';
  const completionStatus = run?.completion_status ?? '[completion_status non disponible]';
  const isCompleted = completionStatus === 'completed';
  const startedAt = formatDate(run?.started_at);
  const completedAt = run?.completed_at ? formatDate(run.completed_at) : null;
  const questionCountExpected = run?.question_count_expected ?? 0;
  const questionCountAnswered = run?.question_count_answered ?? 0;

  const businessName = business?.business_name ?? passedState.businessName ?? '[business_name non disponible]';
  const businessSector = business?.sector ?? null;
  const businessRegion = business?.region ?? null;
  const businessCountry = business?.country ?? null;

  const userName = passedState.userName ?? null;
  const userEmail = passedState.userEmail ?? null;

  // Question responses normalization
  const rawResponses = detailData?.question_responses || [];

  const normalizedResponses = rawResponses.map((resp, idx) => {
    const questionText = resp?.question?.text
      ?? resp?.question_id
      ?? `[question_id ${resp?.question_id ?? idx} non disponible]`;

    const answerLabel = resp?.answer_label ?? null;
    const answerText = resp?.answer_text ?? null;
    const answerValue = resp?.answer_value ?? null;

    let displayAnswer = answerLabel || answerText;
    if (!displayAnswer && answerValue) {
      displayAnswer = typeof answerValue === 'string'
        ? answerValue.replace(/^"|"$/g, '')
        : JSON.stringify(answerValue);
    }
    if (!displayAnswer) displayAnswer = '[Aucune réponse fournie]';

    return {
      id: resp?.response_id ?? `RESP-${idx}`,
      questionId: resp?.question_id ?? '[question_id non disponible]',
      questionText,
      displayAnswer,
      dimension: resp?.question_dimension ?? 'meta',
      answerType: resp?.answer_type ?? 'single_choice',
      isCritical: Boolean(resp?.is_critical_question),
      redFlagTriggered: Boolean(resp?.red_flag_triggered),
      redFlagCode: resp?.red_flag_code ?? null,
      score15: resp?.score_1_5 ?? null,
      answeredAt: resp?.answered_at ? formatDate(resp.answered_at) : null,
      weight: resp?.weight ?? null,
    };
  });

  const redFlagCount = normalizedResponses.filter(r => r.redFlagTriggered).length;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="admin-page animate-fade-up">

      {/* ── Back button + title ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/admin/diagnostics')}
            className="btn btn-ghost btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={16} /> Retour
          </button>
          <div>
            <h1 className="admin-page-title" style={{ margin: 0 }}>
              Détail du diagnostic — {moduleCode}
            </h1>
          </div>
        </div>

        {/* Bouton Voir le résultat */}
        <button
          className="btn btn-teal btn-sm"
          onClick={() => navigate(`/admin/diagnostics/${runId}/report`, {
            state: {
              run: run,
              userId: passedUserId,
              userName: userName,
              userEmail: userEmail,
              businessName: businessName,
            }
          })}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          Voir le résultat
        </button>
      </div>

      {/* ── Summary cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>

        {/* Entreprise */}
        <div className="admin-card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Building2 size={16} color="#2563EB" />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--slate-400)' }}>Entreprise</span>
          </div>
          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--adm-text)' }}>{businessName}</div>
          {businessSector && <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: '2px' }}>{businessSector}</div>}
          {(businessRegion || businessCountry) && (
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
              {[businessRegion, businessCountry].filter(Boolean).join(' · ')}
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="admin-card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <User size={16} color="#9333EA" />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--slate-400)' }}>Renseigné par</span>
          </div>
          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--adm-text)' }}>{userName || '—'}</div>
          {userEmail && (
            <a href={`mailto:${userEmail}`} style={{ fontSize: '0.78rem', color: '#1A9DB8', textDecoration: 'none' }}>{userEmail}</a>
          )}
        </div>

        {/* Module */}
        <div className="admin-card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <ClipboardList size={16} color="#1A9DB8" />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--slate-400)' }}>Module</span>
          </div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#1A9DB8' }}>{moduleCode}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: '2px', textTransform: 'capitalize' }}>{moduleFamily}</div>
        </div>

        {/* Date */}
        <div className="admin-card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Calendar size={16} color="#D97706" />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--slate-400)' }}>Date</span>
          </div>
          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--adm-text)' }}>{startedAt}</div>
          {completedAt && <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: '2px' }}>Terminé : {completedAt}</div>}
        </div>

        {/* Statut */}
        <div className="admin-card" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            {isCompleted ? <CheckCircle2 size={16} color="#10B981" /> : <Clock size={16} color="#F59E0B" />}
            <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--slate-400)' }}>Statut</span>
          </div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            fontWeight: 800, fontSize: '0.88rem',
            color: isCompleted ? '#166534' : '#92400E',
          }}>
            {isCompleted ? <CheckCircle2 size={14} /> : <Clock size={14} />}
            {isCompleted ? 'Terminé' : 'En cours'}
          </span>
        </div>

        {/* Red flags */}
        {redFlagCount > 0 && (
          <div className="admin-card" style={{ padding: '16px 20px', borderLeft: '3px solid #EF4444' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Flag size={16} color="#EF4444" />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--slate-400)' }}>Signaux d'alerte</span>
            </div>
            <div style={{ fontWeight: 900, fontSize: '1.4rem', color: '#EF4444' }}>{redFlagCount}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>red flag{redFlagCount > 1 ? 's' : ''} déclenchés</div>
          </div>
        )}
      </div>

      {/* ── Q&A Table ── */}
      <div className="admin-card">
        <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--adm-border)' }}>
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--adm-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} color="#1A9DB8" />
            Questions &amp; Réponses
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--slate-400)' }}>({normalizedResponses.length})</span>
          </h2>
        </div>

        {normalizedResponses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px', color: 'var(--slate-400)' }}>
            <MessageSquare size={32} style={{ marginBottom: '8px', opacity: 0.35 }} />
            <p style={{ fontWeight: 600, margin: 0 }}>Aucune réponse enregistrée pour ce diagnostic.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>#</th>
                  <th style={{ width: '110px' }}>ID Question</th>
                  <th>Question</th>
                  <th>Réponse</th>
                  <th style={{ width: '100px' }}>Dimension</th>
                  <th style={{ width: '70px', textAlign: 'center' }}>Score</th>
                  <th style={{ width: '80px', textAlign: 'center' }}>Alerte</th>
                </tr>
              </thead>
              <tbody>
                {normalizedResponses.map((resp, i) => {
                  const dimStyle = dimensionStyle(resp.dimension);
                  return (
                    <tr
                      key={resp.id}
                      style={{
                        background: resp.redFlagTriggered ? 'rgba(239,68,68,0.03)' : '',
                        borderLeft: resp.redFlagTriggered ? '3px solid #FCA5A5' : '3px solid transparent',
                      }}
                    >
                      {/* # */}
                      <td style={{ fontSize: '0.78rem', color: 'var(--slate-400)', fontWeight: 700 }}>
                        {i + 1}
                      </td>

                      {/* ID */}
                      <td>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#1A9DB8', fontWeight: 700 }}>
                          {resp.questionId}
                        </span>
                        {resp.isCritical && (
                          <div style={{ fontSize: '0.66rem', color: '#D97706', fontWeight: 700, marginTop: '1px' }}>
                          </div>
                        )}
                      </td>

                      {/* Question */}
                      <td style={{ maxWidth: '280px' }}>
                        <span style={{ fontSize: '0.87rem', color: 'var(--adm-text)', fontWeight: 600, lineHeight: 1.4 }}>
                          {resp.questionText}
                        </span>
                      </td>

                      {/* Réponse */}
                      <td style={{ maxWidth: '220px' }}>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: '#0F172A',
                          background: '#F1F5F9',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          lineHeight: 1.45,
                        }}>
                          {resp.displayAnswer}
                        </span>
                      </td>

                      {/* Dimension */}
                      <td>
                        <span style={{
                          display: 'inline-block',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'capitalize',
                          background: dimStyle.bg,
                          color: dimStyle.text,
                          padding: '2px 7px',
                          borderRadius: '5px',
                        }}>
                          {resp.dimension}
                        </span>
                      </td>

                      {/* Score */}
                      <td style={{ textAlign: 'center' }}>
                        {resp.score15 !== null ? (
                          <span style={{
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            color: resp.score15 >= 4 ? '#10B981' : resp.score15 >= 2 ? '#F59E0B' : '#EF4444',
                          }}>
                            {resp.score15}/5
                          </span>
                        ) : (
                          <span style={{ color: 'var(--slate-300)', fontSize: '0.8rem' }}>—</span>
                        )}
                      </td>

                      {/* Alerte */}
                      <td style={{ textAlign: 'center' }}>
                        {resp.redFlagTriggered ? (
                          <span
                            title={resp.redFlagCode ?? 'Red flag'}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '0.72rem', fontWeight: 700, color: '#DC2626', background: '#FEE2E2', padding: '2px 7px', borderRadius: '5px' }}
                          >
                            <Flag size={11} /> {resp.redFlagCode ? resp.redFlagCode.split('_').slice(-1)[0] : 'Flag'}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--slate-300)', fontSize: '0.8rem' }}>—</span>
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

      {/* Result modal removed */}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
