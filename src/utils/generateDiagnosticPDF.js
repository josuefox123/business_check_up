/**
 * generateDiagnosticPDF — Générateur PDF côté frontend
 * Utilise jsPDF pour produire un rapport professionnel et stylisé
 * aux couleurs du Business Check-up (FUND.lab)
 */

import { jsPDF } from 'jspdf';

// ── Couleurs système ────────────────────────────────────────────
const COLORS = {
  primary:   [23, 33, 45],      // #17212D
  teal:      [52, 190, 213],    // #34BED5
  blue:      [38, 89, 242],     // #2659F2
  white:     [255, 255, 255],
  light:     [241, 245, 249],   // #F1F5F9
  slate600:  [100, 116, 139],   // #64748B
  slate400:  [148, 163, 184],   // #94A3B8
  slate200:  [226, 232, 240],   // #E2E8F0
  success:   [16, 185, 129],    // #10B981
  warning:   [245, 158, 11],    // #F59E0B
  danger:    [239, 68, 68],     // #EF4444
};

// ── Helpers ─────────────────────────────────────────────────────
const hex = (rgb) => `#${rgb.map(v => v.toString(16).padStart(2, '0')).join('')}`;
const rgbToHex = (r, g, b) => hex([r, g, b]);

function setFill(doc, rgb) { doc.setFillColor(...rgb); }
function setStroke(doc, rgb) { doc.setDrawColor(...rgb); }
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
 * Retourne la nouvelle position Y
 */
