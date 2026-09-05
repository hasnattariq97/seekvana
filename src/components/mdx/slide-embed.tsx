'use client'

import { useState } from 'react'
import { Presentation } from 'lucide-react'

interface SlideEmbedProps {
  src: string
  title: string
  caption?: string
}

export function SlideEmbed({ src, title, caption }: SlideEmbedProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <figure className="my-8">
      <div className="relative w-full rounded-xl overflow-hidden border border-border bg-surface-subtle" style={{ aspectRatio: '4 / 3', maxHeight: 500 }}>
        {loaded ? (
          <iframe
            src={src}
            title={title}
            frameBorder="0"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setLoaded(true)}
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-secondary hover:text-accent transition-colors"
          >
            <Presentation className="w-10 h-10" />
            <span className="text-sm font-medium">Load slide deck</span>
            <span className="text-xs">Hosted on SlideShare, click to load (sets third-party cookies)</span>
          </button>
        )}
      </div>
      {caption && (
        <figcaption className="text-sm text-secondary text-center mt-2">{caption}</figcaption>
      )}
    </figure>
  )
}
