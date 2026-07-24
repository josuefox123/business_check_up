import React, { useState, useRef } from 'react';
import { ReportTemplate } from '../components/pdf-templates/ReportTemplate.jsx';
import { Loader2, FileText } from 'lucide-react';

export const PdfTestScreen = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const wrapperRef = useRef(null);

  const handleDownload = async () => {
    if (!wrapperRef.current) return;
    setIsGenerating(true);

    try {
      const [{ jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
      ]);

      const pages = Array.from(wrapperRef.current.querySelectorAll('.a4-page'));
      if (!pages.length) throw new Error('Aucune page .a4-page trouvée');

      // ── Capturer chaque page à sa taille réelle ──────────────────────────
      const canvases = await Promise.all(
        pages.map(page =>
          html2canvas(page, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
            scrollX: 0,
            scrollY: 0,
          })
        )
      );

      // ── Créer le PDF au format A4 strict ─────────
      const PDF_W_MM = 210;
      const PDF_H_MM = 297;

      let pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      canvases.forEach((canvas, i) => {
        if (i > 0) pdf.addPage('a4');
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.98), 'JPEG', 0, 0, PDF_W_MM, PDF_H_MM);
      });

      const date = new Date().toISOString().slice(0, 10);
      pdf.save(`rapport-business-checkup-${date}.pdf`);
    } catch (err) {
      console.error('Erreur génération PDF:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#cbd5e1', minHeight: '100vh' }}>
      {/* Barre de contrôle fixe */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#0f172a',
        padding: '10px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
      }}>
        <div>
          <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff', margin: 0 }}>
            Prévisualisation — Template PDF
          </p>
          <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
            3 pages · Format A4 · html2canvas + jsPDF
          </p>
        </div>
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '9px 18px',
            background: isGenerating ? '#334155' : '#06b6d4',
            color: '#fff', border: 'none', borderRadius: '8px',
            fontWeight: 700, fontSize: '0.875rem',
            cursor: isGenerating ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', transition: 'background 0.2s',
          }}
        >
          {isGenerating
            ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Génération...</>
            : <><FileText size={15} /> Télécharger le PDF</>
          }
        </button>
      </div>

      {/* Pages rendues à taille réelle — html2canvas capture ce rendu exact */}
      <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0' }}>
        <div ref={wrapperRef}>
          <ReportTemplate />
        </div>
      </div>
    </div>
  );
};
