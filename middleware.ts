import createMiddleware from 'next-intl/middleware'
import { locales } from './i18n/navigation'

export default createMiddleware({
  locales,
  defaultLocale: 'fr',
  localePrefix: 'as-needed',
})

export const config = {
  matcher: [
    // Exclut API, assets avec extension et routes metadata Next.js sans extension
    '/((?!api|_next|_vercel|apple-icon|icon|opengraph-image|twitter-image|.*\\..*).*)',
  ],
}
