import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Glossary — Seekvana',
  description: 'Plain-language definitions for AI terms — from tokens and embeddings to agentic workflows.',
  alternates: { canonical: 'https://seekvana.com/glossary' },
}

export default function GlossaryPage() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-12">
      <nav className="flex items-center gap-2 text-sm text-secondary mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <svg className="w-3 h-3 text-border" viewBox="0 0 6 10" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M1 1l4 4-4 4"/></svg>
        <span className="text-primary">Glossary</span>
      </nav>
      <h1 className="font-fraunces text-4xl text-primary mb-4">AI Glossary</h1>
      <p className="text-lg text-secondary max-w-2xl mb-12">
        Plain-language definitions for the terms that matter — no jargon, no assumptions.
      </p>
      <div className="bg-surface border border-border rounded-xl p-10 text-center max-w-lg mx-auto">
        <p className="font-fraunces text-xl text-primary mb-2">Coming soon</p>
        <p className="text-sm text-secondary">
          The full glossary is being built. Start with our{' '}
          <Link href="/library/ai-foundations" className="text-accent hover:underline">AI Foundations</Link> articles while you wait.
        </p>
      </div>
    </div>
  )
}
