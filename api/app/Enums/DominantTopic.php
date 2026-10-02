<?php

namespace App\Enums;

enum DominantTopic: string
{
    case PRODUCT = 'product';
    case COMMERCIAL = 'commercial';
    case FINANCE = 'finance';
    case GOVERNANCE = 'governance';
    case HR = 'hr';
    case OPERATIONS = 'operations';
    case DIGITAL = 'digital';
    case FORMALIZATION = 'formalization';
    case FULL_360 = 'full_360';
    case UNKNOWN = 'unknown';


    public function label(): string
    {
        return match ($this) {
            self::PRODUCT => 'Produit',
            self::COMMERCIAL => 'Commercial',
            self::FINANCE => 'Finance',
            self::GOVERNANCE => 'Gouvernance',
            self::HR => 'Ressources humaines',
            self::OPERATIONS => 'Opérations',
            self::DIGITAL => 'Digital',
            self::FORMALIZATION => 'Formalisation',
            self::FULL_360 => 'Vision 360°',
            self::UNKNOWN => 'Inconnu',
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
