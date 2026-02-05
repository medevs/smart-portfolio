import type { Project } from "./types";

export const projects: Project[] = [
  {
    name: "MentorClone",
    description:
      "Transform any YouTube channel into your personal AI mentor. Ask questions and get answers grounded in actual video content, complete with timestamps for verification.",
    status: "active",
    url: "https://mentorclone.ai",
    tech: ["React", "Supabase", "OpenAI", "YouTube API"],
  },
  {
    name: "TalkTheDoc",
    description:
      "Voice-first AI document assistant. Have natural spoken conversations with PDFs, Word docs, and more — no typing required.",
    status: "active",
    url: "https://talkthedoc.com",
    tech: ["Next.js", "TypeScript", "Convex", "AI SDK"],
    image: "/images/projects/talkthedoc.png",
  },
  {
    name: "Blog Genius",
    description: "AI-powered tool for generating SEO-optimized blog articles",
    status: "active",
    url: "https://blog-genius.vercel.app",
    tech: ["React", "Next.js", "OpenAI", "Node.js"],
  },
  {
    name: "Your Daily Way",
    description: "High-performance blog with Astro & React",
    status: "active",
    url: "http://yourdailyway.com",
    tech: ["Astro", "React", "TypeScript", "Markdown"],
  },
];
