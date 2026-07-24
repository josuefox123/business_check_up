import React, { useEffect } from 'react';
import { ReportTemplate } from '../components/pdf-templates/ReportTemplate.jsx';

/**
 * PdfPrintScreen — Page dédiée à l'impression/export PDF.
 * Cette page rend UNIQUEMENT le ReportTemplate, sans navbar ni chrome.
 * Elle déclenche automatiquement window.print() au chargement.
 */
export const PdfPrintScreen = () => {
  useEffect(() => {
    // Laisser le temps aux polices et SVG de se charger avant d'imprimer
    const timer = setTimeout(() => {
      window.print();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pdf-print-page">
      <ReportTemplate />
    </div>
  );
};
