<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demande de rendez-vous reçue</title>
</head>

<body style="margin:0; padding:0; background-color:#F4F6F8; font-family:Arial, Helvetica, sans-serif;">

    @php
        $modeLabel = match ($appointment->mode) {
            'visio' => 'En visioconférence',
            'phone' => 'Par téléphone',
            'in_person' => 'En présentiel',
            default => $appointment->mode,
        };
        $dateLabel = $appointment->requested_starts_at->translatedFormat('l j F Y \à H\hi');
    @endphp

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
        style="background-color:#F4F6F8; padding:24px 12px;">
        <tr>
            <td align="center">

                <table role="presentation" width="600" cellpadding="0" cellspacing="0"
                    style="max-width:600px; width:100%; background-color:#FFFFFF; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(23,33,45,0.08);">

                    <!-- HEADER : logo -->
                    <tr>
                        <td align="center" style="background-color:#FFFFFF; padding:32px 24px 24px 24px;">
                            <img src="{{ $message->embed(public_path('images/logo_compact.png')) }}"
                                alt="Business Check-up — Powered by FUND.lab" width="280"
                                style="display:block; width:280px; max-width:80%; height:auto;">
                        </td>
                    </tr>

                    <!-- BANDEAU : bleu nuit -->
                    <tr>
                        <td style="background-color:#17212D; padding:28px 32px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td
                                        style="color:#34BED5; font-size:13px; letter-spacing:1px; text-transform:uppercase; padding-bottom:8px;">
                                        Demande de rendez-vous
                                    </td>
                                </tr>
                                <tr>
                                    <td style="color:#FFFFFF; font-size:22px; font-weight:bold; line-height:1.4;">
                                        Votre demande est bien enregistrée ✅
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- CORPS -->
                    <tr>
                        <td style="padding:32px 32px 8px 32px;">
                            <p style="margin:0 0 16px 0; color:#17212D; font-size:16px; line-height:1.6;">
                                Bonjour,
                            </p>
                            <p style="margin:0 0 16px 0; color:#3A4753; font-size:15px; line-height:1.6;">
                                Nous avons bien reçu votre demande de rendez-vous avec un conseiller
                                <strong style="color:#17212D;">CCI Bénin / FUND.lab</strong> pour approfondir
                                votre diagnostic <strong style="color:#17212D;">Business Check-up</strong>.
                            </p>
                        </td>
                    </tr>

                    <!-- RÉCAPITULATIF DE LA DEMANDE -->
                    <tr>
                        <td style="padding:16px 32px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                                style="background-color:#EAF9FB; border-radius:8px; border-left:4px solid #34BED5;">
                                <tr>
                                    <td style="padding:20px;">
                                        <p style="margin:0 0 12px 0; color:#17212D; font-size:14px; font-weight:bold;">
                                            📋 Récapitulatif de votre demande</p>
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="color:#3A4753; font-size:14px; padding:4px 0;"
                                                    width="130"><strong>Date souhaitée</strong></td>
                                                <td style="color:#17212D; font-size:14px; padding:4px 0;">
                                                    {{ $dateLabel }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color:#3A4753; font-size:14px; padding:4px 0;">
                                                    <strong>Modalité</strong>
                                                </td>
                                                <td style="color:#17212D; font-size:14px; padding:4px 0;">
                                                    {{ $modeLabel }}</td>
                                            </tr>
                                            @if ($appointment->main_question)
                                                <tr>
                                                    <td valign="top"
                                                        style="color:#3A4753; font-size:14px; padding:4px 0;">
                                                        <strong>Votre question</strong>
                                                    </td>
                                                    <td
                                                        style="color:#17212D; font-size:14px; padding:4px 0; line-height:1.5;">
                                                        « {{ $appointment->main_question }} »</td>
                                                </tr>
                                            @endif
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- PROCHAINE ÉTAPE -->
                    <tr>
                        <td style="padding:16px 32px 28px 32px;">
                            <p
                                style="margin:0 0 12px 0; color:#17212D; font-size:15px; font-weight:bold; border-bottom:2px solid #34BED5; display:inline-block; padding-bottom:4px;">
                                Prochaine étape
                            </p>
                            <p style="margin:0 0 12px 0; color:#3A4753; font-size:14px; line-height:1.6;">
                                Un conseiller examine votre demande et vous recontactera pour
                                <strong style="color:#17212D;">confirmer le créneau</strong>.
                                Vous recevrez un email de confirmation dès que le rendez-vous sera validé.
                            </p>
                            <p style="margin:0; color:#3A4753; font-size:14px; line-height:1.6;">
                                💡 En attendant, conservez votre <strong style="color:#17212D;">rapport de
                                    diagnostic</strong> :
                                il servira de base à l'échange avec le conseiller.
                            </p>
                        </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                        <td style="background-color:#17212D; padding:24px 32px;" align="center">
                            <p style="margin:0 0 6px 0; color:#34BED5; font-size:14px; font-weight:bold;">
                                Business Check-up
                            </p>
                            <p style="margin:0 0 10px 0; color:#B8C2CB; font-size:12px;">
                                Powered by <span style="color:#34BED5; font-weight:bold;">FUND.lab</span> · En
                                partenariat avec la CCI Bénin
                            </p>
                            <p style="margin:0; color:#6E7A88; font-size:11px; line-height:1.6;">
                                Vous recevez cet email suite à votre demande de rendez-vous sur la plateforme Business
                                Check-up.
                            </p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>
