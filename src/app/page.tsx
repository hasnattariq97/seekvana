import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { LearningPaths } from "@/components/home/learning-paths";
import { Pillars } from "@/components/home/pillars";
import { RecentArticlesServer } from "@/components/home/recent-articles-server";
import { Footer } from "@/components/layout/footer";
import { NewsletterSection } from "@/components/newsletter/newsletter-section";
import { FaqSection } from "@/components/faq/faq-section";

const HOMEPAGE_FAQS = [
  {
    q: "Is Seekvana free?",
    a: "Yes. Every article and learning path on Seekvana is completely free. No paywalls, no trials, no credit card.",
  },
  {
    q: "Do I need coding experience?",
    a: "No. The beginner paths assume zero background and start from the absolute basics, then build up gradually.",
  },
  {
    q: "Who is Seekvana for?",
    a: "Everyone: complete beginners with no technical background, students and career-switchers, and developers who want to go deeper on AI and agents.",
  },
  {
    q: "Do I need an account?",
    a: "No. You can read everything freely. An optional free account lets you save your progress and bookmark articles.",
  },
  {
    q: "How is Seekvana different from an online course?",
    a: "It's self-paced, searchable, and free. Read a single article when you land from a search, or follow a full structured path from start to finish, your choice.",
  },
];
export const metadata: Metadata = {
  openGraph: {
    url: "https://seekvana.com",
    type: "website",
  },
  alternates: {
    canonical: "https://seekvana.com",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <LearningPaths />
      <Pillars />
      <RecentArticlesServer />
      <NewsletterSection />
      <section className="w-full max-w-3xl mx-auto px-4 md:px-6 py-16">
        <FaqSection faqs={HOMEPAGE_FAQS} />
      </section>
      <Footer />
    </>
  );
}
