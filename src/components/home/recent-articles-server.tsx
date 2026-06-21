import { getAllArticles } from '@/lib/mdx'
import { RecentArticles } from './recent-articles'

export function RecentArticlesServer() {
  const articles = getAllArticles()
    .sort((a, b) =>
      new Date(b.frontmatter.publishedAt).getTime() -
      new Date(a.frontmatter.publishedAt).getTime()
    )
    .slice(0, 6)
  return <RecentArticles articles={articles} />
}
