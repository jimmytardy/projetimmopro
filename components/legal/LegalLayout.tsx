import Link from 'next/link'
import { ChevronRight, Calendar, ArrowLeft } from 'lucide-react'

interface Section {
  id: string
  title: string
}

interface LegalLayoutProps {
  title: string
  lastUpdated: string
  sections: Section[]
  children: React.ReactNode
}

/**
 * Mise en page partagée pour les pages légales.
 * Fournit : breadcrumb, titre, date, sommaire ancré, et colonne de contenu.
 */
export default function LegalLayout({ title, lastUpdated, sections, children }: LegalLayoutProps) {
  const formattedDate = new Date(lastUpdated).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Breadcrumb */}
      <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-600 transition-colors">Accueil</Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-gray-800 font-medium">{title}</span>
      </nav>

      <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10 items-start">

        {/* Sommaire — sticky sur desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-6 bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Sommaire
            </p>
            <nav aria-label="Sommaire de la page">
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
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </aside>

        {/* Contenu */}
        <article>
          {/* En-tête */}
          <header className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{title}</h1>
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              Dernière mise à jour : <time dateTime={lastUpdated}>{formattedDate}</time>
            </p>
          </header>

          {/* Corps — styles prose définis dans globals.css */}
          <div className="prose max-w-none legal-prose">
            {children}
          </div>
        </article>
      </div>
    </div>
  )
}
