import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { alternatesForLogicalPath } from '@/lib/seo-alternates'
import LegalLayout from '@/components/legal/LegalLayout'
import { privacySectionsFr, PrivacyFrContent } from '@/components/legal/privacy/fr'
import { privacySectionsEn, PrivacyEnContent } from '@/components/legal/privacy/en'

const LAST_UPDATED = '2026-04-20'

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'legalPrivacy' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: alternatesForLogicalPath('/politique-confidentialite', locale),
    robots: { index: true, follow: true },
  }
}

export default async function PolitiqueConfidentialitePage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'legalPrivacy' })
  const sections = locale === 'en' ? privacySectionsEn : privacySectionsFr
  const Content = locale === 'en' ? PrivacyEnContent : PrivacyFrContent

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
