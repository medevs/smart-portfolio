import type { Metadata } from "next";
import { FarmExperience } from "@/components/farm/FarmExperience";
import { loadFarm } from "@/farm/loadFarm";
import { seoConfig } from "@/config/seo";
import { socialLinks } from "@/config/social";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

const farmSentence =
  "medevsmaker builds interactive 3D farm walkthroughs, and this Middle Atlas farm is a playable example you can wander.";

const crawlLinks = [
  { href: "/list", label: "Explore everything on the farm" },
  { href: "/blog", label: "Read the blog" },
  { href: "/references", label: "Photo references and licences" },
  { href: "/open", label: "Open farm" },
  { href: "/gather", label: "Gather" },
];

export default async function HomePage() {
  const farm = await loadFarm();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${seoConfig.siteUrl}/#website`,
        name: seoConfig.siteName,
        url: seoConfig.siteUrl,
        description:
          "A farm of things made in code, inspired by Morocco’s Middle Atlas, with a courtyard workshop for ReelStyles.",
      },
      {
        "@type": "ProfessionalService",
        "@id": `${seoConfig.siteUrl}/#service`,
        name: seoConfig.siteName,
        url: seoConfig.siteUrl,
        description:
          "medevsmaker makes interactive 3D farm walkthroughs for the web, shown here as a playable Middle Atlas farm.",
        sameAs: socialLinks.map((link) => link.url),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <FarmExperience farm={farm} />
      <nav className="sr-only" aria-label="Site pages">
        <p>{farmSentence}</p>
        <ul>
          {crawlLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
