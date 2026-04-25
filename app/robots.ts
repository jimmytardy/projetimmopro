import type { MetadataRoute } from 'next'
import { siteOrigin } from '@/lib/seo-alternates'

export default function robots(): MetadataRoute.Robots {
  const base = siteOrigin()
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
