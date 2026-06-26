"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import type { ArticleMeta } from "@/lib/mdx";

interface RecentArticlesProps {
  articles: ArticleMeta[];
}

type Difficulty = "beginner" | "intermediate" | "advanced";

const DIFFICULTY_BADGE: Record<Difficulty, string> = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  intermediate: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

const CARD_BG = ["bg-accent-soft", "bg-info/20", "bg-surface-subtle"] as const;

const TABS = ["All", "Beginner", "Intermediate", "Advanced"] as const;

function ArticleGrid({ articles }: { articles: ArticleMeta[] }) {
  const shouldReduceMotion = useReducedMotion() ?? false;

  if (articles.length === 0) {
    return (
      <p className="text-secondary text-sm py-12 text-center">
        No articles yet in this category — check back soon.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {articles.map((article, i) => (
        <motion.article
          key={`${article.pillar}/${article.slug}`}
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.3,
            ease: "easeOut",
            delay: shouldReduceMotion ? 0 : (i % 3) * 0.08,
          }}
          whileHover={shouldReduceMotion ? undefined : { y: -2 }}
          className="bg-surface rounded-xl border border-border overflow-hidden hover:shadow-md transition-all group"
        >
          <Link href={`/library/${article.pillar}/${article.slug}`} className="block focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none">
            <div className="relative h-48 bg-surface-subtle overflow-hidden">
              <Image
                src={`/images/articles/${article.pillar}/${article.slug}/cover.webp`}
                alt={article.frontmatter.title}
                fill
                className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <span className="absolute bottom-3 left-3 bg-accent-soft text-accent text-xs rounded-full px-2.5 py-0.5 font-medium backdrop-blur-sm capitalize">
                {article.pillar.replace(/-/g, ' ')}
              </span>
            </div>
            <div className="p-5">
              <span
                className={`inline-block text-xs rounded-full px-2.5 py-0.5 font-medium capitalize ${
                  DIFFICULTY_BADGE[article.frontmatter.difficulty as Difficulty] ?? DIFFICULTY_BADGE.beginner
                }`}
              >
                {article.frontmatter.difficulty}
              </span>
              <h3 className="font-fraunces text-lg text-primary mt-2 leading-snug group-hover:text-accent transition-colors">
                {article.frontmatter.title}
              </h3>
              <p className="font-inter text-sm text-secondary mt-1 line-clamp-2">
                {article.frontmatter.description}
              </p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-secondary">{article.frontmatter.readTime} min read</span>
                  <span className="text-secondary text-xs">·</span>
                  <span className="text-xs text-secondary">{article.frontmatter.author}</span>
                </div>
                <span className="text-xs font-medium text-accent group-hover:underline">
                  Read article →
                </span>
              </div>
            </div>
          </Link>
        </motion.article>
      ))}
    </div>
  );
}

export function RecentArticles({ articles }: RecentArticlesProps) {
  return (
    <section className="bg-canvas py-16 px-4">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="font-fraunces text-2xl text-primary">
          Fresh from the library
        </h2>
        <p className="font-inter text-sm text-secondary mt-1 mb-6">
          Recent articles across AI topics — updated regularly.
        </p>

        <Tabs defaultValue="All">
          <TabsList
            variant="line"
            className="w-full justify-start border-b border-border mb-8 h-auto flex-wrap gap-0"
          >
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="text-sm text-secondary rounded-none hover:text-primary bg-transparent px-3 py-2 data-active:!text-accent data-active:after:!bg-accent"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {TABS.map((tab) => (
            <TabsContent key={tab} value={tab}>
              <ArticleGrid
                articles={
                  tab === "All"
                    ? articles
                    : articles.filter(
                        (a) => a.frontmatter.difficulty === tab.toLowerCase()
                      )
                }
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
