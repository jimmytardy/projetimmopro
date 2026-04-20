import Link from 'next/link'
import JsonLd from './JsonLd'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pretimmopro.fr'

  return (
    <>
      <JsonLd
        type="BreadcrumbList"
        items={items.map((item) => ({
          name: item.label,
          url: `${siteUrl}${item.href}`,
        }))}
      />
      <nav aria-label="Fil d'Ariane" className="mb-4">
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
