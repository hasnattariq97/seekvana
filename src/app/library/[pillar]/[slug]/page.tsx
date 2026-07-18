import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { getArticleSource, getAllArticles, getArticlesByPillar, type ArticleFrontmatter } from '@/lib/mdx'
import { getPillarName } from '@/lib/pillars'
import { getMDXComponents } from '@/components/mdx/mdx-components'
import { ReadingProgress } from '@/components/article/reading-progress'
import { PillarSidebar, PillarSidebarMobile } from '@/components/article/pillar-sidebar'
import { TableOfContents } from '@/components/article/table-of-contents'
import { ArticleFeedback } from '@/components/article/article-feedback'
import { ShareRow } from '@/components/article/share-row'
import { ArticleNav } from '@/components/article/article-nav'
import { PostArticleNewsletter } from '@/components/newsletter/post-article-newsletter'
import { ArticleCommentsSection } from '@/components/article/article-comments-section'
import { ArticleBookmarkState } from '@/components/article/article-bookmark-state'
import { ArticleCompletionState } from '@/components/article/article-completion-state'
import {
  BookmarkButtonSkeleton,
  MarkCompleteSkeleton,
  CommentsSkeleton,
} from '@/components/article/article-islands-skeletons'

interface PageProps {
  params: Promise<{ pillar: string; slug: string }>
}


const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  intermediate:
    'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

export function generateStaticParams() {
  return getAllArticles().map((a) => ({
    pillar: a.pillar,
    slug: a.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pillar, slug } = await params
  try {
    const { frontmatter } = getArticleSource(pillar, slug)
    const url = `https://seekvana.com/library/${pillar}/${slug}`
    return {
      title: { absolute: frontmatter.title },
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
        images: [{
          url: frontmatter.coverImage
            ? `https://seekvana.com${frontmatter.coverImage}`
            : 'https://seekvana.com/og-image.png',
          width: 1200,
          height: 630,
          alt: frontmatter.title,
        }],
      },
      twitter: {
        card: 'summary_large_image',
        title: frontmatter.title,
        description: frontmatter.description,
        images: [frontmatter.coverImage
          ? `https://seekvana.com${frontmatter.coverImage}`
          : 'https://seekvana.com/og-image.png'],
      },
    }
  } catch {
    return { title: 'Article' }
  }
}

function buildArticleJsonLd(
  frontmatter: ArticleFrontmatter,
  pillar: string,
  slug: string
) {
  const url = `https://seekvana.com/library/${pillar}/${slug}`
  const image = frontmatter.coverImage
    ? `https://seekvana.com${frontmatter.coverImage}`
    : 'https://seekvana.com/og-image.png'
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
      logo: {
        '@type': 'ImageObject',
        url: 'https://seekvana.com/icon-512.png',
        width: 512,
        height: 512,
      },
    },
    datePublished: frontmatter.publishedAt,
    // No separate modified date in frontmatter; equal to publishedAt means
    // "unmodified since publish" — a truthful value Google accepts.
    dateModified: frontmatter.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    url,
    image,
    keywords: frontmatter.tags.join(', '),
  }
}

