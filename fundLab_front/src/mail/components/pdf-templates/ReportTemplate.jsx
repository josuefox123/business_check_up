import React from 'react';
import { ReportPage1 } from './ReportPage1.jsx';
import { ReportPage2 } from './ReportPage2.jsx';
import { ReportPage3 } from './ReportPage3.jsx';
import './tailwind-output.css';
import './ReportTemplate.css';

/**
 * ReportTemplate - Composant parent qui regroupe les 3 pages du rapport.
 * Ce composant est destiné à être rendu pour la génération du PDF.
 */
export const ReportTemplate = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} className="pdf-template-wrapper antialiased text-gray-800">
      <ReportPage1 />
      {/* html2pdf utilise ces sauts de page pour séparer le PDF */}
      <div className="html2pdf__page-break"></div>
      <ReportPage2 />
      <div className="html2pdf__page-break"></div>
      <ReportPage3 />
    </div>
  );
});
