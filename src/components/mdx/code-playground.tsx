// src/components/mdx/code-playground.tsx
'use client'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'

const Sandpack = dynamic(
  () => import('@codesandbox/sandpack-react').then((m) => m.Sandpack),
  { ssr: false, loading: () => (
    <div className="my-8 bg-surface-subtle border border-border rounded-xl p-8 text-center text-secondary text-sm">
      Loading playground…
    </div>
  )}
)

interface CodePlaygroundProps {
  filename: string
  code: string
  title?: string
}

export function CodePlayground({ filename, code, title }: CodePlaygroundProps) {
  const { resolvedTheme } = useTheme()
  const files = { [`/${filename}`]: code.replace(/\\n/g, '\n') }

  return (
    <div className="my-8">
      {title && (
        <p className="text-sm font-medium text-secondary mb-2">{title}</p>
      )}
      <Sandpack
        files={files}
        template="vanilla"
        theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        options={{
          showLineNumbers: true,
          showConsole: true,
          editorHeight: 320,
        }}
      />
    </div>
  )
}
