<?php

namespace App\Enums;

enum ScoreBand: string
{
    case CRITICAL = 'critical';
    case FRAGILE = 'fragile';
    case STABLE = 'stable';
    case SOLID = 'solid';
    case ADVANCED = 'advanced';

    public function label(): string
    {
        return match ($this) {
            self::CRITICAL => 'Point de vigilance prioritaire',
            self::FRAGILE => 'Base fragile à renforcer',
            self::STABLE => 'Base fonctionnelle à structurer',
            self::SOLID => 'Base solide à consolider',
            self::ADVANCED => 'Maturité avancée',
        };
    }

    public static function fromScore(float $score): self
    {
        return match (true) {
            $score <= 35 => self::CRITICAL,
            $score <= 55 => self::FRAGILE,
            $score <= 70 => self::STABLE,
            $score <= 85 => self::SOLID,
            default => self::ADVANCED,
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
