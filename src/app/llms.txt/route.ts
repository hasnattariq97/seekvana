import { cacheLife } from 'next/cache'
import { getAllPaths, getArticlesByPillar } from '@/lib/mdx'
import { PILLARS } from '@/lib/pillars'

const BASE = 'https://seekvana.com'

// /llms.txt — an llmstxt.org-format map of the site for AI assistants.
// Generated from the same content source as the sitemap so it never goes
// stale: publish an article and it appears here automatically. Cached
// ('use cache') since the corpus only changes on publish — pure MDX reads,
// no cookies/request state.
async function buildLlmsTxt(): Promise<string> {
  'use cache'
  cacheLife('hours')

  const lines: string[] = []

  lines.push('# Seekvana')
  lines.push('')
  lines.push(
    '> Free AI learning site teaching Agentic AI and all things AI — clear, well-sourced guides for everyone from complete beginners to advanced builders.',
  )
  lines.push('')
  lines.push(
    'Seekvana publishes structured learning paths and a searchable library of articles across nine AI topic areas. All content is free and beginner-friendly while going deep enough for engineers.',
  )
  lines.push('')

  const paths = getAllPaths()
  if (paths.length > 0) {
    lines.push('## Learning Paths')
    lines.push('')
    for (const p of paths) {
      lines.push(`- [${p.title}](${BASE}/paths/${p.slug}): ${p.description}`)
    }
    lines.push('')
  }

  lines.push('## Library')
  lines.push('')
  for (const pillar of PILLARS) {
    const articles = getArticlesByPillar(pillar.slug)
    if (articles.length === 0) continue // skip empty pillars (noindexed)
    lines.push(`### ${pillar.name}`)
    lines.push(`[${pillar.name} overview](${BASE}/library/${pillar.slug})`)
    lines.push('')
    for (const a of articles) {
      lines.push(
        `- [${a.frontmatter.title}](${BASE}/library/${pillar.slug}/${a.slug}): ${a.frontmatter.description}`,
      )
    }
    lines.push('')
  }

  lines.push('## Key Pages')
  lines.push('')
  lines.push(`- [Library](${BASE}/library): Browse all nine AI topic areas`)
  lines.push(`- [Learning Paths](${BASE}/paths): Structured beginner-to-advanced journeys`)
  lines.push(`- [Glossary](${BASE}/glossary): Plain-English definitions of AI terms`)
  lines.push(`- [Tools](${BASE}/tools): Reviews and comparisons of AI tools`)
  lines.push(`- [Search](${BASE}/search): Search articles, paths, and glossary`)
  lines.push(`- [About](${BASE}/about): What Seekvana is and who it's for`)
  lines.push('')

  return lines.join('\n')
}

export async function GET() {
  const body = await buildLlmsTxt()
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
