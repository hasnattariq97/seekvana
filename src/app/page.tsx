import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { LearningPaths } from "@/components/home/learning-paths";
import { Pillars } from "@/components/home/pillars";
import { RecentArticlesServer } from "@/components/home/recent-articles-server";
import { Footer } from "@/components/layout/footer";
import { NewsletterSection } from "@/components/newsletter/newsletter-section";
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
      <Footer />
    </>
  );
}
