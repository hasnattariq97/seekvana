import fs from 'fs'
import path from 'path'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ReadingListItem = {
  id: string
  pillar: string
  articleSlug: string
  savedAt: string
  readAt: string | null
}

export type ArticleRead = {
  pillar: string
  articleSlug: string
  readAt: string
}

export type UserProfile = {
  displayName: string | null
  isPublic: boolean
  createdAt: string
}

export type Badge = {
  id: string
  emoji: string
  name: string
  description: string
  earned: boolean
  hint: string | null
}

export type LessonStatus = {
  id: string
  title: string
  pillar?: string
  slug?: string
  completed: boolean
  isNext: boolean
}

export type PathProgress = {
  pathSlug: string
  title: string
  colorClass: string
  totalLessons: number
  completedLessons: number
  nextLesson: { pillar: string; slug: string; title: string } | null
  lessons: LessonStatus[]
  status: 'not-started' | 'in-progress' | 'completed'
}

// ─── Streak ───────────────────────────────────────────────────────────────────

export function calculateStreak(reads: ArticleRead[]): number {
  if (reads.length === 0) return 0

  const days = new Set(
    reads.map((r) => r.readAt.split('T')[0])
  )

  const toDateStr = (d: Date) => d.toISOString().split('T')[0]
  const today = toDateStr(new Date())
  const yesterday = toDateStr(new Date(Date.now() - 86_400_000))

  // Streak is only alive if user read today or yesterday
  if (!days.has(today) && !days.has(yesterday)) return 0

  let streak = 0
  let cursor = days.has(today)
    ? new Date()
    : new Date(Date.now() - 86_400_000)

  while (days.has(toDateStr(cursor))) {
    streak++
    cursor = new Date(cursor.getTime() - 86_400_000)
  }

  return streak
}

// ─── Badges ───────────────────────────────────────────────────────────────────

export function calculateBadges(
  streak: number,
  reads: ArticleRead[],
  completedPathSlugs: string[]
): Badge[] {
  const pillarCounts: Record<string, number> = {}
  for (const r of reads) {
    pillarCounts[r.pillar] = (pillarCounts[r.pillar] ?? 0) + 1
  }

  const agenticCount = pillarCounts['agentic-ai'] ?? 0
  const llmCount = pillarCounts['large-language-models'] ?? 0

  return [
    {
      id: '7-day-streak',
      emoji: '🔥',
      name: '7-Day Streak',
      description: 'Read for 7 consecutive days',
      earned: streak >= 7,
      hint: streak < 7 ? `${7 - streak} days to go` : null,
    },
    {
      id: '30-day-streak',
      emoji: '⚡',
      name: '30-Day Streak',
      description: 'Read for 30 consecutive days',
      earned: streak >= 30,
      hint: streak < 30 ? `${30 - streak} days to go` : null,
    },
    {
      id: 'agentic-explorer',
      emoji: '🤖',
      name: 'Agent Explorer',
      description: 'Read 10 Agentic AI articles',
      earned: agenticCount >= 10,
      hint: agenticCount < 10 ? `${10 - agenticCount} more articles` : null,
    },
    {
      id: 'llm-deep-dive',
      emoji: '🧠',
      name: 'LLM Deep Dive',
      description: 'Read 10 LLM articles',
      earned: llmCount >= 10,
      hint: llmCount < 10 ? `${10 - llmCount} more articles` : null,
    },
    {
      id: 'path-complete',
      emoji: '🎓',
      name: 'Path Complete',
      description: 'Finish any learning path',
      earned: completedPathSlugs.length > 0,
      hint: completedPathSlugs.length === 0 ? 'Complete any path' : null,
    },
    {
      id: 'master-agentic',
      emoji: '🏆',
      name: 'Master Agentic',
      description: 'Complete Master Agentic AI path',
      earned: completedPathSlugs.includes('master-agentic-ai'),
      hint: !completedPathSlugs.includes('master-agentic-ai') ? 'Complete the path' : null,
    },
  ]
}

// ─── Path progress ────────────────────────────────────────────────────────────

type PathJson = {
  slug: string
  title: string
  colorClass: string
  modules: Array<{
    id: string
    title: string
    topics: Array<{
      id: string
      title: string
      articlePillar?: string
      articleSlug?: string
    }>
  }>
}

function loadAllPaths(): PathJson[] {
  const dir = path.join(process.cwd(), 'src', 'content', 'paths')
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as PathJson)
}

export function calculatePathProgress(reads: ArticleRead[]): PathProgress[] {
  const paths = loadAllPaths()
  const readSet = new Set(reads.map((r) => `${r.pillar}/${r.articleSlug}`))

  return paths.map((p) => {
    const allTopics = p.modules.flatMap((m) => m.topics)
    const linkableTopics = allTopics.filter((t) => t.articlePillar && t.articleSlug)
    const totalLessons = allTopics.length

    let completedLessons = 0
    let foundNext = false

    const lessons: LessonStatus[] = linkableTopics.map((t) => {
      const key = `${t.articlePillar}/${t.articleSlug}`
      const completed = readSet.has(key)
      if (completed) completedLessons++

      const isNext = !completed && !foundNext && completedLessons > 0
      if (isNext) foundNext = true

      return {
        id: t.id,
        title: t.title,
        pillar: t.articlePillar,
        slug: t.articleSlug,
        completed,
        isNext,
      }
    })

    // If no progress yet, first lesson is "next"
    if (completedLessons === 0 && lessons.length > 0) {
      lessons[0] = { ...lessons[0], isNext: false }
    }

    const nextLesson = lessons.find((l) => l.isNext && l.pillar && l.slug)
    const firstLesson = lessons[0]

    const status =
      totalLessons === 0
        ? 'not-started'
        : completedLessons === 0
        ? 'not-started'
        : completedLessons >= totalLessons
        ? 'completed'
        : 'in-progress'

    return {
      pathSlug: p.slug,
      title: p.title,
      colorClass: p.colorClass,
      totalLessons,
      completedLessons,
      nextLesson:
        nextLesson?.pillar && nextLesson?.slug
          ? { pillar: nextLesson.pillar, slug: nextLesson.slug, title: nextLesson.title }
          : firstLesson?.pillar && firstLesson?.slug
          ? { pillar: firstLesson.pillar, slug: firstLesson.slug, title: firstLesson.title }
          : null,
      lessons,
      status,
    }
  })
}
