/**
 * Statistiques ville : uniquement données locales, sans appel réseau.
 *
 * Prix au m² : agrégat interne (médianes DVF du millésime source, ex. 2025 ; sinon cities.ts).
 * Courtiers : valeurs déclaratives dans **cities.ts** (plus d’API).
 */

import type { PtzZone } from './departmentData'
import { getCityPrice, getCityPrixM2 } from './cityPrices'

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
  /** true si le prix m² affiché provient de l’agrégat DVF interne */
  prixFromCityPricesJson: boolean
  fetchedAt: string
}

export type PrixDetailSource = 'city_prices' | 'dept_estime'

export interface PrixDetail {
  aptAncien: number
  maisonAncienne: number
  aptNeuf: number
  maisonNeuve: number
  /** true = agrégat DVF interne, false = estimation à partir du prix départemental (cities) */
  sourceApi: boolean
  detailSource: PrixDetailSource
  localMeta?: { nb: number; cps?: string[] }
  aptNeufFromFile?: boolean
  maisonNeufFromFile?: boolean
}

const NEUF_COEFFICIENT: Record<PtzZone, number> = {
  Abis: 1.12,
  A:    1.16,
  B1:   1.21,
  B2:   1.24,
  C:    1.27,
}

/**
 * Détail des prix m² : agrégat DVF interne si la commune est couverte, sinon estimation
 * à partir du prix m² de référence (cities / département).
 */
export async function fetchPrixDetail(
  codeInsee: string,
  prixFallback: number,
  ptzZone: PtzZone,
): Promise<PrixDetail> {
  const coef = NEUF_COEFFICIENT[ptzZone]

  const local = getCityPrice(codeInsee)
  if (local && (local.med_apt_anc != null || local.med_mai_anc != null)) {
    const aptAncien      = local.med_apt_anc ?? Math.round((local.med_mai_anc ?? prixFallback) / 1.18)
    const maisonAncienne = local.med_mai_anc ?? Math.round(aptAncien * 1.18)
    return {
      aptAncien,
      maisonAncienne,
      aptNeuf:     local.med_apt_neuf ?? Math.round(aptAncien * coef),
      maisonNeuve: local.med_mai_neuf ?? Math.round(maisonAncienne * coef),
      sourceApi: true,
      detailSource: 'city_prices',
      localMeta: {
        nb:  local.nb,
        cps: local.cps?.length ? local.cps : undefined,
      },
      aptNeufFromFile:     local.med_apt_neuf != null,
      maisonNeufFromFile:  local.med_mai_neuf != null,
    }
  }

  const aptAncien      = Math.round(prixFallback * 0.92)
  const maisonAncienne = Math.round(prixFallback * 1.18)

  return {
    aptAncien,
    maisonAncienne,
    aptNeuf:     Math.round(aptAncien * coef),
    maisonNeuve: Math.round(maisonAncienne * coef),
    sourceApi: false,
    detailSource: 'dept_estime',
  }
}

/**
 * Cartes ville (prix m², courtiers) : JSON local pour le prix, **cities.ts** pour les courtiers.
 */
export async function getCityStats(city: CityStatsInput): Promise<CityStats> {
  const fromJson = getCityPrixM2(city.codeInsee)
  return {
    prixM2:                 fromJson ?? city.prixM2,
    nbCourtiers:            city.nbCourtiers,
    prixFromCityPricesJson: fromJson !== null,
    fetchedAt:              new Date().toISOString(),
  }
}
