import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Info, ArrowRight } from 'lucide-react'
import { CITIES, getCityBySlug } from '@/lib/cities'
import { fetchCityBySlug, type DynamicCity } from '@/lib/geocode'
import { PTZ_ZONE_LABELS } from '@/lib/departmentData'
import { Link } from '@/i18n/navigation'
import Breadcrumb from '@/components/seo/Breadcrumb'
import JsonLd from '@/components/seo/JsonLd'
import VilleRatesSection from '@/components/rates/VilleRatesSection'
import VilleRatesSkeleton from '@/components/rates/VilleRatesSkeleton'

const AdUnit = dynamic(() => import('@/components/ads/AdUnit'), { ssr: false })
const SimulateurPret = dynamic(() => import('@/components/simulators/SimulateurPret'), { ssr: false })

// Pré-génère les 8 villes statiques. Les autres sont rendues à la demande (dynamicParams = true par défaut).
export function generateStaticParams() {
  return ['fr', 'en'].flatMap((locale) =>
    CITIES.map((city) => ({ locale, ville: city.slug }))
  )
}

type AnyCity = ReturnType<typeof getCityBySlug> | DynamicCity

async function resolveCity(ville: string): Promise<AnyCity> {
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
  return {
    title: `Taux immobilier à ${city.nom} en 2026 — Simulateur prêt`,
    description: `Taux immobiliers ${isDynamic ? 'estimés' : 'moyens'} à ${city.nom} en 2026 : ${city.tauxMoyen} % sur 20 ans. Prix au m² ${city.prixM2.toLocaleString('fr-FR')} €. Simulez votre prêt immobilier à ${city.nom}.`,
    alternates: { canonical: `/taux-immobilier/${city.slug}` },
    ...(isDynamic && { robots: { index: false } }),
  }
}

