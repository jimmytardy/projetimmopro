import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Breadcrumb from '@/components/seo/Breadcrumb'
import JsonLd from '@/components/seo/JsonLd'
import { Link } from '@/i18n/navigation'
import { ArrowRight, Clock, Calendar } from 'lucide-react'

const AdUnit = dynamic(() => import('@/components/ads/AdUnit'), { ssr: false })

interface ArticleFrontmatter {
  title: string
  description: string
  date: string
  lastModified: string
  keywords: string[]
}

function getArticleSlugs(): string[] {
  const articlesDir = path.join(process.cwd(), 'content', 'articles')
  if (!fs.existsSync(articlesDir)) return []
  return fs
    .readdirSync(articlesDir)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map((f) => f.replace(/\.mdx?$/, ''))
}

function getArticleData(slug: string): { frontmatter: ArticleFrontmatter; content: string } | null {
  const articlesDir = path.join(process.cwd(), 'content', 'articles')
  const mdxPath = path.join(articlesDir, `${slug}.mdx`)
  const mdPath = path.join(articlesDir, `${slug}.md`)
  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null
  if (!filePath) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  return { frontmatter: data as ArticleFrontmatter, content }
}

function mdToHtml(md: string): string {
  const lines = md.split('\n')
  const output: string[] = []
  let i = 0

  const inline = (s: string) =>
    s
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')

  while (i < lines.length) {
    const line = lines[i]
    if (/^### /.test(line)) { output.push(`<h3>${inline(line.slice(4))}</h3>`); i++; continue }
    if (/^## /.test(line)) { output.push(`<h2>${inline(line.slice(3))}</h2>`); i++; continue }
    if (/^# /.test(line)) { output.push(`<h1>${inline(line.slice(2))}</h1>`); i++; continue }
    if (/^---+$/.test(line.trim())) { output.push('<hr />'); i++; continue }
    if (/^>/.test(line)) {
      const bqLines: string[] = []
      while (i < lines.length && /^>/.test(lines[i])) { bqLines.push(inline(lines[i].replace(/^>\s?/, ''))); i++ }
      output.push(`<blockquote><p>${bqLines.join(' ')}</p></blockquote>`)
      continue
    }
    if (/^\|.+\|$/.test(line.trim())) {
      const tableLines: string[] = []
      while (i < lines.length && /^\|.+\|$/.test(lines[i].trim())) { tableLines.push(lines[i]); i++ }
      const [headerLine, , ...dataLines] = tableLines
      const headers = headerLine.split('|').slice(1, -1).map((c) => c.trim())
      const rows = dataLines.map((dl) => dl.split('|').slice(1, -1).map((c) => c.trim()))
      const thead = `<thead><tr>${headers.map((h) => `<th>${inline(h)}</th>`).join('')}</tr></thead>`
      const tbody = `<tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${inline(cell)}</td>`).join('')}</tr>`).join('')}</tbody>`
      output.push(`<div class="table-wrapper"><table>${thead}${tbody}</table></div>`)
      continue
    }
    if (/^[-*] /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-*] /.test(lines[i])) { items.push(`<li>${inline(lines[i].replace(/^[-*]\s/, ''))}</li>`); i++ }
      output.push(`<ul>${items.join('')}</ul>`)
      continue
    }
    if (/^\d+\. /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) { items.push(`<li>${inline(lines[i].replace(/^\d+\.\s/, ''))}</li>`); i++ }
      output.push(`<ol>${items.join('')}</ol>`)
      continue
    }
    if (line.trim() === '') { output.push(''); i++; continue }
    const paraLines: string[] = []
    while (i < lines.length && lines[i].trim() !== '' && !/^[#>|\-*\d]/.test(lines[i]) && !/^---/.test(lines[i].trim())) {
      paraLines.push(lines[i]); i++
    }
    if (paraLines.length) output.push(`<p>${inline(paraLines.join(' '))}</p>`)
  }
  return output.join('\n')
}

export async function generateStaticParams() {
  const slugs = getArticleSlugs()
  return ['fr', 'en'].flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({
  params: { slug },
}: {
  params: { slug: string; locale: string }
}): Promise<Metadata> {
  const data = getArticleData(slug)
  if (!data) return {}
  return {
    title: data.frontmatter.title,
    description: data.frontmatter.description,
    keywords: data.frontmatter.keywords,
    alternates: { canonical: `/articles/${slug}` },
    openGraph: {
      type: 'article',
      title: data.frontmatter.title,
      description: data.frontmatter.description,
      publishedTime: data.frontmatter.date,
      modifiedTime: data.frontmatter.lastModified,
    },
  }
}

const ARTICLES_SUGGERES_SLUGS = [
  'taux-endettement',
  'documents-dossier-pret',
  'ptz-2026',
] as const

type ArticleSlug = (typeof ARTICLES_SUGGERES_SLUGS)[number]

export default async function ArticlePage({
  params: { slug, locale },
}: {
  params: { slug: string; locale: string }
}) {
  const data = getArticleData(slug)
  if (!data) notFound()

  const t = await getTranslations({ locale, namespace: 'articles' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const ARTICLES_SUGGERES = ARTICLES_SUGGERES_SLUGS.map((s) => ({
    href: `/articles/${s}` as `/articles/${ArticleSlug}`,
    titre: t(`suggest_${s}` as `suggest_${ArticleSlug}`),
  }))
  const { frontmatter, content } = data
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pretimmopro.fr'

  const paragraphs = content.split('\n\n')
  let contentWithAd = ''
  if (paragraphs.length > 2) contentWithAd = paragraphs.slice(0, 2).join('\n\n')

  const htmlBefore = mdToHtml(contentWithAd || content)
  const htmlAfter = paragraphs.length > 2 ? mdToHtml(paragraphs.slice(2).join('\n\n')) : ''

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(locale === 'en' ? 'en-GB' : 'fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: tCommon('home'), href: '/' },
          { label: t('breadcrumb'), href: '/guides' },
          { label: frontmatter.title, href: `/articles/${slug}` },
        ]}
      />

      <JsonLd
        type="Article"
        headline={frontmatter.title}
        description={frontmatter.description}
        datePublished={frontmatter.date}
        dateModified={frontmatter.lastModified}
        url={`${siteUrl}/articles/${slug}`}
      />

      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {frontmatter.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {t('publishedOn')} {formatDate(frontmatter.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {t('updatedOn')} {formatDate(frontmatter.lastModified)}
          </span>
        </div>
      </header>

      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: htmlBefore }} />

      <AdUnit slot="article_top" format="leaderboard" className="my-8" />

      {htmlAfter && (
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: htmlAfter }} />
      )}

      <AdUnit slot="article_bottom" format="rectangle" className="my-8" />

      <aside className="mt-10 bg-gray-50 rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('alsoRead')}</h2>
        <ul className="space-y-3">
          {ARTICLES_SUGGERES.filter((a) => a.href !== `/articles/${slug}`).map(({ href, titre }) => (
            <li key={href}>
              <Link
                href={href as `/articles/${string}`}
                className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                {titre}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}
