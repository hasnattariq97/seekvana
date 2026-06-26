"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Brain,
  MessageSquare,
  Bot,
  Code2,
  Wrench,
  Briefcase,
  Sparkles,
  Shield,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Pillar {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  flagship: boolean;
}

const PILLARS: Pillar[] = [
  {
    title: "AI Foundations",
    description: "What AI is, how it works, and why it matters",
    href: "/library/ai-foundations",
    icon: Brain,
    flagship: false,
  },
  {
    title: "Large Language Models",
    description: "Tokens, context, RAG, fine-tuning, and how LLMs think",
    href: "/library/large-language-models",
    icon: MessageSquare,
    flagship: false,
  },
  {
    title: "Agentic AI",
    description: "Agents, tool use, memory, planning, multi-agent systems",
    href: "/library/agentic-ai",
    icon: Bot,
    flagship: true,
  },
  {
    title: "Building with AI",
    description: "APIs, SDKs, evals, deployment, and cost management",
    href: "/library/building-with-ai",
    icon: Code2,
    flagship: false,
  },
  {
    title: "AI Tools",
    description: "Reviews and comparisons of the best AI tools",
    href: "/library/ai-tools",
    icon: Wrench,
    flagship: false,
  },
  {
    title: "AI in Practice",
    description: "Real workflows for writing, research, coding, and automation",
    href: "/library/ai-in-practice",
    icon: Briefcase,
    flagship: false,
  },
  {
    title: "Prompt Engineering",
    description: "Write prompts that get results — techniques and patterns that work",
    href: "/library/prompt-engineering",
    icon: Sparkles,
    flagship: false,
  },
  {
    title: "Ethics & Safety",
    description: "Responsible AI, alignment, risks, and governance",
    href: "/library/ethics-safety",
    icon: Shield,
    flagship: false,
  },
  {
    title: "Careers",
    description: "How to learn AI, roles, and building your portfolio",
    href: "/library/careers",
    icon: GraduationCap,
    flagship: false,
  },
];

export function Pillars() {
  const shouldReduceMotion = useReducedMotion() ?? false;

  return (
    <section className="bg-surface-subtle py-16 px-4">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="font-fraunces text-2xl text-primary">
          Everything AI, in one place
        </h2>
        <p className="font-inter text-sm text-secondary mt-1 mb-8">
          Nine topic areas covering everything from AI basics to advanced agentic systems.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.href}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.3,
                  ease: "easeOut",
                  delay: shouldReduceMotion ? 0 : i * 0.04,
                }}
                whileHover={shouldReduceMotion ? undefined : { y: -2 }}
              >
                <Link
                  href={pillar.href}
                  className={cn(
                    "group relative block bg-surface rounded-xl border p-5 transition-shadow h-full focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none",
                    pillar.flagship
                      ? "border-accent border-2 hover:shadow-lg"
                      : "border-border hover:shadow-lg hover:bg-surface-subtle"
                  )}
                >
                  {pillar.flagship && (
                    <span className="absolute top-3 right-3 text-xs bg-accent text-white px-2 py-0.5 rounded-full font-medium">
                      Flagship
                    </span>
                  )}

                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-10 h-10 rounded-xl",
                      pillar.flagship
                        ? "bg-accent text-white"
                        : "bg-accent-soft text-accent"
                    )}
                  >
                    <Icon size={20} aria-hidden="true" />
                  </span>

                  <h3 className="font-fraunces text-base text-primary mt-3">
                    {pillar.title}
                  </h3>
                  <p className="font-inter text-sm text-secondary mt-1">
                    {pillar.description}
                  </p>

                  <span
                    className="flex items-center gap-1 text-accent text-xs mt-3 font-medium"
                    aria-hidden="true"
                  >
                    Explore{" "}
                    <span className="transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
