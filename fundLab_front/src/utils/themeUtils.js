/**
 * FUND.lab — Theme Utilities
 * Helper to determine CSS theme class based on module ID, code or object.
 * Derived strictly from FUND.lab brand charter (#34BED5 & #17212D).
 */

export function getModuleThemeClass(moduleInput) {
  if (!moduleInput) return 'theme-360';

  let codeStr = '';
  if (typeof moduleInput === 'string') {
    codeStr = moduleInput;
  } else if (typeof moduleInput === 'object') {
    codeStr = moduleInput.id || moduleInput.code || moduleInput.moduleId || moduleInput.module_code || '';
  }

  const cleanId = String(codeStr).trim().toUpperCase();
  const prefix = cleanId.split('-')[0];

  switch (prefix) {
    case 'PRJ':
      return 'theme-prj'; // Porteur de Projet (Turquoise Givré / Doux)
    case 'OPP':
      return 'theme-opp'; // Opportunité & Croissance (Cyan Vif / Électrique)
    case 'DIF':
      return 'theme-dif'; // Difficulté & Stabilisation (Bleu Crépuscule Profond)
    case 'FIN':
      return 'theme-fin'; // Financement & Trésorerie (Bleu Acier Institutionnel)
    case 'PRO':
      return 'theme-pro'; // Offre Produit (Turquoise Lumineux)
    case 'COM':
      return 'theme-com'; // Commercial (Cyan Intense)
    case 'GOV':
      return 'theme-gov'; // Organisation & Gouvernance (Slate Dark)
    case '360':
    case 'FLH':
    case 'TRI':
    default:
      return 'theme-360'; // Turquoise Canonique FUND.lab (#34BED5)
  }
}
