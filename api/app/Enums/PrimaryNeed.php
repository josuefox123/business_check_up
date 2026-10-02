<?php

namespace App\Enums;

enum PrimaryNeed: string
{
    case CLARIFY_PROJECT = 'clarify_project';
    case GLOBAL_UNDERSTANDING = 'global_understanding';
    case URGENT_DIFFICULTY = 'urgent_difficulty';
    case INCREASE_SALES = 'increase_sales';
    case CLARIFY_OFFER = 'clarify_offer';
    case UNDERSTAND_FINANCE = 'understand_finance';
    case ORGANIZE_BUSINESS = 'organize_business';
    case ASSESS_OPPORTUNITY = 'assess_opportunity';
    case PREPARE_FINANCING = 'prepare_financing';
    case UNKNOWN_NEED = 'unknown_need';

    public function label(): string
    {
        return match ($this) {
            self::CLARIFY_PROJECT => 'Tester ou clarifier mon idée',
            self::GLOBAL_UNDERSTANDING => 'Comprendre globalement mon entreprise',
            self::URGENT_DIFFICULTY => 'Résoudre une difficulté urgente',
            self::INCREASE_SALES => 'Améliorer mes ventes',
            self::CLARIFY_OFFER => 'Clarifier mon offre',
            self::UNDERSTAND_FINANCE => 'Comprendre trésorerie et rentabilité',
            self::ORGANIZE_BUSINESS => 'Mieux organiser les rôles',
            self::ASSESS_OPPORTUNITY => 'Savoir si je suis prêt',
            self::PREPARE_FINANCING => 'Préparer un financement',
            self::UNKNOWN_NEED => 'Je ne sais pas exactement',
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
