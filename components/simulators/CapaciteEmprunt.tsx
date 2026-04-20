'use client'

import { useMemo, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { AlertTriangle, TrendingUp } from 'lucide-react'
import { calculerCapaciteEmprunt } from '@/lib/calculators'

interface SliderProps {
  label: string
  value: number
  min: number
  max: number
  step: number
  format: (v: number) => string
  onChange: (v: number) => void
}

function Slider({ label, value, min, max, step, format, onChange }: SliderProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-bold text-primary-600">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-700 h-2 rounded-full"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  )
}

export default function CapaciteEmprunt() {
  const t = useTranslations('capaciteEmprunt')
  const locale = useLocale()

  const formatEur = (v: number) =>
    new Intl.NumberFormat(locale === 'en' ? 'en-GB' : 'fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(v)

  const [revenusNets, setRevenusNets] = useState(3500)
  const [charges, setCharges] = useState(200)
  const [taux, setTaux] = useState(3.5)
  const [duree, setDuree] = useState(20)
  const [apport, setApport] = useState(20000)

  const resultat = useMemo(
    () => calculerCapaciteEmprunt(revenusNets, charges, taux, duree),
    [revenusNets, charges, taux, duree]
  )

  const prixAchatMax = resultat.capitalMax + apport

  const endettementColor =
    resultat.tauxEndettement < 28
      ? 'text-accent-600 bg-accent-50'
      : resultat.tauxEndettement < 35
      ? 'text-orange-600 bg-orange-50'
      : 'text-red-600 bg-red-50'

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('situation')}</h2>
        <div className="space-y-6">
          <Slider
            label={t('monthlyIncome')}
            value={revenusNets}
            min={1000}
            max={15000}
            step={100}
            format={formatEur}
            onChange={setRevenusNets}
          />
          <Slider
            label={t('monthlyCharges')}
            value={charges}
            min={0}
            max={3000}
            step={50}
            format={formatEur}
            onChange={setCharges}
          />
          <Slider
            label={t('estimatedRate')}
            value={taux}
            min={0.5}
            max={8}
            step={0.1}
            format={(v) => `${v.toFixed(1)} %`}
            onChange={setTaux}
          />
          <Slider
            label={t('desiredDuration')}
            value={duree}
            min={5}
            max={30}
            step={1}
            format={(v) => `${v} ${locale === 'en' ? 'yrs' : 'ans'}`}
            onChange={setDuree}
          />
          <Slider
            label={t('personalContribution')}
            value={apport}
            min={0}
            max={200000}
            step={1000}
            format={formatEur}
            onChange={setApport}
          />
        </div>

        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-primary-600" />
            <p className="text-sm font-semibold text-primary-700">{t('whatIfMore')}</p>
          </div>
          <Slider
            label={t('additionalIncome')}
            value={0}
            min={0}
            max={5000}
            step={500}
            format={formatEur}
            onChange={(extra) => setRevenusNets((prev) => Math.max(1000, prev + extra))}
          />
          <p className="text-xs text-gray-400 mt-1">{t('whatIfMoreHint')}</p>
        </div>
      </div>

      {resultat.depasseSeuilHCSF && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-700">{t('highDebtAlert')}</p>
            <p className="text-sm text-red-600 mt-0.5">{t('highDebtDesc')}</p>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('yourCapacity')}</h2>

        <div className="bg-primary-600 rounded-xl p-6 text-white text-center mb-4">
          <p className="text-sm font-medium opacity-80 mb-1">{t('maxCapitalLabel')}</p>
          <p className="text-4xl font-bold">{formatEur(resultat.capitalMax)}</p>
          <p className="text-sm opacity-70 mt-1">
            {t('withRateAndDuration', { rate: taux.toFixed(1), duration: duree })}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('maxPurchasePrice')}</p>
            <p className="text-xl font-bold text-accent-600">{formatEur(prixAchatMax)}</p>
            <p className="text-xs text-gray-400 mt-0.5">{t('capitalPlusContrib', { amount: formatEur(apport) })}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('maxMonthly')}</p>
            <p className="text-xl font-bold text-primary-600">{formatEur(resultat.mensualiteMax)}</p>
            <p className="text-xs text-gray-400 mt-0.5">{t('debtOf33')}</p>
          </div>
          <div className={`rounded-lg p-4 text-center ${endettementColor}`}>
            <p className="text-xs uppercase tracking-wide mb-1 opacity-70">{t('debtRatio')}</p>
            <p className="text-xl font-bold">{resultat.tauxEndettement.toFixed(1)} %</p>
            <p className="text-xs opacity-70 mt-0.5">
              {resultat.tauxEndettement < 35 ? t('hcsfThreshold') : t('exceedsHCSF')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
