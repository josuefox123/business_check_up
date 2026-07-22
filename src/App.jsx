import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import DiagnosticApp from './DiagnosticApp.jsx';
import { AdminApp } from './components/admin/AdminApp.jsx';
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
  return (
    <BrowserRouter>
      <ReferencesProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/*" element={<DiagnosticApp />} />
        </Routes>
      </ReferencesProvider>
    </BrowserRouter>
  );
}

export default App;
