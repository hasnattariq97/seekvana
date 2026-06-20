// src/components/mdx/steps.tsx
interface StepsProps {
  children: React.ReactNode
}

interface StepProps {
  number: number
  title: string
  children: React.ReactNode
}

export function Steps({ children }: StepsProps) {
  return <div className="my-8 space-y-0">{children}</div>
}

export function Step({ number, title, children }: StepProps) {
  return (
    <div className="flex gap-5 pb-8 last:pb-0 group">
      <div className="shrink-0 w-8 h-8 rounded-full bg-accent text-white text-sm font-bold flex items-center justify-center mt-0.5">
        {number}
      </div>
      <div className="flex-1 border-b border-border pb-8 group-last:border-0 group-last:pb-0">
        <p className="font-fraunces text-lg font-medium text-primary mb-2">{title}</p>
        <div className="text-primary">{children}</div>
      </div>
    </div>
  )
}
