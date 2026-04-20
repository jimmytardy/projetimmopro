import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import dynamic from 'next/dynamic'
import Breadcrumb from '@/components/seo/Breadcrumb'
import JsonLd from '@/components/seo/JsonLd'

const AdUnit = dynamic(() => import('@/components/ads/AdUnit'), { ssr: false })
const TauxFixeVsVariable = dynamic(
  () => import('@/components/simulators/TauxFixeVsVariable'),
  { ssr: false }
)

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'tauxFixeVsVariable' })
  return {
    title: t('pageTitle'),
    description: t('pageDesc'),
    alternates: { canonical: '/taux-fixe-vs-variable' },
  }
}

const FAQ_ITEMS_FR = [
  {
    question: 'Quelle est la différence entre taux fixe et taux variable ?',
    answer: 'Un taux fixe reste identique pendant toute la durée du prêt. Un taux variable évolue périodiquement en fonction d\'un indice de référence (souvent l\'Euribor).',
  },
  {
    question: 'Quel taux choisir en 2026 : fixe ou variable ?',
    answer: 'En 2026, avec des taux fixes encore relativement élevés, un taux variable avec cap peut être attractif. Le taux fixe reste conseillé pour sécuriser votre budget sur le long terme.',
  },
  {
    question: 'Qu\'est-ce qu\'un taux variable capé ?',
    answer: 'Un taux variable capé est un taux variable dont la hausse est limitée par un plafond contractuel (souvent cap +1, +2 ou +3 points).',
  },
  {
    question: 'Comment fonctionne l\'Euribor ?',
    answer: 'L\'Euribor est le taux auquel les banques européennes se prêtent de l\'argent entre elles. Les taux variables immobiliers sont indexés sur l\'Euribor 3 mois ou 12 mois.',
  },
  {
    question: 'Peut-on passer d\'un taux variable à un taux fixe ?',
    answer: 'Oui, certains contrats prévoient cette option. Vous pouvez aussi renégocier votre prêt ou le racheter par un autre établissement.',
  },
]

const FAQ_ITEMS_EN = [
  {
    question: 'What is the difference between fixed and variable rates?',
    answer: 'A fixed rate stays the same throughout the loan term. A variable rate changes periodically based on a reference index (usually Euribor).',
  },
  {
    question: 'Which rate to choose in 2026: fixed or variable?',
    answer: 'In 2026, with fixed rates still relatively high, a capped variable rate can be attractive. Fixed rates are still recommended for long-term budget security.',
  },
  {
    question: 'What is a capped variable rate?',
    answer: 'A capped variable rate is one whose increase is limited by a contractual ceiling (often cap +1, +2 or +3 points above the initial rate).',
  },
  {
    question: 'How does Euribor work?',
    answer: 'Euribor is the rate at which European banks lend money to each other. Variable mortgage rates are indexed to the 3-month or 12-month Euribor.',
  },
  {
    question: 'Can you switch from variable to fixed rate?',
    answer: 'Yes, some contracts allow this option. You can also renegotiate your loan or refinance with another institution.',
  },
]

export default async function TauxFixeVsVariablePage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'tauxFixeVsVariable' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const FAQ_ITEMS = locale === 'en' ? FAQ_ITEMS_EN : FAQ_ITEMS_FR

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: tCommon('home'), href: '/' },
          { label: t('breadcrumb'), href: '/taux-fixe-vs-variable' },
        ]}
      />

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{t('pageTitle')}</h1>
      <p className="text-lg text-gray-600 mb-6 leading-relaxed">{t('pageDesc')}</p>

      <AdUnit slot="before_tool_taux" format="leaderboard" className="mb-8" />

      <TauxFixeVsVariable />

      <AdUnit slot="after_tool_taux" format="rectangle" className="my-8" />

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('faqTitle')}</h2>
        <JsonLd type="FAQPage" questions={FAQ_ITEMS} />
        <div className="space-y-4">
          {FAQ_ITEMS.map(({ question, answer }) => (
            <details
              key={question}
              className="bg-white border border-gray-200 rounded-xl shadow-sm group"
            >
              <summary className="px-5 py-4 cursor-pointer font-semibold text-gray-900 hover:text-primary-600 transition-colors list-none flex justify-between items-center">
                {question}
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-lg">▾</span>
              </summary>
              <p className="px-5 pb-4 text-gray-600 leading-relaxed">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <JsonLd
        type="WebApplication"
        name="Comparateur taux fixe vs variable"
        description="Comparez un prêt immobilier à taux fixe et à taux variable selon différents scénarios."
        url="https://pretimmopro.fr/taux-fixe-vs-variable"
      />
    </div>
  )
}
