import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import { LandingPage } from './components/screens/LandingPage.jsx';
import { CommentCaMarche } from './components/screens/CommentCaMarche.jsx';
import { Navbar } from './components/layout/Navbar.jsx';
import { PublicContactScreen } from './components/screens/PublicContact.jsx';
import { AlertTriangle } from 'lucide-react';
import { useSessionPersist } from './hooks/useSessionPersist.js';
import { generateDiagnosticPDF } from './utils/generateDiagnosticPDF.js';
import { getRestitutionData } from './utils/restitutionHelper.js';

/* ── Modale d'erreur stylisée du système ── */
const ErrorModal = ({ title, message, onClose }) => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 9999,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px',
    background: 'rgba(7, 14, 36, 0.55)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    animation: 'fadeIn 0.18s ease',
  }}>
    <div style={{
      background: '#ffffff',
      borderRadius: '20px',
      padding: '36px 32px 28px',
      maxWidth: '400px',
      width: '100%',
      boxShadow: '0 24px 60px rgba(7,14,36,0.18)',
      textAlign: 'center',
      animation: 'scaleIn 0.2s cubic-bezier(0.16,1,0.3,1)',
    }}>
      <div style={{
        width: '56px', height: '56px',
        background: 'rgba(239, 68, 68, 0.08)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
      }}>
        <AlertTriangle size={26} strokeWidth={2} style={{ color: '#ef4444' }} />
      </div>

      <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1E293B', marginBottom: '10px' }}>
        {title}
      </h2>
      <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6, marginBottom: '28px' }}>
        {message}
      </p>

      <button
        onClick={onClose}
        style={{
          width: '100%',
          padding: '13px 20px',
          borderRadius: '12px',
          fontWeight: 750,
          fontSize: '0.95rem',
          border: 'none',
          background: '#17212D',
          color: '#ffffff',
          cursor: 'pointer',
          fontFamily: 'inherit',
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => e.target.style.background = '#2B3A4A'}
        onMouseLeave={(e) => e.target.style.background = '#17212D'}
      >
        Fermer
      </button>
    </div>
  </div>
);

/* ── Modale stylisée de reprise de session ── */
const ResumeDiagnosticModal = ({ onConfirm, onCancel }) => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 9999,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px',
    background: 'rgba(7, 14, 36, 0.55)',
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
    animation: 'fadeIn 0.18s ease',
  }}>
    <div style={{
      background: '#ffffff',
      borderRadius: '20px',
      padding: '36px 32px 28px',
      maxWidth: '420px',
      width: '100%',
      boxShadow: '0 24px 60px rgba(7,14,36,0.18)',
      textAlign: 'center',
      animation: 'scaleIn 0.2s cubic-bezier(0.16,1,0.3,1)',
    }}>
      <div style={{
        width: '56px', height: '56px',
        background: 'rgba(38, 89, 242, 0.08)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-blue, #2659F2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
          <path d="M16 3h5v5"/>
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
          <path d="M8 21H3v-5"/>
        </svg>
      </div>

      <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#17212D', marginBottom: '10px', fontFamily: 'var(--font)' }}>
        Reprendre le diagnostic ?
      </h2>
      <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6, marginBottom: '28px', fontFamily: 'var(--font)' }}>
        Nous avons détecté un diagnostic en cours. Souhaitez-vous le reprendre là où vous vous étiez arrêté ?
      </p>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1, padding: '13px 16px',
            borderRadius: '12px', fontWeight: 600, fontSize: '0.9rem',
            border: '1.5px solid var(--slate-200, #E2E8F0)', background: '#fff',
            color: '#475569', cursor: 'pointer',
            fontFamily: 'var(--font)', transition: 'all 0.15s',
          }}
        >
          Recommencer
        </button>
        <button
          onClick={onConfirm}
          style={{
            flex: 1, padding: '13px 16px',
            borderRadius: '12px', fontWeight: 750, fontSize: '0.9rem',
            border: 'none', background: 'var(--color-blue, #2659F2)',
            color: '#fff', cursor: 'pointer',
            fontFamily: 'var(--font)', transition: 'all 0.15s',
            boxShadow: '0 4px 14px rgba(38,89,242,0.25)',
          }}
        >
          Continuer
        </button>
      </div>
    </div>
  </div>
);
import {
  ConsentScreen,
  S03Screen, S04Screen, S05Screen, S06Screen, S07Screen, S08Screen, S09Screen,
  RouteScreen,
  CatalogScreen,
  VerifModuleScreen,
  IntroModuleScreen,
  QuestionScreen,
  CalculScreen,
  ResultatSyntheseScreen,
  ForceFragilitesScreen,
  PrioritesActionScreen,
  OrientationSuivanteScreen,
  ContactSuiviScreen,
  FinParcoursScreen,
  InstitutionnelleScreen,
} from './components/screens/DiagnosticScreens.jsx';
// ── API Layer (source unique de vérité) ──────────────────────
import {
  computeRoute,
  computeFullScore,
  generateFullResults,
  getModule,
  calculateGlobalScore,
  createSessionApi,
  submitConsentApi,
  submitTriageToBackendApi,
  updateSessionApi,
  abandonSessionApi,
} from './api/index.js';

