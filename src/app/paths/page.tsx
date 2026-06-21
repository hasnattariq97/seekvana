import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllPaths } from '@/lib/mdx'

export const metadata: Metadata = {
  title: 'Learning Paths — Seekvana',
  description: 'Structured learning journeys from AI beginner to advanced builder. Pick a path and start today.',
  alternates: { canonical: 'https://seekvana.com/paths' },
  openGraph: {
    title: 'Learning Paths — Seekvana',
    description: 'Structured learning journeys from AI beginner to advanced builder.',
    url: 'https://seekvana.com/paths',
  },
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  intermediate: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
}

export default function PathsPage() {
  const paths = getAllPaths()

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">
      <header className="mb-10">
        <nav className="flex items-center gap-2 text-sm text-secondary mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <svg className="w-3 h-3 text-border" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1l4 4-4 4"/></svg>
          <span className="text-primary">Learning Paths</span>
        </nav>
        <h1 className="font-fraunces text-4xl text-primary mb-3">Learning Paths</h1>
        <p className="text-lg text-secondary max-w-2xl">
          Structured journeys that take you from zero to confident. Each path is a curated sequence of topics with clear milestones.
        </p>
      </header>

      {paths.length === 0 ? (
        <p className="text-secondary text-center py-16">No paths available yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paths.map((path) => (
            <Link
              key={path.slug}
              href={`/paths/${path.slug}`}
              className="bg-surface border border-border rounded-xl p-6 hover:border-accent/40 hover:shadow-sm transition-all group flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-fraunces text-xl text-primary group-hover:text-accent transition-colors leading-snug">
                  {path.title}
                </h2>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize shrink-0 mt-0.5 ${
                    DIFFICULTY_COLORS[path.difficulty] ?? DIFFICULTY_COLORS.beginner
                  }`}
                >
                  {path.difficulty}
                </span>
              </div>
              <p className="text-sm text-secondary leading-relaxed">{path.description}</p>
              <div className="flex items-center justify-between mt-auto pt-2">
                <span className="text-xs text-secondary">{path.lessonCount} topics</span>
                <span className="text-accent text-sm font-medium">Start path →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
