/**
 * Résolution dynamique d'une ville française via geo.api.gouv.fr (API officielle, CORS open).
 * Utilisé pour les pages /taux-immobilier/[ville] lorsque la ville n'est pas dans la liste statique.
 *
 * - Timeout strict de 3 secondes (AbortController)
 * - Cache Next.js ISR : revalidation toutes les 24h
 * - Slug → nom → commune → données estimées depuis departmentData.ts
 */

import { getDepartmentData, type PtzZone } from './departmentData'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DynamicCity {
  slug: string
  nom: string
  departement: string          // code département : "38"
  nomDepartement: string       // "Isère"
  codeInsee: string            // "38185"
  codePostal: string           // "38000"
  tauxMoyen: number            // taux estimé sur 20 ans
  prixM2: number               // prix moyen estimé €/m²
  nbCourtiers: number          // estimation
  ptzZone: PtzZone
  population: number
  isDynamic: true              // marqueur : données estimées, pas statiques
}

interface GeoCommune {
  nom: string
  code: string
  departement: { code: string; nom: string }
  codesPostaux?: string[]
  population?: number
}

// ─── Normalisation slug ───────────────────────────────────────────────────────

/**
 * Convertit un nom de ville en slug URL.
 * Ex : "Saint-Étienne" → "saint-etienne", "Aix-en-Provence" → "aix-en-provence"
 */
export function cityToSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // supprime les accents
    .replace(/['\u2019]/g, '-')        // apostrophes → tiret
    .replace(/\s+/g, '-')             // espaces → tirets
    .replace(/[^a-z0-9-]/g, '')       // supprime les autres caractères
    .replace(/-+/g, '-')              // collapse multi-tirets
    .replace(/^-|-$/g, '')            // trim tirets aux extrémités
}

/**
 * Convertit un slug en terme de recherche.
 * Ex : "saint-etienne" → "saint etienne"
 */
function slugToQuery(slug: string): string {
  return slug.replace(/-/g, ' ')
}

// ─── Fetch geo.api.gouv.fr ────────────────────────────────────────────────────

const GEO_API = 'https://geo.api.gouv.fr/communes'
const TIMEOUT_MS = 3000

export async function searchCommunes(query: string, limit = 8): Promise<GeoCommune[]> {
  if (!query.trim() || query.length < 2) return []

  const url = new URL(GEO_API)
  url.searchParams.set('nom', query)
  url.searchParams.set('fields', 'nom,code,departement,codesPostaux,population')
  url.searchParams.set('format', 'json')
  url.searchParams.set('boost', 'population')
  url.searchParams.set('limit', String(limit))

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return []
    return (await res.json()) as GeoCommune[]
  } catch {
    return []
  } finally {
    clearTimeout(timer)
  }
}

// ─── Résolution slug → DynamicCity ───────────────────────────────────────────

function buildDynamicCity(slug: string, commune: GeoCommune): DynamicCity {
  const deptCode = commune.departement?.code ?? '75'
  const deptData = getDepartmentData(deptCode)
  const codePostal = commune.codesPostaux?.[0] ?? `${deptCode}000`
  const population = commune.population ?? 10_000

  const tauxMoyen = Math.round((3.45 + deptData.rateAdjust) * 100) / 100
  const nbCourtiers = Math.max(3, Math.min(350, Math.round(population / 1500)))

  return {
    slug,
    nom: commune.nom,
    departement: deptCode,
    nomDepartement: commune.departement?.nom ?? deptData.nom,
    codeInsee: commune.code,
    codePostal,
    tauxMoyen,
    prixM2: deptData.avgPriceM2,
    nbCourtiers,
    ptzZone: deptData.ptzZone,
    population,
    isDynamic: true,
  }
}

/**
 * Résout un slug de ville en données complètes.
 * Cherche d'abord une correspondance exacte (nom normalisé), puis prend la commune la plus peuplée.
 * Retourne null si aucune commune française n'est trouvée.
 */
export async function fetchCityBySlug(slug: string): Promise<DynamicCity | null> {
  const query = slugToQuery(slug)
  const communes = await searchCommunes(query, 10)
  if (!communes.length) return null

  // Préférer la correspondance exacte de slug
  const exactMatch = communes.find((c) => cityToSlug(c.nom) === slug)
  const best = exactMatch ?? communes[0]

  return buildDynamicCity(slug, best)
}
