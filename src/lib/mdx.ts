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
  coverImage?: string
  lessonModule?: string
  lessonNumber?: string
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

export interface ArticleMeta {
  frontmatter: ArticleFrontmatter
  pillar: string
  slug: string
}

export function getAllArticles(): ArticleMeta[] {
  const articlesDir = path.join(process.cwd(), 'src', 'content', 'articles')

  if (!fs.existsSync(articlesDir)) return []

  const pillars = fs
    .readdirSync(articlesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)

  const articles: ArticleMeta[] = []

  for (const pillar of pillars) {
    const pillarDir = path.join(articlesDir, pillar)
    const files = fs
      .readdirSync(pillarDir)
      .filter((f) => f.endsWith('.mdx'))

    for (const file of files) {
      const slug = file.replace(/\.mdx$/, '')
      const filePath = path.join(pillarDir, file)
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data } = matter(raw)
      articles.push({ frontmatter: data as ArticleFrontmatter, pillar, slug })
    }
  }

  return articles
}

export function getArticlesByPillar(pillar: string): ArticleMeta[] {
  return getAllArticles().filter((a) => a.pillar === pillar)
}

export function getFeaturedArticles(): ArticleMeta[] {
  return getAllArticles().filter((a) => a.frontmatter.featured)
}

export interface PathDefinition {
  slug: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  lessonCount: number
  href: string
  colorClass: string
}

export function getAllPaths(): PathDefinition[] {
  const pathsDir = path.join(process.cwd(), 'src', 'content', 'paths')
  if (!fs.existsSync(pathsDir)) return []
  return fs
    .readdirSync(pathsDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(pathsDir, f), 'utf-8')
      return JSON.parse(raw) as PathDefinition
    })
}
