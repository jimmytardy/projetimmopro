import type { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'
import { CITIES } from '@/lib/cities'
import { pathnameForLocale, siteOrigin } from '@/lib/seo-alternates'

const STATIC_LOGICAL = [
  '/',
  '/simulateur-pret',
  '/capacite-emprunt',
  '/frais-notaire',
  '/remboursement-anticipe',
  '/taux-fixe-vs-variable',
  '/guides',
  '/taux-immobilier',
  '/mentions-legales',
  '/cgu',
  '/politique-confidentialite',
] as const

function articleSlugs(): string[] {
  const dir = path.join(process.cwd(), 'content', 'articles')
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map((f) => f.replace(/\.mdx?$/, ''))
}

type ChangeFreq = NonNullable<MetadataRoute.Sitemap[0]>['changeFrequency']

function priorityForLogical(logical: string): { priority: number; changeFrequency: ChangeFreq } {
  let priority = 0.7
  let changeFrequency: ChangeFreq = 'monthly'
  if (logical === '/') {
    priority = 1.0
    changeFrequency = 'weekly'
  } else if (
    [
      '/simulateur-pret',
      '/capacite-emprunt',
      '/frais-notaire',
      '/remboursement-anticipe',
      '/taux-fixe-vs-variable',
    ].includes(logical)
  ) {
    priority = 1.0
    changeFrequency = 'monthly'
  } else if (logical === '/guides') {
    priority = 0.9
    changeFrequency = 'weekly'
  } else if (logical.startsWith('/taux-immobilier/')) {
    priority = 0.7
    changeFrequency = 'weekly'
  } else if (logical === '/taux-immobilier') {
    priority = 0.85
    changeFrequency = 'weekly'
  } else if (
    ['/mentions-legales', '/cgu', '/politique-confidentialite'].includes(logical)
  ) {
    priority = 0.3
    changeFrequency = 'yearly'
  } else if (logical.startsWith('/articles/')) {
    priority = 0.8
    changeFrequency = 'monthly'
  }
  return { priority, changeFrequency }
}

function absoluteUrl(pathname: string): string {
  const base = siteOrigin()
  if (pathname === '/') return `${base}/`
  return `${base}${pathname}`
}

/** Toutes les URLs indexables FR + EN pour `app/sitemap.ts`. */
export function getStaticSitemapEntries(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const logicalPaths: string[] = [
    ...STATIC_LOGICAL,
    ...CITIES.map((c) => `/taux-immobilier/${c.slug}`),
    ...articleSlugs().map((s) => `/articles/${s}`),
  ]

  const out: MetadataRoute.Sitemap = []
  for (const logical of logicalPaths) {
    const { priority, changeFrequency } = priorityForLogical(logical)
    for (const locale of ['fr', 'en'] as const) {
      const pathname = pathnameForLocale(logical, locale)
      out.push({
        url: absoluteUrl(pathname),
        lastModified,
        changeFrequency,
        priority,
      })
    }
  }
  return out
}
