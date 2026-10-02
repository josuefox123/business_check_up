<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business Check-up - Rapport complet (3 pages)</title>
    <style>
        @font-face {
            font-family: 'Lato';
            font-style: normal;
            font-weight: normal;
            src: url("{{ str_replace('\\', '/', public_path('fonts/lato/Lato-Regular.ttf')) }}") format('truetype');
        }
        @font-face {
            font-family: 'Lato';
            font-style: normal;
            font-weight: bold;
            src: url("{{ str_replace('\\', '/', public_path('fonts/lato/Lato-Bold.ttf')) }}") format('truetype');
        }
        @font-face {
            font-family: 'Lato';
            font-style: normal;
            font-weight: 700;
            src: url("{{ str_replace('\\', '/', public_path('fonts/lato/Lato-Bold.ttf')) }}") format('truetype');
        }
        @font-face {
            font-family: 'Lato';
            font-style: normal;
            font-weight: 800;
            src: url("{{ str_replace('\\', '/', public_path('fonts/lato/Lato-Bold.ttf')) }}") format('truetype');
        }
        @font-face {
            font-family: 'Lato';
            font-style: normal;
            font-weight: 900;
            src: url("{{ str_replace('\\', '/', public_path('fonts/lato/Lato-Bold.ttf')) }}") format('truetype');
        }
        @font-face {
            font-family: 'Lato';
            font-style: italic;
            font-weight: normal;
            src: url("{{ str_replace('\\', '/', public_path('fonts/lato/Lato-Italic.ttf')) }}") format('truetype');
        }
        @font-face {
            font-family: 'Lato';
            font-style: italic;
            font-weight: bold;
            src: url("{{ str_replace('\\', '/', public_path('fonts/lato/Lato-BoldItalic.ttf')) }}") format('truetype');
        }

        /* Application Universelle de la police Lato */
        *, body, table, td, th, div, p, span, h1, h2, h3, h4, li, ul, a, header, footer {
            font-family: 'Lato', Arial, sans-serif !important;
        }

        /* Base Styles */
        body {
            font-family: 'Lato', Arial, sans-serif;
            background-color: #ffffff;
            color: #1f2937;
            margin: 0;
            padding: 0;
        }

        .page-container {
            width: 100%;
            position: relative;
        }

        .decorative-bg {
            position: absolute;
            top: -10mm;
            right: -12mm;
            width: 220px;
            height: 180px;
            background-color: #f0f9ff;
            border-bottom-left-radius: 100px;
            opacity: 0.5;
            z-index: -1;
        }

        .header-table {
            margin-bottom: 32px;
            width: 100%;
        }

        .header-title {
            font-size: 26px;
            font-weight: 700;
            color: #111827;
            margin: 0;
            text-align: left !important;
        }

        .header-subtitle {
            font-size: 12px;
            font-weight: 700;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-top: 4px;
            text-align: left !important;
            display: block;
        }

        .header-badge {
            display: inline-block;
            background-color: #ffedd5;
            color: #ea580c;
            font-size: 11px;
            font-weight: 700;
            padding: 6px 16px;
            border-radius: 9999px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .main-body {
            position: relative;
            padding-left: 24px;
            margin-top: 40px;
            margin-bottom: 40px;
        }

        .main-subtitle {
            color: #38bdf8;
            font-size: 15px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            margin-bottom: 12px;
        }

        .main-title {
            font-size: 44px;
            font-weight: 700;
            color: #0f2846;
            margin-bottom: 24px;
            line-height: 1.15;
        }

        .main-description {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 36px;
            line-height: 1.55;
            max-width: 540px;
        }

        .business-details {
            color: #1f2937;
            font-size: 14px;
            line-height: 1.7;
        }

        .business-details p {
            margin: 0 0 6px 0;
        }

        .business-details span {
            font-weight: 700;
        }

        .status-cards-wrapper {
            margin-top: 220px;
            margin-bottom: 24px;
        }

        .status-cards-table {
            width: 100%;
        }

        .status-card {
            background-color: #f8fafc;
            border-top: 2px solid #38bdf8;
            padding: 16px 20px;
            border-radius: 4px;
        }

        .status-card-label {
            font-size: 11px;
            font-weight: 700;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 6px;
        }

        .status-card-value {
            font-size: 18px;
            font-weight: 700;
            color: #111827;
        }

        .footer-wrapper {
            margin-top: 24px;
        }

        .footer-table {
            width: 100%;
            border-top: 1px solid #d1d5db;
            padding-top: 12px;
            font-size: 11px;
            color: #6b7280;
        }

        .footer-left {
            color: #6b7280;
        }

        .footer-right {
            font-weight: 700;
            color: #374151;
        }

        /* Styles Page 2 */
        *, *:before, *:after {
            box-sizing: inherit;
        }

        h1, h2, h3, h4, p, ul, li {
            margin: 0;
            padding: 0;
        }

        .avoid-break {
            page-break-inside: avoid;
        }

        /* Header */
        .header {
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 4px;
            margin-bottom: 12px;
            font-family: 'Lato', Arial, sans-serif !important;
        }
        .header table {
            width: 100%;
        }
        .header td {
            vertical-align: bottom;
            font-family: 'Lato', Arial, sans-serif !important;
        }
        .header-left {
            font-size: 16px;
            font-weight: 700;
            color: #1f2937;
            font-family: 'Lato', Arial, sans-serif !important;
        }
        .header-title {
            font-size: 16px;
            font-weight: 700;
            color: #1f2937;
            font-family: 'Lato', Arial, sans-serif !important;
        }
        .header-subtitle {
            font-size: 10px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            text-align: right;
            font-weight: 700;
            font-family: 'Lato', Arial, sans-serif !important;
        }

        /* Section Title */
        .section-title {
            margin-bottom: 12px;
        }
        .section-title table {
            width: 100%;
        }
        .section-title td {
            vertical-align: top;
        }
        .number-badge {
            background-color: #1a2634;
            color: #ffffff;
            font-size: 18px;
            font-weight: 700;
            padding: 6px 12px;
            border-radius: 8px;
            width: 1%;
            white-space: nowrap;
            font-family: 'Lato', Arial, sans-serif !important;
        }
        .title-content {
            padding-left: 12px;
        }
        .title-subtitle {
            color: #148f99;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 2px;
            font-family: 'Lato', Arial, sans-serif !important;
        }
        .title-main {
            font-size: 22px;
            font-weight: 700;
            color: #111827;
            line-height: 1.2;
            font-family: 'Lato', Arial, sans-serif !important;
        }

        /* Cards */
        .card {
            border-radius: 8px;
            padding: 10px 12px;
            font-family: 'Lato', Arial, sans-serif !important;
        }
        .card-dark {
            background-color: #1a2634;
            color: #ffffff;
            font-family: 'Lato', Arial, sans-serif !important;
        }
        .card-light {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            font-family: 'Lato', Arial, sans-serif !important;
        }

        .score-label {
            font-size: 12px;
            margin-bottom: 4px;
            font-weight: 700;
            font-family: 'Lato', Arial, sans-serif !important;
        }
        .score-value {
            margin-bottom: 8px;
            font-family: 'Lato', Arial, sans-serif !important;
        }
        .score-number {
            font-size: 42px;
            font-weight: 700;
            color: #148f99;
            line-height: 1;
            font-family: 'Lato', Arial, sans-serif !important;
        }
        .score-max {
            font-size: 16px;
            font-weight: 700;
            font-family: 'Lato', Arial, sans-serif !important;
        }
        .score-text {
            font-size: 10.5px;
            font-weight: normal;
            line-height: 1.35;
            margin-bottom: 10px;
            font-family: 'Lato', Arial, sans-serif !important;
        }
        .badge {
            display: inline-block;
            background-color: #ffffff;
            color: #148f99;
            font-size: 10px;
            font-weight: 700;
            padding: 3px 10px;
            border-radius: 9999px;
        }
        .badge-outline {
            background-color: #e6f6f7;
            color: #148f99;
            border: 1px solid #148f99;
        }

        .card-title {
            font-weight: 700;
            color: #111827;
            margin-bottom: 8px;
            font-size: 13px;
        }
        .card-text {
            font-size: 10.5px;
            color: #374151;
            line-height: 1.35;
            margin-bottom: 10px;
        }
        .callout {
            border-left: 3px solid #148f99;
            padding: 8px 10px;
            font-size: 10.5px;
            line-height: 1.3;
            color: #1f2937;
            background-color: #ffffff;
            border-radius: 0 6px 6px 0;
        }
        .callout-bold {
            font-weight: 700;
        }

        /* Detailed Reading */
        .detailed-reading {
            background-color: #e6f6f7;
            border: 1px solid #148f99;
            border-radius: 8px;
            padding: 10px 14px;
            margin-bottom: 10px;
        }
        .detailed-reading-title {
            font-weight: 700;
            color: #111827;
            margin-bottom: 6px;
            font-size: 13px;
        }
        .detailed-reading-text {
            font-size: 10.5px;
            color: #1f2937;
            line-height: 1.32;
            text-align: left;
        }

        /* Points Sections */
        .points-green {
            background-color: #effaf4;
            border: 1px solid #a7e0c4;
        }
        .points-orange {
            background-color: #fcf8f2;
            border: 1px solid #f1d5b3;
        }
        .points-title-green {
            font-weight: 700;
            color: #2d8259;
            font-size: 14px;
            margin-bottom: 8px;
        }
        .points-title-orange {
            font-weight: 700;
            color: #b87a2a;
            font-size: 14px;
            margin-bottom: 8px;
        }
        .points-list {
            list-style-type: none;
        }
        .points-list li {
            margin-bottom: 4px;
        }
        .points-list table {
            width: 100%;
        }
        .points-list td {
            vertical-align: top;
        }
        .bullet-green {
            color: #2d8259;
            font-size: 14px;
            line-height: 1;
            width: 16px;
        }
        .bullet-orange {
            color: #b87a2a;
            font-size: 14px;
            line-height: 1;
            width: 16px;
        }
        .points-text {
            font-size: 10.5px;
            line-height: 1.3;
            color: #1f2937;
        }

        /* Bottom Metrics */
        .metrics-text {
            font-size: 12px;
            color: #374151;
            line-height: 1.625;
            margin-bottom: 16px;
        }
        .axis-row {
            margin-bottom: 12px;
        }
        .axis-table {
            width: 100%;
            font-size: 14px;
        }
        .axis-label {
            color: #1f2937;
            width: 50%;
        }
        .axis-bar-container {
            width: 33%;
            padding-right: 12px;
        }
        .axis-bar-bg {
            background-color: #e5e7eb;
            border-radius: 9999px;
            height: 12px;
            width: 100%;
        }
        .axis-bar-fill {
            background-color: #148f99;
            height: 12px;
            border-radius: 9999px;
        }
        .axis-value {
            font-weight: 700;
            color: #111827;
            text-align: right;
            width: 32px;
        }
        .metrics-note {
            font-size: 10px;
            color: #6b7280;
            font-style: italic;
            line-height: 1.25;
            margin-top: 16px;
        }

        /* Footer */
        .footer {
            border-top: 1px solid #e2e8f0;
            padding-top: 16px;
            font-size: 12px;
            color: #6b7280;
            margin-top: 32px;
        }
        .footer table {
            width: 100%;
        }
        .footer-left {
            text-align: left;
        }
        .footer-right {
            text-align: right;
        }

        /* Layout table container */
        .table-layout {
            display: table;
            width: 100%;
            table-layout: fixed;
            border-collapse: separate;
            border-spacing: 16px 0;
        }
        .table-cell {
            display: table-cell;
            vertical-align: top;
        }
        .col-wrapper {
            padding-left: 0;
            padding-right: 0;
            height: 100%;
        }
        .col-wrapper > .card,
        .col-wrapper > .points-green,
        .col-wrapper > .points-orange {
            height: 100%;
            box-sizing: border-box;
        }

        .row-wrapper {
            margin-bottom: 16px;
            width: 100%;
        }

        /* Page 3 Styles */
        .arbitrage-card {
            background-color: #152934;
            color: white;
            border-radius: 8px;
            padding: 10px 14px;
            margin-bottom: 10px;
        }
        .arbitrage-card h3 {
            color: #53b4c9;
            text-transform: uppercase;
            font-weight: 700;
            font-size: 10px;
            letter-spacing: 0.05em;
            margin-bottom: 4px;
        }
        .arbitrage-card h2 {
            margin-bottom: 6px;
            font-size: 13px;
            line-height: 1.2;
        }
        .arbitrage-card p {
            color: #d1d5db;
            margin-bottom: 8px;
            font-size: 10.5px;
            line-height: 1.3;
        }
        .pill {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 9999px;
            font-size: 10px;
            font-weight: 700;
            margin-right: 4px;
            margin-bottom: 4px;
        }
        .pill-teal { background-color: white; color: #53b4c9; }
        .pill-yellow { background-color: #fff7e5; color: #b37400; }
        .pill-navy { background-color: white; color: #152934; }

        /* Priorities & Avoid Grid */
        .grid-layout {
            display: table;
            width: 100%;
            table-layout: fixed;
            margin-bottom: 10px;
        }
        .col-2 {
            display: table-cell;
            width: 66.66%;
            padding-right: 12px;
            vertical-align: top;
        }
        .col-1 {
            display: table-cell;
            width: 33.33%;
            vertical-align: top;
        }
        .col-1 > .avoid-box {
            height: 100%;
            box-sizing: border-box;
        }

        /* Priorities List */
        .priorities-header h3 {
            color: #53b4c9;
            text-transform: uppercase;
            font-weight: 700;
            font-size: 10px;
            letter-spacing: 0.05em;
            margin-bottom: 2px;
        }
        .priorities-header h2 {
            font-size: 13px;
            font-weight: 700;
            margin-bottom: 6px;
        }
        .priority-item {
            display: table;
            width: 100%;
            margin-bottom: 6px;
        }
        .priority-item:last-child { margin-bottom: 0; }
        .priority-num {
            display: table-cell;
            width: 24px;
            vertical-align: top;
        }
        .priority-num-inner {
            background-color: #53b4c9;
            color: white;
            border-radius: 50%;
            width: 22px;
            height: 22px;
            text-align: center;
            line-height: 22px;
            font-weight: 700;
            font-size: 11px;
        }
        .priority-text {
            display: table-cell;
            padding-left: 8px;
            vertical-align: top;
        }
        .priority-text h4 {
            font-weight: 700;
            color: #152934;
            margin-bottom: 2px;
            font-size: 11px;
        }
        .priority-text p {
            color: #5a6b72;
            font-size: 10px;
            line-height: 1.25;
        }

        /* To Avoid Box */
        .avoid-box {
            background-color: #f4f9fb;
            border: 1px solid #d8eaf1;
            border-radius: 8px;
            padding: 10px 12px;
            box-sizing: border-box;
        }
        .avoid-box h3 {
            color: #53b4c9;
            text-transform: uppercase;
            font-weight: 700;
            font-size: 10px;
            letter-spacing: 0.05em;
            margin-bottom: 2px;
        }
        .avoid-box h2 {
            font-size: 12px;
            font-weight: 700;
            color: #152934;
            margin-bottom: 6px;
            line-height: 1.2;
        }
        .avoid-box p {
            color: #5a6b72;
            font-size: 10px;
            line-height: 1.25;
        }

        /* Action Blocks Grid */
        .action-grid {
            display: table;
            width: 100%;
            table-layout: fixed;
            margin-bottom: 10px;
        }
        .action-col {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }
        .action-col-left {
            padding-right: 6px;
        }
        .action-col-right {
            padding-left: 6px;
        }
        .action-col > .action-box {
            height: 100%;
            box-sizing: border-box;
        }

        .action-box {
            border-radius: 8px;
            padding: 10px 12px;
            box-sizing: border-box;
        }
        .box-bordered { border: 1px solid #d8eaf1; }
        .box-bg { background-color: #f4f9fb; border: 1px solid #d8eaf1; }

        .action-box h3 {
            color: #53b4c9;
            text-transform: uppercase;
            font-weight: 700;
            font-size: 10px;
            letter-spacing: 0.05em;
            margin-bottom: 2px;
        }
        .action-box h2 {
            font-size: 12px;
            font-weight: 700;
            margin-bottom: 6px;
        }

        /* Check List */
        .check-list { margin-bottom: 8px; }
        .check-item {
            display: table;
            width: 100%;
            margin-bottom: 4px;
        }
        .check-icon {
            display: table-cell;
            width: 14px;
            vertical-align: top;
            padding-top: 1px;
        }
        .check-icon-inner {
            width: 14px;
            height: 14px;
            border: 1px solid #53b4c9;
            border-radius: 3px;
        }
        .check-text {
            display: table-cell;
            padding-left: 6px;
            vertical-align: top;
            font-size: 10px;
            font-weight: normal;
            color: #152934;
            line-height: 1.25;
        }
        .check-footer {
            font-size: 9px;
            color: #6b7280;
        }
        .check-footer-arrow { margin: 0 2px; }

        .next-step-p {
            color: #5a6b72;
            font-size: 10px;
            line-height: 1.3;
        }

        /* Key Takeaway */
        .key-takeaway {
            background-color: #f3f4f6;
            padding: 8px 10px;
            border-left: 3px solid #9ca3af;
            margin-bottom: 8px;
            border-radius: 4px;
        }
        .key-takeaway p {
            font-size: 10px;
            font-weight: normal;
            color: #152934;
        }
        .key-takeaway strong { font-weight: 700; }

        /* Disclaimer */
        .disclaimer {
            font-size: 8.5px;
            color: #6b7280;
            text-align: justify;
            line-height: 1.2;
            margin-bottom: 8px;
        }

        .page-break {
            page-break-after: always;
            clear: both;
        }

        /* =============================================
           Surcharges Spécifiques PDF (DomPDF)
           ============================================= */
        @page {
            size: a4 portrait;
            margin: 12mm 16mm 14mm 16mm;
        }

        .is-pdf {
            background-color: #ffffff;
            font-size: 11px !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        /* Forcer la police Lato sur tous les éléments sous DomPDF */
        .is-pdf, 
        .is-pdf table, 
        .is-pdf td, 
        .is-pdf div, 
        .is-pdf p, 
        .is-pdf span, 
        .is-pdf h1, 
        .is-pdf h2, 
        .is-pdf h3, 
        .is-pdf h4, 
        .is-pdf li, 
        .is-pdf ul {
            font-family: 'Lato', Arial, sans-serif !important;
        }

        /* Annuler les contraintes de taille web sur .page-container et appliquer un padding aéré */
        .is-pdf .page-container {
            width: 100% !important;
            max-width: 100% !important;
            min-height: 0 !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: transparent !important;
            page-break-after: always !important;
            page-break-inside: avoid !important;
        }

        .is-pdf .page-container:last-child {
            page-break-after: avoid !important;
        }

        .is-pdf .page-container-1 {
            position: relative !important;
            height: 260mm !important;
        }

        .is-pdf .footer-wrapper-page1 {
            position: absolute !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            margin-top: 0 !important;
        }

        /* PAGE 2: Compression ultra-précise */
        .is-pdf .header { margin-bottom: 10px !important; padding-bottom: 4px !important; }
        .is-pdf .section-title { margin-bottom: 8px !important; }
        .is-pdf .title-main { font-size: 22px !important; }
        .is-pdf .card { padding: 10px 12px !important; border-radius: 8px !important; }
        .is-pdf .score-number { font-size: 42px !important; }
        .is-pdf .score-value { margin-bottom: 8px !important; }
        .is-pdf .score-text { margin-bottom: 10px !important; font-size: 11px !important; }
        .is-pdf .detailed-reading { margin-bottom: 8px !important; }
        .is-pdf .detailed-reading-title { margin-bottom: 6px !important; font-size: 13px !important; }
        .is-pdf .detailed-reading-text { font-size: 11px !important; line-height: 1.35 !important; }
        .is-pdf .row-wrapper { margin-bottom: 8px !important; }
        .is-pdf .points-title-green, .is-pdf .points-title-orange { font-size: 13px !important; margin-bottom: 6px !important; }
        .is-pdf .points-list li { margin-bottom: 4px !important; }
        .is-pdf .points-text { font-size: 11px !important; }
        .is-pdf .axis-row { margin-bottom: 6px !important; }
        .is-pdf .metrics-text { margin-bottom: 8px !important; font-size: 11px !important; }
        .is-pdf .footer { margin-top: 8px !important; padding-top: 8px !important; font-size: 10px !important; }

        /* PAGE 3: Compression ultra-précise */
        .is-pdf .arbitrage-card { padding: 12px !important; margin-bottom: 8px !important; border-radius: 8px !important; }
        .is-pdf .arbitrage-card p { font-size: 11px !important; line-height: 1.35 !important; margin-bottom: 10px !important; }
        .is-pdf .grid-layout { margin-bottom: 8px !important; }
        .is-pdf .action-grid { margin-bottom: 8px !important; }
        .is-pdf .priority-item { margin-bottom: 6px !important; }
        .is-pdf .avoid-box { padding: 10px 12px !important; }
        .is-pdf .action-box { padding: 10px 12px !important; }
        .is-pdf .key-takeaway { padding: 8px 10px !important; margin-bottom: 8px !important; }
        .is-pdf .disclaimer { margin-bottom: 8px !important; font-size: 9px !important; }
    </style>
</head>
<body class="is-pdf">

    <!-- Pure PDF Mode (DOMPDF Compatible — 3 Pages Stricte) -->
    @include('template_mail.report1')
    @include('template_mail.report2')
    @include('template_mail.report3')

</body>
</html>
