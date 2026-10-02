<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Votre rapport de diagnostic Business Check-up</title>
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
                                        {{ $moduleName ?? 'Votre diagnostic' }}
                                    </td>
                                </tr>
                                <tr>
                                    <td style="color:#FFFFFF; font-size:22px; font-weight:bold; line-height:1.4;">
                                        Votre rapport de diagnostic est prêt 📄
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- TEXTE DESCRIPTIF -->
                    <tr>
                        <td style="padding:32px 32px 8px 32px;">
                            <p style="margin:0 0 16px 0; color:#17212D; font-size:16px; line-height:1.6;">
                                Bonjour{{ $recipientName ? ' ' . $recipientName : '' }},
                            </p>
                            <p style="margin:0 0 16px 0; color:#3A4753; font-size:15px; line-height:1.6;">
                                Merci d'avoir réalisé votre diagnostic avec <strong style="color:#17212D;">Business
                                    Check-up</strong>{{ $businessName ? ' pour ' . $businessName : '' }}.
                                Vous trouverez en pièce jointe votre <strong style="color:#17212D;">rapport complet de 3
                                    pages</strong>,
                                établi à partir de vos réponses.
                            </p>
                            <p style="margin:0 0 8px 0; color:#17212D; font-size:15px; font-weight:bold;">Ce que
                                contient votre rapport :</p>
                        </td>
                    </tr>

                    <!-- CONTENU DU RAPPORT : les 3 pages -->
                    <tr>
                        <td style="padding:8px 32px 16px 32px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding:10px 0; border-bottom:1px solid #EEF1F4;">
                                        <table role="presentation" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td valign="top" width="36">
                                                    <span
                                                        style="display:inline-block; width:26px; height:26px; background-color:#17212D; color:#FFFFFF; font-size:13px; font-weight:bold; text-align:center; line-height:26px; border-radius:6px;">1</span>
                                                </td>
                                                <td style="padding-left:6px;">
                                                    <p
                                                        style="margin:0; color:#17212D; font-size:14px; font-weight:bold;">
                                                        Votre situation en bref</p>
                                                    <p
                                                        style="margin:2px 0 0 0; color:#3A4753; font-size:13px; line-height:1.5;">
                                                        Votre score indicatif, votre niveau de preuve, la lecture
                                                        générale de votre situation et vos 3 priorités immédiates.</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 0; border-bottom:1px solid #EEF1F4;">
                                        <table role="presentation" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td valign="top" width="36">
                                                    <span
                                                        style="display:inline-block; width:26px; height:26px; background-color:#17212D; color:#FFFFFF; font-size:13px; font-weight:bold; text-align:center; line-height:26px; border-radius:6px;">2</span>
                                                </td>
                                                <td style="padding-left:6px;">
                                                    <p
                                                        style="margin:0; color:#17212D; font-size:14px; font-weight:bold;">
                                                        Ce que révèle votre diagnostic</p>
                                                    <p
                                                        style="margin:2px 0 0 0; color:#3A4753; font-size:13px; line-height:1.5;">
                                                        L'analyse par axe de votre entreprise, vos points d'appui, vos
                                                        points de vigilance et les facteurs qui influencent votre
                                                        performance.</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 0;">
                                        <table role="presentation" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td valign="top" width="36">
                                                    <span
                                                        style="display:inline-block; width:26px; height:26px; background-color:#17212D; color:#FFFFFF; font-size:13px; font-weight:bold; text-align:center; line-height:26px; border-radius:6px;">3</span>
                                                </td>
                                                <td style="padding-left:6px;">
                                                    <p
                                                        style="margin:0; color:#17212D; font-size:14px; font-weight:bold;">
                                                        Votre plan de travail prioritaire</p>
                                                    <p
                                                        style="margin:2px 0 0 0; color:#3A4753; font-size:13px; line-height:1.5;">
                                                        Des actions concrètes classées par ordre de priorité, avec les
                                                        données et preuves à préparer pour avancer.</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- RAPPEL PDF -->
                    <tr>
                        <td align="center" style="padding:8px 32px 28px 32px;">
                            <table role="presentation" cellpadding="0" cellspacing="0"
                                style="background-color:#EAF9FB; border-radius:8px; border-left:4px solid #34BED5;"
                                width="100%">
                                <tr>
                                    <td style="padding:16px 24px; color:#17212D; font-size:14px; line-height:1.6;">
                                        📎 <strong>Votre rapport est en pièce jointe de cet email.</strong><br>
                                        <span style="color:#3A4753; font-size:13px;">Conservez-le : il vous servira de
                                            référence pour suivre votre progression, et de support si vous échangez avec
                                            un conseiller CCI Bénin ou FUND.lab.</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- DISCLAIMER -->
                    <tr>
                        <td style="padding:0 32px 28px 32px;">
                            <p style="margin:0; color:#8A94A0; font-size:12px; line-height:1.6; font-style:italic;">
                                Ce diagnostic est indicatif. Il ne remplace pas une analyse approfondie.
                                Les recommandations sont proposées à partir des informations renseignées.
                                Pour les situations complexes, un accompagnement personnalisé peut être nécessaire.
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
                                Vous recevez cet email parce que vous avez demandé l'envoi de votre rapport de
                                diagnostic.<br>
                                Document strictement confidentiel, généré à partir des informations déclarées.
                            </p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>
