'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { LigneAmortissement } from '@/lib/calculators'

interface TableauAmortissementProps {
  lignes: LigneAmortissement[]
}

export default function TableauAmortissement({ lignes }: TableauAmortissementProps) {
  const t = useTranslations('tableauAmortissement')
  const locale = useLocale()
  const [toutAfficher, setToutAfficher] = useState(false)

  const formatEur = (v: number) =>
    new Intl.NumberFormat(locale === 'en' ? 'en-GB' : 'fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(v)

  const lignesAffichees = toutAfficher ? lignes : lignes.slice(0, 5)

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('title')}</h3>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left font-semibold text-gray-700">{t('year')}</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">{t('monthly')}</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">{t('repaidCapital')}</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">{t('interests')}</th>
              <th className="px-4 py-3 text-right font-semibold text-gray-700">{t('remainingCapital')}</th>
            </tr>
          </thead>
          <tbody>
            {lignesAffichees.map((ligne, i) => (
              <tr
                key={ligne.annee}
                className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                  i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="px-4 py-2.5 font-medium text-gray-900">{t('year')} {ligne.annee}</td>
                <td className="px-4 py-2.5 text-right text-gray-700">{formatEur(ligne.mensualite)}</td>
                <td className="px-4 py-2.5 text-right text-accent-600 font-medium">{formatEur(ligne.capitalRembourse)}</td>
                <td className="px-4 py-2.5 text-right text-orange-500">{formatEur(ligne.interetsPaies)}</td>
                <td className="px-4 py-2.5 text-right text-gray-700">{formatEur(ligne.capitalRestant)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {lignes.length > 5 && (
        <button
          onClick={() => setToutAfficher(!toutAfficher)}
          className="mt-3 flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          {toutAfficher ? (
            <>
              <ChevronUp className="w-4 h-4" />
              {t('collapse')}
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              {t('showAll', { n: lignes.length })}
            </>
          )}
        </button>
      )}
    </div>
  )
}
