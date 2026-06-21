export interface PillarMeta {
  slug: string
  name: string
  description: string
}

export const PILLARS: PillarMeta[] = [
  {
    slug: 'agentic-ai',
    name: 'Agentic AI',
    description: 'Agents, tool use, memory, planning, and multi-agent systems — the flagship pillar.',
  },
  {
    slug: 'ai-foundations',
    name: 'AI Foundations',
    description: "What AI is, how it works, and why it matters. Start here if you're new.",
  },
  {
    slug: 'large-language-models',
    name: 'Large Language Models',
    description: 'Tokens, context windows, RAG, fine-tuning, and how LLMs actually think.',
  },
  {
    slug: 'building-with-ai',
    name: 'Building with AI',
    description: 'APIs, SDKs, evals, deployment, and cost management for builders.',
  },
  {
    slug: 'ai-tools',
    name: 'AI Tools',
    description: 'Reviews and comparisons of the best AI tools and platforms.',
  },
  {
    slug: 'ai-in-practice',
    name: 'AI in Practice',
    description: 'Real workflows for writing, research, coding, and automation — no deep technical knowledge required.',
  },
  {
    slug: 'prompt-engineering',
    name: 'Prompt Engineering',
    description: 'Write prompts that get results. Techniques, patterns, and frameworks that actually work.',
  },
  {
    slug: 'ethics-safety',
    name: 'Ethics & Safety',
    description: 'Responsible AI, alignment, risks, and governance.',
  },
  {
    slug: 'careers',
    name: 'Careers',
    description: 'How to learn AI, career paths, roles, and building your portfolio.',
  },
]

export const PILLAR_MAP: Record<string, PillarMeta> = Object.fromEntries(
  PILLARS.map((p) => [p.slug, p])
)

export function getPillarName(slug: string): string {
  return PILLAR_MAP[slug]?.name ?? slug
}
