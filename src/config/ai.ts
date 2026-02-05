import type { AIConfig, AICapability, SlashCommand } from "./types";
import { personalInfo } from "./personal";
import { socialLinks } from "./social";

const capabilities: AICapability[] = [
  {
    icon: "Brain",
    title: "RAG",
    description: "Vector search & retrieval",
    iconColor: "text-purple-400",
  },
  {
    icon: "Bot",
    title: "Agents",
    description: "LangChain & tools",
    iconColor: "text-terminal-green",
  },
  {
    icon: "Database",
    title: "Vector DBs",
    description: "pgvector & embeddings",
    iconColor: "text-terminal-cyan",
  },
  {
    icon: "Zap",
    title: "LLMs",
    description: "OpenAI & streaming",
    iconColor: "text-amber-400",
  },
];

const slashCommands: Record<string, SlashCommand> = {
  "/skills": {
    description: "Show technical skills",
    query: `What are ${personalInfo.firstName}'s technical skills and technologies he works with?`,
  },
  "/projects": {
    description: "Show projects",
    query: `What projects has ${personalInfo.firstName} built? Include links and technologies used.`,
  },
  "/experience": {
    description: "Show work history",
    query: `What is ${personalInfo.firstName}'s work experience? List companies, positions, and responsibilities.`,
  },
  "/hire": {
    description: "Contact and availability",
    query: `How can I hire ${personalInfo.firstName}? What's his availability, contact info, and preferred roles?`,
  },
  "/blog": {
    description: "Show blog articles",
    query: `What blog posts has ${personalInfo.firstName} written? What topics does he cover?`,
  },
  "/education": {
    description: "Show education",
    query: `What is ${personalInfo.firstName}'s educational background and certifications?`,
  },
};

const githubLink = socialLinks.find((l) => l.name === "GitHub");
const linkedinLink = socialLinks.find((l) => l.name === "LinkedIn");

const easterEggs: Record<string, string> = {
  "sudo hire ahmed": `
\`\`\`bash
$ sudo hire ahmed
[sudo] verifying recruiter credentials... ✓
[████████████████████████████] 100%

✅ HIRE REQUEST APPROVED

Ready to build something awesome together!

📧 ${personalInfo.email}
💼 ${linkedinLink?.url.replace("https://", "")}
🐙 ${githubLink?.url.replace("https://", "")}
\`\`\`

*Pro tip: He comes with free AI integration skills!*
`,
  "hello world": `
\`\`\`javascript
console.log("Hey there! 👋");
\`\`\`

The classic. I see you're a person of culture! How can I help?
`,
  coffee: `${personalInfo.firstName} runs on mass, code compiles on hope. ☕

But seriously - what can I help you with?`,
  matrix: `*You take the green pill...* 🟢

Welcome to ${personalInfo.firstName}'s portfolio. The rabbit hole goes deep - try \`/skills\` or \`/projects\`.`,
  "404": `Skills not found? Impossible. Try \`/skills\` to see the full stack.`,
  ping: `pong! 🏓 Latency: 0ms (${personalInfo.firstName}'s always ready)`,
};

const fallbackContext = `
${personalInfo.fullName} - ${personalInfo.title}
Location: ${personalInfo.location.display}
Email: ${personalInfo.email}
GitHub: ${githubLink?.url.replace("https://", "")}
LinkedIn: ${linkedinLink?.url.replace("https://", "")}

Currently working at ePhilos AG as a Full Stack Developer.
Skills: React, Next.js, TypeScript, PHP, Node.js, LangChain, OpenAI
`;

export const aiConfig: AIConfig = {
  capabilities,
  slashCommands,
  easterEggs,
  systemPromptName: personalInfo.firstName,
  fallbackContext,
};
