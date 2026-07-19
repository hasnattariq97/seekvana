import { FaqAccordion } from './faq-accordion'

export interface FaqItem {
  q: string
  a: string
}

/**
 * Server wrapper: emits the FAQPage JSON-LD and the section heading in the
 * initial HTML, then renders the animated client accordion. Structured data
 * mirrors the on-page answers (Google requires the match); answers stay in the
 * DOM inside the accordion, height-collapsed rather than unmounted.
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
      <h2 className="mb-6 text-balance font-fraunces text-2xl font-medium text-primary md:mb-8 md:text-3xl">
        {heading}
      </h2>
      <FaqAccordion faqs={faqs} />
    </section>
  )
}
