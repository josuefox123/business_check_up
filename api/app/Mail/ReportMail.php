<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReportMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $pdfRawData;
    public string $recipientName;
    public string $reportDate;
    public string $businessName;

    /**
     * Create a new message instance.
     */
    public function __construct(string $pdfRawData, string $recipientName = 'Client', string $reportDate = null, string $businessName  = '')
    {
        $this->pdfRawData = $pdfRawData;
        $this->recipientName = $recipientName;
        $this->reportDate    = $reportDate ?? date('d/m/Y');
        $this->businessName  = $businessName;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = $this->businessName
            ? "Votre rapport Business Check-up — {$this->businessName}"
            : 'Votre Rapport Business Check-up';

        return new Envelope(subject: $subject);
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $companyLine = $this->businessName
            ? ', pour <strong>' . e($this->businessName) . '</strong>'
            : '';

        return new Content(
            htmlString: '
                <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #001a3f; color: #ffffff; padding: 24px; text-align: center;">
                        <h2 style="margin: 0; font-size: 24px;">Business Check-up</h2>
                        <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.8;">Rapport de Diagnostic et Plan de Travail</p>
                    </div>
                    <div style="padding: 24px; background-color: #ffffff;">
                        <p>Bonjour <strong>' . e($this->recipientName) . '</strong>' . $companyLine . ',</p>
                        <p>Veuillez trouver ci-joint votre rapport complet de performance et diagnostic stratégique personnalisé (document PDF de 3 pages).</p>
                        
                        <div style="background-color: #f8f9fa; border-left: 4px solid #00696b; padding: 15px; margin: 20px 0; border-radius: 4px;">
                            <strong style="color: #001a3f;">Contenu du document joint :</strong>
                            <ul style="margin: 10px 0 0; padding-left: 20px;">
                                <li><strong>Page 1 :</strong> Vue globale &amp; score de performance</li>
                                <li><strong>Page 2 :</strong> Diagnostic multidimensionnel par axes</li>
                                <li><strong>Page 3 :</strong> Plan de travail prioritaire (Roadmap 90 jours)</li>
                            </ul>
                        </div>

                        <p>Pour toute question ou analyse complémentaire, notre équipe reste à votre entière disposition.</p>
                        <p style="margin-top: 30px;">Cordialement,<br><strong>L\'équipe Business Check-up</strong></p>
                    </div>
                    <div style="background-color: #f3f4f5; padding: 12px; text-align: center; font-size: 12px; color: #74777f;">
                        © ' . date('Y') . ' Business Check-up — Document confidentiel généré le ' . e($this->reportDate) . '
                    </div>
                </div>
            ',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        $slug    = $this->businessName
            ? preg_replace('/[^a-zA-Z0-9]+/', '_', $this->businessName)
            : null;
        $pdfName = $slug
            ? "Rapport_BCU_{$slug}.pdf"
            : 'Rapport_Business_Checkup_3_Pages.pdf';

        return [
            Attachment::fromData(fn () => $this->pdfRawData, $pdfName)
                ->withMime('application/pdf'),
        ];
    }
}
