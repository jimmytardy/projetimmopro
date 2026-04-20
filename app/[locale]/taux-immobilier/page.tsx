import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { MapPin, ArrowRight, Search } from 'lucide-react'
import { CITIES } from '@/lib/cities'
import Breadcrumb from '@/components/seo/Breadcrumb'
import dynamic from 'next/dynamic'

const CitySearch = dynamic(() => import('@/components/search/CitySearch'), { ssr: false })

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  return {
    title: 'Taux immobiliers par ville 2026 — Recherchez votre commune',
    description:
      'Consultez les taux immobiliers et le prix au m² de votre ville en 2026. Recherchez parmi toutes les communes françaises et simulez votre prêt immobilier localement.',
    alternates: { canonical: '/taux-immobilier' },
  }
}

export default async function TauxImmobilierPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  setRequestLocale(locale)
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const ZONES = [
    { label: 'Zone A bis',      color: 'bg-red-100 text-red-700',    cities: ['paris'] },
    { label: 'Zone A',          color: 'bg-orange-100 text-orange-700', cities: ['nice', 'lyon', 'marseille'] },
    { label: 'Zone B1',         color: 'bg-yellow-100 text-yellow-700', cities: ['bordeaux', 'toulouse', 'nantes', 'strasbourg'] },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: tCommon('home'), href: '/' },
          { label: 'Taux par ville', href: '/taux-immobilier' },
        ]}
      />

      {/* ── En-tête ── */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
            <Search className="w-5 h-5 text-primary-600" />
          </div>
          <span className="text-sm font-medium text-primary-600 uppercase tracking-wide">
            Toutes les communes françaises
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Taux immobiliers par ville en 2026
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Recherchez n'importe quelle commune française : taux de crédit, prix au m², zone PTZ et simulateur de prêt personnalisé.
        </p>
      </header>

      {/* ── Barre de recherche ── */}
      <section className="mb-12">
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-6 sm:p-10 shadow-xl">
          <div className="max-w-2xl mx-auto text-center mb-6">
            <MapPin className="w-8 h-8 text-yellow-300 mx-auto mb-3" />
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Quelle est votre ville ?
            </h2>
            <p className="text-blue-100 text-sm">
              Par nom de ville ou code postal — Grenoble, 38000, Annecy, 74000…
            </p>
          </div>
          <div className="max-w-xl mx-auto">
            <CitySearch placeholder="Ville ou code postal (ex : Grenoble, 38000)" />
          </div>
          <p className="text-center text-blue-200 text-xs mt-4">
            Données issues de geo.api.gouv.fr · Prix estimés d'après les transactions DVF 2024
          </p>
        </div>
      </section>

      {/* ── Grandes villes ── */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-5">
          Grandes villes référencées
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {CITIES.map((city) => (
            <Link
              key={city.slug}
              href={`/taux-immobilier/${city.slug}` as `/taux-immobilier/${string}`}
              className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-primary-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {city.nom}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-gray-500">
                Dép. {city.departement}
              </p>
              <p className="text-sm font-bold text-primary-600 mt-1">
                {city.tauxMoyen.toFixed(2).replace('.', ',')} % <span className="font-normal text-gray-400 text-xs">sur 20 ans</span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {city.prixM2.toLocaleString('fr-FR')} €/m²
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Info zones PTZ ── */}
      <section className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Les zones PTZ en France
        </h2>
        <p className="text-sm text-gray-600 mb-5">
          La zone PTZ de votre commune détermine le montant maximal du Prêt à Taux Zéro auquel vous pouvez prétendre.
          Elle est calculée selon la tension du marché immobilier local.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ZONES.map(({ label, color, cities: slugs }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-200 p-4">
              <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${color}`}>
                {label}
              </span>
              <p className="text-xs text-gray-500">
                {slugs.map((s) => CITIES.find((c) => c.slug === s)?.nom).filter(Boolean).join(', ')}
                {slugs.length > 0 ? '…' : ''}
              </p>
            </div>
          ))}
        </div>
        <Link
          href="/articles/ptz-2026"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:underline mt-4"
        >
          En savoir plus sur le PTZ 2026 <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>

      {/* ── Bloc explicatif ── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-2">Comment sont calculés les taux ?</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Les taux affichés sont basés sur les données officielles de la Banque de France, ajustés par
            zone géographique. Pour les villes non référencées, ils sont estimés à partir de la moyenne
            départementale.
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="font-semibold text-gray-900 mb-2">D'où viennent les prix au m² ?</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Les prix proviennent des transactions DVF (Demandes de Valeurs Foncières) du Ministère des
            Finances. Pour les villes hors base, la moyenne départementale est utilisée comme estimation.
          </p>
        </div>
      </section>
    </div>
  )
}
