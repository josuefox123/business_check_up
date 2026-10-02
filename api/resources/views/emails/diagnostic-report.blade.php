<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Votre rapport Business Check-up</title>
</head>
<body style="margin:0; padding:0; background-color:#F4F6F8; font-family:Arial, Helvetica, sans-serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4F6F8; padding:24px 12px;">
<tr><td align="center">

  <!-- Conteneur principal -->
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#FFFFFF; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(23,33,45,0.08);">

    <!-- HEADER : logo -->
    <tr>
      <td align="center" style="background-color:#FFFFFF; padding:32px 24px 24px 24px;">
        <img src="{{ $message->embed(public_path('images/logo_compact.png')) }}"
             alt="Business Check-up — Powered by FUND.lab"
             width="280" style="display:block; width:280px; max-width:80%; height:auto;">
      </td>
    </tr>

    <!-- BANDEAU SCORE : bleu nuit -->
    <tr>
      <td style="background-color:#17212D; padding:32px 32px 28px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="color:#B8C2CB; font-size:13px; letter-spacing:1px; text-transform:uppercase; padding-bottom:8px;">
              {{ $run->module_name ?? 'Votre diagnostic' }}
            </td>
          </tr>
          <tr>
            <td>
              <span style="display:inline-block; background-color:{{ $band['color'] }}; color:#FFFFFF; font-size:34px; font-weight:bold; border-radius:10px; padding:10px 22px;">
                {{ $score }}<span style="font-size:18px; font-weight:normal;">/100</span>
              </span>
            </td>
          </tr>
          <tr>
            <td style="color:#FFFFFF; font-size:18px; font-weight:bold; padding-top:14px;">
              {{ $band['label'] }}
            </td>
          </tr>
          <tr>
            <td style="color:#B8C2CB; font-size:13px; padding-top:6px; line-height:1.5;">
              Lecture {{ $evidenceLabel }}.
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- SALUTATION + SYNTHÈSE -->
    <tr>
      <td style="padding:32px 32px 8px 32px;">
        <p style="margin:0 0 16px 0; color:#17212D; font-size:16px; line-height:1.6;">
          Bonjour{{ $recipientName ? ' ' . $recipientName : '' }},
        </p>
        <p style="margin:0 0 16px 0; color:#3A4753; font-size:15px; line-height:1.6;">
          Merci d'avoir réalisé votre diagnostic avec <strong style="color:#17212D;">Business&nbsp;Check-up</strong>.
          Vous trouverez en pièce jointe votre rapport complet. En voici l'essentiel&nbsp;:
        </p>
        @if($summary)
        <p style="margin:0 0 8px 0; color:#3A4753; font-size:15px; line-height:1.6;">
          {{ $summary }}
        </p>
        @endif
      </td>
    </tr>

    <!-- FORCES / FRAGILITÉS -->
    @if(count($strengths) || count($weaknesses))
    <tr>
      <td style="padding:16px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            @if(count($strengths))
            <td width="50%" valign="top" style="padding-right:8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#EAF9FB; border-radius:8px; border-left:4px solid #34BED5;">
                <tr><td style="padding:16px;">
                  <p style="margin:0 0 10px 0; color:#17212D; font-size:14px; font-weight:bold;">💪 Vos points d'appui</p>
                  @foreach(array_slice($strengths, 0, 3) as $s)
                  <p style="margin:0 0 6px 0; color:#3A4753; font-size:13px; line-height:1.5;">• {{ $s }}</p>
                  @endforeach
                </td></tr>
              </table>
            </td>
            @endif
            @if(count($weaknesses))
            <td width="50%" valign="top" style="padding-left:8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F8FA; border-radius:8px; border-left:4px solid #E67E22;">
                <tr><td style="padding:16px;">
                  <p style="margin:0 0 10px 0; color:#17212D; font-size:14px; font-weight:bold;">👀 Vos points de vigilance</p>
                  @foreach(array_slice($weaknesses, 0, 3) as $w)
                  <p style="margin:0 0 6px 0; color:#3A4753; font-size:13px; line-height:1.5;">• {{ $w }}</p>
                  @endforeach
                </td></tr>
              </table>
            </td>
            @endif
          </tr>
        </table>
      </td>
    </tr>
    @endif

    <!-- PRIORITÉS -->
    @if(count($priorities))
    <tr>
      <td style="padding:8px 32px 16px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-bottom:12px;">
              <p style="margin:0; color:#17212D; font-size:15px; font-weight:bold; border-bottom:2px solid #34BED5; display:inline-block; padding-bottom:4px;">
                Vos priorités d'action
              </p>
            </td>
          </tr>
          @foreach(array_slice($priorities, 0, 3) as $i => $p)
          <tr>
            <td style="padding:10px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td valign="top" width="32">
                    <span style="display:inline-block; width:26px; height:26px; background-color:#34BED5; color:#FFFFFF; font-size:14px; font-weight:bold; text-align:center; line-height:26px; border-radius:50%;">
                      {{ $i + 1 }}
                    </span>
                  </td>
                  <td style="color:#3A4753; font-size:14px; line-height:1.5; padding-left:4px;">
                    {{ $p }}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          @endforeach
        </table>
      </td>
    </tr>
    @endif

    <!-- RAPPEL PDF -->
    <tr>
      <td align="center" style="padding:8px 32px 28px 32px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="background-color:#17212D; border-radius:8px;">
          <tr>
            <td style="padding:14px 28px; color:#FFFFFF; font-size:14px; line-height:1.5; text-align:center;">
              📎 <strong>Votre rapport complet est en pièce jointe</strong><br>
              <span style="color:#B8C2CB; font-size:12px;">Conservez-le pour suivre votre progression et le partager avec un conseiller CCI Bénin ou FUND.lab.</span>
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
          Powered by <span style="color:#34BED5; font-weight:bold;">FUND.lab</span> · En partenariat avec la CCI Bénin
        </p>
        <p style="margin:0; color:#6E7A88; font-size:11px; line-height:1.6;">
          Vous recevez cet email parce que vous avez demandé l'envoi de votre rapport de diagnostic.<br>
          Vos données sont utilisées conformément à votre consentement.
        </p>
      </td>
    </tr>

  </table>

</td></tr>
</table>

</body>
</html>