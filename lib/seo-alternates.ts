import type { Metadata } from 'next'
import { defaultLocale } from '@/i18n/navigation'

export function siteOrigin(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pretimmopro.fr').replace(/\/$/, '')
}

/** URL absolue (origine sans slash final + chemin). */
export function absoluteUrlFromPath(path: string): string {
  const base = siteOrigin()
  if (!path || path === '/') return `${base}/`
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}

/**
 * Chemin URL (comme servi par next-intl, `localePrefix: 'as-needed'`) :
 * `logicalPath` = `/` ou `/guides` (sans préfixe de locale).
 */
export function pathnameForLocale(logicalPath: string, locale: string): string {
  if (logicalPath !== '/' && !logicalPath.startsWith('/')) {
    throw new Error(`logicalPath must start with /, got: ${logicalPath}`)
  }
  if (locale === defaultLocale) {
    return logicalPath === '/' ? '/' : logicalPath
  }
  if (logicalPath === '/') {
    return '/en'
  }
  return `/en${logicalPath}`
}

/** Canonical + hreflang pour une page donnée par son chemin logique. */
export function alternatesForLogicalPath(
  logicalPath: string,
  locale: string
): NonNullable<Metadata['alternates']> {
  const pathFr = pathnameForLocale(logicalPath, 'fr')
  const pathEn = pathnameForLocale(logicalPath, 'en')
  return {
    canonical: pathnameForLocale(logicalPath, locale),
    languages: {
      'fr-FR': absoluteUrlFromPath(pathFr),
      'en-GB': absoluteUrlFromPath(pathEn),
      'x-default': absoluteUrlFromPath(pathFr),
    },
  }
}
