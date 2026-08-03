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
import { requestEmailVerificationApi, confirmEmailVerificationApi } from '../api/authApi.js';
import { STORAGE_KEYS, clearDiagnosticStorage } from '../constants/storageKeys.js';



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
  const [isRetrying, setIsRetrying] = useState(false);
  const [references, setReferences] = useState(null);

  const retryConnection = async () => {
    setIsRetrying(true);
    try {
      const res = await apiFetch('/reference-list');
      if (res) {
        setReferences(res);
      }
      // Re-fetch triage questions if empty
      if (triageQuestions.length === 0) {
        const qList = await questionsApi.getTriageQuestions();
        if (qList) {
          setTriageQuestions(qList);
        }
      }
      setIsOffline(false);
      return true;
    } catch (err) {
      console.error('Retry connection failed:', err);
      return false;
    } finally {
      setIsRetrying(false);
    }
  };

  const [triageQuestions, setTriageQuestions] = useState([]);
  const [isEnrichmentMode, setIsEnrichmentMode] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [pendingProfileData, setPendingProfileData] = useState(null);
  const [emailVerificationError, setEmailVerificationError] = useState('');
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [showEnrichmentCompletionModal, setShowEnrichmentCompletionModal] = useState(false);
  const [showPostEnrichmentEmailModal, setShowPostEnrichmentEmailModal] = useState(false);
  const [showTriageCompletionModal, setShowTriageCompletionModal] = useState(false);
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
        if (typeof window !== 'undefined' && window.navigator && window.navigator.onLine === false) {
          setIsOffline(true);
        }
      });

    // Fetch triage questions from backend module TRI-00
    questionsApi.getTriageQuestions()
      .then(qList => {
        if (qList) {
          setTriageQuestions(qList);
          const hasEntryChoice = qList.some(q => q.axe === 'entry_choice' || q.id === 'TRI-00-Q00');
          if (!hasEntryChoice) {
            setTriageStep(prev => prev === 3 ? 4 : prev);
          }
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
    if (state.sessionId) localStorage.setItem(STORAGE_KEYS.SESSION_ID, state.sessionId);

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
      localStorage.getItem(STORAGE_KEYS.SESSION_ID) ||
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
        sessionId: localStorage.getItem(STORAGE_KEYS.SESSION_ID),
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
      QuestionService.getDiagnosticQuestions(currentModule.id)
        .then(res => {
          if (res) {
            setQuestions(res);
          } else {
            setQuestions([]);
          }
        })
        .catch(err => {
          console.warn(`[useDiagnosticFlow] Unable to load questions for ${currentModule.id}:`, err);
          setQuestions([]);
        });
    } else {
      setQuestions([]);
    }
  }, [currentModule]);

  const onStartAssisted = () => {
    const isAuthenticated = Boolean(localStorage.getItem('bc_is_authenticated') === 'true' || localStorage.getItem('bc_user_profile'));
    if (isAuthenticated) {
      navigate('/catalog');
      return;
    }
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

  const onGoToCatalog = () => navigate('/catalog');
  const onLearnMore = () => navigate('/a-propos');
  const onGoHome = () => {
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
    const isAuthenticated = Boolean(localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED) === 'true' || localStorage.getItem(STORAGE_KEYS.USER_PROFILE));
    const hasDeviceProfile = Boolean(localStorage.getItem(STORAGE_KEYS.SESSION_ID) || isAuthenticated);

    if (currentModule) {
      if (isAuthenticated) {
        onIntroStart();
      } else {
        navigate('/diagnostic/profil-initial');
      }
    } else {
      setTriageStep(1);
      navigate('/triage/wizard');
    }

    createSessionApi()
      .then(res => {
        const sessionId = res?.data?.session_id || res?.session_id;
        if (sessionId) {
          localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
          saveState({
            triageStep: 3,
            triageAnswers: {},
            consentAnswers: { diag: true, stats: false, contact: false },
            currentModule: currentModule,
            routeKey: null,
            questionIndex: 0,
            moduleAnswers: {},
            score: 0,
            chosenForVerif: null,
            currentRunId: null,
            restitution: null,
            currentPath: currentModule ? (hasDeviceProfile ? '/diagnostic/loading' : '/diagnostic/profil-initial') : '/triage/wizard',
            sessionId: sessionId
          });

          submitConsentApi(sessionId, true)
            .then(() => {
              updateSessionApi(sessionId, 'in_progress', 'S01_consent')
                .catch(err => console.error('Error tracking session consent stage:', err));
            })
            .catch(err => console.error('Error submitting consent:', err));

          if (currentModule && hasDeviceProfile) {
            onIntroStart();
          }
        }
      })
      .catch(err => {
        console.error('Error creating session on consent:', err);
      });
  };

  const setTA = (key, val) => setTriageAnswers(p => ({ ...p, [key]: val }));

  const onS00 = (val) => {
    setTA('s00', val);
    const isAuthenticated = localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED) === 'true';
    if (isAuthenticated) {
      setTriageStep(5);
    } else {
      setTriageStep(4);
    }
  };

  const onTriageProfileSubmit = (profileData) => {
    const updated = {
      ...triageAnswers,
      full_name: profileData.full_name || null,
      phone_number: profileData.phone_number || null,
      whatsapp_number: profileData.whatsapp_number || null,
      email: profileData.email || null,
      business_name: profileData.business_name || null,
      region: profileData.region || 'Atlantique',
      commune: profileData.commune || null,
      sector: profileData.sector || null,
      sub_sector: profileData.sub_sector || null,
      year_created: profileData.year_created || null,
      ca_n_1: profileData.ca_n_1 || null,
      ca_m_1: profileData.ca_m_1 || null,
      employee_count_range: profileData.employee_count_range || null,
      description: profileData.activity_description || null
    };
    setTriageAnswers(updated);
    setTriageStep(5);
  };

  const onTriageDynamicAnswer = (qId, ans, index) => {
    const updated = {
      ...triageAnswers,
      [qId]: ans
    };
    setTriageAnswers(updated);

    if (triageQuestions && index + 1 >= triageQuestions.length) {
      submitTriageToBackend(updated);
    } else {
      setTriageStep(p => p + 1);
    }
  };

  const handleInitiateEmailVerification = async (profileData) => {
    setPendingProfileData(profileData);

    // Save profileData to triageAnswers and localStorage immediately
    const updated = {
      ...triageAnswers,
      s05: {
        ...(triageAnswers?.s05 || {}),
        business_name: profileData.business_name || null,
        activity_description: profileData.activity_description || null,
        region: profileData.region,
        commune: profileData.commune || null,
        secteur: profileData.sector,
        soussecteur: profileData.sub_sector || null,
        creation_year: profileData.year_created || null,
      },
      name: profileData.full_name || null,
      phone: profileData.phone_number || null,
      email: profileData.email || null,
      activity_description: profileData.activity_description || null
    };
    setTriageAnswers(updated);
    if (profileData.email) {
      localStorage.setItem(STORAGE_KEYS.USER_EMAIL, profileData.email);
    }
    localStorage.setItem('bc_user_profile', JSON.stringify(updated));

    // CAS 1 (Flow 3) : Clic sur "J'ai déjà effectué un diagnostic" -> Déclencher l'OTP pour valider l'accès à l'historique
    if (profileData?.is_existing_lookup) {
      setEmailVerificationError('');
      setIsEmailLoading(true);
      setIsVerifyingEmail(true);

      try {
        await requestEmailVerificationApi({
          email: profileData.email,
          full_name: profileData.full_name,
          diagnostic_run_id: currentRunId
        });
      } catch (err) {
        console.error('Error requesting email verification code for existing lookup:', err);
        setEmailVerificationError(err.message || 'Impossible d’envoyer le code de vérification.');
      } finally {
        setIsEmailLoading(false);
      }
      return;
    }

    // CAS 2 (Flow 1 & Flow 2) : Nouvelle saisie de profil -> SANS OTP ! Passage direct à la suite.
    setIsVerifyingEmail(false);
    onTriageProfileSubmit(profileData);
  };

  const handleConfirmEmailCode = async (code) => {
    if (!pendingProfileData?.email) return;
    setEmailVerificationError('');
    setIsEmailLoading(true);

    try {
      const res = await confirmEmailVerificationApi({
        email: pendingProfileData.email,
        code
      });

      // Enregistrer l'état d'authentification valide
      localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'true');
      if (pendingProfileData?.email) {
        localStorage.setItem(STORAGE_KEYS.USER_EMAIL, pendingProfileData.email);
      }

      if (pendingProfileData?.is_existing_lookup) {
        setIsVerifyingEmail(false);
        navigate('/diagnostic/historique');
        return res;
      }

      if (pendingProfileData?.is_post_enrichment) {
        setIsVerifyingEmail(false);
        navigate('/diagnostic/fin');
        return res;
      }

      if (res?.is_returning_user && res?.resume_data) {
        // Utilisateur existant → Reprise directe du dernier module et de la dernière question
        const resume = res.resume_data;
        if (resume.session_id) {
          localStorage.setItem(STORAGE_KEYS.SESSION_ID, resume.session_id);
        }

        setIsVerifyingEmail(false);
        onTriageProfileSubmit(pendingProfileData);

        const targetModule = modulesList.find(m => m.id === resume.module_id || m.code === resume.module_id);
        if (targetModule) {
          onSelectModule(targetModule);
          if (typeof resume.question_index === 'number') {
            setQuestionIndex(resume.question_index);
          }
          navigate('/diagnostic/intro');
        } else {
          setTriageStep(5);
        }
      } else {
        // Nouvel utilisateur
        setIsVerifyingEmail(false);
        onTriageProfileSubmit(pendingProfileData);

        if (currentModule) {
          navigate('/diagnostic/intro');
        }
      }
      return res;
    } catch (err) {
      console.error('Error confirming email verification code:', err);
      const errMsg = err.message || 'Code de vérification invalide ou expiré.';
      setEmailVerificationError(errMsg);
      throw err;
    } finally {
      setIsEmailLoading(false);
    }
  };



  const submitTriageToBackend = async (answers) => {
    let sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);

    if (!sessionId) {
      try {
        console.warn('Session ID introuvable dans localStorage, création d\'une nouvelle session...');
        const newSessionRes = await createSessionApi();
        sessionId = newSessionRes?.data?.session_id || newSessionRes?.session_id;
        if (sessionId) {
          localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
          // Soumettre automatiquement le consentement pour éviter "403 Diagnostic consent required"
          await submitConsentApi(sessionId, true).catch(err => console.error('Consent fallback error:', err));
        }
      } catch (sessErr) {
        console.error('Erreur lors de la création de la session de secours:', sessErr);
      }
    }

    if (!sessionId) {
      setErrorModal({
        title: 'Session introuvable',
        message: 'Impossible de continuer sans session active avec le serveur. Veuillez réactualiser la page.'
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
        localStorage.setItem(STORAGE_KEYS.TRIAGE_ID, triageId);
      }
      localStorage.setItem(STORAGE_KEYS.RECOMMENDED_MODULE, backendModuleId);

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
      console.error('[Triage] Technical error submitting triage to backend:', err, err.data || err.errors);
      const errMsg = err?.message || '';

      if (errMsg.includes('Duplicate entry') || errMsg.includes('23000') || errMsg.includes('UniqueConstraintViolationException')) {
        setErrorModal({
          title: 'Compte / Email déjà existant',
          message: 'Votre profil est déjà enregistré ! Vous n\'avez plus besoin de passer par le triage et pouvez accéder directement au catalogue des diagnostics.',
          actionLabel: 'Accéder aux diagnostics',
          onAction: () => {
            navigate('/catalog');
          }
        });
        return;
      }

      const isNetworkError = err?.isNetworkError || err?.message?.includes('Network Error') || (typeof window !== 'undefined' && window.navigator?.onLine === false);

      if (isNetworkError) {
        setErrorModal({
          title: 'Problème de connexion',
          message: 'Un problème de connexion réseau s\'est produit. Veuillez vérifier votre connexion internet et réessayer l\'envoi.',
          actionLabel: 'Réessayer l\'envoi',
          onAction: () => submitTriageToBackend(answers)
        });
      } else {
        setErrorModal({
          title: 'Erreur lors de l\'envoi de la réponse',
          message: 'Une erreur est survenue lors de l\'envoi vers le serveur. Veuillez réessayer.',
          actionLabel: 'Réessayer',
          onAction: () => submitTriageToBackend(answers)
        });
      }
    }
  };

  const onConfirmTriageCompletion = () => {
    setShowTriageCompletionModal(false);
    if (triageAnswers) {
      submitTriageToBackend(triageAnswers);
    }
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
    const recommendedModuleId = localStorage.getItem(STORAGE_KEYS.RECOMMENDED_MODULE) || 'FLH-01';
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

    // 1. Vérification de la présence du profil PME initial
    const isAuthenticated = localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED) === 'true';
    const userEmail = localStorage.getItem(STORAGE_KEYS.USER_EMAIL) || triageAnswers?.email || pendingProfileData?.email;
    const hasFullName = triageAnswers?.full_name || triageAnswers?.name || pendingProfileData?.full_name;

    if (!isAuthenticated && (!userEmail || !hasFullName)) {
      console.warn('[onIntroStart] Nouveau profil détecté sans profil PME. Redirection vers UserProfileFormScreen...');
      setTriageStep(4);
      navigate('/triage/wizard');
      return;
    }

    // 2. Navigation immédiate vers l'écran de chargement pour éliminer tout gel d'interface
    navigate('/diagnostic/loading');

    let sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);

    // 3. Si l'utilisateur n'a pas encore de session active, création de la session
    if (!sessionId) {
      try {
        console.warn('Création d\'une nouvelle session pour l\'utilisateur connecté...');
        const newSessionRes = await createSessionApi();
        sessionId = newSessionRes?.data?.session_id || newSessionRes?.session_id;
        if (sessionId) {
          localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
          await submitConsentApi(sessionId, true).catch(err => console.error('Consent error:', err));
        }
      } catch (sessErr) {
        console.error('Erreur lors de la création de session:', sessErr);
        navigate('/triage/consent');
        return;
      }
    }

    // Si un run existe déjà (retour arrière depuis les questions), on l'utilise
    if (currentRunId) {
      return;
    }

    const triageId = localStorage.getItem(STORAGE_KEYS.TRIAGE_ID);

    if (sessionId && currentModule) {
      const recommendedCode = localStorage.getItem(STORAGE_KEYS.RECOMMENDED_MODULE);
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
          localStorage.setItem(STORAGE_KEYS.CURRENT_RUN_ID, runId);
          localStorage.setItem('last_run_id', runId);
          await updateSessionApi(sessionId, 'in_progress', `INTRO_${currentModule.id}`)
            .catch(err => console.error('Error tracking session intro stage:', err));
        } else {
          console.warn('Diagnostic run ID missing in backend response:', res);
        }
      } catch (err) {
        console.error('Error starting diagnostic run:', err);
        setErrorModal({
          title: 'Erreur d\'initialisation',
          message: 'Impossible de démarrer la session de diagnostic avec le serveur. Veuillez réactualiser et réessayez.'
        });
      }
    }
  };

  const onDiagnosticLoadingComplete = () => {
    navigate('/diagnostic/question');
  };

  const onAnswer = async (answer, proof, confidence, evidenceType, evidenceLabel) => {
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

    if (!currentRunId) {
      console.error('Impossible de poster la réponse : diagnostic_run_id est introuvable.');
      lastSubmittedQuestionIdRef.current = null;
      setErrorModal({
        title: 'Session de diagnostic non initialisée',
        message: 'La session de diagnostic avec le serveur s\'est interrompue. Veuillez cliquer sur Retour et relancer le module.'
      });
      return;
    }

    if (currentRunId) {
      const evidenceLevelMap = {
        'E0': 'E0_declarative',
        'E1': 'E1_concrete_indice',
        'E2': 'E2_document_available',
        'E3': 'E3_verifiable_data'
      };
      const evidence_level = evidenceLevelMap[proof] || null;
      const targetQuestionId = q.db_id || q.id;

      if (targetQuestionId) {
        try {
          const payload = {
            question_id: String(targetQuestionId),
            answer_value: answer
          };
          // if (confidence) payload.response_confidence_user = String(confidence);
          // if (evidence_level) payload.evidence_level = String(evidence_level);
          // if (evidenceType) payload.evidence_type = String(evidenceType);
          // if (evidenceLabel) payload.evidence_label = String(evidenceLabel);

          await apiFetch(`/diagnostics/${currentRunId}/answers`, {
            method: 'POST',
            body: JSON.stringify(payload)
          });
        } catch (err) {
          // 409 = question déjà répondue
          if (err?.status === 409) {
            // Ignorer et continuer
          } else {
            console.error('[Diagnostic] Technical error posting answer to backend:', err, err?.data);
            lastSubmittedQuestionIdRef.current = null; // Débloquer la soumission pour permettre un nouvel essai

            const isNetworkError = err?.isNetworkError || err?.message?.includes('Network Error') || (typeof window !== 'undefined' && window.navigator?.onLine === false);

            if (isNetworkError) {
              setErrorModal({
                title: 'Problème de connexion',
                message: 'Un problème de connexion réseau s\'est produit. Veuillez vérifier votre connexion internet et réessayer l\'envoi.',
                actionLabel: 'Réessayer l\'envoi',
                onAction: () => onAnswer(answer, proof, confidence, evidenceType, evidenceLabel)
              });
            } else {
              setErrorModal({
                title: 'Erreur lors de l\'envoi de la réponse',
                message: 'Une erreur est survenue lors de l\'envoi vers le serveur. Veuillez réessayer.',
                actionLabel: 'Réessayer',
                onAction: () => onAnswer(answer, proof, confidence, evidenceType, evidenceLabel)
              });
            }
            return; // Bloquer le passage à la question suivante
          }
        }
      }
    }

    if (questionIndex + 1 >= questions.length) {
      if (isEnrichmentMode) {
        const runIdToFetch = currentRunId || localStorage.getItem(STORAGE_KEYS.CURRENT_RUN_ID) || localStorage.getItem('last_run_id');
        if (runIdToFetch) {
          try {
            await apiFetch(`/diagnostics/${runIdToFetch}/details`);
          } catch (err) {
            console.error('Error fetching diagnostic details:', err);
          }
        }
        setShowEnrichmentCompletionModal(true);
      } else {
        startBackendCalculation();
        navigate('/diagnostic/calcul');
      }
    } else {
      setQuestionIndex(p => p + 1);
    }
  };

  const onConfirmEnrichmentCompletion = async () => {
    setShowEnrichmentCompletionModal(false);

    const isDeviceVerified = localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED) === 'true';
    const userEmail = pendingProfileData?.email || triageAnswers?.email || localStorage.getItem(STORAGE_KEYS.USER_EMAIL);

    if (!isDeviceVerified) {
      if (userEmail) {
        setPendingProfileData({
          ...(pendingProfileData || {}),
          email: userEmail,
          is_post_enrichment: true
        });
        setEmailVerificationError('');
        setIsEmailLoading(true);
        setIsVerifyingEmail(true);

        try {
          await requestEmailVerificationApi({
            email: userEmail,
            full_name: triageAnswers?.full_name || triageAnswers?.name || '',
            diagnostic_run_id: currentRunId
          });
        } catch (err) {
          console.error('Error requesting OTP verification code after enrichment:', err);
          setEmailVerificationError(err.message || 'Impossible d’envoyer le code de vérification.');
        } finally {
          setIsEmailLoading(false);
        }
      } else {
        // Email non renseigné : afficher la modal de saisie d'e-mail
        setShowPostEnrichmentEmailModal(true);
      }
    } else {
      navigate('/diagnostic/fin');
    }
  };

  const handlePostEnrichmentEmailSubmit = async ({ full_name, email }) => {
    setShowPostEnrichmentEmailModal(false);

    const updatedProfile = {
      ...(pendingProfileData || {}),
      full_name,
      email,
      is_post_enrichment: true
    };
    setPendingProfileData(updatedProfile);

    if (email) {
      localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email);
    }

    setEmailVerificationError('');
    setIsEmailLoading(true);
    setIsVerifyingEmail(true);

    try {
      await requestEmailVerificationApi({
        email,
        full_name,
        diagnostic_run_id: currentRunId
      });
    } catch (err) {
      console.error('Error requesting OTP code for post-enrichment email:', err);
      setEmailVerificationError(err.message || 'Impossible d’envoyer le code de vérification.');
    } finally {
      setIsEmailLoading(false);
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
    const sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
    const screenCode = currentModule ? `QUESTION_${currentModule.id}_${questionIndex + 1}` : `QUESTION_${questionIndex + 1}`;
    if (sessionId) {
      abandonSessionApi(sessionId, screenCode)
        .catch(err => console.error('Error marking session as abandoned:', err));
    }
    onGoHome();
  };

  const calculateLocalScoreFallback = (questionsList, answersObj) => {
    if (!Array.isArray(questionsList) || questionsList.length === 0) return 65;
    let totalMax = 0;
    let totalAchieved = 0;

    questionsList.forEach(q => {
      const ansVal = answersObj[q.id];
      if (!ansVal) return;
      const choices = q.choices || q.options || [];
      if (choices.length > 0) {
        totalMax += (choices.length - 1);
        const selectedIdx = choices.findIndex(c => c.id === ansVal || c.value === ansVal);
        if (selectedIdx > -1) {
          totalAchieved += selectedIdx;
        }
      }
    });

    if (totalMax === 0) return 65;
    const computed = Math.round((totalAchieved / totalMax) * 100);
    return Math.max(15, Math.min(100, computed));
  };

  const calcPromiseRef = useRef(null);

  const startBackendCalculation = () => {
    const fallbackScore = calculateLocalScoreFallback(questions, moduleAnswers);
    if (!currentRunId) {
      setScore(fallbackScore);
      setRestitution(null);
      calcPromiseRef.current = Promise.resolve();
      return calcPromiseRef.current;
    }

    calcPromiseRef.current = apiFetch(`/diagnostics/${currentRunId}/complete`, { method: 'POST' })
      .catch(err => {
        if (err?.status === 400 || (err?.message && err.message.toLowerCase().includes('already completed'))) {
          return true;
        }
        throw err;
      })
      .then(() => apiFetch(`/diagnostics/${currentRunId}/result`))
      .then(res => {
        const backendScore = res?.data?.scoring?.credibilized_score_0_100 ?? res?.data?.scoring?.converted_score_0_100;
        if (typeof backendScore === 'number' && !isNaN(backendScore)) {
          setScore(backendScore);
        } else {
          setScore(fallbackScore);
        }

        const restObj = res?.data?.restitution || res?.restitution;
        if (restObj) {
          const scoringData = res?.data?.scoring || res?.scoring || null;
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
      })
      .catch(err => {
        console.warn('Backend complete/scoring returned error. Falling back to local score calculation:', err);
        setScore(fallbackScore);
        setRestitution(null);
      });

    return calcPromiseRef.current;
  };

  const onCalcDone = async () => {
    if (calcPromiseRef.current) {
      try {
        await calcPromiseRef.current;
      } catch (e) { }
    } else {
      await startBackendCalculation();
    }
    navigate('/diagnostic/resultats');
  };

  const onResultsBack = () => {
    if (questions && questions.length > 0) {
      setQuestionIndex(questions.length - 1);
      navigate('/diagnostic/question');
    } else {
      navigate(-1);
    }
  };

  const onDetail = () => navigate('/diagnostic/fin');
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
      sector: triageAnswers.sector || '',
      department: triageAnswers.region || '',
      commune: triageAnswers.commune || '',
      profile: triageAnswers['TRI-00-Q01'] || triageAnswers.user_profile_type || 'active',
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
    // Mène vers l'écran de consentement enrichissement → puis questions enrichissement → /diagnostic/fin
    navigate('/diagnostic/enrichissement-consent');
  };

  const onStartEnrichmentQuestions = async () => {
    if (!currentModule) return;
    try {
      const qList = await QuestionService.getEnrichmentQuestions(currentModule.id);
      if (qList && qList.length > 0) {
        setQuestions(qList);
        setQuestionIndex(0);
        setIsEnrichmentMode(true);
        navigate('/diagnostic/question');
      } else {
        // Profil déjà collecté en début de parcours — on va directement au rendezvous
        navigate('/diagnostic/fin');
      }
    } catch (err) {
      console.error('Error loading enrichment questions:', err);
      navigate('/diagnostic/fin');
    }
  };

  const onEnrichmentCancel = () => {
    navigate('/diagnostic/resultats');
  };

  const onProfileInitialSubmit = async (profileData) => {
    const updatedTriageAnswers = {
      ...triageAnswers,
      user_profile_type: profileData.user_profile_type || triageAnswers.user_profile_type || null,
      activity_stage: profileData.activity_stage || triageAnswers.activity_stage || null,
      business_name: profileData.business_name || triageAnswers.business_name || null,
      activity_description: profileData.activity_description || triageAnswers.activity_description || null,
      description: profileData.activity_description || triageAnswers.description || null,
      region: profileData.region || triageAnswers.region || 'Atlantique',
      commune: profileData.commune || triageAnswers.commune || null,
      sector: profileData.sector || triageAnswers.sector || null,
      sub_sector: profileData.sub_sector || triageAnswers.sub_sector || null,
      year_created: profileData.year_created || triageAnswers.year_created || null,
      full_name: profileData.full_name || triageAnswers.full_name || null,
      name: profileData.full_name || triageAnswers.name || null,
      phone_number: profileData.phone_number || triageAnswers.phone_number || null,
      phone: profileData.phone_number || triageAnswers.phone || null,
      email: profileData.email || triageAnswers.email || null,
      s00: triageAnswers?.s00 || 'direct'
    };
    setTriageAnswers(updatedTriageAnswers);

    let sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);

    // Cas où l'utilisateur vient de passer le profil après ChoixEntreeScreen (sans Triage)
    if (!currentModule) {
      const choice = updatedTriageAnswers.s00;
      if (choice === 'assisted') {
        await submitTriageToBackend(updatedTriageAnswers);
      } else if (choice === 'institutional') {
        navigate('/a-propos');
      } else if (choice === 'learn' || choice === 'learn_more') {
        onLearnMore();
      } else {
        onGoToCatalog();
      }
      return;
    }

    if (sessionId && currentModule) {
      const recommendedCode = localStorage.getItem(STORAGE_KEYS.RECOMMENDED_MODULE);
      const isRecommended = recommendedCode ? (recommendedCode === currentModule.id) : true;
      const isOverride = !isRecommended;
      try {
        const res = await apiFetch(`/sessions/${sessionId}/diagnostics`, {
          method: 'POST',
          body: JSON.stringify({
            module_code: currentModule.id,
            triage_id: null,
            is_recommended: isRecommended,
            is_override: isOverride
          })
        });
        const runId = res?.data?.diagnostic_run_id || res?.diagnostic_run_id;
        if (runId) {
          setCurrentRunId(runId);
          localStorage.setItem(STORAGE_KEYS.CURRENT_RUN_ID, runId);
          await updateSessionApi(sessionId, 'in_progress', `INTRO_${currentModule.id}`)
            .catch(err => console.error('Error tracking session intro stage:', err));
        }
      } catch (err) {
        console.error('Error starting diagnostic run in initial profile:', err);
      }
    }

    navigate('/diagnostic/question');
  };

  const onProfileInitialBack = () => {
    navigate('/diagnostic/intro');
  };

  const onProfileBack = () => {
    if (questions.length > 0) {
      setQuestionIndex(questions.length - 1);
    }
    navigate('/diagnostic/question');
  };

  const onProfileSubmit = async (profileData) => {
    const sessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
    if (!sessionId) {
      navigate('/diagnostic/fin');
      return;
    }

    const formattedAnswers = {
      ...triageAnswers,
      user_profile_type: profileData.user_profile_type || triageAnswers['TRI-00-Q01'] || triageAnswers.user_profile_type || null,
      activity_stage: profileData.activity_stage || triageAnswers['TRI-00-Q02'] || triageAnswers.activity_stage || null,
      business_name: profileData.business_name || triageAnswers.business_name || null,
      activity_description: profileData.activity_description || triageAnswers.activity_description || null,
      description: profileData.activity_description || profileData.description || triageAnswers.description || null,
      region: profileData.region || triageAnswers.region || 'Atlantique',
      commune: profileData.commune || triageAnswers.commune || null,
      sector: profileData.sector || triageAnswers.sector || 'Services',
      sub_sector: profileData.sub_sector || triageAnswers.sub_sector || null,
      year_created: profileData.year_created || triageAnswers.year_created || null,
      full_name: profileData.full_name || triageAnswers.full_name || triageAnswers.name || null,
      name: profileData.full_name || triageAnswers.full_name || triageAnswers.name || null,
      phone_number: profileData.phone_number || triageAnswers.phone_number || triageAnswers.phone || null,
      phone: profileData.phone_number || triageAnswers.phone_number || triageAnswers.phone || null,
      whatsapp_number: profileData.whatsapp_number || triageAnswers.whatsapp_number || '',
      email: profileData.email || triageAnswers.email || null,
      ca_n_1: profileData.ca_n_1 || triageAnswers.ca_n_1 || null,
      ca_m_1: profileData.ca_m_1 || triageAnswers.ca_m_1 || null,
      employee_count_range: profileData.employee_count_range || triageAnswers.employee_count_range || null,
      s00: triageAnswers?.s00 || 'direct'
    };

    setTriageAnswers(formattedAnswers);

    try {
      if (currentModule) {
        submitTriageToBackendApi(sessionId, formattedAnswers).catch(err => console.error('Error submitting triage profile for direct module:', err));
        localStorage.setItem('bc_user_profile', JSON.stringify(formattedAnswers));
        onIntroStart();
      } else {
        await submitTriageToBackend(formattedAnswers);
      }

      if (formattedAnswers) {
        localStorage.setItem('last_user_name', formattedAnswers.name || '');
        localStorage.setItem('last_user_email', formattedAnswers.email || '');
        localStorage.setItem('last_user_phone', formattedAnswers.phone || '');
        localStorage.setItem('last_user_whatsapp', '');
      }
    } catch (err) {
      console.error('Error submitting profile triage:', err);
      throw err;
    }
  };

  const onProfileSkip = () => {
    navigate('/diagnostic/calcul');
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
    isRetrying,
    retryConnection,
    references,
    triageQuestions,
    onTriageDynamicAnswer,
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
    onTriageProfileSubmit,
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
    onProfileBack,
    onProfileInitialSubmit,
    onProfileInitialBack,

    // Email Verification State & Actions
    isVerifyingEmail, setIsVerifyingEmail,
    pendingProfileData, setPendingProfileData,
    emailVerificationError, setEmailVerificationError,
    isEmailLoading,
    handleInitiateEmailVerification,
    handleConfirmEmailCode,

    // Enrichment Completion Modal
    showEnrichmentCompletionModal,
    setShowEnrichmentCompletionModal,
    onConfirmEnrichmentCompletion,
    showPostEnrichmentEmailModal,
    setShowPostEnrichmentEmailModal,
    handlePostEnrichmentEmailSubmit,

    // Triage Completion Modal
    showTriageCompletionModal,
    setShowTriageCompletionModal,
    onConfirmTriageCompletion
  };
}
