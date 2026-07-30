# FUND.lab — Spécification des API Backend

Ce document liste l'ensemble des endpoints REST intégrés côté backend.

> **Base URL** : `https://business-chekcup.nicktep.com/api/bc`
> **Auth** : Toutes les routes `/admin/*` nécessitent un header `Authorization: Bearer <token>`

---

## 🔐 Authentification

### `POST /auth/login`
Connexion administrateur. Retourne un JWT.

**Body (JSON)**
```json
{ "username": "admin", "password": "admin" }
```
**Réponse 200**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400,
  "user": { "id": "USR-ADMIN-001", "username": "admin", "role": "admin" }
}
```

### `POST /auth/logout`
Invalidation du token côté serveur (optionnel si stateless JWT).

### `GET /auth/me`
Retourne l'utilisateur connecté à partir du token.

---

## 📊 Statistiques — Dashboard Admin

### `GET /admin/dashboard/overview`
Retourne les KPIs globaux et les données agrégées du tableau de bord.

**Réponse 200**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "traffic": {
      "total_visitors": 55,
      "new_sessions": 12
    },
    "diagnostics": {
      "started": 42,
      "completed": 30,
      "abandoned": 12,
      "completion_rate": 71,
      "abandoned_first_run": 8,
      "completed_first_only": 14,
      "completed_enrichment": 16
    },
    "follow_ups": {
      "total_requests": 7,
      "new": 3,
      "urgent": 1
    },
    "sectors": [
      { "sector": "Commerce général", "diagnostic_count": 7 },
      { "sector": "Agriculture", "diagnostic_count": 4 }
    ],
    "user_profiles": [
      { "profile": "PME / Entreprise formalisée", "diagnostic_count": 16 },
      { "profile": "Porteur de projet / Idée", "diagnostic_count": 12 }
    ]
  }
}
```

> **Mapping frontend** : Les champs `traffic`, `diagnostics`, `follow_ups`, `sectors` et `user_profiles` sont mappés directement dans le composant `Dashboard.jsx` via les variables normalisées.

---

### `GET /admin/dashboard/territory`
Retourne la répartition géographique des diagnostics par région.

