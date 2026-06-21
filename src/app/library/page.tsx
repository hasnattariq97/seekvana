import Link from 'next/link'
import type { Metadata } from 'next'
import { PILLARS } from '@/lib/pillars'
import { getAllArticles } from '@/lib/mdx'

export const metadata: Metadata = {
  title: 'Library — Seekvana',
  description: 'Every AI topic in one place — from foundations to agentic systems. Browse all 9 content pillars.',
  alternates: { canonical: 'https://seekvana.com/library' },
  openGraph: {
    title: 'Library — Seekvana',
    description: 'Every AI topic in one place — from foundations to agentic systems.',
    url: 'https://seekvana.com/library',
  },
}

export default function LibraryPage() {
  const allArticles = getAllArticles()
  const countByPillar = Object.fromEntries(
    PILLARS.map((p) => [p.slug, allArticles.filter((a) => a.pillar === p.slug).length])
  )

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">
      <header className="mb-10">
        <nav className="flex items-center gap-2 text-sm text-secondary mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <svg className="w-3 h-3 text-border" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1l4 4-4 4"/></svg>
          <span className="text-primary">Library</span>
        </nav>
        <h1 className="font-fraunces text-4xl text-primary mb-3">The Library</h1>
        <p className="text-lg text-secondary max-w-2xl">
          Every AI topic — clearly explained. Browse by subject area or search for what you need.
        </p>
        <p className="text-sm text-secondary mt-2">
          {allArticles.length} article{allArticles.length !== 1 ? 's' : ''} across {PILLARS.length} topics
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PILLARS.map((pillar) => {
          const count = countByPillar[pillar.slug] ?? 0
          return (
            <Link
              key={pillar.slug}
              href={`/library/${pillar.slug}`}
              className="bg-surface border border-border rounded-xl p-6 hover:border-accent/40 hover:shadow-sm transition-all group"
            >
              <h2 className="font-fraunces text-lg text-primary group-hover:text-accent transition-colors mb-2">
                {pillar.name}
              </h2>
              <p className="text-sm text-secondary line-clamp-2 mb-4">{pillar.description}</p>
              <span className="text-xs text-secondary">
                {count > 0 ? `${count} article${count !== 1 ? 's' : ''}` : 'Coming soon'}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
