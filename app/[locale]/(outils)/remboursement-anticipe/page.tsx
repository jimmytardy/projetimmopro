import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { alternatesForLogicalPath } from '@/lib/seo-alternates'
import dynamic from 'next/dynamic'
import Breadcrumb from '@/components/seo/Breadcrumb'
import JsonLd from '@/components/seo/JsonLd'

const AdUnit = dynamic(() => import('@/components/ads/AdUnit'), { ssr: false })
const RemboursementAnticipe = dynamic(
  () => import('@/components/simulators/RemboursementAnticipe'),
  { ssr: false }
)

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'remboursementAnticipe' })
  return {
    title: t('pageTitle'),
    description: t('pageDesc'),
    alternates: alternatesForLogicalPath('/remboursement-anticipe', locale),
  }
}

const FAQ_ITEMS_FR = [
  {
    question: 'Qu\'est-ce que le remboursement anticipé d\'un prêt immobilier ?',
    answer: 'Le remboursement anticipé consiste à rembourser tout ou partie de votre prêt avant l\'échéance prévue. Vous pouvez choisir de réduire la durée restante ou de baisser vos mensualités.',
  },
  {
    question: 'Qu\'est-ce que l\'IRA (Indemnité de Remboursement Anticipé) ?',
    answer: 'L\'IRA est une pénalité que la banque peut vous facturer. La loi plafonne l\'IRA au minimum de : 3 % du capital remboursé par anticipation, ou 6 mensualités d\'intérêts au taux du prêt.',
  },
  {
    question: 'Vaut-il mieux réduire la durée ou la mensualité ?',
    answer: 'Réduire la durée est généralement plus intéressant financièrement. Réduire la mensualité améliore votre flux de trésorerie mensuel.',
  },
  {
    question: 'Quand est-il rentable de rembourser par anticipation ?',
    answer: 'Le remboursement anticipé est rentable quand les économies d\'intérêts dépassent le montant de l\'IRA.',
  },
  {
    question: 'Peut-on rembourser par anticipation sans pénalités ?',
    answer: 'Certains contrats prévoient la suppression des IRA en cas de vente du bien suite à mobilité professionnelle, décès du co-emprunteur ou perte d\'emploi.',
  },
]

const FAQ_ITEMS_EN = [
  {
    question: 'What is mortgage early repayment?',
    answer: 'Early repayment means paying back all or part of your loan before the scheduled term. You can choose to reduce the remaining duration or lower your monthly payments.',
  },
  {
    question: 'What is the IRA (Early Repayment Fee)?',
    answer: 'The IRA is a penalty the bank may charge. By law, it is capped at the minimum of: 3% of the early-repaid capital, or 6 months of interest at the loan rate.',
  },
  {
    question: 'Is it better to reduce duration or monthly payment?',
    answer: 'Reducing duration is generally more financially beneficial. Reducing the monthly payment improves your monthly cash flow.',
  },
  {
    question: 'When is early repayment profitable?',
    answer: 'Early repayment is profitable when interest savings exceed the IRA amount.',
  },
  {
    question: 'Can you repay early without penalties?',
    answer: 'Some contracts waive early repayment fees in case of property sale due to professional relocation, co-borrower death or job loss.',
  },
]

export default async function RemboursementAnticipePage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'remboursementAnticipe' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const FAQ_ITEMS = locale === 'en' ? FAQ_ITEMS_EN : FAQ_ITEMS_FR

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: tCommon('home'), href: '/' },
          { label: t('breadcrumb'), href: '/remboursement-anticipe' },
        ]}
      />

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{t('pageTitle')}</h1>
      <p className="text-lg text-gray-600 mb-6 leading-relaxed">{t('pageDesc')}</p>

      <AdUnit slot="before_tool_anticipe" format="leaderboard" className="mb-8" />

      <RemboursementAnticipe />

      <AdUnit slot="after_tool_anticipe" format="rectangle" className="my-8" />

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
        name="Simulateur de remboursement anticipé"
        description="Calculez les économies d'un remboursement anticipé de prêt immobilier."
        url="https://pretimmopro.fr/remboursement-anticipe"
      />
    </div>
  )
}
