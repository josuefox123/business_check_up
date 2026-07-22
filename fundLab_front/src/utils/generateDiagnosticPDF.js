/**
 * generateDiagnosticPDF — Générateur PDF côté frontend
 * Utilise jsPDF pour produire un rapport professionnel et stylisé
 * aux couleurs strictes du Business Check-up (FUND.lab)
 */

import { jsPDF } from 'jspdf';

// ── Couleurs système strictes (2 couleurs de marque + neutres) ──
const COLORS = {
  primary:   [23, 33, 45],      // #17212D (Bleu crépuscule)
  teal:      [52, 190, 213],    // #34BED5 (Dark Turquoise)
  white:     [255, 255, 255],
  light:     [245, 247, 250],   // Gris très clair pour les cartes
  slate600:  [71, 85, 105],     // Couleur du texte secondaire
  slate400:  [148, 163, 184],
  slate200:  [226, 232, 240],
};

function setFill(doc, rgb) { doc.setFillColor(...rgb); }
function setTextColor(doc, rgb) { doc.setTextColor(...rgb); }

/**
 * Dessine un rectangle arrondi avec une couleur de fond
 */
function roundRect(doc, x, y, w, h, r, fillRgb) {
  setFill(doc, fillRgb);
  doc.roundedRect(x, y, w, h, r, r, 'F');
}

/**
 * Ajoute du texte avec wrap automatique
 */
