import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getArticlesByPillar } from '@/lib/mdx'
import { PILLARS, PILLAR_MAP } from '@/lib/pillars'

interface PageProps {
  params: Promise<{ pillar: string }>
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300',
  intermediate: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300',
}

function pillarLabel(slug: string): string {
  return PILLAR_MAP[slug]?.name ?? slug
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
    <div className="max-w-screen-xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-secondary mb-8" aria-label="Breadcrumb">
        <Link href="/library" className="hover:text-accent transition-colors">Library</Link>
        <svg className="w-3 h-3 text-border" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1l4 4-4 4"/></svg>
        <span className="text-primary">{pillarMeta.name}</span>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <h1 className="font-fraunces text-4xl text-primary mb-3">{pillarMeta.name}</h1>
        <p className="text-lg text-secondary max-w-2xl">{pillarMeta.description}</p>
        <p className="text-sm text-secondary mt-3">
          {articles.length} article{articles.length !== 1 ? 's' : ''}
        </p>
      </header>

      {/* Article grid */}
      {articles.length === 0 ? (
        <p className="text-secondary text-center py-16">No articles yet — check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map(({ frontmatter, slug }) => (
            <Link
              key={slug}
              href={`/library/${pillar}/${slug}`}
              className="group flex flex-col bg-surface border border-border rounded-xl overflow-hidden hover:-translate-y-[2px] hover:shadow-md transition-all duration-150"
            >
              {/* Cover image */}
              <div className="h-[180px] bg-surface-subtle relative overflow-hidden">
                {frontmatter.coverImage ? (
                  <>
                    <Image
                      src={frontmatter.coverImage}
                      alt={frontmatter.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                )}
                {/* Pillar label */}
                <div className="absolute bottom-3 left-3">
                  <span className="text-[11px] font-semibold text-white bg-black/30 backdrop-blur-[2px] rounded-full px-2.5 py-1">
                    {pillarLabel(pillar)}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-col flex-1 p-5 gap-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium capitalize ${
                    DIFFICULTY_COLORS[frontmatter.difficulty] ?? DIFFICULTY_COLORS.beginner
                  }`}>
                    {frontmatter.difficulty}
                  </span>
                </div>

                <h2 className="font-fraunces text-[16px] text-primary group-hover:text-accent transition-colors leading-snug">
                  {frontmatter.title}
                </h2>

                <p className="text-sm text-secondary line-clamp-2 flex-1">
                  {frontmatter.description}
                </p>

                <div className="flex items-center justify-between mt-2 pt-3 border-t border-border">
                  <span className="text-xs text-secondary">
                    {frontmatter.readTime} min read · {frontmatter.author}
                  </span>
                  <span className="text-xs font-semibold text-accent group-hover:underline underline-offset-2">
                    Read article →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
