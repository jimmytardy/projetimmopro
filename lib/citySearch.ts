/**
 * Recherche de communes pour l'autocomplète (taux par ville).
 * - CP à 5 chiffres : geo + BAN (tous les CP, ex. 38000 / 38100).
 * - CP partiel à 4 chiffres (ex. 3800) : BAN sur 38000–38009 puis fusion (préfixe CP).
 * - CP partiel à 3 chiffres métro (ex. 380) : communes du département (38) filtrées par CP commençant par « 380 ».
 * - Exactement 2 chiffres : communes du département geo (ex. « 38 » → Isère), puis BAN en secours si besoin.
 * - 3 chiffres type DOM (971…) : communes du département geo.
 * - Autre préfixe 2–4 chiffres : BAN agrégé par commune INSEE (repli).
 * - Texte : geo par nom (boost population).
 */

const GEO_BASE = 'https://geo.api.gouv.fr'
const GEO_COMMUNES = `${GEO_BASE}/communes`
const BAN_SEARCH = 'https://api-adresse.data.gouv.fr/search'

export interface CommuneSearchResult {
  nom: string
  code: string
  departement: { code: string; nom: string }
  codesPostaux?: string[]
  population?: number
}

function sortPostcodes(codes: string[]): string[] {
  return Array.from(new Set(codes.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  )
}

/** Met en tête le CP qui correspond à la saisie (ex. 38100 pour Grenoble). */
export function formatPostcodesForDisplay(
  codes: string[] | undefined,
  highlightPostal?: string
): string {
  const sorted = sortPostcodes(codes ?? [])
  if (!sorted.length) return ''
  const h = highlightPostal?.trim()
  if (h && /^\d{2,5}$/.test(h) && sorted.some((c) => c.startsWith(h))) {
    const exact = sorted.find((c) => c === h)
    if (exact) return [exact, ...sorted.filter((c) => c !== exact)].join(' · ')
    const matching = sorted.filter((c) => c.startsWith(h))
    const rest = sorted.filter((c) => !c.startsWith(h))
    return [...matching, ...rest].join(' · ')
  }
  return sorted.join(' · ')
}

function parseDeptFromBanContext(context?: string): { code: string; nom: string } {
  if (!context) return { code: '', nom: '' }
  const parts = context.split(',').map((s) => s.trim())
  return { code: parts[0] ?? '', nom: parts[1] ?? parts[0] ?? '' }
}

/** Département à partir du code INSEE commune (DOM 971–978, Corse 2A/2B, métropole 2 chiffres). */
export function inseeToDepartementCode(citycode: string): string {
  const c = citycode.toUpperCase()
  if (c.startsWith('2A') || c.startsWith('2B')) return c.slice(0, 2)
  if (/^(97[1-8]|984|986|988)/.test(c)) return c.slice(0, 3)
  return c.slice(0, 2)
}

function departementFromBan(p: { context?: string; citycode: string }): { code: string; nom: string } {
  const fromCtx = parseDeptFromBanContext(p.context)
  if (fromCtx.code) return fromCtx
  const code = inseeToDepartementCode(p.citycode)
  return { code, nom: code }
}

async function fetchGeoCommunes(params: Record<string, string>, limit: number): Promise<CommuneSearchResult[]> {
  const url = new URL(GEO_COMMUNES)
  url.searchParams.set('fields', 'nom,code,departement,codesPostaux,population')
  url.searchParams.set('format', 'json')
  url.searchParams.set('limit', String(limit))
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v)
  }

  const res = await fetch(url.toString(), { headers: { Accept: 'application/json' } })
  if (!res.ok) return []
  const data = (await res.json()) as CommuneSearchResult[] | { message?: string }
  if (!Array.isArray(data)) return []

  return data.map((c) => ({
    ...c,
    codesPostaux: sortPostcodes(c.codesPostaux ?? []),
  }))
}

/** CP exact 5 chiffres — geo (sans `boost`) + fusion BAN pour lister tous les CP (ex. 38000 / 38100). */
async function searchByFullPostcode(
  cp: string,
  limit: number,
  options?: { sliceMax?: number }
): Promise<CommuneSearchResult[]> {
  const geoList = await fetchGeoCommunes({ codePostal: cp }, Math.max(limit, 24))
  const banList = await searchBanByPostcodeFilter(cp, 30)
  const merged = mergeCommuneLists(geoList, banList)
  if (merged.length > 0) {
    merged.sort((a, b) => (b.population ?? 0) - (a.population ?? 0))
    const cap = options?.sliceMax ?? Math.max(limit, 20)
    return merged.slice(0, cap)
  }
  return []
}

async function searchByNom(q: string, limit: number): Promise<CommuneSearchResult[]> {
  return dedupeByInsee(
    await fetchGeoCommunes({ nom: q, boost: 'population' }, limit)
  )
}

