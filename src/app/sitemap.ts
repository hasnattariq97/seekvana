import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/mdx";

const BASE_URL = "https://seekvana.com";

const PILLAR_SLUGS = [
  "ai-foundations",
  "large-language-models",
  "agentic-ai",
  "building-with-ai",
  "ai-tools",
  "use-cases",
  "concepts-theory",
  "ethics-safety",
  "careers",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE_URL}/library/${a.pillar}/${a.slug}`,
    lastModified: new Date(a.frontmatter.publishedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const pillarEntries: MetadataRoute.Sitemap = PILLAR_SLUGS.map((slug) => ({
    url: `${BASE_URL}/library/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/library`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/paths`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...pillarEntries,
    ...articleEntries,
  ];
}
