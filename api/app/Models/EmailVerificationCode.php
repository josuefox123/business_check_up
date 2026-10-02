<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class EmailVerificationCode extends Model
{
    protected $table = 'bc_email_verification_codes';
    protected $fillable = [
        'email',
        'code_hash',
        'diagnostic_run_id',
        'attempts',
        'expires_at',
        'verified_at',
        'last_sent_at',
    ];

    protected $casts = [
        'expires_at'  => 'datetime',
        'verified_at' => 'datetime',
        'last_sent_at' => 'datetime',
    ];

    const EXPIRATION_MINUTES = 10;
    const MAX_ATTEMPTS       = 5;
    const RESEND_DELAY_SEC   = 60;

    /** Crée un nouveau code pour cet email (invalide les anciens non vérifiés) */
    public static function generateFor(string $email, ?string $diagnosticRunId = null): array
    {
        // Invalider les codes précédents non utilisés
        static::where('email', $email)->whereNull('verified_at')->delete();

        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $record = static::create([
            'email'             => $email,
            'code_hash'         => Hash::make($code),
            'diagnostic_run_id' => $diagnosticRunId,
            'expires_at'        => now()->addMinutes(self::EXPIRATION_MINUTES),
            'last_sent_at'      => now(),
        ]);

        return [$record, $code]; // le code en clair ne vit que dans le mail
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isVerified(): bool
    {
        return $this->verified_at !== null;
    }

    public function checkCode(string $code): bool
    {
        return Hash::check($code, $this->code_hash);
    }

    /** L'email a-t-il un code vérifié encore "frais" (ex. 24h) ? */
    public static function hasVerifiedEmail(string $email): bool
    {
        return static::where('email', $email)
            ->whereNotNull('verified_at')
            ->where('verified_at', '>=', now()->subDay())
            ->exists();
    }
}
