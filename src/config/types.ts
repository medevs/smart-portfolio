import { LucideIcon } from "lucide-react";

// Personal Information
export interface PersonalInfo {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  location: {
    city: string;
    country: string;
    display: string;
  };
  title: string;
  availability: {
    status: "available" | "busy" | "unavailable";
    message: string;
  };
  resumeUrl: string;
  profileImage: string;
  website: string;
  summary: string;
}

// SEO Configuration
export interface SEOConfig {
  siteName: string;
  siteUrl: string;
  description: string;
  keywords: string[];
  author: {
    name: string;
    url: string;
  };
  openGraph: {
    type: string;
    locale: string;
    title: string;
    description: string;
    images: {
      url: string;
      width: number;
      height: number;
      alt: string;
    }[];
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    images: string[];
    creator: string;
  };
}

// Project
export interface Project {
  name: string;
  description: string;
  status: "active" | "building" | "planned";
  url?: string;
  tech: string[];
  image?: string;
}

// Experience
export interface Experience {
  id: string;
  company: string;
  companyUrl?: string;
  role: string;
  period: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  achievements: string[];
  tech: string[];
  type: "fulltime" | "freelance" | "contract" | "internship";
}

// Education
export interface Education {
  id: string;
  institution: string;
  institutionUrl?: string;
  degree: string;
  field?: string;
  startDate: string;
  endDate: string;
  description: string;
}

// Certification
export interface Certification {
  name: string;
  issuer?: string;
  date: string;
  description: string;
}

// Skill with level
export interface Skill {
  name: string;
  level: number;
}

// Skill Category
export interface SkillCategory {
  name: string;
  icon: string;
  skills: Skill[];
}

// Visual Skill (for skills grid)
export interface VisualSkill {
  name: string;
  icon: string;
  color: string;
}

// Social Link
export interface SocialLink {
  name: string;
  url: string;
  username: string;
  icon: string;
}

// AI Capability
export interface AICapability {
  icon: string;
  title: string;
  description: string;
  iconColor: string;
}

// Slash Command
export interface SlashCommand {
  description: string;
  query: string;
}

// Easter Egg
export interface EasterEgg {
  trigger: string;
  response: string;
}

// AI Configuration
export interface AIConfig {
  capabilities: AICapability[];
  slashCommands: Record<string, SlashCommand>;
  easterEggs: Record<string, string>;
  systemPromptName: string;
  fallbackContext: string;
}

// Hero Content
export interface HeroContent {
  greeting: string;
  roles: string[];
  description: string;
  ctaButtons: {
    primary: {
      text: string;
      href: string;
      icon: string;
    };
    secondary?: {
      text: string;
      href: string;
      icon: string;
    };
  };
}

// Language
export interface Language {
  language: string;
  proficiency: string;
}

// About Configuration
export interface AboutConfig {
  languages: Language[];
  interests: string[];
  softSkills: string[];
}