function addWrappedText(doc, text, x, y, maxWidth, lineHeight = 6) {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

/**
 * Dessine la barre de score horizontale
 */
function drawScoreBar(doc, x, y, w, score) {
  const barH = 8;
  // Fond
  setFill(doc, COLORS.slate200);
  doc.roundedRect(x, y, w, barH, 4, 4, 'F');
  // Barre remplie
  const fillColor = score < 40 ? COLORS.danger : score < 70 ? COLORS.warning : COLORS.success;
  setFill(doc, fillColor);
  doc.roundedRect(x, y, (w * score) / 100, barH, 4, 4, 'F');
  // Label %
  doc.setFontSize(8);
  setTextColor(doc, fillColor);
  doc.setFont('helvetica', 'bold');
  doc.text(`${score} / 100`, x + w + 4, y + barH - 1);
}

/**
 * Niveau de score
 */
function getLevel(score) {
  if (score < 40) return { label: 'Critique', color: COLORS.danger };
  if (score < 55) return { label: 'Fragile', color: COLORS.warning };
  if (score < 70) return { label: 'En développement', color: [251, 191, 36] };
  if (score < 85) return { label: 'Solide', color: COLORS.teal };
  return { label: 'Excellent', color: COLORS.success };
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
  userEmail,
  userPhone,
  companyName,
  sector,
  department,
  commune,
}) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210; // largeur A4
  const MARGIN = 18;
  const CONTENT_W = W - MARGIN * 2;
  let Y = 0;

  // ────────────────────────────────────────────────────────────
  // PAGE 1 — EN-TÊTE + SCORE + RÉSUMÉ
  // ────────────────────────────────────────────────────────────

  // Bloc hero
  roundRect(doc, 0, 0, W, 60, 0, COLORS.primary);

  // Logo / Titre app
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  setTextColor(doc, COLORS.teal);
  doc.text('FUND.lab', MARGIN, 16);
  doc.setFontSize(7);
  setTextColor(doc, COLORS.slate400);
  doc.text('Business Check-up', MARGIN, 21);

  // Date
  const dateStr = date || new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.setFontSize(8);
  setTextColor(doc, COLORS.slate400);
  doc.text(dateStr, W - MARGIN, 16, { align: 'right' });

  // Titre du rapport
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  setTextColor(doc, COLORS.white);
  doc.text('Rapport de Diagnostic', MARGIN, 36);
  doc.setFontSize(11);
  setTextColor(doc, COLORS.teal);
  doc.text(moduleName || moduleId, MARGIN, 44);

  // Trait décoratif
  setFill(doc, COLORS.teal);
  doc.rect(MARGIN, 50, 40, 1.5, 'F');

  Y = 68;

  // ── Bloc Informations Client (si présentes) ──
  const hasMeta = userName || companyName || userEmail || userPhone || sector || department || commune;
  if (hasMeta) {
    roundRect(doc, MARGIN, Y, CONTENT_W, 28, 5, COLORS.light);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    setTextColor(doc, COLORS.primary);
    doc.text("Informations de l'entreprise", MARGIN + 8, Y + 8);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    setTextColor(doc, COLORS.slate600);
    
    // Ligne 1
    const parts1 = [];
    if (userName) parts1.push(`Nom : ${userName}`);
    if (companyName) parts1.push(`Entreprise : ${companyName}`);
    doc.text(parts1.join('   |   '), MARGIN + 8, Y + 14);

    // Ligne 2
    const parts2 = [];
    if (userEmail) parts2.push(`E-mail : ${userEmail}`);
    if (userPhone) parts2.push(`Tél : ${userPhone}`);
    doc.text(parts2.join('   |   '), MARGIN + 8, Y + 19);

    // Ligne 3
    const parts3 = [];
    if (sector) parts3.push(`Secteur : ${sector}`);
    if (department) parts3.push(`Département : ${department}`);
    if (commune) parts3.push(`Commune : ${commune}`);
    doc.text(parts3.join('   |   '), MARGIN + 8, Y + 24);

    Y += 36; // décale la suite vers le bas
  }

  // ── Bloc Score ──
  roundRect(doc, MARGIN, Y, CONTENT_W, 38, 6, COLORS.light);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  setTextColor(doc, COLORS.slate400);
  doc.text('SCORE GLOBAL', MARGIN + 8, Y + 10);

  const lvl = getLevel(score);
  doc.setFontSize(36);
  setTextColor(doc, lvl.color);
  doc.text(`${score}`, MARGIN + 8, Y + 28);

  doc.setFontSize(11);
  setTextColor(doc, COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.text(lvl.label, MARGIN + 32, Y + 21);

  doc.setFontSize(8);
  setTextColor(doc, COLORS.slate600);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fiabilité : ${confidence || 'Déclaratif'} — ${totalQuestions || 0} questions`, MARGIN + 32, Y + 28);

  // Barre de score
  drawScoreBar(doc, MARGIN + 8, Y + 32, CONTENT_W - 60, score);

  Y += 46;

  // ── Interprétation ──
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  setTextColor(doc, COLORS.primary);
  doc.text('Interprétation', MARGIN, Y + 8);

  const interp = score < 40
    ? 'Votre situation nécessite une attention immédiate sur les fondamentaux. Des actions correctives urgentes sont recommandées.'
    : score < 70
    ? 'Base saine mais des optimisations sont nécessaires pour passer au cap suivant. Un accompagnement ciblé peut accélérer votre progression.'
    : 'Structure solide et prête pour la croissance ou la mise à l\'échelle. Capitalisez sur vos atouts.';

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  setTextColor(doc, COLORS.slate600);
  Y = addWrappedText(doc, interp, MARGIN, Y + 14, CONTENT_W, 5.5);

  Y += 8;

  // ────────────────────────────────────────────────────────────
  // SECTION — FORCES & FRAGILITÉS
  // ────────────────────────────────────────────────────────────

  // Titre section
  roundRect(doc, MARGIN, Y, CONTENT_W, 9, 3, COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  setTextColor(doc, COLORS.white);
  doc.text('ANALYSE DES FORCES & POINTS DE VIGILANCE', MARGIN + 6, Y + 6.2);

  Y += 13;

  const colW = (CONTENT_W - 6) / 2;

  // Colonne gauche — Forces
  roundRect(doc, MARGIN, Y, colW, 6, 2, [220, 252, 231]); // vert clair
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  setTextColor(doc, COLORS.success);
  doc.text('✓  Points d\'appui (Forces)', MARGIN + 4, Y + 4.2);

  Y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  setTextColor(doc, COLORS.slate600);

  const forcesStartY = Y;
  let leftY = Y;
  (forces || []).forEach((f) => {
    setFill(doc, COLORS.success);
    doc.circle(MARGIN + 2.5, leftY + 1.8, 1, 'F');
    leftY = addWrappedText(doc, f, MARGIN + 6, leftY + 1.5, colW - 8, 5) + 2;
  });

  // Colonne droite — Fragilités
  const rightX = MARGIN + colW + 6;
  let rightY = forcesStartY - 8;
  roundRect(doc, rightX, rightY, colW, 6, 2, [254, 243, 199]); // jaune clair
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  setTextColor(doc, COLORS.warning);
  doc.text('⚠  Points de vigilance (Fragilités)', rightX + 4, rightY + 4.2);

  rightY += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  setTextColor(doc, COLORS.slate600);

  (fragilites || []).forEach((f) => {
    setFill(doc, COLORS.warning);
    doc.circle(rightX + 2.5, rightY + 1.8, 1, 'F');
    rightY = addWrappedText(doc, f, rightX + 6, rightY + 1.5, colW - 8, 5) + 2;
  });

  Y = Math.max(leftY, rightY) + 6;

  // Point prioritaire
  roundRect(doc, MARGIN, Y, CONTENT_W, 6, 2, [239, 246, 255]); // bleu clair
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  setTextColor(doc, COLORS.blue);
  doc.text('POINT PRIORITAIRE', MARGIN + 4, Y + 4.2);
  Y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  setTextColor(doc, COLORS.slate600);
  Y = addWrappedText(doc, priorityText || '', MARGIN, Y, CONTENT_W, 5.5);
  Y += 8;

  // ────────────────────────────────────────────────────────────
  // SECTION — PLAN D'ACTIONS PRIORITAIRES
  // ────────────────────────────────────────────────────────────

  // Vérifier si on a besoin d'une nouvelle page
  if (Y > 220) {
    doc.addPage();
    Y = 20;
  }

  roundRect(doc, MARGIN, Y, CONTENT_W, 9, 3, COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  setTextColor(doc, COLORS.white);
  doc.text('PLAN D\'ACTIONS PRIORITAIRES', MARGIN + 6, Y + 6.2);
  Y += 13;

  (priorities || []).forEach((p, i) => {
    const priorityLabel = typeof p === 'string' ? `Priorité ${i + 1}` : p.label;
    const priorityText2 = typeof p === 'string' ? p : p.text;

    // Fond de la carte
    const cardColor = i === 0 && score < 40 ? [254, 226, 226] : i === 0 ? [254, 243, 199] : COLORS.light;
    const badgeColor = i === 0 && score < 40 ? COLORS.danger : i === 0 ? COLORS.warning : COLORS.teal;

    roundRect(doc, MARGIN, Y, CONTENT_W, 6, 2, badgeColor);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    setTextColor(doc, COLORS.white);
    doc.text(`${i + 1}  ${priorityLabel}`, MARGIN + 4, Y + 4.2);
    Y += 8;

    roundRect(doc, MARGIN, Y, CONTENT_W, 4, 0, cardColor);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    setTextColor(doc, COLORS.slate600);
    Y = addWrappedText(doc, priorityText2 || '', MARGIN + 4, Y + 4, CONTENT_W - 8, 5.5);
    Y += 6;

    if (Y > 265) {
      doc.addPage();
      Y = 20;
    }
  });

  // ────────────────────────────────────────────────────────────
  // PIED DE PAGE
  // ────────────────────────────────────────────────────────────

  const totalPages = doc.getNumberOfPages();
  for (let pg = 1; pg <= totalPages; pg++) {
    doc.setPage(pg);

    roundRect(doc, 0, 285, W, 12, 0, COLORS.primary);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    setTextColor(doc, COLORS.slate400);
    doc.text('© FUND.lab — Business Check-up — Confidentiel', MARGIN, 292);
    doc.text(`Page ${pg} / ${totalPages}`, W - MARGIN, 292, { align: 'right' });
    setFill(doc, COLORS.teal);
    doc.rect(0, 284, 4, 13, 'F');
  }

  // ── Téléchargement ──
  const safeModule = (moduleId || 'diagnostic').replace(/[^a-zA-Z0-9-]/g, '-');
  const safeDateStr = new Date().toISOString().slice(0, 10);
  doc.save(`rapport-${safeModule}-${safeDateStr}.pdf`);
}
