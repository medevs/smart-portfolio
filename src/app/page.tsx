import HeroSection from "@/components/sections/HeroSection";
import ProductsSection from "@/components/sections/ProductsSection";
import SkillsSection from "@/components/sections/SkillsSection";
import AgenticSection from "@/components/sections/AgenticSection";
import BlogSection from "@/components/sections/BlogSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import CTASection from "@/components/sections/CTASection";
import { getSortedPostsData } from "../../utils/markdown";

export default async function HomePage() {
  const posts = await getSortedPostsData();

  return (
    <main className="h-full overflow-hidden flex justify-center">
      <div className="h-full w-full max-w-[1440px] px-3 md:px-4 lg:px-6 py-2 md:py-3">
        {/* Mobile: scrollable, Desktop: fixed viewport fit */}
        <div className="h-full overflow-y-auto md:overflow-hidden">
          {/* Desktop Grid Layout */}
          <div className="hidden md:grid md:h-full md:grid-cols-3 md:grid-rows-[minmax(0,1.05fr)_minmax(0,1.15fr)_minmax(0,0.55fr)] gap-2.5">
            {/* Row 1, Col 1: Hero */}
            <div className="min-h-0 h-full">
              <HeroSection />
            </div>

            {/* Row 1, Col 2-3: Projects */}
            <div className="col-span-2 min-h-0 h-full">
              <ProductsSection />
            </div>

            {/* Row 2, Col 1: Skills */}
            <div className="min-h-0 h-full">
              <SkillsSection />
            </div>

            {/* Row 2, Col 2: Agentic Terminal */}
            <div className="min-h-0 h-full">
              <AgenticSection />
            </div>

            {/* Row 2, Col 3: Experience */}
            <div className="min-h-0 h-full">
              <ExperienceSection />
            </div>

            {/* Row 3, Col 1-2: Blog */}
            <div className="col-span-2 min-h-0 h-full">
              <BlogSection posts={posts} />
            </div>

            {/* Row 3, Col 3: CTA */}
            <div className="min-h-0 h-full">
              <CTASection />
            </div>
          </div>

          {/* Mobile Layout - Single Column */}
          <div className="md:hidden space-y-2.5 pb-20">
            <HeroSection />
            <ProductsSection />
            <SkillsSection />
            <AgenticSection />
            <ExperienceSection />
            <BlogSection posts={posts} />
            <CTASection />
          </div>
        </div>
      </div>
    </main>
  );
}
