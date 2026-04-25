import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { alternatesForLogicalPath } from '@/lib/seo-alternates'
import dynamic from 'next/dynamic'
import Breadcrumb from '@/components/seo/Breadcrumb'
import JsonLd from '@/components/seo/JsonLd'

const AdUnit = dynamic(() => import('@/components/ads/AdUnit'), { ssr: false })
const CapaciteEmprunt = dynamic(() => import('@/components/simulators/CapaciteEmprunt'), { ssr: false })

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'capaciteEmprunt' })
  return {
    title: t('pageTitle'),
    description: t('pageDesc'),
    alternates: alternatesForLogicalPath('/capacite-emprunt', locale),
  }
}

const FAQ_ITEMS_FR = [
  {
    question: 'Comment calculer sa capacité d\'emprunt ?',
    answer: 'La capacité d\'emprunt dépend principalement de votre taux d\'endettement. La mensualité maximale autorisée est généralement de 33 % de vos revenus nets moins vos charges existantes.',
  },
  {
    question: 'Qu\'est-ce que le seuil HCSF de 35 % ?',
    answer: 'Le HCSF (Haut Conseil de Stabilité Financière) recommande aux banques de limiter les prêts aux emprunteurs dont le taux d\'endettement dépasse 35 %. Les banques peuvent déroger à cette règle pour 20 % des dossiers.',
  },
  {
    question: 'L\'apport personnel change-t-il la capacité d\'emprunt ?',
    answer: 'L\'apport personnel augmente votre budget total mais ne change pas directement votre capacité de remboursement mensuelle. En revanche, un apport d\'au moins 10 % est souvent exigé par les banques.',
  },
  {
    question: 'Les revenus locatifs comptent-ils dans la capacité d\'emprunt ?',
    answer: 'Oui, les banques prennent généralement en compte 70 % à 80 % des revenus locatifs.',
  },
  {
    question: 'Comment augmenter sa capacité d\'emprunt ?',
    answer: 'Plusieurs solutions : augmenter ses revenus, réduire ses charges existantes, augmenter son apport personnel, allonger la durée du prêt, ou faire appel à un co-emprunteur.',
  },
]

const FAQ_ITEMS_EN = [
  {
    question: 'How to calculate borrowing capacity?',
    answer: 'Borrowing capacity mainly depends on your debt ratio. The maximum allowed monthly payment is generally 33% of your net income minus existing expenses.',
  },
  {
    question: 'What is the HCSF 35% threshold?',
    answer: 'The HCSF (High Council for Financial Stability) recommends banks limit loans to borrowers whose debt ratio exceeds 35%. Banks can waive this rule for 20% of applications.',
  },
  {
    question: 'Does personal contribution change borrowing capacity?',
    answer: 'Personal contribution increases your total budget but doesn\'t directly change your monthly repayment capacity. However, at least 10% contribution is often required by banks.',
  },
  {
    question: 'Do rental incomes count towards borrowing capacity?',
    answer: 'Yes, banks generally take into account 70% to 80% of rental income.',
  },
  {
    question: 'How to increase borrowing capacity?',
    answer: 'Several options: increase income, reduce existing expenses, increase personal contribution, extend loan duration, or add a co-borrower.',
  },
]

export default async function CapaciteEmpruntPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'capaciteEmprunt' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const FAQ_ITEMS = locale === 'en' ? FAQ_ITEMS_EN : FAQ_ITEMS_FR

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: tCommon('home'), href: '/' },
          { label: t('breadcrumb'), href: '/capacite-emprunt' },
        ]}
      />

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{t('pageTitle')}</h1>
      <p className="text-lg text-gray-600 mb-6 leading-relaxed">{t('pageDesc')}</p>

      <AdUnit slot="before_tool_capacite" format="leaderboard" className="mb-8" />

      <CapaciteEmprunt />

      <AdUnit slot="after_tool_capacite" format="rectangle" className="my-8" />

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
        name="Calculateur de capacité d'emprunt immobilier"
        description="Calculez votre capacité d'emprunt immobilier selon vos revenus et charges."
        url="https://pretimmopro.fr/capacite-emprunt"
      />
    </div>
  )
}
