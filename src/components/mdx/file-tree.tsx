import { Children, isValidElement } from 'react'
import type { ReactNode } from 'react'

interface FileTreeProps {
  children: ReactNode
}

function extractText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (isValidElement(node)) return extractText((node.props as { children?: ReactNode }).children)
  return ''
}

export function FileTree({ children }: FileTreeProps) {
  const text = extractText(children).trim()

  return (
    <div className="my-8 bg-surface-subtle border border-border rounded-xl overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border bg-surface">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-amber-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
        <span className="ml-2 text-xs text-secondary font-mono">File tree</span>
      </div>
      <pre className="p-4 font-mono text-sm text-primary overflow-x-auto leading-relaxed m-0">
        <code>{text}</code>
      </pre>
    </div>
  )
}
