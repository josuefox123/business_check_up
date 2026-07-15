# Business Check-up — Powered by FUND.lab

> Une plateforme d'évaluation et de diagnostic intelligent pour les entrepreneurs et entreprises du Bénin, développée selon les standards SaaS Premium.

---

## 🚀 Démarrage Rapide

### Prérequis
* [Node.js](https://nodejs.org/) (Version 18 ou supérieure recommandée)
* [Git](https://git-scm.com/)

### 1. Clonage du projet
Ouvrez votre terminal et exécutez la commande suivante pour cloner le dépôt :
```bash
git clone https://github.com/josuefox123/business_check_up.git
```

### 2. Accès au répertoire
```bash
cd business_check_up
```

### 3. Installation des dépendances
Installez les packages requis via npm :
```bash
npm install
```

### 4. Lancement de l'environnement de développement
Démarrez le serveur local :
```bash
npm run dev
```
Le projet sera disponible par défaut à l'adresse suivante : **[http://localhost:5176/](http://localhost:5176/)** (ou l'adresse affichée dans votre console).

---

## 📦 Production & Build

### Compiler l'application pour la production
Cette commande génère le dossier de production optimisé `/dist` :
```bash
npm run build
```

### Tester le build localement
Pour prévisualiser le build compilé sur un serveur local :
```bash
npm run preview
```

---

## 🛠️ Stack Technique

* **Framework** : [React](https://react.dev/) (v19)
* **Outillage & Bundler** : [Vite](https://vite.dev/) (v8)
* **Librairie d'icônes** : [Lucide React](https://lucide.dev/)
* **Librairie de graphiques** : [Recharts](https://recharts.org/)
* **Styles** : Vanilla CSS3 avec un design system SaaS Premium
* **Linter** : [Oxlint](https://oxc.rs/)

---

## 📂 Structure des dossiers clés

* `/src/components/layout` : Composants de structure (Navbar fixe responsive, Wrapper d'écran).
* `/src/components/screens` : Pages publiques (Accueil avec carrousel du Bénin, À propos, Contact publique) et écrans interactifs du diagnostic.
* `/src/api` : Logique métier (moteur de scoring, routage et triage de profils).
* `/src/assets` : Images réelles du Bénin pour le carrousel rotatif d'arrière-plan.
* `/src/index.css` : Design system global (variables CSS3, typography, responsive breakpoints).
