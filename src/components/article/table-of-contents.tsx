'use client'

import { useEffect, useState } from 'react'
import type { ArticleHeading } from '@/lib/mdx'
import { AdSlot } from '@/components/article/ad-slot'

interface TableOfContentsProps {
  headings: ArticleHeading[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <aside className="hidden xl:block w-56 shrink-0">
      <div className="sticky top-20 flex flex-col gap-6">
        <nav aria-label="Table of contents">
          <p className="font-fraunces text-xs text-secondary uppercase tracking-widest mb-3">
            On this page
          </p>
          <ul className="flex flex-col gap-1">
            {headings.map(({ id, text, level }) => (
              <li key={id} className={level === 3 ? 'ml-3' : ''}>
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className={`text-sm block py-1 transition-colors ${
                    activeId === id
                      ? 'text-accent font-medium'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <AdSlot size="300x250" />
      </div>
    </aside>
  )
}
