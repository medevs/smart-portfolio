import type { SEOConfig } from "./types";
import { personalInfo } from "./personal";

export const seoConfig: SEOConfig = {
  siteName: `${personalInfo.fullName} Portfolio`,
  siteUrl: "https://medevsmaker.vercel.app",
  description:
    "Full Stack Developer & AI Engineer specializing in React, Next.js, TypeScript, and AI-powered applications. Building intelligent software with modern web technologies.",
  keywords: [
    "Full Stack Developer",
    "AI Engineer",
    "React",
    "Next.js",
    "TypeScript",
    "LangChain",
    "OpenAI",
    "Web Development",
    "Software Engineer",
    personalInfo.fullName,
  ],
  author: {
    name: personalInfo.fullName,
    url: personalInfo.website,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: `${personalInfo.fullName} - ${personalInfo.title}`,
    description:
      "Full Stack Developer & AI Engineer building intelligent software with modern web technologies.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${personalInfo.fullName} - ${personalInfo.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${personalInfo.fullName} - ${personalInfo.title}`,
    description:
      "Full Stack Developer & AI Engineer building intelligent software with modern web technologies.",
    images: ["/og-image.png"],
    creator: "@medevs",
  },
};
