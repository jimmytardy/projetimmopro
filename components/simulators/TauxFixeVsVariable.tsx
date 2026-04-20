'use client'

import { useMemo, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { calculerMensualite } from '@/lib/calculators'

type Scenario = 'stable' | 'hausse_moderee' | 'hausse_forte'

function getTauxVariable(annee: number, tauxInitial: number, scenario: Scenario): number {
  switch (scenario) {
    case 'stable':
      return tauxInitial
    case 'hausse_moderee': {
      const t = annee <= 5 ? tauxInitial + annee * 0.3 : tauxInitial + 5 * 0.3
      return Math.min(t, 10)
    }
    case 'hausse_forte': {
      const t = annee <= 7 ? tauxInitial + annee * 0.5 : tauxInitial + 7 * 0.5
      return Math.min(t, 7)
    }
  }
}

export default function TauxFixeVsVariable() {
  const t = useTranslations('tauxFixeVsVariable')
  const locale = useLocale()

  const formatEur = (v: number) =>
    new Intl.NumberFormat(locale === 'en' ? 'en-GB' : 'fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(v)

  const [capital, setCapital] = useState(200000)
  const [duree, setDuree] = useState(20)
  const [tauxFixe, setTauxFixe] = useState(3.5)
  const [tauxVariableInitial, setTauxVariableInitial] = useState(2.8)
  const [scenario, setScenario] = useState<Scenario>('hausse_moderee')

  const chartData = useMemo(() => {
    const mensualiteFixe = calculerMensualite(capital, tauxFixe, duree)
    const data: {
      annee: number
      coutCumulFixe: number
      coutCumulVariable: number
      tauxVariable: number
    }[] = []

    let coutCumulFixe = 0
    let coutCumulVariable = 0
    let capitalRestant = capital

    for (let annee = 1; annee <= duree; annee++) {
      const tauxVar = getTauxVariable(annee, tauxVariableInitial, scenario)
      const dureeRestante = duree - annee + 1
      const mensualiteVar = calculerMensualite(capitalRestant, tauxVar, dureeRestante)

      coutCumulFixe += mensualiteFixe * 12
      coutCumulVariable += mensualiteVar * 12

      const r = tauxVar / 100 / 12
      for (let m = 0; m < 12; m++) {
        const interets = capitalRestant * r
        capitalRestant = Math.max(0, capitalRestant - (mensualiteVar - interets))
      }

      data.push({
        annee,
        coutCumulFixe: Math.round(coutCumulFixe),
        coutCumulVariable: Math.round(coutCumulVariable),
        tauxVariable: tauxVar,
      })
    }

    return data
  }, [capital, duree, tauxFixe, tauxVariableInitial, scenario])

  const coutTotalFixe = chartData[chartData.length - 1]?.coutCumulFixe ?? 0
  const coutTotalVariable = chartData[chartData.length - 1]?.coutCumulVariable ?? 0
  const mensualiteFixeInit = calculerMensualite(capital, tauxFixe, duree)
  const mensualiteVarInit = calculerMensualite(capital, tauxVariableInitial, duree)
  const fixeAvantageuxTotal = coutTotalFixe < coutTotalVariable

  const scenariosOpts: { value: Scenario; label: string; desc: string }[] = [
    { value: 'stable', label: t('stable'), desc: t('stableDesc') },
    { value: 'hausse_moderee', label: t('moderateRise'), desc: t('moderateRiseDesc') },
    { value: 'hausse_forte', label: t('strongRise'), desc: t('strongRiseDesc') },
  ]

  const currentScenarioLabel = scenariosOpts.find((s) => s.value === scenario)?.label ?? ''

  const yearLabel = locale === 'en' ? 'Yr' : 'An'

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('params')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">{t('borrowedCapital')}</label>
                <span className="text-sm font-bold text-primary-600">{formatEur(capital)}</span>
              </div>
              <input
                type="range" min={50000} max={800000} step={5000} value={capital}
                onChange={(e) => setCapital(Number(e.target.value))}
                className="w-full accent-blue-700 h-2 rounded-full"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">{t('duration')}</label>
                <span className="text-sm font-bold text-primary-600">{duree} {locale === 'en' ? 'yrs' : 'ans'}</span>
              </div>
              <input
                type="range" min={5} max={30} step={1} value={duree}
                onChange={(e) => setDuree(Number(e.target.value))}
                className="w-full accent-blue-700 h-2 rounded-full"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">{t('fixedRate')}</label>
                <span className="text-sm font-bold text-blue-700">{tauxFixe.toFixed(1)} %</span>
              </div>
              <input
                type="range" min={0.5} max={8} step={0.1} value={tauxFixe}
                onChange={(e) => setTauxFixe(Number(e.target.value))}
                className="w-full accent-blue-700 h-2 rounded-full"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">{t('initialVariableRate')}</label>
                <span className="text-sm font-bold text-orange-500">{tauxVariableInitial.toFixed(1)} %</span>
              </div>
              <input
                type="range" min={0.5} max={6} step={0.1} value={tauxVariableInitial}
                onChange={(e) => setTauxVariableInitial(Number(e.target.value))}
                className="w-full accent-blue-700 h-2 rounded-full"
              />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm font-medium text-gray-700 mb-3">{t('variableScenario')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {scenariosOpts.map(({ value, label, desc }) => (
              <button
                key={value}
                onClick={() => setScenario(value)}
                className={`py-3 px-3 rounded-xl text-left border-2 transition-all ${
                  scenario === value
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300'
                }`}
              >
                <p className="text-sm font-semibold">{label}</p>
                <p className={`text-xs mt-0.5 ${scenario === value ? 'opacity-70' : 'text-gray-400'}`}>{desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('comparison')}</h2>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="annee"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickFormatter={(v) => `${yearLabel} ${v}`}
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
            <Tooltip
              formatter={(value: number, name: string) => [
                formatEur(value),
                name === 'coutCumulFixe' ? t('fixedCumulated') : t('variableCumulated'),
              ]}
            />
            <Legend
              formatter={(v) => (v === 'coutCumulFixe' ? t('fixedCumulated') : t('variableCumulated'))}
            />
            <Line type="monotone" dataKey="coutCumulFixe" stroke="#1B4F8C" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="coutCumulVariable" stroke="#f97316" strokeWidth={2.5} dot={false} strokeDasharray="5 3" />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-700"></th>
                <th className="px-4 py-3 text-right font-semibold text-blue-700">{t('fixedRate')}</th>
                <th className="px-4 py-3 text-right font-semibold text-orange-500">{t('initialVariableRate')}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="px-4 py-3 text-gray-700">{t('initialMonthly')}</td>
                <td className="px-4 py-3 text-right font-medium text-blue-700">{formatEur(mensualiteFixeInit)}</td>
                <td className="px-4 py-3 text-right font-medium text-orange-500">{formatEur(mensualiteVarInit)}</td>
              </tr>
              <tr className="border-b border-gray-100 bg-gray-50">
                <td className="px-4 py-3 text-gray-700">{t('totalCost')}</td>
                <td className="px-4 py-3 text-right font-medium text-blue-700">{formatEur(coutTotalFixe)}</td>
                <td className="px-4 py-3 text-right font-medium text-orange-500">{formatEur(coutTotalVariable)}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-700 font-medium">{t('difference')}</td>
                <td className="px-4 py-3 text-right font-bold" colSpan={2}>
                  <span className={fixeAvantageuxTotal ? 'text-accent-600' : 'text-orange-500'}>
                    {fixeAvantageuxTotal
                      ? `${t('fixedCheaperBy')} ${formatEur(coutTotalVariable - coutTotalFixe)}`
                      : `${t('variableCheaperBy')} ${formatEur(coutTotalFixe - coutTotalVariable)}`}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          className={`mt-4 rounded-xl p-4 border ${
            fixeAvantageuxTotal
              ? 'bg-blue-50 border-blue-200 text-blue-800'
              : 'bg-orange-50 border-orange-200 text-orange-800'
          }`}
        >
          <p className="text-sm font-semibold">
            {fixeAvantageuxTotal ? t('fixedBetter') : t('variableBetter')} ({currentScenarioLabel})
          </p>
          <p className="text-xs mt-1 opacity-70">{t('disclaimer')}</p>
        </div>
      </div>
    </div>
  )
}
