import { describe, it, expect } from 'vitest'
import { computePathProgress, type ProgressModule } from './path-progress'

const mods: ProgressModule[] = [
  {
    id: '01',
    title: 'Basics',
    topics: [
      { title: 'Intro', articlePillar: 'ai-foundations', articleSlug: 'what-is-ai' },
      { title: 'Agents', articlePillar: 'agentic-ai', articleSlug: 'what-is-an-agent' },
    ],
  },
  {
    id: '02',
    title: 'Deeper',
    topics: [
      { title: 'No link' }, // non-linkable topic — ignored
      { title: 'Tool use', articlePillar: 'agentic-ai', articleSlug: 'tool-use-explained' },
    ],
  },
]

describe('computePathProgress', () => {
  it('returns zeroed progress for an empty read set', () => {
    const p = computePathProgress(mods, [])
    expect(p.completedCount).toBe(0)
    expect(p.nextLessonHref).toBeNull()
    expect(p.nextLessonTitle).toBeNull()
    expect(p.nextLessonModuleTitle).toBeNull()
  })

  it('counts only linkable topics whose key is in the read set', () => {
    const p = computePathProgress(mods, ['ai-foundations/what-is-ai'])
    expect(p.completedCount).toBe(1)
  })

  it('points next lesson at the first unread linkable topic', () => {
    const p = computePathProgress(mods, ['ai-foundations/what-is-ai'])
    expect(p.nextLessonHref).toBe('/library/agentic-ai/what-is-an-agent')
    expect(p.nextLessonTitle).toBe('Agents')
    expect(p.nextLessonModuleTitle).toBe('Module 01 · Basics')
  })

  it('leaves nextLesson null when all linkable topics are read', () => {
    const all = [
      'ai-foundations/what-is-ai',
      'agentic-ai/what-is-an-agent',
      'agentic-ai/tool-use-explained',
    ]
    const p = computePathProgress(mods, all)
    expect(p.completedCount).toBe(3)
    expect(p.nextLessonHref).toBeNull()
  })
})
