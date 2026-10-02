<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactMessageMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $fullName,
        public string $fromEmail,
        public string $subjectLine,
        public string $messageBody,
    ) {}

    public function build(): self
    {
        return $this
            ->subject('[Contact Business Check-up] ' . $this->subjectLine)
            ->replyTo($this->fromEmail, $this->fullName)  // ← le DG répond directement au visiteur
            ->view('emails.contact-message')
            ->with([
                'fullName'    => $this->fullName,
                'fromEmail'   => $this->fromEmail,
                'subjectLine' => $this->subjectLine,
                'messageBody' => $this->messageBody,
            ]);
    }
}
