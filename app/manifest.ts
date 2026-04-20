import type { MetadataRoute } from 'next'

/**
 * Web App Manifest — permet l'installation en PWA sur mobile.
 * Servi automatiquement à /manifest.webmanifest par Next.js.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             'PrêtImmoPro — Simulateur immobilier',
    short_name:       'PrêtImmoPro',
    description:      'Simulez votre prêt immobilier gratuitement : mensualités, capacité d\'emprunt, frais de notaire.',
    start_url:        '/',
    display:          'standalone',
    background_color: '#F8FAFC',
    theme_color:      '#1e3a8a',
    orientation:      'portrait-primary',
    categories:       ['finance', 'utilities'],
    lang:             'fr',
    icons: [
      {
        src:     '/icon.svg',
        sizes:   'any',
        type:    'image/svg+xml',
        purpose: 'any',
      },
      {
        src:     '/apple-icon',
        sizes:   '180x180',
        type:    'image/png',
        purpose: 'any maskable',
      },
    ],
  }
}
