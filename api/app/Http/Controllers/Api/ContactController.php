<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ContactMessageMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;

class ContactController extends Controller
{
    /**
     * Page de contact : transmet le message au DG par email.
     * POST /api/bc/contact
     */
    public function send(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email'     => ['required', 'email:rfc', 'max:255'],
            'subject'   => ['required', 'string', 'max:255'],
            'message'   => ['required', 'string', 'min:10', 'max:3000'],
        ]);

        try {
            Mail::to(config('business-checkup.contact_recipient'))
                ->send(new ContactMessageMail(
                    fullName: $validated['full_name'],
                    fromEmail: strtolower($validated['email']),
                    subjectLine: $validated['subject'],
                    messageBody: $validated['message'],
                ));
        } catch (TransportExceptionInterface $e) {
            Log::error('Échec envoi message de contact', [
                'email' => $validated['email'],
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'L\'envoi de votre message a échoué. Veuillez réessayer.',
                'code'    => 'EMAIL_SEND_FAILED',
            ], 502);
        }

        return response()->json([
            'message' => 'Votre message a bien été envoyé. Nous vous répondrons dans les plus brefs délais.',
        ], 200);
    }
}