/**
 * Deux chiffres = code département métropolitain (ex. 38 → Isère) : liste des communes via geo.api.gouv.fr.
 * DOM à 3 chiffres (971, 972, …) : même schéma sur `/departements/{code}/communes`.
 */
async function tryGeoDepartementCommunes(
  deptCode: string,
  limit: number,
  options?: { fetchCap?: number }
): Promise<CommuneSearchResult[]> {
  const cap = options?.fetchCap ?? 120
  const url = new URL(`${GEO_BASE}/departements/${encodeURIComponent(deptCode)}/communes`)
  url.searchParams.set('fields', 'nom,code,departement,codesPostaux,population')
  url.searchParams.set('format', 'json')
  url.searchParams.set('boost', 'population')
  url.searchParams.set('limit', String(Math.min(cap, Math.max(50, limit * 4))))

  const res = await fetch(url.toString(), { headers: { Accept: 'application/json' } })
  if (!res.ok) return []
  const data = (await res.json()) as CommuneSearchResult[] | { message?: string }
  if (!Array.isArray(data)) return []

  const list = data.map((c) => ({
    ...c,
    codesPostaux: sortPostcodes(c.codesPostaux ?? []),
  }))
  list.sort((a, b) => (b.population ?? 0) - (a.population ?? 0))
  return list.slice(0, limit)
}

function isDomDepartmentThreeDigits(code: string): boolean {
  return /^(97[1-8]|984|986|988)/.test(code)
}

/** Département métropolitain « classique » (01–95), hors cas 3 chiffres DOM déjà traité. */
function isMetroDepartmentTwoChars(dept: string): boolean {
  if (dept.length !== 2) return false
  const n = parseInt(dept, 10)
  return n >= 1 && n <= 95
}

/**
 * Préfixe CP sur 4 chiffres (ex. 3800) : pour chaque CP complet 38000–38009, même logique que la saisie à 5 chiffres
 * (geo.api.gouv.fr + BAN). La BAN seule (`postcode=`) renvoie souvent trop peu de résultats côté client.
 */
async function searchByFourDigitPostcodePrefix(prefix: string, limit: number): Promise<CommuneSearchResult[]> {
  if (!/^\d{4}$/.test(prefix)) return []
  const cps = Array.from({ length: 10 }, (_, i) => `${prefix}${i}`)
  const chunks = await Promise.all(
    cps.map((cp) => searchByFullPostcode(cp, 10, { sliceMax: 8 }))
  )
  const merged = dedupeByInsee(chunks.flat())
  merged.sort((a, b) => {
    const popB = b.population ?? 0
    const popA = a.population ?? 0
    if (popB !== popA) return popB - popA
    return a.nom.localeCompare(b.nom, 'fr')
  })
  return merged.slice(0, limit)
}

/**
 * Préfixe CP sur 3 chiffres métropolitain (ex. 380 → département 38, CP commençant par 380).
 */
async function searchCommunesInDeptByPostalPrefix(
  cpPrefix: string,
  limit: number
): Promise<CommuneSearchResult[]> {
  if (!/^\d{3}$/.test(cpPrefix)) return []
  const dept2 = cpPrefix.slice(0, 2)
  if (!isMetroDepartmentTwoChars(dept2)) return []
  const list = await tryGeoDepartementCommunes(dept2, 500, { fetchCap: 500 })
  const filtered = list.filter((c) =>
    (c.codesPostaux ?? []).some((cp) => cp.startsWith(cpPrefix))
  )
  filtered.sort((a, b) => (b.population ?? 0) - (a.population ?? 0))
  return filtered.slice(0, limit)
}

/**
 * Préfixe numérique 2–4 chiffres : d’abord département geo si pertinent (ex. « 38 »),
 * sinon BAN (adresses) agrégées par commune INSEE.
 */
async function searchByPostcodePrefix(digits: string, limit: number): Promise<CommuneSearchResult[]> {
  const url = new URL(BAN_SEARCH)
  url.searchParams.set('q', digits)
  url.searchParams.set('limit', '40')

  const res = await fetch(url.toString(), { headers: { Accept: 'application/json' } })
  if (!res.ok) return []

  const json = (await res.json()) as {
    features?: Array<{
      properties?: {
        city?: string
        citycode?: string
        postcode?: string
        context?: string
        population?: number
      }
    }>
  }

  const byInsee = new Map<string, CommuneSearchResult>()

  for (const f of json.features ?? []) {
    const p = f.properties
    if (!p?.citycode || !p.city) continue
    const citycode = p.citycode
    const pc = p.postcode?.trim()
    if (pc && !/^\d{5}$/.test(pc)) continue

    const dept = departementFromBan({ context: p.context, citycode })
    const existing = byInsee.get(citycode)
    if (!existing) {
      byInsee.set(citycode, {
        nom: p.city,
        code: citycode,
        departement: dept,
        codesPostaux: pc ? [pc] : [],
        population: typeof p.population === 'number' ? p.population : undefined,
      })
    } else {
      if (pc && !existing.codesPostaux?.includes(pc)) {
        existing.codesPostaux = sortPostcodes([...(existing.codesPostaux ?? []), pc])
      }
      if (typeof p.population === 'number' && p.population > (existing.population ?? 0)) {
        existing.population = p.population
      }
      if (!existing.departement?.code && dept.code) existing.departement = dept
    }
  }

  const merged = Array.from(byInsee.values()).map((c) => ({
    ...c,
    codesPostaux: sortPostcodes(c.codesPostaux ?? []),
  }))

  merged.sort((a, b) => {
    const popA = a.population ?? 0
    const popB = b.population ?? 0
    if (popB !== popA) return popB - popA
    return a.nom.localeCompare(b.nom, 'fr')
  })

  return merged.slice(0, limit)
}

