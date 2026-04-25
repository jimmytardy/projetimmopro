import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { alternatesForLogicalPath } from '@/lib/seo-alternates'
import LegalLayout from '@/components/legal/LegalLayout'
import { cguSectionsFr, CguFrContent } from '@/components/legal/cgu/fr'
import { cguSectionsEn, CguEnContent } from '@/components/legal/cgu/en'

const LAST_UPDATED = '2026-04-20'

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'legalCgu' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: alternatesForLogicalPath('/cgu', locale),
    robots: { index: true, follow: true },
  }
}

export default async function CguPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'legalCgu' })
  const sections = locale === 'en' ? cguSectionsEn : cguSectionsFr
  const Content = locale === 'en' ? CguEnContent : CguFrContent

  return (
    <LegalLayout
      locale={locale}
      title={t('pageTitle')}
      lastUpdated={LAST_UPDATED}
      sections={sections}
    >
      <Content />
    </LegalLayout>
  )
}
