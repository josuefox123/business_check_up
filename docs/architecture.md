# Architecture du Projet — FUND.lab Business Check-up

Ce document décrit l'organisation du projet, la structure de ses dossiers, le fonctionnement du flux de données et les décisions d'architecture du panneau d'administration.

---

## 📂 Organisation des Dossiers

```
src/
├── api/                     # Wrappers d'appels réseau vers l'API REST backend
│   ├── config.js            # Base URL et apiFetch (wrapper fetch centralisé)
│   ├── statistiquesApi.js   # Endpoints /admin/dashboard/* et /admin/stats/*
│   ├── diagnosticsApi.js    # Endpoints /admin/diagnostics/*
│   ├── questionnairesApi.js # Endpoints /admin/questionnaires/*
│   ├── sessionsApi.js       # Endpoints de session utilisateur
│   └── ...
├── services/                # Services métier encapsulant la logique d'affaires
│   ├── AdministrationService.js  # Façade admin : stats, diagnostics, users, notifications
│   ├── StatistiqueService.js     # Agrégation des données du dashboard
│   └── ...
├── components/
│   ├── admin/               # Interface administrateur (tableau de bord, modules, diagnostics)
│   │   ├── AdminApp.jsx         # Conteneur principal admin (auth, routing, chargement données)
│   │   ├── Dashboard.jsx        # Tableau de bord avec KPIs et graphiques
│   │   ├── AdminLayout.jsx      # Layout admin (sidebar, navbar)
│   │   └── charts/
│   │       ├── AdminBubbleChart.jsx     # Bubble Chart répartition par diagnostic
│   │       ├── AdminTreeChart.jsx       # Tree Chart entonnoir de conversion sessions
│   │       └── AdminBreakdownWidget.jsx # Widget Région / Secteur / Profil
│   ├── ecrans/              # Interface utilisateur (questionnaire, résultats)
│   └── ui/                  # Composants UI réutilisables
├── repositories/            # Abstraction du stockage local (LocalStoreRepository.js)
├── data/                    # Données statiques de démarrage
├── index.css                # Design system centralisé (tokens, variables, classes admin)
└── main.jsx                 # Point d'entrée
```

---

## 🔄 Flux de Données (Data Flow) — Dashboard Admin

```
[AdminApp.jsx]
      │  loadAllData() → appelle AdministrationService.*
      ▼
[AdministrationService.js]
      │  Façade : .statistics.getOverview(), .statistics.getModuleStats(), ...
      ▼
[StatistiqueService.js / statistiquesApi.js]
      │  apiFetch() vers https://business-chekcup.nicktep.com/api/bc/admin/dashboard/*
      ▼
[Backend REST API]
      │  Réponse JSON → normalisée et mappée dans AdminApp.jsx
      ▼
[Dashboard.jsx] → reçoit les props : stats, moduleStats, topSectors, ...
      │
      ├──► [AdminTreeChart.jsx]         — data.abandoned_first_run, completed_enrichment, etc.
      ├──► [AdminBubbleChart.jsx]       — moduleStats[].code, name, count
      └──► [AdminBreakdownWidget.jsx]   — topSectors[].region + diagnostic_count
```

---

## ⚡ Actualisation sans rechargement de page (Règle 1 — AGENTS.md)

Le bouton "Actualiser" du tableau de bord **ne recharge plus la page** (`window.location.reload()` supprimé).
Il invoque le callback `onRefresh` → `loadAllData()` dans `AdminApp.jsx`, qui rappelle l'API et met à jour l'état React localement.

```
[Bouton Actualiser] → handleRefresh() → onRefresh() → loadAllData() → setState(...)
```

---

## 🗂️ Normalisation des Données (Règle 9 — AGENTS.md)

Tous les composants admin extraient et normalisent leurs données **avant le bloc `return()`** :

- **`Dashboard.jsx`** : `totalVisitors`, `diagsStarted`, `treeChartData`, `recentDiags` — déclarés en tête de composant.
- **`AdminTreeChart.jsx`** : `rootNode` et `branchNodes[]` — objets complets construits avant le JSX.
- **`AdminBreakdownWidget.jsx`** : `regionData`, `sectorData`, `profileData` — mappés depuis l'API avec fallbacks explicites.
- **`AdminBubbleChart.jsx`** : `sorted`, `maxCount`, `totalExecutions`, `topModule` — calculés avant le rendu.

---

## 🛡️ Mapping API & Fallbacks Explicites (Règle 7 — AGENTS.md)

Les champs API sont utilisés avec leurs noms exacts. Les fallbacks utilisent des chaînes de référence pour faciliter le débogage :

```js
// ✅ Conforme
label: s.region ?? '[region non disponible]'
count: s.diagnostic_count ?? s.count ?? 0

// ❌ Non conforme (à éviter)
label: s.sector || s.region || 'Inconnu'
```

---

## 🧩 Composants du Dashboard Admin

### `AdminBubbleChart`
- **Props** : `moduleStats[]` — tableau d'objets `{ code, name, count }`
- **Comportement** : Taille des bulles proportionnelle à `count`. Tooltip unique rendu via `ReactDOM.createPortal()` dans `document.body` (évite les conflits CSS avec les `transform` parents).

### `AdminTreeChart`
- **Props** : `data` — objet `{ total_visitors, started, abandoned_first_run, completed_first_only, completed_enrichment, completed }`
- **Comportement** : Affiche l'entonnoir de conversion en 1 nœud racine + 3 branches. Tous les calculs de pourcentage se font avant le rendu.

### `AdminBreakdownWidget`
- **Props** : `topSectors[]`, `userProfiles[]`, `sectorStats[]`
- **Comportement** : Widget à onglets (Régions / Secteurs / Profil). Aucune donnée fictive — si les props sont vides, un message explicite est affiché.
- **Champs attendus par onglet** :
  - Région : `{ region, diagnostic_count }`
  - Secteur : `{ sector, diagnostic_count }`
  - Profil : `{ profile, diagnostic_count }`

---

## 🔁 Connexion Backend

Le client HTTP central est dans `src/api/config.js` (`apiFetch`). Il gère :
- L'injection du header `Authorization: Bearer <token>`
- La base URL (`VITE_API_URL` ou `https://business-chekcup.nicktep.com/api/bc`)
- Les erreurs HTTP (retourne des exceptions catchées par les Services)
