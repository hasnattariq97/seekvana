import { getArticleComments } from '@/lib/article-data'
import { ArticleComments } from './article-comments'

export async function ArticleCommentsSection({ articleId }: { articleId: string }) {
  const comments = await getArticleComments(articleId)
  return <ArticleComments articleId={articleId} initialComments={comments} />
}
