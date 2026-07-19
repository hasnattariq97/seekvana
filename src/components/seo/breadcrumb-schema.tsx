export interface Crumb {
  name: string
  /** Absolute URL for this crumb. */
  url: string
}

/**
 * Emits BreadcrumbList JSON-LD that mirrors a page's visible breadcrumb trail
 * (Google expects the schema to match on-page navigation). Drop it into any
 * page that renders a breadcrumb, passing the same trail shown on screen.
 */
export function BreadcrumbSchema({ items }: { items: Crumb[] }) {
  if (!items || items.length === 0) return null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export const BASE_URL = 'https://seekvana.com'
