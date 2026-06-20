import { Download } from 'lucide-react'

interface DownloadButtonProps {
  href: string
  label: string
  size?: string
}

export function DownloadButton({ href, label, size }: DownloadButtonProps) {
  return (
    <a
      href={href}
      download
      className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-accent text-white font-medium text-sm hover:bg-accent-deep transition-colors my-4"
    >
      <Download className="w-4 h-4 shrink-0" />
      {label}
      {size && <span className="opacity-70 text-xs font-normal">({size})</span>}
    </a>
  )
}
