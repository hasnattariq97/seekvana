"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

type Difficulty = "Beginner" | "Intermediate" | "Advanced";
type Category = "Agentic AI" | "RAG" | "Prompting" | "Fine-tuning";

interface Article {
  title: string;
  excerpt: string;
  category: Category;
  difficulty: Difficulty;
  author: string;
  readTime: number;
  href: string;
  bgClass: string;
}

const ARTICLES: Article[] = [
  {
    title: "What makes an AI agent actually agentic?",
    excerpt:
      "The line between a chatbot and an agent comes down to one thing — whether the model decides what happens next.",
    category: "Agentic AI",
    difficulty: "Beginner",
    author: "Seekvana",
    readTime: 8,
    href: "/library/agentic-ai/what-is-an-agent",
    bgClass: "bg-accent-soft",
  },
  {
    title: "Tool use: giving models hands, not just a mouth",
    excerpt:
      "Function calling turns a language model from a talker into a doer — here's how it actually works.",
    category: "Agentic AI",
    difficulty: "Intermediate",
    author: "Seekvana",
    readTime: 12,
    href: "/library/agentic-ai/tool-use-explained",
    bgClass: "bg-info/20",
  },
  {
    title: "RAG without the hype: retrieval that actually helps",
    excerpt:
      "Retrieval-augmented generation is simple in principle and finicky in practice — let's fix that.",
    category: "RAG",
    difficulty: "Beginner",
    author: "Seekvana",
    readTime: 10,
    href: "/library/large-language-models/rag-explained",
    bgClass: "bg-surface-subtle",
  },
];

const TABS = ["All", "Agentic AI", "RAG", "Prompting", "Fine-tuning"] as const;

const ARTICLES_BY_TAB: Record<string, Article[]> = {
  All: ARTICLES,
  "Agentic AI": ARTICLES.filter((a) => a.category === "Agentic AI"),
  RAG: ARTICLES.filter((a) => a.category === "RAG"),
  Prompting: ARTICLES.filter((a) => a.category === "Prompting"),
  "Fine-tuning": ARTICLES.filter((a) => a.category === "Fine-tuning"),
};

const DIFFICULTY_BADGE: Record<Difficulty, string> = {
  Beginner:
    "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  Intermediate:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Advanced:
    "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

function ArticleGrid({ articles }: { articles: Article[] }) {
  const shouldReduceMotion = useReducedMotion();

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
          key={article.href}
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.3,
            ease: "easeOut",
            delay: shouldReduceMotion ? 0 : i * 0.08,
          }}
          whileHover={shouldReduceMotion ? undefined : { y: -2 }}
          className="bg-surface rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow relative"
        >
          {/* Full-card overlay link */}
          <Link
            href={article.href}
            className="absolute inset-0 z-0 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded-xl"
            aria-label={`Read: ${article.title}`}
          />

          {/* Editorial image area with gradient overlay and category badge */}
          <div className={`relative h-48 ${article.bgClass}`} aria-hidden="true">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <span className="absolute bottom-3 left-3 bg-accent-soft text-accent text-xs rounded-full px-2.5 py-0.5 font-medium backdrop-blur-sm">
              {article.category}
            </span>
          </div>

          <div className="p-5 relative z-10">
            {/* Difficulty badge stands alone now that category is on the image */}
            <span
              className={`inline-block text-xs rounded-full px-2.5 py-0.5 font-medium ${DIFFICULTY_BADGE[article.difficulty]}`}
            >
              {article.difficulty}
            </span>

            <h3 className="font-fraunces text-lg text-primary mt-2 leading-snug">
              {article.title}
            </h3>
            <p className="font-inter text-sm text-secondary mt-1 line-clamp-2">
              {article.excerpt}
            </p>

            <div className="flex items-center gap-3 mt-3">
              <span className="text-xs text-secondary">{article.readTime} min read</span>
              <span className="text-secondary text-xs">·</span>
              <span className="text-xs text-secondary">{article.author}</span>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

export function RecentArticles() {
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
              <ArticleGrid articles={ARTICLES_BY_TAB[tab]} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
