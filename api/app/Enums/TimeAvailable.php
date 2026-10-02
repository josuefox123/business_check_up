<?php

namespace App\Enums;

enum TimeAvailable: string
{
    case SEVEN_TEN_MIN = '7_10_min';
    case EIGHT_FIFTEEN_MIN = '8_15_min';
    case THIRTY_FORTY_FIVE_MIN = '30_45_min';
    case START_SHORT = 'start_short';
    case DEEP_DIVE = 'deep_dive';

    public function label(): string
    {
        return match ($this) {
            self::SEVEN_TEN_MIN => '7 à 10 minutes',
            self::EIGHT_FIFTEEN_MIN => '8 à 15 minutes',
            self::THIRTY_FORTY_FIVE_MIN => '30 à 45 minutes',
            self::START_SHORT => 'Commencer court et approfondir après',
            self::DEEP_DIVE => 'Diagnostic sérieux, même si plus long',
        };
    }

    public function defaultModule(): string
    {
        return match ($this) {
            self::SEVEN_TEN_MIN => 'FLH-01',
            self::EIGHT_FIFTEEN_MIN => 'FLH-01',
            self::THIRTY_FORTY_FIVE_MIN => '360-09',
            self::START_SHORT => 'FLH-01',
            self::DEEP_DIVE => '360-09',
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
