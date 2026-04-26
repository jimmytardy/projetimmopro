import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { alternatesForLogicalPath } from '@/lib/seo-alternates'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { ArrowRight, BookOpen, Clock, Tag } from 'lucide-react'
import Breadcrumb from '@/components/seo/Breadcrumb'
import {
  CONTENT_HUB_SLUGS,
  HUB_TO_CATEGORY,
  HUB_TOOL_LABEL_KEYS,
  TOOL_KEY_TO_HREF,
  isContentHubSlug,
  type ContentHubSlug,
} from '@/lib/content-hubs'
import { getArticlesByCategory } from '@/lib/articles-meta'
import AdUnit from '@/components/ads/AdUnit'

type CategoryKey = 'Financement' | 'Dossier' | 'Aides' | 'Marché'

const CATEGORY_COLORS: Record<CategoryKey, string> = {
  Financement: 'bg-blue-100 text-blue-700',
  Dossier: 'bg-green-100 text-green-700',
  Aides: 'bg-purple-100 text-purple-700',
  Marché: 'bg-orange-100 text-orange-700',
}

const CATEGORY_I18N_KEYS: Record<CategoryKey, `category_${CategoryKey}`> = {
  Financement: 'category_Financement',
  Dossier: 'category_Dossier',
  Aides: 'category_Aides',
  Marché: 'category_Marché',
}

function hubMetaTitleKey(hub: ContentHubSlug): `${ContentHubSlug}_metaTitle` {
  return `${hub}_metaTitle`
}

function hubMetaDescKey(hub: ContentHubSlug): `${ContentHubSlug}_metaDescription` {
  return `${hub}_metaDescription`
}

function hubIntroKey(hub: ContentHubSlug): `${ContentHubSlug}_intro` {
  return `${hub}_intro`
}

export function generateStaticParams() {
  return ['fr', 'en'].flatMap((locale) =>
    CONTENT_HUB_SLUGS.map((hub) => ({ locale, hub }))
  )
}

export async function generateMetadata({
  params: { locale, hub },
}: {
  params: { locale: string; hub: string }
}): Promise<Metadata> {
  if (!isContentHubSlug(hub)) return {}
  const t = await getTranslations({ locale, namespace: 'guidesHub' })
  return {
    title: t(hubMetaTitleKey(hub)),
    description: t(hubMetaDescKey(hub)),
    alternates: alternatesForLogicalPath(`/guides/${hub}`, locale),
  }
}

export default async function GuidesHubPage({
  params: { locale, hub },
}: {
  params: { locale: string; hub: string }
}) {
  if (!isContentHubSlug(hub)) notFound()

  setRequestLocale(locale)
  const tHub = await getTranslations({ locale, namespace: 'guidesHub' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const tArticles = await getTranslations({ locale, namespace: 'articles' })
  const tTools = await getTranslations({ locale, namespace: 'tools' })
  const tGuides = await getTranslations({ locale, namespace: 'guides' })

  const category = HUB_TO_CATEGORY[hub]
  const articles = getArticlesByCategory(category)
  const logicalPath = `/guides/${hub}`

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(locale === 'en' ? 'en-GB' : 'fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

  const toolKeys = HUB_TOOL_LABEL_KEYS[hub]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: tCommon('home'), href: '/' },
          { label: tGuides('breadcrumb'), href: '/guides' },
          { label: tHub(hubMetaTitleKey(hub)), href: logicalPath },
        ]}
      />

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-600" />
          </div>
          <span className="text-sm font-medium text-primary-600 uppercase tracking-wide">
            {tGuides('freeResources')}
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          {tHub(hubMetaTitleKey(hub))}
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">{tHub(hubIntroKey(hub))}</p>
      </header>

      <AdUnit slot={`hub_${hub}_top`} format="leaderboard" className="mb-8 w-full" />

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{tHub('toolsTitle')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {toolKeys.map((key) => (
            <Link
              key={key}
              href={TOOL_KEY_TO_HREF[key]}
              className="inline-flex items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-primary-700 hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              {tTools(key)}
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
            </Link>
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-500">
          <Link href="/guides" className="text-primary-600 hover:underline font-medium">
            {tGuides('breadcrumb')}
          </Link>
          {' · '}
          <Link href="/" className="text-primary-600 hover:underline font-medium">
            {tCommon('home')}
          </Link>
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">{tHub('articlesTitle')}</h2>
        {articles.length === 0 ? (
          <p className="text-gray-500">{tGuides('noGuides')}</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map(({ slug, title, description, date, lastModified, readTime, category: cat }) => {
              const categoryKey = cat as CategoryKey | undefined
              const colorClass = categoryKey
                ? (CATEGORY_COLORS[categoryKey] ?? 'bg-gray-100 text-gray-600')
                : 'bg-gray-100 text-gray-600'
              const categoryLabel = categoryKey ? tArticles(CATEGORY_I18N_KEYS[categoryKey]) : null
              return (
                <li key={slug}>
                  <Link
                    href={`/articles/${slug}` as `/articles/${string}`}
                    className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-primary-200 hover:shadow-md transition-all"
                  >
                    {categoryLabel && (
                      <span
                        className={`mb-2 inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${colorClass}`}
                      >
                        <Tag className="h-3 w-3" />
                        {categoryLabel}
                      </span>
                    )}
                    <span className="font-bold text-gray-900 group-hover:text-primary-600 mb-2">{title}</span>
                    <span className="text-sm text-gray-500 line-clamp-3 mb-4">{description}</span>
                    <span className="mt-auto flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {tGuides('updatedOn')} {formatDate(lastModified ?? date)}
                        {readTime ? ` · ${readTime} ${tGuides('readTime')}` : null}
                      </span>
                      <ArrowRight className="h-4 w-4 text-primary-500 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
