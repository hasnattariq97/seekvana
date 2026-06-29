"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, Clock3, CheckCircle2, Layers, ImageIcon,
  Brain, Terminal, Monitor, GitBranch, Code2, Globe,
  Database, Cpu, Rocket, Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const EXPO_EASE = [0.16, 1, 0.3, 1] as const;

const PILLS = [
  { icon: Clock3,       label: "Under 5 min per topic" },
  { icon: CheckCircle2, label: "Hands-on from day one" },
  { icon: Layers,       label: "10 modules · 101 topics" },
];

interface Module { id: string; title: string; Icon: LucideIcon }

const MODULES: Module[] = [
  { id: "01", title: "AI Landscape",  Icon: Brain      },
  { id: "02", title: "Terminal",      Icon: Terminal   },
  { id: "03", title: "Dev Setup",     Icon: Monitor    },
  { id: "04", title: "Git & GitHub",  Icon: GitBranch  },
  { id: "05", title: "Python",        Icon: Code2      },
  { id: "06", title: "Web Basics",    Icon: Globe      },
  { id: "07", title: "Backend",       Icon: Database   },
  { id: "08", title: "AI Tools",      Icon: Cpu        },
  { id: "09", title: "Deploy",        Icon: Rocket     },
  { id: "10", title: "Live Project",  Icon: Star       },
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
              Three structured paths through Agentic AI — pick your level.
            </p>
          </div>
          <Link href="/paths" className="text-sm text-accent font-medium hover:text-accent-deep transition-colors shrink-0 mb-1">
            View all →
          </Link>
        </div>

        {/* Card */}
        <motion.article
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: EXPO_EASE }}
          whileHover={{ y: -2, transition: { duration: 0.18, ease: "easeOut" } }}
          className="group relative bg-surface rounded-2xl overflow-hidden border border-border hover:border-accent/30 shadow-sm hover:shadow-xl transition-all duration-300"
        >
          {/* Full-card link */}
          <Link
            href="/paths/getting-started"
            className="absolute inset-0 z-20 rounded-2xl focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset focus-visible:outline-none"
            aria-label="Start Getting Started learning path"
          />

          {/* ── Top row: content + illustration ── */}
          <div className="flex flex-col md:flex-row">

            {/* Left: content */}
            <div className="flex-1 flex flex-col justify-between px-8 py-7 md:px-10 md:py-8 min-w-0">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-secondary mb-4">
                  Learning Path · Beginner · Free
                </p>

                <h3 className="font-fraunces text-[1.85rem] md:text-[2.1rem] leading-[1.08] font-medium tracking-tight text-primary mb-3">
                  Your journey from{" "}
                  <em className="not-italic text-accent">curious</em>
                  {" "}to{" "}
                  <em className="italic text-primary">confident</em>
                </h3>

                <p className="text-[13.5px] text-secondary leading-relaxed max-w-[42ch] mb-5">
                  Terminal, Python, Git, APIs, deployment — everything before your first AI app.
                </p>

                <div className="flex flex-wrap gap-2">
                  {PILLS.map(({ icon: Icon, label }) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1.5 text-[11.5px] text-secondary bg-surface-subtle border border-border rounded-full px-3 py-1.5"
                    >
                      <Icon size={10} strokeWidth={2.2} className="text-accent shrink-0" aria-hidden="true" />
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 mt-7">
                <span
                  className="inline-flex items-center gap-2 bg-accent group-hover:bg-accent-deep text-white rounded-xl px-5 py-2.5 text-[13.5px] font-semibold transition-colors duration-200"
                  aria-hidden="true"
                >
                  Start the path
                  <ArrowRight size={13} strokeWidth={2.5} aria-hidden="true" />
                </span>
                <span className="text-[12px] text-secondary">No experience needed</span>
              </div>
            </div>

            {/* Right: clay panel — image goes here */}
            <div className="hidden md:flex w-[340px] lg:w-[400px] shrink-0 relative overflow-hidden bg-accent min-h-[260px] items-center justify-center">
              {/* Dot texture */}
              <div
                className="absolute inset-0 opacity-[0.12] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle, white 1.2px, transparent 1.2px)",
                  backgroundSize: "20px 20px",
                }}
              />
              {/* Blob */}
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-black/10 pointer-events-none" />

              {/* Image placeholder */}
              <div className="relative z-10 flex flex-col items-center justify-center gap-2 text-center p-6">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-1">
                  <ImageIcon size={16} className="text-white/80" aria-hidden="true" />
                </div>
                <p className="text-[11px] font-semibold text-white/70">Your illustration</p>
                <p className="text-[15px] font-bold text-white font-mono tracking-tight">880 × 560 px</p>
                <p className="text-[10px] text-white/50 leading-relaxed">
                  WebP · object-cover<br />
                  <code className="text-white/40 text-[9px]">public/images/paths/getting-started/cover.webp</code>
                </p>
              </div>

              {/* Hover brighten */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300 pointer-events-none" />
            </div>
          </div>

          {/* ── Bottom: module strip ── */}
          <div
            className="border-t border-border overflow-x-auto"
            role="list"
            aria-label="Course modules"
          >
            <div className="grid" style={{ gridTemplateColumns: "repeat(10, minmax(88px, 1fr))" }}>
              {MODULES.map(({ id, title, Icon }, i) => {
                const isFirst = i === 0;
                const isLast  = i === MODULES.length - 1;
                return (
                  <div
                    key={id}
                    role="listitem"
                    className="px-3 py-3 flex flex-col gap-1.5 border-r border-border last:border-r-0 min-w-[88px]"
                  >
                    <span
                      className={`text-[9px] font-bold tracking-widest uppercase ${
                        isFirst ? "text-accent" : isLast ? "text-success" : "text-border"
                      }`}
                    >
                      {id}
                    </span>
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                        isFirst ? "bg-accent-soft" : isLast ? "bg-success/10" : "bg-surface-subtle"
                      }`}
                    >
                      <Icon
                        size={12}
                        strokeWidth={1.8}
                        className={isFirst ? "text-accent" : isLast ? "text-success" : "text-secondary"}
                        aria-hidden="true"
                      />
                    </div>
                    <span
                      className={`text-[10px] leading-tight font-medium ${
                        isFirst ? "text-primary" : "text-secondary"
                      }`}
                    >
                      {title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </motion.article>
      </div>
    </section>
  );
}
