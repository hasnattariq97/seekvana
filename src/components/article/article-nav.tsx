import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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

const MOCK_ADJACENT: Record<
  string,
  { prev: NavArticle | null; next: NavArticle | null }
> = {
  'what-is-an-agent': {
    prev: null,
    next: {
      title: 'Tool Use: Giving Models Hands',
      slug: 'tool-use-explained',
      pillar: 'agentic-ai',
    },
  },
}

const MOCK_RELATED: Record<string, RelatedArticle[]> = {
  'what-is-an-agent': [
    {
      title: 'Tool Use: Giving Models Hands',
      slug: 'tool-use-explained',
      pillar: 'agentic-ai',
      readTime: 12,
    },
    {
      title: 'Memory in AI Agents',
      slug: 'agent-memory',
      pillar: 'agentic-ai',
      readTime: 9,
    },
    {
      title: 'RAG Without the Hype',
      slug: 'rag-explained',
      pillar: 'agentic-ai',
      readTime: 10,
    },
  ],
}

export function ArticleNav({ pillar: _pillar, slug }: ArticleNavProps) {
  const adjacent = MOCK_ADJACENT[slug] ?? { prev: null, next: null }
  const related = MOCK_RELATED[slug] ?? []

  return (
    <div className="mt-12 space-y-10">
      {/* Prev / Next */}
      <div className="grid grid-cols-2 gap-4">
        {adjacent.prev ? (
          <Link
            href={`/library/${adjacent.prev.pillar}/${adjacent.prev.slug}`}
            className="group flex flex-col gap-2 p-5 rounded-xl border border-border hover:border-accent/40 hover:bg-surface-subtle transition-colors"
          >
            <span className="flex items-center gap-1 text-xs font-medium text-secondary">
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" /> Previous
            </span>
            <span className="font-fraunces text-base text-primary">
              {adjacent.prev.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {adjacent.next ? (
          <Link
            href={`/library/${adjacent.next.pillar}/${adjacent.next.slug}`}
            className="group flex flex-col gap-2 p-5 rounded-xl border border-border hover:border-accent/40 hover:bg-surface-subtle transition-colors text-right col-start-2"
          >
            <span className="flex items-center justify-end gap-1 text-xs font-medium text-secondary">
              Next <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
            <span className="font-fraunces text-base text-primary">
              {adjacent.next.title}
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
