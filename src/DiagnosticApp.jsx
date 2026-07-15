import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import { LandingPage } from './components/screens/LandingPage.jsx';
import { CommentCaMarche } from './components/screens/CommentCaMarche.jsx';
import { Navbar } from './components/layout/Navbar.jsx';
import { PublicContactScreen } from './components/screens/PublicContact.jsx';
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
} from './api/index.js';

// Import domain services for "Backend Ready" architecture
import { QuestionService } from './services/QuestionService.js';
import { DiagnosticService } from './services/DiagnosticService.js';
import { UtilisateurService } from './services/UtilisateurService.js';


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

  // Wizard & Triage Step State (for triage flow S03-S09)
  const [triageStep, setTriageStep] = useState(3);

  // States
  const [triageAnswers, setTriageAnswers] = useState({});
  const [currentModule, setCurrentModule] = useState(null); // { id, name, duration }
  const [routeKey, setRouteKey] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [moduleAnswers, setModuleAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [chosenForVerif, setChosenForVerif] = useState(null);
  const [questions, setQuestions] = useState([]);

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

  // Navigation callbacks
  const onStartAssisted = () => {
    setTriageStep(3);
    setTriageAnswers({});
    navigate('/triage/consent');
  };
  const onGoToCatalog   = () => navigate('/catalog');
  const onLearnMore     = () => navigate('/a-propos');
  const onGoHome        = () => {
    setTriageAnswers({});
    setCurrentModule(null);
    setModuleAnswers({});
    setQuestionIndex(0);
    navigate('/');
  };

  // S01 Consent
  const onConsent = () => {
    setTriageStep(3);
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

  const onS08 = (val) => {
    setTA('s08', val);
    const answersWithS08 = { ...triageAnswers, s08: val };
    if (val === 'no' || val === 'idk') {
      setTriageStep(9);
    } else {
      const route = getRouteFromAnswers(answersWithS08);
      applyRoute(route);
    }
  };

  const onS09 = (val) => {
    setTA('s09', val);
    const answersWithS09 = { ...triageAnswers, s09: val };
    const route = getRouteFromAnswers(answersWithS09);
    applyRoute(route);
  };

  const applyRoute = (route) => {
    if (typeof route === 'object') {
      setRouteKey('S13');
      const mod = MODULE_BY_ROUTE['S13'];
      setCurrentModule({ ...mod, id: route.moduleId || mod.id });
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
    setTriageStep(3);
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
  const onIntroStart = () => {
    setQuestionIndex(0);
    setModuleAnswers({});
    navigate('/diagnostic/question');
  };

  const onAnswer = (answer, proof) => {
    const q = questions[questionIndex];
    setModuleAnswers(p => ({ ...p, [q.id]: answer, ...(proof ? { [`${q.id}_proof`]: proof } : {}) }));
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
    if (window.confirm('Quitter le diagnostic ? Votre progression sera perdue.')) {
      onGoHome();
    }
  };

  // S40 Calcul
  const onCalcDone = () => {
    const s = currentModule ? calculateGlobalScore(currentModule.id, moduleAnswers) : 50;
    setScore(s);
    navigate('/diagnostic/resultats');
  };

  // Results transitions
  const onDetail = () => navigate('/diagnostic/forces-fragilites');
  const onFFNext = () => navigate('/diagnostic/priorites');
  const onPrioNext = () => navigate('/diagnostic/orientation');
  const onContact = () => navigate('/diagnostic/contact');
  const onDownload = () => {
    alert('Téléchargement du rapport PDF en cours de génération...');
    navigate('/diagnostic/contact');
  };

  const onContactSubmit = (data, mode) => {
    console.log('Formulaire contact soumis:', data, mode);
    
    // Register prospect user in store
    const userData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      companyName: data.companyName || '',
      sector: data.sector || '',
      department: data.department || '',
      commune: data.commune || '',
      profile: triageAnswers.s03 || 'active',
      contactRequested: mode === 'suivi',
      pdfDownloaded: mode === 'pdf'
    };

    UtilisateurService.registerUser(userData).then(user => {
      // Save diagnostic report in store
      if (currentModule) {
        DiagnosticService.submitDiagnostic(currentModule.id, moduleAnswers, user);
      }
      navigate('/diagnostic/fin');
    });
  };

  const onContactSkip = () => {
    // Save anonymous diagnostic report in store
    if (currentModule) {
      DiagnosticService.submitDiagnostic(currentModule.id, moduleAnswers, null);
    }
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
          <ConsentScreen onContinue={onConsent} onBack={onGoHome} />
        } />
        <Route path="/triage/wizard" element={
          <>
            {triageStep === 3 && <S03Screen onContinue={onS03} onBack={() => navigate('/triage/consent')} />}
            {triageStep === 4 && <S04Screen onContinue={onS04} onBack={() => setTriageStep(3)} />}
            {triageStep === 5 && <S05Screen onContinue={onS05} onBack={() => setTriageStep(4)} />}
            {triageStep === 6 && <S06Screen onContinue={onS06} onBack={() => setTriageStep(5)} />}
            {triageStep === 7 && <S07Screen onContinue={onS07} onBack={() => setTriageStep(6)} />}
            {triageStep === 8 && <S08Screen onContinue={onS08} onBack={() => setTriageStep(7)} />}
            {triageStep === 9 && <S09Screen onContinue={onS09} onBack={() => setTriageStep(8)} />}
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
            />
          )
        } />
        <Route path="/diagnostic/intro" element={
          currentModule && <IntroModuleScreen moduleId={currentModule.id} onStart={onIntroStart} onCatalog={onGoToCatalog} />
        } />
        <Route path="/diagnostic/question" element={
          currentModule && questions.length > 0 && (
            <QuestionScreen
              key={questionIndex}
              moduleId={currentModule.id}
              questionData={questions[questionIndex]}
              current={questionIndex + 1}
              total={questions.length}
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
          />
        } />
        <Route path="/diagnostic/forces-fragilites" element={
          <ForceFragilitesScreen score={score} moduleId={currentModule?.id} answers={moduleAnswers} onContinue={onFFNext} />
        } />
        <Route path="/diagnostic/priorites" element={
          <PrioritesActionScreen score={score} onContinue={onPrioNext} />
        } />
        <Route path="/diagnostic/orientation" element={
          <OrientationSuivanteScreen
            score={score}
            onDownload={onDownload}
            onRestart={onGoHome}
            onContact={onContact}
            onCatalog={onGoToCatalog}
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
