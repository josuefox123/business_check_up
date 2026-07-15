# Guide d'Intégration API — FUND.lab

Ce guide décrit comment remplacer la couche de données simulée (Mock API) par des appels HTTP réels vers un serveur backend REST API.

---

## 🔌 1. Étape 1 : Configurer Axios ou Fetch

Créez un client HTTP centralisé (ex: `src/api/client.js`) pour y injecter les headers de sécurité, l'URL de base et la gestion des erreurs :

```javascript
// src/api/client.js
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});
```

---

## 🛠️ 2. Étape 2 : Adapter les fichiers API

Modifiez chaque fichier du dossier `src/api/` pour utiliser le client HTTP au lieu du LocalStoreRepository.

### Exemple : Transition pour `diagnosticsApi.js`

#### Avant (MOCK) :
```javascript
import { LocalStoreRepository } from '../repositories/LocalStoreRepository.js';

export const diagnosticsApi = {
  getAll() {
    return Promise.resolve(LocalStoreRepository.getDiagnostics());
  }
};
```

#### Après (PRODUCTION REST) :
```javascript
import { apiClient } from './client.js';

export const diagnosticsApi = {
  getAll() {
    return apiClient.get('/diagnostics').then(res => res.data);
  },
  getById(id) {
    return apiClient.get(`/diagnostics/${id}`).then(res => res.data);
  },
  create(diag) {
    return apiClient.post('/diagnostics', diag).then(res => res.data);
  },
  delete(id) {
    return apiClient.delete(`/diagnostics/${id}`).then(res => res.data);
  }
};
```

---

## 🎛️ 3. Étape 3 : Configurer le Proxy de Développement (Vite)

Si vous développez localement avec un serveur backend sur le port `3001`, configurez le proxy dans `vite.config.js` pour éviter les erreurs CORS :

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
