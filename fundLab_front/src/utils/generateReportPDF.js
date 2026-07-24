/**
 * generateReportPDF — Génère un PDF 3 pages directement téléchargeable.
 *
 * Stratégie page-par-page :
 * 1. Monter le ReportTemplate dans un div hors-écran mais VISIBLE (position absolute)
 * 2. Capturer chaque .a4-page individuellement avec html2canvas
 * 3. Assembler les 3 images dans un jsPDF en 3 pages A4
 * 4. Déclencher le téléchargement direct — aucune boîte de dialogue
 */

import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
import { ReportTemplate } from '../mail/components/pdf-templates/ReportTemplate.jsx';

// Dimensions A4 en mm
const A4_W_MM = 210;
const A4_H_MM = 297;

// Largeur A4 en px à 96 DPI (rendu navigateur)
const A4_W_PX = 794;
const A4_H_PX = 1123;

/**
 * Génère et télécharge le rapport PDF sans boîte de dialogue.
 * @returns {Promise<void>}
 */
export async function generateReportPDF() {
  const [{ jsPDF }, html2canvas] = await Promise.all([
    import('jspdf'),
    import('html2canvas').then(m => m.default),
  ]);

  // ── 1. Créer le conteneur hors-écran visible ────────────────────
  const container = document.createElement('div');
  Object.assign(container.style, {
    position:   'absolute',
    top:        '0',
    left:       '-9999px',
    width:      `${A4_W_PX}px`,
    background: '#ffffff',
    zIndex:     '0',
  });
  document.body.appendChild(container);

  // ── 2. Monter le composant React ────────────────────────────────
  const root = createRoot(container);
  await new Promise(resolve => {
    root.render(createElement(ReportTemplate, null));
    // 1.5 s pour laisser le temps aux polices Google, aux SVG, et aux
    // règles CSS scoped (@import) de se charger complètement.
    setTimeout(resolve, 1500);
  });

  // ── 3. Trouver les 3 pages A4 ───────────────────────────────────
  const pages = Array.from(container.querySelectorAll('.a4-page'));

  if (pages.length === 0) {
    console.error('[generateReportPDF] Aucune page .a4-page trouvée dans le template.');
    root.unmount();
    document.body.removeChild(container);
    return;
  }

  // ── 4. Capturer chaque page individuellement ────────────────────
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const canvasOptions = {
    scale:           2,          // haute résolution (Retina)
    useCORS:         true,
    allowTaint:      true,
    backgroundColor: '#ffffff',
    logging:         false,
    width:           A4_W_PX,
    height:          A4_H_PX,
    windowWidth:     A4_W_PX,
    windowHeight:    A4_H_PX,
  };

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];

    // S'assurer que la page fait exactement A4
    page.style.width     = `${A4_W_PX}px`;
    page.style.minHeight = `${A4_H_PX}px`;
    page.style.boxShadow = 'none';
    page.style.margin    = '0';

    const canvas = await html2canvas(page, canvasOptions);
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, 0, A4_W_MM, A4_H_MM);
  }

  // ── 5. Téléchargement direct ────────────────────────────────────
  const date = new Date().toISOString().slice(0, 10);
  pdf.save(`rapport-business-checkup-${date}.pdf`);

  // ── 6. Nettoyage ────────────────────────────────────────────────
  root.unmount();
  document.body.removeChild(container);
}