function addWrappedText(doc, text, x, y, maxWidth, lineHeight = 5) {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

/**
 * Dessine la barre de score horizontale
 */
function drawScoreBar(doc, x, y, w, score) {
  const barH = 5;
  // Fond
  setFill(doc, COLORS.slate200);
  doc.roundedRect(x, y, w, barH, 2.5, 2.5, 'F');
  // Barre remplie (Strictement Teal)
  setFill(doc, COLORS.teal);
  doc.roundedRect(x, y, (w * score) / 100, barH, 2.5, 2.5, 'F');
  
  // Label %
  doc.setFontSize(8);
  setTextColor(doc, COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.text(`${score} / 100`, x + w + 4, y + barH - 1);
}

/**
 * Niveau de score
 */
function getLevel(score) {
  if (score < 40) return { label: 'Critique', color: COLORS.primary };
  if (score < 70) return { label: 'En développement', color: COLORS.primary };
  return { label: 'Excellent', color: COLORS.primary };
}

// ── Exportation principale ──────────────────────────────────────
export function generateDiagnosticPDF({
  score,
  moduleId,
  moduleName,
  forces,
  fragilites,
  priorityText,
  priorities,
  totalQuestions,
  confidence,
  date,
  userName,
  companyName,
  userEmail,
  userPhone,
  sector,
  department,
  commune,
}) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210; // largeur A4
  const MARGIN = 15;
  const CONTENT_W = W - MARGIN * 2;
  let Y = 0;

  // ────────────────────────────────────────────────────────────
  // PAGE 1 — EN-TÊTE ULTRA-COMPACT (30mm au lieu de 60mm)
  // ────────────────────────────────────────────────────────────
  roundRect(doc, 0, 0, W, 32, 0, COLORS.primary);

  // Logo / Titre app
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  setTextColor(doc, COLORS.teal);
  doc.text('FUND.lab', MARGIN, 12);
  doc.setFontSize(7.5);
  setTextColor(doc, COLORS.slate400);
  doc.text('Business Check-up', MARGIN, 16);

  // Date
  const dateStr = date || new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.setFontSize(8);
  setTextColor(doc, COLORS.slate400);
  doc.text(dateStr, W - MARGIN, 12, { align: 'right' });

  // Titre du rapport
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  setTextColor(doc, COLORS.white);
  doc.text('Rapport de Diagnostic', MARGIN, 26);
  
  doc.setFontSize(9.5);
  setTextColor(doc, COLORS.teal);
  doc.text(moduleName || moduleId, W - MARGIN, 26, { align: 'right' });

  Y = 38;

  // ── Bloc Informations Client (si présentes - Hauteur réduite à 16mm) ──
  const hasMeta = userName || companyName || userEmail || userPhone || sector || department || commune;
  if (hasMeta) {
    roundRect(doc, MARGIN, Y, CONTENT_W, 18, 4, COLORS.light);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    setTextColor(doc, COLORS.primary);
    doc.text("Informations Entreprise", MARGIN + 6, Y + 6);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    setTextColor(doc, COLORS.slate600);
    
    const metaParts = [];
    if (userName) metaParts.push(`Nom : ${userName}`);
    if (companyName) metaParts.push(`Structure : ${companyName}`);
    if (sector) metaParts.push(`Secteur : ${sector}`);
    if (commune) metaParts.push(`Commune : ${commune}`);
    doc.text(metaParts.join('  |  '), MARGIN + 6, Y + 12);

    Y += 23;
  }

  // ── Bloc Score Compact (Hauteur réduite à 20mm) ──
  roundRect(doc, MARGIN, Y, CONTENT_W, 20, 4, COLORS.light);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  setTextColor(doc, COLORS.slate600);
  doc.text('SCORE GLOBAL', MARGIN + 6, Y + 6);

  doc.setFontSize(16);
  setTextColor(doc, COLORS.primary);
  doc.text(`${score} / 100`, MARGIN + 6, Y + 14);

  doc.setFontSize(7.5);
  setTextColor(doc, COLORS.slate600);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fiabilité : ${confidence || 'Déclaratif'}  |  ${totalQuestions || 0} questions`, W - MARGIN - 6, Y + 6, { align: 'right' });

  // Barre de score
  drawScoreBar(doc, MARGIN + 36, Y + 10, CONTENT_W - 74, score);

  Y += 25;

  // ── Interprétation ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  setTextColor(doc, COLORS.primary);
  doc.text('Synthèse de la situation', MARGIN, Y);

  const interp = score < 40
    ? 'Votre situation nécessite une attention immédiate sur les fondamentaux de votre structure.'
    : score < 70
    ? 'Une base saine est présente mais des ajustements et structurations sont requis pour consolider vos acquis.'
    : 'Votre structure dispose de fondations solides. Prête pour le développement commercial ou la croissance.';

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  setTextColor(doc, COLORS.slate600);
  Y = addWrappedText(doc, interp, MARGIN, Y + 5, CONTENT_W, 4.5) + 6;

  // ────────────────────────────────────────────────────────────
  // SECTION — FORCES & FRAGILITÉS (Hauteur et Espacement réduits)
  // ────────────────────────────────────────────────────────────
  if ((forces && forces.length > 0) || (fragilites && fragilites.length > 0)) {
    roundRect(doc, MARGIN, Y, CONTENT_W, 7, 2, COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    setTextColor(doc, COLORS.white);
    doc.text('ANALYSE DES FORCES & POINTS DE VIGILANCE', MARGIN + 4, Y + 4.8);

    Y += 10;
    const colW = (CONTENT_W - 6) / 2;

    // Colonne gauche — Forces
    let leftY = Y;
    if (forces && forces.length > 0) {
      roundRect(doc, MARGIN, Y, colW, 5, 1.5, COLORS.light);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      setTextColor(doc, COLORS.primary);
      doc.text('✓ Points d\'appui (Forces)', MARGIN + 4, Y + 3.8);

      leftY += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      setTextColor(doc, COLORS.slate600);

      forces.forEach((f) => {
        setFill(doc, COLORS.teal);
        doc.circle(MARGIN + 2.5, leftY + 1.5, 0.8, 'F');
        leftY = addWrappedText(doc, f, MARGIN + 6, leftY + 1.2, colW - 8, 4) + 1.5;
      });
    }

    // Colonne droite — Fragilités
    let rightY = Y;
    if (fragilites && fragilites.length > 0) {
      const rightX = MARGIN + colW + 6;
      roundRect(doc, rightX, Y, colW, 5, 1.5, COLORS.light);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      setTextColor(doc, COLORS.primary);
      doc.text('Points de vigilance (Fragilités)', rightX + 4, Y + 3.8);

      rightY += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      setTextColor(doc, COLORS.slate600);

      fragilites.forEach((f) => {
        setFill(doc, COLORS.primary);
        doc.circle(rightX + 2.5, rightY + 1.5, 0.8, 'F');
        rightY = addWrappedText(doc, f, rightX + 6, rightY + 1.2, colW - 8, 4) + 1.5;
      });
    }

    Y = Math.max(leftY, rightY) + 6;
  }

  // Point prioritaire
  if (priorityText) {
    roundRect(doc, MARGIN, Y, CONTENT_W, 5, 1.5, COLORS.light);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    setTextColor(doc, COLORS.primary);
    doc.text('POINT PRIORITAIRE', MARGIN + 4, Y + 3.8);
    Y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    setTextColor(doc, COLORS.slate600);
    Y = addWrappedText(doc, priorityText, MARGIN, Y, CONTENT_W, 4.5) + 6;
  }

  // ────────────────────────────────────────────────────────────
  // SECTION — PLAN D'ACTIONS PRIORITAIRES (Intégration compacte)
  // ────────────────────────────────────────────────────────────
  if (priorities && priorities.length > 0) {
    // Vérifier si le plan d'actions tient sur la page
    if (Y + priorities.length * 16 > 275) {
      doc.addPage();
      Y = 15;
    }

    roundRect(doc, MARGIN, Y, CONTENT_W, 7, 2, COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    setTextColor(doc, COLORS.white);
    doc.text('PLAN D\'ACTIONS PRIORITAIRES', MARGIN + 4, Y + 4.8);
    Y += 10;

    priorities.forEach((p, i) => {
      const priorityLabel = typeof p === 'string' ? `Priorité ${i + 1}` : p.label;
      const priorityText2 = typeof p === 'string' ? p : p.text;

      // Un seul rectangle arrondi ultra-compact de 13mm de haut
      roundRect(doc, MARGIN, Y, CONTENT_W, 13, 2.5, COLORS.light);
      
      // Badge numérique Teal à gauche
      roundRect(doc, MARGIN + 3, Y + 2, 9, 9, 2, COLORS.teal);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      setTextColor(doc, COLORS.white);
      doc.text(`${i + 1}`, MARGIN + 7.5, Y + 8.2, { align: 'center' });
      
      // Libellé de priorité
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      setTextColor(doc, COLORS.primary);
      doc.text(priorityLabel, MARGIN + 15, Y + 5.5);
      
      // Texte de recommandation
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      setTextColor(doc, COLORS.slate600);
      addWrappedText(doc, priorityText2 || '', MARGIN + 15, Y + 9.5, CONTENT_W - 20, 4);
      
      Y += 15.5; // Espacement compact entre les priorités
    });
  }

  // ────────────────────────────────────────────────────────────
  // PIED DE PAGE STRICT (Bleu crépuscule & Teal)
  // ────────────────────────────────────────────────────────────
  const totalPages = doc.getNumberOfPages();
  for (let pg = 1; pg <= totalPages; pg++) {
    doc.setPage(pg);

    roundRect(doc, 0, 287, W, 10, 0, COLORS.primary);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    setTextColor(doc, COLORS.slate400);
    doc.text('© FUND.lab — Business Check-up — Document Confidentiel', MARGIN, 293);
    doc.text(`Page ${pg} / ${totalPages}`, W - MARGIN, 293, { align: 'right' });
    
    // Ligne décorative Teal à gauche
    setFill(doc, COLORS.teal);
    doc.rect(0, 286.5, 4, 11, 'F');
  }

  // ── Téléchargement ──
  const safeModule = (moduleId || 'diagnostic').replace(/[^a-zA-Z0-9-]/g, '-');
  const safeDateStr = new Date().toISOString().slice(0, 10);
  doc.save(`rapport-${safeModule}-${safeDateStr}.pdf`);
}
