import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { getPathBySlug, generatePathStaticParams, buildLessonArticleMap } from '@/lib/mdx'
import { PathHero } from '@/components/paths/path-hero'
import { ModuleList } from '@/components/paths/module-list'
import { PathSidebar } from '@/components/paths/path-sidebar'
import { PathProgress } from '@/components/paths/path-progress'

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
    title: { absolute: `${path.title} — Seekvana` },
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
        {/*
          Fallback re-renders the real ModuleList/PathSidebar at zero progress rather than a
          skeleton mock (unlike the article page's dedicated skeletons) — these components have
          real layout (progress ring, per-topic checkmarks) that's cheaper to keep in sync by
          reusing the components than by hand-mocking their shape. Keep these props in sync with
          PathProgress's resolved render below.
        */}
        <Suspense
          fallback={
            <>
              <ModuleList
                modules={enrichedModules}
                totalTopics={totalTopics}
                readSet={[]}
                curriculumHint={path.curriculumHint}
                topicFooterLabel={path.topicFooterLabel}
              />
              <PathSidebar
                path={path}
                completedCount={0}
                continueHref={firstLessonHref ?? '#modules'}
                nextLessonTitle={null}
                nextLessonModuleTitle={null}
              />
            </>
          }
        >
          <PathProgress
            path={path}
            enrichedModules={enrichedModules}
            totalTopics={totalTopics}
            firstLessonHref={firstLessonHref}
          />
        </Suspense>
      </div>
    </div>
  )
}
