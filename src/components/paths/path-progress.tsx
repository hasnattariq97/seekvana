import { getUserReadSet } from '@/lib/article-data'
import { computePathProgress } from '@/lib/path-progress'
import { ModuleList } from './module-list'
import { PathSidebar } from './path-sidebar'
import type { PathData } from '@/lib/mdx'

interface PathProgressProps {
  path: PathData
  enrichedModules: PathData['modules']
  totalTopics: number
  firstLessonHref: string | null
}

export async function PathProgress({
  path,
  enrichedModules,
  totalTopics,
  firstLessonHref,
}: PathProgressProps) {
  const readSet = await getUserReadSet()
  const { completedCount, nextLessonHref, nextLessonTitle, nextLessonModuleTitle } =
    computePathProgress(enrichedModules, readSet)

  return (
    <>
      <ModuleList
        modules={enrichedModules}
        totalTopics={totalTopics}
        readSet={readSet}
        curriculumHint={path.curriculumHint}
        topicFooterLabel={path.topicFooterLabel}
      />
      <PathSidebar
        path={path}
        completedCount={completedCount}
        continueHref={nextLessonHref ?? firstLessonHref ?? '#modules'}
        nextLessonTitle={nextLessonTitle}
        nextLessonModuleTitle={nextLessonModuleTitle}
      />
    </>
  )
}
