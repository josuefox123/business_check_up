@php
    $logoPath = public_path('images/logo_compact.png');
    $logoBase64 = file_exists($logoPath) ? 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath)) : '';
@endphp

<!-- BEGIN: Page Container -->
<div class="page-container">
    <!-- Header Table -->
    <table class="header-table" width="100%" cellspacing="0" cellpadding="0" style="border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 12px;">
        <tr>
            <td valign="bottom" align="left">
                @if($logoBase64)
                    <img src="{{ $logoBase64 }}" alt="Business Check-up" style="height: 24px; width: auto; display: block;">
                @else
                    <div style="font-size: 16px; font-weight: bold; color: #1f2937;">Business <span style="color: #0f2846;">Check-up</span></div>
                @endif
            </td>
            <td valign="bottom" align="right">
                <div style="font-size: 10px; font-weight: bold; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">RAPPORT AUGMENTÉ • DIAGNOSTIC DE DIFFICULTÉ</div>
            </td>
        </tr>
    </table>

    <!-- Main Content -->
    <div class="main-content">
        <!-- Section Title (Identique Page 02) -->
        <div class="section-title avoid-break">
            <table>
                <tbody>
                    <tr>
                        <td class="number-badge">02</td>
                        <td class="title-content">
                            <h2 class="title-subtitle">DECISION &amp; PASSAGE À L'ACTION</h2>
                            <h3 class="title-main">Ce qui compte maintenant</h3>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Central Arbitrage Card -->
        <div class="arbitrage-card">
            <h3>ARBITRAGE CENTRAL</h3>
            <h2 class="card-title text-white" style="color: #ffffff; font-size: 14px; font-weight: bold; margin-bottom: 6px;">{{ $arbitrage_title }}</h2>
            <p class="card-body-text" style="color: #d1d5db; font-size: 10.5px; line-height: 1.35; margin-bottom: 8px;">
                {{ $arbitrage_text }}
            </p>
            <div class="pill-container">
                @foreach($arbitrage_tags as $index => $tag)
                    @php
                        $pillClass = $index === 0 ? 'pill-teal' : ($index === 1 ? 'pill-yellow' : 'pill-navy');
                    @endphp
                    <span class="pill {{ $pillClass }}">{{ $tag }}</span>
                @endforeach
            </div>
        </div>

        <!-- Grid Layout: Priorities (65%) & Avoid Box (35%) -->
        <table class="table-grid" width="100%" cellspacing="10" cellpadding="0" style="margin-bottom: 10px;">
            <tr>
                <td width="65%" valign="top">
                    <div class="priorities-header">
                        <div style="color: #53b4c9; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">VOS {{ count($priorities) }} PRIORITÉS</div>
                        <div style="font-size: 13px; font-weight: bold; color: #111827; margin-bottom: 8px;">Plan d'action recommandé</div>
                        
                        <table width="100%" cellspacing="0" cellpadding="0">
                            @foreach($priorities as $priority)
                                <tr>
                                    <td width="30" valign="top" style="padding-bottom: 8px;">
                                        <table width="24" height="24" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td align="center" valign="middle" style="width: 24px; height: 24px; border-radius: 12px; background-color: #53b4c9; color: #ffffff; font-size: 11px; font-weight: bold; line-height: 1;">
                                                    {{ $priority['num'] ?? $loop->iteration }}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                    <td valign="top" style="padding-left: 6px; padding-bottom: 8px;">
                                        <div style="font-size: 11px; font-weight: bold; color: #152934; margin-bottom: 2px;">{{ $priority['title'] }}</div>
                                        <div style="font-size: 10px; color: #5a6b72; line-height: 1.25;">{{ $priority['subtitle'] }}</div>
                                    </td>
                                </tr>
                            @endforeach
                        </table>
                    </div>
                </td>
                <td width="35%" valign="top">
                    <div class="avoid-box">
                        <h3>À NE PAS FAIRE MAINTENANT</h3>
                        <h2>{{ $dont_do_title }}</h2>
                        <p>
                            {{ $dont_do_text }}
                        </p>
                    </div>
                </td>
            </tr>
        </table>

        <!-- Action Grid: Data to strengthen (50%) & Next Step (50%) -->
        <table class="table-grid" width="100%" cellspacing="10" cellpadding="0" style="margin-bottom: 10px;">
            <tr>
                <td width="50%" valign="top">
                    <div class="action-box box-bordered">
                        <h3>POUR DÉCIDER AVEC PLUS DE CONFIANCE</h3>
                        <h2>Données à renforcer</h2>
                        <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 6px;">
                            @foreach($priorities as $priority)
                                @if(!empty($priority['proofs']))
                                    <tr>
                                        <td width="18" valign="top" style="padding-bottom: 4px;">
                                            <div style="width: 12px; height: 12px; border: 1.5px solid #53b4c9; border-radius: 3px; background-color: #f0f9ff; margin-top: 1px;"></div>
                                        </td>
                                        <td valign="top" style="padding-bottom: 4px; font-size: 10px; color: #152934; line-height: 1.25;">
                                            {{ $priority['proofs'] }}
                                        </td>
                                    </tr>
                                @endif
                            @endforeach
                        </table>
                        <div class="check-footer">
                            Niveau de preuve : déclaratif <span class="check-footer-arrow">→</span> indice concret <span class="check-footer-arrow">→</span> document disponible <span class="check-footer-arrow">→</span> donnée vérifiable.
                        </div>
                    </div>
                </td>
                <td width="50%" valign="top">
                    <div class="action-box box-bg">
                        <h3>PROCHAINE ÉTAPE</h3>
                        <h2>{{ $next_step_title }}</h2>
                        <p class="next-step-p">
                            {{ $next_step_text }}
                        </p>
                    </div>
                </td>
            </tr>
        </table>

        <!-- Key Takeaway -->
        <div class="key-takeaway">
            <p>
                <strong>À retenir :</strong> {{ $takeaways_text }}
            </p>
        </div>

        <!-- Disclaimer -->
        <p class="disclaimer">
            Business Check-up produit une lecture indicative fondée sur les réponses et confirmations fournies par l'utilisateur. Il ne constitue ni un audit, ni une due diligence, ni une décision d'éligibilité à un financement. Les recommandations doivent être appréciées au regard de la situation réelle de l'entreprise et, lorsque nécessaire, approfondies avec un professionnel compétent.
        </p>
    </div>

    <!-- Footer -->
    <div class="footer-wrapper">
        <table class="footer-table" width="100%" cellspacing="0" cellpadding="0">
            <tr>
                <td class="footer-left" align="left">
                    Business Check-up - Powered by FUND.Lab
                </td>
                <td class="footer-right" align="right">
                    03
                </td>
            </tr>
        </table>
    </div>
</div>
