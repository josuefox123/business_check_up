# Schémas de Modèles de Données — FUND.lab

Ce document spécifie les structures de données JSON utilisées dans le frontend et retournées par les endpoints backend.

---

## 📊 1. Diagnostic (Session de réponse)

Représente une évaluation complétée par un entrepreneur.

```json
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
  "answers": {
    "q1": "yes",
    "q2": "good",
    "q3": "some",
    "q4": 4,
    "q5": "mental",
    "q6": "sales",
    "q7": ["competition", "costs"],
    "q2_proof": "Relevés de comptes de mars et avril fournis"
  }
}
```

---

## 👤 2. Utilisateur / Prospect

Données récoltées à l'issue du questionnaire d'évaluation.
> **Important** : L'email est obligatoire avant l'envoi des réponses d'enrichissement.

```json
{
  "id": "USR-001",
  "name": "Koffi Mensah",
  "email": "koffi.mensah@gmail.com",
  "phone": "+229 97 00 11 22",
  "companyName": "Mensah Trading Co.",
  "sector": "Commerce général",
  "department": "Littoral",
  "commune": "Cotonou",
  "profile": "active",
  "dateJoined": "2026-07-15T18:32:00Z",
  "contactRequested": true,
  "pdfDownloaded": true
}
```

---

## 📝 3. Questionnaire & Question

Configuration dynamique du catalogue de diagnostics.

```json
{
  "id": "q1",
  "axe": "Ventes",
  "question": "Votre activité génère-t-elle des ventes régulières ?",
  "type": "single",
  "weight": 15,
  "choices": [
    { "id": "yes", "label": "Oui, chaque semaine ou chaque mois", "score": 15 },
    { "id": "no",  "label": "Non, pas encore",                    "score": 0  }
  ]
}
```

---

## 📊 4. Stats Dashboard — Overview

Retourné par `GET /admin/dashboard/overview`.
Utilisé directement dans `Dashboard.jsx` via les variables normalisées.

```json
{
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
  }
}
```

---

## 🗺️ 5. Répartition Territoriale

Retourné par `GET /admin/dashboard/territory`.
Utilisé dans `AdminBreakdownWidget.jsx` (onglet Régions).

```json
{
  "regions": [
    { "region": "Atlantique", "diagnostic_count": 15 },
    { "region": "Littoral",   "diagnostic_count": 13 },
    { "region": "Atacora",    "diagnostic_count": 1  }
  ]
}
```

> **Champs clés** : `region` (nom de la région) et `diagnostic_count` (nombre de diagnostics).

---

## 🫧 6. Stats Modules (Bubble Chart)

Retourné par `GET /admin/stats/modules`.
Utilisé dans `AdminBubbleChart.jsx`.

```json
[
  { "code": "FLH-01", "name": "Diagnostic Flash",       "count": 16 },
  { "code": "DIF-03", "name": "Diagnostic Difficulté",  "count": 10 },
  { "code": "PRJ-02", "name": "Diagnostic Projet",      "count": 8  }
]
```

> **Champs clés** : `code` (affiché dans la bulle), `name` (affiché dans le tooltip), `count` (détermine la taille de la bulle).

---

## 🔔 7. Notification

```json
{
  "id": "NOT-001",
  "type": "danger",
  "title": "Score critique détecté",
  "message": "Un entrepreneur a soumis un score de 18/100.",
  "read": false,
  "date": "2026-07-16T09:00:00Z"
}
```
