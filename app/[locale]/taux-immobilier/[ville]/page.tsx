import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { alternatesForLogicalPath } from '@/lib/seo-alternates'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Info, ArrowRight } from 'lucide-react'
import { CITIES, getCityBySlug } from '@/lib/cities'
import { fetchCityBySlug, type DynamicCity } from '@/lib/geocode'
import { PTZ_ZONE_LABELS, getDepartmentData } from '@/lib/departmentData'
import type { PtzZone } from '@/lib/departmentData'
import { Link } from '@/i18n/navigation'
import Breadcrumb from '@/components/seo/Breadcrumb'
import JsonLd from '@/components/seo/JsonLd'
import VilleRatesSection from '@/components/rates/VilleRatesSection'
import VilleRatesSkeleton from '@/components/rates/VilleRatesSkeleton'
import VillePrixSection from '@/components/rates/VillePrixSection'
import VillePrixSkeleton from '@/components/rates/VillePrixSkeleton'

const AdUnit = dynamic(() => import('@/components/ads/AdUnit'), { ssr: false })
const SimulateurPret = dynamic(() => import('@/components/simulators/SimulateurPret'), { ssr: false })

export function generateStaticParams() {
  return ['fr', 'en'].flatMap((locale) =>
    CITIES.map((city) => ({ locale, ville: city.slug }))
  )
}

type AnyCity = NonNullable<ReturnType<typeof getCityBySlug>> | DynamicCity

async function resolveCity(ville: string): Promise<AnyCity | null> {
  const staticCity = getCityBySlug(ville)
  if (staticCity) return staticCity
  return fetchCityBySlug(ville)
}

export async function generateMetadata({
  params,
}: {
  params: { ville: string; locale: string }
}): Promise<Metadata> {
  const city = await resolveCity(params.ville)
  if (!city) return {}
  const isDynamic = 'isDynamic' in city && city.isDynamic
  const t = await getTranslations({ locale: params.locale, namespace: 'ville' })
  const numLocale = params.locale === 'en' ? 'en-GB' : 'fr-FR'
  const prix = city.prixM2.toLocaleString(numLocale)
  return {
    title: t('metaTitle', { city: city.nom }),
    description: t(isDynamic ? 'metaDescDynamic' : 'metaDescStatic', {
      city: city.nom,
      taux: city.tauxMoyen,
      prix,
    }),
    alternates: alternatesForLogicalPath(`/taux-immobilier/${city.slug}`, params.locale),
    ...(isDynamic && { robots: { index: false } }),
  }
}

