import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DiagnosticApp from './DiagnosticApp.jsx';
import { AdminApp } from './components/admin/AdminApp.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<DiagnosticApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
