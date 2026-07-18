import { getCompletedStatus } from '@/lib/article-data'
import { MarkCompleteButton } from './mark-complete-button'

export async function ArticleCompletionState({
  pillar,
  slug,
  articleTitle,
}: {
  pillar: string
  slug: string
  articleTitle: string
}) {
  const isCompleted = await getCompletedStatus(pillar, slug)
  return (
    <MarkCompleteButton
      pillar={pillar}
      articleSlug={slug}
      initialCompleted={isCompleted}
      articleTitle={articleTitle}
    />
  )
}
