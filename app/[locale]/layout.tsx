import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MatomoTracker from '@/components/analytics/MatomoTracker'
import { locales } from '@/i18n/navigation'

const SidebarAd = dynamic(
  () => import('@/components/ads/SidebarAd'),
  { ssr: false }
)

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pretimmopro.fr'),
  title: {
    default: 'PrêtImmoPro — Simulateur de crédit immobilier gratuit',
    template: '%s | PrêtImmoPro',
  },
  description:
    'Simulez votre prêt immobilier gratuitement : mensualités, capacité d\'emprunt, frais de notaire et taux immobiliers par ville. Outils 100% gratuits, sans inscription.',
  keywords: [
    'simulateur prêt immobilier',
    'calculette crédit immobilier',
    'capacité emprunt',
    'frais notaire',
    'taux immobilier 2026',
  ],
  authors: [{ name: 'PrêtImmoPro' }],
  creator: 'PrêtImmoPro',

  icons: {
    icon:      [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut:  '/icon.svg',
    apple:     '/apple-icon',
    other: [
      { rel: 'mask-icon', url: '/icon.svg', color: '#1e3a8a' },
    ],
  },

  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1e3a8a' },
    { media: '(prefers-color-scheme: dark)',  color: '#1e3a8a' },
  ],

  openGraph: {
    type:        'website',
    locale:      'fr_FR',
    siteName:    'PrêtImmoPro',
    title:       'PrêtImmoPro — Simulateur de crédit immobilier gratuit',
    description: 'Simulez votre prêt immobilier gratuitement en 30 secondes.',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'PrêtImmoPro' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'PrêtImmoPro — Simulateur de crédit immobilier gratuit',
    description: 'Simulez votre prêt immobilier gratuitement en 30 secondes.',
    images:      ['/opengraph-image'],
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:  true,
      follow: true,
    },
  },
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
        <div className="hidden min-[1600px]:flex w-40 flex-shrink-0 items-center justify-center py-8 pl-3">
          <SidebarAd side="left" slot="sidebar_left" />
        </div>
        <main className="flex-1 min-w-0">{children}</main>
        <div className="hidden min-[1600px]:flex w-40 flex-shrink-0 items-center justify-center py-8 pr-3">
          <SidebarAd side="right" slot="sidebar_right" />
        </div>
      </div>
      <Footer />
    </NextIntlClientProvider>
  )
}
