import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getArticleSource, type ArticleFrontmatter } from '@/lib/mdx'
import { getMDXComponents } from '@/components/mdx/mdx-components'
import { ReadingProgress } from '@/components/article/reading-progress'
import { PillarSidebar } from '@/components/article/pillar-sidebar'
import { TableOfContents } from '@/components/article/table-of-contents'
import { ArticleFeedback } from '@/components/article/article-feedback'
import { ArticleNav } from '@/components/article/article-nav'

interface PageProps {
  params: Promise<{ pillar: string; slug: string }>
}

const PILLAR_NAMES: Record<string, string> = {
  'agentic-ai': 'Agentic AI',
  'ai-foundations': 'AI Foundations',
  'large-language-models': 'Large Language Models',
  'building-with-ai': 'Building with AI',
  'ai-tools': 'AI Tools',
  'use-cases': 'Use Cases',
  'concepts-theory': 'Concepts & Theory',
  'ethics-safety': 'Ethics & Safety',
  careers: 'Careers',
}

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  intermediate:
    'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pillar, slug } = await params
  try {
    const { frontmatter } = getArticleSource(pillar, slug)
    const url = `https://seekvana.com/library/${pillar}/${slug}`
    return {
      title: frontmatter.title,
      description: frontmatter.description,
      alternates: { canonical: url },
      openGraph: {
        type: 'article',
        url,
        title: frontmatter.title,
        description: frontmatter.description,
        publishedTime: frontmatter.publishedAt,
        authors: [frontmatter.author],
        tags: frontmatter.tags,
        images: [{ url: '/og-image.png', width: 1200, height: 630 }],
      },
      twitter: {
        card: 'summary_large_image',
        title: frontmatter.title,
        description: frontmatter.description,
        images: ['/og-image.png'],
      },
    }
  } catch {
    return { title: 'Article — Seekvana' }
  }
}

function buildArticleJsonLd(
  frontmatter: ArticleFrontmatter,
  pillar: string,
  slug: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: frontmatter.title,
    description: frontmatter.description,
    author: {
      '@type': 'Organization',
      name: frontmatter.author,
      url: 'https://seekvana.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Seekvana',
      url: 'https://seekvana.com',
    },
    datePublished: frontmatter.publishedAt,
    url: `https://seekvana.com/library/${pillar}/${slug}`,
    keywords: frontmatter.tags.join(', '),
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { pillar, slug } = await params

  let articleData
  try {
    articleData = getArticleSource(pillar, slug)
  } catch {
    notFound()
  }

  const { source, frontmatter, headings } = articleData
  const pillarName = PILLAR_NAMES[pillar] ?? pillar
  const difficultyClass =
    DIFFICULTY_COLORS[frontmatter.difficulty] ?? DIFFICULTY_COLORS.beginner

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildArticleJsonLd(frontmatter, pillar, slug)),
        }}
      />
      <ReadingProgress />

      <div className="max-w-7xl mx-auto px-4 py-10 flex gap-8 items-start">
        {/* Left sidebar */}
        <PillarSidebar pillar={pillar} currentSlug={slug} />

        {/* Center — article content */}
        <article className="flex-1 min-w-0">
          <div className="max-w-2xl mx-auto px-0 md:px-8">
            {/* Breadcrumbs */}
            <nav
              className="flex items-center gap-2 text-sm text-secondary mb-8 flex-wrap"
              aria-label="Breadcrumb"
            >
              <Link href="/library" className="hover:text-accent transition-colors">
                Library
              </Link>
              <span aria-hidden="true">/</span>
              <Link
                href={`/library/${pillar}`}
                className="hover:text-accent transition-colors"
              >
                {pillarName}
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-primary truncate max-w-[200px]">
                {frontmatter.title}
              </span>
            </nav>

            {/* Article header */}
            <header className="mb-10">
              <div className="flex gap-2 mb-4 flex-wrap">
                <span className="bg-accent-soft text-accent text-xs px-3 py-1 rounded-full font-medium">
                  {pillarName}
                </span>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${difficultyClass}`}
                >
                  {frontmatter.difficulty}
                </span>
              </div>
              <h1 className="font-fraunces text-4xl text-primary leading-tight">
                {frontmatter.title}
              </h1>
              <p className="text-lg text-secondary mt-3 leading-relaxed">
                {frontmatter.description}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 text-sm text-secondary">
                <span>{frontmatter.author}</span>
                <span aria-hidden="true">·</span>
                <span>
                  {new Date(frontmatter.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span aria-hidden="true">·</span>
                <span>{frontmatter.readTime} min read</span>
              </div>
            </header>

            {/* Article body */}
            <div>
              <MDXRemote source={source} components={getMDXComponents()} />
            </div>

            {/* Feedback */}
            <hr className="border-border my-8" />
            <ArticleFeedback />

            {/* Prev/Next + Related */}
            <ArticleNav pillar={pillar} slug={slug} />
          </div>
        </article>

        {/* Right sidebar — TOC */}
        <TableOfContents headings={headings} />
      </div>
    </>
  )
}
