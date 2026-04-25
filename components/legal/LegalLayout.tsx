import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ChevronRight, Calendar, ArrowLeft } from 'lucide-react'

interface Section {
  id: string
  title: string
}

interface LegalLayoutProps {
  locale: string
  title: string
  lastUpdated: string
  sections: Section[]
  children: React.ReactNode
}

/**
 * Mise en page partagée pour les pages légales.
 * Fournit : breadcrumb, titre, date, sommaire ancré, et colonne de contenu.
 */
export default async function LegalLayout({
  locale,
  title,
  lastUpdated,
  sections,
  children,
}: LegalLayoutProps) {
  const t = await getTranslations({ locale, namespace: 'legalLayout' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const formattedDate = new Date(lastUpdated).toLocaleDateString(locale === 'en' ? 'en-GB' : 'fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <nav aria-label={t('ariaBreadcrumb')} className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-600 transition-colors">
          {tCommon('home')}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-gray-800 font-medium">{title}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10 items-start">

        <aside className="hidden lg:block">
          <div className="sticky top-6 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {t('toc')}
            </p>
            <nav aria-label={t('tocNav')}>
              <ul className="space-y-2">
                {sections.map(({ id, title: sTitle }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className="text-sm text-gray-600 hover:text-primary-600 transition-colors leading-snug block py-0.5"
                    >
                      {sTitle}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-5 pt-4 border-t border-gray-100">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {t('backHome')}
              </Link>
            </div>
          </div>
        </aside>

        <article>
          <header className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{title}</h1>
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {t('lastUpdated')} <time dateTime={lastUpdated}>{formattedDate}</time>
            </p>
          </header>

          <div className="prose max-w-none legal-prose">
            {children}
          </div>
        </article>
      </div>
    </div>
  )
}
