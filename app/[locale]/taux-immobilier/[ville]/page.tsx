import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import { MapPin, TrendingUp, Users, Home, RefreshCw } from 'lucide-react'
import { CITIES, getCityBySlug } from '@/lib/cities'
import { getLiveRates, formatTaux, sourceLabel } from '@/lib/rates'
import Breadcrumb from '@/components/seo/Breadcrumb'
import JsonLd from '@/components/seo/JsonLd'

const AdUnit = dynamic(() => import('@/components/ads/AdUnit'), { ssr: false })
const SimulateurPret = dynamic(() => import('@/components/simulators/SimulateurPret'), { ssr: false })

export function generateStaticParams() {
  return ['fr', 'en'].flatMap((locale) =>
    CITIES.map((city) => ({ locale, ville: city.slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: { ville: string; locale: string }
}): Promise<Metadata> {
  const city = getCityBySlug(params.ville)
  if (!city) return {}
  return {
    title: `Taux immobilier à ${city.nom} en 2026 — Simulateur prêt`,
    description: `Taux immobiliers moyens à ${city.nom} en 2026 : ${city.tauxMoyen} % sur 20 ans. Prix au m² ${city.prixM2.toLocaleString('fr-FR')} €. Simulez votre prêt immobilier à ${city.nom}.`,
    alternates: { canonical: `/taux-immobilier/${city.slug}` },
  }
}

function getTauxPourVille(tauxNational: number, duree: number, tauxCityMoyen: number): number {
  const ecartLocal = tauxCityMoyen - 3.45
  return Math.round((tauxNational + ecartLocal) * 100) / 100
}

const DUREES = [10, 15, 20, 25]

export default async function VillePage({
  params: { ville, locale },
}: {
  params: { ville: string; locale: string }
}) {
  const city = getCityBySlug(ville)
  if (!city) notFound()

  const t = await getTranslations({ locale, namespace: 'ville' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const liveRates = await getLiveRates()
  const tauxVille20 = getTauxPourVille(liveRates.parDuree[20], 20, city.tauxMoyen)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pretimmopro.fr'
  const montantExemple = Math.round(city.prixM2 * 50 * 0.9 / 10000) * 10000

  const numLocale = locale === 'en' ? 'en-GB' : 'fr-FR'

  const faqItems = [
    {
      question: locale === 'en'
        ? `What is the mortgage rate in ${city.nom} in 2026?`
        : `Quel taux immobilier à ${city.nom} en 2026 ?`,
      answer: locale === 'en'
        ? `In ${city.nom}, the average 20-year rate in 2026 is approximately ${tauxVille20}%. Best profiles can get lower rates through a local mortgage broker.`
        : `À ${city.nom}, le taux moyen observé sur 20 ans en 2026 est d'environ ${tauxVille20} %. Les meilleurs dossiers peuvent obtenir des taux inférieurs en passant par un courtier immobilier local.`,
    },
    {
      question: locale === 'en'
        ? `What is the price per m² in ${city.nom}?`
        : `Quel est le prix au m² à ${city.nom} ?`,
      answer: locale === 'en'
        ? `The average price per m² in ${city.nom} is about ${city.prixM2.toLocaleString(numLocale)} € in 2026. This price varies significantly by neighborhood and property type.`
        : `Le prix moyen au m² à ${city.nom} est d'environ ${city.prixM2.toLocaleString('fr-FR')} € en 2026.`,
    },
    {
      question: locale === 'en'
        ? `How much to borrow to buy in ${city.nom}?`
        : `Combien emprunter pour acheter à ${city.nom} ?`,
      answer: locale === 'en'
        ? `For a 50m² apartment in ${city.nom} (about ${(city.prixM2 * 50).toLocaleString(numLocale)} €), you'd need to borrow about ${(city.prixM2 * 50 * 0.9).toLocaleString(numLocale)} € with 10% down.`
        : `Pour un appartement de 50 m² à ${city.nom} (soit environ ${(city.prixM2 * 50).toLocaleString('fr-FR')} €), il vous faudrait emprunter environ ${(city.prixM2 * 50 * 0.9).toLocaleString('fr-FR')} € avec 10 % d'apport.`,
    },
    {
      question: locale === 'en'
        ? `Is a broker needed to buy in ${city.nom}?`
        : `Faut-il un courtier pour un achat à ${city.nom} ?`,
      answer: locale === 'en'
        ? `A local mortgage broker knows regional banks and can get better terms. In ${city.nom}, there are many independent and franchise brokers available.`
        : `Un courtier immobilier local connaît les banques régionales et peut obtenir des conditions plus avantageuses. À ${city.nom}, on compte de nombreux courtiers indépendants et franchisés.`,
    },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: tCommon('home'), href: '/' },
          { label: t('viewByCity'), href: '/taux-immobilier/paris' },
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
              addressRegion: city.nom,
              addressCountry: 'FR',
              postalCode: city.departement,
            },
          }),
        }}
      />

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
        {t('rateIn')} {city.nom} {t('in2026')}
      </h1>
      <p className="text-lg text-gray-600 mb-4 leading-relaxed">
        {t('consultRates', { city: city.nom })}{' '}
        <strong className="text-primary-600">{formatTaux(tauxVille20)}</strong>.
      </p>

      <div className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full mb-6 bg-green-100 text-green-700">
        <RefreshCw className="w-3 h-3" />
        {liveRates.source === 'static_fallback'
          ? t('indicativeData')
          : t('liveData', { source: sourceLabel(liveRates.source) })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
          <TrendingUp className="w-5 h-5 text-primary-500 mx-auto mb-2" />
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">{t('averageRate20y')}</p>
          <p className="text-xl font-bold text-primary-600">{formatTaux(tauxVille20)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
          <Home className="w-5 h-5 text-accent-500 mx-auto mb-2" />
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">{t('avgPriceM2')}</p>
          <p className="text-xl font-bold text-accent-600">{city.prixM2.toLocaleString(numLocale)} €</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
          <MapPin className="w-5 h-5 text-orange-500 mx-auto mb-2" />
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">{t('department')}</p>
          <p className="text-xl font-bold text-gray-800">{city.departement}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
          <Users className="w-5 h-5 text-purple-500 mx-auto mb-2" />
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">{t('localBrokers')}</p>
          <p className="text-xl font-bold text-gray-800">{city.nbCourtiers}+</p>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {t('ratesByDuration', { city: city.nom })}
        </h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">{t('department').includes('Dép') ? 'Durée' : 'Duration'}</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">{t('averageRate')}</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">{t('minRate')}</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">{t('maxRate')}</th>
              </tr>
            </thead>
            <tbody>
              {DUREES.map((duree, i) => {
                const tauxNational = liveRates.parDuree[duree as 10 | 15 | 20 | 25]
                const taux = getTauxPourVille(tauxNational, duree, city.tauxMoyen)
                return (
                  <tr key={duree} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-4 py-3 font-medium text-gray-900">{duree} {locale === 'en' ? 'yrs' : 'ans'}</td>
                    <td className="px-4 py-3 text-center font-bold text-primary-600">{formatTaux(taux)}</td>
                    <td className="px-4 py-3 text-center text-accent-600">{formatTaux(Math.round((taux - 0.4) * 100) / 100)}</td>
                    <td className="px-4 py-3 text-center text-orange-500">{formatTaux(Math.round((taux + 0.3) * 100) / 100)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {t('dataNote', { source: sourceLabel(liveRates.source) })}
        </p>
      </section>

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
