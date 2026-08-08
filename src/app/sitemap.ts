import type { MetadataRoute } from "next";
import {
  getAllArticles,
  getAllPaths,
  getAllGlossaryTerms,
  getArticlesByPillar,
  getPathBySlug,
  buildLessonArticleMap,
} from "@/lib/mdx";
import { PILLARS } from "@/lib/pillars";

export const revalidate = 3600;

const BASE_URL = "https://seekvana.com";

/**
 * Parse a frontmatter date ("2026-06-20") into a Date, or undefined if absent
 * or malformed. Never falls back to "now" — a wrong lastmod is worse than none.
 */
function parseDate(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/** Newest of the given dates, or undefined if the list is empty. */
function newest(dates: (Date | undefined)[]): Date | undefined {
  const valid = dates.filter((d): d is Date => d !== undefined);
  if (valid.length === 0) return undefined;
  return valid.reduce((a, b) => (b > a ? b : a));
}

/**
 * Spread `lastModified` into an entry only when we have a real date.
 * Google discounts lastmod site-wide once it catches a sitemap claiming
 * changes that didn't happen, so index pages with no derivable content
 * date simply omit the field.
 */
function lastMod(date: Date | undefined) {
  return date ? { lastModified: date } : {};
}

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const paths = getAllPaths();
  const glossaryTerms = getAllGlossaryTerms();

  const articleDates = new Map<string, Date | undefined>(
    articles.map((a) => [
      `${a.pillar}/${a.slug}`,
      parseDate(a.frontmatter.publishedAt),
    ])
  );

  const newestArticle = newest([...articleDates.values()]);
  const newestGlossary = newest(
    glossaryTerms.map((g) => parseDate(g.frontmatter.publishedAt))
  );

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE_URL}/library/${a.pillar}/${a.slug}`,
    ...lastMod(articleDates.get(`${a.pillar}/${a.slug}`)),
    changeFrequency: "monthly",
    priority: 0.8,
    ...(a.frontmatter.coverImage
      ? { images: [`${BASE_URL}${a.frontmatter.coverImage}`] }
      : {}),
  }));

  // Skip pillars with zero published articles — those pages are noindexed
  // (thin content) and shouldn't be listed in the sitemap either.
  // A pillar page's lastmod is the newest article it lists.
  const pillarEntries: MetadataRoute.Sitemap = PILLARS.map((p) => ({
    pillar: p,
    pillarArticles: getArticlesByPillar(p.slug),
  }))
    .filter(({ pillarArticles }) => pillarArticles.length > 0)
    .map(({ pillar, pillarArticles }) => ({
      url: `${BASE_URL}/library/${pillar.slug}`,
      ...lastMod(
        newest(pillarArticles.map((a) => parseDate(a.frontmatter.publishedAt)))
      ),
      changeFrequency: "weekly",
      priority: 0.6,
    }));

  // A path's lastmod is the newest lesson article it links to. Most path
  // topics resolve to an article by lesson number (topic id -> frontmatter
  // lessonNumber); a few carry an explicit pillar/slug pair instead.
  const lessonArticles = buildLessonArticleMap();

  const pathEntries: MetadataRoute.Sitemap = paths.map((p) => {
    const data = getPathBySlug(p.slug);
    const lessonDates = (data?.modules ?? []).flatMap((m) =>
      m.topics.map((t) => {
        if (t.articlePillar && t.articleSlug) {
          return articleDates.get(`${t.articlePillar}/${t.articleSlug}`);
        }
        const lesson = lessonArticles[t.id];
        return lesson
          ? articleDates.get(`${lesson.pillar}/${lesson.slug}`)
          : undefined;
      })
    );
    return {
      url: `${BASE_URL}/paths/${p.slug}`,
      ...lastMod(newest(lessonDates)),
      changeFrequency: "monthly",
      priority: 0.7,
    };
  });

  const glossaryEntries: MetadataRoute.Sitemap = glossaryTerms.map((g) => ({
    url: `${BASE_URL}/glossary/${g.slug}`,
    ...lastMod(parseDate(g.frontmatter.publishedAt)),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  // Index pages inherit the newest date of the content they surface.
  // /tools and the legal pages have no content-derived date, so they omit
  // lastmod rather than claiming a build-time change.
  return [
    {
      url: BASE_URL,
      ...lastMod(newestArticle),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/library`,
      ...lastMod(newestArticle),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/paths`,
      ...lastMod(newest(pathEntries.map((e) => e.lastModified as Date | undefined))),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: `${BASE_URL}/tools`, changeFrequency: "monthly", priority: 0.5 },
    {
      url: `${BASE_URL}/glossary`,
      ...lastMod(newestGlossary),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    { url: `${BASE_URL}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/cookies`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/contact`, changeFrequency: "yearly", priority: 0.3 },
    ...pillarEntries,
    ...pathEntries,
    ...articleEntries,
    ...glossaryEntries,
  ];
}
