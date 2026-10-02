<?php

namespace App\Enums;

enum ActivityStage: string
{
    case NOT_LAUNCHED = 'not_launched';
    case OCCASIONAL_SALES = 'occasional_sales';
    case REGULAR_SALES = 'regular_sales';
    case STRUCTURED_ACTIVITY = 'structured_activity';
    case DECLINING_SALES = 'declining_sales';

    public function label(): string
    {
        return match ($this) {
            self::NOT_LAUNCHED => 'Pas encore lancé',
            self::OCCASIONAL_SALES => 'Ventes occasionnelles',
            self::REGULAR_SALES => 'Ventes régulières',
            self::STRUCTURED_ACTIVITY => 'Activité structurée',
            self::DECLINING_SALES => 'Ventes en baisse',
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


    public static function labels(): array
    {
        return array_map(
            fn(self $case) => $case->label(),
            self::cases()
        );
    }
}
