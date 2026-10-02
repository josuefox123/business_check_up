<?php

namespace App\Enums;

enum MainOfferType: string
{
    case PHYSICAL_PRODUCT = 'physical_product';
    case DIGITAL_PRODUCT = 'digital_product';
    case SERVICE = 'service';
    case CONSULTING = 'consulting';
    case SUBSCRIPTION = 'subscription';
    case MULTIPLE_OFFERS = 'multiple_offers';
    case NOT_DEFINED = 'not_defined';
    case OTHER = 'other';

    public function label(): string
    {
        return match ($this) {
            self::PHYSICAL_PRODUCT => 'Produit physique',
            self::DIGITAL_PRODUCT => 'Produit numérique ou logiciel',
            self::SERVICE => 'Prestation de service',
            self::CONSULTING => 'Conseil ou accompagnement',
            self::SUBSCRIPTION => 'Abonnement ou service récurrent',
            self::MULTIPLE_OFFERS => 'Plusieurs produits ou services sans offre dominante',
            self::NOT_DEFINED => 'Activité non encore définie',
            self::OTHER => 'Autre',
        };
    }

    /**
     * Retourne toutes les valeurs disponibles.
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Retourne toutes les options avec labels.
     */
    public static function options(): array
    {
        return array_map(
            fn(self $type) => [
                'value' => $type->value,
                'label' => $type->label(),
            ],
            self::cases()
        );
    }
}
