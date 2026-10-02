<?php

namespace App\Enums;

enum EntryMode: string
{
    case ASSISTED = 'assisted';
    case DIRECT_CATALOG = 'direct_catalog';
    case LEARN_MORE = 'learn_more';
    case INSTITUTIONAL = 'institutional_partner';


    public function label(): string
    {
        return match ($this) {
            self::ASSISTED => 'Accompagné',
            self::DIRECT_CATALOG => 'Catalogue direct',
            self::LEARN_MORE => 'En savoir plus',
            self::INSTITUTIONAL => 'Je représente une institution / un partenaire',
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
