interface WebApplicationProps {
  type: 'WebApplication'
  name: string
  description?: string
  url?: string
}

interface ArticleProps {
  type: 'Article'
  headline: string
  description?: string
  datePublished: string
  dateModified: string
  url?: string
  authorName?: string
}

interface FAQItem {
  question: string
  answer: string
}

interface FAQPageProps {
  type: 'FAQPage'
  questions: FAQItem[]
}

interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbListProps {
  type: 'BreadcrumbList'
  items: BreadcrumbItem[]
}

type JsonLdProps =
  | WebApplicationProps
  | ArticleProps
  | FAQPageProps
  | BreadcrumbListProps

function buildSchema(props: JsonLdProps): Record<string, unknown> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pretimmopro.fr'

  switch (props.type) {
    case 'WebApplication':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: props.name,
        description: props.description,
        url: props.url ?? siteUrl,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'EUR',
        },
      }

    case 'Article':
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: props.headline,
        description: props.description,
        datePublished: props.datePublished,
        dateModified: props.dateModified,
        url: props.url,
        author: {
          '@type': 'Organization',
          name: props.authorName ?? 'PrêtImmoPro',
        },
        publisher: {
          '@type': 'Organization',
          name: 'PrêtImmoPro',
          url: siteUrl,
        },
      }

    case 'FAQPage':
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: props.questions.map((q) => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: q.answer,
          },
        })),
      }

    case 'BreadcrumbList':
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: props.items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }
  }
}

export default function JsonLd(props: JsonLdProps) {
  const schema = buildSchema(props)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
