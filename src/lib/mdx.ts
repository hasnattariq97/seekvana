import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface ArticleFrontmatter {
  title: string
  description: string
  pillar: string
  slug: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  readTime: number
  author: string
  publishedAt: string
  tags: string[]
  featured: boolean
}

export interface ArticleHeading {
  id: string
  text: string
  level: 2 | 3
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function extractHeadings(content: string): ArticleHeading[] {
  const regex = /^(#{2,3})\s+(.+)$/gm
  const headings: ArticleHeading[] = []
  let match
  while ((match = regex.exec(content)) !== null) {
    const level = match[1].length as 2 | 3
    const text = match[2].trim()
    headings.push({ id: slugify(text), text, level })
  }
  return headings
}

export function getArticleSource(pillar: string, slug: string): {
  source: string
  frontmatter: ArticleFrontmatter
  headings: ArticleHeading[]
} {
  const filePath = path.join(
    process.cwd(),
    'src',
    'content',
    'articles',
    pillar,
    `${slug}.mdx`
  )
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return {
    source: content,
    frontmatter: data as ArticleFrontmatter,
    headings: extractHeadings(content),
  }
}
