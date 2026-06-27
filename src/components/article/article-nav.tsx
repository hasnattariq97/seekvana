import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getArticlesByPillar } from '@/lib/mdx'
import fs from 'fs'
import path from 'path'

interface NavArticle {
  title: string
  slug: string
  pillar: string
}

interface RelatedArticle extends NavArticle {
  readTime: number
}

interface ArticleNavProps {
  pillar: string
  slug: string
  lessonNumber?: string
}

type PathTopic = {
  id: string
  title: string
  articlePillar?: string
  articleSlug?: string
}

function getPathNav(pillar: string, slug: string): {
  prev: NavArticle | null
  next: NavArticle | null
} | null {
  try {
    const pathsDir = path.join(process.cwd(), 'src/content/paths')
    const files = fs.readdirSync(pathsDir).filter((f) => f.endsWith('.json'))

    for (const file of files) {
      const data = JSON.parse(fs.readFileSync(path.join(pathsDir, file), 'utf8'))
      const allTopics: PathTopic[] = data.modules.flatMap((m: { topics: PathTopic[] }) => m.topics)
      const linkable = allTopics.filter((t) => t.articlePillar && t.articleSlug)
      const idx = linkable.findIndex(
        (t) => t.articlePillar === pillar && t.articleSlug === slug
      )
      if (idx === -1) continue

      const prevT = idx > 0 ? linkable[idx - 1] : null
      const nextT = idx < linkable.length - 1 ? linkable[idx + 1] : null

      return {
        prev: prevT?.articlePillar && prevT?.articleSlug
          ? { title: prevT.title, slug: prevT.articleSlug, pillar: prevT.articlePillar }
          : null,
        next: nextT?.articlePillar && nextT?.articleSlug
          ? { title: nextT.title, slug: nextT.articleSlug, pillar: nextT.articlePillar }
          : null,
      }
    }
  } catch {
    // fall through to pillar-based nav
  }
  return null
}

export function ArticleNav({ pillar, slug, lessonNumber }: ArticleNavProps) {
  // Use path order when article is a lesson
  const pathNav = lessonNumber ? getPathNav(pillar, slug) : null

  let prev: NavArticle | null = null
  let next: NavArticle | null = null

  if (pathNav) {
    prev = pathNav.prev
    next = pathNav.next
  } else {
    const all = getArticlesByPillar(pillar).sort(
      (a, b) =>
        new Date(a.frontmatter.publishedAt).getTime() -
        new Date(b.frontmatter.publishedAt).getTime()
    )
    const idx = all.findIndex((a) => a.slug === slug)
    prev = idx > 0
      ? { title: all[idx - 1].frontmatter.title, slug: all[idx - 1].slug, pillar }
      : null
    next = idx < all.length - 1
      ? { title: all[idx + 1].frontmatter.title, slug: all[idx + 1].slug, pillar }
      : null
  }

  const related: RelatedArticle[] = getArticlesByPillar(pillar)
    .filter((a) => a.slug !== slug)
    .slice(0, 3)
    .map((a) => ({
      title: a.frontmatter.title,
      slug: a.slug,
      pillar,
      readTime: a.frontmatter.readTime,
    }))

  return (
    <div className="mt-12 space-y-10">
      {/* Prev / Next */}
      <div className="grid grid-cols-2 gap-4">
        {prev ? (
          <Link
            href={`/library/${prev.pillar}/${prev.slug}`}
            className="group flex flex-col gap-2 p-5 rounded-xl border border-border hover:border-accent/40 hover:bg-surface-subtle transition-colors"
          >
            <span className="flex items-center gap-1 text-xs font-medium text-secondary">
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" /> Previous
            </span>
            <span className="font-fraunces text-base text-primary">
              {prev.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link
            href={`/library/${next.pillar}/${next.slug}`}
            className="group flex flex-col gap-2 p-5 rounded-xl border border-border hover:border-accent/40 hover:bg-surface-subtle transition-colors text-right col-start-2"
          >
            <span className="flex items-center justify-end gap-1 text-xs font-medium text-secondary">
              Next <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
            <span className="font-fraunces text-base text-primary">
              {next.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <div>
          <h3 className="font-fraunces text-xl text-primary mb-5">Keep reading</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((article) => (
              <Link
                key={article.slug}
                href={`/library/${article.pillar}/${article.slug}`}
                className="group flex flex-col gap-2 p-5 rounded-xl border border-border hover:border-accent/40 hover:bg-surface-subtle transition-all"
              >
                <span className="font-fraunces text-base text-primary leading-snug">
                  {article.title}
                </span>
                <span className="text-xs text-secondary">
                  {article.readTime} min read
                </span>
                <span className="text-xs text-accent font-medium mt-auto pt-2 transition-colors group-hover:underline underline-offset-2">
                  Read &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
