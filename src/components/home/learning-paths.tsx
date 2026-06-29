"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, ImageIcon,
  Brain, Terminal, Monitor, GitBranch, Code2,
  Globe, Database, Cpu, Rocket, Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const EXPO_EASE = [0.16, 1, 0.3, 1] as const;

interface Module { id: string; label: string; Icon: LucideIcon }

const MODULES: Module[] = [
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

        {/* ── Card ── */}
        <motion.article
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: EXPO_EASE }}
          whileHover={{ y: -2, transition: { duration: 0.18, ease: "easeOut" } }}
          className="group relative rounded-2xl overflow-hidden border border-border hover:border-accent/30 shadow-sm hover:shadow-xl transition-all duration-300"
        >
          <Link
            href="/paths/getting-started"
            className="absolute inset-0 z-20 rounded-2xl focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset focus-visible:outline-none"
            aria-label="Start Getting Started learning path"
          />

          {/* ── Two-column grid: desktop side-by-side, mobile stacked ── */}
          <div className="grid grid-cols-1 md:grid-cols-[38%_62%]">

            {/* Image — top on mobile, right on desktop */}
            <div className="relative bg-accent overflow-hidden h-52 md:h-auto md:min-h-[420px] order-first md:order-last flex items-center justify-center">
              {/* Dot texture */}
              <div
                className="absolute inset-0 opacity-[0.1] pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(circle, white 1.2px, transparent 1.2px)",
                  backgroundSize: "20px 20px",
                }}
              />
              {/* Decorative blobs */}
              <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-black/10 pointer-events-none" />

              {/* Placeholder */}
              <div className="relative z-10 flex flex-col items-center gap-2 text-center px-6">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-1">
                  <ImageIcon size={16} className="text-white/80" aria-hidden="true" />
                </div>
                <p className="text-[11px] font-semibold text-white/70">Your illustration</p>
                <p className="text-[15px] font-bold text-white font-mono tracking-tight">1200 × 800 px</p>
                <p className="text-[10px] text-white/50 leading-relaxed mt-0.5">
                  WebP · object-cover<br />
                  <code className="text-[9px] text-white/35">public/images/paths/getting-started/cover.webp</code>
                </p>
              </div>

              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.05] transition-opacity duration-300 pointer-events-none" />
            </div>

            {/* Content — bottom on mobile, left on desktop */}
            <div className="bg-surface flex flex-col justify-between px-7 py-8 md:px-9 order-last md:order-first">

              <div>
                {/* Badge */}
                <span className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold px-3 py-1.5 rounded-full border border-success/30 bg-success/10 text-success mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
                  Beginner · Free
                </span>

                {/* Title */}
                <h3 className="font-fraunces text-[2rem] font-medium text-primary leading-[1.08] tracking-tight mb-2">
                  Getting Started
                </h3>
                <p className="text-[13px] text-secondary leading-relaxed max-w-[30ch] mb-7">
                  From zero to live AI app. No experience needed.
                </p>
              </div>

              {/* Module grid — 5 cols × 2 rows, icon + label */}
              <div className="mb-8">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-secondary mb-3">
                  10 modules
                </p>
                <div className="grid grid-cols-5 gap-1.5">
                  {MODULES.map(({ id, label, Icon }, i) => (
                    <div
                      key={id}
                      title={label}
                      className={`flex flex-col items-center gap-1 px-1.5 py-2 rounded-xl border ${
                        i === 0
                          ? "bg-accent-soft border-accent/30"
                          : "bg-surface-subtle border-border"
                      }`}
                    >
                      <Icon
                        size={13}
                        strokeWidth={1.7}
                        className={i === 0 ? "text-accent" : "text-secondary"}
                        aria-hidden="true"
                      />
                      <span
                        className={`text-[8px] font-medium text-center leading-tight line-clamp-1 w-full ${
                          i === 0 ? "text-accent" : "text-secondary"
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
                <span className="text-[12px] text-secondary">101 topics</span>
              </div>

            </div>
          </div>
        </motion.article>

      </div>
    </section>
  );
}
