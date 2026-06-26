import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { getGlossaryBySlug, getAllGlossaryTerms, getAllArticles } from '@/lib/mdx'
import { getMDXComponents } from '@/components/mdx/mdx-components'

interface Props {
  params: Promise<{ term: string }>
}

export function generateStaticParams() {
  return getAllGlossaryTerms().map((t) => ({ term: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { term } = await params
  const result = getGlossaryBySlug(term)
  if (!result) return {}
  const { frontmatter } = result
  return {
    title: `${frontmatter.term} — AI Glossary — Seekvana`,
    description: frontmatter.shortDef,
    alternates: {
      canonical: `https://seekvana.com/glossary/${term}`,
    },
    openGraph: {
      title: `${frontmatter.term} — AI Glossary — Seekvana`,
      description: frontmatter.shortDef,
    },
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function GlossaryTermPage({ params }: Props) {
  const { term } = await params
  const result = getGlossaryBySlug(term)
  if (!result) notFound()

  const { source, frontmatter } = result

  const relatedArticles = getAllArticles()
    .filter((a) =>
      a.frontmatter.tags?.some((t: string) =>
        frontmatter.tags.map((g: string) => g.toLowerCase()).includes(t.toLowerCase())
      )
    )
    .slice(0, 3)

  const allTerms = getAllGlossaryTerms()
  const termNameMap = Object.fromEntries(allTerms.map((t) => [t.slug, t.frontmatter.term as string]))

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-secondary mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <span>/</span>
        <Link href="/glossary" className="hover:text-accent transition-colors">Glossary</Link>
        <span>/</span>
        <span className="text-primary">{frontmatter.term}</span>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <span className="inline-block bg-accent-soft text-accent text-xs rounded-full px-3 py-1 font-inter">
          Glossary
        </span>
        <h1 className="font-fraunces text-4xl text-primary mt-3 leading-tight">
          {frontmatter.term}
        </h1>
        <p className="text-xl text-secondary mt-3 leading-relaxed border-l-2 border-accent-soft pl-4">
          {frontmatter.shortDef}
        </p>
        {frontmatter.publishedAt && (
          <p className="text-sm text-secondary mt-4">
            {formatDate(frontmatter.publishedAt)}
          </p>
        )}
        <hr className="border-t border-border mt-6" />
      </header>

      {/* MDX Body */}
      <div className="prose-seekvana">
        <MDXRemote
          source={source}
          components={getMDXComponents()}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="mt-12">
          <h2 className="font-fraunces text-xl text-primary mb-5">Related articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedArticles.map((a) => (
              <Link
                key={`${a.pillar}/${a.slug}`}
                href={`/library/${a.pillar}/${a.slug}`}
                className="bg-surface rounded-xl border border-border p-4 hover:border-accent/40 hover:bg-surface-subtle transition-all group"
              >
                <p className="font-fraunces text-base text-primary leading-snug group-hover:text-accent transition-colors">
                  {a.frontmatter.title}
                </p>
                <p className="text-xs text-secondary mt-2">{a.frontmatter.readTime} min read</p>
                <span className="text-xs text-accent font-medium mt-2 block">Read →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related Terms */}
      {frontmatter.relatedTerms?.length > 0 && (
        <section className="mt-10">
          <p className="text-sm text-secondary font-medium mb-3">See also</p>
          <div className="flex flex-wrap gap-2">
            {frontmatter.relatedTerms.map((termSlug: string) => (
              <Link
                key={termSlug}
                href={`/glossary/${termSlug}`}
                className="bg-surface-subtle border border-border rounded-full px-4 py-1.5 text-sm text-secondary hover:text-accent hover:border-accent transition-colors"
              >
                {termNameMap[termSlug] ?? termSlug}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Back link */}
      <div className="mt-12 pt-8 border-t border-border">
        <Link href="/glossary" className="text-accent text-sm hover:underline">
          ← All glossary terms
        </Link>
      </div>
    </main>
  )
}
