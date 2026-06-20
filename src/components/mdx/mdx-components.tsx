import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'
import { Tip, Note, Warning } from './callout'
import { CodeBlock } from './code-block'
import { AdSlot } from '@/components/article/ad-slot'
import { ArticleImage } from './article-image'
import { Kbd } from './kbd'
import { Steps, Step } from './steps'
import { Mermaid } from './mermaid'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'
import { FileTree } from './file-tree'
import { YouTubeEmbed } from './youtube-embed'
import { ComparisonTable } from './comparison-table'
import { Quiz } from './quiz'
import { Chart } from './chart'
import { Math, MathBlock } from './math'
import { CodePlayground } from './code-playground'
import { DownloadButton } from './download-button'

function slugify(text: string): string {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function getMDXComponents(): MDXComponents {
  return {
    // Headings — IDs must match extractHeadings() in src/lib/mdx.ts
    h2: ({ children }) => (
      <h2
        id={slugify(String(children))}
        className="font-fraunces text-2xl text-primary mt-10 mb-4 scroll-mt-20"
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        id={slugify(String(children))}
        className="font-fraunces text-xl text-primary mt-8 mb-3 scroll-mt-20"
      >
        {children}
      </h3>
    ),

    // Body text
    p: ({ children }) => (
      <p className="text-base md:text-lg text-primary leading-relaxed mb-6 max-w-prose">
        {children}
      </p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-accent underline underline-offset-2 hover:text-accent-deep transition-colors"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-primary">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,

    // Code
    pre: ({ children }) => <CodeBlock>{children}</CodeBlock>,
    code: ({ children, className }) => {
      if (className) {
        // Inside a fenced code block — CodeBlock wraps the pre, this renders the inner code
        return <code className={`font-mono text-sm ${className}`}>{children}</code>
      }
      // Inline code
      return (
        <code className="bg-surface-subtle border border-border rounded px-1.5 py-0.5 font-mono text-sm">
          {children}
        </code>
      )
    },

    // Block elements
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-border pl-4 italic text-secondary my-6">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="border-border my-10" />,
    ul: ({ children }) => (
      <ul className="ml-6 mb-6 space-y-2 text-primary list-disc">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="ml-6 mb-6 space-y-2 text-primary list-decimal">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="text-base md:text-lg text-primary leading-relaxed">{children}</li>
    ),

    // Tables
    table: ({ children }) => (
      <div className="overflow-x-auto my-6">
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-surface-subtle">{children}</thead>
    ),
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
      <tr className="even:bg-surface-subtle">{children}</tr>
    ),
    th: ({ children }) => (
      <th className="border border-border px-4 py-2 text-left font-semibold text-primary">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-border px-4 py-2 text-primary">{children}</td>
    ),

    // Images — always next/image per CLAUDE.md
    img: ({ src, alt, width, height }) => (
      <figure className="my-8">
        <Image
          src={src ?? ''}
          alt={alt ?? ''}
          width={Number(width) || 800}
          height={Number(height) || 450}
          className="rounded-xl w-full h-auto"
        />
        {alt && (
          <figcaption className="text-sm text-secondary text-center mt-2">
            {alt}
          </figcaption>
        )}
      </figure>
    ),

    // Custom components available inside .mdx files
    Tip,
    Note,
    Warning,
    AdSlot,
    ArticleImage,
    Kbd,
    Steps,
    Step,
    Mermaid,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    FileTree,
    YouTubeEmbed,
    ComparisonTable,
    Quiz,
    Chart,
    Math,
    MathBlock,
    CodePlayground,
    DownloadButton,
  }
}
