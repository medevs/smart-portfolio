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
    <main className="h-full overflow-hidden p-2 md:p-2 lg:p-3">
      {/* Mobile: scrollable, Desktop: fixed viewport fit */}
      <div className="h-full overflow-y-auto md:overflow-hidden">
        {/* Desktop Grid Layout - explicit row heights to fit viewport */}
        <div className="hidden md:grid md:h-full md:grid-cols-3 md:grid-rows-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.7fr)] gap-2">
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

          {/* Row 2, Col 2: AI Capabilities */}
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
        <div className="md:hidden space-y-3 pb-20">
          <HeroSection />
          <ProductsSection />
          <SkillsSection />
          <AgenticSection />
          <ExperienceSection />
          <BlogSection posts={posts} />
          <CTASection />
        </div>
      </div>
    </main>
  );
}
