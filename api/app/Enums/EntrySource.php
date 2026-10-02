<?php

namespace App\Enums;

enum EntrySource: string
{
    case DIRECT = 'direct';
    case CCI_LINK = 'cci_link';
    case WHATSAPP = 'whatsapp';
    case FACEBOOK = 'facebook';
    case LINKEDIN = 'linkedin';
    case QR_CODE = 'qr_code';
    case EMAIL = 'email';
    case PARTNER = 'partner';
    case OTHER = 'other';


    public function label(): string
    {
        return match ($this) {
            self::DIRECT => 'Direct',
            self::CCI_LINK => 'Lien CCI',
            self::WHATSAPP => 'WhatsApp',
            self::FACEBOOK => 'Facebook',
            self::LINKEDIN => 'LinkedIn',
            self::QR_CODE => 'QR Code',
            self::EMAIL => 'E-mail',
            self::PARTNER => 'Partenaire',
            self::OTHER => 'Autre',
        };
    }

    public static function optionsEndLabel(): array
    {
        return array_map(
            fn(self $case) => [
                'value' => $case->value,
                'label' => $case->label(),
            ],
            self::cases()
        );
    }
}
