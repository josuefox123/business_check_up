import { jsPDF } from 'jspdf';

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

function roundRect(doc, x, y, w, h, r, fillRgb) {
  setFill(doc, fillRgb);
  doc.roundedRect(x, y, w, h, r, r, 'F');
}

function addWrappedText(doc, text, x, y, maxWidth, lineHeight = 5) {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

function drawScoreBar(doc, x, y, w, score) {
  const barH = 5;
  setFill(doc, COLORS.slate200);
  doc.roundedRect(x, y, w, barH, 2.5, 2.5, 'F');
  setFill(doc, COLORS.teal);
  doc.roundedRect(x, y, (w * score) / 100, barH, 2.5, 2.5, 'F');
  
  doc.setFontSize(8);
  setTextColor(doc, COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.text(`${score} / 100`, x + w + 4, y + barH - 1);
}

export function generateMergedReportPDF({
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
  questionResponses,
}) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210;
  const MARGIN = 15;
  const CONTENT_W = W - MARGIN * 2;
  let Y = 0;

  // ────────────────────────────────────────────────────────────
  // PAGE 1 — EN-TÊTE COMPACT
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
  doc.setFontSize(14);
  setTextColor(doc, COLORS.white);
  doc.text('Rapport Synthèse & Réponses', MARGIN, 26);
  
  doc.setFontSize(9.5);
  setTextColor(doc, COLORS.teal);
  doc.text(moduleName || moduleId || 'Diagnostic', W - MARGIN, 26, { align: 'right' });

  Y = 38;

  // ── Bloc Informations Client (si présentes) ──
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

  // ── Bloc Score Compact ──
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

  // ── Section Forces & Fragilités ──
  const forcesList = Array.isArray(forces) ? forces : [];
  const fragilitesList = Array.isArray(fragilites) ? fragilites : [];

  if (forcesList.length > 0 || fragilitesList.length > 0) {
    roundRect(doc, MARGIN, Y, CONTENT_W, 7, 2, COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    setTextColor(doc, COLORS.white);
    doc.text('ANALYSE DES FORCES & POINTS DE VIGILANCE', MARGIN + 4, Y + 4.8);

    Y += 10;
    const colW = (CONTENT_W - 6) / 2;

    // Colonne gauche — Forces
    let leftY = Y;
    if (forcesList.length > 0) {
      roundRect(doc, MARGIN, Y, colW, 5, 1.5, COLORS.light);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      setTextColor(doc, COLORS.primary);
      doc.text('✓ Points d\'appui (Forces)', MARGIN + 4, Y + 3.8);

      leftY += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      setTextColor(doc, COLORS.slate600);

      forcesList.forEach((f) => {
        setFill(doc, COLORS.teal);
        doc.circle(MARGIN + 2.5, leftY + 1.5, 0.8, 'F');
        leftY = addWrappedText(doc, f, MARGIN + 6, leftY + 1.2, colW - 8, 4) + 1.5;
      });
    }

    // Colonne droite — Fragilités
    let rightY = Y;
    if (fragilitesList.length > 0) {
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

      fragilitesList.forEach((f) => {
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

  // Plan d'actions prioritaires
  const prioritiesList = Array.isArray(priorities) ? priorities : [];
  if (prioritiesList.length > 0) {
    if (Y + prioritiesList.length * 16 > 275) {
      doc.addPage();
      Y = 15;
    }

    roundRect(doc, MARGIN, Y, CONTENT_W, 7, 2, COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    setTextColor(doc, COLORS.white);
    doc.text('PLAN D\'ACTIONS PRIORITAIRES', MARGIN + 4, Y + 4.8);
    Y += 10;

    prioritiesList.forEach((p, i) => {
      const priorityLabel = typeof p === 'string' ? `Priorité ${i + 1}` : p.label;
      const priorityText2 = typeof p === 'string' ? p : p.text;

      roundRect(doc, MARGIN, Y, CONTENT_W, 13, 2.5, COLORS.light);
      roundRect(doc, MARGIN + 3, Y + 2, 9, 9, 2, COLORS.teal);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      setTextColor(doc, COLORS.white);
      doc.text(`${i + 1}`, MARGIN + 7.5, Y + 8.2, { align: 'center' });
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      setTextColor(doc, COLORS.primary);
      doc.text(priorityLabel, MARGIN + 15, Y + 5.5);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      setTextColor(doc, COLORS.slate600);
      addWrappedText(doc, priorityText2 || '', MARGIN + 15, Y + 9.5, CONTENT_W - 20, 4);
      
      Y += 15.5;
    });
  }

  // ────────────────────────────────────────────────────────────
  // PAGE SUIVANTE — DÉTAIL DES QUESTIONS & RÉPONSES
  // ────────────────────────────────────────────────────────────
  doc.addPage();
  Y = 15;

  roundRect(doc, MARGIN, Y, CONTENT_W, 7, 2, COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  setTextColor(doc, COLORS.white);
  doc.text('DÉTAIL DES QUESTIONS & RÉPONSES DU DIAGNOSTIC', MARGIN + 4, Y + 4.8);
  Y += 12;

  const responses = Array.isArray(questionResponses) ? questionResponses : [];
  
  responses.forEach((resp, idx) => {
    const questionText = resp?.questionText
      ?? resp?.question?.text
      ?? resp?.question_text
      ?? resp?.question_id
      ?? `[question_id ${resp?.question_id ?? idx} non disponible]`;

    let displayAnswer = resp?.displayAnswer;
    if (!displayAnswer) {
      const answerLabel = resp?.answer_label ?? null;
      const answerText = resp?.answer_text ?? null;
      const answerValue = resp?.answer_value ?? null;

      displayAnswer = answerLabel || answerText;
      if (!displayAnswer && answerValue) {
        displayAnswer = typeof answerValue === 'string'
          ? answerValue.replace(/^"|"$/g, '')
          : JSON.stringify(answerValue);
      }
    }
    if (!displayAnswer) displayAnswer = '[Aucune réponse fournie]';

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    const qLines = doc.splitTextToSize(`${idx + 1}. ${questionText}`, CONTENT_W - 12);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const aLines = doc.splitTextToSize(`R : ${displayAnswer}`, CONTENT_W - 16);

    const qHeight = qLines.length * 4.2;
    const aHeight = aLines.length * 4;
    const cardHeight = qHeight + aHeight + 8; // margins

    if (Y + cardHeight > 275) {
      doc.addPage();
      Y = 15;
    }

    roundRect(doc, MARGIN, Y, CONTENT_W, cardHeight, 2, COLORS.light);

    // Question
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    setTextColor(doc, COLORS.primary);
    doc.text(qLines, MARGIN + 4, Y + 5.5);

    // Answer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    setTextColor(doc, COLORS.slate600);
    
    setFill(doc, COLORS.teal);
    doc.rect(MARGIN + 4, Y + 5.5 + qHeight + 0.5, 1.5, aHeight - 1, 'F');

    doc.text(aLines, MARGIN + 7, Y + 5.5 + qHeight + 3);

    Y += cardHeight + 3;
  });

  // ────────────────────────────────────────────────────────────
  // PIED DE PAGE STRUCTURÉ SUR TOUTES LES PAGES
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
    
    setFill(doc, COLORS.teal);
    doc.rect(0, 286.5, 4, 11, 'F');
  }

  const safeModule = (moduleId || 'diagnostic').replace(/[^a-zA-Z0-9-]/g, '-');
  const safeDateStr = new Date().toISOString().slice(0, 10);
  doc.save(`rapport-fusion-${safeModule}-${safeDateStr}.pdf`);
}
