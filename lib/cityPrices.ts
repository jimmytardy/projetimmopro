/**
 * Lecture du fichier agrégé interne (généré par scripts/generate-city-prices.mjs à partir des ventes DVF).
 * Les médianes sont calculées à partir des **transactions DVF du millésime du fichier source**
 * (ex. fichier ValeursFoncieres-2025.txt → données 2025).
 *
 * Clé d'accès : **code INSEE commune** (5 caractères, ex. "38185" pour Grenoble).
 * Les prix agrègent toute la commune (tous codes postaux).
 *
 * Ancien format JSON (clés courtes n, d, aA, …) : toujours pris en charge au chargement.
 */

import fs   from 'fs'
import path from 'path'

// ─── Types ────────────────────────────────────────────────────────────────────

/** Format actuel du JSON (noms explicites, raisonnablement courts) */
export interface CityPriceEntry {
  nom: string
  dept: string
  /** Codes postaux distincts observés sur la commune (ex. Grenoble : 38000, 38100, …) */
  cps?: string[]
  /** Médiane €/m² — appartement ancien */
  med_apt_anc?: number
  /** Médiane €/m² — maison ancienne */
  med_mai_anc?: number
  /** Médiane €/m² — appartement neuf (si assez de transactions) */
  med_apt_neuf?: number
  /** Médiane €/m² — maison neuve (si assez de transactions) */
  med_mai_neuf?: number
  /** Nombre de transactions retenues */
  nb: number
}

/** Ancien format (script avant refonte) */
interface LegacyCityPriceEntry {
  n?: string
  d?: string
  cp?: string
  aA?: number
  mA?: number
  aN?: number
  mN?: number
  t?: number
}

function normalizeEntry(raw: CityPriceEntry | LegacyCityPriceEntry): CityPriceEntry {
  const r = raw as Record<string, unknown>
  if (r.nom != null) return raw as CityPriceEntry
  const L = raw as LegacyCityPriceEntry
  return {
    nom:  String(L.n ?? ''),
    dept: String(L.d ?? ''),
    cps:  L.cp ? [String(L.cp)] : undefined,
    med_apt_anc: L.aA,
    med_mai_anc: L.mA,
    med_apt_neuf: L.aN,
    med_mai_neuf: L.mN,
    nb: Number(L.t ?? 0),
  }
}

// ─── Cache module-level ───────────────────────────────────────────────────────

let _db: Record<string, CityPriceEntry> | null = null

function loadDb(): Record<string, CityPriceEntry> {
  if (_db !== null) return _db

  try {
    const filePath = path.join(process.cwd(), 'public', 'city-prices.json')
    const content  = fs.readFileSync(filePath, 'utf-8')
    const raw      = JSON.parse(content) as Record<string, CityPriceEntry | LegacyCityPriceEntry>
    _db = {}
    for (const [insee, row] of Object.entries(raw)) {
      _db[insee] = normalizeEntry(row)
    }
  } catch {
    _db = {}
  }

  return _db
}

// ─── API publique ─────────────────────────────────────────────────────────────

/**
 * Données DVF locales pour une commune, ou null si absentes.
 * @param codeInsee  Code INSEE commune (ex. "38185", "69123")
 */
export function getCityPrice(codeInsee: string): CityPriceEntry | null {
  const db = loadDb()
  return db[codeInsee] ?? null
}

/**
 * Prix médian au m² « principal » : appartement ancien si présent, sinon maison ancienne.
 */
export function getCityPrixM2(codeInsee: string): number | null {
  const entry = getCityPrice(codeInsee)
  if (!entry) return null
  return entry.med_apt_anc ?? entry.med_mai_anc ?? null
}

export function isCityPricesLoaded(): boolean {
  return Object.keys(loadDb()).length > 0
}
