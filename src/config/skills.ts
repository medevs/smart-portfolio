import type { SkillCategory, VisualSkill } from "./types";

export const skillCategories: SkillCategory[] = [
  {
    name: "Frontend",
    icon: "Code2",
    skills: [
      { name: "React", level: 95 },
      { name: "Next.js", level: 90 },
      { name: "TypeScript", level: 88 },
      { name: "Tailwind", level: 92 },
    ],
  },
  {
    name: "Backend",
    icon: "Server",
    skills: [
      { name: "Node.js", level: 85 },
      { name: "Express", level: 82 },
      { name: "PHP", level: 78 },
      { name: "Python", level: 70 },
    ],
  },
  {
    name: "Database",
    icon: "Database",
    skills: [
      { name: "MySQL", level: 85 },
      { name: "MongoDB", level: 80 },
      { name: "Prisma", level: 82 },
      { name: "Supabase", level: 85 },
    ],
  },
  {
    name: "AI/ML",
    icon: "Brain",
    skills: [
      { name: "LangChain", level: 80 },
      { name: "OpenAI", level: 85 },
      { name: "RAG", level: 82 },
    ],
  },
];

// Visual skills for skills grid display
export const visualSkills: VisualSkill[] = [
  { name: "JavaScript", icon: "SiJavascript", color: "#F7DF1E" },
  { name: "TypeScript", icon: "SiTypescript", color: "#3178C6" },
  { name: "React", icon: "SiReact", color: "#61DAFB" },
  { name: "Next.js", icon: "SiNextdotjs", color: "#000000" },
  { name: "Tailwind", icon: "SiTailwindcss", color: "#06B6D4" },
  { name: "Node.js", icon: "SiNodedotjs", color: "#339933" },
  { name: "Express", icon: "SiExpress", color: "#000000" },
  { name: "MongoDB", icon: "SiMongodb", color: "#47A248" },
  { name: "MySQL", icon: "SiMysql", color: "#4479A1" },
  { name: "Prisma", icon: "SiPrisma", color: "#2D3748" },
  { name: "Git", icon: "SiGit", color: "#F05032" },
  { name: "GitHub", icon: "SiGithub", color: "#181717" },
  { name: "Docker", icon: "SiDocker", color: "#2496ED" },
  { name: "VSCode", icon: "SiVisualstudiocode", color: "#007ACC" },
  { name: "Astro", icon: "SiAstro", color: "#FF5D01" },
  { name: "OpenAI", icon: "SiOpenai", color: "#412991" },
  { name: "PHP", icon: "SiPhp", color: "#777BB4" },
  { name: "Laravel", icon: "SiLaravel", color: "#FF2D20" },
  { name: "Python", icon: "SiPython", color: "#3776AB" },
  { name: "SVN", icon: "SiSubversion", color: "#809CC9" },
];

// Plain skills list for RAG and SEO
export const skillsList: string[] = [
  "React",
  "Next.js",
  "Astro",
  "JavaScript",
  "TypeScript",
  "HTML5",
  "CSS3",
  "Tailwind CSS",
  "PHP",
  "Node.js",
  "Express.js",
  "Laravel",
  "Python",
  "MySQL",
  "MongoDB",
  "Git",
  "Docker",
  "Jest",
  "CI/CD",
  "VS Code",
  "OpenAI",
  "LangChain",
];
