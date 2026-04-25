import type { MetadataRoute } from 'next'
import { getStaticSitemapEntries } from '@/lib/sitemap-build'

export default function sitemap(): MetadataRoute.Sitemap {
  return getStaticSitemapEntries()
}
