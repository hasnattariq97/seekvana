"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { PILLARS as PILLAR_DATA } from "@/lib/pillars";

const START_HERE = new Set(["ai-foundations"]);

export function Pillars() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="bg-surface-subtle py-16 px-4">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="font-fraunces text-2xl text-primary">
          Everything AI, in one place
        </h2>
        <p className="font-inter text-sm text-secondary mt-1 mb-8">
          Nine topic areas covering everything from AI basics to advanced agentic systems.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {PILLAR_DATA.map((pillar, i) => {
            const startHere = START_HERE.has(pillar.slug);
            return (
              <motion.div
                key={pillar.slug}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.3,
                  ease: "easeOut",
                  delay: shouldReduceMotion ? 0 : i * 0.04,
                }}
              >
                <Link
                  href={`/library/${pillar.slug}`}
                  className="group flex flex-col bg-surface border border-border rounded-[14px] overflow-hidden transition-all duration-150 hover:-translate-y-[3px] hover:shadow-[0_12px_32px_rgba(26,23,20,0.1)] hover:border-accent/30 h-full focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {/* Image zone */}
                  <div className="h-[180px] border-b border-border relative overflow-hidden">
                    <Image
                      src={`/images/pillars/${pillar.slug}.webp`}
                      alt={pillar.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-[18px] gap-2">
                    <h3 className="font-fraunces text-lg text-primary leading-snug group-hover:text-accent transition-colors duration-150">
                      {pillar.name}
                    </h3>
                    <p className="font-inter text-sm text-secondary leading-relaxed flex-1">
                      {pillar.description}
                    </p>
                    <div className="flex items-center justify-between mt-[6px]">
                      <span className="text-[11px] font-semibold text-secondary group-hover:text-accent transition-colors duration-150">
                        Explore
                      </span>
                      <div className="flex items-center gap-[6px]">
                        {startHere && (
                          <span className="text-[10px] font-semibold text-secondary border border-border rounded-full px-2 py-[2px] group-hover:text-accent group-hover:border-accent/30 transition-colors duration-150">
                            Start here
                          </span>
                        )}
                        <div className="w-6 h-6 rounded-full flex items-center justify-center border border-border bg-canvas transition-colors duration-150 group-hover:border-accent/40 group-hover:bg-accent/[0.06]">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-secondary group-hover:text-accent transition-colors duration-150" stroke="currentColor">
                            <line x1="5" y1="12" x2="19" y2="12"/>
                            <polyline points="12 5 19 12 12 19"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
