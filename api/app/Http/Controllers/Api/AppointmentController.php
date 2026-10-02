<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\AppointmentRequestReceivedMail;
use App\Models\Appointment;
use App\Models\DiagnosticRun;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class AppointmentController extends Controller
{
    /**
     * Types de RDV suggérés par module (doc RDV PREPARATION, version simplifiée).
     */
    private const RDV_BY_MODULE = [
        'FLH-01' => ['type' => 'orientation',            'label' => "Entretien d'orientation"],
        'PRJ-02' => ['type' => 'project_framing',        'label' => 'Entretien de cadrage projet'],
        'DIF-03' => ['type' => 'urgent_stabilization',   'label' => 'Entretien de stabilisation urgent'],
        'OPP-04' => ['type' => 'pwin_opportunity',       'label' => "Revue d'opportunité P.WIN"],
        'PRO-05' => ['type' => 'product_offer',          'label' => 'Entretien Produit / Offre'],
        'COM-06' => ['type' => 'commercial',             'label' => 'Entretien Commercial / Accès marché'],
        'FIN-07' => ['type' => 'finance_viability',      'label' => 'Entretien Finance / Viabilité'],
        'GOV-08' => ['type' => 'governance',             'label' => 'Entretien Gouvernance / Organisation'],
        '360-09' => ['type' => 'review_360',             'label' => 'Revue stratégique 360°'],
    ];

    /**
     * Ce que le front affiche avant la prise de RDV.
     * GET /diagnostics/{id}/appointment/options
     */
    // public function options(string $diagnosticRunId): JsonResponse
    // {
    //     $run = DiagnosticRun::with('scoringResult')->findOrFail($diagnosticRunId);
    //     abort_if($run->completion_status !== 'completed', 422, 'Diagnostic non terminé.');

    //     $suggestion = self::RDV_BY_MODULE[$run->module_code] ?? self::RDV_BY_MODULE['FLH-01'];
    //     $urgent = $run->scoringResult?->critical_red_flag_present || $run->module_code === 'DIF-03';

    //     return response()->json([
    //         'rdv_type'    => $suggestion['type'],
    //         'rdv_label'   => $suggestion['label'],
    //         'priority'    => $urgent ? 'urgent' : 'normal',
    //         'message'     => $urgent
    //             ? 'Votre situation mérite une revue rapide des échéances et marges de manœuvre.'
    //             : "Un entretien peut vous aider à transformer cette première lecture en plan d'action.",
    //         'modes'       => ['visio', 'phone', 'in_person'],
    //     ]);
    // }

    /**
     * Créneaux disponibles, générés depuis la config, moins ceux déjà confirmés.
     *  GET /appointments/slots
     */
    // public function slots(): JsonResponse
    // {
    //     $cfg = config('business-checkup.appointments');

    //     $reserved = Appointment::where('status', 'confirmed')
    //         ->whereNotNull('confirmed_starts_at')
    //         ->pluck('confirmed_starts_at')
    //         ->map(fn($d) => Carbon::parse($d)->toIso8601String())
    //         ->all();

    //     $slots = [];
    //     foreach (CarbonPeriod::create(now()->addDay()->startOfDay(), $cfg['days_ahead'] . ' days') as $day) {
    //         if (!in_array($day->dayOfWeek, $cfg['weekdays'])) continue;

    //         $cursor = $day->copy()->setTime($cfg['start_hour'], 0);
    //         $end    = $day->copy()->setTime($cfg['end_hour'], 0);

    //         while ($cursor->copy()->addMinutes($cfg['slot_duration'])->lte($end)) {
    //             if (!in_array($cursor->toIso8601String(), $reserved)) {
    //                 $slots[] = [
    //                     'starts_at' => $cursor->toIso8601String(),
    //                     'label'     => $cursor->translatedFormat('l j F à H\hi'), // ex. "mardi 5 août à 10h00"
    //                 ];
    //             }
    //             $cursor->addMinutes($cfg['slot_duration']);
    //         }
    //     }

    //     return response()->json(['slots' => $slots]);
    // }

    /**
     * POST /diagnostics/{id}/appointment
     */
    public function store(Request $request, string $diagnosticRunId): JsonResponse
    {
        $validated = $request->validate([
            'requested_starts_at' => ['required', 'date', 'after:now'],
            'main_question'       => ['nullable', 'string', 'max:500'],
            'email'               => ['nullable', 'string', 'max:255'],
        ]);

        $run = DiagnosticRun::with('scoringResult')->findOrFail($diagnosticRunId);
        // abort_if($run->completion_status !== 'completed', 422, 'Diagnostic non terminé.');

        // Un seul RDV actif par diagnostic
        // $exists = Appointment::where('diagnostic_run_id', $run->id)
        //     ->whereIn('status', ['requested', 'confirmed'])
        //     ->exists();
        // abort_if($exists, 409, 'Un rendez-vous est déjà en cours pour ce diagnostic.');

        $suggestion = self::RDV_BY_MODULE[$run->module_code] ?? self::RDV_BY_MODULE['FLH-01'];
        $urgent = $run->scoringResult?->critical_red_flag_present || $run->module_code === 'DIF-03';

        $appointment = Appointment::create([
            'diagnostic_run_id'   => $run->diagnostic_run_id,
            'user_id'             => $run->user_id,
            'email'               => $validated['email'] ?? $run->user->email ?? 'nicktep519@gmail.com',
            'rdv_type'            => $suggestion['type'],
            'priority'            => $urgent ? 'urgent' : 'normal',
            'requested_starts_at' => $validated['requested_starts_at'],
            'main_question'       => $validated['main_question'] ?? null,
        ]);

        // Mail accusé de réception (si email fourni)
        if (isset($validated['email'])) {
            Mail::to($validated['email'])
                ->send(new AppointmentRequestReceivedMail($appointment));
        }

        return response()->json([
            'message'     => 'Votre demande de rendez-vous a bien été enregistrée. Un conseiller vous recontactera pour confirmer.',
            'appointment' => $appointment,
        ], 201);
    }

    /**
     * Les détails d'un RDV
     */
    public function show(string $appointmentId): JsonResponse
    {
        return response()->json(Appointment::findOrFail($appointmentId));
    }

    /**
     * Annulé un RDV
     */
    public function cancel(string $appointmentId): JsonResponse
    {
        $appointment = Appointment::findOrFail($appointmentId);
        abort_unless(in_array($appointment->status, ['requested', 'confirmed']), 422, 'Annulation impossible.');

        $appointment->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Rendez-vous annulé.']);
    }
}
