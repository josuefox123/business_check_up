<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nouveau message de contact</title>
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
                                        Page de contact
                                    </td>
                                </tr>
                                <tr>
                                    <td style="color:#FFFFFF; font-size:22px; font-weight:bold; line-height:1.4;">
                                        Nouveau message reçu ✉️
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- INFOS EXPÉDITEUR -->
                    <tr>
                        <td style="padding:28px 32px 8px 32px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                                style="background-color:#EAF9FB; border-radius:8px; border-left:4px solid #34BED5;">
                                <tr>
                                    <td style="padding:20px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td width="120"
                                                    style="color:#3A4753; font-size:14px; padding:4px 0;">
                                                    <strong>Nom</strong>
                                                </td>
                                                <td style="color:#17212D; font-size:14px; padding:4px 0;">
                                                    {{ $fullName }}</td>
                                            </tr>
                                            <tr>
                                                <td style="color:#3A4753; font-size:14px; padding:4px 0;">
                                                    <strong>Email</strong>
                                                </td>
                                                <td style="padding:4px 0;">
                                                    <a href="mailto:{{ $fromEmail }}"
                                                        style="color:#34BED5; font-size:14px; font-weight:bold; text-decoration:none;">{{ $fromEmail }}</a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="color:#3A4753; font-size:14px; padding:4px 0;">
                                                    <strong>Objet</strong>
                                                </td>
                                                <td style="color:#17212D; font-size:14px; padding:4px 0;">
                                                    {{ $subjectLine }}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- MESSAGE -->
                    <tr>
                        <td style="padding:16px 32px 28px 32px;">
                            <p
                                style="margin:0 0 12px 0; color:#17212D; font-size:15px; font-weight:bold; border-bottom:2px solid #34BED5; display:inline-block; padding-bottom:4px;">
                                Message
                            </p>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                                style="background-color:#F7F8FA; border-radius:8px;">
                                <tr>
                                    <td style="padding:20px; color:#3A4753; font-size:14px; line-height:1.7;">
                                        {!! nl2br(e($messageBody)) !!}
                                    </td>
                                </tr>
                            </table>
                            <p style="margin:16px 0 0 0; color:#8A94A0; font-size:12px; line-height:1.6;">
                                💡 Pour répondre, utilisez simplement la fonction « Répondre » de votre messagerie :
                                votre réponse ira directement à <strong>{{ $fromEmail }}</strong>.
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
                                Message envoyé depuis la page de contact de la plateforme Business Check-up.
                            </p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>
