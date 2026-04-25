'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { Search, MapPin, Loader2, X } from 'lucide-react'
import { cityToSlug } from '@/lib/geocode'
import { formatPostcodesForDisplay, searchCommunesForAutocomplete } from '@/lib/citySearch'

export default function CitySearch() {
  const t = useTranslations('citySearch')
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Awaited<ReturnType<typeof searchCommunesForAutocomplete>>>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const formatPopulation = useCallback(
    (pop?: number): string => {
      if (!pop) return ''
      if (pop >= 1_000_000) return t('popMillion', { n: (pop / 1_000_000).toFixed(1) })
      if (pop >= 1_000) return t('popK', { n: String(Math.round(pop / 1000)) })
      return t('popCount', { n: String(pop) })
    },
    [t]
  )

  const fetchCommunes = useCallback(async (q: string) => {
    const trimmed = q.trim()
    if (trimmed.length < 2) {
      setResults([])
      setOpen(false)
      return
    }

    setLoading(true)
    try {
      const communes = await searchCommunesForAutocomplete(trimmed, 14)
      setResults(communes)
      setOpen(trimmed.length >= 2)
      setActiveIndex(-1)
    } catch {
      setResults([])
      setOpen(trimmed.length >= 2)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchCommunes(query), 280)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, fetchCommunes])

  const goToCity = (commune: (typeof results)[0]) => {
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

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.closest('[data-city-search]')?.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const trimmedQuery = query.trim()
  const postcodeHighlight = /^\d{2,5}$/.test(trimmedQuery) ? trimmedQuery : undefined

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
            onFocus={() => {
              if (query.trim().length >= 2) setOpen(true)
            }}
            placeholder={t('placeholder')}
            autoComplete="off"
            aria-label={t('ariaSearch')}
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
              onClick={() => {
                setQuery('')
                setResults([])
                setOpen(false)
                inputRef.current?.focus()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label={t('ariaClear')}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {open && results.length > 0 && (
        <ul
          id="city-search-results"
          role="listbox"
          aria-label={t('ariaSuggestions')}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden max-h-[min(70vh,24rem)] overflow-y-auto"
        >
          {results.map((commune, idx) => {
            const isActive = idx === activeIndex
            const cpsLine = formatPostcodesForDisplay(commune.codesPostaux, postcodeHighlight)
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
                  <span className="text-xs text-gray-400 ml-2 block sm:inline sm:ml-2 mt-0.5 sm:mt-0">
                    {cpsLine ? (
                      <>
                        <span className="text-gray-500">{cpsLine}</span>
                        <span className="text-gray-300 mx-1">·</span>
                      </>
                    ) : null}
                    <span>
                      {commune.departement?.nom} ({commune.departement?.code})
                    </span>
                  </span>
                </div>
                {commune.population ? (
                  <span className="text-xs text-gray-400 flex-shrink-0">{formatPopulation(commune.population)}</span>
                ) : null}
              </li>
            )
          })}
        </ul>
      )}

      {open && !loading && results.length === 0 && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl px-4 py-6 text-center text-sm text-gray-400">
          {t('noResults', { query })}
        </div>
      )}
    </div>
  )
}
