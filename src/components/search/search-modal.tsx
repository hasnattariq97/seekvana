'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, BookOpen, Hash, Route, Search, X } from 'lucide-react'
import { useSearch } from '@/context/search-context'
import type { SearchItem, SearchResults } from '@/lib/search-types'

function filterData(data: SearchItem[], query: string): SearchResults {
  const q = query.toLowerCase().trim()
  if (!q) return { paths: [], articles: [], glossary: [] }

  const match = (item: SearchItem) =>
    item.title.toLowerCase().includes(q) ||
    item.excerpt.toLowerCase().includes(q) ||
    item.category.toLowerCase().includes(q)

  return {
    paths: data.filter((i) => i.type === 'path' && match(i)).slice(0, 2),
    articles: data.filter((i) => i.type === 'article' && match(i)).slice(0, 5),
    glossary: data.filter((i) => i.type === 'glossary' && match(i)).slice(0, 3),
  }
}

function ResultGroup({
  label,
  items,
  selectedIndex,
  startIndex,
  onSelect,
  icon: LucideIcon,
}: {
  label: string
  items: SearchItem[]
  selectedIndex: number
  startIndex: number
  onSelect: (href: string) => void
  icon: React.ComponentType<{ size?: number; className?: string }>
}) {
  return (
    <div className="mb-1">
      <p className="text-secondary text-xs font-semibold px-3 py-2">
        {label}
      </p>
      {items.map((item, i) => {
        const globalIdx = startIndex + i
        const isSelected = selectedIndex === globalIdx
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.href)}
            className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
              isSelected ? 'bg-accent-soft' : 'hover:bg-surface-subtle'
            }`}
          >
            <LucideIcon size={14} className="text-secondary shrink-0 mt-0.5" />
            <span className="shrink-0 bg-accent-soft text-accent text-xs px-2 py-0.5 rounded font-medium mt-0.5">
              {item.category}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-primary text-sm font-medium">{item.title}</p>
              <p className="text-secondary text-xs line-clamp-1 mt-0.5">
                {item.excerpt}
              </p>
            </div>
            <ArrowRight className="text-secondary shrink-0 mt-0.5" size={16} />
          </button>
        )
      })}
    </div>
  )
}

export function SearchModal({ data }: { data: SearchItem[] }) {
  const { isSearchOpen, closeSearch } = useSearch()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(-1)

  // Derived: true while the debounce timer is pending (query typed but not yet committed)
  const isSearching = Boolean(query.trim()) && query.trim() !== debouncedQuery.trim()

  // Debounce: commit the query after 200ms idle, then reset selection
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
      setSelectedIndex(-1)
    }, 200)
    return () => clearTimeout(timer)
  }, [query])

  // Auto-focus input and reset state on open
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        setQuery('')
        setDebouncedQuery('')
        setSelectedIndex(-1)
        inputRef.current?.focus()
      }, 0)
    }
  }, [isSearchOpen])

  const results = filterData(data, debouncedQuery)
  const flatItems = [
    ...results.paths,
    ...results.articles,
    ...results.glossary,
  ]
  const totalResults = flatItems.length

  const navigate = useCallback(
    (href: string) => {
      router.push(href)
      closeSearch()
    },
    [router, closeSearch],
  )

  const clearQuery = () => {
    setQuery('')
    setDebouncedQuery('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, totalResults - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, -1))
        break
      case 'Enter':
        if (selectedIndex >= 0 && flatItems[selectedIndex]) {
          navigate(flatItems[selectedIndex].href)
        }
        break
      case 'Escape':
        closeSearch()
        break
    }
  }

  const isEmpty = !debouncedQuery.trim() && !isSearching
  const hasResults = !isSearching && totalResults > 0
  const noResults = !isSearching && !isEmpty && totalResults === 0

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 px-4"
          onClick={closeSearch}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.2 }}
            className="max-w-2xl mx-auto mt-20 bg-surface rounded-2xl border border-border shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <Search className="text-secondary shrink-0" size={20} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search articles, paths, and topics..."
                className="flex-1 text-lg bg-transparent text-primary placeholder:text-secondary outline-none font-inter"
              />
              {query && (
                <button
                  onClick={clearQuery}
                  className="text-secondary hover:text-primary transition-colors"
                  aria-label="Clear search"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Results body */}
            <div className="max-h-96 overflow-y-auto">
              {/* Empty state: popular search chips */}
              {isEmpty && (
                <div className="p-5">
                  <p className="text-secondary text-xs font-medium mb-3">Popular searches</p>
                  <div className="flex flex-wrap gap-2">
                    {['Agentic AI', 'RAG', 'Prompting', 'Fine-tuning', 'LLM'].map(
                      (term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="bg-surface-subtle border border-border rounded-full px-3 py-1.5 text-sm text-secondary hover:text-accent hover:border-accent transition-colors"
                        >
                          {term}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Loading skeleton */}
              {isSearching && (
                <div className="p-5 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex gap-3 items-start">
                      <div className="h-5 w-16 bg-surface-subtle rounded shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-surface-subtle rounded w-3/4" />
                        <div className="h-3 bg-surface-subtle rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No results */}
              {noResults && (
                <div className="p-5">
                  <p className="text-primary text-sm mb-1">
                    No results for &quot;{debouncedQuery}&quot;
                  </p>
                  <p className="text-secondary text-xs">
                    Try: agents, RAG, prompting
                  </p>
                </div>
              )}

              {/* Grouped results */}
              {hasResults && (
                <div className="p-2">
                  {results.paths.length > 0 && (
                    <ResultGroup
                      label="Learning Paths"
                      items={results.paths}
                      selectedIndex={selectedIndex}
                      startIndex={0}
                      onSelect={navigate}
                      icon={Route}
                    />
                  )}
                  {results.articles.length > 0 && (
                    <ResultGroup
                      label="Articles"
                      items={results.articles}
                      selectedIndex={selectedIndex}
                      startIndex={results.paths.length}
                      onSelect={navigate}
                      icon={BookOpen}
                    />
                  )}
                  {results.glossary.length > 0 && (
                    <ResultGroup
                      label="Glossary"
                      items={results.glossary}
                      selectedIndex={selectedIndex}
                      startIndex={results.paths.length + results.articles.length}
                      onSelect={navigate}
                      icon={Hash}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Keyboard shortcut footer */}
            <div className="border-t border-border px-5 py-2.5 flex items-center gap-4 text-xs text-secondary">
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span>esc close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
