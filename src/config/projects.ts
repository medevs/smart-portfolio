import type { Project } from "./types";

export const projects: Project[] = [
  {
    name: "Smart Portfolio",
    description: "AI-powered portfolio with RAG chatbot",
    status: "active",
    url: "https://medevsmaker.vercel.app",
    tech: ["Next.js", "LangChain", "OpenAI", "Supabase"],
  },
  {
    name: "Blog Genius",
    description: "AI tool for generating blog articles",
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
