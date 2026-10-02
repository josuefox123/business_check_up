<?php

namespace App\Enums;

enum OpportunityType: string
{
    case FINANCING = 'financing';
    case NEW_MARKET = 'new_market';
    case TENDER_LARGE_ACCOUNT = 'tender_large_account';
    case PARTNERSHIP = 'partnership';
    case CAPACITY_INVESTMENT = 'capacity_investment';
    case GEOGRAPHIC_EXPANSION = 'geographic_expansion';
    case NONE = 'none';
    case UNKNOWN = 'unknown';

    public function label(): string
    {
        return match ($this) {
            self::FINANCING => 'Obtenir un financement',
            self::NEW_MARKET => 'Accéder à un nouveau marché',
            self::TENDER_LARGE_ACCOUNT => 'Répondre à un appel d\'offres / grand compte',
            self::PARTNERSHIP => 'Trouver un partenaire',
            self::CAPACITY_INVESTMENT => 'Investir ou augmenter la capacité',
            self::GEOGRAPHIC_EXPANSION => 'Étendre à une autre zone',
            self::NONE => 'Pas d\'opportunité précise',
            self::UNKNOWN => 'Je ne sais pas encore',
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
