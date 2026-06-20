import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPathBySlug, generatePathStaticParams } from '@/lib/mdx'
import { PathHero } from '@/components/paths/path-hero'
import { ModuleList } from '@/components/paths/module-list'
import { PathSidebar } from '@/components/paths/path-sidebar'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return generatePathStaticParams()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const path = getPathBySlug(slug)
  if (!path) return {}
  return {
    title: `${path.title} — Seekvana`,
    description: path.description,
  }
}

export default async function PathPage({ params }: Props) {
  const { slug } = await params
  const path = getPathBySlug(slug)
  if (!path) notFound()

  const totalTopics = path.modules.reduce((n, m) => n + m.topics.length, 0)

  return (
    <div className="max-w-[1080px] mx-auto px-7">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 pt-7 pb-0 text-[12.5px] text-secondary" aria-label="Breadcrumb">
        <Link href="/paths" className="hover:text-accent transition-colors duration-150">
          Paths
        </Link>
        <span className="text-border">›</span>
        <span className="text-primary font-medium">{path.title}</span>
      </nav>

      {/* Hero */}
      <PathHero path={path} />

      {/* Two-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_276px] gap-14 pb-24">
        <ModuleList modules={path.modules} totalTopics={totalTopics} />
        <PathSidebar path={path} />
      </div>
    </div>
  )
}
