<?php

namespace App\Mail;

use App\Models\DiagnosticRun;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class DiagnosticReportMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public DiagnosticRun $run,
        public string $pdfPath,
        public ?string $recipientName = null,
        public ?string $moduleLabel   = null,
    ) {}

    public function build(): self
    {
        $businessName = $this->run->business?->business_name;
        $hasBusiness  = $businessName && strtolower($businessName) !== 'non renseigné';

        $subject = $hasBusiness
            ? "Rapport : {$businessName}"
            : 'Votre rapport Business Check-up';

        $slug = $hasBusiness
            ? preg_replace('/[^a-zA-Z0-9]+/', '_', $businessName)
            : null;
        $pdfName = $slug
            ? "Rapport_BCU_{$slug}.pdf"
            : 'Rapport_Business_Checkup_3_Pages.pdf';

        return $this
            ->subject($subject)
            ->view('emails.diagnostic-final-report')
            ->with([
                'recipientName' => $this->recipientName,
                'moduleName'    => $this->moduleLabel ?? $this->run->module_name ?? $this->run->module_code,
                'businessName'  => $businessName,
            ])
            ->attach($this->pdfPath, [
                'as'   => $pdfName,
                'mime' => 'application/pdf',
            ]);
    }
}