// Import domain services for "Backend Ready" architecture
import { QuestionService } from './services/QuestionService.js';
import { DiagnosticService } from './services/DiagnosticService.js';
import { UtilisateurService } from './services/UtilisateurService.js';
import { apiFetch, formatDurationSeconds } from './api/config.js';


// Routing via API
const getRouteFromAnswers = (answers) => {
  const result = computeRoute({ ...answers, s03: answers.s03 });
  if (!result) return 'S13';
  // Map vers les anciennes clés de route pour compatibilité
  const routeMap = { 'S10': 'S10', 'S11': 'S11', 'S12': 'S12', 'S13': 'S13', 'INSTITUTIONAL': 'INSTITUTIONAL' };
  if (result.moduleId) return { route: result.route, moduleId: result.moduleId };
  return result.route || 'S13';
};

const MODULE_BY_ROUTE = {
  'S10': { id: 'PRJ-02', name: 'Diagnostic Projet',     duration: '8-12 min' },
  'S11': { id: 'DIF-03', name: 'Diagnostic Difficulté',  duration: '10-15 min' },
  'S12': { id: 'OPP-04', name: 'Diagnostic Opportunité', duration: '10-15 min' },
  'S13': { id: 'FLH-01', name: 'Diagnostic Flash',       duration: '7-10 min' },
};

const CRITICAL_SIGNALS = ['charges', 'dettes', 'treso'];
const getVerifWarning = (chosenModule, triageAnswers) => {
  const s07 = triageAnswers.s07 || [];
  const hasCritical = Array.isArray(s07) && s07.some(s => CRITICAL_SIGNALS.includes(s));
  if (chosenModule.id === 'OPP-04' && hasCritical) {
    return 'Avant d\'évaluer cette opportunité, vos réponses signalent un point financier critique à vérifier. Voulez-vous commencer par le Diagnostic Difficulté ?';
  }
  if (chosenModule.id === '360-09' && hasCritical) {
    return 'Votre situation semble nécessiter un diagnostic de stabilisation avant une vue complète.';
  }
  return null;
};

