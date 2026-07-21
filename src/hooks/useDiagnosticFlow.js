import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSessionPersist } from './useSessionPersist.js';
import { generateDiagnosticPDF } from '../utils/generateDiagnosticPDF.js';
import { getRestitutionData } from '../utils/restitutionHelper.js';
import {
  computeRoute,
  calculateGlobalScore,
  createSessionApi,
  submitConsentApi,
  submitTriageToBackendApi,
  updateSessionApi,
  abandonSessionApi,
} from '../api/index.js';
import { QuestionService } from '../services/QuestionService.js';
import { DiagnosticService } from '../services/DiagnosticService.js';
import { UtilisateurService } from '../services/UtilisateurService.js';
import { apiFetch, formatDurationSeconds } from '../api/config.js';

const MODULE_BY_ROUTE = {
  'S10': { id: 'PRJ-02', name: 'Diagnostic Projet',     duration: '8-12 min' },
  'S11': { id: 'DIF-03', name: 'Diagnostic Difficulté',  duration: '10-15 min' },
  'S12': { id: 'OPP-04', name: 'Diagnostic Opportunité', duration: '10-15 min' },
  'S13': { id: 'FLH-01', name: 'Diagnostic Flash',       duration: '7-10 min' },
};

const CRITICAL_SIGNALS = ['charges', 'dettes', 'treso'];

const getRouteFromAnswers = (answers) => {
  const result = computeRoute({ ...answers, s03: answers.s03 });
  if (!result) return 'S13';
  if (result.moduleId) return { route: result.route, moduleId: result.moduleId };
  return result.route || 'S13';
};

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

export function useDiagnosticFlow() {
  const navigate = useNavigate();
  const location = useLocation();

  const { saveState, loadState, clearState } = useSessionPersist();
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [pendingResumeState, setPendingResumeState] = useState(null);
  const [isRestored, setIsRestored] = useState(false);

  const [triageStep, setTriageStep] = useState(3);
  const [triageAnswers, setTriageAnswers] = useState({});
  const [consentAnswers, setConsentAnswers] = useState({ diag: false, stats: false, contact: false });
  const [currentModule, setCurrentModule] = useState(null);
  const [routeKey, setRouteKey] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [moduleAnswers, setModuleAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [chosenForVerif, setChosenForVerif] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentRunId, setCurrentRunId] = useState(null);
  const [restitution, setRestitution] = useState(null);
  const [errorModal, setErrorModal] = useState(null);

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

  useEffect(() => {
    const saved = loadState();
    if (saved) {
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
    clearState();
    setTriageStep(3);
    setTriageAnswers({});
    setConsentAnswers({ diag: false, stats: false, contact: false });
    setCurrentModule(null);
    setRestitution(null);
    setCurrentRunId(null);
    setQuestions([]);
    setScore(0);
    
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
    clearState();
    setTriageAnswers({});
    setConsentAnswers({ diag: false, stats: false, contact: false });
    setCurrentModule(null);
    setModuleAnswers({});
    setQuestionIndex(0);
    setCurrentRunId(null);
    setRestitution(null);
    navigate('/');
  };

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

      const routeMap = {
        'PRJ-02': 'S10',
        'DIF-03': 'S11',
        'OPP-04': 'S12',
        'FLH-01': 'S13'
      };
      const backendRoute = routeMap[backendModuleId] || 'S13';
      const baseMod = MODULE_BY_ROUTE[backendRoute] || MODULE_BY_ROUTE['S13'];
      
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

      setCurrentModule(fullModuleData);
      setRouteKey(backendRoute);
      
      await updateSessionApi(sessionId, 'in_progress', backendRoute)
        .catch(err => console.error('Error tracking session triage stage:', err));

      if (triageId) {
        apiFetch(`/sessions/${sessionId}/triage/confirm`, {
          method: 'POST',
          body: JSON.stringify({ triage_id: triageId, confirmed: true })
        }).catch(err => console.error('Error confirming triage module:', err));
      }

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

  const onRouteStart = () => navigate('/diagnostic/intro');
  const onRouteCatalog = () => navigate('/catalog');
  const onRouteBack = () => {
    setTriageStep(3);
    navigate('/triage/wizard');
  };

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

  const onCalcDone = () => {
    if (currentRunId) {
      apiFetch(`/diagnostics/${currentRunId}/complete`, { method: 'POST' })
        .then(() => apiFetch(`/diagnostics/${currentRunId}/result`))
        .then(res => {
          const backendScore = res?.data?.scoring?.credibilized_score_0_100 ?? res?.data?.scoring?.converted_score_0_100;
          if (typeof backendScore === 'number') {
            setScore(backendScore);
          } else {
            const localScore = currentModule ? calculateGlobalScore(currentModule.id, moduleAnswers) : 50;
            setScore(localScore);
          }
          
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
  const onDownload = () => navigate('/diagnostic/contact');

  const onContactSubmit = (data, mode) => {
    const action = data.action || mode;
    const name = data.nom || data.name || 'Anonyme';
    const email = data.email || '';
    const phone = data.tel || data.phone || '';
    const company = data.entreprise || triageAnswers.s05?.entreprise || '';

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
      if (currentModule) {
        DiagnosticService.submitDiagnostic(currentModule.id, moduleAnswers, user);
      }

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
          setTimeout(() => navigate('/diagnostic/fin'), 3000);
        });
        return;
      }

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

  return {
    triageStep, setTriageStep,
    triageAnswers, setTriageAnswers,
    consentAnswers, setConsentAnswers,
    currentModule, setCurrentModule,
    routeKey, setRouteKey,
    questionIndex, setQuestionIndex,
    moduleAnswers, setModuleAnswers,
    score, setScore,
    chosenForVerif, setChosenForVerif,
    questions, setQuestions,
    currentRunId, setCurrentRunId,
    restitution, setRestitution,
    errorModal, setErrorModal,
    showResumeModal, setShowResumeModal,
    pendingResumeState, setPendingResumeState,
    isRestored, setIsRestored,
    
    // Actions
    onStartAssisted,
    onGoToCatalog,
    onLearnMore,
    onGoHome,
    onConsent,
    onS03,
    onS04,
    onS05,
    onS06,
    onS07,
    onS08,
    onS09,
    onRouteStart,
    onRouteCatalog,
    onRouteBack,
    onSelectModule,
    onVerifConfirm,
    onVerifReco,
    onIntroStart,
    onAnswer,
    onQuestionBack,
    onQuit,
    onCalcDone,
    onResultsBack,
    onDetail,
    onFFNext,
    onPrioNext,
    onContact,
    onDownload,
    onContactSubmit,
    onContactSkip,
    onRestartFin,
    onShare,
    restoreState
  };
}
