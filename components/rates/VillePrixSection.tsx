/**
 * Server Component — tableau prix m² détaillé (apt/maison × ancien/neuf).
 *
 * Textes : namespace **villePrix** (messages fr.json / en.json).
 */
import { getTranslations } from 'next-intl/server'
import { Building2, Home, Database, Info } from 'lucide-react'
import { fetchPrixDetail, type PrixDetailSource } from '@/lib/cityStats'
import type { PtzZone } from '@/lib/departmentData'
import { PTZ_ZONE_LABELS } from '@/lib/departmentData'

interface Props {
  codeInsee: string
  nom: string
  prixFallback: number
  ptzZone: PtzZone
  locale: string
}

function PriceCell({
  value,
  highlight = false,
  tag,
  numLocale,
}: {
  value: number
  highlight?: boolean
  tag?: string
  numLocale: string
}) {
  return (
    <td className={`px-4 py-4 text-center align-middle ${highlight ? 'bg-primary-50' : 'bg-white'}`}>
      <span className={`text-base font-bold ${highlight ? 'text-primary-700' : 'text-gray-800'}`}>
        {value.toLocaleString(numLocale)} €/m²
      </span>
      {tag && (
        <span className="block text-[10px] font-medium text-gray-400 mt-0.5 uppercase tracking-wide">
          {tag}
        </span>
      )}
    </td>
  )
}

function sourceBadge(src: PrixDetailSource, labelCityPrices: string, labelDept: string) {
  if (src === 'city_prices') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
        <Database className="w-3 h-3" />
        {labelCityPrices}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
      <Info className="w-3 h-3" />
      {labelDept}
    </span>
  )
}

export default async function VillePrixSection({
  codeInsee,
  nom,
  prixFallback,
  ptzZone,
  locale,
}: Props) {
  const t = await getTranslations({ locale, namespace: 'villePrix' })
  const prix = await fetchPrixDetail(codeInsee, prixFallback, ptzZone)

  const neufCoefPct = Math.round((prix.aptNeuf / prix.aptAncien - 1) * 100)
  const numLocale = locale === 'en' ? 'en-GB' : 'fr-FR'

  const aptNeufTag =
    prix.detailSource === 'city_prices' && prix.aptNeufFromFile ? t('tagDvf') : t('tagEstimated')

  const maiNeufTag =
    prix.detailSource === 'city_prices' && prix.maisonNeufFromFile ? t('tagDvf') : t('tagEstimated')

  const ancienSousLigne =
    prix.detailSource === 'city_prices' ? t('ancienFromDvf') : t('ancienFromRef')

  const cpsPart =
    prix.detailSource === 'city_prices' && prix.localMeta?.cps?.length
      ? `${t('metaCpsPrefix')}${prix.localMeta.cps.join(', ')}`
      : ''

  const metaLigne =
    prix.detailSource === 'city_prices' && prix.localMeta
      ? t('metaTransactions', {
          nb: prix.localMeta.nb.toLocaleString(numLocale),
          insee: codeInsee,
          cps: cpsPart,
        })
      : null

  const neufCoefBadge =
    prix.detailSource === 'city_prices' && (!prix.aptNeufFromFile || !prix.maisonNeufFromFile) ? (
      <span className="inline-flex items-center gap-1 text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
        <Info className="w-3 h-3" />
        {t('neufCoefNoDvf', { pct: String(neufCoefPct) })}
      </span>
    ) : prix.detailSource !== 'city_prices' ? (
      <span className="inline-flex items-center gap-1 text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
        <Info className="w-3 h-3" />
        {t('neufEstimate', { pct: String(neufCoefPct) })}
      </span>
    ) : null

  const footerSource =
    prix.detailSource === 'city_prices' ? t('footerCityPrices') : t('footerNotInFile')

  const zoneLabel = PTZ_ZONE_LABELS[ptzZone]
  const footerNeuf =
    prix.detailSource === 'city_prices'
      ? t('footerNeufDvf', { zone: zoneLabel })
      : t('footerNeufMarket', { zone: zoneLabel })

  return (
    <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-8">
      {prix.detailSource !== 'city_prices' && (
        <div className="px-5 py-3 bg-amber-50 border-b border-amber-100 text-sm text-amber-900 flex gap-2 items-start">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden />
          <p className="leading-relaxed">{t('noDvfDetailBanner')}</p>
        </div>
      )}
      <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {t('title', { city: nom })}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">{t('subtitle')}</p>
          {metaLigne && <p className="text-[11px] text-emerald-700 mt-1 font-medium">{metaLigne}</p>}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {sourceBadge(prix.detailSource, t('badgeCityPrices'), t('badgeDept'))}
          {neufCoefBadge}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left font-semibold text-gray-500 w-32" />
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                <span className="flex items-center justify-center gap-1.5">
                  <Building2 className="w-4 h-4 text-primary-500" />
                  {t('colFlat')}
                </span>
              </th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">
                <span className="flex items-center justify-center gap-1.5">
                  <Home className="w-4 h-4 text-orange-500" />
                  {t('colHouse')}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-4 text-left bg-gray-50">
                <span className="text-sm font-semibold text-gray-700 block">{t('rowResale')}</span>
                <span className="text-[11px] text-gray-400 font-normal">{ancienSousLigne}</span>
              </th>
              <PriceCell value={prix.aptAncien} highlight numLocale={numLocale} />
              <PriceCell value={prix.maisonAncienne} numLocale={numLocale} />
            </tr>

            <tr>
              <th className="px-4 py-4 text-left bg-gray-50">
                <span className="text-sm font-semibold text-gray-700 block">{t('rowNew')}</span>
                <span className="text-[11px] text-gray-400 font-normal">
                  {prix.detailSource === 'city_prices' ? t('rowNewHintDvf') : t('rowNewHintEst')}
                </span>
              </th>
              <PriceCell value={prix.aptNeuf} highlight tag={aptNeufTag} numLocale={numLocale} />
              <PriceCell value={prix.maisonNeuve} tag={maiNeufTag} numLocale={numLocale} />
            </tr>
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px] text-gray-400">
        <span>
          {footerSource}
          {footerNeuf}
        </span>
      </div>
    </section>
  )
}
