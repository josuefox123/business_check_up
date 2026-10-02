<?php

namespace App\Enums;

enum EvidenceType: string
{
    case INVOICE = 'invoice';
    case RECEIPT = 'receipt';
    case BANK_STATEMENT = 'bank_statement';
    case MOBILE_MONEY = 'mobile_money';
    case ORDER = 'order';
    case CONTRACT = 'contract';
    case EXCEL = 'excel';
    case NOTEBOOK = 'notebook';
    case PHOTO = 'photo';
    case CUSTOMER_MESSAGE = 'customer_message';
    case TAX_DOCUMENT = 'tax_document';
    case OTHER = 'other';
    case NONE = 'none';

    public function label(): string
    {
        return match ($this) {
            self::INVOICE => 'Facture',
            self::RECEIPT => 'Reçu',
            self::BANK_STATEMENT => 'Relevé bancaire',
            self::MOBILE_MONEY => 'Relevé Mobile Money',
            self::ORDER => 'Bon de commande',
            self::CONTRACT => 'Contrat',
            self::EXCEL => 'Fichier Excel',
            self::NOTEBOOK => 'Cahier',
            self::PHOTO => 'Photo',
            self::CUSTOMER_MESSAGE => 'Message client',
            self::TAX_DOCUMENT => 'Document fiscal',
            self::OTHER => 'Autre',
            self::NONE => 'Aucun',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function labels(): array
    {
        return array_map(
            fn(self $case) => $case->label(),
            self::cases()
        );
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
