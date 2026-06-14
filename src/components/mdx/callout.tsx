import { Lightbulb, Info, AlertTriangle } from 'lucide-react'

type CalloutVariant = 'tip' | 'note' | 'warning'

interface CalloutProps {
  variant: CalloutVariant
  children: React.ReactNode
}

const CONFIG = {
  tip: {
    Icon: Lightbulb,
    wrapper: 'bg-accent-soft border-accent',
    icon: 'text-accent',
  },
  note: {
    Icon: Info,
    wrapper: 'bg-info/10 border-info',
    icon: 'text-info',
  },
  warning: {
    Icon: AlertTriangle,
    wrapper: 'bg-amber-50 dark:bg-amber-950/30 border-amber-500',
    icon: 'text-amber-600 dark:text-amber-400',
  },
}

function Callout({ variant, children }: CalloutProps) {
  const { Icon, wrapper, icon } = CONFIG[variant]
  return (
    <div className={`border-l-4 rounded-r-lg p-4 my-6 flex gap-3 ${wrapper}`}>
      <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${icon}`} aria-hidden="true" />
      <div className="text-sm text-primary leading-relaxed">{children}</div>
    </div>
  )
}

export function Tip({ children }: { children: React.ReactNode }) {
  return <Callout variant="tip">{children}</Callout>
}

export function Note({ children }: { children: React.ReactNode }) {
  return <Callout variant="note">{children}</Callout>
}

export function Warning({ children }: { children: React.ReactNode }) {
  return <Callout variant="warning">{children}</Callout>
}
