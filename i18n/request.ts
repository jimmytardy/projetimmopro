import { getRequestConfig } from 'next-intl/server'
import { locales, defaultLocale } from './navigation'

export default getRequestConfig(async ({ requestLocale }) => {
  // Nouvelle API next-intl ≥ 3.22 : requestLocale est une Promise passée en paramètre
  let locale = await requestLocale

  // Fallback si la locale est absente ou non supportée
  if (!locale || !locales.includes(locale as 'fr' | 'en')) {
    locale = defaultLocale
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
