'use client'

import { useMemo, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import dynamic from 'next/dynamic'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { calculerMensualite, calculerAmortissement } from '@/lib/calculators'
import TableauAmortissement from './TableauAmortissement'

const AdUnit = dynamic(() => import('@/components/ads/AdUnit'), { ssr: false })

interface MetricCardProps {
  label: string
  value: string
  sub?: string
  accent?: 'green' | 'orange' | 'red' | 'default'
}

function MetricCard({ label, value, sub, accent = 'default' }: MetricCardProps) {
  const colorMap = {
    green: 'text-accent-600',
    orange: 'text-orange-500',
    red: 'text-red-600',
    default: 'text-primary-600',
  }
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colorMap[accent]}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

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

interface Props {
  montantInitial?: number
  tauxInitial?: number
}

export default function SimulateurPret({ montantInitial = 200000, tauxInitial = 3.5 }: Props) {
  const t = useTranslations('simulateurPret')
  const locale = useLocale()

  const formatEur = (v: number) =>
    new Intl.NumberFormat(locale === 'en' ? 'en-GB' : 'fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(v)

  const [montant, setMontant] = useState(montantInitial)
  const [taux, setTaux] = useState(tauxInitial)
  const [duree, setDuree] = useState(20)
  const [assurance, setAssurance] = useState(50)
  const [salaire, setSalaire] = useState(3000)

  const mensualite = useMemo(() => calculerMensualite(montant, taux, duree), [montant, taux, duree])
  const mensualiteTotale = mensualite + assurance
  const coutTotalInterets = mensualite * duree * 12 - montant
  const coutTotal = mensualite * duree * 12
  const tauxEndettement = (mensualiteTotale / salaire) * 100
  const pcCapital = (montant / (montant + coutTotalInterets)) * 100
  const pcInterets = 100 - pcCapital

  const amortissement = useMemo(() => calculerAmortissement(montant, taux, duree), [montant, taux, duree])

  const chartData = useMemo(() => {
    let interetsCumules = 0
    return [
      { annee: 0, capitalRestant: montant, interetsCumules: 0 },
      ...amortissement.map((l) => {
        interetsCumules += l.interetsPaies
        return {
          annee: l.annee,
          capitalRestant: Math.round(l.capitalRestant),
          interetsCumules: Math.round(interetsCumules),
        }
      }),
    ]
  }, [amortissement, montant])

  const endettementAccent =
    tauxEndettement < 28 ? 'green' : tauxEndettement < 35 ? 'orange' : 'red'

  const debtSubLabel =
    tauxEndettement > 35 ? t('exceedsHCSF') : tauxEndettement > 28 ? t('watchZone') : t('correct')

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean
    payload?: { value: number; name: string }[]
    label?: string
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow p-3 text-sm">
          <p className="font-semibold text-gray-700 mb-1">{t('yearLabel')} {label}</p>
          {payload.map((p) => (
            <p key={p.name} className="text-gray-600">
              {p.name === 'capitalRestant' ? t('remainingCapital') : t('cumulatedInterests')} :{' '}
              <span className="font-bold">{formatEur(p.value)}</span>
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8">
      {/* Inputs */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('params')}</h2>
        <div className="space-y-6">
          <Slider
            label={t('loanAmount')}
            value={montant}
            min={50000}
            max={800000}
            step={5000}
            format={formatEur}
            onChange={setMontant}
          />
          <Slider
            label={t('annualRate')}
            value={taux}
            min={0.5}
            max={8}
            step={0.1}
            format={(v) => `${v.toFixed(1)} %`}
            onChange={setTaux}
          />
          <Slider
            label={t('duration')}
            value={duree}
            min={5}
            max={30}
            step={1}
            format={(v) => `${v} ${locale === 'en' ? 'yrs' : 'ans'}`}
            onChange={setDuree}
          />
          <Slider
            label={t('insurance')}
            value={assurance}
            min={0}
            max={300}
            step={5}
            format={formatEur}
            onChange={setAssurance}
          />
          <Slider
            label={t('salary')}
            value={salaire}
            min={1000}
            max={15000}
            step={100}
            format={formatEur}
            onChange={setSalaire}
          />
        </div>
      </div>

      <AdUnit slot="simulator_middle" format="leaderboard" />

      {/* Résultats */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('results')}</h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <MetricCard
            label={t('monthlyExclInsurance')}
            value={formatEur(mensualite)}
            sub={t('perMonth')}
          />
          <MetricCard
            label={t('totalMonthly')}
            value={formatEur(mensualiteTotale)}
            sub={t('insuranceAmount', { amount: formatEur(assurance) })}
          />
          <MetricCard
            label={t('totalInterests')}
            value={formatEur(coutTotalInterets)}
            sub={`${t('totalCost')} : ${formatEur(coutTotal)}`}
            accent="orange"
          />
          <MetricCard
            label={t('debtRatio')}
            value={`${tauxEndettement.toFixed(1)} %`}
            sub={debtSubLabel}
            accent={endettementAccent as 'green' | 'orange' | 'red'}
          />
        </div>

        {/* Barre de répartition */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">{t('capitalVsInterest')}</p>
          <div className="flex h-5 rounded-full overflow-hidden">
            <div className="bg-primary-600 transition-all duration-500" style={{ width: `${pcCapital}%` }} />
            <div className="bg-orange-400 transition-all duration-500" style={{ width: `${pcInterets}%` }} />
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-600 inline-block" />
              {t('capital')} {pcCapital.toFixed(0)} %
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" />
              {t('interests')} {pcInterets.toFixed(0)} %
            </span>
          </div>
        </div>

        {/* Graphique */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">{t('evolutionChart')}</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="annee"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickFormatter={(v) => `${t('yearLabel')} ${v}`}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                tickFormatter={(v) =>
                  new Intl.NumberFormat(locale === 'en' ? 'en-GB' : 'fr-FR', {
                    notation: 'compact',
                    maximumFractionDigits: 0,
                  }).format(v)
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value) =>
                  value === 'capitalRestant' ? t('remainingCapital') : t('cumulatedInterests')
                }
              />
              <Area type="monotone" dataKey="capitalRestant" stroke="#1B4F8C" fill="#1B4F8C" fillOpacity={0.3} strokeWidth={2} />
              <Area type="monotone" dataKey="interetsCumules" stroke="#E07B5A" fill="#E07B5A" fillOpacity={0.3} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <TableauAmortissement lignes={amortissement} />
      </div>
    </div>
  )
}
