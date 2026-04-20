'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('languageSwitcher')

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden" aria-label={t('label')}>
      <Globe className="w-3.5 h-3.5 text-gray-400 ml-2" />
      <button
        onClick={() => switchLocale('fr')}
        className={`px-2.5 py-1.5 text-xs font-semibold transition-colors ${
          locale === 'fr'
            ? 'bg-primary-600 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
        aria-current={locale === 'fr' ? 'true' : undefined}
      >
        {t('fr')}
      </button>
      <button
        onClick={() => switchLocale('en')}
        className={`px-2.5 py-1.5 text-xs font-semibold transition-colors ${
          locale === 'en'
            ? 'bg-primary-600 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-50'
        }`}
        aria-current={locale === 'en' ? 'true' : undefined}
      >
        {t('en')}
      </button>
    </div>
  )
}
