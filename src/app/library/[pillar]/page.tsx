// src/app/library/[pillar]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getArticlesByPillar } from '@/lib/mdx'
import { PILLARS, PILLAR_MAP } from '@/lib/pillars'

interface PageProps {
  params: Promise<{ pillar: string }>
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  intermediate: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

export function generateStaticParams() {
  return PILLARS.map((p) => ({ pillar: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pillar } = await params
  const meta = PILLAR_MAP[pillar]
  if (!meta) return { title: 'Seekvana' }
  return {
    title: `${meta.name} — Seekvana`,
    description: meta.description,
    alternates: { canonical: `https://seekvana.com/library/${pillar}` },
    openGraph: {
      title: `${meta.name} — Seekvana`,
      description: meta.description,
      url: `https://seekvana.com/library/${pillar}`,
    },
  }
}

export default async function PillarPage({ params }: PageProps) {
  const { pillar } = await params
  const pillarMeta = PILLAR_MAP[pillar]
  if (!pillarMeta) notFound()

  const articles = getArticlesByPillar(pillar)

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-2 text-sm text-secondary mb-8" aria-label="Breadcrumb">
        <Link href="/library" className="hover:text-accent transition-colors">
          Library
        </Link>
        <svg className="w-3 h-3 text-border" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1l4 4-4 4"/></svg>
        <span className="text-primary">{pillarMeta.name}</span>
      </nav>

      <header className="mb-10">
        <h1 className="font-fraunces text-4xl text-primary mb-3">{pillarMeta.name}</h1>
        <p className="text-lg text-secondary max-w-2xl">{pillarMeta.description}</p>
        <p className="text-sm text-secondary mt-3">
          {articles.length} article{articles.length !== 1 ? 's' : ''}
        </p>
      </header>

      <div className="space-y-3">
        {articles.map(({ frontmatter, slug }) => (
          <Link
            key={slug}
            href={`/library/${pillar}/${slug}`}
            className="flex items-start justify-between gap-4 bg-surface border border-border rounded-xl p-5 hover:border-accent/40 hover:shadow-sm transition-all group"
          >
            <div className="flex-1 min-w-0">
              <h2 className="font-fraunces text-lg text-primary group-hover:text-accent transition-colors mb-1">
                {frontmatter.title}
              </h2>
              <p className="text-sm text-secondary line-clamp-2">{frontmatter.description}</p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0 pt-0.5">
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${
                  DIFFICULTY_COLORS[frontmatter.difficulty] ?? DIFFICULTY_COLORS.beginner
                }`}
              >
                {frontmatter.difficulty}
              </span>
              <span className="text-xs text-secondary">{frontmatter.readTime} min</span>
            </div>
          </Link>
        ))}
        {articles.length === 0 && (
          <p className="text-secondary text-center py-16">No articles yet — check back soon.</p>
        )}
      </div>
    </div>
  )
}
