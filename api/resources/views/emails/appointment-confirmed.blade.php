<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rendez-vous confirmé</title>
</head>

<body style="margin:0; padding:0; background-color:#F4F6F8; font-family:Arial, Helvetica, sans-serif;">

    @php
        $modeLabel = match ($appointment->mode) {
            'visio' => 'En visioconférence',
            'phone' => 'Par téléphone',
            'in_person' => 'En présentiel',
            default => $appointment->mode,
        };
        $dateLabel = $appointment->confirmed_starts_at->translatedFormat('l j F Y \à H\hi');
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

                    <!-- BANDEAU DATE : bleu nuit -->
                    <tr>
                        <td style="background-color:#17212D; padding:28px 32px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td
                                        style="color:#34BED5; font-size:13px; letter-spacing:1px; text-transform:uppercase; padding-bottom:10px;">
                                        Rendez-vous confirmé
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span
                                            style="display:inline-block; background-color:#34BED5; color:#FFFFFF; font-size:20px; font-weight:bold; border-radius:10px; padding:12px 20px;">
                                            📅 {{ $dateLabel }}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="color:#B8C2CB; font-size:14px; padding-top:12px;">
                                        {{ $modeLabel }}
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
                                Bonne nouvelle : votre rendez-vous avec un conseiller
                                <strong style="color:#17212D;">CCI Bénin / FUND.lab</strong> est confirmé.
                                Retrouvez ci-dessous toutes les informations pratiques.
                            </p>
                        </td>
                    </tr>

                    <!-- ACCÈS AU RDV : visio / téléphone / présentiel -->
                    <tr>
                        <td style="padding:16px 32px;">
                            @if ($appointment->mode === 'visio' && $appointment->meeting_link)
                                <!-- Bouton visio -->
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td align="center" style="padding:8px 0 16px 0;">
                                            <table role="presentation" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td align="center"
                                                        style="background-color:#34BED5; border-radius:8px;">
                                                        <a href="{{ $appointment->meeting_link }}"
                                                            style="display:inline-block; padding:14px 32px; color:#FFFFFF; font-size:15px; font-weight:bold; text-decoration:none;">
                                                            🎥 Rejoindre la visioconférence
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" style="padding-bottom:8px;">
                                            <p style="margin:0; color:#8A94A0; font-size:12px;">
                                                Lien : <a href="{{ $appointment->meeting_link }}"
                                                    style="color:#34BED5;">{{ $appointment->meeting_link }}</a>
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            @elseif($appointment->mode === 'phone')
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                                    style="background-color:#EAF9FB; border-radius:8px; border-left:4px solid #34BED5;">
                                    <tr>
                                        <td style="padding:20px;">
                                            <p style="margin:0; color:#17212D; font-size:14px; line-height:1.6;">
                                                📞 <strong>Le conseiller vous appellera</strong> au numéro que vous avez
                                                indiqué :
                                                <strong>{{ $appointment->contact_value }}</strong>.<br>
                                                <span style="color:#3A4753;">Merci de garder votre téléphone à portée de
                                                    main à l'heure du rendez-vous.</span>
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            @elseif($appointment->mode === 'in_person' && $appointment->location)
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                                    style="background-color:#EAF9FB; border-radius:8px; border-left:4px solid #34BED5;">
                                    <tr>
                                        <td style="padding:20px;">
                                            <p style="margin:0; color:#17212D; font-size:14px; line-height:1.6;">
                                                📍 <strong>Lieu du rendez-vous :</strong><br>
                                                {{ $appointment->location }}
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            @endif
                        </td>
                    </tr>

                    <!-- QUESTION DE L'UTILISATEUR -->
                    @if ($appointment->main_question)
                        <tr>
                            <td style="padding:8px 32px;">
                                <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                                    style="background-color:#F7F8FA; border-radius:8px;">
                                    <tr>
                                        <td style="padding:16px 20px;">
                                            <p
                                                style="margin:0 0 6px 0; color:#17212D; font-size:13px; font-weight:bold;">
                                                Votre question pour le conseiller :</p>
                                            <p
                                                style="margin:0; color:#3A4753; font-size:14px; line-height:1.5; font-style:italic;">
                                                « {{ $appointment->main_question }} »</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    @endif

                    <!-- PRÉPARATION -->
                    <tr>
                        <td style="padding:16px 32px 28px 32px;">
                            <p
                                style="margin:0 0 12px 0; color:#17212D; font-size:15px; font-weight:bold; border-bottom:2px solid #34BED5; display:inline-block; padding-bottom:4px;">
                                Comment préparer votre entretien
                            </p>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding:6px 0; color:#3A4753; font-size:14px; line-height:1.6;">
                                        <span style="color:#34BED5; font-weight:bold;">1.</span>&nbsp; Gardez votre
                                        <strong style="color:#17212D;">rapport de diagnostic</strong> à portée de main.
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:6px 0; color:#3A4753; font-size:14px; line-height:1.6;">
                                        <span style="color:#34BED5; font-weight:bold;">2.</span>&nbsp; Rassemblez vos
                                        supports de suivi si vous en avez : <strong style="color:#17212D;">cahier de
                                            ventes, relevés Mobile Money, factures, Excel</strong> — même informels, ils
                                        sont utiles.
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:6px 0; color:#3A4753; font-size:14px; line-height:1.6;">
                                        <span style="color:#34BED5; font-weight:bold;">3.</span>&nbsp; Notez les
                                        questions que vous souhaitez absolument poser au conseiller.
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- DISCLAIMER -->
                    <tr>
                        <td style="padding:0 32px 28px 32px;">
                            <p style="margin:0; color:#8A94A0; font-size:12px; line-height:1.6; font-style:italic;">
                                Si vous ne pouvez pas honorer ce rendez-vous, merci de nous en informer dès que possible
                                afin de libérer le créneau pour un autre entrepreneur.
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
                                Vous recevez cet email suite à la confirmation de votre rendez-vous sur la plateforme
                                Business Check-up.
                            </p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>
