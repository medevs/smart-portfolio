import type { Project } from "./types";

export const projects: Project[] = [
  {
    name: "MentorClone",
    description:
      "Transform any YouTube channel into your personal AI mentor. Ask questions and get answers grounded in actual video content, complete with timestamps for verification.",
    status: "active",
    url: "https://mentorclone.ai",
    tech: ["React", "Supabase", "OpenAI", "YouTube API"],
    image: "/images/projects/mentorclone.png",
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
    name: "Your Daily Way",
    description: "High-performance blog platform built with modern web technologies for optimal speed and SEO.",
    status: "active",
    url: "http://yourdailyway.com",
    tech: ["Astro", "React", "TypeScript", "Markdown"],
    image: "/images/projects/yourdailyway.png",
  },
];
