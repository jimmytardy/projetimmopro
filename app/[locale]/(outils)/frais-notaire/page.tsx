import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import dynamic from 'next/dynamic'
import Breadcrumb from '@/components/seo/Breadcrumb'
import JsonLd from '@/components/seo/JsonLd'

const AdUnit = dynamic(() => import('@/components/ads/AdUnit'), { ssr: false })
const FraisNotaire = dynamic(() => import('@/components/simulators/FraisNotaire'), { ssr: false })

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'fraisNotaire' })
  return {
    title: t('pageTitle'),
    description: t('pageDesc'),
    alternates: { canonical: '/frais-notaire' },
  }
}

const FAQ_ITEMS_FR = [
  {
    question: 'Combien représentent les frais de notaire ?',
    answer: 'Pour un logement ancien, les frais de notaire représentent environ 7 à 8 % du prix d\'achat. Pour un logement neuf ou en VEFA, ils sont réduits à 2 à 3 %.',
  },
  {
    question: 'Peut-on négocier les frais de notaire ?',
    answer: 'Les droits de mutation (la majorité des frais) sont des taxes fixées par l\'État et les collectivités, donc non négociables. En revanche, les émoluments du notaire peuvent faire l\'objet d\'une remise jusqu\'à 20 % sur la partie dépassant 150 000 €.',
  },
  {
    question: 'Quand paye-t-on les frais de notaire ?',
    answer: 'Les frais de notaire se paient lors de la signature de l\'acte authentique de vente.',
  },
  {
    question: 'Les frais de notaire sont-ils déductibles des impôts ?',
    answer: 'Pour une résidence principale, non. Pour un investissement locatif, les frais de notaire peuvent être déduits des revenus fonciers.',
  },
  {
    question: 'Qu\'est-ce que la contribution de sécurité immobilière (CSI) ?',
    answer: 'La CSI est une taxe de 0,10 % du prix de vente perçue par l\'État.',
  },
]

const FAQ_ITEMS_EN = [
  {
    question: 'How much are notary fees in France?',
    answer: 'For an existing property, notary fees represent about 7-8% of the purchase price. For new or off-plan property, they are reduced to 2-3%.',
  },
  {
    question: 'Can notary fees be negotiated?',
    answer: 'Transfer taxes (the majority of fees) are government taxes and cannot be negotiated. However, the notary\'s emoluments can be discounted by up to 20% on the portion exceeding €150,000.',
  },
  {
    question: 'When are notary fees paid?',
    answer: 'Notary fees are paid at the signing of the final deed of sale.',
  },
  {
    question: 'Are notary fees tax-deductible?',
    answer: 'For a primary residence, no. For a rental investment, notary fees can be deducted from rental income.',
  },
  {
    question: 'What is the CSI (real estate security contribution)?',
    answer: 'The CSI is a tax of 0.10% of the sale price collected by the French government.',
  },
]

export default async function FraisNotairePage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'fraisNotaire' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const FAQ_ITEMS = locale === 'en' ? FAQ_ITEMS_EN : FAQ_ITEMS_FR

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: tCommon('home'), href: '/' },
          { label: t('breadcrumb'), href: '/frais-notaire' },
        ]}
      />

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{t('pageTitle')}</h1>
      <p className="text-lg text-gray-600 mb-6 leading-relaxed">{t('pageDesc')}</p>

      <AdUnit slot="before_tool_notaire" format="leaderboard" className="mb-8" />

      <FraisNotaire />

      <AdUnit slot="after_tool_notaire" format="rectangle" className="my-8" />

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
        name="Calculateur de frais de notaire 2026"
        description="Calculez vos frais de notaire pour un achat immobilier en France."
        url="https://pretimmopro.fr/frais-notaire"
      />
    </div>
  )
}
