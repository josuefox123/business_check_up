<?php

namespace App\Enums;

enum ModuleFamily: string
{
    case ORIENTATION = 'orientation';
    case TRANSVERSAL = 'transversal';
    case SITUATIONAL = 'situational';
    case FUNCTIONAL = 'functional';
    case EXPERT = 'expert';
    case SIGNAL_ONLY = 'signal_only';

    public function label(): string
    {
        return match ($this) {
            self::ORIENTATION => "Modules d'entrée et d'orientation",
            self::TRANSVERSAL => 'Modules transversaux',
            self::SITUATIONAL => 'Modules situationnels',
            self::FUNCTIONAL => 'Modules fonctionnels',
            self::EXPERT => 'Modules experts',
            self::SIGNAL_ONLY => 'Signaux de détection MVP',
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
