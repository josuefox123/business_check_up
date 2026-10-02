<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prévisualisation du Rapport Business Check-up</title>
    <style>
        * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #d1d5db;
            color: #191c1d;
            font-size: 11px;
            line-height: 1.4;
        }

        /* Fixed Top Toolbar Header */
        .preview-toolbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 64px;
            background-color: #001a3f;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 1000;
        }

        .toolbar-title {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 15px;
            font-weight: bold;
        }

        .toolbar-actions {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 10px 18px;
            font-size: 13px;
            font-weight: bold;
            border-radius: 6px;
            text-decoration: none;
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            border: none;
        }

        .btn-pdf {
            background-color: #00bcd4;
            color: #001a3f;
        }

        .btn-pdf:hover {
            background-color: #00acc1;
            box-shadow: 0 2px 8px rgba(0, 188, 212, 0.4);
        }

        .btn-mail {
            background-color: #ffffff;
            color: #001a3f;
        }

        .btn-mail:hover {
            background-color: #edeeef;
        }

        /* Container for scrolling pages */
        .preview-container {
            margin-top: 84px;
            padding-bottom: 50px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 30px;
        }

        /* A4 Page Container representing exact A4 dimensions */
        .a4-page {
            width: 210mm;
            height: 297mm;
            padding: 12mm 15mm 15mm 15mm;
            position: relative;
            background: #ffffff;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            border-radius: 4px;
            box-sizing: border-box;
        }

        /* Shared Header CSS */
        .pdf-header {
            width: 100%;
            border-bottom: 1px solid #c4c6cf;
            padding-bottom: 10px;
            margin-bottom: 16px;
        }

        /* Shared Footer CSS */
        .pdf-footer {
            position: absolute;
            bottom: 10mm;
            left: 15mm;
            right: 15mm;
            border-top: 1px solid #e1e3e4;
            padding-top: 8px;
            font-size: 10px;
            color: #74777f;
        }

        /* Design System Heading & Accent Classes */
        .page-title {
            font-size: 22px;
            font-weight: 900;
            color: #001a3f;
            text-transform: uppercase;
            letter-spacing: -0.3px;
            margin: 0;
            line-height: 1.15;
        }

        .accent-bar {
            width: 36px;
            height: 4px;
            background-color: #00bcd4;
            border-radius: 2px;
            margin: 8px 0 10px 0;
        }

        .page-subtitle {
            font-size: 12px;
            color: #44474e;
            margin: 0 0 18px 0;
            font-style: italic;
        }

        .section-title {
            font-size: 13px;
            font-weight: 800;
            color: #001a3f;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 0 0 6px 0;
        }

        .section-subtitle {
            font-size: 11px;
            color: #74777f;
            font-style: italic;
            margin-bottom: 12px;
        }

        .card-box {
            background-color: #ffffff;
            border: 1px solid #e1e3e4;
            border-radius: 8px;
            padding: 14px 16px;
        }
    </style>
</head>
<body>

    <!-- Fixed Top Toolbar Header -->
    <header class="preview-toolbar">
        <div class="toolbar-title">
            <span>Prévisualisation Rapport Business Check-up (3 Pages)</span>
        </div>

        <div class="toolbar-actions">
            <a href="/test-send-email" class="btn btn-mail" onclick="return confirm('Envoyer le rapport par email de test ?');">
                ✉ Envoyer par Mail
            </a>
            <a href="/report/download-pdf" class="btn btn-pdf">
                📄 Générer / Télécharger le PDF
            </a>
        </div>
    </header>

    <!-- Main Container showcasing the 3 A4 Pages -->
    <main class="preview-container">

        <!-- PAGE 1: EXECUTIVE OVERVIEW -->
        <div class="a4-page">
            @include('template_mail.report1')
        </div>

        <!-- PAGE 2: DIAGNOSTIC MULTIDIMENSIONNEL & RADAR -->
        <div class="a4-page">
            @include('template_mail.report2')
        </div>

        <!-- PAGE 3: PLAN DE TRAVAIL PRIORITAIRE -->
        <div class="a4-page">
            @include('template_mail.report3')
        </div>

    </main>

</body>
</html>
