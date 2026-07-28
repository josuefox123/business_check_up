# Workspace Agent Rules - Business Check-up

## Frontend Architecture & Resilience Guidelines

### 1. Résilience & Dégradation Gracieuse (Graceful Degradation)
- Ne jamais bloquer brutalement l'intégralité de l'application ni recharger la page (`window.location.href = '/'`) lors d'un échec d'API ponctuel.
- Conserver au maximum la navigation et la progression de l'utilisateur en cours.

### 2. Gestion des Erreurs Transitoires & Stratégie de Réessai (Retry Pattern & State Preservation)
- Proposer systématiquement un mécanisme de réessai (*Retry*) pour les requêtes réseau ayant échoué.
- Préserver l'état local (`state`) et la progression du formulaire/diagnostic pendant le réessai de la connexion.

### 3. Isolation des Erreurs de Connectivité (Connectivity Boundary Isolation)
- Ne pas basculer l'application entière en mode `isOffline` sur un simple échec de requête HTTP/API (ex: 50x ou timeout isolé).
- Réserver les écrans de blocage global uniquement aux déconnexions réseau réelles du navigateur (`navigator.onLine === false`) ou à l'absence totale prolongée de réponse du serveur.

### 4. Feedback Contextuel & Erreurs Localisées
- Préférer les notifications/bannières contextuelles ou les modals d'erreur localisées pour une action échouée au lieu d'un composant de blocage racine plein écran.

## API Client & Networking Guidelines

### 5. Standardisation du Fetch Wrapper & Authentification / Session
- Respecter les conventions HTTP standards dans les wrappers API (`apiFetch`).
- Privilégier les mécanismes d'authentification et de session standards (`Authorization: Bearer <token>` et/ou `credentials: 'include'`) au lieu d'en-têtes personnalisés non standards.

### 6. Gestion des Redirections HTTP & Prévention des Blocages CORS (Preflight / 307 Redirects)
- S'assurer de viser directement les URL canoniques de l'API pour éviter les redirections intermédiaires (`301`, `302`, `307`) sur des requêtes Cross-Origin.
- Les redirections sur des requêtes avec en-têtes personnalisés déclenchent des requêtes Preflight (`OPTIONS`) qui échouent souvent en CORS si la redirection n'est pas proprement gérée par le serveur.

### 7. Conformité du Mapping API & Valeurs par Défaut Explicites (Schema Integrity & Debuggable Fallbacks)
- Utiliser **strictement les noms exacts des clés/variables** retournées par le modèle backend ou la documentation d'API. Ne jamais inventer ou supposer des noms similaires.
- En cas de besoin de valeur par défaut (fallback avec `??` ou `||`), privilégier une chaîne explicite faisant directement référence au nom du champ d'origine (ex: `restitution?.scoring?.band_label ?? "[band_label non disponible]"`) afin de comprendre immédiatement la provenance de l'absence de donnée lors du débogage.

### 8. Bannissement des Icônes Hardcodées Aléatoires & Textes Factices (No Hardcoded Assets or Mock Arrays)
- Ne jamais utiliser de tableaux d'icônes aléatoires ou tournantes (ex: `const icons = [<EyeOff />, <FileMinus />]`) basées sur un modulo d'index pour feindre de la variété visuelle.
- Ne pas réinventer ou injecter de listes de textes factices d'exemples comme fallback. Si une liste dynamique est vide ou absente de l'API, utiliser la règle de fallback explicite.
- Préférer l'utilisation d'icônes SVG sémantiques isolées (ex: composants Lucide-react) au lieu d'emojis hardcodés directement dans les chaînes de caractères.

### 9. Normalisation des Données avant le Rendu (Data Mapping & Separation of Concerns)
- Toujours **extraire, déclarer et normaliser** les données de l'API (avec leurs valeurs de repli explicites) au début de la fonction du composant React, avant le bloc `return ()`.
- Ne pas effectuer d'évaluations conditionnelles complexes ou de chaînages d'objets profonds directement au milieu des balises JSX.
- Conserver le JSX pur, clair et lisible en s'appuyant exclusivement sur les variables localement préparées et normalisées.

## Audit & Auto-Validation

### 10. Auto-Validation Obligatoire et Indivisible (Full Compliance Verification)
- Il est strictement interdit d'appliquer une règle de ce document en ignorant ou en altérant les exigences des autres.
- Avant de déclarer un fichier ou un composant conforme, l'agent doit réévaluer le code modifié au filtre de **l'intégralité des règles énoncées dans ce document** sans exception.
- Toute affirmation de conformité doit être étayée par la confirmation que TOUTES les règles en vigueur (résilience, réseau, mapping API, fallbacks explicites, absence de mock/emojis, et normalisation) ont été vérifiées conjointement.





