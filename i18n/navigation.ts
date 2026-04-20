import { createNavigation } from 'next-intl/navigation'

export const locales = ['fr', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale = 'fr' as const

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
})
