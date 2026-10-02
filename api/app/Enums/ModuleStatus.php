<?php

namespace App\Enums;

enum ModuleStatus: string
{
    case MVP = 'mvp';
    case MVP_RECOMMENDED = 'mvp_recommended';
    case V1 = 'v1';
    case V2 = 'v2';
    case SIGNAL_ONLY = 'signal_only';

    public function label(): string
    {
        return match ($this) {
            self::MVP => 'MVP',
            self::MVP_RECOMMENDED => 'MVP recommandé',
            self::V1 => 'Version 1',
            self::V2 => 'Version 2',
            self::SIGNAL_ONLY => 'Signal uniquement',
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
