/**
 * Récupération dynamique du prix au m² et du nombre de courtiers par ville.
 *
 * Sources :
 *  1. API DV3F CEREMA       — prix médian au m² par commune (données DVF officielles)
 *  2. API Recherche Entreprises (data.gouv.fr) — nombre d'établissements actifs APE 6619B par département
 *
 * Stratégie :
 *  - Cache Next.js ISR : revalidation toutes les 30 jours (revalidate: 2592000).
 *  - Timeout strict de 5 secondes par appel.
 *  - En cas d'erreur ou de timeout, retour aux valeurs statiques de fallback.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CityStatsInput {
  codeInsee: string
  departement: string
  prixM2: number
  nbCourtiers: number
}

export interface CityStats {
  prixM2: number
  nbCourtiers: number
  source: 'api' | 'static_fallback'
  fetchedAt: string
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const CACHE_REVALIDATE = 2592000 // 30 jours en secondes
const FETCH_TIMEOUT_MS = 5000

// ─── Timeout helper ───────────────────────────────────────────────────────────

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    return await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: CACHE_REVALIDATE },
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timer)
  }
}

// ─── Prix m² — API DV3F CEREMA ────────────────────────────────────────────────

/**
 * Retourne le prix médian au m² (appartements) pour une commune donnée.
 * Doc : https://apidf-preprod.cerema.fr/swagger/
 */
async function fetchPrixM2(codeInsee: string): Promise<number | null> {
  try {
    const url = `https://apidf-preprod.cerema.fr/indicateurs/dv3f/communes/${codeInsee}/`
    const res = await fetchWithTimeout(url)
    if (!res.ok) return null
    const json = await res.json()
    // Priorité : appartements (apt), sinon tous types confondus
    const prixApt = json?.prixm2_median_apt ?? json?.prixm2_median ?? null
    if (prixApt == null) return null
    return Math.round(Number(prixApt))
  } catch {
    return null
  }
}

// ─── Courtiers — API Recherche Entreprises data.gouv.fr ───────────────────────

/**
 * Retourne le nombre d'établissements actifs avec le code APE 6619B
 * (courtiers en opérations de banque) dans un département donné.
 * Doc : https://recherche-entreprises.api.gouv.fr/docs/
 */
async function fetchNbCourtiers(departement: string): Promise<number | null> {
  try {
    const url = `https://recherche-entreprises.api.gouv.fr/search?activite_principale=6619B&departement=${departement}&per_page=1`
    const res = await fetchWithTimeout(url)
    if (!res.ok) return null
    const json = await res.json()
    const total = json?.total_results ?? null
    if (total == null) return null
    return Number(total)
  } catch {
    return null
  }
}

// ─── Fonction principale exportée ────────────────────────────────────────────

/**
 * Retourne les statistiques dynamiques pour une ville.
 * Appels en parallèle avec fallback sur les valeurs statiques de cities.ts.
 */
export async function getCityStats(city: CityStatsInput): Promise<CityStats> {
  const [prixM2Result, nbCourtiersResult] = await Promise.allSettled([
    fetchPrixM2(city.codeInsee),
    fetchNbCourtiers(city.departement),
  ])

  const prixM2Live =
    prixM2Result.status === 'fulfilled' && prixM2Result.value !== null
      ? prixM2Result.value
      : null

  const nbCourtiersLive =
    nbCourtiersResult.status === 'fulfilled' && nbCourtiersResult.value !== null
      ? nbCourtiersResult.value
      : null

  const isLive = prixM2Live !== null || nbCourtiersLive !== null

  return {
    prixM2:      prixM2Live      ?? city.prixM2,
    nbCourtiers: nbCourtiersLive ?? city.nbCourtiers,
    source:      isLive ? 'api' : 'static_fallback',
    fetchedAt:   new Date().toISOString(),
  }
}