async function searchBanByPostcodeFilter(cp: string, limit: number): Promise<CommuneSearchResult[]> {
  const url = new URL(BAN_SEARCH)
  url.searchParams.set('postcode', cp)
  url.searchParams.set('limit', '30')

  const res = await fetch(url.toString(), { headers: { Accept: 'application/json' } })
  if (!res.ok) return []

  const json = (await res.json()) as {
    features?: Array<{
      properties?: {
        city?: string
        citycode?: string
        postcode?: string
        context?: string
        population?: number
      }
    }>
  }

  const byInsee = new Map<string, CommuneSearchResult>()
  for (const f of json.features ?? []) {
    const p = f.properties
    if (!p?.citycode || !p.city) continue
    const pc = p.postcode?.trim()
    const dept = parseDeptFromBanContext(p.context)
    const existing = byInsee.get(p.citycode)
    if (!existing) {
      byInsee.set(p.citycode, {
        nom: p.city,
        code: p.citycode,
        departement: dept.code ? dept : { code: '', nom: '' },
        codesPostaux: pc ? [pc] : [],
        population: typeof p.population === 'number' ? p.population : undefined,
      })
    } else if (pc && !existing.codesPostaux?.includes(pc)) {
      existing.codesPostaux = sortPostcodes([...(existing.codesPostaux ?? []), pc])
    }
  }

  const list = Array.from(byInsee.values()).map((c) => ({
    ...c,
    codesPostaux: sortPostcodes(c.codesPostaux ?? []),
  }))
  list.sort((a, b) => (b.population ?? 0) - (a.population ?? 0))
  return list.slice(0, limit)
}

function dedupeByInsee(communes: CommuneSearchResult[]): CommuneSearchResult[] {
  const map = new Map<string, CommuneSearchResult>()
  for (const c of communes) {
    const key = c.code
    const existing = map.get(key)
    if (!existing) {
      map.set(key, { ...c, codesPostaux: sortPostcodes(c.codesPostaux ?? []) })
    } else {
      const merged = sortPostcodes([...(existing.codesPostaux ?? []), ...(c.codesPostaux ?? [])])
      existing.codesPostaux = merged
      if ((c.population ?? 0) > (existing.population ?? 0)) existing.population = c.population
    }
  }
  return Array.from(map.values())
}

/** Fusionne deux listes (ex. geo + BAN) pour enrichir les codes postaux d’une même commune INSEE. */
function mergeCommuneLists(primary: CommuneSearchResult[], secondary: CommuneSearchResult[]): CommuneSearchResult[] {
  return dedupeByInsee([...primary, ...secondary])
}

/**
 * Recherche unifiée pour l'autocomplète ville / code postal.
 */
export async function searchCommunesForAutocomplete(
  query: string,
  limit = 12
): Promise<CommuneSearchResult[]> {
  const trimmed = query.trim()
  if (trimmed.length < 2) return []

  if (/^\d{5}$/.test(trimmed)) {
    return searchByFullPostcode(trimmed, limit)
  }

  if (/^\d{2}$/.test(trimmed)) {
    const fromDept = await tryGeoDepartementCommunes(trimmed, limit)
    if (fromDept.length > 0) return fromDept
    return searchByPostcodePrefix(trimmed, limit)
  }

  if (/^\d{3}$/.test(trimmed)) {
    if (isDomDepartmentThreeDigits(trimmed)) {
      const fromDept = await tryGeoDepartementCommunes(trimmed, limit)
      if (fromDept.length > 0) return fromDept
    } else {
      const filtered = await searchCommunesInDeptByPostalPrefix(trimmed, limit)
      if (filtered.length > 0) return filtered
    }
    return searchByPostcodePrefix(trimmed, limit)
  }

  if (/^\d{4}$/.test(trimmed)) {
    const fromPartial = await searchByFourDigitPostcodePrefix(trimmed, limit)
    if (fromPartial.length > 0) return fromPartial
    return searchByPostcodePrefix(trimmed, limit)
  }

  if (/^\d+$/.test(trimmed)) {
    return searchByPostcodePrefix(trimmed, limit)
  }

  return searchByNom(trimmed, limit)
}