export default async function VillePage({
  params: { ville, locale },
}: {
  params: { ville: string; locale: string }
}) {
  const city = await resolveCity(ville)
  if (!city) notFound()

  const isDynamic = 'isDynamic' in city && city.isDynamic
  const dynamicCity = isDynamic ? (city as DynamicCity) : null

  const t = await getTranslations({ locale, namespace: 'ville' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pretimmopro.fr'
  const montantExemple = Math.round(city.prixM2 * 50 * 0.9 / 10000) * 10000
  const numLocale = locale === 'en' ? 'en-GB' : 'fr-FR'

  const faqItems = [
    {
      question: locale === 'en'
        ? `What is the mortgage rate in ${city.nom} in 2026?`
        : `Quel taux immobilier à ${city.nom} en 2026 ?`,
      answer: locale === 'en'
        ? `In ${city.nom}, the average 20-year rate in 2026 is approximately ${city.tauxMoyen}%.`
        : `À ${city.nom}, le taux moyen estimé sur 20 ans en 2026 est d'environ ${city.tauxMoyen} %. Les meilleurs dossiers peuvent obtenir des taux inférieurs via un courtier local.`,
    },
    {
      question: locale === 'en'
        ? `What is the price per m² in ${city.nom}?`
        : `Quel est le prix au m² à ${city.nom} ?`,
      answer: locale === 'en'
        ? `The average price per m² in ${city.nom} is about ${city.prixM2.toLocaleString(numLocale)} € in 2026.`
        : `Le prix moyen au m² à ${city.nom} est d'environ ${city.prixM2.toLocaleString('fr-FR')} € en 2026${isDynamic ? ` (estimation basée sur la moyenne du département ${dynamicCity?.nomDepartement})` : ''}.`,
    },
    {
      question: locale === 'en'
        ? `How much to borrow to buy in ${city.nom}?`
        : `Combien emprunter pour acheter à ${city.nom} ?`,
      answer: locale === 'en'
        ? `For a 50m² in ${city.nom} (~${(city.prixM2 * 50).toLocaleString(numLocale)} €), you need ~${(city.prixM2 * 50 * 0.9).toLocaleString(numLocale)} € with 10% down.`
        : `Pour un bien de 50 m² à ${city.nom} (soit environ ${(city.prixM2 * 50).toLocaleString('fr-FR')} €), il vous faudrait emprunter environ ${(city.prixM2 * 50 * 0.9).toLocaleString('fr-FR')} € avec 10 % d'apport.`,
    },
    {
      question: locale === 'en'
        ? `Is PTZ available in ${city.nom}?`
        : `Le PTZ est-il accessible à ${city.nom} ?`,
      answer: locale === 'en'
        ? `${city.nom} is likely in PTZ zone ${dynamicCity?.ptzZone ?? 'B1'}.`
        : `${city.nom} est situé en ${PTZ_ZONE_LABELS[dynamicCity?.ptzZone ?? 'B1']}. Cette zone détermine le montant maximal du PTZ et les conditions d'éligibilité.`,
    },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: tCommon('home'), href: '/' },
          { label: 'Taux par ville', href: '/taux-immobilier' },
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
            name: `Crédit immobilier à ${city.nom}`,
            description: `Taux immobiliers et simulateur de prêt pour ${city.nom}`,
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

      {/* ── Badge données estimées (villes dynamiques uniquement) ── */}
      {isDynamic && dynamicCity && (
        <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-sm">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-medium text-amber-800">Données estimées</span>
            <span className="text-amber-700">
              {' '}— {city.nom} ({dynamicCity.codePostal}) · Dép. {dynamicCity.nomDepartement} · Zone PTZ {dynamicCity.ptzZone}.
              Les prix au m² sont des moyennes départementales ; les taux sont calculés à partir des données nationales.
            </span>
            {' '}
            <Link href="/taux-immobilier" className="font-medium text-amber-700 underline underline-offset-2 hover:text-amber-900">
              Rechercher une autre ville <ArrowRight className="inline w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* ── En-tête ── */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
        Taux immobilier à {city.nom} en 2026
      </h1>
      <p className="text-lg text-gray-600 mb-8 leading-relaxed">
        Consultez les taux de crédit immobilier à {city.nom} en 2026.{' '}
        Taux moyen sur 20 ans :{' '}
        <strong className="text-primary-600">
          {city.tauxMoyen.toFixed(2).replace('.', ',')} %
        </strong>.
        {isDynamic && dynamicCity && (
          <span className="text-sm text-gray-400 ml-2">
            (estimation — dép. {dynamicCity.nomDepartement})
          </span>
        )}
      </p>

      {/* ── Zone PTZ (villes dynamiques) ── */}
      {isDynamic && dynamicCity && (
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">Zone PTZ</p>
            <p className="font-bold text-gray-900">{PTZ_ZONE_LABELS[dynamicCity.ptzZone]}</p>
            <p className="text-xs text-gray-500 mt-1">
              Détermine votre montant PTZ maximal
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Département</p>
            <p className="font-bold text-gray-900">{dynamicCity.nomDepartement} ({dynamicCity.departement})</p>
            <p className="text-xs text-gray-500 mt-1">
              Code postal : {dynamicCity.codePostal}
              {dynamicCity.population > 0 && ` · ~${Math.round(dynamicCity.population / 1000)}k hab.`}
            </p>
          </div>
        </section>
      )}

      {/* ── Taux live — streaming via Suspense ── */}
      <section className="mb-8">
        <Suspense fallback={<VilleRatesSkeleton />}>
          <VilleRatesSection
            city={city}
            locale={locale}
            labels={{
              averageRate20y:  t('averageRate20y'),
              avgPriceM2:      t('avgPriceM2'),
              department:      t('department'),
              localBrokers:    t('localBrokers'),
              averageRate:     t('averageRate'),
              minRate:         t('minRate'),
              maxRate:         t('maxRate'),
              dataNote:        t('dataNote', { source: isDynamic ? `estimation dept. ${dynamicCity?.nomDepartement}` : 'Banque de France' }),
              liveData:        t('liveData', { source: '' }).trim(),
              indicativeData:  t('indicativeData'),
              duration:        locale === 'en' ? 'Duration' : 'Durée',
              ratesByDuration: t('ratesByDuration', { city: city.nom }),
            }}
          />
        </Suspense>
      </section>

      {/* ── PTZ info (villes dynamiques) ── */}
      {isDynamic && dynamicCity && (
        <section className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            PTZ à {city.nom} — {PTZ_ZONE_LABELS[dynamicCity.ptzZone]}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            En tant que commune classée en {dynamicCity.ptzZone}, {city.nom} ouvre droit au Prêt à Taux Zéro
            {dynamicCity.ptzZone === 'C' || dynamicCity.ptzZone === 'B2'
              ? ' pour les logements anciens avec travaux (≥ 25 % du coût total) et pour tous les logements neufs.'
              : ' pour les logements neufs et anciens avec travaux sur toutes les zones.'}
          </p>
          <Link
            href="/articles/ptz-2026"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:underline"
          >
            Consulter le guide PTZ 2026 complet <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>
      )}

      {/* ── Prix immobiliers ── */}
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
          {isDynamic && ' · Estimation basée sur la moyenne départementale'}
        </p>
      </section>

      <AdUnit slot="local_middle" format="rectangle" className="mb-8" />

      {/* ── Simulateur ── */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {t('simulateIn', { city: city.nom })}
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {t('prefilledWith', { city: city.nom, rate: city.tauxMoyen })}
        </p>
        <SimulateurPret montantInitial={montantExemple} tauxInitial={city.tauxMoyen} />
      </section>

      {/* ── Courtiers ── */}
      <section className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          {t('brokersIn', { city: city.nom })}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">
          {t('brokersDesc', { n: city.nbCourtiers, city: city.nom })}
        </p>
        <p className="text-sm text-gray-500">{t('brokersNetworks')}</p>
      </section>

      {/* ── FAQ ── */}
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
