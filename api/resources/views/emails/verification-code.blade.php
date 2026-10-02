<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Votre code de vérification</title>
</head>

<body style="margin:0; padding:0; background-color:#F4F6F8; font-family:Arial, Helvetica, sans-serif;">

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
                                        Vérification de votre adresse email
                                    </td>
                                </tr>
                                <tr>
                                    <td style="color:#FFFFFF; font-size:22px; font-weight:bold; line-height:1.4;">
                                        Votre code de vérification 🔐
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- CORPS -->
                    <tr>
                        <td style="padding:32px 32px 8px 32px;">
                            <p style="margin:0 0 16px 0; color:#17212D; font-size:16px; line-height:1.6;">
                                Bonjour{{ $recipientName ? ' ' . $recipientName : '' }},
                            </p>
                            <p style="margin:0 0 16px 0; color:#3A4753; font-size:15px; line-height:1.6;">
                                Pour recevoir votre rapport de diagnostic <strong style="color:#17212D;">Business
                                    Check-up</strong>,
                                veuillez confirmer votre adresse email en saisissant le code ci-dessous sur la
                                plateforme.
                            </p>
                        </td>
                    </tr>

                    <!-- CODE -->
                    <tr>
                        <td align="center" style="padding:16px 32px 24px 32px;">
                            <table role="presentation" cellpadding="0" cellspacing="0"
                                style="background-color:#EAF9FB; border-radius:12px; border:2px dashed #34BED5;">
                                <tr>
                                    <td style="padding:20px 48px; text-align:center;">
                                        <span
                                            style="color:#17212D; font-size:38px; font-weight:bold; letter-spacing:10px; font-family:'Courier New', monospace;">
                                            {{ $code }}
                                        </span>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin:14px 0 0 0; color:#8A94A0; font-size:12px;">
                                Ce code expire dans <strong>{{ $expiresIn }} minutes</strong>.
                            </p>
                        </td>
                    </tr>

                    <!-- AVERTISSEMENT -->
                    <tr>
                        <td style="padding:0 32px 28px 32px;">
                            <p style="margin:0; color:#8A94A0; font-size:12px; line-height:1.6; font-style:italic;">
                                Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email :
                                aucune action ne sera effectuée sans la saisie du code.
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
                                Vous recevez cet email suite à une demande de vérification d'adresse sur la plateforme
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
