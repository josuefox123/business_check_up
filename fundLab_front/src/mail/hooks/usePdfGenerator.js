import { useCallback, useState } from 'react';
import html2pdf from 'html2pdf.js';

export const usePdfGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Génère un fichier Blob PDF à partir d'un élément HTML DOM
   * @param {HTMLElement} element - L'élément DOM à convertir (ex: la ref du composant)
   * @param {string} filename - Le nom par défaut du fichier (optionnel)
   * @returns {Promise<Blob>} Le fichier Blob PDF
   */
  const generatePdfBlob = useCallback(async (element, filename = 'rapport.pdf') => {
    setIsGenerating(true);
    setError(null);
    try {
      // Configuration de html2pdf
      const opt = {
        margin:       0,
        filename:     filename,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      // Au lieu de sauvegarder (save()), on demande la sortie sous forme de Blob
      const pdfBlob = await html2pdf()
        .set(opt)
        .from(element)
        .output('blob');
      
      return pdfBlob;
    } catch (err) {
      console.error('Erreur lors de la génération du PDF', err);
      setError(err);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { generatePdfBlob, isGenerating, error };
};
