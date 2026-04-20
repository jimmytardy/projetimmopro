/**
 * Server Component — s'exécute côté serveur avec cache ISR 24h.
 */
import { getLiveRates, sourceLabel, formatTaux } from '@/lib/rates'
import { calculerMensualite } from '@/lib/calculators'
import { RefreshCw, Info } from 'lucide-react'
import { getTranslations, getLocale } from 'next-intl/server'

const DUREES = [10, 15, 20, 25] as const
const CAPITAL_EXEMPLE = 150_000

function formatDate(iso: string, locale: string): string {
  if (iso.length === 7) {
    const [year, month] = iso.split('-')
    return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString(
      locale === 'en' ? 'en-GB' : 'fr-FR',
      { month: 'long', year: 'numeric' }
    )
  }
  return new Date(iso).toLocaleDateString(locale === 'en' ? 'en-GB' : 'fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function RatesTable() {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'ratesTable' })
  const rates = await getLiveRates()
  const isLive = rates.source !== 'static_fallback'

  const formatEur = (v: number) =>
    new Intl.NumberFormat(locale === 'en' ? 'en-GB' : 'fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(v)

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
              isLive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            <RefreshCw className="w-3 h-3" />
            {isLive ? t('liveData') : t('indicativeData')}
          </span>

          {rates.source === 'banque_de_france' && (
            <span className="text-xs text-gray-500">
              {t('source')} : <strong>{t('sourceBDF')}</strong> —{' '}
              {formatDate(rates.dateObservation, locale)}
            </span>
          )}
          {rates.source === 'ecb' && (
            <span className="text-xs text-gray-500">
              {t('sourceECB', { rate: formatTaux(rates.euribor3m!) })}
            </span>
          )}
          {rates.source === 'static_fallback' && (
            <span className="text-xs text-gray-400">{t('sourceStatic')}</span>
          )}
        </div>

        {rates.euribor3m !== null && (
          <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
            Euribor 3M : {formatTaux(rates.euribor3m)}
          </span>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-left">
              <th className="px-4 py-3 font-semibold text-gray-700">{t('duration')}</th>
              <th className="px-4 py-3 font-semibold text-gray-700 text-center">{t('averageRate')}</th>
              <th className="px-4 py-3 font-semibold text-gray-700 text-center hidden sm:table-cell">
                {t('monthly')}
              </th>
              <th className="px-4 py-3 font-semibold text-gray-700 text-center hidden md:table-cell">
                {t('interestCost')}
              </th>
            </tr>
          </thead>
          <tbody>
            {DUREES.map((duree, i) => {
              const taux = rates.parDuree[duree]
              const mensualite = calculerMensualite(CAPITAL_EXEMPLE, taux, duree)
              const coutInterets = mensualite * duree * 12 - CAPITAL_EXEMPLE

              return (
                <tr
                  key={duree}
                  className={`border-b border-gray-100 last:border-0 ${
                    i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-gray-900">{duree} {t('years')}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-bold text-primary-600">{formatTaux(taux)}</span>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-700 hidden sm:table-cell">
                    {formatEur(mensualite)}
                  </td>
                  <td className="px-4 py-3 text-center text-orange-500 hidden md:table-cell">
                    {formatEur(coutInterets)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-start gap-1.5 mt-2">
        <Info className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gray-400 leading-relaxed">
          {t('note', { amount: formatEur(CAPITAL_EXEMPLE), source: sourceLabel(rates.source) })}
        </p>
      </div>
    </div>
  )
}
