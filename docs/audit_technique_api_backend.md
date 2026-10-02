# Rapport d'Audit Technique & Architecture API — Business Check-up
**Date :** 02 Octobre 2026  
**Cible :** Équipe de Développement Backend & Direction Technique  
**Projet :** Plateforme Business Check-up (Cabinet de Conseil / Diagnostics PME)

---

## 1. Contexte & Enjeux Métier (Rappel Cabinet)

La plateforme Business Check-up a été conçue pour un **cabinet de conseil aux entreprises**. Dans ce modèle :
1. **Double porte d'entrée :**
   - Parcours guidé (*Triage*) pour les PME indécises.
   - Parcours direct (*Expert / Catalogue*) pour cibler un diagnostic spécifique.
2. **Collecte d'informations amont :**
   - Les informations sur l'entreprise (nom, secteur, téléphone, email) sont demandées afin de permettre au cabinet de **relancer les prospects** (lead generation / support conseil), même si ceux-ci abandonnent en cours de route.
3. **Deux niveaux de restitution :**
   - **Niveau 1 (Diagnostic Flash / Initial) :** Calcul de score direct et synthèse immédiate sans IA.
   - **Niveau 2 (Diagnostic Approfondi / Enrichi) :** Questions de précision complémentaires, validation de l'adresse email par code OTP, puis génération d'un rapport PDF complet (3 pages) par IA / n8n, envoyé par email.
4. **Phase pilote actuelle :**
   - Les envois finaux par email sont temporairement redirigés vers une adresse interne (`assogbamanuel6@gmail.com`) pour validation de la qualité rédactionnelle par le Directeur Général (DG) du cabinet avant ouverture aux clients finaux.

---

## 2. Incohérences Majeures & Ruptures dans le Backend

