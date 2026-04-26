/**
 * Synthèse alignée sur la skill `.cursor/skills/audit-seo-complet` — correctifs prioritaires
 * intégrés au code (P0 / fondations). Ne remplace pas Lighthouse ni Rich Results Test manuels.
 */
export const SEO_AUDIT_APPLIED = [
  'robots.txt : disallow total si préprod (NEXT_PUBLIC_NO_INDEX ou VERCEL_ENV=preview).',
  'Sitemap : URLs FR+EN pour /a-propos et piliers /guides/[hub] + priorités dédiées.',
  'Metadata layout : vérification Google Search Console (NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION).',
  'JSON-LD WebSite + Organization (layout locale) pour signaux marque / site.',
  'BreadcrumbList : URLs absolues cohérentes avec hreflang (pathnameForLocale + absoluteUrlFromPath).',
  'E-E-A-T : page À propos, auteur + sources optionnelles sur articles, transparence affiliation.',
  'Maillage : piliers thématiques depuis /guides et pages hub avec outils liés.',
] as const
