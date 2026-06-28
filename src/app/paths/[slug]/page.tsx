import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPathBySlug, generatePathStaticParams, buildLessonArticleMap } from '@/lib/mdx'
import { PathHero } from '@/components/paths/path-hero'
import { ModuleList } from '@/components/paths/module-list'
import { PathSidebar } from '@/components/paths/path-sidebar'
import { createClient } from '@/lib/supabase-server'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return generatePathStaticParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const path = getPathBySlug(slug)
  if (!path) return {}
  return {
    title: `${path.title} — Seekvana`,
    description: path.description,
  }
}

export default async function PathPage({ params }: Props) {
  const { slug } = await params
  const path = getPathBySlug(slug)
  if (!path || !path.modules) notFound()

  const lessonMap = buildLessonArticleMap()

  const enrichedModules = path.modules.map((module) => ({
    ...module,
    topics: module.topics.map((topic) => {
      const match = lessonMap[topic.id]
      if (!match) return topic
      return {
        ...topic,
        title: match.title,
        articlePillar: match.pillar,
        articleSlug: match.slug,
      }
    }),
  }))

  const totalTopics = path.modules.reduce((n, m) => n + m.topics.length, 0)

  // Fetch user reads for progress display
  let readSet: string[] = []
  let nextLessonHref: string | null = null

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: reads } = await supabase
        .from('article_reads')
        .select('pillar, article_slug')
        .eq('user_id', user.id)
      if (reads) {
        readSet = reads.map((r: { pillar: string; article_slug: string }) => `${r.pillar}/${r.article_slug}`)
      }
    }
  } catch {
    // unauthenticated or error — readSet stays empty
  }

  // Find next unread lesson across all enriched modules
  let nextLessonTitle: string | null = null
  let nextLessonModuleTitle: string | null = null
  if (readSet.length > 0) {
    const readSetObj = new Set(readSet)
    outer: for (const mod of enrichedModules) {
      for (const topic of mod.topics) {
        if (topic.articlePillar && topic.articleSlug) {
          const key = `${topic.articlePillar}/${topic.articleSlug}`
          if (!readSetObj.has(key)) {
            nextLessonHref = `/library/${topic.articlePillar}/${topic.articleSlug}`
            nextLessonTitle = topic.title
            nextLessonModuleTitle = `Module ${mod.id} · ${mod.title}`
            break outer
          }
        }
      }
    }
  }

  // First linkable topic for "Start" button
  let firstLessonHref: string | null = null
  for (const mod of enrichedModules) {
    for (const topic of mod.topics) {
      if (topic.articlePillar && topic.articleSlug) {
        firstLessonHref = `/library/${topic.articlePillar}/${topic.articleSlug}`
        break
      }
    }
    if (firstLessonHref) break
  }

  const completedCount = readSet.length > 0
    ? enrichedModules.flatMap(m => m.topics).filter(
        t => t.articlePillar && t.articleSlug && readSet.includes(`${t.articlePillar}/${t.articleSlug}`)
      ).length
    : 0

  return (
    <div className="max-w-[1080px] mx-auto px-7">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 pt-7 pb-0 text-[12.5px] text-secondary" aria-label="Breadcrumb">
        <Link href="/paths" className="hover:text-accent transition-colors duration-150">
          Paths
        </Link>
        <span className="text-border">›</span>
        <span className="text-primary font-medium">{path.title}</span>
      </nav>

      {/* Hero */}
      <PathHero path={path} />

      {/* Two-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_276px] gap-14 pb-24">
        <ModuleList modules={enrichedModules} totalTopics={totalTopics} readSet={readSet} />
        <PathSidebar
          path={path}
          completedCount={completedCount}
          continueHref={nextLessonHref ?? firstLessonHref ?? '#modules'}
          nextLessonTitle={nextLessonTitle}
          nextLessonModuleTitle={nextLessonModuleTitle}
        />
      </div>
    </div>
  )
}
