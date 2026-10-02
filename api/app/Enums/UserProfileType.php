<?php

namespace App\Enums;

enum UserProfileType: string
{
    case PROJECT_HOLDER = 'project_holder';
    case ACTIVE_ENTREPRENEUR = 'active_entrepreneur';
    case STRUCTURED_SME = 'structured_sme';
    case DISTRESSED_BUSINESS = 'distressed_business';
    case OPPORTUNITY_SEEKER = 'opportunity_seeker';
    case INSTITUTIONAL_CURIOUS = 'institutional_curious';

    public function label(): string
    {
        return match ($this) {
            self::PROJECT_HOLDER => 'Porteur de projet',
            self::ACTIVE_ENTREPRENEUR => 'Entrepreneur en activité',
            self::STRUCTURED_SME => 'PME structurée',
            self::DISTRESSED_BUSINESS => 'Entreprise en difficulté',
            self::OPPORTUNITY_SEEKER => 'Recherche d\'opportunité',
            self::INSTITUTIONAL_CURIOUS => 'Institutionnel / curieux',
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
