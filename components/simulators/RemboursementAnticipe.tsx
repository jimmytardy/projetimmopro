'use client'

import { useMemo, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { TrendingDown, AlertCircle, Clock } from 'lucide-react'
import { calculerRemboursementAnticipe } from '@/lib/calculators'

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

export default function RemboursementAnticipe() {
  const t = useTranslations('remboursementAnticipe')
  const locale = useLocale()

  const formatEur = (v: number) =>
    new Intl.NumberFormat(locale === 'en' ? 'en-GB' : 'fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(v)

  const [capitalRestant, setCapitalRestant] = useState(150000)
  const [mensualiteActuelle, setMensualiteActuelle] = useState(850)
  const [tauxAnnuel, setTauxAnnuel] = useState(3.5)
  const [dureeRestante, setDureeRestante] = useState(15)
  const [sommeAnticipee, setSommeAnticipee] = useState(20000)
  const [mode, setMode] = useState<'reduire_duree' | 'reduire_mensualite'>('reduire_duree')

  const resultat = useMemo(
    () =>
      calculerRemboursementAnticipe(
        capitalRestant,
        mensualiteActuelle,
        tauxAnnuel,
        dureeRestante,
        sommeAnticipee,
        mode
      ),
    [capitalRestant, mensualiteActuelle, tauxAnnuel, dureeRestante, sommeAnticipee, mode]
  )

  const gainPositif = resultat.gainNet > 0

  const modeOptions = [
    { value: 'reduire_duree' as const, label: t('reduceDuration'), icon: '⏱️' },
    { value: 'reduire_mensualite' as const, label: t('reduceMonthly'), icon: '💰' },
  ]

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('objective')}</h2>
        <div className="flex gap-3 mb-6">
          {modeOptions.map(({ value, label, icon }) => (
            <button
              key={value}
              onClick={() => setMode(value)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium border-2 transition-all ${
                mode === value
                  ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300'
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          <Slider
            label={t('remainingCapital')}
            value={capitalRestant}
            min={10000}
            max={500000}
            step={5000}
            format={formatEur}
            onChange={setCapitalRestant}
          />
          <Slider
            label={t('currentMonthly')}
            value={mensualiteActuelle}
            min={200}
            max={5000}
            step={50}
            format={formatEur}
            onChange={setMensualiteActuelle}
          />
          <Slider
            label={t('currentRate')}
            value={tauxAnnuel}
            min={0.5}
            max={8}
            step={0.1}
            format={(v) => `${v.toFixed(1)} %`}
            onChange={setTauxAnnuel}
          />
          <Slider
            label={t('remainingDuration')}
            value={dureeRestante}
            min={1}
            max={30}
            step={1}
            format={(v) => `${v} ${locale === 'en' ? 'yrs' : 'ans'}`}
            onChange={setDureeRestante}
          />
          <Slider
            label={t('earlyAmount')}
            value={sommeAnticipee}
            min={1000}
            max={capitalRestant}
            step={1000}
            format={formatEur}
            onChange={setSommeAnticipee}
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('results')}</h2>

        <div className={`rounded-xl p-6 text-center mb-4 ${gainPositif ? 'bg-accent-600' : 'bg-red-500'} text-white`}>
          <div className="flex items-center justify-center gap-2 mb-1">
            <TrendingDown className="w-5 h-5 opacity-80" />
            <p className="text-sm font-medium opacity-80">{t('netGain')}</p>
          </div>
          <p className="text-4xl font-bold">{formatEur(resultat.gainNet)}</p>
          <p className="text-sm opacity-70 mt-1">
            {gainPositif ? t('profitable') : t('notProfitable')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('interestSavings')}</p>
            <p className="text-xl font-bold text-accent-600">{formatEur(resultat.economiesInterets)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{t('iraToPay')}</p>
            <p className="text-xl font-bold text-orange-500">{formatEur(resultat.ira)}</p>
            <p className="text-xs text-gray-400 mt-0.5">{t('iraFull')}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-primary-500" />
              <p className="text-xs text-primary-600 uppercase tracking-wide">{t('iraReturn')}</p>
            </div>
            <p className="text-xl font-bold text-primary-600">{resultat.delaiRetourIra} {locale === 'en' ? 'months' : 'mois'}</p>
            <p className="text-xs text-primary-400 mt-0.5">{t('beforeProfit')}</p>
          </div>
        </div>

        {mode === 'reduire_duree' && resultat.nouvelleDuree !== undefined && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-green-800 mb-1">{t('newDuration')}</p>
            <p className="text-2xl font-bold text-green-700">{resultat.nouvelleDuree.toFixed(1)} {locale === 'en' ? 'yrs' : 'ans'}</p>
            <p className="text-sm text-green-600">
              {locale === 'en'
                ? `Gain: ${(dureeRestante - resultat.nouvelleDuree).toFixed(1)} year(s) less`
                : `Gain : ${(dureeRestante - resultat.nouvelleDuree).toFixed(1)} an(s) de moins`}
            </p>
          </div>
        )}

        {mode === 'reduire_mensualite' && resultat.nouvelleMensualite !== undefined && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-green-800 mb-1">{t('newMonthly')}</p>
            <p className="text-2xl font-bold text-green-700">{formatEur(resultat.nouvelleMensualite)}</p>
            <p className="text-sm text-green-600">
              {t('monthlySaving')} : {formatEur(mensualiteActuelle - resultat.nouvelleMensualite)}
            </p>
          </div>
        )}

        <div className="mt-4 flex items-start gap-2 text-xs text-gray-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>{t('iraLegal')}</p>
        </div>
      </div>
    </div>
  )
}
