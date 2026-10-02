<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Business Check-up - Résultat</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; line-height: 1.6; }
        .header { background: #1a365d; color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; }
        .header p { margin: 5px 0 0; opacity: 0.9; }
        .score-section { text-align: center; padding: 40px 20px; background: #f7fafc; }
        .score-circle { width: 150px; height: 150px; border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: bold; color: white; }
        .score-critical { background: #e53e3e; }
        .score-fragile { background: #dd6b20; }
        .score-stable { background: #d69e2e; }
        .score-solid { background: #38a169; }
        .score-advanced { background: #2b6cb0; }
        .band-label { font-size: 18px; margin-top: 15px; font-weight: 600; }
        .section { padding: 25px 30px; border-bottom: 1px solid #e2e8f0; }
        .section h2 { color: #1a365d; font-size: 20px; margin-bottom: 15px; }
        .strength { color: #38a169; padding: 8px 0; }
        .weakness { color: #e53e3e; padding: 8px 0; }
        .priority { background: #ebf8ff; padding: 12px 15px; margin: 8px 0; border-left: 4px solid #3182ce; border-radius: 4px; }
        .disclaimer { background: #fffaf0; padding: 20px; margin: 20px; border: 1px solid #fbd38d; border-radius: 8px; font-size: 13px; color: #744210; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #718096; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Business Check-up</h1>
        <p>Powered by FUND.lab</p>
    </div>

    <div class="score-section">
        <div class="score-circle score-{{ $scoring->score_band->value }}">
            {{ $scoring->getScoreDisplay() }}/100
        </div>
        <div class="band-label">{{ $scoring->getBandLabel() }}</div>
        <p style="margin-top: 10px; color: #718096;">
            Module: {{ config("business-checkup.modules.{$diagnostic->module_code}.name") }}
        </p>
    </div>

    <div class="section">
        <h2>Synthèse</h2>
        <p>{{ $recommendation->summary_text_rendered }}</p>
    </div>

    <div class="section">
        <h2>Points d'appui</h2>
        @foreach($recommendation->getStrengths() as $strength)
            <div class="strength">✓ {{ $strength }}</div>
        @endforeach
    </div>

    <div class="section">
        <h2>Points de vigilance</h2>
        @foreach($recommendation->getWeaknesses() as $weakness)
            <div class="weakness">⚠ {{ $weakness }}</div>
        @endforeach
    </div>

    <div class="section">
        <h2>Priorités d'action</h2>
        @foreach($recommendation->getPriorityActions() as $index => $priority)
            <div class="priority">
                <strong>Priorité {{ $index + 1 }}:</strong> {{ $priority }}
            </div>
        @endforeach
    </div>

    <div class="disclaimer">
        <strong>Important:</strong> {{ config('business-checkup.restitution.disclaimer') }}
        @if($diagnostic->module_code === 'OPP-04')
            <br><br>{{ config('business-checkup.restitution.disclaimer_financing') }}
        @endif
    </div>

    <div class="footer">
        <p>Business Check-up - Powered by FUND.lab</p>
        <p>Document généré le {{ now()->format('d/m/Y à H:i') }}</p>
    </div>
</body>
</html>
