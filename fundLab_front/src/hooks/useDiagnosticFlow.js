import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSessionPersist } from './useSessionPersist.js';
import { generateDiagnosticPDF } from '../utils/generateDiagnosticPDF.js';
import {
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
import { questionsApi } from '../api/questionsApi.js';



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
  const [isOffline, setIsOffline] = useState(false);
  const [references, setReferences] = useState(null);
  const [triageQuestions, setTriageQuestions] = useState([]);
  const [isEnrichmentMode, setIsEnrichmentMode] = useState(false);
  const lastSubmittedQuestionIdRef = useRef(null);

  useEffect(() => {
    lastSubmittedQuestionIdRef.current = null;
  }, [questionIndex, currentModule]);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('api-offline', handleOffline);

    // Test connectivity and fetch references immediately
    apiFetch('/reference-list')
      .then(res => {
        setIsOffline(false);
        if (res) {
          setReferences(res);
        }
      })
      .catch(err => {
        if (err.isNetworkError || err.status >= 500) {
          setIsOffline(true);
        }
      });

    // Fetch triage questions from backend module TRI-00
    questionsApi.getByModule('triage')
      .then(qList => {
        if (qList) {
          const filtered = qList.map(q => ({
            ...q,
            choices: (q.choices || []).filter(c => c.id !== 'idk' && !c.label.toLowerCase().includes('ne sais pas'))
          }));
          setTriageQuestions(filtered);
        }
      })
      .catch(err => console.error('Error fetching triage questions from backend:', err));

    return () => window.removeEventListener('api-offline', handleOffline);
  }, []);

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
    if (state.isEnrichmentMode !== undefined) setIsEnrichmentMode(state.isEnrichmentMode);
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
        isEnrichmentMode,
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
    isEnrichmentMode,
    location.pathname,
  ]);

  useEffect(() => {
    if (currentModule) {
      QuestionService.getQuestionsByModule(currentModule.id)
        .then(res => {
          if (res) {
            const filtered = res.map(q => ({
              ...q,
              choices: (q.choices || []).filter(c => c.id !== 'idk' && !c.label.toLowerCase().includes('ne sais pas'))
            }));
            setQuestions(filtered);
          } else {
            setQuestions([]);
          }
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

  const onConsent = async () => {
    setTriageStep(3);
    try {
      const res = await createSessionApi();
      const sessionId = res?.data?.session_id || res?.session_id;
      if (!sessionId) throw new Error('Aucun identifiant de session renvoyé par le serveur.');

      localStorage.setItem('bc_session_id', sessionId);
      saveState({
        triageStep: 3,
        triageAnswers: {},
        consentAnswers: { diag: true, stats: false, contact: false },
        currentModule: null,
        routeKey: null,
        questionIndex: 0,
        moduleAnswers: {},
        score: 0,
        chosenForVerif: null,
        currentRunId: null,
        restitution: null,
        currentPath: currentModule ? '/diagnostic/intro' : '/triage/wizard',
        sessionId: sessionId
      });

      submitConsentApi(sessionId, true)
        .then(() => {
          updateSessionApi(sessionId, 'in_progress', 'S01_consent')
            .catch(err => console.error('Error tracking session consent stage:', err));
        })
        .catch(err => console.error('Error submitting consent:', err));

      setIsOffline(false);
      // Si un module est déjà sélectionné (venu du catalogue), retourner à l'intro du diagnostic
      if (currentModule) {
        navigate('/diagnostic/intro');
      } else {
        navigate('/triage/wizard');
      }
    } catch (err) {
      console.error('Error creating session on consent:', err);
      setIsOffline(true);
      setErrorModal({
        title: 'Serveur temporairement indisponible',
        message: 'Impossible de démarrer le diagnostic sans connexion avec le serveur. Veuillez vérifier votre connexion internet ou réessayer plus tard.'
      });
    }
  };

  const setTA = (key, val) => setTriageAnswers(p => ({ ...p, [key]: val }));

  const onS03 = (val) => {
    setTA('s03', val);
    if (val === 'curious') {
      navigate('/a-propos');
    } else {
      setTriageStep(6);
    }
  };

  const onS04 = (val) => {
    setTA('s04', val);
    setTriageStep(7);
  };

  const onS00 = (val) => {
    setTA('s00', val);
    if (val === 'assisted') {
      setTriageStep(4);
    } else if (val === 'direct' || val === 'direct_catalog') {
      onGoToCatalog();
    } else if (val === 'learn' || val === 'learn_more') {
      onLearnMore();
    } else if (val === 'institutional') {
      navigate('/a-propos');
    }
  };

  const onS05 = (val) => {
    setTA('s05', val);
    setTriageStep(5);
  };

  const onS06 = (val) => {
    setTA('s06', val);
    setTriageStep(8);
  };

  const onS07 = (val) => {
    setTA('s07', val);
    setTriageStep(9);
  };



  const submitTriageToBackend = async (answers) => {
    const sessionId = localStorage.getItem('bc_session_id');
    if (!sessionId) {
      setErrorModal({
        title: 'Session introuvable',
        message: 'Impossible de continuer sans session active avec le serveur.'
      });
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

      const backendRoute = data.route || data.recommended_route || 'S13';
      
      let fullModuleData = {
        id: backendModuleId,
        name: backendModuleName || 'Diagnostic',
        duration: backendDuration || '',
        description: backendDescription || '',
        question_count: null
      };

      try {
        const modRes = await apiFetch(`/modules/${backendModuleId}`);
        const modDetail = modRes?.data || modRes || {};
        fullModuleData = {
          id: backendModuleId,
          name: modDetail.name || backendModuleName || 'Diagnostic',
          duration: modDetail.target_duration_formatted || formatDurationSeconds(modDetail.target_duration) || backendDuration || '',
          description: modDetail.description || backendDescription || '',
          question_count: modDetail.question_count || null
        };
      } catch (err) {
        console.error('Error fetching module details:', err);
      }

      setCurrentRunId(null);
      setModuleAnswers({});
      setQuestionIndex(0);
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
      console.error('Error submitting triage to backend:', err, err.data);
      let details = '';
      if (err.data && err.data.errors) {
        details = ' Détails: ' + JSON.stringify(err.data.errors);
      }
      setErrorModal({
        title: 'Erreur de validation du serveur',
        message: `Le serveur a rejeté la soumission : ${err.message}.${details}`
      });
    }
  };

  const onS08 = (val) => {
    setTA('s08', val);
    if (val === 'no' || val === 'idk') {
      setTriageStep(10);
    } else {
      setTriageStep(11);
    }
  };

  const onS09 = (val) => {
    setTA('s09', val);
    setTriageStep(11);
  };

  const onS10 = (val) => {
    setTA('s10', val);
    const answersWithS10 = { ...triageAnswers, s10: val };
    submitTriageToBackend(answersWithS10);
  };

  const onRouteStart = () => navigate('/diagnostic/intro');
  const onRouteCatalog = () => navigate('/catalog');
  const onRouteBack = () => {
    setTriageStep(5);
    navigate('/triage/wizard');
  };

  const onSelectModule = (mod) => {
    setCurrentRunId(null);
    setModuleAnswers({});
    setQuestionIndex(0);
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
    setCurrentRunId(null);
    setModuleAnswers({});
    setQuestionIndex(0);
    setCurrentModule(chosenForVerif);
    navigate('/diagnostic/intro');
  };

  const onVerifReco = async () => {
    setCurrentRunId(null);
    setModuleAnswers({});
    setQuestionIndex(0);
    const recommendedModuleId = localStorage.getItem('bc_recommended_module_code') || 'FLH-01';
    try {
      const res = await apiFetch(`/modules/${recommendedModuleId}`);
      const modDetail = res?.data || res || {};
      setCurrentModule({
        id: recommendedModuleId,
        name: modDetail.name || 'Diagnostic',
        duration: modDetail.target_duration_formatted || formatDurationSeconds(modDetail.target_duration) || '',
        description: modDetail.description || '',
        question_count: modDetail.question_count || null
      });
      navigate('/diagnostic/intro');
    } catch (err) {
      console.error('Error fetching verification recommended module:', err);
      navigate('/catalog');
    }
  };

  const onIntroStart = async () => {
    setQuestionIndex(0);
    setModuleAnswers({});

    let sessionId = localStorage.getItem('bc_session_id');

    // Si pas de session : rediriger vers le consentement d'abord (le module est déjà mémorisé dans currentModule)
    if (!sessionId) {
      navigate('/triage/consent');
      return;
    }

    // Si un run existe déjà (retour arrière depuis les questions), on le réutilise sans en créer un nouveau
    if (currentRunId) {
      navigate('/diagnostic/question');
      return;
    }

    if (sessionId && currentModule) {
      const triageId = localStorage.getItem('bc_triage_id');
      const recommendedCode = localStorage.getItem('bc_recommended_module_code');
      const isRecommended = recommendedCode ? (recommendedCode === currentModule.id) : true;
      const isOverride = !isRecommended;
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
    if (!q) return;

    if (lastSubmittedQuestionIdRef.current === q.id) {
      console.warn('Duplicate answer submission blocked for question:', q.id);
      return;
    }
    lastSubmittedQuestionIdRef.current = q.id;

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
      }).catch(err => {
        // 409 = question already answered (user navigated back) — silently ignore
        if (err?.status === 409) return;
        console.error('Error posting answer:', err);
      });
    }

    if (questionIndex + 1 >= questions.length) {
      if (isEnrichmentMode) {
        navigate('/diagnostic/profil');
      } else {
        navigate('/diagnostic/calcul');
      }
    } else {
      setQuestionIndex(p => p + 1);
    }
  };

  const onQuestionBack = () => {
    if (questionIndex === 0) {
      if (isEnrichmentMode) {
        navigate('/diagnostic/enrichissement-consent');
      } else {
        navigate('/diagnostic/intro');
      }
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
            setScore(0);
          }
          
          const restObj = res?.data?.restitution || res?.restitution;
          if (restObj) {
            const scoringData = res?.data?.scoring || res?.scoring || null;
            console.log('[DEBUG] Backend scoring object:', JSON.stringify(scoringData, null, 2));
            setRestitution({ 
              ...restObj, 
              scoring: scoringData,
              disclaimer: res?.data?.disclaimer || res?.disclaimer || null,
              disclaimer_financing: res?.data?.disclaimer_financing || res?.disclaimer_financing || null
            });
          }
          
          const sessionId = localStorage.getItem('bc_session_id');
          if (sessionId && currentModule) {
            updateSessionApi(sessionId, 'completed', `RESULT_${currentModule.id}`)
              .catch(err => console.error('Error tracking session completed stage:', err));
          }
          
          navigate('/diagnostic/resultats');
        })
        .catch(err => {
          console.error('Error calculating score on backend:', err);
          setScore(0);
          setRestitution(null);
          setErrorModal({
            title: 'Erreur de calcul',
            message: 'Impossible de calculer le score depuis le serveur. Veuillez réessayer.'
          });
        });
    } else {
      setErrorModal({
        title: 'Diagnostic introuvable',
        message: 'Impossible de terminer le diagnostic sans session active.'
      });
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
        DiagnosticService.submitDiagnostic(currentModule.id, moduleAnswers, user, score);
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
      DiagnosticService.submitDiagnostic(currentModule.id, moduleAnswers, null, score);
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

  const onEnrichment = () => {
    navigate('/diagnostic/enrichissement-consent');
  };

  const onStartEnrichmentQuestions = async () => {
    if (!currentModule) return;
    try {
      const qList = await questionsApi.getByModule(currentModule.id, 'enrichment');
      if (qList && qList.length > 0) {
        setQuestions(qList);
        setQuestionIndex(0);
        setIsEnrichmentMode(true);
        navigate('/diagnostic/question');
      } else {
        // Pas de questions d'enrichissement pour ce module, aller directement au profil
        navigate('/diagnostic/profil');
      }
    } catch (err) {
      console.error('Error loading enrichment questions:', err);
      navigate('/diagnostic/profil');
    }
  };

  const onEnrichmentCancel = () => {
    navigate('/diagnostic/resultats');
  };

  const onProfileBack = () => {
    if (isEnrichmentMode && questions.length > 0) {
      setQuestionIndex(questions.length - 1);
      navigate('/diagnostic/question');
    } else {
      navigate('/diagnostic/enrichissement-consent');
    }
  };

  const onProfileSubmit = async (profileData) => {
    const sessionId = localStorage.getItem('bc_session_id');
    if (!sessionId) {
      navigate('/diagnostic/fin');
      return;
    }

    const formattedAnswers = {
      ...triageAnswers,
      s03: profileData.user_profile_type,
      s04: profileData.activity_stage,
      s05: {
        ...(triageAnswers?.s05 || {}),
        business_name: profileData.business_name || null,
        region: profileData.region,
        commune: profileData.commune || null,
        secteur: profileData.sector,
        soussecteur: profileData.sub_sector || null,
        creation_year: profileData.year_created || null,
      },
      name: profileData.full_name || null,
      phone: profileData.phone_number || null,
      whatsapp_number: profileData.whatsapp_number || null,
      email: profileData.email || null,
      ca_n_1: profileData.ca_n_1 || null,
      ca_m_1: profileData.ca_m_1 || null,
      employee_count_range: profileData.employee_count_range || null,
      s00: triageAnswers?.s00 || 'direct',
      s06: triageAnswers?.s06 || 'global_understanding',
      s07: triageAnswers?.s07 || [],
      s08: triageAnswers?.s08 || 'none',
      s09: triageAnswers?.s09 || 'full_360'
    };

    try {
      await submitTriageToBackendApi(sessionId, formattedAnswers);

      const userObj = {
        name: profileData.full_name || 'Anonyme',
        email: profileData.email || '',
        phone: profileData.phone_number || '',
        companyName: profileData.business_name || ''
      };

      if (currentModule) {
        await DiagnosticService.submitDiagnostic(currentModule.id, moduleAnswers, userObj, score);
      }

      if (currentRunId) {
        localStorage.setItem('last_run_id', currentRunId);
      }
      if (profileData) {
        localStorage.setItem('last_user_name', profileData.full_name || '');
        localStorage.setItem('last_user_email', profileData.email || '');
        localStorage.setItem('last_user_phone', profileData.phone_number || '');
        localStorage.setItem('last_user_whatsapp', profileData.whatsapp_number || '');
      }

      clearState();
      setTriageAnswers({});
      setConsentAnswers({ diag: false, stats: false, contact: false });
      setCurrentModule(null);
      setModuleAnswers({});
      setQuestionIndex(0);
      setCurrentRunId(null);
      setRestitution(null);
      setIsEnrichmentMode(false);
      navigate('/diagnostic/fin');
    } catch (err) {
      console.error('Error submitting profile triage:', err);
      throw err;
    }
  };

  const onProfileSkip = () => {
    if (currentModule) {
      DiagnosticService.submitDiagnostic(currentModule.id, moduleAnswers, null, score);
    }
    clearState();
    setTriageAnswers({});
    setConsentAnswers({ diag: false, stats: false, contact: false });
    setCurrentModule(null);
    setModuleAnswers({});
    setQuestionIndex(0);
    setCurrentRunId(null);
    setRestitution(null);
    setIsEnrichmentMode(false);
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
    isOffline,
    references,
    triageQuestions,
    showResumeModal, setShowResumeModal,
    pendingResumeState, setPendingResumeState,
    isRestored, setIsRestored,
    
    // Actions
    onStartAssisted,
    onGoToCatalog,
    onLearnMore,
    onGoHome,
    onConsent,
    onS00,
    onS03,
    onS04,
    onS05,
    onS06,
    onS07,
    onS08,
    onS09,
    onS10,
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
    restoreState,
    isEnrichmentMode,
    onEnrichment,
    onStartEnrichmentQuestions,
    onEnrichmentCancel,
    onProfileSubmit,
    onProfileSkip,
    onProfileBack
  };
}
