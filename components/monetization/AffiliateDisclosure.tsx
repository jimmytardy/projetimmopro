'use client'

import { useTranslations } from 'next-intl'

type Variant = 'footer' | 'article'

export default function AffiliateDisclosure({ variant = 'footer' }: { variant?: Variant }) {
  const t = useTranslations('monetization')
  const isFooter = variant === 'footer'
  return (
    <aside
      className={
        isFooter
          ? 'rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-center text-xs text-gray-600'
          : 'rounded-xl border border-amber-100 bg-amber-50/80 px-4 py-3 text-sm text-amber-950'
      }
      aria-label={t('affiliateAriaLabel')}
    >
      <p className={isFooter ? 'leading-relaxed' : 'leading-relaxed font-medium'}>
        {t('affiliateNotice')}
      </p>
    </aside>
  )
}
