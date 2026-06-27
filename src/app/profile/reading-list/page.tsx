import { createClient } from '@/lib/supabase-server'
import { getAllArticles } from '@/lib/mdx'
import { ReadingListClient } from './reading-list-client'

export const metadata = { title: 'Reading List — Seekvana' }

export default async function ReadingListPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: rows } = await supabase
    .from('reading_list')
    .select('id, pillar, article_slug, saved_at, read_at')
    .eq('user_id', user.id)
    .order('saved_at', { ascending: false })

  const allArticles = getAllArticles()
  const articleMap = new Map(
    allArticles.map((a) => [`${a.pillar}/${a.slug}`, a])
  )

  const items = (rows ?? []).map((row) => {
    const meta = articleMap.get(`${row.pillar}/${row.article_slug}`)
    return {
      id: row.id as string,
      pillar: row.pillar as string,
      articleSlug: row.article_slug as string,
      savedAt: row.saved_at as string,
      readAt: row.read_at as string | null,
      title: meta?.frontmatter.title ?? row.article_slug,
      readTime: meta?.frontmatter.readTime ?? 0,
      difficulty: (meta?.frontmatter.difficulty ?? 'beginner') as 'beginner' | 'intermediate' | 'advanced',
    }
  })

  return (
    <div className="min-h-screen bg-canvas py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <ReadingListClient items={items} userId={user.id} />
      </div>
    </div>
  )
}
