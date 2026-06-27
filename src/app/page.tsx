import type { Metadata } from "next";
import { Suspense } from "react";
import { Hero } from "@/components/home/hero";
import { LearningPaths } from "@/components/home/learning-paths";
import { Pillars } from "@/components/home/pillars";
import { RecentArticlesServer } from "@/components/home/recent-articles-server";
import { Footer } from "@/components/layout/footer";
import { NewsletterSection } from "@/components/newsletter/newsletter-section";
import { AuthRequiredHandler } from "@/components/home/auth-required-handler";
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
      <Suspense fallback={null}>
        <AuthRequiredHandler />
      </Suspense>
      <Hero articleCount={articleCount} pathCount={pathCount} />
      <LearningPaths />
      <Pillars />
      <RecentArticlesServer />
      <NewsletterSection />
      <Footer />
    </>
  );
}
