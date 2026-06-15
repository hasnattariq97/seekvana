import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getArticlesByPillar } from '@/lib/mdx'

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
}

export function ArticleNav({ pillar, slug }: ArticleNavProps) {
  const all = getArticlesByPillar(pillar).sort(
    (a, b) =>
      new Date(a.frontmatter.publishedAt).getTime() -
      new Date(b.frontmatter.publishedAt).getTime()
  )

  const idx = all.findIndex((a) => a.slug === slug)
  const prevArticle = idx > 0 ? all[idx - 1] : null
  const nextArticle = idx < all.length - 1 ? all[idx + 1] : null

  const prev: NavArticle | null = prevArticle
    ? { title: prevArticle.frontmatter.title, slug: prevArticle.slug, pillar }
    : null

  const next: NavArticle | null = nextArticle
    ? { title: nextArticle.frontmatter.title, slug: nextArticle.slug, pillar }
    : null

  const related: RelatedArticle[] = all
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
          <h3 className="font-fraunces text-xl text-primary mb-5">
            Keep reading
          </h3>
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
