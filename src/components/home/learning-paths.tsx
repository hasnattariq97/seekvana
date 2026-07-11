"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain, Terminal, Monitor, GitBranch, Code2,
  Globe, Database, Cpu, Rocket, Star,
  BookOpen, Wrench, Radar,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const EXPO_EASE = [0.16, 1, 0.3, 1] as const;

interface Module { id: string; label: string; Icon: LucideIcon }

interface PathCard {
  slug: string;
  href: string;
  badgeLabel: string;
  badgeColorClass: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  modules: Module[];
  moduleGridCols: string;
  topicCount: number;
}

const PATHS: PathCard[] = [
  {
    slug: "getting-started",
    href: "/paths/getting-started",
    badgeLabel: "Beginner · Free",
    badgeColorClass: "border-success/30 bg-success/10 text-success",
    title: "Getting Started",
    description: "From zero to live AI app. No experience needed.",
    imageSrc: "/images/paths/getting-started/cover.png",
    imageAlt: "Getting Started learning path — a robot's journey through 10 AI modules",
    moduleGridCols: "grid-cols-5",
    topicCount: 101,
    modules: [
      { id: "01", label: "AI Landscape", Icon: Brain      },
      { id: "02", label: "Terminal",     Icon: Terminal   },
      { id: "03", label: "Dev Setup",    Icon: Monitor    },
      { id: "04", label: "Git",          Icon: GitBranch  },
      { id: "05", label: "Python",       Icon: Code2      },
      { id: "06", label: "Web Basics",   Icon: Globe      },
      { id: "07", label: "Backend",      Icon: Database   },
      { id: "08", label: "AI Tools",     Icon: Cpu        },
      { id: "09", label: "Deploy",       Icon: Rocket     },
      { id: "10", label: "Live Project", Icon: Star       },
    ],
  },
  {
    slug: "beyond-the-prompt",
    href: "/paths/beyond-the-prompt",
    badgeLabel: "Advanced · Free",
    badgeColorClass: "border-info/30 bg-info/10 text-info",
    title: "Beyond the Prompt",
    description: "From first prompt to production-grade prompt system.",
    imageSrc: "/images/paths/beyond-the-prompt/cover.png",
    imageAlt: "Beyond the Prompt learning path — a robot's journey from a raw prompt to a shipped production system",
    moduleGridCols: "grid-cols-3",
    topicCount: 31,
    modules: [
      { id: "11", label: "Foundations",           Icon: BookOpen },
      { id: "12", label: "Builder",                Icon: Wrench   },
      { id: "13", label: "Production & Frontier",  Icon: Radar    },
    ],
  },
];

export function LearningPaths() {
  return (
    <section className="bg-surface-subtle py-20 px-4">
      <div className="max-w-screen-lg mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-fraunces text-3xl text-primary">Learning paths</h2>
            <p className="text-sm text-secondary mt-1.5">
              Structured paths through AI — pick your level.
            </p>
          </div>
          <Link href="/paths" className="text-sm text-accent font-medium hover:text-accent-deep transition-colors shrink-0 mb-1">
            View all →
          </Link>
        </div>

        {/* ── Cards ── */}
        <div className="flex flex-col gap-6">
          {PATHS.map((path, i) => (
            <motion.article
              key={path.slug}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: EXPO_EASE, delay: i * 0.06 }}
              whileHover={{ y: -2, transition: { duration: 0.18, ease: "easeOut" } }}
              className="group relative rounded-2xl overflow-hidden border border-border hover:border-accent/30 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <Link
                href={path.href}
                className="absolute inset-0 z-20 rounded-2xl focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset focus-visible:outline-none"
              >
                <span className="sr-only">{path.title} learning path</span>
              </Link>

              {/* ── Two-column grid: desktop side-by-side (alternating), mobile stacked ── */}
              <div
                className={`grid grid-cols-1 ${
                  i % 2 === 0 ? "md:grid-cols-[38%_62%]" : "md:grid-cols-[62%_38%]"
                }`}
              >

                {/* Image — top on mobile, alternates side on desktop */}
                <div
                  className={`relative overflow-hidden h-52 md:h-auto md:min-h-[420px] order-first ${
                    i % 2 === 0 ? "md:order-last" : "md:order-first"
                  } bg-surface-subtle`}
                >
                  <Image
                    src={path.imageSrc}
                    alt={path.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 62vw"
                    priority={i === 0}
                  />
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* Content — bottom on mobile, alternates side on desktop */}
                <div
                  className={`bg-surface flex flex-col justify-between px-7 py-8 md:px-9 order-last ${
                    i % 2 === 0 ? "md:order-first" : "md:order-last"
                  }`}
                >

                  <div>
                    {/* Badge */}
                    <span className={`inline-flex items-center gap-1.5 text-[10.5px] font-semibold px-3 py-1.5 rounded-full border mb-5 ${path.badgeColorClass}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
                      {path.badgeLabel}
                    </span>

                    {/* Title */}
                    <h3 className="font-fraunces text-[2rem] font-medium text-primary leading-[1.08] tracking-tight mb-2">
                      {path.title}
                    </h3>
                    <p className="text-[13px] text-secondary leading-relaxed max-w-[30ch] mb-7">
                      {path.description}
                    </p>
                  </div>

                  {/* Module grid — icon + label */}
                  <div className="mb-8">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-secondary mb-3">
                      {path.modules.length} modules
                    </p>
                    <div className={`grid ${path.moduleGridCols} gap-1.5`}>
                      {path.modules.map(({ id, label, Icon }, j) => (
                        <div
                          key={id}
                          title={label}
                          className={`flex flex-col items-center gap-1 px-1.5 py-2 rounded-xl border ${
                            j === 0
                              ? "bg-accent-soft border-accent/30"
                              : "bg-surface-subtle border-border"
                          }`}
                        >
                          <Icon
                            size={13}
                            strokeWidth={1.7}
                            className={j === 0 ? "text-accent" : "text-secondary"}
                            aria-hidden="true"
                          />
                          <span
                            className={`text-[8px] font-medium text-center leading-tight line-clamp-1 w-full ${
                              j === 0 ? "text-accent" : "text-secondary"
                            }`}
                          >
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex items-center gap-2 bg-accent group-hover:bg-accent-deep text-white rounded-xl px-5 py-2.5 text-[13.5px] font-semibold transition-colors duration-200"
                      aria-hidden="true"
                    >
                      Start the path
                      <ArrowRight size={13} strokeWidth={2.5} aria-hidden="true" />
                    </span>
                    <span className="text-[12px] text-secondary">{path.topicCount} topics</span>
                  </div>

                </div>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}
