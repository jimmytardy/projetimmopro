'use client'

import { useMemo, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { calculerFraisNotaire } from '@/lib/calculators'

const DEPARTEMENTS = [
  { value: '75', label: '75 — Paris' },
  { value: '69', label: '69 — Rhône (Lyon)' },
  { value: '13', label: '13 — Bouches-du-Rhône (Marseille)' },
  { value: '33', label: '33 — Gironde (Bordeaux)' },
  { value: '31', label: '31 — Haute-Garonne (Toulouse)' },
  { value: '44', label: '44 — Loire-Atlantique (Nantes)' },
  { value: '06', label: '06 — Alpes-Maritimes (Nice)' },
  { value: '67', label: '67 — Bas-Rhin (Strasbourg)' },
  { value: 'autre', label: 'Autre département' },
]

export default function FraisNotaire() {
  const t = useTranslations('fraisNotaire')
  const locale = useLocale()

  const formatEur = (v: number) =>
    new Intl.NumberFormat(locale === 'en' ? 'en-GB' : 'fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(v)

  const [prixAchat, setPrixAchat] = useState(250000)
  const [typeLogement, setTypeLogement] = useState<'ancien' | 'neuf'>('ancien')
  const [departement, setDepartement] = useState('75')

  const resultat = useMemo(
    () => calculerFraisNotaire(prixAchat, typeLogement, departement),
    [prixAchat, typeLogement, departement]
  )

  const lignes = [
    {
      label: t('transferTax'),
      montant: resultat.droitsMutation,
      note: typeLogement === 'ancien' ? t('transferTaxNote') : t('transferTaxNoteNew'),
    },
    {
      label: t('notaryEmoluments'),
      montant: resultat.emolumentsNotaire,
      note: t('notaryNote'),
    },
    {
      label: t('csi'),
      montant: resultat.csi,
      note: t('csiNote'),
    },
    {
      label: t('disbursements'),
      montant: resultat.debours,
      note: t('disbursementsNote'),
    },
  ]

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('yourAcquisition')}</h2>

        <div className="space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">{t('purchasePrice')}</label>
              <span className="text-sm font-bold text-primary-600">{formatEur(prixAchat)}</span>
            </div>
            <input
              type="range"
              min={50000}
              max={2000000}
              step={5000}
              value={prixAchat}
              onChange={(e) => setPrixAchat(Number(e.target.value))}
              className="w-full accent-blue-700 h-2 rounded-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{formatEur(50000)}</span>
              <span>{formatEur(2000000)}</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">{t('housingType')}</p>
            <div className="flex gap-3">
              {(['ancien', 'neuf'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeLogement(type)}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium border transition-colors ${
                    typeLogement === type
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-primary-300'
                  }`}
                >
                  {type === 'ancien' ? t('old') : t('new')}
                </button>
              ))}
            </div>
            {typeLogement === 'neuf' && (
              <p className="text-xs text-accent-600 mt-2">{t('newDiscount')}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">{t('department')}</label>
            <select
              value={departement}
              onChange={(e) => setDepartement(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {DEPARTEMENTS.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('details')}</h2>

        <div className="overflow-hidden rounded-xl border border-gray-200 mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">{t('item')}</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden sm:table-cell">{t('detail')}</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">{t('amount')}</th>
              </tr>
            </thead>
            <tbody>
              {lignes.map((ligne, i) => (
                <tr key={ligne.label} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-4 py-3 text-gray-800 font-medium">{ligne.label}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">{ligne.note}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-800">{formatEur(ligne.montant)}</td>
                </tr>
              ))}
              <tr className="bg-primary-50 border-t-2 border-primary-200">
                <td className="px-4 py-3 font-bold text-primary-800">{t('totalFees')}</td>
                <td className="px-4 py-3 text-xs text-primary-600 hidden sm:table-cell">
                  {t('effectiveRate', { rate: resultat.tauxEffectif.toFixed(2) })}
                </td>
                <td className="px-4 py-3 text-right font-bold text-primary-700 text-lg">{formatEur(resultat.total)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('purchasePriceLabel')}</p>
            <p className="text-xl font-bold text-gray-800">{formatEur(prixAchat)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('notaryFeesLabel')}</p>
            <p className="text-xl font-bold text-orange-500">{formatEur(resultat.total)}</p>
            <p className="text-xs text-gray-400 mt-0.5">{resultat.tauxEffectif.toFixed(2)} {t('percentOfPrice')}</p>
          </div>
          <div className="bg-accent-50 rounded-lg p-4 text-center border border-accent-100">
            <p className="text-xs text-accent-600 uppercase tracking-wide mb-1">{t('totalBudget')}</p>
            <p className="text-xl font-bold text-accent-700">{formatEur(prixAchat + resultat.total)}</p>
            <p className="text-xs text-accent-500 mt-0.5">{t('excludingContrib')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
