/**
 * Récupération des taux immobiliers depuis les APIs publiques officielles.
 *
 * Sources :
 *  1. Banque de France WebStat API  — taux moyens crédits habitat en France (officiel, mensuel)
 *  2. ECB Data Portal               — taux Euribor 3 mois (quotidien, indicatif)
 *
 * Stratégie : fetch avec cache ISR Next.js (revalidate quotidien).
 * En cas d'erreur réseau, les données statiques de secours sont retournées.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LiveRates {
  /** Taux moyen brut toutes durées confondues (Banque de France) */
  tauxMoyenGlobal: number
  /** Taux par durée standard */
  parDuree: Record<10 | 15 | 20 | 25, number>
  /** Taux Euribor 3 mois (référence taux variables) */
  euribor3m: number | null
  /** Date de la dernière observation disponible */
  dateObservation: string
  /** Source effective des données */
  source: 'banque_de_france' | 'ecb' | 'static_fallback'
  /** Horodatage du fetch */
  fetchedAt: string
}

// ─── Données statiques de secours ────────────────────────────────────────────

const STATIC_FALLBACK: LiveRates = {
  tauxMoyenGlobal: 3.45,
  parDuree: { 10: 3.15, 15: 3.30, 20: 3.45, 25: 3.65 },
  euribor3m: null,
  dateObservation: '2026-04',
  source: 'static_fallback',
  fetchedAt: new Date().toISOString(),
}

// ─── Banque de France WebStat API ─────────────────────────────────────────────
//
// Série : SDER.M.FR.EUR.LDGC.BF.HBS.NDEF.NDEF.A.N.A
// = taux effectif moyen des nouveaux crédits à l'habitat, toutes durées, France
//
// Documentation : https://webstat.banque-france.fr/

const BDF_SERIES_ID = 'SDER.M.FR.EUR.LDGC.BF.HBS.NDEF.NDEF.A.N.A'
const BDF_BASE_URL = 'https://webstat.banque-france.fr/api/explore/v2.1/catalog/datasets/bdf_webstat_series_obs/records'

// Taux par durée : séries spécifiques Banque de France
// Ces séries correspondent aux taux moyens par tranche de durée
const BDF_SERIES_BY_DURATION: Record<number, string> = {
  // Courte durée (≤ 10 ans) — proxy
  10: 'SDER.M.FR.EUR.LDGC.BF.HBS.NDEF.D010.A.N.A',
  // Durée intermédiaire (10-20 ans) — proxy
  15: 'SDER.M.FR.EUR.LDGC.BF.HBS.NDEF.D015.A.N.A',
  // Longue durée (> 20 ans) — proxy
  20: 'SDER.M.FR.EUR.LDGC.BF.HBS.NDEF.D020.A.N.A',
  25: 'SDER.M.FR.EUR.LDGC.BF.HBS.NDEF.D025.A.N.A',
}

interface BdfRecord {
  obs_value: number | string
  period_identifier: string
}

async function fetchBdfSeries(seriesKey: string): Promise<{ value: number; period: string } | null> {
  const url = new URL(BDF_BASE_URL)
  url.searchParams.set('where', `series_key="${seriesKey}"`)
  url.searchParams.set('order_by', 'period_identifier DESC')
  url.searchParams.set('limit', '1')
  url.searchParams.set('select', 'obs_value,period_identifier')

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    // Cache ISR : revalidation toutes les 24h
    next: { revalidate: 86400 },
  })

  if (!res.ok) return null

  const json = await res.json()
  const record: BdfRecord | undefined = json?.results?.[0]
  if (!record || record.obs_value === null || record.obs_value === undefined) return null

  return {
    value: Number(record.obs_value),
    period: String(record.period_identifier),
  }
}

