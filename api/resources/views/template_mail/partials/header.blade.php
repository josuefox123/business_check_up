<!-- SHARED HEADER COMPONENT -->
<div class="pdf-header">
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="vertical-align: middle;">
                @php
                    $logoPath = public_path('images/logo_compact.png');
                    $logoBase64 = file_exists($logoPath)
                        ? 'data:image/png;base64,' . base64_encode(file_get_contents($logoPath))
                        : '';
                @endphp
                @if ($logoBase64)
                    <img src="{{ $logoBase64 }}" alt="Business Check-up"
                        style="height: 46px; width: auto; display: block;">
                @else
                    <div
                        style="font-size: 18px; font-weight: 800; color: #001a3f; letter-spacing: -0.5px; line-height: 1.1;">
                        Business Check-up
                    </div>
                    <div
                        style="font-size: 9px; font-weight: bold; color: #6f84ae; tracking: 0.5px; text-transform: uppercase; margin-top: 2px;">
                        POWERED BY FUND.LAB
                    </div>
                @endif
            </td>
            <td style="text-align: right; vertical-align: middle;">
                <span
                    style="font-size: 10px; font-weight: bold; color: #6f84ae; text-transform: uppercase; letter-spacing: 0.5px; margin-right: 10px;">
                    RAPPORT DE DIAGNOSTIC
                </span>
                <span
                    style="background-color: #001a3f; color: #ffffff; font-weight: 900; font-size: 13px; padding: 4px 10px; border-radius: 4px; display: inline-block;">
                    {{ $page ?? '01' }}
                </span>
            </td>
        </tr>
    </table>
</div>
