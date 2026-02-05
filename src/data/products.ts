export interface Product {
  name: string;
  description: string;
  status: "active" | "building" | "planned";
  url?: string;
  tech: string[];
}

export const products: Product[] = [
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

export const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/medevs",
    username: "@medevs",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/ahmed-oublihi",
    username: "ahmed-oublihi",
  },
  {
    name: "Twitter",
    url: "https://twitter.com/AhmedOublihi",
    username: "@AhmedOublihi",
  },
];
