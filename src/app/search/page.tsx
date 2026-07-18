import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Search, ArrowRight, Route, BookOpen, Hash } from 'lucide-react'
import { getSearchIndex, matchSearchItem } from '@/lib/search-index'
import type { SearchItem } from '@/lib/search-types'
import { Footer } from '@/components/layout/footer'

export const metadata: Metadata = {
  title: 'Search',
  description:
    'Search articles, learning paths, and glossary terms across Seekvana.',
  // Search result URLs are per-query and thin — keep them out of the index
  // while still letting Google follow through to the real pages.
  robots: { index: false, follow: true },
  alternates: { canonical: 'https://seekvana.com/search' },
}

const POPULAR = ['Agentic AI', 'RAG', 'Prompting', 'Fine-tuning', 'LLM']

const GROUPS: { key: SearchItem['type']; label: string; icon: typeof Route }[] = [
  { key: 'path', label: 'Learning Paths', icon: Route },
  { key: 'article', label: 'Articles', icon: BookOpen },
  { key: 'glossary', label: 'Glossary', icon: Hash },
]

function SearchInput({ defaultValue }: { defaultValue: string }) {
  return (
    <form
      action="/search"
      method="get"
      role="search"
      className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 focus-within:ring-2 focus-within:ring-accent/30 transition"
    >
      <Search className="text-secondary shrink-0" size={20} aria-hidden="true" />
      <label htmlFor="q" className="sr-only">
        Search
      </label>
      <input
        id="q"
        name="q"
        type="search"
        defaultValue={defaultValue}
        autoFocus
        placeholder="Search articles, paths, and topics..."
        className="flex-1 bg-transparent text-primary placeholder:text-secondary outline-none font-inter text-base"
      />
      <button
        type="submit"
        className="shrink-0 bg-accent hover:bg-accent-deep text-white rounded-lg px-4 py-1.5 text-sm font-medium transition-colors"
      >
        Search
      </button>
    </form>
  )
}

function ResultRow({ item }: { item: SearchItem }) {
  const Icon = GROUPS.find((g) => g.key === item.type)!.icon
  return (
    <Link
      href={item.href}
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-subtle transition-colors group"
    >
      <Icon className="text-secondary shrink-0 mt-0.5" size={16} aria-hidden="true" />
      <span className="shrink-0 bg-accent-soft text-accent text-xs px-2 py-0.5 rounded font-medium mt-0.5">
        {item.category}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-primary text-sm font-medium">{item.title}</p>
        <p className="text-secondary text-xs line-clamp-1 mt-0.5">{item.excerpt}</p>
      </div>
      <ArrowRight
        className="text-secondary shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        size={16}
        aria-hidden="true"
      />
    </Link>
  )
}

async function SearchBody({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = '' } = await searchParams
  const query = q.trim()

  const matches = query
    ? getSearchIndex().filter((item) => matchSearchItem(item, query))
    : []

  return (
    <>
      <div className="mt-6">
        <SearchInput defaultValue={query} />
      </div>

      {/* Empty query — suggest popular searches */}
      {!query && (
        <div className="mt-8">
          <p className="text-secondary text-xs font-medium mb-3">Popular searches</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR.map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="bg-surface-subtle border border-border rounded-full px-3 py-1.5 text-sm text-secondary hover:text-accent hover:border-accent transition-colors"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {query && matches.length === 0 && (
        <div className="mt-8 rounded-xl border border-border bg-surface-subtle p-6">
          <p className="text-primary text-sm">
            No results for <span className="font-medium">&ldquo;{query}&rdquo;</span>
          </p>
          <p className="text-secondary text-xs mt-1">Try: agents, RAG, prompting</p>
        </div>
      )}

      {/* Grouped results */}
      {query && matches.length > 0 && (
        <div className="mt-8">
          <p className="text-secondary text-sm mb-4">
            {matches.length} result{matches.length === 1 ? '' : 's'} for{' '}
            <span className="text-primary font-medium">&ldquo;{query}&rdquo;</span>
          </p>
          <div className="space-y-6">
            {GROUPS.map(({ key, label }) => {
              const items = matches.filter((m) => m.type === key)
              if (items.length === 0) return null
              return (
                <div key={key}>
                  <p className="text-secondary text-xs font-semibold uppercase tracking-wide px-3 mb-1">
                    {label}
                  </p>
                  <div className="space-y-1">
                    {items.map((item) => (
                      <ResultRow key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

function SearchSkeleton() {
  return (
    <div className="mt-6" aria-hidden="true">
      <div className="h-[52px] rounded-xl border border-border bg-surface-subtle animate-pulse" />
      <div className="mt-8 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-3 items-start animate-pulse">
            <div className="h-5 w-16 bg-surface-subtle rounded shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-surface-subtle rounded w-3/4" />
              <div className="h-3 bg-surface-subtle rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <div className="flex-1 w-full max-w-3xl mx-auto px-4 md:px-6 py-12 md:py-16">
        <h1 className="font-fraunces text-4xl md:text-5xl font-medium text-primary">
          Search
        </h1>
        <p className="text-secondary mt-2">
          Find articles, learning paths, and glossary terms.
        </p>
        <Suspense fallback={<SearchSkeleton />}>
          <SearchBody searchParams={searchParams} />
        </Suspense>
      </div>
      <Footer />
    </div>
  )
}
