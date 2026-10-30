import type { SEOConfig } from "./types";

export const seoConfig: SEOConfig = {
  siteName: "medevsmaker",
  siteUrl: "https://medevsmaker.vercel.app",
  description:
    "Wander medevsmaker's farm. The courtyard workshop is ReelStyles — style packs for Claude Code that make videos in code with HyperFrames and Remotion.",
  keywords: [
    "medevsmaker",
    "ReelStyles",
    "HyperFrames",
    "Remotion",
    "MentorClone",
    "TalkTheDoc",
  ],
  author: {
    name: "medevsmaker",
    url: "https://medevsmaker.vercel.app",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "medevsmaker — a farm you can wander",
    description:
      "A Middle Atlas farm you can wander. The courtyard workshop is ReelStyles. Help build the dream home.",
    images: [],
  },
  twitter: {
    card: "summary_large_image",
    title: "medevsmaker — a farm you can wander",
    description:
      "A Middle Atlas farm you can wander. The courtyard workshop is ReelStyles. Help build the dream home.",
    images: [],
    creator: "@medevsmaker",
  },
};
