import type { Experience } from "./types";

export const experiences: Experience[] = [
  {
    id: "ephilos-2021",
    company: "ePhilos AG",
    companyUrl: "https://ephilos.de",
    role: "Full Stack Developer",
    period: "2021 - Present",
    startDate: "Aug 2021",
    endDate: "Present",
    location: "Bremen, Germany",
    description:
      "Further development of the enterprise software Comfortmarkt (PHP, MySQL, Ext and Webix js). Optimization of database queries and performance. Implementation of new features focusing on user-friendliness. Application of best practices in software development and code optimization. Conducting unit tests and collaborating on CI/CD processes.",
    achievements: [
      "Developed and maintained enterprise software Comfortmarkt",
      "Optimized database queries for better performance",
      "Implemented new features focusing on UX",
      "Contributed to CI/CD processes and unit testing",
    ],
    tech: ["PHP", "MySQL", "JavaScript", "ExtJS", "Webix", "Git", "SVN"],
    type: "fulltime",
  },
  {
    id: "freelance-2023",
    company: "Freelance",
    role: "Full Stack Developer & AI Engineer",
    period: "2023 - Present",
    startDate: "Jan 2023",
    endDate: "Present",
    location: "Remote",
    description:
      "Building custom web applications and AI-powered solutions for clients worldwide.",
    achievements: [
      "Developed AI-powered portfolio with RAG chatbot",
      "Built Blog Genius - AI tool for content generation",
      "Created high-performance blog platform with Astro",
    ],
    tech: ["Next.js", "React", "TypeScript", "LangChain", "OpenAI", "Supabase"],
    type: "freelance",
  },
  {
    id: "freelance-2020",
    company: "Freelancer",
    role: "Web Developer",
    period: "2020 - 2021",
    startDate: "Mar 2020",
    endDate: "Jun 2021",
    location: "Remote - Morocco",
    description:
      "Development of responsive websites (HTML, CSS, Bootstrap, jQuery, WordPress). Customizations and SEO optimization. Close collaboration with clients to implement tailored solutions.",
    achievements: [
      "Built responsive websites with modern technologies",
      "Implemented SEO optimization strategies",
      "Collaborated directly with clients for custom solutions",
    ],
    tech: ["HTML", "CSS", "Bootstrap", "jQuery", "WordPress", "SEO"],
    type: "freelance",
  },
  {
    id: "hm-2019",
    company: "HM Communication",
    role: "NodeJS Developer",
    period: "2019",
    startDate: "Jul 2019",
    endDate: "Sep 2019",
    location: "Marrakech, Morocco",
    description:
      "Development of web applications with Node.js and Express.js. Working with MongoDB and RESTful APIs.",
    achievements: [
      "Developed web applications with Node.js and Express",
      "Worked with MongoDB databases",
      "Built RESTful APIs",
    ],
    tech: ["Node.js", "Express.js", "MongoDB", "REST APIs"],
    type: "internship",
  },
];
