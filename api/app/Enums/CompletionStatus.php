<?php

namespace App\Enums;

enum CompletionStatus: string
{
    case STARTED = 'started';
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';
    case ABANDONED = 'abandoned';
    case CANCELLED = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::STARTED => 'Démarré',
            self::IN_PROGRESS => 'En cours',
            self::COMPLETED => 'Terminé',
            self::ABANDONED => 'Abandonné',
            self::CANCELLED => 'Annulé',
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
