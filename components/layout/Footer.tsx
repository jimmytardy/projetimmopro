'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Shield, FileText } from 'lucide-react'
import Logo from '@/components/Logo'
import AffiliateDisclosure from '@/components/monetization/AffiliateDisclosure'

export default function Footer() {
  const t = useTranslations('footer')
  const tTools = useTranslations('tools')
  const annee = new Date().getFullYear()

  const outils = [
    { href: '/simulateur-pret', label: tTools('loanSimulatorName') },
    { href: '/capacite-emprunt', label: tTools('borrowingCapacityName') },
    { href: '/frais-notaire', label: tTools('notaryFeesName') },
    { href: '/remboursement-anticipe', label: tTools('earlyRepaymentName') },
    { href: '/taux-fixe-vs-variable', label: tTools('fixedVsVariableName') },
  ]

  const guides = [
    { href: '/articles/taux-endettement', label: "Taux d'endettement" },
    { href: '/articles/documents-dossier-pret', label: 'Documents dossier prêt' },
    { href: '/articles/ptz-2026', label: 'PTZ 2026' },
  ]

  const villes = [
    { href: '/taux-immobilier/paris', label: 'Paris' },
    { href: '/taux-immobilier/lyon', label: 'Lyon' },
    { href: '/taux-immobilier/marseille', label: 'Marseille' },
    { href: '/taux-immobilier/bordeaux', label: 'Bordeaux' },
    { href: '/taux-immobilier/toulouse', label: 'Toulouse' },
    { href: '/taux-immobilier/nantes', label: 'Nantes' },
    { href: '/taux-immobilier/nice', label: 'Nice' },
    { href: '/taux-immobilier/strasbourg', label: 'Strasbourg' },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Colonne marque */}
          <div>
            <Link href="/" className="inline-block mb-4 hover:opacity-80 transition-opacity" aria-label="PrêtImmoPro — Accueil">
              <Logo size={32} showName={true} nameColor="white" />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">{t('tagline')}</p>
            <div className="flex items-center gap-2 mt-4 bg-gray-800 rounded-lg px-3 py-2">
              <Shield className="w-4 h-4 text-accent-500 flex-shrink-0" />
              <span className="text-xs text-gray-400">{t('independent')}</span>
            </div>
          </div>

          {/* Simulateurs */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t('simulators')}
            </h3>
            <ul className="space-y-2">
              {outils.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Guides + Villes */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t('guides')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/guides" className="text-sm text-gray-400 hover:text-white transition-colors">
                  {t('guidesAll')}
                </Link>
              </li>
              {guides.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href as `/articles/${string}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/a-propos" className="text-sm text-gray-400 hover:text-white transition-colors">
                  {t('about')}
                </Link>
              </li>
            </ul>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 mt-6">
              {t('ratesByCity')}
            </h3>
            <ul className="grid grid-cols-2 gap-1">
              {villes.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href as `/taux-immobilier/${string}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t('legal')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/mentions-legales" className="text-sm text-gray-400 hover:text-white transition-colors">
                  {t('legalNotice')}
                </Link>
              </li>
              <li>
                <Link href="/cgu" className="text-sm text-gray-400 hover:text-white transition-colors">
                  {t('tos')}
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="text-sm text-gray-400 hover:text-white transition-colors">
                  {t('privacy')}
                </Link>
              </li>
            </ul>

            <div className="mt-6 p-3 bg-gray-800 rounded-lg border border-gray-700">
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-400 leading-relaxed">{t('disclaimer')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 max-w-3xl mx-auto">
          <AffiliateDisclosure variant="footer" />
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-500">
            © {annee} PrêtImmoPro — {t('allRightsReserved')}
          </p>
          <p className="text-xs text-gray-500">
            {t('indicativeData')} {annee}
          </p>
        </div>
      </div>
    </footer>
  )
}
