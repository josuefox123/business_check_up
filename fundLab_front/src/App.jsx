import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import DiagnosticApp from './DiagnosticApp.jsx';
import { AdminApp } from './components/admin/AdminApp.jsx';
import { TestCurrencyScreen } from './components/ecrans/TestCurrencyScreen.jsx';
import { CountdownScreen } from './components/ecrans/CountdownScreen.jsx';
import { ReferencesProvider } from './contexts/ReferencesContext.jsx';

// Utility component to force scroll restoration to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  // Date cible de déblocage : 27 Juillet 2026 à 08:00:00 (Fuseau +01:00)
  const targetDate = new Date("2026-07-27T08:00:00+01:00").getTime();
  const now = new Date().getTime();
  const isBeforeLaunch = now < targetDate;

  // Détection souple du domaine (includes pour couvrir les sous-domaines/ports)
  const hostname = typeof window !== 'undefined' ? window.location.hostname.toLowerCase() : '';
  const isTargetDomain = hostname.includes('checkup.business-assist.io');

  // Activer le mode décompte SEULEMENT si on est sur le domaine cible ET avant la date de lancement
  const showCountdownOnly = isTargetDomain && isBeforeLaunch;

  return (
    <BrowserRouter>
      <ReferencesProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/test-currency" element={<TestCurrencyScreen />} />
          {/* L'accès /admin reste accessible pour les administrateurs même avant le lancement */}
          <Route path="/admin/*" element={<AdminApp />} />
          <Route 
            path="/*" 
            element={showCountdownOnly ? <CountdownScreen /> : <DiagnosticApp />} 
          />
        </Routes>
      </ReferencesProvider>
    </BrowserRouter>
  );
}

export default App;

