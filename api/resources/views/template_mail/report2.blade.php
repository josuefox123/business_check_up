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
                <div style="font-size: 10px; font-weight: bold; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">RAPPORT AUGMENTÉ</div>
            </td>
        </tr>
    </table>

    <!-- BEGIN: Main Section Title -->
    <div class="section-title avoid-break">
        <table>
            <tbody>
                <tr>
                    <td class="number-badge">01</td>
                    <td class="title-content">
                        <h2 class="title-subtitle">Votre lecture en 1 minute</h2>
                        <h3 class="title-main">Ce que le diagnostic fait ressortir</h3>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <!-- END: Main Section Title -->

    <!-- BEGIN: Top Cards Row -->
    <div class="row-wrapper avoid-break">
        <table class="table-grid" width="100%" cellspacing="12" cellpadding="0">
            <tbody>
                <tr>
                    <td width="50%" valign="top">
                        <div class="card card-dark">
                            <div class="score-label">Votre lecture globale</div>
                            <div class="score-value">
                                <span class="score-number">{{ $global_score }}</span>
                                <span class="score-max">/100</span>
                            </div>
                            <p class="score-text card-body-text">
                                {{ $proof_description }}
                            </p>
                            <div class="badge">
                                Confiance : {{ $proof_level }}
                            </div>
                        </div>
                    </td>
                    <td width="50%" valign="top">
                        <div class="card card-light">
                            <h4 class="card-title">Ce que cela signifie</h4>
                            <p class="card-text card-body-text">
                                {{ $meaning_text }}
                            </p>
                            <div class="callout card-text-italic">
                                <span class="callout-bold">Priorité de lecture :</span> {{ $priority_callout }}
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <!-- END: Top Cards Row -->

    <!-- BEGIN: Detailed Reading Section -->
    <div class="detailed-reading avoid-break">
        <h4 class="detailed-reading-title card-title">Notre lecture de votre situation</h4>
        <p class="detailed-reading-text card-body-text">
            {{ $lecture_generale }}
        </p>
    </div>
    <!-- END: Detailed Reading Section -->

    <!-- BEGIN: Points Sections -->
    <div class="row-wrapper avoid-break">
        <table class="table-grid" width="100%" cellspacing="12" cellpadding="0">
            <tbody>
                <tr>
                    <td width="50%" valign="top">
                        <div class="card points-green">
                            <h4 class="points-title-green card-title">Points d'appui</h4>
                            <ul class="points-list">
                                @foreach($strengths as $strength)
                                    <li>
                                        <table width="100%" cellspacing="0" cellpadding="0">
                                            <tbody>
                                                <tr>
                                                    <td class="bullet-green" width="16" valign="top">•</td>
                                                    <td class="points-text card-body-text" valign="top">{{ $strength }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                    </td>
                    <td width="50%" valign="top">
                        <div class="card points-orange">
                            <h4 class="points-title-orange card-title">Points de vigilance</h4>
                            <ul class="points-list">
                                @foreach($vigilances as $vigilance)
                                    <li>
                                        <table width="100%" cellspacing="0" cellpadding="0">
                                            <tbody>
                                                <tr>
                                                    <td class="bullet-orange" width="16" valign="top">•</td>
                                                    <td class="points-text card-body-text" valign="top">{{ $vigilance }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <!-- END: Points Sections -->

    <!-- BEGIN: Bottom Metrics Row -->
    <div class="row-wrapper avoid-break">
        <table class="table-grid" width="100%" cellspacing="12" cellpadding="0">
            <tbody>
                <tr>
                    <td width="50%" valign="top">
                        <div class="card card-light">
                            <h4 class="card-title">Niveau de confiance de cette lecture</h4>
                            <p class="metrics-text card-body-text">
                                {{ $proof_description }}
                            </p>
                            <div class="badge badge-outline">
                                Confiance : {{ $proof_level }}
                            </div>
                        </div>
                    </td>
                    <td width="50%" valign="top">
                        <div class="card card-light">
                            <h4 class="card-title" style="margin-bottom: 16px;">Repères de lecture par axe</h4>
                            @foreach($scores_by_axis as $axis => $data)
                                <div class="axis-row">
                                    <table class="axis-table" width="100%" cellspacing="0" cellpadding="0">
                                        <tbody>
                                            <tr>
                                                <td class="axis-label card-body-text" width="50%" valign="middle">{{ $axis }}</td>
                                                <td class="axis-bar-container" width="35%" valign="middle">
                                                    <div class="axis-bar-bg">
                                                        <div class="axis-bar-fill" style="width: {{ $data['score'] }}%; background-color: {{ $data['color'] }};"></div>
                                                    </div>
                                                </td>
                                                <td class="axis-value" width="15%" align="right" valign="middle">{{ $data['score'] }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            @endforeach
                            <p class="metrics-note card-mini-text-italic">
                                Indices de lecture du module ; ils ne constituent ni une notation bancaire ni une décision d'éligibilité.
                            </p>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <!-- END: Bottom Metrics Row -->

    <!-- BEGIN: Footer -->
    <div class="footer avoid-break">
        <table>
            <tbody>
                <tr>
                    <td class="footer-left">Business Check-up - Powered by FUND.Lab</td>
                    <td class="footer-right">02</td>
                </tr>
            </tbody>
        </table>
    </div>
    <!-- END: Footer -->
</div>
<!-- END: Page Container -->
