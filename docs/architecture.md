# Architecture du Projet — FUND.lab

Ce document décrit l'organisation du projet FUND.lab, la structure de ses dossiers et le fonctionnement du flux de données dans cette architecture "Backend Ready".

---

## 📂 Organisation des Dossiers

Le projet est structuré pour isoler le code visuel (React) des couches de logique d'affaires et de stockage :

```
src/
├── api/                # Abstraction des appels réseau (diagnosticsApi, questionnairesApi, etc.)
├── mocks/              # Données simulées centralisées (mockData.js)
├── repositories/       # Abstraction du stockage local (LocalStoreRepository.js)
├── services/           # Services métier encapsulant la logique d'affaires
├── components/         # Composants UI (layout, screens, ui réutilisables)
├── data/               # Données statiques historiques de démarrage
├── index.css           # Design system centralisé
└── main.jsx            # Point d'entrée de l'application
```

---

## 🔄 Flux de Données (Data Flow)

Pour que l'application soit totalement découplée et prête à migrer vers un backend :
1. **Composants React (Vue)** : Ils n'interrogent jamais les mocks ou les fichiers locaux directement. Ils appellent uniquement les **Services**.
2. **Services (Métier)** : Ils valident les requêtes, exécutent les calculs métier (ex: moteur de scoring) et appellent les modules de l'**API**.
3. **API (Réseau)** : Ils simulent des appels réseau asynchrones en renvoyant des promesses (`Promise.resolve()`) qui lisent ou écrivent dans la **Base locale** (Repository).
4. **Repository (Persistance)** : Il gère les lectures et écritures physiques (actuellement dans le `localStorage` du navigateur).

```
[Composant UI]
      │ (Appel Service)
      ▼
[Services Métier] (DiagnosticService, QuestionService, etc.)
      │ (Appel API asynchrone)
      ▼
[API Mocks] (diagnosticsApi, questionsApi, etc. - retourne des Promises)
      │ (Lecture/Écriture brute)
      ▼
[Repository] (LocalStoreRepository - localStorage)
```

---

## 🛡️ Avantages de cette architecture

* **Prête pour le Backend** : Pour connecter l'application à un vrai serveur REST, il suffit de modifier les fichiers de la couche `src/api/` (remplacer les retours Mock par des requêtes `fetch` ou `axios`). Le reste de l'application (Services et Composants) restera rigoureusement identique.
* **Persistance complète** : Toutes les créations ou suppressions faites dans le panneau administrateur ou les soumissions de diagnostics utilisateurs sont conservées en local, offrant une démonstration 100% réaliste.
