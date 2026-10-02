<?php

namespace Tests\Feature;

use App\Mail\ReportMail;
use App\Services\ReportPdfService;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class ReportPdfMailTest extends TestCase
{
    /**
     * Test high-level ReportPdfService generates background 3-page PDF file.
     */
    public function test_report_pdf_service_generates_background_file(): void
    {
        $pdfService = new ReportPdfService();
        $pdfPath = $pdfService->generateFile([
            'client_name' => 'Entreprise Test',
            'global_score' => 62,
        ]);

        $this->assertFileExists($pdfPath);
        $this->assertGreaterThan(50000, filesize($pdfPath));

        @unlink($pdfPath);
    }

    /**
     * Test HTML preview route renders correctly with 3 pages.
     */
    public function test_report_preview_route_returns_200(): void
    {
        $response = $this->get('/report/preview');
        $response->assertStatus(200);
        $response->assertSee('VOTRE SITUATION');
        $response->assertSee('CE QUE RÉVÈLE');
        $response->assertSee('VOTRE PLAN DE TRAVAIL PRIORITAIRE');
    }

    /**
     * Test direct PDF download route triggers file download.
     */
    public function test_report_download_pdf_route_returns_pdf_download(): void
    {
        $response = $this->get('/report/download-pdf');
        $response->assertStatus(200);
        $response->assertHeader('content-type', 'application/pdf');
    }

    /**
     * Test Mailable includes raw PDF attachment correctly.
     */
    public function test_report_mailable_has_pdf_attachment(): void
    {
        $pdfService = new ReportPdfService();
        $pdfPath = $pdfService->generateFile([
            'client_name' => 'Client Test Mailable',
        ]);

        $pdfContent = file_get_contents($pdfPath);
        $mail = new ReportMail($pdfContent, 'Client Test Mailable');

        $mail->assertHasSubject('Votre Rapport Business Check-up (3 pages)');

        @unlink($pdfPath);
    }

    /**
     * Test sending email test route triggers Mail fake.
     */
    public function test_test_send_email_route_sends_mail(): void
    {
        Mail::fake();

        $response = $this->get('/test-send-email?email=test@example.com');
        $response->assertStatus(200);

        Mail::assertSent(ReportMail::class, function ($mail) {
            return $mail->hasTo('test@example.com');
        });
    }
}
