import { getAllArticles, getAllPaths } from '@/lib/mdx'
import { SearchModal } from './search-modal'
import type { SearchItem } from '@/lib/search-types'

const GLOSSARY: SearchItem[] = [
  { id: 'glossary-1', type: 'glossary', title: 'LLM', excerpt: 'Large Language Model — a neural network trained on text to predict and generate language.', category: 'Glossary', href: '/glossary/llm' },
  { id: 'glossary-2', type: 'glossary', title: 'RAG', excerpt: 'Retrieval-Augmented Generation — grounding model outputs with retrieved external documents.', category: 'Glossary', href: '/glossary/rag' },
  { id: 'glossary-3', type: 'glossary', title: 'Agent', excerpt: 'An AI system that perceives its environment and takes actions to achieve a goal autonomously.', category: 'Glossary', href: '/glossary/agent' },
  { id: 'glossary-4', type: 'glossary', title: 'Embedding', excerpt: 'A dense numerical vector that represents the semantic meaning of a piece of text.', category: 'Glossary', href: '/glossary/embedding' },
  { id: 'glossary-5', type: 'glossary', title: 'Fine-tuning', excerpt: 'Further training a pre-trained model on a domain-specific dataset to improve task performance.', category: 'Glossary', href: '/glossary/fine-tuning' },
]

export function SearchModalServer() {
  const articles = getAllArticles().map((a, i): SearchItem => ({
    id: `article-${i}`,
    type: 'article',
    title: a.frontmatter.title,
    excerpt: a.frontmatter.description,
    category: a.pillar.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    href: `/library/${a.pillar}/${a.slug}`,
    difficulty: a.frontmatter.difficulty,
  }))

  const paths = getAllPaths().map((p, i): SearchItem => ({
    id: `path-${i}`,
    type: 'path',
    title: p.title,
    excerpt: p.description,
    category: 'Learning Path',
    href: p.href,
    difficulty: p.difficulty,
  }))

  const data: SearchItem[] = [...paths, ...articles, ...GLOSSARY]

  return <SearchModal data={data} />
}