function DiagnosticApp() {
  const navigate = useNavigate();
  const location = useLocation();

  // Session persistence helper hook
  const { saveState, loadState, clearState } = useSessionPersist();
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [pendingResumeState, setPendingResumeState] = useState(null);
  const [isRestored, setIsRestored] = useState(false);

  // Wizard & Triage Step State (for triage flow S03-S09)
  const [triageStep, setTriageStep] = useState(3);

  // States
  const [triageAnswers, setTriageAnswers] = useState({});
  const [consentAnswers, setConsentAnswers] = useState({ diag: false, stats: false, contact: false });
  const [currentModule, setCurrentModule] = useState(null); // { id, name, duration }
  const [routeKey, setRouteKey] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [moduleAnswers, setModuleAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [chosenForVerif, setChosenForVerif] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentRunId, setCurrentRunId] = useState(null);
  const [restitution, setRestitution] = useState(null);
  const [errorModal, setErrorModal] = useState(null);

  // Helper function to populate state when restoring session
  const restoreState = (state) => {
    if (state.triageStep !== undefined) setTriageStep(state.triageStep);
    if (state.triageAnswers !== undefined) setTriageAnswers(state.triageAnswers);
    if (state.consentAnswers !== undefined) setConsentAnswers(state.consentAnswers);
    if (state.currentModule !== undefined) setCurrentModule(state.currentModule);
    if (state.routeKey !== undefined) setRouteKey(state.routeKey);
    if (state.questionIndex !== undefined) setQuestionIndex(state.questionIndex);
    if (state.moduleAnswers !== undefined) setModuleAnswers(state.moduleAnswers);
    if (state.score !== undefined) setScore(state.score);
    if (state.chosenForVerif !== undefined) setChosenForVerif(state.chosenForVerif);
    if (state.currentRunId !== undefined) setCurrentRunId(state.currentRunId);
    if (state.restitution !== undefined) setRestitution(state.restitution);
    if (state.sessionId) localStorage.setItem('bc_session_id', state.sessionId);

    if (state.currentPath && location.pathname !== state.currentPath) {
      navigate(state.currentPath);
    }
  };

  // Mount effect to check if there is an active session
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      // If we are currently on a diagnostic URL path, restore it immediately
      const isDiagnosticPath =
        location.pathname.startsWith('/triage/') ||
        location.pathname.startsWith('/diagnostic/') ||
        location.pathname === '/catalog';

      if (isDiagnosticPath) {
        restoreState(saved);
        setIsRestored(true);
      } else {
        setPendingResumeState(saved);
        setShowResumeModal(true);
      }
    } else {
      setIsRestored(true);
    }
  }, []);

  // Autosave state whenever a state variable changes (only after initial check/restore)
  useEffect(() => {
    if (!isRestored) return;

    if (
      location.pathname === '/triage/consent' ||
      localStorage.getItem('bc_session_id') ||
      Object.keys(triageAnswers).length > 0 ||
      Object.keys(moduleAnswers).length > 0 ||
      currentModule ||
      currentRunId
    ) {
      saveState({
        triageStep,
        triageAnswers,
        currentModule,
        routeKey,
        questionIndex,
        moduleAnswers,
        score,
        chosenForVerif,
        currentRunId,
        restitution,
        consentAnswers,
        currentPath: location.pathname,
        sessionId: localStorage.getItem('bc_session_id'),
      });
    }
  }, [
    isRestored,
    triageStep,
    triageAnswers,
    currentModule,
    routeKey,
    questionIndex,
    moduleAnswers,
    score,
    chosenForVerif,
    currentRunId,
    restitution,
    consentAnswers,
    location.pathname,
  ]);

  // Fetch questions dynamically when currentModule changes (Backend Ready)
  useEffect(() => {
    if (currentModule) {
      QuestionService.getQuestionsByModule(currentModule.id)
        .then(res => {
          setQuestions(res || []);
        });
    } else {
      setQuestions([]);
    }
  }, [currentModule]);

  const onStartAssisted = () => {
    clearState(); // Start fresh
    setTriageStep(3);
    setTriageAnswers({});
    setConsentAnswers({ diag: false, stats: false, contact: false });
    setCurrentModule(null);
    setRestitution(null);
    setCurrentRunId(null);
    setQuestions([]);
    setScore(0);
    
    // Create new session in backend
    createSessionApi()
      .then(res => {
        const sessionId = res?.data?.session_id;
        if (sessionId) {
          localStorage.setItem('bc_session_id', sessionId);
          saveState({
            triageStep: 3,
            triageAnswers: {},
            consentAnswers: { diag: false, stats: false, contact: false },
            currentModule: null,
            routeKey: null,
            questionIndex: 0,
            moduleAnswers: {},
            score: 0,
            chosenForVerif: null,
            currentRunId: null,
            restitution: null,
            currentPath: '/triage/consent',
            sessionId: sessionId
          });
        }
      })
      .catch(err => console.error('Error creating session:', err));

    navigate('/triage/consent');
  };
  const onGoToCatalog   = () => navigate('/catalog');
  const onLearnMore     = () => navigate('/a-propos');
  const onGoHome        = () => {
    clearState(); // User explicitly chose to quit or return home
    setTriageAnswers({});
    setConsentAnswers({ diag: false, stats: false, contact: false });
    setCurrentModule(null);
    setModuleAnswers({});
    setQuestionIndex(0);
    setCurrentRunId(null);
    setRestitution(null);
    navigate('/');
  };

  // S01 Consent
  const onConsent = () => {
    setTriageStep(3);
    
    const sessionId = localStorage.getItem('bc_session_id');
    if (sessionId) {
      submitConsentApi(sessionId, true)
        .then(() => {
          updateSessionApi(sessionId, 'in_progress', 'S01_consent')
            .catch(err => console.error('Error tracking session consent stage:', err));
        })
        .catch(err => console.error('Error submitting consent:', err));
    }

    navigate('/triage/wizard');
  };

  // Wizard S03-S09 answers
  const setTA = (key, val) => setTriageAnswers(p => ({ ...p, [key]: val }));

  const onS03 = (val) => {
    setTA('s03', val);
    if (val === 'curious') {
      navigate('/a-propos');
    } else {
      setTriageStep(4);
    }
  };

  const onS04 = (val) => {
    setTA('s04', val);
    setTriageStep(5);
  };

  const onS05 = (val) => {
    setTA('s05', val);
    setTriageStep(6);
  };

  const onS06 = (val) => {
    setTA('s06', val);
    setTriageStep(7);
  };

  const onS07 = (val) => {
    setTA('s07', val);
    setTriageStep(8);
  };

  const submitTriageToBackend = async (answers) => {
    const sessionId = localStorage.getItem('bc_session_id');
    if (!sessionId) {
       const localRoute = getRouteFromAnswers(answers);
       applyRoute(localRoute);
       return;
    }

    try {
      const res = await submitTriageToBackendApi(sessionId, answers);
      const data = res?.data || {};
      const recommended = data.recommended_module || {};
      const backendModuleId = recommended.code || 'FLH-01';
      const backendModuleName = recommended.name || recommended.module_name || null;
      const rawDuration = recommended.target_duration_formatted || recommended.duration || null;
      const backendDuration = typeof rawDuration === 'number' ? formatDurationSeconds(rawDuration) : rawDuration;
      const backendDescription = recommended.description || null;
      
      const triageId = data.triage_id;
      if (triageId) {
        localStorage.setItem('bc_triage_id', triageId);
      }
      localStorage.setItem('bc_recommended_module_code', backendModuleId);

      // Map module code to local route
      const routeMap = {
        'PRJ-02': 'S10',
        'DIF-03': 'S11',
        'OPP-04': 'S12',
        'FLH-01': 'S13'
      };
      const backendRoute = routeMap[backendModuleId] || 'S13';
      
      const baseMod = MODULE_BY_ROUTE[backendRoute] || MODULE_BY_ROUTE['S13'];
      
      // Récupérer d'abord les détails du module depuis le backend
      let fullModuleData = {
        ...baseMod,
        id: backendModuleId,
        name: backendModuleName || baseMod.name,
        duration: backendDuration || baseMod.duration,
        description: backendDescription,
        question_count: null
      };

      try {
        const modRes = await apiFetch(`/modules/${backendModuleId}`);
        const modDetail = modRes?.data || modRes || {};
        fullModuleData = {
          ...baseMod,
          id: backendModuleId,
          name: modDetail.name || backendModuleName || baseMod.name,
          duration: modDetail.target_duration_formatted || formatDurationSeconds(modDetail.target_duration) || backendDuration || baseMod.duration,
          description: modDetail.description || null,
          question_count: modDetail.question_count || null
        };
      } catch (err) {
        console.error('Error fetching module details:', err);
      }

      // Mettre à jour les states en même temps pour le rendu
      setCurrentModule(fullModuleData);
      setRouteKey(backendRoute);
      
      // Track session stage
      await updateSessionApi(sessionId, 'in_progress', backendRoute)
        .catch(err => console.error('Error tracking session triage stage:', err));

      // Confirm recommended module in backend
      if (triageId) {
        apiFetch(`/sessions/${sessionId}/triage/confirm`, {
          method: 'POST',
          body: JSON.stringify({ 
            triage_id: triageId,
            confirmed: true
          })
        }).catch(err => console.error('Error confirming triage module:', err));
      }

      // Naviguer seulement maintenant que les données réelles sont chargées
      navigate('/diagnostic/route');

    } catch (err) {
      console.error('Error submitting triage to backend, fallback to local:', err);
      const localRoute = getRouteFromAnswers(answers);
      applyRoute(localRoute);
    }
  };

  const onS08 = (val) => {
    setTA('s08', val);
    const answersWithS08 = { ...triageAnswers, s08: val };
    if (val === 'no' || val === 'idk') {
      setTriageStep(9);
    } else {
      submitTriageToBackend(answersWithS08);
    }
  };

  const onS09 = (val) => {
    setTA('s09', val);
    const answersWithS09 = { ...triageAnswers, s09: val };
    submitTriageToBackend(answersWithS09);
  };

  const applyRoute = (route) => {
    if (typeof route === 'object') {
      const targetRoute = route.route || 'S13';
      const moduleId = route.moduleId || 'FLH-01';
      
      setRouteKey(targetRoute);
      const baseMod = MODULE_BY_ROUTE[targetRoute] || MODULE_BY_ROUTE['S13'];
      setCurrentModule({
        ...baseMod,
        id: moduleId,
        name: route.moduleName || baseMod.name
      });
      navigate('/diagnostic/route');
    } else {
      setRouteKey(route);
      setCurrentModule(MODULE_BY_ROUTE[route] || MODULE_BY_ROUTE['S13']);
      navigate('/diagnostic/route');
    }
  };

  // Route Screens S10-S13
  const onRouteStart = () => navigate('/diagnostic/intro');
  const onRouteCatalog = () => navigate('/catalog');
  const onRouteBack = () => {
    setTriageStep(9);
    navigate('/triage/wizard');
  };

  // Catalog S20
  const onSelectModule = (mod) => {
    const warning = getVerifWarning(mod, triageAnswers);
    if (warning && Object.keys(triageAnswers).length > 0) {
      setChosenForVerif(mod);
      navigate('/diagnostic/verif');
    } else {
      setCurrentModule(mod);
      navigate('/diagnostic/intro');
    }
  };

  // Verif S21
  const onVerifConfirm = () => {
    setCurrentModule(chosenForVerif);
    navigate('/diagnostic/intro');
  };
  const onVerifReco = () => {
    const s07 = triageAnswers.s07 || [];
    const hasCrit = Array.isArray(s07) && s07.some(s => CRITICAL_SIGNALS.includes(s));
    setCurrentModule(hasCrit ? MODULE_BY_ROUTE['S11'] : MODULE_BY_ROUTE['S13']);
    navigate('/diagnostic/intro');
  };

  // Intro S30
  // Intro S30
  const onIntroStart = async () => {
    setQuestionIndex(0);
    setModuleAnswers({});
    
    const sessionId = localStorage.getItem('bc_session_id');
    const triageId = localStorage.getItem('bc_triage_id');
    const recommendedCode = localStorage.getItem('bc_recommended_module_code');
    const isRecommended = recommendedCode ? (recommendedCode === currentModule.id) : true;
    const isOverride = !isRecommended;

    if (sessionId && currentModule) {
      try {
        const res = await apiFetch(`/sessions/${sessionId}/diagnostics`, {
          method: 'POST',
          body: JSON.stringify({
            module_code: currentModule.id,
            triage_id: triageId || null,
            is_recommended: isRecommended,
            is_override: isOverride
          })
        });
        const runId = res?.data?.diagnostic_run_id || res?.diagnostic_run_id;
        if (runId) {
          setCurrentRunId(runId);
          await updateSessionApi(sessionId, 'in_progress', `INTRO_${currentModule.id}`)
            .catch(err => console.error('Error tracking session intro stage:', err));
        }
      } catch (err) {
        console.error('Error starting diagnostic run:', err);
      }
    }
    
    navigate('/diagnostic/question');
  };

  const onAnswer = (answer, proof, confidence, evidenceType, evidenceLabel) => {
    const q = questions[questionIndex];
    setModuleAnswers(p => ({ 
      ...p, 
      [q.id]: answer, 
      ...(proof ? { [`${q.id}_proof`]: proof } : {}),
      ...(confidence ? { [`${q.id}_confidence`]: confidence } : {}),
      ...(evidenceType ? { [`${q.id}_evidence_type`]: evidenceType } : {}),
      ...(evidenceLabel ? { [`${q.id}_evidence_label`]: evidenceLabel } : {})
    }));
    
    // Post answer in background if run active
    if (currentRunId) {
      const evidenceLevelMap = {
        'E0': 'E0_declarative',
        'E1': 'E1_concrete_indice',
        'E2': 'E2_document_available',
        'E3': 'E3_verifiable_data'
      };
      const evidence_level = evidenceLevelMap[proof] || null;

      apiFetch(`/diagnostics/${currentRunId}/answers`, {
        method: 'POST',
        body: JSON.stringify({
          question_id: q.id,
          answer_value: answer,
          response_confidence_user: confidence || null,
          evidence_level: evidence_level,
          evidence_type: evidenceType || null,
          evidence_label: evidenceLabel || null
        })
      }).catch(err => console.error('Error posting answer:', err));
    }

    if (questionIndex + 1 >= questions.length) {
      navigate('/diagnostic/calcul');
    } else {
      setQuestionIndex(p => p + 1);
    }
  };

  const onQuestionBack = () => {
    if (questionIndex === 0) {
      navigate('/diagnostic/intro');
    } else {
      setQuestionIndex(p => p - 1);
    }
  };

  const onQuit = () => {
    const sessionId = localStorage.getItem('bc_session_id');
    const screenCode = currentModule ? `QUESTION_${currentModule.id}_${questionIndex + 1}` : `QUESTION_${questionIndex + 1}`;
    if (sessionId) {
      abandonSessionApi(sessionId, screenCode)
        .catch(err => console.error('Error marking session as abandoned:', err));
    }
    onGoHome();
  };

  // S40 Calcul
  const onCalcDone = () => {
    if (currentRunId) {
      // Complete the run on backend
      apiFetch(`/diagnostics/${currentRunId}/complete`, { method: 'POST' })
        .then(() => {
          // Fetch final scoring results from backend
          return apiFetch(`/diagnostics/${currentRunId}/result`);
        })
        .then(res => {
          // Update local score from backend engine
          const backendScore = res?.data?.scoring?.credibilized_score_0_100 ?? res?.data?.scoring?.converted_score_0_100;
          if (typeof backendScore === 'number') {
            setScore(backendScore);
          } else {
            const localScore = currentModule ? calculateGlobalScore(currentModule.id, moduleAnswers) : 50;
            setScore(localScore);
          }
          
          // Stocker la restitution
          const restObj = res?.data?.restitution || res?.restitution;
          if (restObj) {
            setRestitution(restObj);
          }
          
          const sessionId = localStorage.getItem('bc_session_id');
          if (sessionId && currentModule) {
            updateSessionApi(sessionId, 'completed', `RESULT_${currentModule.id}`)
              .catch(err => console.error('Error tracking session completed stage:', err));
          }
          
          navigate('/diagnostic/resultats');
        })
        .catch(err => {
          console.error('Error calculating score on backend, fallback to local scoring:', err);
          const localScore = currentModule ? calculateGlobalScore(currentModule.id, moduleAnswers) : 50;
          setScore(localScore);
          setRestitution(null);
          navigate('/diagnostic/resultats');
        });
    } else {
      const localScore = currentModule ? calculateGlobalScore(currentModule.id, moduleAnswers) : 50;
      setScore(localScore);
      setRestitution(null);
      navigate('/diagnostic/resultats');
    }
  };

  // Results transitions
  const onResultsBack = () => {
    if (questions && questions.length > 0) {
      setQuestionIndex(questions.length - 1);
      navigate('/diagnostic/question');
    } else {
      navigate(-1);
    }
  };
  const onDetail = () => navigate('/diagnostic/orientation');
  const onFFNext = () => navigate('/diagnostic/priorites');
  const onPrioNext = () => navigate('/diagnostic/orientation');
  const onContact = () => navigate('/diagnostic/contact');
  const onDownload = () => {
    navigate('/diagnostic/contact');
  };

  const onContactSubmit = (data, mode) => {
    const action = data.action || mode;
    const name = data.nom || data.name || 'Anonyme';
    const email = data.email || '';
    const phone = data.tel || data.phone || '';
    const company = data.entreprise || triageAnswers.s05?.entreprise || '';

    console.log('Formulaire contact soumis:', { name, email, phone, action, company });
    
    // Register prospect user in store
    const userData = {
      name,
      email,
      phone,
      companyName: company,
      sector: triageAnswers.s05?.secteur || '',
      department: triageAnswers.s05?.region || '',
      commune: triageAnswers.s05?.commune || '',
      profile: triageAnswers.s03 || 'active',
      contactRequested: action === 'suivi',
      pdfDownloaded: action === 'pdf'
    };

    UtilisateurService.registerUser(userData).then(user => {
      // Save diagnostic report in store
      if (currentModule) {
        DiagnosticService.submitDiagnostic(currentModule.id, moduleAnswers, user);
      }

      // 1. Demande de suivi
      if (action === 'suivi' && currentRunId) {
        let needType = 'diagnostic_expert';
        if (currentModule.id === 'OPP-04') needType = 'finance_preparation';
        else if (currentModule.id === 'DIF-03') needType = 'business_support';

        apiFetch(`/diagnostics/${currentRunId}/follow-up`, {
          method: 'POST',
          body: JSON.stringify({
            full_name: name,
            phone_number: phone,
            whatsapp_number: phone,
            email: email || null,
            follow_up_need_type: needType,
            preferred_contact_channel: 'phone'
          })
        })
        .then(() => {
          navigate('/diagnostic/fin');
        })
        .catch(err => {
          console.error('Erreur lors de la demande de suivi backend:', err);
          setErrorModal({
            title: 'Erreur de contact',
            message: 'Une erreur est survenue lors de l’enregistrement de votre demande. Nos conseillers feront le point avec vous.'
          });
          // Naviguer quand même pour ne pas bloquer l'expérience utilisateur
          setTimeout(() => navigate('/diagnostic/fin'), 3000);
        });
        return;
      }

      // 2. Si l'utilisateur demande le PDF (Génération 100% Frontend avec coordonnées)
      if (action === 'pdf') {
        try {
          const { forces, fragilites, priorityText, priorities, confidence } = getRestitutionData({
            score,
            answers: moduleAnswers,
            moduleId: currentModule?.id || '',
            restitution: restitution
          });

          const moduleNames = {
            'PRJ-02': 'Diagnostic Projet',
            'DIF-03': 'Diagnostic Difficulté',
            'OPP-04': 'Diagnostic Opportunité',
            'FLH-01': 'Diagnostic Flash',
          };
          const moduleName = moduleNames[currentModule?.id] || currentModule?.id;

          generateDiagnosticPDF({
            score,
            moduleId: currentModule?.id || '',
            moduleName,
            forces,
            fragilites,
            priorityText,
            priorities,
            totalQuestions: Object.keys(moduleAnswers || {}).length,
            confidence,
            userName: name,
            userEmail: email,
            userPhone: phone,
            companyName: company,
            sector: triageAnswers.s05?.secteur || '',
            department: triageAnswers.s05?.region || '',
            commune: triageAnswers.s05?.commune || '',
          });
        } catch (pdfErr) {
          console.error('Erreur lors de la génération du PDF en local:', pdfErr);
        }
      }

      clearState();
      setTriageAnswers({});
      setConsentAnswers({ diag: false, stats: false, contact: false });
      setCurrentModule(null);
      setModuleAnswers({});
      setQuestionIndex(0);
      setCurrentRunId(null);
      setRestitution(null);
      navigate('/diagnostic/fin');
    });
  };

  const onContactSkip = () => {
    // Save anonymous diagnostic report in store
    if (currentModule) {
      DiagnosticService.submitDiagnostic(currentModule.id, moduleAnswers, null);
    }
    clearState();
    setTriageAnswers({});
    setConsentAnswers({ diag: false, stats: false, contact: false });
    setCurrentModule(null);
    setModuleAnswers({});
    setQuestionIndex(0);
    setCurrentRunId(null);
    setRestitution(null);
    navigate('/diagnostic/fin');
  };

  const onRestartFin = () => onGoHome();
  const onShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'Business Check-up — FUND.lab', url: window.location.origin });
    } else {
      navigator.clipboard.writeText(window.location.origin);
      alert('Lien de l\'application copié dans le presse-papiers !');
    }
  };

  const showNavbar = location.pathname !== '/diagnostic/fin';

  return (
    <>
      {showNavbar && <Navbar onGoHome={onGoHome} />}
      {showResumeModal && (
        <ResumeDiagnosticModal
          onConfirm={() => {
            setShowResumeModal(false);
            restoreState(pendingResumeState);
            setIsRestored(true);
          }}
          onCancel={() => {
            setShowResumeModal(false);
            clearState();
            setIsRestored(true);
          }}
        />
      )}
      {errorModal && (
        <ErrorModal
          title={errorModal.title}
          message={errorModal.message}
          onClose={() => setErrorModal(null)}
        />
      )}

      <Routes>
        <Route path="/" element={
          <LandingPage onStart={onStartAssisted} onLearnMore={onLearnMore} onGoToCatalog={onGoToCatalog} />
        } />
        <Route path="/comment-ca-marche" element={
          <CommentCaMarche onStart={onStartAssisted} />
        } />
        <Route path="/catalog" element={
          <CatalogScreen
            onSelect={onSelectModule}
            onBack={onGoHome}
            warningSignals={triageAnswers.s07}
          />
        } />
        <Route path="/a-propos" element={
          <InstitutionnelleScreen onBack={onGoHome} onContact={() => navigate('/contact')} />
        } />
        <Route path="/contact" element={
          <PublicContactScreen onBack={onGoHome} />
        } />

        {/* Wizard Triage */}
        <Route path="/triage/consent" element={
          <ConsentScreen
            initialAnswers={consentAnswers}
            onChangeConsent={setConsentAnswers}
            onContinue={onConsent}
            onBack={onGoHome}
          />
        } />
        <Route path="/triage/wizard" element={
          <>
            {triageStep === 3 && <S03Screen onContinue={onS03} onBack={() => navigate('/triage/consent')} initialAnswer={triageAnswers.s03 ?? null} />}
            {triageStep === 4 && <S04Screen onContinue={onS04} onBack={() => setTriageStep(3)} initialAnswer={triageAnswers.s04 ?? null} />}
            {triageStep === 5 && <S05Screen onContinue={onS05} onBack={() => setTriageStep(4)} initialAnswer={triageAnswers.s05 ?? null} />}
            {triageStep === 6 && <S06Screen onContinue={onS06} onBack={() => setTriageStep(5)} initialAnswer={triageAnswers.s06 ?? null} />}
            {triageStep === 7 && <S07Screen onContinue={onS07} onBack={() => setTriageStep(6)} initialAnswer={triageAnswers.s07 ?? null} />}
            {triageStep === 8 && <S08Screen onContinue={onS08} onBack={() => setTriageStep(7)} initialAnswer={triageAnswers.s08 ?? null} />}
            {triageStep === 9 && <S09Screen onContinue={onS09} onBack={() => setTriageStep(8)} initialAnswer={triageAnswers.s09 ?? null} />}
          </>
        } />

        {/* Evaluation Tunnel */}
        <Route path="/diagnostic/route" element={
          <RouteScreen
            routeKey={routeKey}
            recommendedModule={currentModule}
            onStart={onRouteStart}
            onCatalog={onGoToCatalog}
            onBack={onRouteBack}
          />
        } />
        <Route path="/diagnostic/verif" element={
          chosenForVerif && (
          <VerifModuleScreen
              chosenModule={chosenForVerif}
              warningMessage={getVerifWarning(chosenForVerif, triageAnswers)}
              onConfirm={onVerifConfirm}
              onAcceptReco={onVerifReco}
              recoModule={MODULE_BY_ROUTE['S11']}
              onBack={() => navigate(-1)}
            />
          )
        } />
        <Route path="/diagnostic/intro" element={
          currentModule && <IntroModuleScreen moduleId={currentModule.id} moduleData={currentModule} onStart={onIntroStart} onCatalog={onGoToCatalog} onBack={() => navigate(-1)} />
        } />
        <Route path="/diagnostic/question" element={
          currentModule && questions.length > 0 && (
            <QuestionScreen
              key={questionIndex}
              moduleId={currentModule.id}
              questionData={questions[questionIndex]}
              current={questionIndex + 1}
              total={questions.length}
              savedAnswer={moduleAnswers[questions[questionIndex]?.id] ?? null}
              onContinue={onAnswer}
              onBack={onQuestionBack}
              onQuit={onQuit}
            />
          )
        } />
        <Route path="/diagnostic/calcul" element={
          <CalculScreen onDone={onCalcDone} />
        } />
        <Route path="/diagnostic/resultats" element={
          <ResultatSyntheseScreen
            score={score}
            answers={moduleAnswers}
            moduleId={currentModule?.id || ''}
            onDetail={onDetail}
            onContact={onContact}
            onRestart={onGoHome}
            onBack={onResultsBack}
            restitution={restitution}
          />
        } />
        <Route path="/diagnostic/forces-fragilites" element={
          <ForceFragilitesScreen score={score} moduleId={currentModule?.id} answers={moduleAnswers} onContinue={onFFNext} restitution={restitution} onBack={() => navigate('/diagnostic/resultats')} />
        } />
        <Route path="/diagnostic/priorites" element={
          <PrioritesActionScreen score={score} onContinue={onPrioNext} restitution={restitution} onBack={() => navigate('/diagnostic/forces-fragilites')} />
        } />
        <Route path="/diagnostic/orientation" element={
          <OrientationSuivanteScreen
            score={score}
            onDownload={onDownload}
            onRestart={onGoHome}
            onContact={onContact}
            onCatalog={onGoToCatalog}
            restitution={restitution}
            onBack={() => navigate('/diagnostic/priorites')}
          />
        } />
        <Route path="/diagnostic/contact" element={
          <ContactSuiviScreen onSubmit={onContactSubmit} onSkip={onContactSkip} />
        } />
        <Route path="/diagnostic/fin" element={
          <FinParcoursScreen onRestart={onRestartFin} onShare={onShare} />
        } />
      </Routes>
    </>
  );
}

export default DiagnosticApp;
