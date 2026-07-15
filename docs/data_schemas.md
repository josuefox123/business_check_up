# Schémas de Modèles de Données — FUND.lab

Ce document spécifie les structures de données JSON utilisées à la fois dans le frontend et attendues par les futurs endpoints du backend.

---

## 📊 1. Diagnostic (Session de réponse)

Représente une évaluation complétée par un entrepreneur.

```json
{
  "id": "DIAG-2026-001",
  "moduleId": "FLH-01",
  "moduleName": "Diagnostic Flash",
  "score": 72,
  "date": "2026-07-15T18:30:00Z",
  "userName": "Koffi Mensah",
  "userEmail": "koffi.mensah@gmail.com",
  "userPhone": "+229 97 00 11 22",
  "confidence": "Documenté",
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

Données récoltées à l'issue du questionnaire d'évaluation (formulaire S50).

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
    {
      "id": "yes",
      "label": "Oui, chaque semaine ou chaque mois",
      "score": 15,
      "icon": "✅"
    },
    {
      "id": "no",
      "label": "Non, pas encore",
      "score": 0,
      "icon": "❌"
    }
  ]
}
```
