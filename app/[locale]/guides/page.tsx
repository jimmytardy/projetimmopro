import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { alternatesForLogicalPath } from '@/lib/seo-alternates'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Clock, BookOpen, Tag, Layers } from 'lucide-react'
import { CONTENT_HUB_SLUGS, type ContentHubSlug } from '@/lib/content-hubs'
import { getAllArticlesMeta } from '@/lib/articles-meta'
import Breadcrumb from '@/components/seo/Breadcrumb'
import JsonLd from '@/components/seo/JsonLd'
import AdUnit from '@/components/ads/AdUnit'

type CategoryKey = 'Financement' | 'Dossier' | 'Aides' | 'Marché'

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'guides' })
  return {
    title: t('pageTitle'),
    description: t('metaDescription'),
    alternates: alternatesForLogicalPath('/guides', locale),
  }
}

const CATEGORY_COLORS: Record<CategoryKey, string> = {
  Financement: 'bg-blue-100 text-blue-700',
  Dossier: 'bg-green-100 text-green-700',
  Aides: 'bg-purple-100 text-purple-700',
  Marché: 'bg-orange-100 text-orange-700',
}

const HUB_CARD_TITLE: Record<ContentHubSlug, 'card_financement_title' | 'card_dossier_title' | 'card_aides_title' | 'card_marche_title'> = {
  financement: 'card_financement_title',
  dossier: 'card_dossier_title',
  aides: 'card_aides_title',
  marche: 'card_marche_title',
}

const HUB_CARD_DESC: Record<ContentHubSlug, 'card_financement_desc' | 'card_dossier_desc' | 'card_aides_desc' | 'card_marche_desc'> = {
  financement: 'card_financement_desc',
  dossier: 'card_dossier_desc',
  aides: 'card_aides_desc',
  marche: 'card_marche_desc',
}

export default async function GuidesPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'guides' })
  const tHub = await getTranslations({ locale, namespace: 'guidesHub' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const tArticles = await getTranslations({ locale, namespace: 'articles' })
  const tTools = await getTranslations({ locale, namespace: 'tools' })
  const articles = getAllArticlesMeta()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pretimmopro.fr'

  const OUTILS_LIES = [
    { href: '/capacite-emprunt', label: tTools('borrowingCapacityName') },
    { href: '/simulateur-pret', label: tTools('loanSimulatorName') },
    { href: '/frais-notaire', label: tTools('notaryFeesName') },
    { href: '/remboursement-anticipe', label: tTools('earlyRepaymentName') },
  ]

  const CATEGORY_I18N_KEYS: Record<CategoryKey, `category_${CategoryKey}`> = {
    Financement: 'category_Financement',
    Dossier: 'category_Dossier',
    Aides: 'category_Aides',
    Marché: 'category_Marché',
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(locale === 'en' ? 'en-GB' : 'fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: tCommon('home'), href: '/' },
          { label: t('breadcrumb'), href: '/guides' },
        ]}
      />

      <JsonLd
        type="BreadcrumbList"
        items={[
          { name: tCommon('home'), url: siteUrl },
          { name: t('breadcrumb'), url: `${siteUrl}/guides` },
        ]}
      />

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-600" />
          </div>
          <span className="text-sm font-medium text-primary-600 uppercase tracking-wide">
            {t('freeResources')}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{t('pageTitle')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl">{t('subtitle')}</p>
      </header>

      <section className="mb-10 rounded-2xl border border-primary-100 bg-primary-50/60 p-6 sm:p-8" aria-labelledby="thematiques-heading">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-primary-600" aria-hidden />
          <h2 id="thematiques-heading" className="text-lg font-bold text-gray-900">
            {tHub('thematiquesTitle')}
          </h2>
        </div>
        <p className="text-sm text-gray-600 mb-6 max-w-3xl">{tHub('thematiquesSubtitle')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CONTENT_HUB_SLUGS.map((hub) => (
            <Link
              key={hub}
              href={`/guides/${hub}` as `/guides/${ContentHubSlug}`}
              className="group rounded-xl border border-white bg-white p-5 shadow-sm hover:border-primary-200 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-primary-700 mb-2">
                {tHub(HUB_CARD_TITLE[hub])}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">{tHub(HUB_CARD_DESC[hub])}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-600">
                {tHub('ctaHub')}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Bannière pub après le header */}
      <AdUnit slot="guides_banner_top" format="leaderboard" className="mb-8 w-full" />

      {articles.length === 0 ? (
        <p className="text-gray-500 text-center py-16">{t('noGuides')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {articles.flatMap(({ slug, title, description, date, lastModified, readTime, category, keywords }, index) => {
            const categoryKey = category as CategoryKey | undefined
            const colorClass = categoryKey ? (CATEGORY_COLORS[categoryKey] ?? 'bg-gray-100 text-gray-600') : 'bg-gray-100 text-gray-600'
            const categoryLabel = categoryKey ? tArticles(CATEGORY_I18N_KEYS[categoryKey]) : null

            const card = (
              <Link
                key={slug}
                href={`/articles/${slug}` as `/articles/${string}`}
                className="group bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-primary-200 transition-all flex flex-col"
              >
                <div className="px-5 pt-5 pb-3">
                  {categoryLabel && (
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 ${colorClass}`}>
                      <Tag className="w-3 h-3" />
                      {categoryLabel}
                    </span>
                  )}
                  <h2 className="font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-primary-600 transition-colors">
                    {title}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{description}</p>
                </div>
                {keywords?.length > 0 && (
                  <div className="px-5 pb-3 flex flex-wrap gap-1.5">
                    {keywords.slice(0, 3).map((kw) => (
                      <span key={kw} className="text-[11px] bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-auto px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{t('updatedOn')} {formatDate(lastModified ?? date)}</span>
                    {readTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {readTime} {t('readTime')}
                      </span>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            )

            // Pub pleine largeur après chaque 6 cartes (2 rangées × 3 colonnes)
            if ((index + 1) % 6 === 0 && index < articles.length - 1) {
              return [
                card,
                <div key={`ad-grid-${index}`} className="col-span-1 md:col-span-2 lg:col-span-3">
                  <AdUnit slot={`guides_inline_${Math.floor(index / 6) + 1}`} format="rectangle" className="w-full" />
                </div>,
              ]
            }

            return [card]
          })}
        </div>
      )}

      {/* Bannière pub entre la grille et le CTA */}
      {articles.length > 0 && (
        <AdUnit slot="guides_banner_bottom" format="leaderboard" className="mb-10 w-full" />
      )}

      <section className="bg-primary-50 border border-primary-100 rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-1">{t('ctaTitle')}</h2>
        <p className="text-sm text-gray-600 mb-5">{t('ctaDesc')}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {OUTILS_LIES.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center justify-between gap-1.5 text-sm font-medium bg-white border border-primary-200 text-primary-700 hover:bg-primary-600 hover:text-white hover:border-primary-600 px-4 py-2.5 rounded-lg transition-colors"
            >
              {label}
              <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