### 2.1. Désynchronisation des Identifiants (`user_id` divergent) — BLOQUANT
- **Fichiers concernés :**
  - [`SessionController.php` (l. 34)](file:///c:/projects/bcheckup/business_check_up/api/app/Http/Controllers/Api/SessionController.php#L34)
  - [`DiagnosticController.php` (l. 70)](file:///c:/projects/bcheckup/business_check_up/api/app/Http/Controllers/Api/DiagnosticController.php#L70)
  - [`TriageController.php` (l. 89)](file:///c:/projects/bcheckup/business_check_up/api/app/Http/Controllers/Api/TriageController.php#L89)
- **Constat :**
  1. À la création de la session (`POST /api/bc/diagnostic-sessions`), un premier UUID aléatoire est généré pour `$session->user_id` (ex: `UUID-A`).
  2. Au démarrage du diagnostic (`POST /sessions/{id}/diagnostics`), `$diagnosticRun->user_id` prend la valeur `$session->user_id` (`UUID-A`).
  3. Lors de la soumission du profil/triage (`POST /sessions/{id}/triage`), `UserProfile::create()` génère un **second UUID aléatoire indépendant** (ex: `UUID-B`).
- **Conséquence directe :**
  - La relation Eloquent `DiagnosticRun::user()` cherche `bc_user_profiles.user_id = UUID-A`.
  - Le profil portant `UUID-B`, `$diagnosticRun->user` retourne systématiquement `null`.
  - Dans `ReportDiagnosticController::sendReport()`, la vérification échoue avec une erreur 422 :
    ```json
    { "status": "error", "message": "Destinataire introuvable ou email manquant pour ce diagnostic." }
    ```
  - Dans `FollowUpController::request()`, `UserProfile::find($diagnostic->user_id)` ne trouve aucun profil à mettre à jour.
- **Correction recommandée :**
  Dans `TriageController::store()`, ne pas générer un nouvel UUID mais réutiliser `$session->user_id` :
  ```php
  $userProfile = UserProfile::create([
      'user_id' => $session->user_id, // Conserver le même identifiant
      'email' => $validated['email'],
      ...
  ]);
  ```

---

### 2.2. Collision des profils sur les requêtes anonymes (`email = null`) — CRITIQUE
- **Fichier concerné :** [`TriageController.php` (l. 84)](file:///c:/projects/bcheckup/business_check_up/api/app/Http/Controllers/Api/TriageController.php#L84)
- **Constat :**
  ```php
  $userProfile = UserProfile::where('email', $validated['email'])->first();
  ```
  Si `$validated['email']` est vide ou omis, Laravel exécute :
  `SELECT * FROM bc_user_profiles WHERE email IS NULL LIMIT 1;`
- **Conséquence directe :**
  Le backend sélectionne le profil d'un utilisateur anonyme précédent et écrase ses données (nom, entreprise, etc.) avec celles du nouvel utilisateur.
- **Correction recommandée :**
  Ne chercher un profil existant par email **que si un email valide est fourni** :
  ```php
  $userEmail = !empty($validated['email']) ? strtolower(trim($validated['email'])) : null;
  $userProfile = $userEmail ? UserProfile::where('email', $userEmail)->first() : null;
  ```

---

### 2.3. Gestion du scoring en mode dégradé IA (`answer_ia = true`) — MAJEUR
- **Fichiers concernés :**
  - [`DiagnosticController.php` (l. 194-207 et l. 455-500)](file:///c:/projects/bcheckup/business_check_up/api/app/Http/Controllers/Api/DiagnosticController.php#L194-L207)
  - [`AnswerClassifierService.php` (l. 36 et l. 43)](file:///c:/projects/bcheckup/business_check_up/api/app/Services/Ia/AnswerClassifierService.php#L36)
- **Constat :**
  1. Lors de la soumission d'une réponse (`submitAnswer`), si la question a `answer_ia = true`, le backend n'attribue **aucun score** (`score = null`) et attend l'étape `complete()` pour classifier la réponse par IA.
  2. En cas d'indisponibilité ou d'absence de crédits sur l'API IA, l'appel batch échoue.
  3. Dans la boucle de repli, le backend applique `weight = 0` sur toutes les questions IA non classifiées.
  4. Dans `ScoringEngine::calculateModuleScore()`, toute question ayant `score = null` ou `weight = 0` est totalement ignorée.
- **Conséquence directe :**
  Si un module contient plusieurs questions IA, ces questions sont exclues du calcul même si l'utilisateur a choisi une option prédéfinie. Le score final est faussé ou ramené au score minimum (1.0).
- **Deux bugs annexes dans `AnswerClassifierService.php` :**
  - **Ligne 43 :** `'diagnostic_run_id' => $diagnostic->id` — La clé primaire s'appelle `diagnostic_run_id`. `$diagnostic->id` renvoie `null`. Remplacer par `$diagnostic->diagnostic_run_id` ou `$diagnostic->getKey()`.
  - **Ligne 36 :** `$response->answer_free_text` — Cette colonne n'existe pas dans `bc_question_responses`. La colonne réelle est `answer_text`.
- **Correction recommandée :**
  Si la question IA dispose d'options pré-scorées et que l'utilisateur a sélectionné une option, enregistrer le score de base de l'option dès `submitAnswer()`. Si l'IA échoue, conserver ce score par défaut plutôt que de neutraliser la question avec `weight = 0`.

---

### 2.4. Validation d'email isolée (Absence de propagation au run) — MOYEN
- **Fichier concerné :** [`EmailVerificationController.php` (l. 114-120)](file:///c:/projects/bcheckup/business_check_up/api/app/Http/Controllers/Api/EmailVerificationController.php#L114-L120)
- **Constat :**
  Lorsque le code à 6 chiffres est vérifié avec succès, le contrôleur met à jour `bc_email_verification_codes.verified_at = now()`. Cependant, il ne met à jour ni le profil utilisateur (`bc_user_profiles.email`), ni le diagnostic en cours (`bc_diagnostic_runs`).
- **Correction recommandée :**
  Mettre à jour l'email du profil utilisateur et/ou du diagnostic lors de la confirmation du code OTP :
  ```php
  $record->update(['verified_at' => now()]);

  if ($record->diagnostic_run_id) {
      $diagnostic = DiagnosticRun::find($record->diagnostic_run_id);
      if ($diagnostic && $diagnostic->user) {
          $diagnostic->user->update(['email' => $record->email]);
      }
  }
  ```

---

### 2.5. Faute de frappe dans la configuration du formulaire de Contact — MINEUR
- **Fichiers concernés :**
  - [`ContactController.php` (l. 29)](file:///c:/projects/bcheckup/business_check_up/api/app/Http/Controllers/Api/ContactController.php#L29)
  - [`config/business-checkup.php` (l. 518)](file:///c:/projects/bcheckup/business_check_up/api/config/business-checkup.php#L518)
- **Constat :**
  `ContactController` appelle `config('business-checkup.contact_recipient')`.
  Dans le fichier de configuration, la clé a été accidentellement saisie `'c&'` au lieu de `'contact_recipient'` :
  ```php
  // Erreur actuelle ligne 518 :
  'c&' => env('CONTACT_RECIPIENT_EMAIL', 'nicktep519@gmail.com'),
  ```
- **Conséquence directe :**
  Toute soumission sur `/contact` déclenche une exception `Mail::to(null)` (Erreur HTTP 500).
- **Correction recommandée :**
  Remplacer `'c&'` par `'contact_recipient'` dans `config/business-checkup.php`.

---

### 2.6. Blocage Multi-entreprises pour un même email (`BusinessProfile::firstOrCreate`) — FONCTIONNEL
- **Fichier concerné :** [`TriageController.php` (l. 107-128)](file:///c:/projects/bcheckup/business_check_up/api/app/Http/Controllers/Api/TriageController.php#L107-L128)
- **Constat :**
  ```php
  $businessProfile = BusinessProfile::firstOrCreate(
      [
          'user_id' => $userProfile->user_id,
      ],
      [
          'business_id' => (string) Str::uuid(),
          'business_name' => $validated['business_name'] ?? null,
          ...
      ]
  );
  ```
  Le `firstOrCreate` cherche uniquement par `user_id`.
- **Conséquence directe :**
  Si un dirigeant ayant déjà diagnostiqué une première entreprise revient avec le même email pour diagnostiquer une **seconde entreprise** différente : le backend retrouve son profil, constate qu'il a déjà un `BusinessProfile` et **ignore totalement les nouvelles informations saisies** (nom de la nouvelle entreprise, secteur, etc.). Le nouveau diagnostic est automatiquement rattaché à la première entreprise !
- **Correction recommandée :**
  Inclure le nom de l'entreprise (ou un identifiant de structure) dans la recherche :
  ```php
  $businessProfile = BusinessProfile::firstOrCreate(
      [
          'user_id' => $userProfile->user_id,
          'business_name' => $validated['business_name'],
      ],
      [
          'business_id' => (string) Str::uuid(),
          ...
      ]
  );
  ```

---

### 2.7. Absence d'un endpoint public pour l'historique des diagnostics d'un client — MANQUE ARCHITECTURAL
- **Fichier concerné :** [`routes/api.php` (l. 85)](file:///c:/projects/bcheckup/business_check_up/api/routes/api.php#L85)
- **Constat :**
  La seule route existante pour lister les diagnostics d'un utilisateur est `/admin/dashboard/{userProfile}/historical`, qui est protégée par le middleware `auth:sanctum` réservé aux administrateurs.
- **Conséquence directe :**
  Un client final ayant validé son email par OTP ne peut pas charger la liste de ses anciens diagnostics sans être administrateur de la plateforme.
- **Correction recommandée :**
  Créer un endpoint public sécurisé par session ou token OTP, par exemple :
  `POST /api/bc/user/diagnostics-history` recevant `{ email, code }` ou basé sur la session vérifiée, retournant la liste des `DiagnosticRuns` du client avec leur score et le lien de consultation du rapport.

---

## 3. Synthèse des Actions Recommandées (Checklist Backend)

- [ ] **1. Synchronisation `user_id` :** Utiliser `$session->user_id` comme clé primaire de `UserProfile` lors de l'enregistrement de triage.
- [ ] **2. Sécurisation anti-collision :** Ne pas faire de recherche `where('email', null)` dans `TriageController`.
- [ ] **3. Résilience IA & Scoring :** Calculer un score de repli sur les options sélectionnées même si `answer_ia = true`, afin de ne pas exclure les questions si le webhook IA échoue.
- [ ] **4. Correction des propriétés dans `AnswerClassifierService` :** Utiliser `$diagnostic->diagnostic_run_id` et `$response->answer_text`.
- [ ] **5. Propagation de l'email vérifié :** Lier l'adresse email validée au `UserProfile` et `DiagnosticRun`.
- [ ] **6. Correction de la configuration Contact :** Renommer la clé `'c&'` en `'contact_recipient'`.
- [ ] **7. Support multi-entreprises :** Revoir `BusinessProfile::firstOrCreate` pour chercher par `(user_id, business_name)` au lieu de `user_id` seul.
- [ ] **8. Endpoint d'historique public :** Exposer une route non-admin pour permettre aux clients de consulter leurs anciens diagnostics après vérification d'email.

