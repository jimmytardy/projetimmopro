'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Loader2, X } from 'lucide-react'
import { cityToSlug } from '@/lib/geocode'

interface Commune {
  nom: string
  code: string
  departement: { code: string; nom: string }
  codesPostaux?: string[]
  population?: number
}

const GEO_API = 'https://geo.api.gouv.fr/communes'

/** Retourne true si la saisie ressemble à un code postal (2–5 chiffres). */
function isPostalCode(q: string): boolean {
  return /^\d{2,5}$/.test(q.trim())
}

function formatPopulation(pop?: number): string {
  if (!pop) return ''
  if (pop >= 1_000_000) return `${(pop / 1_000_000).toFixed(1)}M hab.`
  if (pop >= 1_000)    return `${Math.round(pop / 1_000)}k hab.`
  return `${pop} hab.`
}

export default function CitySearch({ placeholder = 'Ville ou code postal (ex : Grenoble, 38000)' }: { placeholder?: string }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Commune[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchCommunes = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); setOpen(false); return }

    setLoading(true)
    try {
      const url = new URL(GEO_API)
      // Bascule sur la recherche par code postal si la saisie est numérique
      if (isPostalCode(q)) {
        url.searchParams.set('codePostal', q.trim())
      } else {
        url.searchParams.set('nom', q)
      }
      url.searchParams.set('fields', 'nom,code,departement,codesPostaux,population')
      url.searchParams.set('format', 'json')
      url.searchParams.set('boost', 'population')
      url.searchParams.set('limit', '8')

      const res = await fetch(url.toString(), { headers: { Accept: 'application/json' } })
      if (!res.ok) return
      const communes: Commune[] = await res.json()
      setResults(communes)
      setOpen(communes.length > 0)
      setActiveIndex(-1)
    } catch {
      // Silencieux — le champ reste fonctionnel
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchCommunes(query), 280)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, fetchCommunes])

  const goToCity = (commune: Commune) => {
    const slug = cityToSlug(commune.nom)
    setOpen(false)
    setQuery('')
    router.push(`/taux-immobilier/${slug}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || !results.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      goToCity(results[activeIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIndex(-1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (results.length > 0) goToCity(results[activeIndex >= 0 ? activeIndex : 0])
  }

  // Fermer si clic en dehors
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.closest('[data-city-search]')?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative w-full" data-city-search>
      <form onSubmit={handleSubmit} role="search">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder={placeholder}
            autoComplete="off"
            aria-label="Rechercher une ville"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls="city-search-results"
            className="w-full pl-12 pr-12 py-4 text-base rounded-2xl border-2 border-gray-200 focus:border-primary-500 focus:outline-none shadow-sm bg-white transition-colors"
          />
          {loading && (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400 animate-spin" />
          )}
          {!loading && query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setResults([]); setOpen(false); inputRef.current?.focus() }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Effacer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {open && results.length > 0 && (
        <ul
          id="city-search-results"
          ref={listRef}
          role="listbox"
          aria-label="Suggestions de villes"
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden"
        >
          {results.map((commune, idx) => {
            const isActive = idx === activeIndex
            const cp = commune.codesPostaux?.[0] ?? ''
            return (
              <li
                key={commune.code}
                role="option"
                aria-selected={isActive}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => goToCity(commune)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                  isActive ? 'bg-primary-50' : 'hover:bg-gray-50'
                }`}
              >
                <MapPin className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-primary-500' : 'text-gray-400'}`} />
                <div className="min-w-0 flex-1">
                  <span className={`font-medium text-sm ${isActive ? 'text-primary-700' : 'text-gray-900'}`}>
                    {commune.nom}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">
                    {cp && `${cp} · `}{commune.departement?.nom} ({commune.departement?.code})
                  </span>
                </div>
                {commune.population && (
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {formatPopulation(commune.population)}
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      )}

      {open && !loading && results.length === 0 && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl px-4 py-6 text-center text-sm text-gray-400">
          Aucune commune trouvée pour «&nbsp;{query}&nbsp;»
        </div>
      )}
    </div>
  )
}
