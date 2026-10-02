<?php

namespace App\Mail;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AppointmentCancelledMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Appointment $appointment) {}

    public function build(): self
    {
        return $this->subject('Annulation de votre rendez-vous Business Check-up')
            ->view('emails.appointment-cancelled')
            ->with(['appointment' => $this->appointment]);
    }
}
