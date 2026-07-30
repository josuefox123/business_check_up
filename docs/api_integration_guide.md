# Guide d'Intégration API — FUND.lab

Ce guide décrit l'architecture de la couche réseau actuelle et les bonnes pratiques à suivre lors de l'ajout ou de la modification d'endpoints.

> **Base URL** : `https://business-chekcup.nicktep.com/api/bc`

---

## 🔌 1. Client HTTP Central — `apiFetch`

Tous les appels réseau passent par le wrapper centralisé `apiFetch` dans `src/api/config.js`.
Il injecte automatiquement le token d'authentification et la base URL.

```javascript
// src/api/config.js (structure existante)
const BASE_URL = import.meta.env.VITE_API_URL || 'https://business-chekcup.nicktep.com/api/bc';

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('admin_token');
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${path}`);
  return res.json();
}
```

> **Règle 5 (AGENTS.md)** : Utiliser `Authorization: Bearer <token>` et/ou `credentials: 'include'`. Ne pas inventer des en-têtes non standards.

---

## 🗺️ 2. Ajouter un Nouvel Endpoint

### Exemple : intégration de `/admin/dashboard/territory`

**Étape 1 — Déclarer la fonction dans `statistiquesApi.js`**
```javascript
// src/api/statistiquesApi.js
export const statistiquesApi = {
  // ...endpoints existants...
  getTerritoryStats() {
    return apiFetch('/admin/dashboard/territory');
  },
};
```

**Étape 2 — Exposer via `StatistiqueService.js`**
```javascript
// src/services/StatistiqueService.js
export const StatistiqueService = {
  getTerritoryStats: () => statistiquesApi.getTerritoryStats()
    .then(res => res.data?.regions ?? []),
};
```

**Étape 3 — Appeler depuis `AdministrationService.js`**
```javascript
export const AdministrationService = {
  statistics: {
    getTerritoryStats: () => StatistiqueService.getTerritoryStats(),
  }
};
```

**Étape 4 — Charger depuis `AdminApp.jsx`**
```javascript
// Dans loadAllData()
AdministrationService.statistics.getTerritoryStats().then(setTopSectors);
```

> **Règle 6 (AGENTS.md)** : Toujours cibler l'URL canonique directement. Les redirections 301/307 sur des requêtes cross-origin avec `Authorization` déclenchent des preflight CORS qui peuvent échouer.

---

## 🔁 3. Mapping API — Règles de Nommage

> **Règle 7 (AGENTS.md)** : Utiliser strictement les noms exacts des champs retournés par l'API.

| Endpoint | Champ API | Variable frontend |
|---|---|---|
| `/dashboard/overview` | `data.traffic.total_visitors` | `totalVisitors` |
| `/dashboard/overview` | `data.diagnostics.abandoned_first_run` | `abandonedFirst` |
| `/dashboard/territory` | `data.regions[].region` | `label` dans `regionData` |
| `/dashboard/territory` | `data.regions[].diagnostic_count` | `count` dans `regionData` |
| `/stats/modules` | `[].code` | Identifiant affiché dans la bulle |
| `/stats/modules` | `[].name` | Nom affiché dans le tooltip |
| `/stats/modules` | `[].count` | Taille de la bulle |

**Fallbacks explicites (conforme Règle 7)** :
```javascript
// ✅ Conforme — référence le champ source dans le fallback
label: s.region ?? '[region non disponible]'
count: s.diagnostic_count ?? s.count ?? 0

// ❌ Non conforme — fallback générique opaque
label: s.region || s.sector || 'Inconnu'
```

---

## 🛡️ 4. Gestion des Erreurs (Règles 1–4 AGENTS.md)

Ne jamais bloquer toute l'application sur un échec d'API isolé.

```javascript
// ✅ Conforme — isolation de l'erreur, l'app reste fonctionnelle
AdministrationService.statistics.getTerritoryStats()
  .then(setTopSectors)
  .catch(err => {
    console.warn('[territory] Chargement échoué :', err.message);
    // setTopSectors reste sur sa valeur initiale []
    // => AdminBreakdownWidget affiche "Aucune donnée disponible"
  });

// ❌ Non conforme — rechargement brutal
.catch(() => window.location.href = '/');
```

---

## 🔧 5. Proxy de Développement Local (Vite)

Si vous développez localement avec un backend sur `localhost:3001` :

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
```

---

## 📋 6. Checklist — Intégration d'un Nouvel Endpoint

Avant de déclarer un endpoint prêt :

- [ ] URL canonique visée directement (pas de redirection 301/307)
- [ ] Header `Authorization: Bearer <token>` injecté via `apiFetch`
- [ ] Champs API mappés avec leurs noms **exacts**
- [ ] Fallbacks explicites nommant le champ source (`?? '[champ non disponible]'`)
- [ ] Erreurs catchées localement — pas de blocage global de l'app
- [ ] Données normalisées avant le JSX (pas de chaînage profond dans le `return()`)
- [ ] Aucune donnée fictive hardcodée en fallback (afficher un état vide explicite)
