'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Menu, X, ChevronDown, Calculator, TrendingUp, FileText, MapPin } from 'lucide-react'
import { CITIES } from '@/lib/cities'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import Logo from '@/components/Logo'

export default function Header() {
  const t = useTranslations('nav')
  const tTools = useTranslations('tools')

  const [menuOpen, setMenuOpen] = useState(false)
  const [simulateursOpen, setSimulateursOpen] = useState(false)
  const [villesOpen, setVillesOpen] = useState(false)

  const outils = [
    { href: '/simulateur-pret', label: tTools('loanSimulatorName'), icon: Calculator },
    { href: '/capacite-emprunt', label: tTools('borrowingCapacityName'), icon: TrendingUp },
    { href: '/frais-notaire', label: tTools('notaryFeesName'), icon: FileText },
    { href: '/remboursement-anticipe', label: tTools('earlyRepaymentName'), icon: Calculator },
    { href: '/taux-fixe-vs-variable', label: tTools('fixedVsVariableName'), icon: TrendingUp },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="hover:opacity-90 transition-opacity" aria-label="PrêtImmoPro — Accueil">
            <Logo size={34} showName={true} />
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-6" aria-label={t('mainNav')}>
            {/* Dropdown Simulateurs */}
            <div className="relative">
              <button
                className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors py-2"
                onMouseEnter={() => setSimulateursOpen(true)}
                onMouseLeave={() => setSimulateursOpen(false)}
                onClick={() => setSimulateursOpen((v) => !v)}
                aria-expanded={simulateursOpen}
                aria-haspopup="true"
              >
                {t('simulators')}
                <ChevronDown className={`w-4 h-4 transition-transform ${simulateursOpen ? 'rotate-180' : ''}`} />
              </button>

              {simulateursOpen && (
                <div
                  className="absolute top-full left-0 w-64 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50"
                  onMouseEnter={() => setSimulateursOpen(true)}
                  onMouseLeave={() => setSimulateursOpen(false)}
                >
                  {outils.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                      onClick={() => setSimulateursOpen(false)}
                    >
                      <Icon className="w-4 h-4 text-primary-400" />
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/guides" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
              {t('guides')}
            </Link>

            {/* Dropdown Taux par ville */}
            <div className="relative">
              <button
                className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors py-2"
                onMouseEnter={() => setVillesOpen(true)}
                onMouseLeave={() => setVillesOpen(false)}
                onClick={() => setVillesOpen((v) => !v)}
                aria-expanded={villesOpen}
              >
                {t('ratesByCity')}
                <ChevronDown className={`w-4 h-4 transition-transform ${villesOpen ? 'rotate-180' : ''}`} />
              </button>

              {villesOpen && (
                <div
                  className="absolute top-full left-0 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50"
                  onMouseEnter={() => setVillesOpen(true)}
                  onMouseLeave={() => setVillesOpen(false)}
                >
                  <Link
                    href="/taux-immobilier"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors border-b border-gray-100 mb-1"
                    onClick={() => setVillesOpen(false)}
                  >
                    <MapPin className="w-3.5 h-3.5 text-primary-500" />
                    Rechercher une ville…
                  </Link>
                  {CITIES.map((city) => (
                    <Link
                      key={city.slug}
                      href={`/taux-immobilier/${city.slug}` as `/taux-immobilier/${string}`}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600 transition-colors"
                      onClick={() => setVillesOpen(false)}
                    >
                      <MapPin className="w-3.5 h-3.5 text-accent-500" />
                      {city.nom}
                      <span className="ml-auto text-xs text-gray-400">{city.tauxMoyen}%</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/simulateur-pret"
              className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {t('simulateMyLoan')}
            </Link>

            <LanguageSwitcher />
          </nav>

          {/* Burger mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <button
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-1">
            <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {t('simulators')}
            </p>
            {outils.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            <div className="border-t border-gray-100 my-2" />
            <Link
              href="/guides"
              className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {t('guides')}
            </Link>
            <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-2">
              {t('ratesByCity')}
            </p>
            <Link
              href="/taux-immobilier"
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-primary-700 bg-primary-50 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <MapPin className="w-3.5 h-3.5" />
              Rechercher une ville…
            </Link>
            {CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/taux-immobilier/${city.slug}` as `/taux-immobilier/${string}`}
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {city.nom}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
