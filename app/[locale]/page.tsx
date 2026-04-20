import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import {
  Calculator,
  TrendingUp,
  FileText,
  RotateCcw,
  BarChart2,
  MapPin,
  CheckCircle,
  ArrowRight,
} from 'lucide-react'
import JsonLd from '@/components/seo/JsonLd'
import RatesTable from '@/components/rates/RatesTable'
import RatesTableSkeleton from '@/components/rates/RatesTableSkeleton'

const AdUnit = dynamic(() => import('@/components/ads/AdUnit'), { ssr: false })

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'home' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: '/' },
  }
}

const ARTICLES = [
  {
    href: '/articles/taux-endettement',
    titre: 'Comment calculer son taux d\'endettement ?',
    extrait: 'Le taux d\'endettement est le principal critère des banques. Découvrez comment le calculer et les règles HCSF à respecter.',
    date: '15 avril 2026',
  },
  {
    href: '/articles/documents-dossier-pret',
    titre: 'Documents à fournir pour un dossier de prêt',
    extrait: 'Liste complète des pièces justificatives demandées par les banques pour constituer votre dossier de crédit immobilier.',
    date: '10 avril 2026',
  },
  {
    href: '/articles/ptz-2026',
    titre: 'PTZ 2026 : conditions et montants',
    extrait: 'Le Prêt à Taux Zéro a été étendu en 2026. Découvrez les nouvelles conditions d\'éligibilité et les montants selon les zones.',
    date: '1er avril 2026',
  },
]

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'home' })
  const tTools = await getTranslations({ locale, namespace: 'tools' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const OUTILS = [
    { href: '/simulateur-pret', icon: Calculator, titre: tTools('loanSimulatorName'), desc: tTools('loanSimulatorDesc'), color: 'bg-blue-50 text-blue-700' },
    { href: '/capacite-emprunt', icon: TrendingUp, titre: tTools('borrowingCapacityName'), desc: tTools('borrowingCapacityDesc'), color: 'bg-green-50 text-green-700' },
    { href: '/frais-notaire', icon: FileText, titre: tTools('notaryFeesName'), desc: tTools('notaryFeesDesc'), color: 'bg-purple-50 text-purple-700' },
    { href: '/remboursement-anticipe', icon: RotateCcw, titre: tTools('earlyRepaymentName'), desc: tTools('earlyRepaymentDesc'), color: 'bg-orange-50 text-orange-700' },
    { href: '/taux-fixe-vs-variable', icon: BarChart2, titre: tTools('fixedVsVariableName'), desc: tTools('fixedVsVariableDesc'), color: 'bg-pink-50 text-pink-700' },
    { href: '/taux-immobilier/paris', icon: MapPin, titre: tTools('ratesByCityName'), desc: tTools('ratesByCityDesc'), color: 'bg-teal-50 text-teal-700' },
  ]

  const REASSURANCE = [
    { icon: '🏠', label: t('reassurance1Label'), desc: t('reassurance1Desc') },
    { icon: '🆓', label: t('reassurance2Label'), desc: t('reassurance2Desc') },
    { icon: '🔒', label: t('reassurance3Label'), desc: t('reassurance3Desc') },
    { icon: '🎯', label: t('reassurance4Label'), desc: t('reassurance4Desc') },
  ]

  return (
    <>
      <JsonLd
        type="WebApplication"
        name="PrêtImmoPro — Simulateur de crédit immobilier"
        description="Simulateurs gratuits de prêt immobilier : mensualités, capacité d'emprunt, frais de notaire"
        url="https://pretimmopro.fr"
      />

      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <CheckCircle className="w-4 h-4 text-green-300" />
              {t('heroBadge')}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-white">
              {t('heroTitle')}{' '}
              <span className="text-yellow-300">{t('heroTitleHighlight')}</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
              {t('heroDesc1')}{' '}
              <strong className="text-white">{t('heroDesc2')}</strong>
              {t('heroDesc3')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/simulateur-pret"
                className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
              >
                {t('heroCta1')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/capacite-emprunt"
                className="inline-flex items-center gap-2 bg-primary-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-primary-400 transition-colors border border-white/20"
              >
                {t('heroCta2')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUTILS POPULAIRES ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('toolsTitle')}</h2>
        <p className="text-gray-500 mb-8">{t('toolsSubtitle')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {OUTILS.map(({ href, icon: Icon, titre, desc, color }) => (
            <Link
              key={href}
              href={href}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md hover:border-primary-200 transition-all group"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                {titre}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              <div className="flex items-center gap-1 mt-3 text-xs font-medium text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                {tCommon('access')} <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── ADSENSE ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <AdUnit slot="homepage_middle" format="leaderboard" />
      </div>

      {/* ── TAUX DU MOMENT ── */}
      <section className="bg-white border-y border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{t('ratesTitle')}</h2>
              <p className="text-sm text-gray-500">{t('ratesSubtitle')}</p>
            </div>
            <Link
              href="/taux-immobilier/paris"
              className="text-sm font-medium text-primary-600 hover:underline flex items-center gap-1"
            >
              {t('ratesViewByCity')} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <Suspense fallback={<RatesTableSkeleton />}>
            <RatesTable />
          </Suspense>
        </div>
      </section>

      {/* ── DERNIERS ARTICLES ── */}
      <section className="section-offscreen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('articlesTitle')}</h2>
          <Link href="/guides" className="text-sm font-medium text-primary-600 hover:underline flex items-center gap-1">
            {t('articlesViewAll')} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ARTICLES.map(({ href, titre, extrait, date }) => (
            <Link
              key={href}
              href={href}
              className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md hover:border-primary-200 transition-all group"
            >
              <p className="text-xs text-gray-400 mb-2">{date}</p>
              <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                {titre}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{extrait}</p>
              <div className="flex items-center gap-1 mt-3 text-xs font-medium text-primary-600">
                {t('readArticle')} <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── RÉASSURANCE ── */}
      <section className="section-offscreen bg-primary-50 border-y border-primary-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            {REASSURANCE.map(({ icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center">
                <span className="text-3xl mb-2">{icon}</span>
                <p className="font-semibold text-gray-900 text-sm">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
