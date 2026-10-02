<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rendez-vous annulé</title>
</head>

<body style="margin:0; padding:0; background-color:#F4F6F8; font-family:Arial, Helvetica, sans-serif;">

    @php
        $dateLabel = ($appointment->confirmed_starts_at ?? $appointment->requested_starts_at)->translatedFormat(
            'l j F Y \à H\hi',
        );
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
                                        Rendez-vous annulé
                                    </td>
                                </tr>
                                <tr>
                                    <td style="color:#FFFFFF; font-size:22px; font-weight:bold; line-height:1.4;">
                                        Votre rendez-vous a été annulé
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
                                Nous vous informons que votre rendez-vous du
                                <strong style="color:#17212D;">{{ $dateLabel }}</strong>
                                avec un conseiller <strong style="color:#17212D;">CCI Bénin / FUND.lab</strong>
                                a été annulé.
                            </p>
                            <p style="margin:0 0 16px 0; color:#3A4753; font-size:15px; line-height:1.6;">
                                Pas d'inquiétude : votre <strong style="color:#17212D;">rapport de diagnostic reste
                                    disponible</strong>
                                et vous pouvez reprendre rendez-vous à tout moment depuis la plateforme
                                <strong style="color:#17212D;">Business Check-up</strong>.
                            </p>
                        </td>
                    </tr>

                    <!-- CTA REPRENDRE RDV -->
                    <tr>
                        <td align="center" style="padding:16px 32px 28px 32px;">
                            <table role="presentation" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="background-color:#34BED5; border-radius:8px;">
                                        <a href="{{ config('app.frontend_url') }}/diagnostics/{{ $appointment->diagnostic_run_id }}"
                                            style="display:inline-block; padding:14px 32px; color:#FFFFFF; font-size:15px; font-weight:bold; text-decoration:none;">
                                            Reprendre rendez-vous
                                        </a>
                                    </td>
                                </tr>
                            </table>
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
                                Vous recevez cet email suite à l'annulation de votre rendez-vous sur la plateforme
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
