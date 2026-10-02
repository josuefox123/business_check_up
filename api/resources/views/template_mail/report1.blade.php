@php
    $logoPath = public_path('images/logo_compact.png');
    $logoBase64 = file_exists($logoPath) ? 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath)) : '';
@endphp

<div class="page-container page-container-1">
    <!-- Decorative background element -->
    <div class="decorative-bg"></div>

    <!-- Header Table -->
    <table class="header-table" width="100%" cellspacing="0" cellpadding="0">
        <tr>
            <td valign="top" align="left">
                @if($logoBase64)
                    <img src="{{ $logoBase64 }}" alt="Business Check-up" style="height: 52px; width: auto; display: block;">
                @else
                    <div class="header-title">Business Check-up</div>
                    <div class="header-subtitle">POWERED BY FUND.LAB</div>
                @endif
            </td>
            <td valign="top" align="right">
                <div class="header-badge">BUSINESS CHECK-UP</div>
            </td>
        </tr>
    </table>

    <!-- Main Section with left indentation -->
    <div class="main-body">
        <div class="main-subtitle">RAPPORT AUGMENTÉ</div>
        <h1 class="main-title">{{ $module_libelle }}</h1>
        <p class="main-description">
            Une lecture synthétique et structurée de votre entreprise, de vos urgences de trésorerie et de vos priorités d'action
        </p>

        <div class="business-details">
            <p><span>Entreprise :</span> {{ $client_name }}</p>
            <p><span>Dirigeant :</span> {{ $contact_name }}</p>
            <p><span>Secteur :</span> {{ $sector }}</p>
            <p><span>Zone :</span> {{ $region }}</p>
        </div>
    </div>

    <!-- Status Cards Table -->
    <div class="status-cards-wrapper">
        <table class="status-cards-table" width="100%" cellspacing="16" cellpadding="0">
            <tr>
                <td width="50%" valign="top">
                    <div class="status-card">
                        <div class="status-card-label">CONFIANCE</div>
                        <div class="status-card-value">{{ $proof_level }}</div>
                    </div>
                </td>
                <td width="50%" valign="top">
                    <div class="status-card">
                        <div class="status-card-label">DATE</div>
                        <div class="status-card-value">{{ $date }}</div>
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <!-- Footer Table -->
    <div class="footer-wrapper footer-wrapper-page1">
        <table class="footer-table" width="100%" cellspacing="0" cellpadding="0">
            <tr>
                <td class="footer-left" align="left">
                    Document personnel - établi à partir des informations déclarées dans Business Check-up.
                </td>
                <td class="footer-right" align="right">
                    FUND.LAB • CCIB
                </td>
            </tr>
        </table>
    </div>
</div>
