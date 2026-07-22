import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import './components/ecrans/partage/screens.css';
import './components/ecrans/partage/QuestionScreen.css';
import './components/ecrans/partage/ContactForm.css';
import './components/ecrans/partage/Report.css';
import { LandingPage } from './components/ecrans/pages-fixes/LandingPage.jsx';
import { CommentCaMarche } from './components/ecrans/pages-fixes/CommentCaMarche.jsx';
import { Navbar } from './components/layout/Navbar.jsx';
import { PublicContactScreen } from './components/ecrans/pages-fixes/PublicContact.jsx';
import { AlertTriangle } from 'lucide-react';
import { useDiagnosticFlow } from './hooks/useDiagnosticFlow.js';

import {
  ConsentScreen,
  S03Screen, S04Screen, S05Screen,
  TriageScreen,
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
} from './components/ecrans/partage/DiagnosticScreens.jsx';

import { S06_CHOICES, S07_CHOICES, S08_CHOICES, S09_CHOICES } from './constants/triageChoices.js';

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
      <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1E293B', marginBottom: '10px' }}>{title}</h2>
      <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6, marginBottom: '28px' }}>{message}</p>
      <button
        onClick={onClose}
        style={{
          width: '100%', padding: '13px 20px', borderRadius: '12px',
          fontWeight: 750, fontSize: '0.95rem', border: 'none',
          background: '#17212D', color: '#ffffff', cursor: 'pointer',
          fontFamily: 'inherit', transition: 'background 0.2s',
        }}
      >
        Fermer
      </button>
    </div>
  </div>
);

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
      <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#17212D', marginBottom: '10px', fontFamily: 'var(--font)' }}>Reprendre le diagnostic ?</h2>
      <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6, marginBottom: '28px', fontFamily: 'var(--font)' }}>
        Nous avons détecté un diagnostic en cours. Souhaitez-vous le reprendre là où vous vous étiez arrêté ?
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1, padding: '13px 16px', borderRadius: '12px',
            fontWeight: 600, fontSize: '0.9rem', border: '1.5px solid var(--slate-200)',
            background: '#fff', color: '#475569', cursor: 'pointer',
            fontFamily: 'var(--font)', transition: 'all 0.15s',
          }}
        >
          Recommencer
        </button>
        <button
          onClick={onConfirm}
          style={{
            flex: 1, padding: '13px 16px', borderRadius: '12px',
            fontWeight: 750, fontSize: '0.9rem', border: 'none',
            background: 'var(--color-blue, #2659F2)', color: '#fff', cursor: 'pointer',
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

function DiagnosticApp() {
  const navigate = useNavigate();
  const location = useLocation();

  const flow = useDiagnosticFlow();

  const showNavbar = location.pathname !== '/diagnostic/fin';

  const isDiagnosticPath = 
    location.pathname.startsWith('/triage/') ||
    location.pathname.startsWith('/diagnostic/') ||
    location.pathname === '/catalog';

  if (flow.isOffline && isDiagnosticPath) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', padding: '24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '480px', background: '#FFFFFF', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚠️</div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#17212D', marginBottom: '16px' }}>Service temporairement indisponible</h1>
          <p style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: '1.6', marginBottom: '24px' }}>
            L'accès aux diagnostics et au triage nécessite une connexion active avec le serveur de l'application. Veuillez réessayer plus tard.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            style={{ background: '#17212D', color: '#FFFFFF', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {showNavbar && <Navbar onGoHome={flow.onGoHome} />}
      {flow.showResumeModal && (
        <ResumeDiagnosticModal
          onConfirm={() => {
            flow.setShowResumeModal(false);
            flow.restoreState(flow.pendingResumeState);
            flow.setIsRestored(true);
          }}
          onCancel={() => {
            flow.setShowResumeModal(false);
            localStorage.clear();
            flow.setIsRestored(true);
          }}
        />
      )}
      {flow.errorModal && (
        <ErrorModal
          title={flow.errorModal.title}
          message={flow.errorModal.message}
          onClose={() => flow.setErrorModal(null)}
        />
      )}

      <Routes>
        <Route path="/" element={
          <LandingPage onStart={flow.onStartAssisted} onLearnMore={flow.onLearnMore} onGoToCatalog={flow.onGoToCatalog} />
        } />
        <Route path="/comment-ca-marche" element={
          <CommentCaMarche onStart={flow.onStartAssisted} />
        } />
        <Route path="/catalog" element={
          <CatalogScreen
            onSelect={flow.onSelectModule}
            onBack={flow.onGoHome}
            warningSignals={flow.triageAnswers.s07}
          />
        } />
        <Route path="/a-propos" element={
          <InstitutionnelleScreen onBack={flow.onGoHome} onContact={() => navigate('/contact')} />
        } />
        <Route path="/contact" element={
          <PublicContactScreen onBack={flow.onGoHome} />
        } />

        {/* Wizard Triage */}
        <Route path="/triage/consent" element={
          <ConsentScreen
            initialAnswers={flow.consentAnswers}
            onChangeConsent={flow.setConsentAnswers}
            onContinue={flow.onConsent}
            onBack={flow.onGoHome}
          />
        } />
        <Route path="/triage/wizard" element={
          <>
            {flow.triageStep === 3 && <S03Screen onContinue={flow.onS03} onBack={() => navigate('/triage/consent')} initialAnswer={flow.triageAnswers.s03 ?? null} />}
            {flow.triageStep === 4 && <S04Screen onContinue={flow.onS04} onBack={() => flow.setTriageStep(3)} initialAnswer={flow.triageAnswers.s04 ?? null} />}
            {flow.triageStep === 5 && <S05Screen onContinue={flow.onS05} onBack={() => flow.setTriageStep(4)} initialAnswer={flow.triageAnswers.s05 ?? null} />}
            {flow.triageStep === 6 && (
              <TriageScreen
                step="S06"
                question="Aujourd'hui, votre principale préoccupation est :"
                choices={S06_CHOICES}
                onContinue={flow.onS06}
                onBack={() => flow.setTriageStep(5)}
                initialAnswer={flow.triageAnswers.s06 ?? null}
              />
            )}
            {flow.triageStep === 7 && (
              <TriageScreen
                step="S07"
                question="Votre entreprise connaît-elle actuellement l'une de ces situations ?"
                hint="Sélectionnez toutes les options qui s'appliquent"
                multi
                choices={S07_CHOICES}
                onContinue={flow.onS07}
                onBack={() => flow.setTriageStep(6)}
                initialAnswer={flow.triageAnswers.s07 ?? null}
              />
            )}
            {flow.triageStep === 8 && (
              <TriageScreen
                step="S08"
                question="Cherchez-vous à saisir une opportunité précise ?"
                choices={S08_CHOICES}
                onContinue={flow.onS08}
                onBack={() => flow.setTriageStep(7)}
                initialAnswer={flow.triageAnswers.s08 ?? null}
              />
            )}
            {flow.triageStep === 9 && (
              <TriageScreen
                step="S09"
                question="Quel sujet souhaitez-vous analyser en priorité ?"
                choices={S09_CHOICES}
                onContinue={flow.onS09}
                onBack={() => flow.setTriageStep(8)}
                initialAnswer={flow.triageAnswers.s09 ?? null}
              />
            )}
          </>
        } />

        {/* Evaluation Tunnel */}
        <Route path="/diagnostic/route" element={
          <RouteScreen
            routeKey={flow.routeKey}
            recommendedModule={flow.currentModule}
            onStart={flow.onRouteStart}
            onCatalog={flow.onGoToCatalog}
            onBack={flow.onRouteBack}
          />
        } />
        <Route path="/diagnostic/verif" element={
          flow.chosenForVerif && (
            <VerifModuleScreen
              chosenModule={flow.chosenForVerif}
              warningMessage={flow.triageAnswers.s07?.includes('charges') ? 'Tensions financières détectées' : 'Attention particulière recommandée'}
              onConfirm={flow.onVerifConfirm}
              onAcceptReco={flow.onVerifReco}
              recoModule={{ id: 'DIF-03', name: 'Diagnostic Difficulté' }}
              onBack={() => navigate(-1)}
            />
          )
        } />
        <Route path="/diagnostic/intro" element={
          flow.currentModule && (
            <IntroModuleScreen
              moduleId={flow.currentModule.id}
              moduleData={flow.currentModule}
              onStart={flow.onIntroStart}
              onCatalog={flow.onGoToCatalog}
              onBack={() => navigate(-1)}
            />
          )
        } />
        <Route path="/diagnostic/question" element={
          flow.currentModule && flow.questions.length > 0 && (
            <QuestionScreen
              key={flow.questionIndex}
              moduleId={flow.currentModule.id}
              questionData={flow.questions[flow.questionIndex]}
              current={flow.questionIndex + 1}
              total={flow.questions.length}
              savedAnswer={flow.moduleAnswers[flow.questions[flow.questionIndex]?.id] ?? null}
              onContinue={flow.onAnswer}
              onBack={flow.onQuestionBack}
              onQuit={flow.onQuit}
            />
          )
        } />
        <Route path="/diagnostic/calcul" element={
          <CalculScreen onDone={flow.onCalcDone} />
        } />
        <Route path="/diagnostic/resultats" element={
          <ResultatSyntheseScreen
            score={flow.score}
            answers={flow.moduleAnswers}
            moduleId={flow.currentModule?.id || ''}
            onDetail={flow.onDetail}
            onContact={flow.onContact}
            onRestart={flow.onGoHome}
            onBack={flow.onResultsBack}
            restitution={flow.restitution}
            isOffline={flow.isOffline}
          />
        } />
        <Route path="/diagnostic/forces-fragilites" element={
          <ForceFragilitesScreen
            score={flow.score}
            moduleId={flow.currentModule?.id}
            answers={flow.moduleAnswers}
            onContinue={flow.onFFNext}
            restitution={flow.restitution}
            onBack={() => navigate('/diagnostic/resultats')}
          />
        } />
        <Route path="/diagnostic/priorites" element={
          <PrioritesActionScreen
            score={flow.score}
            onContinue={flow.onPrioNext}
            restitution={flow.restitution}
            onBack={() => navigate('/diagnostic/forces-fragilites')}
          />
        } />
        <Route path="/diagnostic/orientation" element={
          <OrientationSuivanteScreen
            score={flow.score}
            onDownload={flow.onDownload}
            onRestart={flow.onGoHome}
            onContact={flow.onContact}
            onCatalog={flow.onGoToCatalog}
            restitution={flow.restitution}
            onBack={() => navigate('/diagnostic/priorites')}
          />
        } />
        <Route path="/diagnostic/contact" element={
          <ContactSuiviScreen onSubmit={flow.onContactSubmit} onSkip={flow.onContactSkip} />
        } />
        <Route path="/diagnostic/fin" element={
          <FinParcoursScreen onRestart={flow.onRestartFin} onShare={flow.onShare} />
        } />
      </Routes>
    </>
  );
}

export default DiagnosticApp;
