import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { absoluteUrlFromPath, pathnameForLocale } from '@/lib/seo-alternates'
import JsonLd from './JsonLd'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default async function Breadcrumb({ items }: BreadcrumbProps) {
  const locale = await getLocale()
  const t = await getTranslations({ locale, namespace: 'breadcrumb' })

  return (
    <>
      <JsonLd
        type="BreadcrumbList"
        items={items.map((item) => ({
          name: item.label,
          url: absoluteUrlFromPath(pathnameForLocale(item.href, locale)),
        }))}
      />
      <nav aria-label={t('ariaLabel')} className="mb-4">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center gap-1">
              {index > 0 && (
                <span className="text-gray-300" aria-hidden="true">
                  /
                </span>
              )}
              {index === items.length - 1 ? (
                <span className="text-gray-700 font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-primary-600 hover:underline transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
