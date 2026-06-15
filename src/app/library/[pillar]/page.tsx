import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllArticles, getArticlesByPillar } from '@/lib/mdx'

const PILLAR_NAMES: Record<string, string> = {
  'agentic-ai': 'Agentic AI',
  'ai-foundations': 'AI Foundations',
  'large-language-models': 'Large Language Models',
  'building-with-ai': 'Building with AI',
  'ai-tools': 'AI Tools & Comparisons',
  'use-cases': 'Use Cases & Workflows',
  'concepts-theory': 'Concepts & Theory',
  'ethics-safety': 'Ethics, Safety & Governance',
  careers: 'Careers & Learning',
}

const PILLAR_DESCRIPTIONS: Record<string, string> = {
  'agentic-ai': 'Agents, tool use, memory, planning, and multi-agent systems.',
  'ai-foundations': 'What AI is, how it works, and why it matters.',
  'large-language-models': 'Tokens, context windows, RAG, fine-tuning, and how LLMs think.',
  'building-with-ai': 'APIs, SDKs, evals, deployment, and cost management.',
  'ai-tools': 'Reviews and comparisons of the best AI tools and APIs.',
  'use-cases': 'Real workflows: writing, coding, research, and automation.',
  'concepts-theory': 'Transformers, embeddings, and the mechanics under the hood.',
  'ethics-safety': 'Responsible AI, alignment, risks, and governance.',
  careers: 'How to learn AI, roles to aim for, and building your portfolio.',
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  intermediate: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

interface PageProps {
  params: Promise<{ pillar: string }>
}

export function generateStaticParams() {
  const articles = getAllArticles()
  const pillars = [...new Set(articles.map((a) => a.pillar))]
  return pillars.map((pillar) => ({ pillar }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pillar } = await params
  const name = PILLAR_NAMES[pillar] ?? pillar
  const description = PILLAR_DESCRIPTIONS[pillar] ?? `Articles about ${name} on Seekvana.`
  return {
    title: `${name} — Seekvana`,
    description,
    openGraph: {
      title: `${name} — Seekvana`,
      description,
      url: `https://seekvana.com/library/${pillar}`,
    },
  }
}

export default async function PillarPage({ params }: PageProps) {
  const { pillar } = await params
  const articles = getArticlesByPillar(pillar)

  if (articles.length === 0) notFound()

  const pillarName = PILLAR_NAMES[pillar] ?? pillar
  const description = PILLAR_DESCRIPTIONS[pillar] ?? ''

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <nav
        className="flex items-center gap-2 text-sm text-secondary mb-8"
        aria-label="Breadcrumb"
      >
        <Link href="/library" className="hover:text-accent transition-colors">
          Library
        </Link>
        <svg
          className="w-3 h-3 text-border"
          viewBox="0 0 6 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M1 1l4 4-4 4" />
        </svg>
        <span className="text-primary">{pillarName}</span>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <h1 className="font-fraunces text-4xl text-primary leading-tight">
          {pillarName}
        </h1>
        <p className="text-lg text-secondary mt-3 max-w-2xl">{description}</p>
        <p className="text-sm text-secondary mt-3">
          {articles.length} article{articles.length !== 1 ? 's' : ''}
        </p>
      </header>

      {/* Article list */}
      <div className="flex flex-col gap-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/library/${pillar}/${article.slug}`}
            className="group flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-xl border border-border hover:border-accent/40 hover:bg-surface-subtle transition-all"
          >
            <div className="flex-1 min-w-0">
              <h2 className="font-fraunces text-lg text-primary group-hover:text-accent transition-colors leading-snug">
                {article.frontmatter.title}
              </h2>
              <p className="text-sm text-secondary mt-1 line-clamp-2">
                {article.frontmatter.description}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${
                  DIFFICULTY_COLORS[article.frontmatter.difficulty] ??
                  DIFFICULTY_COLORS.beginner
                }`}
              >
                {article.frontmatter.difficulty}
              </span>
              <span className="text-xs text-secondary whitespace-nowrap">
                {article.frontmatter.readTime} min
              </span>
              <span className="text-xs text-accent font-medium whitespace-nowrap">
                Read &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
