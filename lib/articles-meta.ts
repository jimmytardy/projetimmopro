import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { ArticleCategory } from '@/lib/content-hubs'

export interface ArticleMeta {
  slug: string
  title: string
  description: string
  date: string
  lastModified: string
  readTime?: number
  category?: string
  keywords: string[]
  author?: string
}

const ARTICLES_DIR = path.join(process.cwd(), 'content', 'articles')

export function getAllArticlesMeta(): ArticleMeta[] {
  if (!fs.existsSync(ARTICLES_DIR)) return []

  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map((filename) => {
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, filename), 'utf8')
      const { data } = matter(raw)
      return {
        slug: filename.replace(/\.mdx?$/, ''),
        ...(data as Omit<ArticleMeta, 'slug'>),
      }
    })
    .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
}

export function getArticlesByCategory(category: ArticleCategory): ArticleMeta[] {
  return getAllArticlesMeta().filter((a) => a.category === category)
}
