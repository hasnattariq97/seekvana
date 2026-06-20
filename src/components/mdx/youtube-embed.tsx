interface YouTubeEmbedProps {
  id: string
  title: string
  caption?: string
}

export function YouTubeEmbed({ id, title, caption }: YouTubeEmbedProps) {
  return (
    <figure className="my-8">
      <div className="relative aspect-video rounded-xl overflow-hidden border border-border bg-surface-subtle">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={title}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-presentation"
          loading="lazy"
          className="absolute inset-0 w-full h-full"
        />
      </div>
      {caption && (
        <figcaption className="text-sm text-secondary text-center mt-2">{caption}</figcaption>
      )}
    </figure>
  )
}
