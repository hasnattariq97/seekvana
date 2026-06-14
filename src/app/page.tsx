import { Hero } from "@/components/home/hero";
import { LearningPaths } from "@/components/home/learning-paths";
import { Pillars } from "@/components/home/pillars";
import { RecentArticles } from "@/components/home/recent-articles";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <LearningPaths />
      <Pillars />
      <RecentArticles />
      <Footer />
    </>
  );
}
