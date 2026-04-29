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

- **Docker** et **Docker Compose** (plugin `docker compose`)
- Réseau externe **`postgres_network`** si vous suivez l’infra VPS partagée (voir `.cursor/rules/infrastructure-vps.mdc`)

## Lancer le site (Docker uniquement)

Ce dépôt n’est **pas** prévu pour `pnpm dev` / `next dev` sur la machine hôte : les scripts `dev`, `build` et `start` affichent un message d’erreur explicite.

```bash
cd pretimmopro
cp .env.example .env
# Éditer .env (AdSense, Matomo, URL publique, etc.)

docker compose up --build
```

L’app est exposée sur **`http://localhost:${HOST_PORT:-3000}`** (voir `HOST_PORT` dans `.env` / `docker-compose.yml`).

Les emplacements AdSense utilisent les vraies clés fournies dans l’environnement du conteneur ; sans configuration, les placeholders peuvent s’afficher selon les composants.

Le **sitemap** et **robots** sont produits au build Next dans l’image.

### Alternative hébergée (optionnel)

Un déploiement type **Vercel** reste possible techniquement (build Next classique + variables d’environnement dans le dashboard), mais le flux documenté et les variables d’exemple sont orientés **Docker / VPS**.

## Configuration AdSense

### 1. Obtenir votre ID AdSense

1. Créez un compte sur [Google AdSense](https://www.google.com/adsense/)
2. Ajoutez votre site `pretimmopro.fr`
3. Récupérez votre ID client (format `ca-pub-XXXXXXXXXXXXXXXX`)

### 2. Remplacer les IDs dans le projet

Dans **`.env`** (chargé par Docker Compose, non versionné) :

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
│   ├── layout.tsx              # Layout racine (metadataBase, HTML)
│   ├── globals.css
│   ├── sitemap.ts              # Sitemap XML (FR + EN)
│   ├── robots.ts               # robots.txt dynamique
│   └── [locale]/               # Routes next-intl (outils, articles, villes…)
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
│   ├── cities.ts               # Données des 8 villes
│   ├── seo-alternates.ts       # Canonical + hreflang FR/EN
│   └── sitemap-build.ts        # Liste des URLs pour app/sitemap.ts
├── content/
│   └── articles/               # Articles MDX
│       ├── taux-endettement.mdx
│       ├── documents-dossier-pret.mdx
│       └── ptz-2026.mdx
├── public/
├── next.config.js
├── tailwind.config.ts
└── .env                 # copie de .env.example (Docker Compose), non versionné
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
| `pnpm docker:up` / `docker compose up --build` | Construire l’image et lancer le conteneur |
| `pnpm docker:down` / `docker compose down` | Arrêter les conteneurs du projet |
| `pnpm dev` / `pnpm build` / `pnpm start` | **Désactivés** — message invitant à utiliser Docker |
| `pnpm lint` | ESLint (peut s’exécuter hors conteneur pour la CI / l’éditeur) |
| `pnpm generate-prices` | Script Node utilitaire (données villes) |

## Licence

Projet propriétaire — Tous droits réservés.
