<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EmailVerificationCodeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $code,
        public ?string $recipientName = null,
    ) {}

    public function build(): self
    {
        return $this
            ->subject('Votre code de vérification Business Check-up : ' . $this->code)
            ->view('emails.verification-code')
            ->with([
                'code'          => $this->code,
                'recipientName' => $this->recipientName,
                'expiresIn'     => 10,
            ]);
    }
}
