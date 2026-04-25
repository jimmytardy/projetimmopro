import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { alternatesForLogicalPath } from '@/lib/seo-alternates'
import LegalLayout from '@/components/legal/LegalLayout'
import { mentionsSectionsFr, MentionsFrContent } from '@/components/legal/mentions/fr'
import { mentionsSectionsEn, MentionsEnContent } from '@/components/legal/mentions/en'

const LAST_UPDATED = '2026-04-20'

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'legalMentions' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: alternatesForLogicalPath('/mentions-legales', locale),
    robots: { index: true, follow: true },
  }
}

export default async function MentionsLegalesPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'legalMentions' })
  const sections = locale === 'en' ? mentionsSectionsEn : mentionsSectionsFr
  const Content = locale === 'en' ? MentionsEnContent : MentionsFrContent

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
