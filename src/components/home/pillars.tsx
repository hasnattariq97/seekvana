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
  FlaskConical,
  Shield,
  GraduationCap,
} from "lucide-react";
import type { FC } from "react";
import { cn } from "@/lib/utils";

type LucideIcon = FC<{ size?: number; className?: string; "aria-hidden"?: boolean | "true" }>;

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
    title: "Use Cases",
    description: "Real workflows: writing, coding, research, automation",
    href: "/library/use-cases",
    icon: Briefcase,
    flagship: false,
  },
  {
    title: "Concepts & Theory",
    description: "Transformers, embeddings, RL — the mechanics under the hood",
    href: "/library/concepts-theory",
    icon: FlaskConical,
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
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-surface-subtle py-16 px-4">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="font-fraunces text-2xl text-primary mb-8">
          Everything AI, in one place
        </h2>

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
                    "block bg-surface rounded-xl border p-5 hover:shadow-md transition-shadow h-full focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none",
                    pillar.flagship
                      ? "border-accent border-2"
                      : "border-border"
                  )}
                >
                  <Icon size={24} className="text-accent" aria-hidden="true" />
                  <h3 className="font-fraunces text-base text-primary mt-3">
                    {pillar.title}
                  </h3>
                  <p className="font-inter text-sm text-secondary mt-1">
                    {pillar.description}
                  </p>
                  <span className="block text-accent text-xs mt-3" aria-hidden="true">
                    Explore →
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
