<?php

namespace App\Enums;

enum AppointmentStatus: string
{
    case REQUESTED = 'requested';
    case CONFIRMED = 'confirmed';
    case CANCELLED = 'cancelled';
    case COMPLETED = 'completed';

    public function label(): string
    {
        return match ($this) {
            self::REQUESTED => 'Demandé',
            self::CONFIRMED => 'Confirmé',
            self::CANCELLED => 'Annulé',
            self::COMPLETED => 'Terminé',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function labels(): array
    {
        return array_combine(
            self::values(),
            array_map(
                fn(self $status) => $status->label(),
                self::cases()
            )
        );
    }
}
