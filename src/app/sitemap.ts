import type { MetadataRoute } from "next";
import { getAllArticles, getAllPaths } from "@/lib/mdx";
import { PILLARS } from "@/lib/pillars";

export const revalidate = 3600;

const BASE_URL = "https://seekvana.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const paths = getAllPaths();

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE_URL}/library/${a.pillar}/${a.slug}`,
    lastModified: new Date(a.frontmatter.publishedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const pillarEntries: MetadataRoute.Sitemap = PILLARS.map((p) => ({
    url: `${BASE_URL}/library/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const pathEntries: MetadataRoute.Sitemap = paths.map((p) => ({
    url: `${BASE_URL}/paths/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/library`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/paths`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/tools`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/glossary`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    ...pillarEntries,
    ...pathEntries,
    ...articleEntries,
  ];
}
