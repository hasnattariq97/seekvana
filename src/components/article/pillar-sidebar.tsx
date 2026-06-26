'use client'

import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const PILLAR_NAMES: Record<string, string> = {
  'agentic-ai': 'Agentic AI',
  'ai-foundations': 'AI Foundations',
  'large-language-models': 'Large Language Models',
  'building-with-ai': 'Building with AI',
  'ai-tools': 'AI Tools',
  'ai-in-practice': 'AI in Practice',
  'prompt-engineering': 'Prompt Engineering',
  'ethics-safety': 'Ethics & Safety',
  careers: 'Careers',
}

interface PillarSidebarProps {
  pillar: string
  currentSlug: string
  articles: { title: string; slug: string }[]
}

function SidebarContent({ pillar, currentSlug, articles }: PillarSidebarProps) {
  const pillarName = PILLAR_NAMES[pillar] ?? pillar

  return (
    <div className="flex flex-col gap-1">
      <Link
        href="/library"
        className="text-accent text-sm hover:underline mb-3 inline-flex items-center gap-1"
      >
        ← Library
      </Link>
      <p className="font-fraunces text-base text-primary mb-4">{pillarName}</p>
      <nav className="flex flex-col gap-0.5" aria-label={`${pillarName} articles`}>
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/library/${pillar}/${article.slug}`}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              article.slug === currentSlug
                ? 'bg-accent-soft text-accent font-medium'
                : 'text-secondary hover:text-primary hover:bg-surface-subtle'
            }`}
          >
            {article.title}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export function PillarSidebar({ pillar, currentSlug, articles }: PillarSidebarProps) {
  return (
    // Desktop sticky sidebar only — hidden below lg
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-20 overflow-y-auto max-h-[calc(100vh-5rem)] pr-2">
        <SidebarContent pillar={pillar} currentSlug={currentSlug} articles={articles} />
      </div>
    </aside>
  )
}

// Separate mobile button — render inside the article column, not as a flex sibling
export function PillarSidebarMobile({ pillar, currentSlug, articles }: PillarSidebarProps) {
  return (
    <div className="lg:hidden mb-6">
      <Sheet>
        <SheetTrigger className="flex items-center gap-2 text-sm text-secondary border border-border rounded-lg px-4 py-2 hover:bg-surface-subtle transition-colors">
          <BookOpen className="h-4 w-4" />
          Contents
        </SheetTrigger>
        <SheetContent side="left" className="w-72 bg-surface p-6">
          <SheetHeader>
            <SheetTitle className="text-left font-fraunces">Contents</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <SidebarContent pillar={pillar} currentSlug={currentSlug} articles={articles} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
