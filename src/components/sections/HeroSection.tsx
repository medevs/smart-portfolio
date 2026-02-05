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
  Download,
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

  const roles = heroContent.roles;

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
    <div className="h-full bento-card p-2.5 sm:p-3 md:p-4 lg:p-5 flex flex-col justify-between relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-terminal-green/5 via-transparent to-terminal-cyan/5" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-terminal-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      {/* Profile Image - Positioned top right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 md:top-4 md:right-4 z-20"
      >
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden border-2 border-terminal-green/50 shadow-lg shadow-terminal-green/20">
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

      <div className="relative z-10 space-y-0.5 sm:space-y-1 md:space-y-1.5 lg:space-y-2 pr-14 sm:pr-16 md:pr-20 lg:pr-24">
        {/* Availability Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-terminal-green/10 border border-terminal-green/30">
            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terminal-green opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-terminal-green" />
            </span>
            <span className="text-[9px] sm:text-[10px] md:text-xs font-medium text-terminal-green">
              {personalInfo.availability.message}
            </span>
          </span>
        </motion.div>

        {/* Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold">
            <span className="text-white">{heroContent.greeting} </span>
            <span className="gradient-text">{personalInfo.firstName}</span>
          </h1>
        </motion.div>

        {/* Animated Role */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="min-h-4 sm:min-h-5 md:min-h-6 lg:min-h-7"
        >
          <p className="text-[11px] sm:text-xs md:text-sm lg:text-base text-terminal-muted font-mono">
            <span className="text-terminal-cyan">&gt;</span>{" "}
            <span className="text-white">{displayText}</span>
            <span className="inline-block w-0.5 h-3 sm:h-3.5 md:h-4 lg:h-5 ml-0.5 bg-terminal-green animate-cursor-blink align-middle" />
          </p>
        </motion.div>

        {/* Location & Email */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center gap-x-2 gap-y-0.5 sm:gap-x-3 md:gap-x-4 text-[10px] sm:text-[11px] md:text-xs lg:text-sm text-terminal-muted"
        >
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-terminal-green flex-shrink-0" />
            <span>{personalInfo.location.display}</span>
          </span>
          <a
            href={`mailto:${personalInfo.email}`}
            className="flex items-center gap-1 hover:text-terminal-cyan transition-colors"
          >
            <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-terminal-cyan flex-shrink-0" />
            <span className="break-all">{personalInfo.email}</span>
          </a>
        </motion.div>

        {/* Brief Description - Hidden on small screens to save space */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="hidden md:block text-terminal-text/80 text-[11px] md:text-xs lg:text-sm leading-relaxed max-w-md"
        >
          Building intelligent software with modern web technologies.
          Specializing in <span className="text-terminal-cyan">React</span>,{" "}
          <span className="text-terminal-cyan">Next.js</span>, and{" "}
          <span className="text-terminal-cyan">AI/ML</span> integration.
        </motion.p>
      </div>

      {/* Bottom: Social Links & CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="relative z-10 flex flex-wrap items-center gap-1.5 sm:gap-2 pt-1 sm:pt-2"
      >
        {/* Social Links */}
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
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
                  className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded-md sm:rounded-lg
                             bg-white/5 border border-white/10
                             hover:bg-terminal-green/10 hover:border-terminal-green/50
                             text-terminal-muted hover:text-terminal-green
                             transition-all duration-300 icon-glow"
                  aria-label={link.name}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="h-5 sm:h-6 md:h-7 w-px bg-white/10 hidden sm:block" />

        {/* Download CV Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1 }}
        >
          <Link
            href={personalInfo.resumeUrl}
            target="_blank"
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-md sm:rounded-lg
                       bg-gradient-to-r from-terminal-green to-terminal-cyan
                       text-slate-900 font-medium text-[10px] sm:text-xs md:text-sm
                       hover:shadow-lg hover:shadow-terminal-green/25
                       transition-all duration-300 btn-glow"
          >
            <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
            <span>{heroContent.ctaButtons.primary.text}</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
