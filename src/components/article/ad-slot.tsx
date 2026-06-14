interface AdSlotProps {
  size?: '300x250' | '728x90'
}

export function AdSlot({ size = '300x250' }: AdSlotProps) {
  const isLeaderboard = size === '728x90'
  return (
    <div
      className={`border border-dashed border-border rounded-lg bg-surface-subtle flex items-center justify-center text-secondary text-xs my-6 mx-auto shrink-0 ${
        isLeaderboard
          ? 'h-[90px] w-full max-w-[728px]'
          : 'h-[250px] w-[300px]'
      }`}
      aria-hidden="true"
    >
      Advertisement
    </div>
  )
}
