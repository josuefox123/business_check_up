<?php

namespace App\Mail;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AppointmentConfirmedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Appointment $appointment) {}

    public function build(): self
    {
        return $this->subject('Votre demande de rendez-vous Business Check-up est bien reçue')
            ->view('emails.appointment-request-received')
            ->with(['appointment' => $this->appointment]);
    }


    // public function build(): self
    // {
    //     return $this
    //         ->subject('Votre rendez-vous Business Check-up est confirmé')
    //         ->view('emails.appointment-confirmed')
    //         ->with([
    //             'dateLabel'   => $this->appointment->confirmed_starts_at->translatedFormat('l j F Y à H\hi'),
    //             'mode'        => $this->appointment->mode,
    //             'meetingLink' => $this->appointment->meeting_link,
    //             'location'    => $this->appointment->location,
    //             'question'    => $this->appointment->main_question,
    //         ]);
    // }
}
