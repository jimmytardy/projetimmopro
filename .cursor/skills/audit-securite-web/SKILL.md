---
name: audit-securite-web
description: >-
  Audite la sécurité d’une application web : vulnérabilités applicatives courantes
  (XSS, CSRF, injection, en-têtes, cookies, auth), surface d’attaque, et dette des
  dépendances / versions de framework. À utiliser pour un audit sécurité, hardening,
  npm audit, mises à jour, OWASP, ou prévention DDoS/XSS côté app.
---

# Audit sécurité web

## Objectif

Évaluer la **surface d’attaque**, les **contrôles défensifs** réalisables au niveau application (le DDoS volumétrique se traite surtout infra / CDN / WAF — le skill couvre ce qui est pertinent côté code et config).

## Avant d’agir

1. Identifier **stack** (Next.js, API routes, middleware, auth, cookies, headers).
2. Ne pas exécuter de tests intrusifs sur des systèmes tiers sans cadre légal explicite ; se limiter au **repo** et à l’**analyse statique** + commandes read-only (`npm audit`, lecture de config).

## Vulnérabilités applicatives courantes

### XSS (Cross-Site Scripting)

- [ ] Sorties HTML : éviter `dangerouslySetInnerHTML` non maîtrisé ; sanitizer si Markdown/HTML utilisateur.
- [ ] URLs / redirections : valider les cibles (`open redirect`).
- [ ] **CSP** (Content-Security-Policy) : présence, directives progressives ; `unsafe-inline` / `unsafe-eval` documentés et minimisés.

### CSRF

- [ ] Mutations d’état : cookies `SameSite`, tokens pour formulaires sensibles si sessions cookie.
- [ ] APIs : auth claire (Bearer vs cookie), CORS restrictif en production.

### Injections & accès données

- [ ] **SQL** : requêtes paramétrées uniquement si SQL direct ; pas de concaténation utilisateur.
- [ ] **NoSQL / commandes** : pas d’évaluation de chaînes utilisateur.
- [ ] **Path traversal** : pas de `fs` avec chemins utilisateur non normalisés / non allowlistés.

### SSRF & réseau

- [ ] Fetch serveur vers URLs utilisateur : allowlist de domaines, timeouts, pas de métadonnées cloud via URL contrôlée par l’attaquant.

### Authentification & sessions

- [ ] Secrets : uniquement variables d’environnement, jamais dans le dépôt.
- [ ] Cookies session : `HttpOnly`, `Secure`, `SameSite` adapté.
- [ ] Rate limiting / anti-bruteforce sur endpoints sensibles si applicables.

### Clickjacking & transport

- [ ] **`X-Frame-Options`** ou CSP `frame-ancestors`.
- [ ] **HTTPS** : HSTS en prod si applicable côté hébergeur ; pas de contenu mixte.

### Headers de sécurité (checklist rapide)

- [ ] `Content-Security-Policy` (au moins baseline)
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `Referrer-Policy` cohérent
- [ ] `Permissions-Policy` (caméra, géoloc, etc.) restreint si non nécessaire

## DDoS (rappel réaliste)

- Le **DDoS volumétrique** (saturation bande passante) se traite surtout **WAF / CDN / hébergeur / rate limiting réseau**.
- Côté **app** : rate limiting sur routes coûteuses, cache, éviter endpoints amplificateurs (grosses réponses non paginées), timeouts.

## Dépendances & versions (retard de librairies / framework)

1. Exécuter **`npm audit`** (ou `pnpm audit` / `yarn npm audit` selon le lockfile) et classer : critique / haute / modérée.
2. Vérifier **versions** dans `package.json` : Next.js, React, `next-intl`, libs crypto/auth.
3. Consulter **advisories** (GitHub Dependabot, npm) pour les CVE connues sur les versions figées.
4. Proposer une **montée de version** par petits incréments avec note des breaking changes ; lancer le build / tests après changement.

## Livrable attendu

1. **Tableau de risques** : gravité × probabilité (qualitative), lié au code ou à l’absence de contrôle.
2. **Correctifs** : par fichier ou middleware ; éviter le scope creep hors sécurité.
3. **Suivi** : si correction impossible sans refonte, indiquer la mitigation temporaire et la dette.

## Anti-patterns

- Ne pas stocker de secrets dans le client ou dans Git.
- Ne pas « sécuriser » en désactivant des fonctionnalités sans le dire à l’utilisateur.
- Ne pas confondre **audit dépendances** (CVE) et **audit applicatif** (logique métier) : traiter les deux.
