import HeroSection from "@/components/sections/HeroSection";
import ProductsSection from "@/components/sections/ProductsSection";
import SkillsSection from "@/components/sections/SkillsSection";
import AgenticSection from "@/components/sections/AgenticSection";
import BlogSection from "@/components/sections/BlogSection";
import { getSortedPostsData } from "../../utils/markdown";

export default async function HomePage() {
  const posts = await getSortedPostsData();

  return (
    <main className="min-h-screen pb-20">
      <HeroSection />
      <ProductsSection />
      <SkillsSection />
      <AgenticSection />
      <BlogSection posts={posts} />
    </main>
  );
}
