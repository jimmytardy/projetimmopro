/**
 * Récupération des taux immobiliers depuis les APIs publiques officielles.
 *
 * Sources :
 *  1. Banque de France WebStat API  — taux moyens crédits habitat en France (officiel, mensuel)
 *  2. ECB Data Portal               — taux Euribor 3 mois (quotidien, indicatif)
 *
 * Stratégie :
 *  - Tous les appels API sont lancés EN PARALLÈLE (Promise.allSettled).
 *  - Chaque appel a un timeout strict de 3 secondes (AbortController).
 *  - En cas d'erreur ou de timeout, les données statiques de secours sont retournées.
 *  - Cache ISR Next.js : revalidation toutes les 24h (un seul appel réseau par jour en prod).
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LiveRates {
  tauxMoyenGlobal: number
  parDuree: Record<10 | 15 | 20 | 25, number>
  euribor3m: number | null
  dateObservation: string
  source: 'banque_de_france' | 'ecb' | 'static_fallback'
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

// ─── Timeout helper ───────────────────────────────────────────────────────────

const FETCH_TIMEOUT_MS = 3000

async function fetchWithTimeout(url: string, timeoutMs = FETCH_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 86400 },
      signal: controller.signal,
    })
    return res
  } finally {
    clearTimeout(timer)
  }
}

// ─── Banque de France WebStat API ─────────────────────────────────────────────

const BDF_BASE_URL = 'https://webstat.banque-france.fr/api/explore/v2.1/catalog/datasets/bdf_webstat_series_obs/records'

const BDF_SERIES: Record<'global' | 10 | 15 | 20 | 25, string> = {
  global: 'SDER.M.FR.EUR.LDGC.BF.HBS.NDEF.NDEF.A.N.A',
  10:     'SDER.M.FR.EUR.LDGC.BF.HBS.NDEF.D010.A.N.A',
  15:     'SDER.M.FR.EUR.LDGC.BF.HBS.NDEF.D015.A.N.A',
  20:     'SDER.M.FR.EUR.LDGC.BF.HBS.NDEF.D020.A.N.A',
  25:     'SDER.M.FR.EUR.LDGC.BF.HBS.NDEF.D025.A.N.A',
}

interface BdfRecord {
  obs_value: number | string
  period_identifier: string
}

function buildBdfUrl(seriesKey: string): string {
  const url = new URL(BDF_BASE_URL)
  url.searchParams.set('where', `series_key="${seriesKey}"`)
  url.searchParams.set('order_by', 'period_identifier DESC')
  url.searchParams.set('limit', '1')
  url.searchParams.set('select', 'obs_value,period_identifier')
  return url.toString()
}

async function fetchBdfSeries(seriesKey: string): Promise<{ value: number; period: string } | null> {
  try {
    const res = await fetchWithTimeout(buildBdfUrl(seriesKey))
    if (!res.ok) return null
    const json = await res.json()
    const record: BdfRecord | undefined = json?.results?.[0]
    if (!record || record.obs_value == null) return null
    return { value: Number(record.obs_value), period: String(record.period_identifier) }
  } catch {
    return null
  }
}

// ─── ECB Data Portal API ──────────────────────────────────────────────────────

const ECB_EURIBOR_URL = 'https://data-api.ecb.europa.eu/service/data/FM/M.U2.EUR.RT0.MM.EURIBOR3MD_.HSTA.A?format=jsondata&lastNObservations=1'

async function fetchEuribor(): Promise<number | null> {
  try {
    const res = await fetchWithTimeout(ECB_EURIBOR_URL)
    if (!res.ok) return null
    const json = await res.json()
    const series = json?.dataSets?.[0]?.series
    if (!series) return null
    const firstSeries = Object.values(series)[0] as { observations: Record<string, [number]> }
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
 * Tous les appels réseau sont lancés EN PARALLÈLE avec un timeout de 3 secondes.
 * Le cache Next.js ISR (revalidate: 86400) garantit au maximum un appel réseau par 24h.
 */
export async function getLiveRates(): Promise<LiveRates> {
  // Lance TOUS les appels en parallèle simultanément
  const [globalResult, d10Result, d15Result, d20Result, d25Result, euriborResult] =
    await Promise.allSettled([
      fetchBdfSeries(BDF_SERIES.global),
      fetchBdfSeries(BDF_SERIES[10]),
      fetchBdfSeries(BDF_SERIES[15]),
      fetchBdfSeries(BDF_SERIES[20]),
      fetchBdfSeries(BDF_SERIES[25]),
      fetchEuribor(),
    ])

  const globalData = globalResult.status === 'fulfilled' ? globalResult.value : null
  const euribor    = euriborResult.status === 'fulfilled' ? euriborResult.value : null

  // ── Scénario 1 : Banque de France disponible ──────────────────────────────
  if (globalData) {
    const base = globalData.value

    const getVal = (
      result: PromiseSettledResult<{ value: number; period: string } | null>,
      fallback: number
    ) =>
      result.status === 'fulfilled' && result.value != null
        ? result.value.value
        : fallback

    return {
      tauxMoyenGlobal: base,
      parDuree: {
        10: getVal(d10Result, Math.round((base - 0.30) * 100) / 100),
        15: getVal(d15Result, Math.round((base - 0.15) * 100) / 100),
        20: getVal(d20Result, base),
        25: getVal(d25Result, Math.round((base + 0.20) * 100) / 100),
      },
      euribor3m: euribor,
      dateObservation: globalData.period,
      source: 'banque_de_france',
      fetchedAt: new Date().toISOString(),
    }
  }

  // ── Scénario 2 : seulement Euribor ECB disponible ────────────────────────
  if (euribor !== null) {
    const spread = 0.9
    const tauxEstime = Math.round((euribor + spread) * 100) / 100
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

  // ── Scénario 3 : fallback statique ────────────────────────────────────────
  return STATIC_FALLBACK
}

export async function getTauxParDuree(): Promise<Record<10 | 15 | 20 | 25, number>> {
  const rates = await getLiveRates()
  return rates.parDuree
}

// ─── Utilitaires de formatage ─────────────────────────────────────────────────

export function formatTaux(t: number): string {
  return t.toFixed(2).replace('.', ',') + ' %'
}

export function sourceLabel(source: LiveRates['source']): string {
  switch (source) {
    case 'banque_de_france': return 'Banque de France'
    case 'ecb':              return 'BCE (Euribor)'
    case 'static_fallback':  return 'Données indicatives'
  }
}
