<!-- SHARED FOOTER COMPONENT (4 COLUMNS WITH VERTICAL SEPARATOR BARS) -->
<div class="pdf-footer">
    <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
        <tr>
            <!-- Col 1: Website with Globe SVG Icon -->
            <td style="width: 26%; font-size: 9.5px; font-weight: 800; color: #001a3f; vertical-align: middle;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00696b" stroke-width="2.5"
                    style="vertical-align: -1px; margin-right: 4px;">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path
                        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
                checkup.business-assist.io
            </td>

            <!-- Separator Bar 1 -->
            <td style="width: 2%; text-align: center; color: #c4c6cf; font-size: 11px; vertical-align: middle;">|</td>

            <!-- Col 2: Confidential Notice -->
            <td
                style="width: 23%; font-size: 9px; font-weight: 800; color: #ba1a1a; text-transform: uppercase; letter-spacing: 0.3px; vertical-align: middle; text-align: center;">
                STRICTEMENT CONFIDENTIEL
            </td>

            <!-- Separator Bar 2 -->
            <td style="width: 2%; text-align: center; color: #c4c6cf; font-size: 11px; vertical-align: middle;">|</td>

            <!-- Col 3: Generation Notice -->
            <td
                style="width: 32%; font-size: 8.5px; color: #74777f; vertical-align: middle; line-height: 1.25; text-align: center;">
                Document généré à partir des informations déclarées par l'utilisateur.
            </td>

            <!-- Separator Bar 3 -->
            <td style="width: 2%; text-align: center; color: #c4c6cf; font-size: 11px; vertical-align: middle;">|</td>

            <!-- Col 4: Page Counter -->
            <td
                style="width: 13%; text-align: right; font-size: 9.5px; font-weight: 800; color: #001a3f; text-transform: uppercase; vertical-align: middle;">
                PAGE {{ $page ?? '1' }} SUR 3
            </td>
        </tr>
    </table>
</div>
