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
import { clearDiagnosticStorage } from './constants/storageKeys.js';

import {
  ConsentScreen,
  TriageStartLoadingScreen,
  DiagnosticStartLoadingScreen,
  ChoixEntreeScreen,
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
  UserProfileFormScreen,
  EnrichmentConsentScreen
} from './components/ecrans/partage/DiagnosticScreens.jsx';
import { EmailVerificationModal } from './components/ecrans/triage/EmailVerificationModal.jsx';
import { PostEnrichmentEmailModal } from './components/ecrans/triage/PostEnrichmentEmailModal.jsx';
import { EnrichmentCompletionModal } from './components/ecrans/questionnaire/EnrichmentCompletionModal.jsx';
import { TriageCompletionModal } from './components/ecrans/triage/TriageCompletionModal.jsx';
import { DiagnosticHistoryScreen } from './components/ecrans/restitution/DiagnosticHistoryScreen.jsx';
import { PdfTestScreen } from './mail/pages/PdfTestScreen.jsx';



const ErrorModal = ({ title, message, onClose, actionLabel, onAction }) => (
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
        background: 'rgba(239, 68, 68, 0.08)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px',
      }}>
        <AlertTriangle size={26} strokeWidth={2} style={{ color: '#ef4444' }} />
      </div>
      <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1E293B', marginBottom: '10px' }}>{title}</h2>
      <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6, marginBottom: '24px' }}>{message}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {actionLabel && onAction && (
          <button
            onClick={() => {
              onClose();
              onAction();
            }}
            style={{
              width: '100%', padding: '13px 20px', borderRadius: '12px',
              fontWeight: 750, fontSize: '0.95rem', border: 'none',
              background: '#1A9DB8', color: '#ffffff', cursor: 'pointer',
              fontFamily: 'inherit', transition: 'background 0.2s',
            }}
          >
            {actionLabel}
          </button>
        )}
        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '13px 20px', borderRadius: '12px',
            fontWeight: 750, fontSize: '0.95rem',
            border: actionLabel ? '1px solid #E2E8F0' : 'none',
            background: actionLabel ? '#FFFFFF' : '#17212D',
            color: actionLabel ? '#475569' : '#ffffff', cursor: 'pointer',
            fontFamily: 'inherit', transition: 'background 0.2s',
          }}
        >
          {actionLabel ? 'Fermer' : 'Fermer'}
        </button>
      </div>
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
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M16 3h5v5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M8 21H3v-5" />
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

  const getTriageQuestion = (role) => {
    if (role === 'main_offer_type') {
      const q = flow.triageQuestions?.find(item =>
        item.axe === 'main_offer_type' ||
        item.axe === 'offer_type' ||
        item.id === 'TRI-00-Q07' ||
        item.question?.toLowerCase().includes('phare')
      );
      if (q) return q;
      return {
        question: "Quel est le produit ou le service phare de votre entreprise ?",
        hint: "Cette question permet de qualifier la nature principale de votre activité commerciale.",
        choices: [
          { id: 'main_product', label: "Un produit physique" },
          { id: 'digital_product', label: "Un produit numérique ou logiciel" },
          { id: 'professional_service', label: "Une prestation de service" },
          { id: 'consulting_service', label: "Du conseil ou de l’accompagnement" },
          { id: 'subscription_service', label: "Un abonnement ou service récurrent" },
          { id: 'multiple_offers', label: "Plusieurs produits ou services sans offre dominante" },
          { id: 'not_defined', label: "L’activité n’est pas encore définie" },
          { id: 'other', label: "Autre" }
        ]
      };
    }
    return flow.triageQuestions?.find(q => q.axe === role) || null;
  };
  const totalTriageSteps = 7;

  const showNavbar = location.pathname !== '/diagnostic/fin';

  const isDiagnosticPath =
    location.pathname.startsWith('/triage/') ||
    location.pathname.startsWith('/diagnostic/') ||
    location.pathname === '/catalog';

  if (flow.isOffline && isDiagnosticPath) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', padding: '24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '480px', width: '100%', background: '#FFFFFF', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⚠️</div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#17212D', marginBottom: '16px' }}>Service temporairement indisponible</h1>
          <p style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: '1.6', marginBottom: '24px' }}>
            L'accès aux diagnostics nécessite une connexion au serveur. Veuillez vérifier votre réseau ou réessayer la connexion.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={flow.retryConnection}
              disabled={flow.isRetrying}
              style={{
                background: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: flow.isRetrying ? 'not-allowed' : 'pointer',
                opacity: flow.isRetrying ? 0.7 : 1,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {flow.isRetrying ? 'Connexion en cours...' : '🔄 Réessayer'}
            </button>
            <button
              onClick={() => window.location.href = '/'}
              style={{
                background: '#F1F5F9',
                color: '#475569',
                border: '1px solid #CBD5E1',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Retour à l'accueil
            </button>
          </div>
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
            clearDiagnosticStorage();
            flow.setIsRestored(true);
          }}
        />
      )}
      {flow.errorModal && (
        <ErrorModal
          title={flow.errorModal.title}
          message={flow.errorModal.message}
          actionLabel={flow.errorModal.actionLabel}
          onAction={() => {
            if (flow.errorModal.onAction) flow.errorModal.onAction();
            flow.setErrorModal(null);
          }}
          onClose={() => flow.setErrorModal(null)}
        />
      )}
      {flow.showEnrichmentCompletionModal && (
        <EnrichmentCompletionModal
          onConfirm={flow.onConfirmEnrichmentCompletion}
        />
      )}
      {flow.showPostEnrichmentEmailModal && (
        <PostEnrichmentEmailModal
          onSubmit={flow.handlePostEnrichmentEmailSubmit}
          onCancel={() => flow.setShowPostEnrichmentEmailModal(false)}
          isLoading={flow.isEmailLoading}
        />
      )}
      {flow.showTriageCompletionModal && (
        <TriageCompletionModal
          onConfirm={flow.onConfirmTriageCompletion}
        />
      )}
      {flow.isVerifyingEmail && location.pathname !== '/triage/wizard' && location.pathname !== '/diagnostic/profil-initial' && (
        <EmailVerificationModal
          email={flow.pendingProfileData?.email || flow.triageAnswers?.email || ''}
          onVerify={flow.handleConfirmEmailCode}
          onResendCode={() => flow.handleInitiateEmailVerification(flow.pendingProfileData)}
          onEditEmail={() => {
            flow.setIsVerifyingEmail(false);
            if (flow.pendingProfileData?.is_post_enrichment) {
              flow.setShowPostEnrichmentEmailModal(true);
            }
          }}
          isLoading={flow.isEmailLoading}
          errorMsg={flow.emailVerificationError}
        />
      )}

      <Routes>
        <Route path="/diagnostic/historique" element={
          <DiagnosticHistoryScreen
            userEmail={flow.pendingProfileData?.email}
            onBack={flow.onGoHome}
          />
        } />
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
            {(flow.triageStep === 1 || flow.triageStep === 2 || !flow.triageStep) && (
              <TriageStartLoadingScreen
                onComplete={() => {
                  const isAuthenticated = localStorage.getItem('bc_is_authenticated') === 'true';
                  if (isAuthenticated) {
                    flow.setTriageStep(5);
                  } else {
                    const hasEntry = flow.triageQuestions?.some(q => q.axe === 'entry_choice' || q.id === 'TRI-00-Q00');
                    flow.setTriageStep(hasEntry ? 3 : 4);
                  }
                }}
              />
            )}
            {flow.triageStep === 3 && (
              <ChoixEntreeScreen
                question={getTriageQuestion('entry_choice')}
                onSelect={flow.onS00}
                onBack={() => navigate('/triage/consent')}
                initialAnswer={flow.triageAnswers.s00 ?? null}
              />
            )}
            {flow.triageStep === 4 && (
              flow.isVerifyingEmail ? (
                <EmailVerificationModal
                  email={flow.pendingProfileData?.email}
                  onVerify={flow.handleConfirmEmailCode}
                  onResendCode={() => flow.handleInitiateEmailVerification(flow.pendingProfileData)}
                  onEditEmail={() => flow.setIsVerifyingEmail(false)}
                  isLoading={flow.isEmailLoading}
                  errorMsg={flow.emailVerificationError}
                />
              ) : (
                <UserProfileFormScreen
                  mode="initial"
                  onSubmit={flow.handleInitiateEmailVerification}
                  onExistingDiagnostic={(email) => flow.handleInitiateEmailVerification({ email, is_existing_lookup: true })}
                  onBack={() => {
                    const hasEntry = flow.triageQuestions?.some(q => q.axe === 'entry_choice' || q.id === 'TRI-00-Q00');
                    if (hasEntry) {
                      flow.setTriageStep(3);
                    } else {
                      navigate('/triage/consent');
                    }
                  }}
                  triageAnswers={flow.triageAnswers}
                />
              )
            )}
            {flow.triageStep >= 5 && (() => {
              const triageList = flow.triageQuestions || [];
              const triageIndex = flow.triageStep - 5;
              if (triageList.length > 0 && triageIndex < triageList.length) {
                const currentQ = triageList[triageIndex];
                const isMulti = currentQ?.type === 'multi' || currentQ?.answer_type === 'multi_choice';
                return (
                  <TriageScreen
                    key={currentQ.id || `tri_${triageIndex}`}
                    step={`TRI_${triageIndex + 1}`}
                    question={currentQ}
                    progress={{ current: triageIndex + 1, total: triageList.length }}
                    multi={isMulti}
                    onContinue={(ans) => flow.onTriageDynamicAnswer(currentQ.id, ans, triageIndex)}
                    onBack={() => flow.setTriageStep(flow.triageStep - 1)}
                    initialAnswer={flow.triageAnswers[currentQ.id] ?? null}
                  />
                );
              }
              return null;
            })()}
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
        <Route path="/diagnostic/loading" element={
          <DiagnosticStartLoadingScreen
            moduleName={flow.currentModule?.name || 'Diagnostic'}
            onComplete={() => navigate('/diagnostic/question')}
          />
        } />
        <Route path="/diagnostic/question" element={
          flow.currentModule && flow.questions.length > 0 && (
            <QuestionScreen
              key={`${flow.questions[flow.questionIndex]?.id || 'q'}_${flow.questionIndex}`}
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
            onCatalog={flow.onGoToCatalog}
            onEnrichment={flow.onEnrichment}
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
        <Route path="/diagnostic/enrichissement-consent" element={
          <EnrichmentConsentScreen onConfirm={flow.onStartEnrichmentQuestions} onCancel={flow.onEnrichmentCancel} />
        } />
        <Route path="/diagnostic/profil-initial" element={
          flow.isVerifyingEmail ? (
            <EmailVerificationModal
              email={flow.pendingProfileData?.email || ''}
              onVerify={flow.handleConfirmEmailCode}
              onResend={() => flow.handleInitiateEmailVerification(flow.pendingProfileData)}
              onCancel={() => flow.setIsVerifyingEmail(false)}
              isLoading={flow.isEmailLoading}
              errorMsg={flow.emailVerificationError}
            />
          ) : (
            <UserProfileFormScreen
              mode="initial"
              onSubmit={flow.handleInitiateEmailVerification}
              onBack={() => navigate('/diagnostic/intro')}
              triageAnswers={flow.triageAnswers}
            />
          )
        } />
        <Route path="/diagnostic/profil" element={
          <UserProfileFormScreen
            mode="final"
            onSubmit={flow.onProfileSubmit}
            onSkip={flow.onProfileSkip}
            onBack={flow.onProfileBack}
            triageAnswers={flow.triageAnswers}
          />
        } />
        <Route path="/diagnostic/fin" element={
          <FinParcoursScreen onRestart={flow.onRestartFin} onShare={flow.onShare} />
        } />
        <Route path="/diagnostic/test-pdf" element={
          <PdfTestScreen />
        } />
      </Routes>
    </>
  );
}

export default DiagnosticApp;
