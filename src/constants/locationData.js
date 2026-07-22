export const REGIONS = [
  'Atlantique', 'Littoral', 'Ouémé', 'Borgou', 'Zou', 'Collines', 'Plateau', 'Mono', 'Couffo', 'Donga', 'Atacora', 'Alibori', 'Autre'
];

export const SECTORS = [
  'Agriculture',
  'Agro-transformation',
  'Commerce / Distribution',
  'Services',
  'Industrie / Fabrication',
  'Numérique / technologie',
  'Artisanat',
  'Transport / logistique',
  'Tourisme / hôtellerie /restauration',
  'Santé',
  'Éducation / formation',
  'BTP / immobilier',
  'Autre'
];

export const DEPARTMENT_COMMUNES = {
  'Alibori': ['Banikoara', 'Gogounou', 'Kandi', 'Karimama', 'Malanville', 'Segbana'],
  'Atacora': ['Boukoumbé', 'Cobly', 'Kérou', 'Kouandé', 'Matéri', 'Natitingou', 'Péhunco', 'Tanguiéta', 'Toucountouna'],
  'Atlantique': ['Abomey-Calavi', 'Allada', 'Kpomassè', 'Ouidah', 'Sô-Ava', 'Toffo', 'Tori-Bossito', 'Zè'],
  'Borgou': ['Bembéréké', 'Kalalé', "N'Dali", 'Nikki', 'Parakou', 'Pèrèrè', 'Sinendé', 'Tchaourou'],
  'Collines': ['Bantè', 'Dassa-Zoumé', 'Glazoué', 'Ouèssè', 'Savalou', 'Savè'],
  'Couffo': ['Aplahoué', 'Djakotomey', 'Dogbo', 'Klouékanmè', 'Lalo', 'Toviklin'],
  'Donga': ['Bassila', 'Copargo', 'Djougou', 'Ouaké'],
  'Littoral': ['Cotonou'],
  'Mono': ['Athiémé', 'Bopa', 'Comè', 'Grand-Popo', 'Houéyogbé', 'Lokossa'],
  'Ouémé': ['Adjarra', 'Adjohoun', 'Aguégués', 'Akpro-Missérété', 'Avrankou', 'Bonou', 'Dangbo', 'Porto-Novo', 'Sèmè-Kpodji'],
  'Plateau': ['Adja-Ouèrè', 'Ifangni', 'Kétou', 'Pobè', 'Sakété'],
  'Zou': ['Abomey', 'Agbangnizoun', 'Bohicon', 'Covè', 'Djidja', 'Ouinhi', 'Za-Kpota', 'Zagnanado', 'Zogbodomey']
};

export const COMMUNE_LIST = Object.values(DEPARTMENT_COMMUNES).flat().sort();
