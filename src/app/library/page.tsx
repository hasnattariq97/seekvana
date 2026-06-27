import Link from 'next/link'
import type { Metadata } from 'next'
import { PILLARS } from '@/lib/pillars'
import { getAllArticles } from '@/lib/mdx'

export const metadata: Metadata = {
  title: 'Library — Seekvana',
  description: 'Every AI topic in one place — from foundations to agentic systems. Browse all 9 content pillars.',
  alternates: { canonical: 'https://seekvana.com/library' },
  openGraph: {
    title: 'Library — Seekvana',
    description: 'Every AI topic in one place — from foundations to agentic systems.',
    url: 'https://seekvana.com/library',
  },
}

const PILLAR_META: Record<string, { featured?: boolean; startHere?: boolean }> = {
  'ai-foundations': { featured: true, startHere: true },
}

export default function LibraryPage() {
  const allArticles = getAllArticles()
  const countByPillar = Object.fromEntries(
    PILLARS.map((p) => [p.slug, allArticles.filter((a) => a.pillar === p.slug).length])
  )
  const totalArticles = allArticles.length

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-secondary mb-7" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-accent transition-colors font-medium">Home</Link>
        <svg className="w-3 h-3 text-secondary/40" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1l4 4-4 4"/></svg>
        <span className="text-primary font-medium">Library</span>
      </nav>

      {/* Header */}
      <header className="mb-8">
        <h1 className="font-fraunces text-[36px] font-bold text-primary leading-tight tracking-tight mb-2">
          The Library
        </h1>
        <p className="text-[14px] text-secondary leading-relaxed max-w-lg mb-3">
          Every AI topic — clearly explained. Browse by subject area or search for what you need.
        </p>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-[5px] px-[11px] py-[4px] bg-surface-subtle border border-border rounded-full text-[12px] text-secondary font-medium">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            {totalArticles} article{totalArticles !== 1 ? 's' : ''}
          </span>
          <span className="inline-flex items-center gap-[5px] px-[11px] py-[4px] bg-surface-subtle border border-border rounded-full text-[12px] text-secondary font-medium">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            {PILLARS.length} topics
          </span>
        </div>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {PILLARS.map((pillar) => {
          const count = countByPillar[pillar.slug] ?? 0
          const meta = PILLAR_META[pillar.slug] ?? {}
          const featured = meta.featured ?? false
          const startHere = meta.startHere ?? false

          return (
            <Link
              key={pillar.slug}
              href={`/library/${pillar.slug}`}
              className={`group flex flex-col bg-surface-subtle border rounded-[14px] overflow-hidden transition-all duration-150 hover:-translate-y-[3px] hover:shadow-[0_12px_32px_rgba(26,23,20,0.1)] ${
                featured
                  ? 'border-accent/40 shadow-[0_0_0_1px_rgba(201,99,63,0.08)]'
                  : 'border-border hover:border-border/80'
              }`}
            >
              {/* Image zone */}
              <div className={`h-[110px] border-b border-border flex items-center justify-center relative overflow-hidden ${
                featured ? 'bg-accent-soft/50' : 'bg-surface-subtle'
              }`}>
                {/* Placeholder — replace with next/image once you add images (see below) */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center gap-[6px] ${featured ? 'opacity-40' : 'opacity-30'} pointer-events-none`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={featured ? 'var(--color-accent)' : 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span className={`text-[10px] font-medium text-center leading-tight ${featured ? 'text-accent' : 'text-secondary'}`}>
                    Your image<br/>goes here
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="flex flex-col flex-1 p-[18px] gap-2">
                <h2 className={`font-fraunces text-[15px] font-bold leading-snug tracking-tight ${
                  featured ? 'text-accent' : 'text-primary'
                }`}>
                  {pillar.name}
                </h2>
                <p className="text-[11.5px] text-secondary leading-[1.55] flex-1">
                  {pillar.description}
                </p>
                <div className="flex items-center justify-between mt-[6px]">
                  <span className={`text-[11px] font-semibold ${featured ? 'text-accent' : 'text-secondary'}`}>
                    {count > 0 ? `${count} article${count !== 1 ? 's' : ''}` : 'Coming soon'}
                  </span>
                  <div className="flex items-center gap-[6px]">
                    {startHere && (
                      <span className="text-[10px] font-semibold text-accent bg-accent/[0.08] border border-accent/[0.15] rounded-full px-2 py-[2px]">
                        Start here
                      </span>
                    )}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                      featured
                        ? 'bg-accent/[0.1] border-accent/25 group-hover:bg-accent/20'
                        : 'bg-canvas border-border group-hover:border-accent/40'
                    }`}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={featured ? 'var(--color-accent)' : 'currentColor'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={featured ? '' : 'text-secondary'}>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
