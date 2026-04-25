---
name: audit-seo-complet
description: >-
  Optimise et audite le SEO technique et éditorial d’un site (métadonnées, robots,
  sitemap, balisage, données structurées, mots-clés, qualité des textes, vocabulaire
  varié sur l’ensemble des contenus). À utiliser lorsque l’utilisateur demande un
  audit SEO, d’améliorer le référencement, la rédaction web, les robots, les meta,
  le sitemap, le maillage, ou la visibilité sur les moteurs de recherche.
---

# Audit SEO complet

## Objectif

Passer le site au crible **technique + sémantique + rédactionnel** : ce qui est visible par les crawlers, ce qui manque, l’alignement avec les **intentions et mots-clés** du projet, et la **qualité des textes** (clarté, crédibilité, **vocabulaire varié** sans répétitions paresseuses ni sur-optimisation).

## Avant d’agir

1. Identifier la **pile** (ex. Next.js App Router, next-intl) et où vivent les métas (`generateMetadata`, `layout.tsx`, `sitemap.ts`, `robots.ts`).
2. Lire les **règles projet** existantes (ex. `.cursor/rules/seo.mdc`, `content.mdc`) et les respecter.
3. Noter le **positionnement cible** (marche + thématiques prioritaires) à partir du contenu réel du site (home, outils, guides).

## Checklist technique (robots & crawl)

- [ ] **`robots.txt`** : présent, cohérent avec l’environnement (noindex staging si applicable), pas de blocage accidentel des assets critiques.
- [ ] **`robots` meta / headers** : pages sensibles (recherche dynamique, erreurs) en `noindex` si besoin ; pages stratégiques en `index, follow`.
- [ ] **Sitemap** : généré, à jour, URLs canoniques, locales (`hreflang` / chemins `[locale]` si multilingue).
- [ ] **Canonical** : une URL préférée par page ; pas de duplicate content évident (www / trailing slash / locale).
- [ ] **Status HTTP** : pas de chaînes de redirection inutiles ; 404 propres pour contenus supprimés.

## Checklist métadonnées & SERP

- [ ] **Title** : unique, ≤ ~60 car. utiles, mot-clé principal en début si naturel.
- [ ] **Meta description** : unique, incitative, longueur raisonnable (~150–160 car.), alignée avec la page.
- [ ] **Open Graph / Twitter** : `og:title`, `description`, `image`, `url` ; image utilisable (dimensions, poids).
- [ ] **H1** : un par page, aligné avec l’intention ; hiérarchie H2–H3 logique.
- [ ] **Données structurées** : JSON-LD pertinent (`WebSite`, `Organization`, `FAQPage`, `BreadcrumbList`, `SoftwareApplication` pour outils, etc.) ; valider la cohérence avec le contenu visible.

## Checklist mots-clés & contenu

- [ ] **Cartographie** : 1 intention principale par URL (outil vs guide vs page locale).
- [ ] **Mots-clés** : titres, Hn, premiers paragraphes, ancres internes — sans bourrage ; synonymes et variantes naturelles (ex. crédit immobilier / prêt immo).
- [ ] **Maillage interne** : liens contextuels entre guides ↔ simulateurs ↔ pages locales ; ancres descriptives.
- [ ] **Images** : `alt` utiles ; pas d’images lourdes sans `sizes`/formats modernes si impact LCP.
- [ ] **i18n** : métas et titres traduits ; pas de mélange FR/EN dans une même locale.

## Performance & signaux indirects SEO

- [ ] **Core Web Vitals** : LCP, CLS, INP — éviter JS inutile au-dessus de la ligne de flottaison, fonts, images.
- [ ] **Liens externes** : `rel="noopener noreferrer"` sur cibles `_blank` ; pas de liens cassés évidents sur pages pilier.

## Livrable attendu

1. **Synthèse** : forces / faiblesses / risques (priorisés P0–P2).
2. **Liste d’actions** : modifications concrètes par fichier ou zone du site.
3. **Implémenter** les correctifs demandés ou P0 ; ne pas élargir hors périmètre SEO sans accord.

## Outils (à lancer si l’environnement le permet)

- Inspection des routes : `grep` / lecture `app/`, `sitemap.ts`, `robots.ts` ; pour le texte : `content/articles/`, `messages/fr.json` (et `en.json` si applicable).
- Validations : Rich Results Test / Schema (manuel), Lighthouse (manuel ou CI).
- Pas d’invention d’URLs de production : utiliser `NEXT_PUBLIC_SITE_URL` ou équivalent documenté dans le repo.

## Anti-patterns

- Ne pas promettre un « classement Google » ; parler d’alignement technique et de réduction de friction crawl/SERP.
- Ne pas dupliquer des meta sur toutes les pages dynamiques (villes, articles).
- Ne pas indexer des pages vides ou quasi vides (noindex + qualité contenu).
