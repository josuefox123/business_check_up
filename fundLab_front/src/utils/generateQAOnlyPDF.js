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

export function generateQAOnlyPDF({
  businessName,
  userName,
  userEmail,
  userPhone,
  moduleCode,
  startedAt,
  completedAt,
  questionResponses,
}) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210;
  const MARGIN = 15;
  const CONTENT_W = W - MARGIN * 2;
  let Y = 0;

  // Header band
  roundRect(doc, 0, 0, W, 32, 0, COLORS.primary);

  // Brand Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  setTextColor(doc, COLORS.teal);
  doc.text('FUND.lab', MARGIN, 12);
  doc.setFontSize(7.5);
  setTextColor(doc, COLORS.slate400);
  doc.text('Business Check-up', MARGIN, 16);

  // Date / Doc subtitle
  const dateStr = completedAt || startedAt || new Date().toLocaleDateString('fr-FR');
  doc.setFontSize(8);
  setTextColor(doc, COLORS.slate400);
  doc.text(`Rapport exporté le ${new Date().toLocaleDateString('fr-FR')}`, W - MARGIN, 12, { align: 'right' });

  // Main Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  setTextColor(doc, COLORS.white);
  doc.text('Questions & Réponses du Diagnostic', MARGIN, 26);

  doc.setFontSize(9.5);
  setTextColor(doc, COLORS.teal);
  doc.text(moduleCode, W - MARGIN, 26, { align: 'right' });

  Y = 38;

  // Meta information block
  roundRect(doc, MARGIN, Y, CONTENT_W, 22, 4, COLORS.light);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  setTextColor(doc, COLORS.primary);
  doc.text("Détails du Diagnostic", MARGIN + 6, Y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  setTextColor(doc, COLORS.slate600);

  doc.text(`Entreprise : ${businessName || '[business_name non disponible]'}`, MARGIN + 6, Y + 11);
  doc.text(`Renseigné par : ${userName || '[userName non disponible]'}`, MARGIN + 6, Y + 15);
  
  const contactParts = [];
  if (userEmail) contactParts.push(`Email: ${userEmail}`);
  if (userPhone) contactParts.push(`Tél: ${userPhone}`);
  doc.text(contactParts.join('  |  ') || '[aucun contact disponible]', MARGIN + 6, Y + 19);

  // Right side meta (Started/Completed dates)
  doc.text(`Début : ${startedAt || '—'}`, W - MARGIN - 6, Y + 11, { align: 'right' });
  if (completedAt) {
    doc.text(`Fin : ${completedAt}`, W - MARGIN - 6, Y + 15, { align: 'right' });
  }

  Y += 28;

  // Header of the Q&A list
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  setTextColor(doc, COLORS.primary);
  doc.text('Réponses fournies par l\'entreprise :', MARGIN, Y);
  Y += 6;

  // Render Q&A pairs
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

    // Calculate height needed for question and answer
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    const qLines = doc.splitTextToSize(`${idx + 1}. ${questionText}`, CONTENT_W - 12);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const aLines = doc.splitTextToSize(`R : ${displayAnswer}`, CONTENT_W - 16);

    const qHeight = qLines.length * 4.2;
    const aHeight = aLines.length * 4;
    const cardHeight = qHeight + aHeight + 8; // margins

    // Check page break
    if (Y + cardHeight > 275) {
      doc.addPage();
      Y = 15;
    }

    // Render Q&A Card
    roundRect(doc, MARGIN, Y, CONTENT_W, cardHeight, 2, COLORS.light);

    // Render Question
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    setTextColor(doc, COLORS.primary);
    doc.text(qLines, MARGIN + 4, Y + 5.5);

    // Render Answer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    setTextColor(doc, COLORS.slate600);
    
    // Draw a subtle line indicator next to the answer
    setFill(doc, COLORS.teal);
    doc.rect(MARGIN + 4, Y + 5.5 + qHeight + 0.5, 1.5, aHeight - 1, 'F');

    doc.text(aLines, MARGIN + 7, Y + 5.5 + qHeight + 3);

    Y += cardHeight + 3; // spacing between cards
  });

  // Footer page numbering and brand
  const totalPages = doc.getNumberOfPages();
  for (let pg = 1; pg <= totalPages; pg++) {
    doc.setPage(pg);

    roundRect(doc, 0, 287, W, 10, 0, COLORS.primary);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    setTextColor(doc, COLORS.slate400);
    doc.text('© FUND.lab — Business Check-up — Document Confidentiel', MARGIN, 293);
    doc.text(`Page ${pg} / ${totalPages}`, W - MARGIN, 293, { align: 'right' });
    
    // Teal decorative line on footer left
    setFill(doc, COLORS.teal);
    doc.rect(0, 286.5, 4, 11, 'F');
  }

  const safeModule = (moduleCode || 'diagnostic').replace(/[^a-zA-Z0-9-]/g, '-');
  const safeDateStr = new Date().toISOString().slice(0, 10);
  doc.save(`reponses-${safeModule}-${safeDateStr}.pdf`);
}
