import type { MetadataRoute } from 'next'
import { shouldBlockSearchIndexing } from '@/lib/seo-env'
import { siteOrigin } from '@/lib/seo-alternates'

export default function robots(): MetadataRoute.Robots {
  const base = siteOrigin()
  if (shouldBlockSearchIndexing()) {
    return {
      rules: { userAgent: '*', disallow: '/' },
    }
  }
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
