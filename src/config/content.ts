import type { HeroContent } from "./types";
import { personalInfo } from "./personal";

export const heroContent: HeroContent = {
  greeting: "Hi, I'm",
  roles: [
    "Full Stack Developer",
    "AI Engineer",
    "Problem Solver",
    "Tech Enthusiast",
  ],
  description: `Building intelligent software with modern web technologies. Specializing in React, Next.js, and AI/ML integration.`,
  ctaButtons: {
    primary: {
      text: "Download CV",
      href: personalInfo.resumeUrl,
      icon: "Download",
    },
  },
};
