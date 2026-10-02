<?php

namespace App\Enums;

enum SessionStatus: string
{
    case STARTED = 'started';
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';
    case ABANDONED = 'abandoned';

    public function label(): string
    {
        return match ($this) {
            self::STARTED => 'Démarré',
            self::IN_PROGRESS => 'En cours',
            self::COMPLETED => 'Terminé',
            self::ABANDONED => 'Abandonné',
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
