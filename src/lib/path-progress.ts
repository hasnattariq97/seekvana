export interface ProgressTopic {
  title: string
  articlePillar?: string
  articleSlug?: string
}

export interface ProgressModule {
  id: string
  title: string
  topics: ProgressTopic[]
}

export interface PathProgressResult {
  completedCount: number
  nextLessonHref: string | null
  nextLessonTitle: string | null
  nextLessonModuleTitle: string | null
}

/**
 * Derives per-path progress from a user's read set.
 * Pure — no I/O. `readSet` entries are "<pillar>/<slug>" keys.
 */
export function computePathProgress(
  modules: ProgressModule[],
  readSet: string[]
): PathProgressResult {
  const readSetObj = new Set(readSet)

  const linkableTopics = modules.flatMap((m) =>
    m.topics
      .filter((t) => t.articlePillar && t.articleSlug)
      .map((t) => ({ key: `${t.articlePillar}/${t.articleSlug}`, title: t.title, module: m }))
  )

  const completedCount = linkableTopics.filter((t) => readSetObj.has(t.key)).length

  let nextLessonHref: string | null = null
  let nextLessonTitle: string | null = null
  let nextLessonModuleTitle: string | null = null

  if (readSet.length > 0) {
    const next = linkableTopics.find((t) => !readSetObj.has(t.key))
    if (next) {
      nextLessonHref = `/library/${next.key}`
      nextLessonTitle = next.title
      nextLessonModuleTitle = `Module ${next.module.id} · ${next.module.title}`
    }
  }

  return { completedCount, nextLessonHref, nextLessonTitle, nextLessonModuleTitle }
}
