import { FarmExperience } from "@/components/farm/FarmExperience";
import { loadFarm } from "@/farm/loadFarm";

export default async function HomePage() {
  const farm = await loadFarm();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "medevsmaker",
    url: "https://medevsmaker.vercel.app",
    description: "A farm of things made in code, inspired by Morocco’s Middle Atlas, with a courtyard workshop for ReelStyles.",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FarmExperience farm={farm} />
    </>
  );
}