export default async function VillePage({
  params: { ville, locale },
}: {
  params: { ville: string; locale: string }
}) {
  setRequestLocale(locale)
  const city = await resolveCity(ville)
  if (!city) notFound()

  const isDynamic = 'isDynamic' in city && city.isDynamic
  const dynamicCity = isDynamic ? (city as DynamicCity) : null

  const ptzZone: PtzZone = dynamicCity?.ptzZone ?? getDepartmentData(city.departement).ptzZone

  const t = await getTranslations({ locale, namespace: 'ville' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tRatesCity = await getTranslations({ locale, namespace: 'ratesCity' })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pretimmopro.fr'
  const montantExemple = Math.round(city.prixM2 * 50 * 0.9 / 10000) * 10000
  const numLocale = locale === 'en' ? 'en-GB' : 'fr-FR'

  const ptzFaqKey = (dynamicCity?.ptzZone ?? 'B1') as PtzZone
  const faqPtzZoneText = locale === 'en' ? ptzFaqKey : PTZ_ZONE_LABELS[ptzFaqKey]

  const total50 = (city.prixM2 * 50).toLocaleString(numLocale)
  const borrow90 = (city.prixM2 * 50 * 0.9).toLocaleString(numLocale)

  const faqItems = [
    {
      question: t('faqRateQ', { city: city.nom }),
      answer: t('faqRateA', { city: city.nom, taux: String(city.tauxMoyen) }),
    },
    {
      question: t('faqPriceQ', { city: city.nom }),
      answer:
        t('faqPriceAStatic', { city: city.nom, prix: city.prixM2.toLocaleString(numLocale) }) +
        (isDynamic && dynamicCity
          ? t('faqPriceADynamicSuffix', { dept: dynamicCity.nomDepartement })
          : ''),
    },
    {
      question: t('faqBorrowQ', { city: city.nom }),
      answer: t('faqBorrowA', { city: city.nom, total50, borrow: borrow90 }),
    },
    {
      question: t('faqPtzQ', { city: city.nom }),
      answer: t('faqPtzA', { city: city.nom, zone: faqPtzZoneText }),
    },
  ]

  const popSuffix =
    dynamicCity && dynamicCity.population > 0
      ? t('popApprox', { k: String(Math.round(dynamicCity.population / 1000)) })
      : ''

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: tCommon('home'), href: '/' },
          { label: tNav('ratesByCity'), href: '/taux-immobilier' },
          { label: city.nom, href: `/taux-immobilier/${city.slug}` },
        ]}
      />

      <JsonLd type="FAQPage" questions={faqItems} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: t('jsonLdName', { city: city.nom }),
            description: t('jsonLdDesc', { city: city.nom }),
            url: `${siteUrl}/taux-immobilier/${city.slug}`,
            address: {
              '@type': 'PostalAddress',
              addressLocality: city.nom,
              addressCountry: 'FR',
              postalCode: 'codePostal' in city ? city.codePostal : city.departement,
            },
          }),
        }}
      />

      {isDynamic && dynamicCity && (
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-sm">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-medium text-amber-800">{t('dynamicBadgeTitle')}</span>
            <span className="text-amber-700">
              {' '}
              {t('dynamicBadgeText', {
                city: city.nom,
                cp: dynamicCity.codePostal,
                dept: dynamicCity.nomDepartement,
                ptz: dynamicCity.ptzZone,
              })}
            </span>
            {' '}
            <Link href="/taux-immobilier" className="font-medium text-amber-700 underline underline-offset-2 hover:text-amber-900">
              {t('dynamicBadgeLink')} <ArrowRight className="inline w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
        {t('h1', { city: city.nom })}
      </h1>
      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
        {t('intro', { city: city.nom })}{' '}
        <strong className="text-primary-600">
          {city.tauxMoyen.toFixed(2).replace('.', locale === 'en' ? '.' : ',')} %
        </strong>.
        {isDynamic && dynamicCity && (
          <span className="text-sm text-gray-400 ml-2">
            {t('estimationDept', { dept: dynamicCity.nomDepartement })}
          </span>
        )}
      </p>

      {isDynamic && dynamicCity && (
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">{t('ptzCardTitle')}</p>
            <p className="font-bold text-gray-900">{PTZ_ZONE_LABELS[dynamicCity.ptzZone]}</p>
            <p className="text-xs text-gray-500 mt-1">{t('ptzCardHint')}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{t('deptCardTitle')}</p>
            <p className="font-bold text-gray-900">{dynamicCity.nomDepartement} ({dynamicCity.departement})</p>
            <p className="text-xs text-gray-500 mt-1">
              {t('postalLine', { cp: dynamicCity.codePostal, pop: popSuffix })}
            </p>
          </div>
        </section>
      )}

      <section className="mb-8">
        <Suspense fallback={<VilleRatesSkeleton />}>
          <VilleRatesSection
            city={city}
            locale={locale}
            labels={{
              averageRate20y: t('averageRate20y'),
              avgPriceM2: t('avgPriceM2'),
              department: t('department'),
              localBrokers: t('localBrokers'),
              averageRate: t('averageRate'),
              minRate: t('minRate'),
              maxRate: t('maxRate'),
              dataNote: t('dataNote'),
              liveData: t('liveData', { source: '' }).trim(),
              indicativeData: t('indicativeData'),
              duration: t('durationTableHeader'),
              ratesByDuration: t('ratesByDuration', { city: city.nom }),
              yearsShort: t('durationYears'),
              m2DvfBadgeLine: tRatesCity('m2DvfBadgeLine'),
            }}
          />
        </Suspense>
      </section>

      <Suspense fallback={<VillePrixSkeleton />}>
        <VillePrixSection
          codeInsee={city.codeInsee}
          nom={city.nom}
          prixFallback={city.prixM2}
          ptzZone={ptzZone}
          locale={locale}
        />
      </Suspense>

      {isDynamic && dynamicCity && (
        <section className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            {t('ptzDynamicTitle', { city: city.nom, zone: PTZ_ZONE_LABELS[dynamicCity.ptzZone] })}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            {dynamicCity.ptzZone === 'C' || dynamicCity.ptzZone === 'B2'
              ? t('ptzDynamicBodyC', { zone: dynamicCity.ptzZone, city: city.nom })
              : t('ptzDynamicBodyOther', { zone: dynamicCity.ptzZone, city: city.nom })}
          </p>
          <Link
            href="/articles/ptz-2026"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:underline"
          >
            {t('ptzGuideLink')} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>
      )}

      <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          {t('propertyPrices', { city: city.nom })}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500 mb-1">{t('studio')}</p>
            <p className="text-lg font-bold text-gray-800">{(city.prixM2 * 25).toLocaleString(numLocale)} €</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">{t('t3')}</p>
            <p className="text-lg font-bold text-gray-800">{(city.prixM2 * 65).toLocaleString(numLocale)} €</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">{t('t5')}</p>
            <p className="text-lg font-bold text-gray-800">{(city.prixM2 * 100).toLocaleString(numLocale)} €</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3 text-center">
          {t('priceNote', { price: city.prixM2.toLocaleString(numLocale) })}
          {isDynamic && t('propertyEstimationSuffix')}
        </p>
      </section>

      <AdUnit slot="local_middle" format="rectangle" className="mb-8" />

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {t('simulateIn', { city: city.nom })}
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {t('prefilledWith', { city: city.nom, rate: city.tauxMoyen })}
        </p>
        <SimulateurPret montantInitial={montantExemple} tauxInitial={city.tauxMoyen} />
      </section>

      <section className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          {t('brokersIn', { city: city.nom })}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          {t('brokersDesc', { n: city.nbCourtiers, city: city.nom })}
        </p>
        <p className="text-sm text-gray-500">{t('brokersNetworks')}</p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-5">
          {t('faqTitle', { city: city.nom })}
        </h2>
        <div className="space-y-4">
          {faqItems.map(({ question, answer }) => (
            <details key={question} className="bg-white border border-gray-200 rounded-xl shadow-sm group">
              <summary className="px-5 py-4 cursor-pointer font-semibold text-gray-900 hover:text-primary-600 transition-colors list-none flex justify-between items-center">
                {question}
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg">▾</span>
              </summary>
              <p className="px-5 pb-4 text-gray-600 leading-relaxed">{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}
