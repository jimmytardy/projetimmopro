import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { headers } from 'next/headers'
import './globals.css'

// Défini ici (layout racine) pour que TOUTES les pages — y compris les routes
// générées statiquement (opengraph-image, apple-icon, etc.) — résolvent
// correctement les URLs absolues des images Open Graph et Twitter.
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pretimmopro.fr'
  ),
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

/**
 * Root layout — fournit l'enveloppe HTML complète.
 * Le locale est lu depuis l'en-tête positionné par le middleware next-intl,
 * ce qui permet d'avoir lang="fr" ou lang="en" sans conflit de balises imbriquées.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  const locale = headers().get('x-next-intl-locale') ?? 'fr'

  return (
    <html lang={locale} className={inter.variable}>
      <head>
        {process.env.NODE_ENV === 'production' && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? 'ca-pub-XXXXXXXXXXXXXXXX'}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        )}
      </head>
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col`}>
        {children}
      </body>
    </html>
  )
}
