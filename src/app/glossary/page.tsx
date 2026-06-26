import Link from 'next/link'
import { getAllGlossaryTerms } from '@/lib/mdx'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Glossary — Seekvana',
  description: 'Clear definitions of AI terms — from LLMs to agents, embeddings to fine-tuning.',
  alternates: { canonical: 'https://seekvana.com/glossary' },
}

export default async function GlossaryPage() {
  const terms = await getAllGlossaryTerms()

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-secondary mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <span>/</span>
        <span className="text-primary">Glossary</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="font-fraunces text-4xl text-primary">AI Glossary</h1>
        <p className="text-lg text-secondary mt-2 max-w-2xl">
          Clear definitions of essential AI terms — updated as the field evolves.
        </p>
        <span className="bg-accent-soft text-accent text-sm rounded-full px-3 py-1 mt-4 inline-block">
          {terms.length} terms
        </span>
      </div>

      {/* Term grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
        {terms.map(({ frontmatter, slug }) => (
          <Link
            key={slug}
            href={`/glossary/${slug}`}
            className="bg-surface rounded-xl border border-border p-5 hover:-translate-y-1 hover:shadow-md hover:border-accent/40 transition-all group block focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            <p className="font-fraunces text-lg text-primary group-hover:text-accent transition-colors">
              {frontmatter.term}
            </p>
            <p className="text-sm text-secondary mt-1 leading-relaxed line-clamp-2">
              {frontmatter.shortDef}
            </p>
            <span className="text-xs text-accent font-medium mt-3 block">
              Read definition →
            </span>
          </Link>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 text-center border-t border-border pt-10">
        <p className="text-secondary text-sm">Missing a term?</p>
        <p className="text-xs text-secondary mt-1">
          The glossary grows with the library. New terms added regularly.
        </p>
      </div>
    </main>
  )
}
