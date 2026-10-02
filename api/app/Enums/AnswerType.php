<?php

namespace App\Enums;

enum AnswerType: string
{
    case SINGLE_CHOICE = 'single_choice';
    case MULTI_CHOICE = 'multi_choice';
    case SCALE_1_5 = 'scale_1_5';
    case YES_NO_UNKNOWN = 'yes_no_unknown';
    case RANGE = 'range';
    case SHORT_TEXT = 'short_text';
    case NUMERIC = 'numeric';
    case TEXT_LIBRE = 'text_libre';

    public function label(): string
    {
        return match ($this) {
            self::SINGLE_CHOICE => 'Choix unique',
            self::MULTI_CHOICE => 'Choix multiple',
            self::SCALE_1_5 => 'Échelle de 1 à 5',
            self::YES_NO_UNKNOWN => 'Oui / Non / Je ne sais pas',
            self::RANGE => 'Plage de valeurs',
            self::SHORT_TEXT => 'Texte court',
            self::NUMERIC => 'Valeur numérique',
            self::TEXT_LIBRE => 'Texte libre',
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
