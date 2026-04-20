/**
 * Server Component — fetch live rates + badge + grille taux + tableau.
 * Isolé pour être enveloppé dans <Suspense> dans VillePage :
 * le reste de la page s'affiche immédiatement pendant que ce bloc charge.
 */
import { getLiveRates, formatTaux, sourceLabel } from '@/lib/rates'
import { getCityStats } from '@/lib/cityStats'
import { TrendingUp, Home, MapPin, Users, RefreshCw } from 'lucide-react'

const DUREES = [10, 15, 20, 25] as const

function getTauxPourVille(tauxNational: number, tauxCityMoyen: number): number {
  const ecartLocal = tauxCityMoyen - 3.45
  return Math.round((tauxNational + ecartLocal) * 100) / 100
}

interface CityMini {
  tauxMoyen: number
  prixM2: number
  departement: string
  codeInsee: string
  nbCourtiers: number
}

interface Labels {
  averageRate20y: string
  avgPriceM2: string
  department: string
  localBrokers: string
  averageRate: string
  minRate: string
  maxRate: string
  dataNote: string
  liveData: string
  indicativeData: string
  duration: string
  ratesByDuration: string
}

export default async function VilleRatesSection({
  city,
  locale,
  labels,
}: {
  city: CityMini
  locale: string
  labels: Labels
}) {
  const [liveRates, cityStats] = await Promise.all([
    getLiveRates(),
    getCityStats(city),
  ])
  const tauxVille20 = getTauxPourVille(liveRates.parDuree[20], city.tauxMoyen)
  const isLive = liveRates.source !== 'static_fallback'
  const numLocale = locale === 'en' ? 'en-GB' : 'fr-FR'

  return (
    <>
      {/* Badge source live / indicatif */}
      <div className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full mb-6 bg-green-100 text-green-700">
        <RefreshCw className="w-3 h-3" />
        {isLive
          ? `${labels.liveData} · ${sourceLabel(liveRates.source)}`
          : labels.indicativeData}
      </div>

      {/* Grille des 4 cartes stat */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
          <TrendingUp className="w-5 h-5 text-primary-500 mx-auto mb-2" />
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">{labels.averageRate20y}</p>
          <p className="text-xl font-bold text-primary-600">{formatTaux(tauxVille20)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
          <Home className="w-5 h-5 text-accent-500 mx-auto mb-2" />
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">{labels.avgPriceM2}</p>
          <p className="text-xl font-bold text-accent-600">{cityStats.prixM2.toLocaleString(numLocale)} €</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
          <MapPin className="w-5 h-5 text-orange-500 mx-auto mb-2" />
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">{labels.department}</p>
          <p className="text-xl font-bold text-gray-800">{city.departement}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
          <Users className="w-5 h-5 text-purple-500 mx-auto mb-2" />
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">{labels.localBrokers}</p>
          <p className="text-xl font-bold text-gray-800">{cityStats.nbCourtiers}+</p>
        </div>
      </div>

      {/* Tableau taux par durée */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left font-semibold text-gray-700">{labels.duration}</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">{labels.averageRate}</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">{labels.minRate}</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">{labels.maxRate}</th>
            </tr>
          </thead>
          <tbody>
            {DUREES.map((duree, i) => {
              const taux = getTauxPourVille(liveRates.parDuree[duree], city.tauxMoyen)
              return (
                <tr key={duree} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {duree} {locale === 'en' ? 'yrs' : 'ans'}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-primary-600">{formatTaux(taux)}</td>
                  <td className="px-4 py-3 text-center text-accent-600">{formatTaux(Math.round((taux - 0.4) * 100) / 100)}</td>
                  <td className="px-4 py-3 text-center text-orange-500">{formatTaux(Math.round((taux + 0.3) * 100) / 100)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 mt-2">{labels.dataNote}</p>
    </>
  )
}
