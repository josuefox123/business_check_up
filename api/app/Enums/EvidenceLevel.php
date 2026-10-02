<?php

namespace App\Enums;

enum EvidenceLevel: string
{
    case E0_DECLARATIVE = 'E0_declarative';
    case E1_CONCRETE_INDICE = 'E1_concrete_indice';
    case E2_DOCUMENT_AVAILABLE = 'E2_document_available';
    case E3_VERIFIABLE_DATA = 'E3_verifiable_data';
    case EVX_NOT_REQUIRED = 'EVX_not_required';

    public function factor(): float
    {
        return match ($this) {
            self::E0_DECLARATIVE => 0.70,
            self::E1_CONCRETE_INDICE => 0.85,
            self::E2_DOCUMENT_AVAILABLE => 0.95,
            self::E3_VERIFIABLE_DATA => 1.00,
            self::EVX_NOT_REQUIRED => 1.00,
        };
    }

    public function label(): string
    {
        return match ($this) {
            self::E0_DECLARATIVE => 'Estimation ou ressenti',
            self::E1_CONCRETE_INDICE => 'Indice concret',
            self::E2_DOCUMENT_AVAILABLE => 'Document disponible',
            self::E3_VERIFIABLE_DATA => 'Donnée vérifiable',
            self::EVX_NOT_REQUIRED => 'Non requis',
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
