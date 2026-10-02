Pour structurer le design system et l'interface de votre plateforme d'autodiagnostic en l'alignant strictement sur la charte graphique de **FUND.lab (True North)**, l'objectif est d'abandonner les interfaces génériques ("qui courent les rues") au profit d'un univers visuel hautement institutionnel, sobre, incisif et immédiatement identifiable comme un outil de conseil stratégique de premier plan.

Voici le système de style structuré, prêt à être traduit en tokens CSS ou composants Frontend (Tailwind/Sass).

---

### 1. Architecture Chromatique (Palette Officielle)

La charte repose sur un contraste maîtrisé entre la rigueur institutionnelle et l'énergie de l'innovation.

* **Bleu Crépuscule (`#17212D`)**

* *Rôle UI :* Couleur structurelle dominante. À utiliser pour les barres de navigation, les en-têtes (headers), les pieds de page (footers), le texte des titres principaux sur fond clair, ou les blocs de résumé exécutif en mode sombre.
* *Effet perçu :* Stabilité, finance, crédibilité institutionnelle.




* **Dark Turquoise (`#34BED5`)**

* *Rôle UI :* Couleur d'action et d'accentuation (CTA principaux, boutons de validation du diagnostic, barres de progression des modules, états actifs/survol, et curseurs de notation). Ne doit jamais être utilisée en excès pour préserver son impact.
* *Effet perçu :* Innovation, agilité, clarté stratégique ("la boussole").




* **Blanc Pur (`#FFFFFF`) et Noir (`#000000`)**

* *Rôle UI :* Le blanc sert de fond de page absolu pour les zones de saisie de données et de formulaires (évitant toute fatigue visuelle lors du remplissage des questionnaires). Le noir est réservé au corps de texte textuel haute densité (paragraphes d'analyse).



---

### 2. Système Typographique (Police d'accompagnement)

La charte impose l'utilisation de la typographie **Lato** pour tous les supports rédactionnels et applicatifs.

* **Hiérarchie des graisses et application UI :**
* **Titres de sections (H1, H2) :** `Lato Black` ou `Lato Bold` (Couleur : *Bleu Crépuscule* `#17212D`), espacement des lettres mesuré (*tracking*) pour un rendu rigoureux.
* **Sous-titres & Libellés de questions :** `Lato Regular` ou `Lato Medium` (Couleur : Gris charbon / Noir adouci pour une lecture longue fluide).
* **Métadonnées, infobulles & indices de formulaires :** `Lato Light` ou `Lato Thin` (idéal pour les petits textes explicatifs sous les champs de saisie financière).
* *Interdiction formelle :* Utiliser des polices fantaisistes ou par défaut du type Inter/Roboto sans l'harmonisation des graisses de Lato.



---

### 3. Traduction de l'Identité Visuelle en Composants UI (UX & Design)

Le concept clé de la charte est la **"fenêtre stratégique / porte ouverte"** (le trapèze du logo) et la précision de la boussole (*True North*). L'interface doit retranscrire cette géométrie.

* **Les Conteneurs de Formulaires et Cartes (Cards) :**
* Au lieu de cartes aux bordures arrondies classiques (effet "SaaS standard"), optez pour des structures aux angles subtilement maîtrisés, soulignées par une **bordure latérale gauche de 3px en Dark Turquoise (`#34BED5`)** pour matérialiser le focus ou la section active.
* Les fonds de cartes inactives reposent sur un blanc immaculé avec une ombre portée extrêmement diffuse et légère (effet de profondeur institutionnelle).


* **Indicateurs de Progression & Jauges de Maturité :**
* La barre de progression du diagnostic doit combiner le *Bleu Crépuscule* (fond de piste) et le *Dark Turquoise* (progression en cours).
* Les scores finaux (ex: notation de la viabilité financière ou organisationnelle) s'affichent dans des blocs épurés, typographiés en grands caractères, évoquant les livrables d'audit des cabinets internationaux.



---

### 4. Traitement des Graphiques et de la Data-Viz (Restitution du Diagnostic)

Puisque la plateforme génère des autodiagnostics, les graphiques (radars de compétences, diagrammes de performance) doivent respecter strictement la charte :

* **Lignes et axes :** Tracés fins en *Bleu Crépuscule* (`#17212D`).
* **Zones remplies / Séries de données :** Utilisation du *Dark Turquoise* (`#34BED5`) avec une opacité contrôlée (ex: 20% à 30% pour les aplats de surface, 100% pour les lignes de tendance principales).
* Suppression de toute couleur tierce non validée (pas de rouge vif, de vert pomme ou de jaune criard pour les alertes : privilégier des nuances de saturation du Bleu/Turquoise ou des niveaux de gris rigoureux).

---

### 5. Gestion des Erreurs et États Vides (Zéro-Friction & Sobriété)

Pour maintenir le standing d'un cabinet multinational, même l'erreur technique ou l'état vide doit obéir à la charte :

* **Messages d'erreur :** Intégrés dans un bloc structuré sur fond grisé subtil avec un liseré *Bleu Crépuscule*. Le texte reste factuel, explicite, et s'accompagne d'un identifiant de traçabilité (ex: *Code incident : ERR-TC-942*), éliminant tout jargon brut de base de données.
* **États vides (ex: "Aucun diagnostic enregistré pour le moment") :** Accompagnés d'un pictogramme minimaliste issu de la charte, stylisé en *Dark Turquoise*, invitant immédiatement l'utilisateur à lancer sa première évaluation.