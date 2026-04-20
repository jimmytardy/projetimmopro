# PrêtImmoPro

Site de crédit immobilier français optimisé pour AdSense et le SEO, construit avec Next.js 14 (App Router) et TypeScript.

## Fonctionnalités

- **5 simulateurs interactifs** : Prêt immobilier, Capacité d'emprunt, Frais de notaire, Remboursement anticipé, Taux fixe vs variable
- **8 pages locales** : Taux immobiliers par ville (Paris, Lyon, Marseille, Bordeaux, Toulouse, Nantes, Nice, Strasbourg)
- **Blog MDX** : Articles SEO sur le crédit immobilier
- **SEO technique** : Sitemap XML, Schema.org JSON-LD, métadonnées Open Graph
- **AdSense-ready** : Composant AdUnit avec lazy loading et anti-CLS
- **Performances** : Server Components, dynamic imports, skeleton loaders

## Prérequis

- Node.js 18+
- npm 9+

## Installation

```bash
cd pretimmopro
npm install
```

## Développement

```bash
npm run dev
```

L'application est disponible sur [http://localhost:3000](http://localhost:3000).

En développement, les emplacements AdSense affichent des **placeholders gris** à la place des vraies publicités.

## Build de production

```bash
npm run build
```

Le script `postbuild` génère automatiquement le sitemap XML et le fichier `robots.txt`.

## Déploiement sur Vercel

### Méthode 1 — Via l'interface Vercel (recommandée)

1. Poussez votre code sur GitHub/GitLab/Bitbucket
2. Connectez-vous sur [vercel.com](https://vercel.com)
3. Cliquez "New Project" et importez votre dépôt
4. Configurez les variables d'environnement (voir ci-dessous)
5. Cliquez "Deploy"

### Méthode 2 — Via la CLI Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Variables d'environnement sur Vercel

Dans le dashboard Vercel > Settings > Environment Variables, ajoutez :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | `ca-pub-XXXXXXXXXXXXXXXX` | Votre ID AdSense |
| `NEXT_PUBLIC_SITE_URL` | `https://pretimmopro.fr` | URL de production |
| `NEXT_PUBLIC_GA_ID` | `G-XXXXXXXXXX` | ID Google Analytics (optionnel) |

## Configuration AdSense

### 1. Obtenir votre ID AdSense

1. Créez un compte sur [Google AdSense](https://www.google.com/adsense/)
2. Ajoutez votre site `pretimmopro.fr`
3. Récupérez votre ID client (format `ca-pub-XXXXXXXXXXXXXXXX`)

### 2. Remplacer les IDs dans le projet

Dans `.env.local` (développement) et sur Vercel (production) :

```bash
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-VOTRE-VRAI-ID
```

### 3. Créer des blocs d'annonces

Dans votre compte AdSense :
1. Créez des blocs d'annonces pour chaque emplacement
2. Remplacez les slots `"XXXX"` dans les fichiers de pages par les vrais IDs de vos blocs

Emplacements prévus :
- `homepage_middle` — Page d'accueil (leaderboard)
- `before_tool_simulateur` — Avant le simulateur de prêt
- `after_tool_simulateur` — Après le simulateur de prêt
- `simulator_middle` — Dans le simulateur (entre inputs et résultats)
- `article_top` — En haut des articles
- `article_bottom` — En bas des articles
- `local_middle` — Pages locales villes

## Structure du projet

```
pretimmopro/
├── app/
│   ├── layout.tsx              # Layout global avec Header/Footer
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Styles globaux + classes utilitaires
│   ├── loading.tsx             # Skeleton loader global
│   ├── (outils)/               # Groupe de routes — pages outils
│   │   ├── simulateur-pret/
│   │   ├── capacite-emprunt/
│   │   ├── frais-notaire/
│   │   ├── remboursement-anticipe/
│   │   └── taux-fixe-vs-variable/
│   ├── (articles)/             # Groupe de routes — articles MDX
│   │   └── [slug]/page.tsx
│   └── taux-immobilier/
│       └── [ville]/page.tsx    # Pages locales (8 villes)
├── components/
│   ├── ads/AdUnit.tsx          # Composant AdSense réutilisable
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── seo/
│   │   ├── JsonLd.tsx          # Schémas schema.org
│   │   └── Breadcrumb.tsx      # Fil d'Ariane + BreadcrumbList JSON-LD
│   └── simulators/
│       ├── SimulateurPret.tsx
│       ├── CapaciteEmprunt.tsx
│       ├── FraisNotaire.tsx
│       ├── RemboursementAnticipe.tsx
│       ├── TauxFixeVsVariable.tsx
│       └── TableauAmortissement.tsx
├── lib/
│   ├── calculators.ts          # Fonctions financières pures
│   └── cities.ts               # Données des 8 villes
├── content/
│   └── articles/               # Articles MDX
│       ├── taux-endettement.mdx
│       ├── documents-dossier-pret.mdx
│       └── ptz-2026.mdx
├── public/
│   └── robots.txt
├── next.config.js
├── next-sitemap.config.js
├── tailwind.config.ts
└── .env.local
```

## Ajouter un article MDX

1. Créez un fichier dans `content/articles/mon-article.mdx`
2. Ajoutez le frontmatter requis :

```mdx
---
title: "Titre de l'article"
description: "Description SEO (150-160 caractères)"
date: "2026-04-20"
lastModified: "2026-04-20"
keywords:
  - mot clé 1
  - mot clé 2
---

Contenu de l'article en Markdown...
```

3. L'article est automatiquement accessible à l'URL `/articles/mon-article`

## Ajouter une ville

1. Dans `lib/cities.ts`, ajoutez une entrée au tableau `CITIES` :

```typescript
{ slug: 'montpellier', nom: 'Montpellier', departement: '34', tauxMoyen: 3.52, prixM2: 3800, nbCourtiers: 87 },
```

2. La page est automatiquement générée à l'URL `/taux-immobilier/montpellier`

## Palette de couleurs

| Couleur | Hex | Usage |
|---------|-----|-------|
| Primary | `#1B4F8C` | Boutons principaux, accents bleus |
| Accent | `#0F6E56` | Indicateurs positifs, vert |
| Background | `#F8FAFC` | Fond de page |
| Coral | `#E07B5A` | Intérêts dans les graphiques |

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement (localhost:3000) |
| `npm run build` | Build de production + génération sitemap |
| `npm run start` | Serveur de production |
| `npm run lint` | Vérification ESLint |

## Licence

Projet propriétaire — Tous droits réservés.
