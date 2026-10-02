<?php

namespace App\Console\Commands;

use App\Mail\ReportMail;
use App\Services\ReportPdfService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendReportTestCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'report:send {email : Adresse email du destinataire} {--name=Client : Nom du destinataire}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Génère le rapport PDF de 3 pages et l\'envoie par email';

    /**
     * Execute the console command.
     */
    public function handle(ReportPdfService $pdfService): int
    {
        $email = $this->argument('email');
        $name = $this->option('name');

        $this->info("Génération du rapport PDF de 3 pages pour {$name}...");

        $pdfPath = $pdfService->generateFile([
            'client_name' => $name,
            'date' => date('d/m/Y'),
        ]);

        $pdfContent = file_get_contents($pdfPath);

        $this->info("Envoi de l'email à {$email}...");

        Mail::to($email)->send(new ReportMail($pdfContent, $name));

        @unlink($pdfPath);

        $this->info("✔ Email envoyé avec succès ! (Vérifiez storage/logs/laravel.log si MAIL_MAILER=log)");

        return Command::SUCCESS;
    }
}
