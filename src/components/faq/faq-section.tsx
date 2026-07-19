import { ChevronDown } from 'lucide-react'

export interface FaqItem {
  q: string
  a: string
}

/**
 * Renders a visible FAQ accordion AND its matching FAQPage JSON-LD from the
 * same data, so the structured data always reflects on-page content (Google
 * requires FAQ schema to match visible text). Native <details> — no client JS,
 * no hydration cost, Cache-Components-safe.
 */
export function FaqSection({
  faqs,
  heading = 'Frequently asked questions',
  className = '',
}: {
  faqs: FaqItem[]
  heading?: string
  className?: string
}) {
  if (!faqs || faqs.length === 0) return null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  return (
    <section className={`w-full ${className}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="font-fraunces text-2xl md:text-3xl font-medium text-primary mb-6">
        {heading}
      </h2>
      <div className="border-t border-border">
        {faqs.map(({ q, a }, i) => (
          <details key={i} className="group border-b border-border">
            <summary className="flex items-center justify-between gap-4 cursor-pointer list-none py-4 text-primary font-medium text-base md:text-lg">
              <span>{q}</span>
              <ChevronDown
                className="text-secondary shrink-0 transition-transform duration-200 group-open:rotate-180"
                size={20}
                aria-hidden="true"
              />
            </summary>
            <p className="text-secondary leading-relaxed pb-4 pr-8 max-w-prose">
              {a}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
