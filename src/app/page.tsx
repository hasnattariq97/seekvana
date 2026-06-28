import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { LearningPaths } from "@/components/home/learning-paths";
import { Pillars } from "@/components/home/pillars";
import { RecentArticlesServer } from "@/components/home/recent-articles-server";
import { Footer } from "@/components/layout/footer";
import { NewsletterSection } from "@/components/newsletter/newsletter-section";
import { getAllArticles, getAllPaths } from "@/lib/mdx";

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
  const articleCount = getAllArticles().length;
  const pathCount = getAllPaths().length;
  return (
    <>
      <Hero articleCount={articleCount} pathCount={pathCount} />
      <LearningPaths />
      <Pillars />
      <RecentArticlesServer />
      <NewsletterSection />
      <Footer />
    </>
  );
}
