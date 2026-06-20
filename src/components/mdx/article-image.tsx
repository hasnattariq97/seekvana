// src/components/mdx/article-image.tsx
import Image from 'next/image'

interface ArticleImageProps {
  src: string
  alt: string
  caption?: string
  priority?: boolean
  isCover?: boolean
}

export function ArticleImage({ src, alt, caption, priority, isCover }: ArticleImageProps) {
  return (
    <figure className={isCover ? 'my-0 mb-10' : 'my-8'}>
      <Image
        src={src}
        alt={alt}
        width={isCover ? 1200 : 800}
        height={isCover ? 630 : 450}
        className="rounded-xl w-full h-auto"
        priority={priority}
      />
      {caption && (
        <figcaption className="text-sm text-secondary text-center mt-2">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
