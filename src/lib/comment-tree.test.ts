import { describe, it, expect } from 'vitest'
import { buildCommentTree } from './comment-tree'
import type { Comment } from '@/types/comments'

function row(overrides: Partial<Comment>): Comment {
  return {
    id: 'x',
    article_id: 'agentic-ai/what-is-an-agent',
    parent_id: null,
    name: 'Ada',
    body: 'body text here',
    is_flagged: false,
    created_at: '2026-07-18T00:00:00.000Z',
    ...overrides,
  }
}

describe('buildCommentTree', () => {
  it('returns [] for no rows', () => {
    expect(buildCommentTree([])).toEqual([])
  })

  it('keeps only top-level comments at the root', () => {
    const rows = [row({ id: 'a', parent_id: null }), row({ id: 'b', parent_id: 'a' })]
    const tree = buildCommentTree(rows)
    expect(tree).toHaveLength(1)
    expect(tree[0].id).toBe('a')
  })

  it('nests replies under their parent', () => {
    const rows = [
      row({ id: 'a', parent_id: null }),
      row({ id: 'r1', parent_id: 'a' }),
      row({ id: 'r2', parent_id: 'a' }),
    ]
    const tree = buildCommentTree(rows)
    expect(tree[0].replies.map((r) => r.id)).toEqual(['r1', 'r2'])
  })

  it('does not attach orphan replies (unknown parent) to the root', () => {
    const rows = [row({ id: 'a', parent_id: null }), row({ id: 'r1', parent_id: 'ghost' })]
    const tree = buildCommentTree(rows)
    expect(tree).toHaveLength(1)
    expect(tree[0].replies).toEqual([])
  })
})
