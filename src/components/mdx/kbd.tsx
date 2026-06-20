// src/components/mdx/kbd.tsx
interface KbdProps {
  children: React.ReactNode
}

export function Kbd({ children }: KbdProps) {
  return (
    <kbd className="inline-flex items-center px-1.5 py-0.5 rounded border border-border bg-surface-subtle font-mono text-xs text-primary shadow-sm">
      {children}
    </kbd>
  )
}
