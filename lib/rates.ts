/**
 * Taux immobiliers affichés sur le site : **données statiques intégrées** (aucun appel réseau).
 * Pour des taux mis à jour depuis une source officielle, régénérez ce fichier ou
 * chargez un JSON statique (même principe que l’agrégat prix interne).
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LiveRates {
  tauxMoyenGlobal: number
  parDuree: Record<10 | 15 | 20 | 25, number>
  euribor3m: null
  dateObservation: string
  source: 'static_fallback'
  fetchedAt: string
}

const STATIC: LiveRates = {
  tauxMoyenGlobal: 3.45,
  parDuree: { 10: 3.15, 15: 3.30, 20: 3.45, 25: 3.65 },
  euribor3m: null,
  dateObservation: '2026-04',
  source: 'static_fallback',
  fetchedAt: new Date().toISOString(),
}

/**
 * Taux par durée (indicatifs), sans requête HTTP.
 */
export async function getLiveRates(): Promise<LiveRates> {
  return {
    ...STATIC,
    fetchedAt: new Date().toISOString(),
  }
}

export async function getTauxParDuree(): Promise<Record<10 | 15 | 20 | 25, number>> {
  const rates = await getLiveRates()
  return rates.parDuree
}

export function formatTaux(t: number): string {
  return t.toFixed(2).replace('.', ',') + ' %'
}

export function sourceLabel(_source: LiveRates['source']): string {
  return 'Données indicatives'
}