async function fetchFromBdf(): Promise<LiveRates | null> {
  try {
    // Taux global toutes durées
    const global = await fetchBdfSeries(BDF_SERIES_ID)
    if (!global) return null

    // Taux par durée (on essaie, mais on accepte l'absence)
    const durationsData = await Promise.allSettled(
      Object.entries(BDF_SERIES_BY_DURATION).map(async ([duree, series]) => {
        const result = await fetchBdfSeries(series)
        return { duree: Number(duree), value: result?.value ?? null }
      })
    )

    const parDuree: Record<number, number> = {
      10: global.value - 0.30,
      15: global.value - 0.15,
      20: global.value,
      25: global.value + 0.20,
    }

    for (const settled of durationsData) {
      if (settled.status === 'fulfilled' && settled.value.value !== null) {
        parDuree[settled.value.duree] = settled.value.value
      }
    }

    return {
      tauxMoyenGlobal: global.value,
      parDuree: parDuree as Record<10 | 15 | 20 | 25, number>,
      euribor3m: null,
      dateObservation: global.period,
      source: 'banque_de_france',
      fetchedAt: new Date().toISOString(),
    }
  } catch {
    return null
  }
}

// ─── ECB Data Portal API ──────────────────────────────────────────────────────
//
// Euribor 3 mois : FM.M.U2.EUR.RT0.MM.EURIBOR3MD_.HSTA.A
// Documentation : https://data-api.ecb.europa.eu/

const ECB_BASE_URL = 'https://data-api.ecb.europa.eu/service/data'
const ECB_EURIBOR_FLOW = 'FM/M.U2.EUR.RT0.MM.EURIBOR3MD_.HSTA.A'

async function fetchEuribor(): Promise<number | null> {
  try {
    const url = `${ECB_BASE_URL}/${ECB_EURIBOR_FLOW}?format=jsondata&lastNObservations=1`
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 86400 },
    })

    if (!res.ok) return null

    const json = await res.json()
    // Structure SDMX-JSON : dataSets[0].series["0:0:0:0:0:0:0:0:0"].observations
    const series = json?.dataSets?.[0]?.series
    if (!series) return null

    const firstSeries = Object.values(series)[0] as {
      observations: Record<string, [number]>
    }
    const obs = Object.values(firstSeries?.observations ?? {})[0]
    const value = obs?.[0]

    return typeof value === 'number' ? value : null
  } catch {
    return null
  }
}

// ─── Fonction principale exportée ────────────────────────────────────────────

/**
 * Retourne les taux immobiliers live, avec fallback sur les données statiques.
 * Le cache Next.js (ISR) garantit un seul appel API par 24h au maximum.
 */
export async function getLiveRates(): Promise<LiveRates> {
  // Tentative 1 : Banque de France (source la plus fiable pour les taux FR)
  const bdfRates = await fetchFromBdf()

  if (bdfRates) {
    // On complète avec l'Euribor ECB si disponible
    const euribor = await fetchEuribor()
    return { ...bdfRates, euribor3m: euribor }
  }

  // Tentative 2 : Uniquement l'Euribor ECB + ajustement sur les données statiques
  try {
    const euribor = await fetchEuribor()
    if (euribor !== null) {
      // Estimation grossière : taux fixes FR ≈ Euribor + spread moyen historique (~0.9%)
      const spreadMoyen = 0.9
      const tauxEstime = Math.round((euribor + spreadMoyen) * 100) / 100

      return {
        tauxMoyenGlobal: tauxEstime,
        parDuree: {
          10: Math.round((tauxEstime - 0.30) * 100) / 100,
          15: Math.round((tauxEstime - 0.15) * 100) / 100,
          20: tauxEstime,
          25: Math.round((tauxEstime + 0.20) * 100) / 100,
        },
        euribor3m: euribor,
        dateObservation: new Date().toISOString().slice(0, 7),
        source: 'ecb',
        fetchedAt: new Date().toISOString(),
      }
    }
  } catch {
    // Fallback final
  }

  // Fallback final : données statiques
  return STATIC_FALLBACK
}

/**
 * Retourne uniquement les taux par durée (interface simplifiée).
 * Utilisable dans les Server Components avec cache ISR.
 */
export async function getTauxParDuree(): Promise<Record<10 | 15 | 20 | 25, number>> {
  const rates = await getLiveRates()
  return rates.parDuree
}

// ─── Utilitaires de formatage ─────────────────────────────────────────────────

export function formatTaux(t: number): string {
  return t.toFixed(2).replace('.', ',') + ' %'
}

/** Libellé de la source pour affichage utilisateur */
export function sourceLabel(source: LiveRates['source']): string {
  switch (source) {
    case 'banque_de_france': return 'Banque de France'
    case 'ecb':              return 'BCE (Euribor)'
    case 'static_fallback':  return 'Données indicatives'
  }
}
