<?php

namespace App\Enums;

enum Dimension: string
{
    case META = 'meta';
    case FINANCE = 'finance';               // cash, finance
    case COMMERCIAL = 'commercial';         // sales, commercial, client
    case PRODUCT = 'product';               // offer, project, opportunity
    case GOVERNANCE = 'governance';         // organization
    case HR = 'hr';                         // team
    case OPERATIONS = 'operations';         // operations
    case FORMALIZATION = 'formalization';   // formalization

    public function label(): string
    {
        return match ($this) {
            self::META => 'Meta',
            self::FINANCE => 'Finance',
            self::COMMERCIAL => 'Commercial',
            self::PRODUCT => 'Produit',
            self::GOVERNANCE => 'Gouvernance',
            self::HR => 'Ressources humaines',
            self::OPERATIONS => 'Opérations',
            self::FORMALIZATION => 'Formalisation',
        };
    }


    /**
     * Retourne toutes les valeurs de l'enum.
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Retourne tous les libellés.
     */
    public static function labels(): array
    {
        return array_map(
            fn(self $case) => $case->label(),
            self::cases()
        );
    }

    /**
     * Retourne un tableau valeur => libellé.
     */
    public static function options(): array
    {
        return array_reduce(
            self::cases(),
            function (array $carry, self $case) {
                $carry[$case->value] = $case->label();

                return $carry;
            },
            []
        );
    }
}
