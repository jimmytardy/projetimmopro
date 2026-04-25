import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { alternatesForLogicalPath } from '@/lib/seo-alternates'
import dynamic from 'next/dynamic'
import Breadcrumb from '@/components/seo/Breadcrumb'
import JsonLd from '@/components/seo/JsonLd'

const AdUnit = dynamic(() => import('@/components/ads/AdUnit'), { ssr: false })
const SimulateurPret = dynamic(() => import('@/components/simulators/SimulateurPret'), { ssr: false })

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'simulateurPret' })
  return {
    title: t('pageTitle'),
    description: t('pageDesc'),
    alternates: alternatesForLogicalPath('/simulateur-pret', locale),
    keywords: [
      'simulateur prêt immobilier',
      'calcul mensualité prêt',
      'tableau amortissement',
      'calculette prêt immobilier 2026',
    ],
  }
}

const FAQ_ITEMS_FR = [
  {
    question: 'Comment calculer ses mensualités de prêt immobilier ?',
    answer: 'La mensualité se calcule avec la formule : M = C × [r(1+r)^n] / [(1+r)^n - 1], où C est le capital emprunté, r le taux mensuel (taux annuel / 12) et n le nombre de mensualités. Notre simulateur effectue ce calcul automatiquement.',
  },
  {
    question: 'Quel taux immobilier en 2026 ?',
    answer: 'En avril 2026, les taux immobiliers moyens se situent entre 3,15 % sur 10 ans et 3,65 % sur 25 ans. Les meilleurs profils peuvent obtenir des taux sous les 3 %.',
  },
  {
    question: 'Quel salaire pour emprunter 200 000 € ?',
    answer: 'Pour emprunter 200 000 € sur 20 ans à 3,45 %, la mensualité est d\'environ 1 150 €. Avec la règle des 33 % d\'endettement, il faut un revenu net mensuel d\'au moins 3 500 €.',
  },
  {
    question: 'Quelle durée de prêt choisir ?',
    answer: 'Une durée courte (15 ans) réduit le coût total des intérêts mais augmente la mensualité. Une durée longue (25 ans) allège la mensualité mais augmente le coût total.',
  },
  {
    question: 'Comment réduire ses mensualités ?',
    answer: 'Plusieurs leviers : allonger la durée du prêt, augmenter l\'apport personnel, négocier un meilleur taux (avec un courtier), renégocier son prêt existant, ou effectuer un remboursement anticipé partiel.',
  },
]

const FAQ_ITEMS_EN = [
  {
    question: 'How to calculate mortgage monthly payments?',
    answer: 'The monthly payment is calculated using the formula: M = C × [r(1+r)^n] / [(1+r)^n - 1], where C is the borrowed capital, r the monthly rate (annual rate / 12) and n the number of payments. Our simulator does this automatically.',
  },
  {
    question: 'What are mortgage rates in France in 2026?',
    answer: 'In April 2026, average French mortgage rates range from 3.15% over 10 years to 3.65% over 25 years. The best profiles can get rates below 3%.',
  },
  {
    question: 'What income is needed to borrow €200,000?',
    answer: 'To borrow €200,000 over 20 years at 3.45%, the monthly payment is about €1,150. With the 33% debt rule, you need a net monthly income of at least €3,500.',
  },
  {
    question: 'What loan duration to choose?',
    answer: 'A shorter duration (15 years) reduces total interest cost but increases the monthly payment. A longer duration (25 years) reduces the monthly payment but increases total cost.',
  },
  {
    question: 'How to reduce monthly payments?',
    answer: 'Several options: extend the loan duration, increase personal contribution, negotiate a better rate (with a broker), renegotiate your existing loan, or make a partial early repayment.',
  },
]

export default async function SimulateurPretPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'simulateurPret' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const FAQ_ITEMS = locale === 'en' ? FAQ_ITEMS_EN : FAQ_ITEMS_FR

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: tCommon('home'), href: '/' },
          { label: t('breadcrumb'), href: '/simulateur-pret' },
        ]}
      />

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
        {t('pageTitle')}
      </h1>
      <p className="text-lg text-gray-600 mb-6 leading-relaxed">{t('pageDesc')}</p>

      <AdUnit slot="before_tool_simulateur" format="leaderboard" className="mb-8" />

      <SimulateurPret />

      <AdUnit slot="after_tool_simulateur" format="rectangle" className="my-8" />

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
        name="Simulateur de prêt immobilier"
        description="Calculez vos mensualités de prêt immobilier, le tableau d'amortissement et le coût total des intérêts."
        url="https://pretimmopro.fr/simulateur-pret"
      />
    </div>
  )
}
