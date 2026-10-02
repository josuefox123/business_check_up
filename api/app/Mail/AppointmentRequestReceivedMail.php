<?php

namespace App\Mail;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AppointmentRequestReceivedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Appointment $appointment) {}

    public function build(): self
    {
        return $this->subject('Votre demande de rendez-vous Business Check-up est bien reçue')
            ->view('emails.appointment-request-received')
            ->with(['appointment' => $this->appointment]);
    }
}
