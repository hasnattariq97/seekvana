"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type Difficulty = "Beginner" | "Intermediate" | "Advanced";

interface Path {
  title: string;
  description: string;
  difficulty: Difficulty;
  lessons: number;
  href: string;
  stripClass: string;
}

const PATHS: Path[] = [
  {
    title: "AI for Absolute Beginners",
    description: "Start with zero assumptions.",
    difficulty: "Beginner",
    lessons: 8,
    href: "/paths/ai-for-beginners",
    stripClass: "bg-accent",
  },
  {
    title: "Master Agentic AI",
    description: "Go deep on agents, tool use, memory, and planning.",
    difficulty: "Intermediate",
    lessons: 14,
    href: "/paths/master-agentic-ai",
    stripClass: "bg-info",
  },
  {
    title: "Build Your First AI Agent",
    description: "Go from one tool call to a working autonomous agent.",
    difficulty: "Beginner",
    lessons: 10,
    href: "/paths/build-first-agent",
    stripClass: "bg-success",
  },
  {
    title: "Prompt Engineering Essentials",
    description: "Write prompts that actually work.",
    difficulty: "Beginner",
    lessons: 6,
    href: "/paths/prompt-engineering",
    stripClass: "bg-amber-700",
  },
  {
    title: "Beginner to AI Engineer",
    description: "The full journey from AI basics to shipping apps.",
    difficulty: "Advanced",
    lessons: 24,
    href: "/paths/beginner-to-engineer",
    stripClass: "bg-purple-700",
  },
];

const DIFFICULTY_BADGE: Record<Difficulty, string> = {
  Beginner:
    "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  Intermediate:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Advanced:
    "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

export function LearningPaths() {
  return (
    <section className="bg-canvas py-16 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-fraunces text-2xl text-primary">
            Learning paths
          </h2>
          <Link
            href="/paths"
            className="text-sm text-accent hover:text-accent-deep transition-colors"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PATHS.map((path, i) => (
            <motion.div
              key={path.href}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, ease: "easeOut", delay: i * 0.06 }}
              whileHover={{ y: -2 }}
              className="bg-surface rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Top colour strip */}
              <div className={`h-2 ${path.stripClass}`} />

              <div className="px-6 py-5 flex flex-col gap-2">
                <span
                  className={`self-start text-xs rounded-full px-2.5 py-0.5 font-medium ${DIFFICULTY_BADGE[path.difficulty]}`}
                >
                  {path.difficulty}
                </span>
                <h3 className="font-fraunces text-lg text-primary">
                  {path.title}
                </h3>
                <p className="font-inter text-sm text-secondary">
                  {path.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-secondary">
                    {path.lessons} lessons
                  </span>
                  <Link
                    href={path.href}
                    className="text-sm text-accent font-medium hover:text-accent-deep transition-colors"
                  >
                    Start path →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
