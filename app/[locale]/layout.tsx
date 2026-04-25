import type { Metadata, Viewport } from 'next'
import dynamic from 'next/dynamic'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MatomoTracker from '@/components/analytics/MatomoTracker'
import { locales } from '@/i18n/navigation'

const SidebarAd = dynamic(
  () => import('@/components/ads/SidebarAd'),
  { ssr: false }
)

const LAYOUT_KEYWORDS_FR = [
  'simulateur prêt immobilier',
  'calculette crédit immobilier',
  'capacité emprunt',
  'frais notaire',
  'taux immobilier 2026',
]

const LAYOUT_KEYWORDS_EN = [
  'mortgage simulator France',
  'French mortgage calculator',
  'borrowing capacity',
  'notary fees',
  'mortgage rates 2026',
]

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'home' })
  const isEn = locale === 'en'
  const ogLocale = isEn ? 'en_GB' : 'fr_FR'
  const titleDefault = t('metaTitle')
  const description = t('metaDescription')

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pretimmopro.fr'
    ),
    title: {
      default: titleDefault,
      template: '%s | PrêtImmoPro',
    },
    description,
    keywords: isEn ? LAYOUT_KEYWORDS_EN : LAYOUT_KEYWORDS_FR,
    authors: [{ name: 'PrêtImmoPro' }],
    creator: 'PrêtImmoPro',

    openGraph: {
      type: 'website',
      locale: ogLocale,
      siteName: 'PrêtImmoPro',
      title: titleDefault,
      description,
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'PrêtImmoPro' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: titleDefault,
      description,
      images: ['/opengraph-image'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1e3a8a' },
    { media: '(prefers-color-scheme: dark)',  color: '#1e3a8a' },
  ],
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!locales.includes(locale as 'fr' | 'en')) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      {/* Suivi Matomo — chargé côté client, aucun rendu DOM */}
      <MatomoTracker />
      <Header />
      {/*
        Mise en page 3 colonnes : [sidebar gauche] [contenu] [sidebar droite]
        Les colonnes latérales n'apparaissent qu'à partir de 1600px (min-[1600px]).
      */}
      <div className="flex-1 flex min-w-0">
        {/* Colonne gauche — s'étire sur toute la hauteur du contenu (align-self: stretch par défaut) */}
        <div className="hidden min-[1600px]:block w-40 flex-shrink-0 pl-3">
          {/* sticky : se centre dans la zone visible sous le header (64 px) sans jamais le chevaucher */}
          <div className="sticky top-[max(84px,calc(50vh-268px))] flex justify-center">
            <SidebarAd side="left" slot="sidebar_left" />
          </div>
        </div>
        <main className="flex-1 min-w-0">{children}</main>
        <div className="hidden min-[1600px]:block w-40 flex-shrink-0 pr-3">
          <div className="sticky top-[max(84px,calc(50vh-268px))] flex justify-center">
            <SidebarAd side="right" slot="sidebar_right" />
          </div>
        </div>
      </div>
      <Footer />
    </NextIntlClientProvider>
  )
}
