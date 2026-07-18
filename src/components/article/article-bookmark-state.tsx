import { getSavedStatus } from '@/lib/article-data'
import { BookmarkButton } from './bookmark-button'

export async function ArticleBookmarkState({
  pillar,
  slug,
}: {
  pillar: string
  slug: string
}) {
  const isSaved = await getSavedStatus(pillar, slug)
  return <BookmarkButton pillar={pillar} articleSlug={slug} initialSaved={isSaved} />
}
