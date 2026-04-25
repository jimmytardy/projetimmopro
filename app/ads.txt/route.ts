import { NextResponse } from 'next/server'

/**
 * Route handler — sert /ads.txt dynamiquement depuis les variables d'environnement.
 *
 * Format ads.txt (IAB Tech Lab) :
 *   <domain>, <publisher-id>, <relationship>, [certification-authority-id]
 *
 * Variables d'environnement utilisées :
 *   NEXT_PUBLIC_ADSENSE_CLIENT_ID   → identifiant AdSense (ex : ca-pub-7401335592359033)
 *   ADSENSE_CERT_AUTH_ID            → certification authority ID Google (f08c47fec0942fa0)
 *   ADS_TXT_EXTRA                   → lignes supplémentaires séparées par \n (autres régies)
 *
 * Pour ajouter une régie publicitaire supplémentaire dans .env.local :
 *   ADS_TXT_EXTRA=openx.com, 123456, DIRECT\nappnexus.com, 789, RESELLER
 */
export async function GET() {
  const clientId  = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? ''
  const certAuthId = process.env.ADSENSE_CERT_AUTH_ID ?? ''
  const extra      = process.env.ADS_TXT_EXTRA ?? ''

  const lines: string[] = []

  // Ligne Google AdSense principale
  if (clientId) {
    // NEXT_PUBLIC_ADSENSE_CLIENT_ID = "ca-pub-XXXX"
    // ads.txt attend "google.com, pub-XXXX, DIRECT, <certId>"
    const publisherId = clientId.startsWith('ca-') ? clientId.slice(3) : clientId
    const certPart    = certAuthId ? `, ${certAuthId}` : ''
    lines.push(`google.com, ${publisherId}, DIRECT${certPart}`)
  }

  // Lignes supplémentaires (autres régies, RESELLER, etc.)
  if (extra) {
    const extraLines = extra
      .split(/\\n|\n/)
      .map((l) => l.trim())
      .filter(Boolean)
    lines.push(...extraLines)
  }

  const content = lines.join('\n') + '\n'

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type':  'text/plain; charset=utf-8',
      // Cache 24h côté CDN/navigateur, revalidé en arrière-plan (stale-while-revalidate)
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  })
}
