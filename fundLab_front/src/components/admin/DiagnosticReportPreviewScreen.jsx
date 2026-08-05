import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  AlertTriangle,
  Download,
  ClipboardList,
  RefreshCw,
} from 'lucide-react';
import { apiFetch } from '../../api/config.js';
import './diagnosticReport.css';
import logoCompact from '../../assets/logo_compact.png';
import logoCcib from '../../assets/logo_ccib.png';
import logoFundlab from '../../assets/logo_fundlab.png';

export const DiagnosticReportPreviewScreen = () => {
  const { runId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const reportRef = useRef(null);

  // Extract navigation state metadata
  const passedState = location.state || {};
  const passedRun = passedState.run ?? null;
  const passedUserId = passedState.userId ?? passedRun?.user_id ?? null;

  // ── States ──
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [detailData, setDetailData] = useState(passedRun || null);
  const [downloading, setDownloading] = useState(false);

  // ── Helpers ──
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

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
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return [];
  };

  // ── Load Data (Rule 2) ──
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [resResult, resDetail] = await Promise.all([
        apiFetch(`/diagnostics/${runId}/result`).catch(() => null),
        apiFetch(`/diagnostics/${runId}/details`).catch(() => null),
      ]);

      if (resResult) {
        setResultData(resResult?.data || resResult || null);
      }

      let fetchedDetail = resDetail?.data || resDetail || null;

      // Helper function to merge user and business details non-destructively
      const mergeDetails = (existing, incoming, rootUser = null) => {
        if (!incoming) return existing;
        if (!existing) return incoming;
        const merged = { ...incoming, ...existing };
        const userObj = incoming.user || rootUser || existing?.user || null;
        if (userObj) {
          merged.user = { ...(incoming?.user || {}), ...(existing?.user || {}), ...userObj };
        }
        const businessObj = incoming.business || existing?.business || null;
        if (businessObj) {
          merged.business = { ...(incoming?.business || {}), ...(existing?.business || {}), ...businessObj };
        }
        const resp = existing?.question_responses || incoming?.question_responses || existing?.responses || incoming?.responses || null;
        if (resp) {
          merged.question_responses = resp;
        }
        return merged;
      };

      // Method A: Eager loading from historical list if we have a userId
      const queryParams = new URLSearchParams(window.location.search);
      const queryUserId = queryParams.get('userId');
      const targetUserId = passedUserId || queryUserId || resResult?.user_id || resResult?.data?.user_id;

      if ((!fetchedDetail?.business || !fetchedDetail?.user || !fetchedDetail?.user?.full_name) && targetUserId) {
        const resHist = await apiFetch(`/admin/dashboard/${targetUserId}/historical`).catch(() => null);
        const list = Array.isArray(resHist) ? resHist : (resHist?.data ?? []);
        let matched = list.find(r => r?.diagnostic_run_id === runId) ?? list[0] ?? null;

        // Fallback A.1: Try diagnostics list filtered by user_id
        if (!matched || !matched.user || !matched.user.full_name) {
          const resDiagUser = await apiFetch(`/admin/dashboard/diagnostics?user_id=${targetUserId}`).catch(() => null);
          const listDiag = resDiagUser?.data || [];
          const matchedDiag = listDiag.find(r => r?.diagnostic_run_id === runId);
          if (matchedDiag) {
            matched = mergeDetails(matched, matchedDiag);
          }
        }

        // Fallback A.2: Try diagnostics list filtered by userId
        if (!matched || !matched.user || !matched.user.full_name) {
          const resDiagUser = await apiFetch(`/admin/dashboard/diagnostics?userId=${targetUserId}`).catch(() => null);
          const listDiag = resDiagUser?.data || [];
          const matchedDiag = listDiag.find(r => r?.diagnostic_run_id === runId);
          if (matchedDiag) {
            matched = mergeDetails(matched, matchedDiag);
          }
        }

        if (matched) {
          fetchedDetail = mergeDetails(fetchedDetail, matched, resHist?.user || resHist?.data?.user);
        }
      }

      // Method C: Direct single admin diagnostic detail fetch
      if (!fetchedDetail?.business || !fetchedDetail?.user || !fetchedDetail?.user?.full_name) {
        const resAdminDetail = await apiFetch(`/admin/dashboard/diagnostics/${runId}`).catch(() => null);
        const adminData = resAdminDetail?.data || resAdminDetail;
        if (adminData) {
          fetchedDetail = mergeDetails(fetchedDetail, adminData);
        }
      }

      // Method B: Search fallback in global diagnostics list (useful on refresh or direct URL access)
      if (!fetchedDetail?.business || !fetchedDetail?.user || !fetchedDetail?.user?.full_name) {
        const resDiag = await apiFetch(`/admin/dashboard/diagnostics?per_page=100`).catch(() => null);
        const list = resDiag?.data || [];
        const matched = list.find(r => r?.diagnostic_run_id === runId);
        if (matched) {
          fetchedDetail = mergeDetails(fetchedDetail, matched, resDiag?.user);
          if (matched.user_id) {
            const resHist = await apiFetch(`/admin/dashboard/${matched.user_id}/historical`).catch(() => null);
            const histList = Array.isArray(resHist) ? resHist : (resHist?.data ?? []);
            const histMatched = histList.find(r => r?.diagnostic_run_id === runId);
            if (histMatched) {
              fetchedDetail = mergeDetails(fetchedDetail, histMatched, resHist?.user || resHist?.data?.user);
            }
          }
        }
      }

      if (fetchedDetail) {
        setDetailData(fetchedDetail);
      }

      if (!resResult && !fetchedDetail && !detailData) {
        throw new Error("Impossible de charger les données du diagnostic.");
      }
    } catch (err) {
      console.error('[DiagnosticReportPreviewScreen] Error loading data:', err);
      setError(err?.message || 'Erreur lors du chargement des données.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [runId]);

  // ── Data Normalization & Extraction (Rule 9 & Rule 7 & Rule 8) ──

  const scoring = resultData?.scoring || {};
  const restData = resultData?.restitution || resultData || {};

  // Score
  const scoreRaw = scoring?.converted_score_0_100 ?? resultData?.score ?? 0;
  const score = Math.max(0, Math.min(100, Math.round(Number(scoreRaw))));

  // Credibility (Rule 7: explicit fallback, no mock 70% default)
  const credScoreRaw = scoring?.credibilized_score_0_100 ?? scoring?.credibility_score ?? resultData?.credibilized_score_0_100 ?? null;
  const credibility = (credScoreRaw !== null && credScoreRaw !== undefined)
    ? `${Math.round(Number(credScoreRaw))}%`
    : '[credibilized_score_0_100 non disponible]';

  // Lists (Rule 7 explicit fallbacks)
  const pointsAppui = normalizeToArray(restData?.typical_strengths || resultData?.typical_strengths || restData?.strengths || scoring?.dominant_strength);
  const fragilitesList = normalizeToArray(restData?.typical_fragilities || resultData?.typical_fragilities || restData?.weaknesses || scoring?.dominant_weakness);
  const prioritiesList = normalizeToArray(restData?.priorities || resultData?.priorities || scoring?.priorities);

  // Detail variables
  const run = detailData || {};
  const business = detailData?.business || {};
  const user = detailData?.user || {};

  const businessName = business?.business_name ?? '[business_name non disponible]';
  const sector = business?.sector ?? '[sector non disponible]';
  const employeeCountLabel = business?.employee_count_range ?? run?.employee_count_range ?? '[employee_count_range non disponible]';
  const diagnosticDate = formatDate(run?.completed_at || run?.started_at);
  const creationYear = business?.year_created ?? business?.creation_year ?? '[year_created non disponible]';

  const queryParams = new URLSearchParams(window.location.search);

  const rawUserName = user?.full_name || passedState.userName || '';
  const rawUserEmail = user?.email || passedState.userEmail || '';
  const rawUserPhone = user?.phone_number || run?.user?.phone_number || run?.user?.phone || passedState.userPhone || '';

  const userName = rawUserName || '[Non disponible]';
  const userEmail = rawUserEmail || '[Non disponible]';
  const userPhone = rawUserPhone || '[Non disponible]';
  const hasContactInfo = true;

  const moduleCode = run?.module_code ?? resultData?.module_code ?? '[module_code non disponible]';
  const moduleName = resultData?.module_name ?? run?.module_name ?? '[module_name non disponible]';

  // Level & Status text (Rule 7 explicit fallbacks)
  const levelLabel = scoring?.band_label ?? (score < 40 ? 'Point de vigilance prioritaire' : (score >= 75 ? 'Solide' : 'Performance Moyenne'));
  const statusText = restData?.summary ?? restData?.interpretation_text ?? restData?.interpretation ?? (score < 40 ? 'Interprètation non disponible' : 'Interprètation non disponible.');
  const isDanger = score < 40 || scoring?.band_code === 'critical' || scoring?.band_code === 'vigilance';

  // Priorities mapping (Rule 8: no rotating icons, only single semantic ClipboardList icon)
  const finalPriorities = prioritiesList.slice(0, 3).map((p) => {
    const text = typeof p === 'string' ? p : (p?.text ?? '[priority.text non disponible]');
    return { text };
  });

  // Fragilities mapping (Rule 8: no random mock fallbacks)
  const finalFragilities = fragilitesList.slice(0, 3).map((f) => {
    const parts = typeof f === 'string' ? f.split(':') : [];
    const title = parts.length > 1 ? parts[0].trim() : 'Vulnérabilité';
    const desc = parts.length > 1 ? parts.slice(1).join(':').trim() : f;
    return { title, desc };
  });

  // Recommendation & advice (Rule 7 fallbacks)
  const recommendation = restData?.recommendation ?? '[recommendation non disponible]';
  const nextAdvice = restData?.next_diagnostic_advice ?? '[next_diagnostic_advice non disponible]';

  // Question responses normalization (Rule 7 fallbacks)
  const rawResponses = detailData?.question_responses || detailData?.responses || [];
  const normalizedResponses = rawResponses.map((resp, idx) => {
    const questionText = resp?.questionText
      ?? resp?.question?.text
      ?? resp?.question_text
      ?? resp?.question_id
      ?? `[question_id ${resp?.question_id ?? idx} non disponible]`;

    let displayAnswer = resp?.displayAnswer;
    if (!displayAnswer) {
      const answerLabel = resp?.answer_label ?? null;
      const answerText = resp?.answer_text ?? null;
      const answerValue = resp?.answer_value ?? null;

      displayAnswer = answerLabel || answerText;
      if (!displayAnswer && answerValue) {
        displayAnswer = typeof answerValue === 'string'
          ? answerValue.replace(/^"|"$/g, '')
          : JSON.stringify(answerValue);
      }
    }
    if (!displayAnswer) displayAnswer = '[Aucune réponse fournie]';

    return {
      id: resp?.response_id ?? `RESP-${idx}`,
      category: resp?.question_dimension ?? resp?.question?.dimension ?? '[question_dimension non disponible]',
      questionText,
      displayAnswer,
    };
  });

  // Helper to calculate card visual height in pixels
  const getCardHeight = (resp) => {
    const qLen = resp.questionText?.length || 0;
    const aLen = resp.displayAnswer?.length || 0;
    
    // Estimate lines (average line lengths: question ~ 38 chars, answer ~ 34 chars in container width)
    const qLines = Math.max(1, Math.ceil(qLen / 38));
    const aLines = Math.max(1, Math.ceil(aLen / 34));
    
    // Base card height is 90px (which covers padding and 1-line question + 1-line answer)
    let cardHeight = 90;
    
    if (qLines > 1) {
      cardHeight += (qLines - 1) * 16;
    }
    if (aLines > 1) {
      cardHeight += (aLines - 1) * 15;
    }
    
    return cardHeight;
  };

  // Group cards into rows of 2 (since they render in a 2-column grid)
  const qaRows = [];
  for (let i = 0; i < normalizedResponses.length; i += 2) {
    const card1 = normalizedResponses[i];
    const card2 = normalizedResponses[i + 1] || null;
    const h1 = getCardHeight(card1);
    const h2 = card2 ? getCardHeight(card2) : 0;
    const rowHeight = Math.max(h1, h2) + 12; // Height in pixels including grid gap (12px)
    qaRows.push({
      items: [card1, card2].filter(Boolean),
      height: rowHeight
    });
  }

  // Dynamic pagination based on row height in pixels
  const qaPages = [];
  let currentPageRows = [];
  let currentPageHeight = 0;

  qaRows.forEach((row) => {
    // Page 2 has a smaller budget (810px) because of intro text. Page 3+ has 880px available.
    const isFirstPage = qaPages.length === 0;
    const maxPageHeight = isFirstPage ? 810 : 880;

    if (currentPageHeight + row.height > maxPageHeight && currentPageRows.length > 0) {
      qaPages.push(currentPageRows.flatMap(r => r.items));
      currentPageRows = [row];
      currentPageHeight = row.height;
    } else {
      currentPageRows.push(row);
      currentPageHeight += row.height;
    }
  });

  if (currentPageRows.length > 0) {
    qaPages.push(currentPageRows.flatMap(r => r.items));
  }
  if (qaPages.length === 0) {
    qaPages.push([]);
  }

  const totalPages = 1 + qaPages.length;

  // ── Handlers ──
  const handleDownloadPDF = async () => {
    if (!reportRef.current || downloading) return;
    setDownloading(true);
    try {
      const [{ jsPDF }, html2canvas] = await Promise.all([
        import('jspdf'),
        import('html2canvas').then((m) => m.default),
      ]);

      const pages = Array.from(reportRef.current.querySelectorAll('.report-page'));
      if (pages.length === 0) {
        window.print();
        return;
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;

      for (let i = 0; i < pages.length; i++) {
        if (i > 0) pdf.addPage();
        const canvas = await html2canvas(pages[i], {
          scale: 2.5,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        });
        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, pageHeight);
      }

      const companyName = detailData?.business?.business_name || 'ENTREPRISE';
      const cleanName = companyName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
      pdf.save(`rapport_diagnostic_${cleanName || 'ENTREPRISE'}.pdf`);
    } catch (err) {
      console.error('[DiagnosticReportPreviewScreen] PDF generation error:', err);
      alert('Une erreur est survenue lors de la génération du PDF.');
    } finally {
      setDownloading(false);
    }
  };

  // ── Loading and Error Early Returns (Rule 2: retry mechanism included) ──
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: '16px', color: '#64748b' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontWeight: 600 }}>Chargement de l'aperçu du rapport...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '500px', margin: '60px auto', padding: '24px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '12px', textAlign: 'center' }}>
        <AlertTriangle size={40} color="#dc2626" style={{ marginBottom: '12px', display: 'inline-block' }} />
        <h3 style={{ margin: '0 0 8px', color: '#991b1b', fontWeight: 800 }}>Erreur de chargement</h3>
        <p style={{ color: '#b91c1c', fontSize: '0.9rem', marginBottom: '20px' }}>{error}</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn btn-teal btn-sm" onClick={loadData} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={14} /> Réessayer
          </button>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}>
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="report-preview-container">
      {/* Actions header bar */}
      <div className="report-preview-header-bar">
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => navigate(-1)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={16} /> Retour
        </button>
        <button
          className="btn btn-teal btn-sm"
          onClick={handleDownloadPDF}
          disabled={downloading}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          {downloading ? (
            <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          ) : (
            <Download size={16} />
          )}
          {downloading ? 'Génération du PDF...' : 'Télécharger en PDF'}
        </button>
      </div>

      {/* Pages Container */}
      <div ref={reportRef} className="report-page-wrapper">

        {/* ── PAGE 1: SYNTHÈSE DIAGNOSTIC ── */}
        <div className="report-page">
          <div className="report-page-content">
            <div className="report-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <img src={logoCompact} alt="Logo" style={{ height: '38px', objectFit: 'contain' }} />
              <span className="report-confidential-badge">CONFIDENTIEL</span>
            </div>

            <h1 className="report-page-title-main" style={{ textAlign: 'center' }}>Rapport de Diagnostic Stratégique</h1>

            {/* Profile table box */}
            <div className="report-profile-box" style={hasContactInfo ? { gridTemplateRows: 'auto auto', rowGap: '12px' } : {}}>
              <div className="report-profile-col">
                <span className="report-profile-label">ENTREPRISE</span>
                <span className="report-profile-value" title={businessName}>{businessName}</span>
              </div>
              <div className="report-profile-col">
                <span className="report-profile-label">SECTEUR D'ACTIVITÉ</span>
                <span className="report-profile-value" title={sector}>{sector}</span>
              </div>
              <div className="report-profile-col">
                <span className="report-profile-label">EQUIPE</span>
                <span className="report-profile-value">{employeeCountLabel}</span>
              </div>
              <div className="report-profile-col">
                <span className="report-profile-label">ANNÉE DE CRÉATION</span>
                <span className="report-profile-value">{creationYear}</span>
              </div>

              {/* Row 2: Declarant, email and phone */}
              {hasContactInfo && (
                <>
                  <div className="report-profile-col" style={{ gridColumn: 'span 2', borderTop: '1px solid #cbd5e1', paddingTop: '8px' }}>
                    <span className="report-profile-label">DÉCLARANT / CONTACT</span>
                    <span className="report-profile-value" title={userName}>{userName}</span>
                  </div>
                  <div className="report-profile-col" style={{ borderTop: '1px solid #cbd5e1', paddingTop: '8px' }}>
                    <span className="report-profile-label">E-MAIL</span>
                    <span className="report-profile-value" title={userEmail}>{userEmail}</span>
                  </div>
                  <div className="report-profile-col" style={{ borderTop: '1px solid #cbd5e1', paddingTop: '8px' }}>
                    <span className="report-profile-label">TÉLÉPHONE</span>
                    <span className="report-profile-value" title={userPhone}>{userPhone}</span>
                  </div>
                </>
              )}
            </div>

            {/* Performance and description row */}
            <div className="report-two-cols">
              {/* Left col: Donut score chart */}
              <div className="report-left-col">
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Votre performance actuelle</span>
                <div className="report-score-donut-wrap">
                  <svg width="105" height="105" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="9" />
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#0f172a" strokeWidth="9"
                      strokeDasharray={`${score * 2.38} 238`}
                      strokeDashoffset="0"
                      transform="rotate(-90 50 50)"
                      strokeLinecap="round" />
                  </svg>
                  <div className="report-score-donut-text">
                    <span className="report-score-number">{score}</span>
                    <span className="report-score-label">SCORE</span>
                  </div>
                </div>
                <div className="report-credibility-pill">
                  CRÉDIBILITÉ : {credibility}
                </div>
              </div>

              {/* Right col: Description */}
              <div className="report-right-col">
                <span className="report-right-title">Résumé Diagnostic</span>
                {/* <div className={`report-alert-box ${isDanger ? 'danger' : ''}`}>
                  <span>Niveau obtenu : {levelLabel}</span>
                </div> */}
                <p className="report-description-text">{statusText}</p>
              </div>
            </div>

            {/* Priorities action banner */}
            <div className="report-section-title-banner">PRIORITÉS D'ACTION</div>
            <div className="report-priorities-grid">
              {finalPriorities.length === 0 ? (
                <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '0.75rem' }}>
                  [priorities non disponible]
                </div>
              ) : (
                finalPriorities.map((item, index) => (
                  <div className="report-priority-card" key={index}>
                    <span className="report-priority-text">{item.text}</span>
                  </div>
                ))
              )}
            </div>

            {/* Fragilities list */}
            <div className="report-section-title-underline">FRAGILITÉS</div>
            <div className="report-fragilities-stack">
              {finalFragilities.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '0.75rem' }}>
                  [typical_fragilities non disponible]
                </div>
              ) : (
                finalFragilities.map((item, index) => (
                  <div className="report-fragility-card" key={index}>
                    <p className="report-fragility-desc">{item.desc}</p>
                  </div>
                ))
              )}
            </div>



            {/* Footer */}
            <div className="report-footer-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #cbd5e1', paddingTop: '8px', marginTop: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img src={logoCcib} alt="CCIB" style={{ height: '32px', objectFit: 'contain' }} />
                <img src={logoFundlab} alt="FUND.lab" style={{ height: '30px', objectFit: 'contain' }} />
              </div>
              <span style={{ fontSize: '0.66rem', color: '#475569', fontWeight: 700, letterSpacing: '0.2px' }}>
                www.cci.bj &bull; contact@fundlab.bj &nbsp;&nbsp;|&nbsp;&nbsp; Généré le {new Date().toLocaleDateString('fr-FR')} &nbsp;&nbsp;|&nbsp;&nbsp; PAGE 1/{totalPages}
              </span>
            </div>
          </div>
        </div>

        {/* ── PAGES 2+: DETAILS Q&A ── */}
        {qaPages.map((pageItems, pageIdx) => (
          <div className="report-page" key={pageIdx}>
            <div className="report-page-content">
              <div className="report-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <img src={logoCompact} alt="Logo" style={{ height: '38px', objectFit: 'contain' }} />
                <span className="report-confidential-badge">CONFIDENTIEL</span>
              </div>

              {pageIdx === 0 && (
                <p className="report-qa-intro">
                  Voici un résumé des réponses que vous avez fournies lors du diagnostic initial. Ces données serviront de base pour nos recommandations stratégiques et opérationnelles.
                </p>
              )}

              <div className="report-qa-grid" style={{ marginTop: pageIdx > 0 ? '12px' : '0' }}>
                {pageItems.length === 0 ? (
                  <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '0.78rem' }}>
                    [question_responses non disponible]
                  </div>
                ) : (
                  pageItems.map((resp) => (
                    <div className="report-qa-card" key={resp.id}>
                      <div>
                        <h4 className="report-qa-question">{resp.questionText}</h4>
                      </div>
                      <div className="report-qa-answers">
                        <span className="report-qa-pill">{resp.displayAnswer}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="report-footer-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #cbd5e1', paddingTop: '8px', marginTop: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img src={logoCcib} alt="CCIB" style={{ height: '32px', objectFit: 'contain' }} />
                  <img src={logoFundlab} alt="FUND.lab" style={{ height: '30px', objectFit: 'contain' }} />
                </div>
                <span style={{ fontSize: '0.66rem', color: '#475569', fontWeight: 700, letterSpacing: '0.2px' }}>
                  www.cci.bj &bull; contact@fundlab.bj &nbsp;&nbsp;|&nbsp;&nbsp; Généré le {new Date().toLocaleDateString('fr-FR')} &nbsp;&nbsp;|&nbsp;&nbsp; PAGE {pageIdx + 2}/{totalPages}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
