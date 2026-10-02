<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Mail\AppointmentCancelledMail;
use App\Mail\AppointmentConfirmedMail;
use App\Models\Appointment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class AppointmentAdminController extends Controller
{
    /**
     * Demandes urgentes en premier, puis par date souhaitée. (liste de rdv)
     * GET /admin/appointments?status=requested
     */
    public function index(Request $request): JsonResponse
    {
        $appointments = Appointment::with('diagnosticRun:id,module_code', 'user')
            ->when($request->status, fn($q, $v) => $q->where('status', $v))
            ->orderByRaw("FIELD(priority, 'urgent','normal')")
            ->orderBy('requested_starts_at')
            ->get();

        return response()->json($appointments);
    }

    /**
     * L'admin valide le créneau demandé (ou en impose un autre) + lien/lieu.
     * POST /admin/appointments/{id}/confirm
     */
    public function confirm(Request $request, string $appointmentId): JsonResponse
    {
        $validated = $request->validate([
            'confirmed_starts_at' => ['nullable', 'date', 'after:now'],
            'meeting_link'        => ['nullable', 'url'],
            'location'            => ['nullable', 'string', 'max:255'],
        ]);

        $appointment = Appointment::findOrFail($appointmentId);
        // abort_unless($appointment->status === 'requested', 422, 'Rendez-vous déjà traité.');

        $appointment->update([
            'status'              => 'confirmed',
            'confirmed_starts_at' => $validated['confirmed_starts_at'] ?? $appointment->requested_starts_at,
            'meeting_link'        => $validated['meeting_link'] ?? null,
            'location'            => $validated['location'] ?? null,
        ]);

        if ($appointment->email) {
            Mail::to($appointment->email)
                ->send(new AppointmentConfirmedMail($appointment));
        }


        return response()->json(['message' => 'Rendez-vous confirmé.', 'appointment' => $appointment->fresh()]);
    }

    /**
     * L'admin annule le RDV
     */
    public function cancel(string $appointmentId): JsonResponse
    {
        $appointment = Appointment::findOrFail($appointmentId);
        $appointment->update(['status' => 'cancelled']);

        if ($appointment->email) {
            Mail::to($appointment->email)
                ->send(new AppointmentCancelledMail($appointment));
        }

        return response()->json(['message' => 'Rendez-vous annulé.']);
    }
    /**
     * L'admin marque que le rendez vous est terminé
     */

    public function complete(string $appointmentId): JsonResponse
    {
        Appointment::findOrFail($appointmentId)->update(['status' => 'completed']);

        return response()->json(['message' => 'Rendez-vous marqué comme réalisé.']);
    }
}