**Réponse 200**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "regions": [
      { "region": "Atlantique", "diagnostic_count": 15 },
      { "region": "Littoral",   "diagnostic_count": 13 },
      { "region": "Atacora",    "diagnostic_count": 1  },
      { "region": "Donga",      "diagnostic_count": 1  },
      { "region": "Borgou",     "diagnostic_count": 1  },
      { "region": "Mono",       "diagnostic_count": 1  }
    ]
  }
}
```

> **Mapping frontend** : Utilisé dans le composant `AdminBreakdownWidget.jsx` (onglet "Régions"). Le champ clé est `region` et le compteur est `diagnostic_count`.

---

### `GET /admin/stats/activity?days=7`
Retourne le nombre de diagnostics par jour pour les N derniers jours.

**Query params** : `days` (integer, défaut: 7)

**Réponse 200**
```json
[
  { "date": "2026-07-10", "label": "jeu. 10", "count": 2 },
  { "date": "2026-07-11", "label": "ven. 11", "count": 0 },
  { "date": "2026-07-12", "label": "sam. 12", "count": 5 }
]
```

---

### `GET /admin/stats/modules`
Retourne la répartition et les statistiques par module de diagnostic.
Utilisé dans le **Bubble Chart** (`AdminBubbleChart.jsx`).

**Réponse 200**
```json
[
  {
    "code": "FLH-01",
    "name": "Diagnostic Flash",
    "count": 16,
    "avgScore": 65,
    "percentage": 38
  },
  {
    "code": "DIF-03",
    "name": "Diagnostic Difficulté",
    "count": 10,
    "avgScore": 58,
    "percentage": 24
  }
]
```

> **Mapping frontend** : Les champs `code`, `name` et `count` sont utilisés. Les bulles sont dimensionnées proportionnellement à `count`.

---

### `GET /admin/stats/scores/distribution`
Retourne la répartition des scores par tranche.

**Réponse 200**
```json
[
  { "label": "Critique",  "min": 0,  "max": 29,  "color": "#ef4444", "count": 4,  "percentage": 10 },
  { "label": "Faible",    "min": 30, "max": 49,  "color": "#f97316", "count": 8,  "percentage": 19 },
  { "label": "Moyen",     "min": 50, "max": 69,  "color": "#eab308", "count": 15, "percentage": 36 },
  { "label": "Bon",       "min": 70, "max": 84,  "color": "#22c55e", "count": 12, "percentage": 29 },
  { "label": "Excellent", "min": 85, "max": 100, "color": "#0d9488", "count": 3,  "percentage": 7  }
]
```

---

### `GET /admin/stats/sectors`
Retourne le top 5 des secteurs d'activité des prospects enregistrés.

**Réponse 200**
```json
[
  { "sector": "Commerce général", "count": 7 },
  { "sector": "Agriculture",      "count": 4 },
  { "sector": "BTP",              "count": 3 }
]
```

---

## 🩺 Diagnostics

### `GET /admin/diagnostics`
Liste complète de tous les diagnostics soumis.

**Query params** : `moduleId`, `search`, `page`, `limit`

**Réponse 200**
```json
{
  "data": [
    {
      "id": "DIAG-2026-001",
      "moduleId": "FLH-01",
      "moduleName": "Diagnostic Flash",
      "score": 72,
      "confidence": "Documenté",
      "date": "2026-07-15T18:30:00Z",
      "userName": "Koffi Mensah",
      "userEmail": "koffi.mensah@gmail.com",
      "userPhone": "+229 97 00 11 22",
      "answers": { "q1": "yes", "q2": "good" }
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 20
}
```

### `GET /admin/diagnostics/:id`
Détail complet d'un diagnostic (avec toutes les réponses).

### `POST /admin/diagnostics`
Créer un diagnostic manuellement (soumission par un agent CCI).

**Body** : Objet diagnostic complet (voir schéma ci-dessus sans `id` et `date`).

### `DELETE /admin/diagnostics/:id`
Supprimer un diagnostic de l'historique.

**Réponse 200** : `{ "success": true }`

---

## 👤 Utilisateurs / Prospects

### `GET /admin/users`
Liste de tous les prospects enregistrés.

**Query params** : `search`, `sector`, `department`, `page`, `limit`

**Réponse 200**
```json
{
  "data": [
    {
      "id": "USR-001",
      "name": "Koffi Mensah",
      "email": "koffi.mensah@gmail.com",
      "phone": "+229 97 00 11 22",
      "companyName": "Mensah Trading Co.",
      "sector": "Commerce général",
      "department": "Littoral",
      "commune": "Cotonou",
      "dateJoined": "2026-07-15T18:32:00Z",
      "contactRequested": true
    }
  ],
  "total": 18
}
```

### `GET /admin/users/:id`
Détail complet d'un prospect.

### `POST /admin/users`
Créer un prospect manuellement.

**Body** : `{ name, email, phone, companyName, sector, department, commune }`

### `PUT /admin/users/:id`
Mettre à jour les informations d'un prospect.

### `DELETE /admin/users/:id`
Supprimer un prospect.

---

## 📝 Questionnaires

### `GET /admin/questionnaires`
Liste des 8 modules de diagnostic disponibles avec leur nombre de questions.

**Réponse 200**
```json
[
  {
    "id": "FLH-01",
    "name": "Diagnostic Flash",
    "questionsCount": 7,
    "estimatedTime": "5–8 min",
    "axes": ["Ventes", "Trésorerie", "Gestion"]
  }
]
```

### `GET /admin/questionnaires/:moduleId`
Détail d'un module avec toutes ses questions et choix de réponses.

**Réponse 200**
```json
{
  "id": "FLH-01",
  "name": "Diagnostic Flash",
  "estimatedTime": "5–8 min",
  "axes": ["Ventes", "Trésorerie"],
  "questions": [
    {
      "id": "q1",
      "axe": "Ventes",
      "question": "Votre activité génère-t-elle des ventes régulières ?",
      "type": "single",
      "weight": 15,
      "choices": [
        { "id": "yes", "label": "Oui, chaque semaine", "score": 15 },
        { "id": "no",  "label": "Non, pas encore",    "score": 0  }
      ]
    }
  ]
}
```

---

## ❓ Questions

### `GET /admin/questions/:moduleId`
Retourne la liste des questions d'un module donné.

### `POST /admin/questions/:moduleId`
Ajouter une nouvelle question à un module.

**Body**
```json
{
  "axe": "Trésorerie",
  "question": "Avez-vous un fonds de roulement suffisant ?",
  "type": "single",
  "weight": 10,
  "choices": [
    { "id": "yes", "label": "Oui", "score": 10 },
    { "id": "no",  "label": "Non", "score": 0  }
  ]
}
```

### `PUT /admin/questions/:moduleId/:questionId`
Modifier une question existante (texte, type, poids, choix de réponses).

### `DELETE /admin/questions/:moduleId/:questionId`
Supprimer une question d'un module.

---

## 📋 Rapports

### `POST /reports/generate`
Générer un rapport complet à partir des réponses d'un diagnostic.
Utilisé à la fin du parcours utilisateur.

**Body**
```json
{
  "moduleId": "FLH-01",
  "answers": { "q1": "yes", "q2": "good", "q3": "none" },
  "score": 72
}
```

**Réponse 200**
```json
{
  "moduleId": "FLH-01",
  "score": 72,
  "confidence": "Documenté",
  "level": "solide",
  "forces": ["Ventes régulières", "Gestion comptable formalisée"],
  "fragilites": ["Dépendance à un seul marché"],
  "recommendations": [
    { "axe": "Commercial", "title": "Diversifier les canaux de vente", "urgency": "moyenne" }
  ],
  "actionPlan": [
    { "priority": 1, "action": "Identifier 2 nouveaux segments clients", "delay": "30 jours" }
  ],
  "generatedAt": "2026-07-16T09:00:00Z"
}
```

### `GET /admin/reports`
Liste des rapports générés (historique).

### `GET /admin/reports/:diagId`
Rapport complet associé à un diagnostic.

---

## 🔔 Notifications

### `GET /admin/notifications`
Liste de toutes les notifications CCI (lues et non lues).

**Réponse 200**
```json
[
  {
    "id": "NOT-001",
    "type": "danger",
    "title": "Score critique détecté",
    "message": "Un entrepreneur a soumis un score de 18/100.",
    "read": false,
    "date": "2026-07-16T09:00:00Z"
  }
]
```

### `PATCH /admin/notifications/:id/read`
Marquer une notification comme lue.

**Réponse 200** : `{ "success": true }`

### `POST /admin/notifications`
Créer une notification système (depuis le backend, ex: score seuil critique).

### `DELETE /admin/notifications/:id`
Supprimer une notification.

---

## ⚙️ Paramètres

### `GET /admin/settings`
Retourne la configuration générale de l'application.

**Réponse 200**
```json
{
  "appName": "FUND.lab Business Check-up",
  "organization": "CCI Bénin",
  "contactEmail": "contact@cci.bj",
  "scoreThresholds": {
    "critique": 30,
    "moyen": 55
  }
}
```

### `PUT /admin/settings`
Mettre à jour la configuration générale.

**Body** : Objet settings complet (voir ci-dessus).

---

## 🏢 Entreprises

### `GET /admin/enterprises`
Liste de toutes les entreprises (dérivées des profils prospects).

**Réponse 200**
```json
[
  {
    "id": "ENT-001",
    "name": "Mensah Trading Co.",
    "sector": "Commerce général",
    "department": "Littoral",
    "commune": "Cotonou",
    "ownerName": "Koffi Mensah",
    "ownerEmail": "koffi.mensah@gmail.com",
    "ownerPhone": "+229 97 00 11 22",
    "dateJoined": "2026-07-15T18:32:00Z"
  }
]
```

---

## 📤 Soumission Publique (Flux utilisateur)

Ces endpoints sont appelés depuis le questionnaire utilisateur, **sans authentification admin**.
L'utilisateur **doit obligatoirement renseigner son email** avant l'envoi des réponses d'enrichissement.

### `POST /submit/user`
Enregistrement d'un prospect à la fin du questionnaire (formulaire de contact).

**Body**
```json
{
  "name": "Koffi Mensah",
  "email": "koffi.mensah@gmail.com",
  "phone": "+229 97 00 11 22",
  "companyName": "Mensah Trading Co.",
  "sector": "Commerce général",
  "department": "Littoral",
  "commune": "Cotonou",
  "contactRequested": true
}
```

### `POST /submit/diagnostic`
Enregistrement du diagnostic complet après soumission.

**Body** : Objet diagnostic complet (moduleId, score, answers, confidence, userName, userEmail, userPhone).

---

## 📌 Résumé des Endpoints Actifs

| Groupe | Endpoints clés | Statut |
|---|---|---|
| **Auth** | POST login · POST logout · GET me | ✅ Intégré |
| **Dashboard Overview** | GET /admin/dashboard/overview | ✅ Intégré |
| **Dashboard Territory** | GET /admin/dashboard/territory | ✅ Intégré |
| **Stats Activité** | GET /admin/stats/activity | ✅ Intégré |
| **Stats Modules** | GET /admin/stats/modules | ✅ Intégré (Bubble Chart) |
| **Stats Scores** | GET /admin/stats/scores/distribution | ✅ Intégré |
| **Stats Secteurs** | GET /admin/stats/sectors | ✅ Intégré |
| **Diagnostics** | GET list · GET :id · POST · DELETE :id | ✅ Intégré |
| **Utilisateurs** | GET list · GET :id · POST · PUT :id · DELETE :id | ✅ Intégré |
| **Questionnaires** | GET list · GET :moduleId | ✅ Intégré |
| **Questions** | GET · POST · PUT · DELETE | ✅ Intégré |
| **Rapports** | POST generate · GET list · GET :diagId | ✅ Intégré |
| **Notifications** | GET list · PATCH read · POST · DELETE | ✅ Intégré |
| **Paramètres** | GET · PUT | ✅ Intégré |
| **Soumission publique** | POST /submit/user · POST /submit/diagnostic | ✅ Intégré |
