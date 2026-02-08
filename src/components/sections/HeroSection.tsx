"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { personalInfo, socialLinks, heroContent } from "@/config";
import {
  Github,
  Linkedin,
  Twitter,
  MapPin,
  Mail,
  ExternalLink,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const iconMap: Record<string, LucideIcon> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Twitter: Twitter,
};

export default function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const roles = [
    "Full Stack Developer",
    "Agentic Coder",
    "AI Engineer",
    "Problem Solver",
  ];

  useEffect(() => {
    const currentRole = roles[roleIndex];

    if (isTyping) {
      if (displayText.length < currentRole.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentRole.slice(0, displayText.length + 1));
        }, 80);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 40);
        return () => clearTimeout(timeout);
      } else {
        setRoleIndex((prev) => (prev + 1) % roles.length);
        setIsTyping(true);
      }
    }
  }, [displayText, isTyping, roleIndex, roles]);

  return (
    <div className="h-full bento-card p-3 md:p-3.5 lg:p-4 xl:p-5 flex flex-col relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-terminal-green/5 via-transparent to-terminal-cyan/5" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-terminal-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      {/* Profile Image - Positioned top right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="absolute top-3 right-3 md:top-3.5 md:right-3.5 lg:top-4 lg:right-4 z-20"
      >
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 rounded-full overflow-hidden border-2 border-terminal-green/50 shadow-lg shadow-terminal-green/20">
          <Image
            src={personalInfo.profileImage}
            alt={personalInfo.fullName}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 rounded-full ring-2 ring-terminal-green/30 ring-offset-2 ring-offset-terminal-bg" />
        </div>
      </motion.div>

      {/* Main content - flex-1 to take available space, with auto overflow */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col gap-0.5 md:gap-1 lg:gap-1.5 pr-12 sm:pr-14 md:pr-16 lg:pr-20 xl:pr-24">
        {/* Availability Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-shrink-0"
        >
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-terminal-green/10 border border-terminal-green/30">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terminal-green opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-terminal-green" />
            </span>
            <span className="text-[8px] md:text-[9px] lg:text-[10px] font-medium text-terminal-green">
              {personalInfo.availability.message}
            </span>
          </span>
        </motion.div>

        {/* Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex-shrink-0"
        >
          <h1 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold leading-tight">
            <span className="text-foreground">{heroContent.greeting} </span>
            <span className="gradient-text">{personalInfo.firstName}</span>
          </h1>
        </motion.div>

        {/* Animated Role */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex-shrink-0"
        >
          <p className="text-[11px] md:text-xs lg:text-sm text-terminal-muted font-mono">
            <span className="text-terminal-cyan">&gt;</span>{" "}
            <span className="text-foreground">{displayText}</span>
            <span className="inline-block w-0.5 h-3 md:h-3.5 lg:h-4 ml-0.5 bg-terminal-green animate-cursor-blink align-middle" />
          </p>
        </motion.div>

        {/* Location & Email */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex-shrink-0 flex flex-col gap-0.5 text-[10px] md:text-[11px] lg:text-xs text-terminal-muted"
        >
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-terminal-green flex-shrink-0" />
            <span>{personalInfo.location.display}</span>
          </span>
          <a
            href={`mailto:${personalInfo.email}`}
            className="flex items-center gap-1 hover:text-terminal-cyan transition-colors min-w-0"
          >
            <Mail className="w-3 h-3 text-terminal-cyan flex-shrink-0" />
            <span className="truncate">{personalInfo.email}</span>
          </a>
        </motion.div>

        {/* Brief Description - Always visible, responsive sizing */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-terminal-muted text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] xl:text-xs leading-relaxed flex-shrink-0"
        >
          Building software at the speed of thought with{" "}
          <span className="text-terminal-cyan">AI-native</span> tools.
          Shipping production code with{" "}
          <span className="text-terminal-cyan">Claude Code</span> &{" "}
          <span className="text-terminal-cyan">agentic workflows</span>.
        </motion.p>
      </div>

      {/* Bottom: Social Links - always pinned to bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="relative z-10 flex-shrink-0 flex items-center gap-1 md:gap-1.5 pt-1.5"
      >
        {socialLinks.map((link, index) => {
          const Icon = iconMap[link.name] || ExternalLink;
          return (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <Link
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded-lg
                           bg-inner-card-bg border border-inner-card-border
                           hover:bg-terminal-green/10 hover:border-terminal-green/50
                           text-terminal-muted hover:text-terminal-green
                           transition-all duration-300 icon-glow"
                aria-label={link.name}
              >
                <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
