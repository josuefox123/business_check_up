<?php

namespace App\Enums;

enum RiskFlag: string
{
    case CANNOT_PAY_CURRENT_EXPENSES = 'cannot_pay_current_expenses';
    case SUPPLIER_TAX_SALARY_DEBT_ARREARS = 'supplier_tax_salary_debt_arrears';
    case CASH_INSUFFICIENT_CONTINUITY = 'cash_insufficient_continuity';
    case SALES_STRONG_DECLINE = 'sales_strong_decline';
    case LOST_MAJOR_CLIENT = 'lost_major_client';
    case PRODUCTION_DELIVERY_BLOCKED = 'production_delivery_blocked';
    case INTERNAL_CONFLICT_KEY_DEPARTURE = 'internal_conflict_key_departure';
    case NONE = 'none';
    case PREFER_NOT_TO_ANSWER = 'prefer_not_to_answer';

    public function level(): string
    {
        return match ($this) {
            self::CANNOT_PAY_CURRENT_EXPENSES => 'critical',
            self::SUPPLIER_TAX_SALARY_DEBT_ARREARS => 'critical',
            self::CASH_INSUFFICIENT_CONTINUITY => 'critical',
            self::SALES_STRONG_DECLINE => 'high',
            self::LOST_MAJOR_CLIENT => 'high',
            self::PRODUCTION_DELIVERY_BLOCKED => 'high',
            self::INTERNAL_CONFLICT_KEY_DEPARTURE => 'medium_high',
            self::NONE => 'none',
            self::PREFER_NOT_TO_ANSWER => 'unknown',
        };
    }

    public function label(): string
    {
        return match ($this) {
            self::CANNOT_PAY_CURRENT_EXPENSES => 'Difficulté à payer les charges courantes',
            self::SUPPLIER_TAX_SALARY_DEBT_ARREARS => 'Retards fournisseurs, impôts, salaires ou dettes',
            self::CASH_INSUFFICIENT_CONTINUITY => 'Trésorerie insuffisante pour continuer',
            self::SALES_STRONG_DECLINE => 'Forte baisse des ventes',
            self::LOST_MAJOR_CLIENT => 'Perte d\'un client important',
            self::PRODUCTION_DELIVERY_BLOCKED => 'Blocage production ou livraison',
            self::INTERNAL_CONFLICT_KEY_DEPARTURE => 'Conflits internes ou départs critiques',
            self::NONE => 'Aucune de ces situations',
            self::PREFER_NOT_TO_ANSWER => 'Je préfère ne pas répondre',
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
