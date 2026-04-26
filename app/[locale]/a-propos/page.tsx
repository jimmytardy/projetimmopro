import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { alternatesForLogicalPath } from '@/lib/seo-alternates'
import Breadcrumb from '@/components/seo/Breadcrumb'

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'about' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: alternatesForLogicalPath('/a-propos', locale),
  }
}

export default async function AboutPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'about' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: tCommon('home'), href: '/' },
          { label: t('breadcrumb'), href: '/a-propos' },
        ]}
      />

      <article>
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{t('pageTitle')}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{t('lead')}</p>
        </header>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900">{t('missionTitle')}</h2>
            <p className="text-gray-600 leading-relaxed mt-2">{t('missionP1')}</p>
            <p className="text-gray-600 leading-relaxed mt-3">{t('missionP2')}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">{t('editorialTitle')}</h2>
            <p className="text-gray-600 leading-relaxed mt-2">{t('editorialP1')}</p>
            <p className="text-gray-600 leading-relaxed mt-3">{t('editorialP2')}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">{t('sourcesTitle')}</h2>
            <p className="text-gray-600 leading-relaxed mt-2">{t('sourcesP1')}</p>
            <p className="text-gray-600 leading-relaxed mt-3">{t('sourcesP2')}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">{t('independenceTitle')}</h2>
            <p className="text-gray-600 leading-relaxed mt-2">{t('independenceP1')}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900">{t('contactTitle')}</h2>
            <p className="text-gray-600 leading-relaxed mt-2">
              <a href="mailto:contact@pretimmopro.fr" className="text-primary-600 hover:underline">
                contact@pretimmopro.fr
              </a>
              {' — '}
              {t('contactBody')}
            </p>
          </section>
        </div>
      </article>
    </div>
  )
}
