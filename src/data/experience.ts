export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  tech: string[];
  type: "fulltime" | "freelance" | "contract";
}

export const experiences: Experience[] = [
  {
    id: "freelance-2024",
    company: "Freelance",
    role: "Full Stack Developer & AI Engineer",
    period: "2023 - Present",
    location: "Remote",
    description: "Building custom web applications and AI-powered solutions for clients worldwide.",
    achievements: [
      "Developed AI-powered portfolio with RAG chatbot",
      "Built Blog Genius - AI tool for content generation",
      "Created high-performance blog platform with Astro",
    ],
    tech: ["Next.js", "React", "TypeScript", "LangChain", "OpenAI", "Supabase"],
    type: "freelance",
  },
  {
    id: "developer-2022",
    company: "Software Development",
    role: "Web Developer",
    period: "2021 - 2023",
    location: "Bremen, Germany",
    description: "Full-stack development focusing on modern web technologies and best practices.",
    achievements: [
      "Built responsive web applications with React/Next.js",
      "Implemented REST APIs with Node.js and Express",
      "Managed databases with MySQL and MongoDB",
    ],
    tech: ["React", "Node.js", "PHP", "Laravel", "MySQL", "MongoDB"],
    type: "fulltime",
  },
  {
    id: "learning-2020",
    company: "Self-Directed Learning",
    role: "Aspiring Developer",
    period: "2019 - 2021",
    location: "Morocco / Germany",
    description: "Intensive self-study and project-based learning in web development and programming.",
    achievements: [
      "Completed multiple online certifications",
      "Built portfolio of personal projects",
      "Transitioned career to software development",
    ],
    tech: ["JavaScript", "HTML/CSS", "PHP", "Git", "Linux"],
    type: "fulltime",
  },
];