function buildBreadcrumbJsonLd(
  frontmatter: ArticleFrontmatter,
  pillar: string,
  slug: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Library',
        item: 'https://seekvana.com/library',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: getPillarName(pillar),
        item: `https://seekvana.com/library/${pillar}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: frontmatter.title,
        item: `https://seekvana.com/library/${pillar}/${slug}`,
      },
    ],
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

  const pillarName = getPillarName(pillar)
  const shareUrl = `https://seekvana.com/library/${pillar}/${slug}`
  const pillarArticles = getArticlesByPillar(pillar).map((a) => ({
    title: a.frontmatter.title,
    slug: a.slug,
  }))
  const difficultyClass =
    DIFFICULTY_COLORS[frontmatter.difficulty] ?? DIFFICULTY_COLORS.beginner

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: (() => {
            const schemas: object[] = [
              buildArticleJsonLd(frontmatter, pillar, slug),
              buildBreadcrumbJsonLd(frontmatter, pillar, slug),
            ]
            if (frontmatter.faqs && frontmatter.faqs.length > 0) {
              schemas.push({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: frontmatter.faqs.map(({ q, a }) => ({
                  '@type': 'Question',
                  name: q,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: a,
                  },
                })),
              })
            }
            return JSON.stringify(schemas.length === 1 ? schemas[0] : schemas)
          })(),
        }}
      />
      <ReadingProgress />

      <div className="max-w-7xl mx-auto px-4 py-12 flex gap-8 items-start">
        {/* Left sidebar */}
        <PillarSidebar pillar={pillar} currentSlug={slug} articles={pillarArticles} />

        {/* Center — article content */}
        <article className="flex-1 min-w-0">
          <div className="max-w-2xl mx-auto px-0 sm:px-6 md:px-8">
            {/* Mobile contents button — inside article column, not a flex sibling */}
            <PillarSidebarMobile pillar={pillar} currentSlug={slug} articles={pillarArticles} />
            {/* Breadcrumbs */}
            <nav
              className="flex items-center gap-2 text-sm text-secondary mb-8 flex-wrap"
              aria-label="Breadcrumb"
            >
              <Link href="/library" className="hover:text-accent transition-colors">
                Library
              </Link>
              <svg className="w-3 h-3 text-border" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1l4 4-4 4"/></svg>
              <Link
                href={`/library/${pillar}`}
                className="hover:text-accent transition-colors"
              >
                {pillarName}
              </Link>
              <svg className="w-3 h-3 text-border" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1l4 4-4 4"/></svg>
              <span className="text-primary truncate max-w-[200px] sm:max-w-xs">
                {frontmatter.title}
              </span>
            </nav>

            {/* Article header */}
            <header className="mb-10">
              <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-accent-soft text-accent text-xs px-3 py-1 rounded-full font-medium">
                    {pillarName}
                  </span>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${difficultyClass}`}
                  >
                    {frontmatter.difficulty}
                  </span>
                </div>
                <Suspense fallback={<BookmarkButtonSkeleton />}>
                  <ArticleBookmarkState pillar={pillar} slug={slug} />
                </Suspense>
              </div>
              <h1 className="font-fraunces text-2xl sm:text-4xl md:text-5xl text-primary leading-tight text-balance">
                {frontmatter.title}
              </h1>
              <p className="text-base md:text-lg text-secondary mt-4 leading-relaxed">
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
              <div className="mt-5">
                <ShareRow url={shareUrl} title={frontmatter.title} label="Share" />
              </div>
              <div className="mt-6 border-t border-border" />
            </header>

            {/* Article body */}
            <div className="mdx-content">
              <MDXRemote source={source} components={getMDXComponents()} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
            </div>

            {/* Mark complete */}
            <div className="flex justify-center my-8">
              <Suspense fallback={<MarkCompleteSkeleton />}>
                <ArticleCompletionState pillar={pillar} slug={slug} articleTitle={frontmatter.title} />
              </Suspense>
            </div>

            {/* Share */}
            <div className="mt-10">
              <ShareRow
                url={shareUrl}
                title={frontmatter.title}
                label="Share this article"
              />
            </div>

            {/* Feedback */}
            <hr className="border-border my-8" />
            <ArticleFeedback />

            {/* Comments */}
            <hr className="border-border my-8" />
            <Suspense fallback={<CommentsSkeleton />}>
              <ArticleCommentsSection articleId={`${pillar}/${slug}`} />
            </Suspense>

            {/* Newsletter */}
            <div className="mt-12 mb-8">
              <PostArticleNewsletter />
            </div>

            {/* Prev/Next + Related */}
            <ArticleNav pillar={pillar} slug={slug} lessonNumber={frontmatter.lessonNumber} />
          </div>
        </article>

        {/* Right sidebar — TOC */}
        <TableOfContents headings={headings} />
      </div>
    </>
  )
}
