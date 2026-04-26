/** Préproduction / previews : ne pas indexer dans les moteurs de recherche. */
export function shouldBlockSearchIndexing(): boolean {
  if (process.env.NEXT_PUBLIC_NO_INDEX === 'true') return true
  if (process.env.VERCEL_ENV === 'preview') return true
  return false
}
