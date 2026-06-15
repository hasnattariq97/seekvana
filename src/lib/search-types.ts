export interface SearchItem {
  id: string
  type: 'article' | 'path' | 'glossary'
  title: string
  excerpt: string
  category: string
  href: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
}

export interface SearchResults {
  paths: SearchItem[]
  articles: SearchItem[]
  glossary: SearchItem[]
}
