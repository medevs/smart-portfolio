"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { socialLinks } from "@/data/products";
import { Github, Linkedin, Twitter, MapPin, Mail, Download, ExternalLink, LucideIcon, Sparkles } from "lucide-react";
import Link from "next/link";

const iconMap: Record<string, LucideIcon> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Twitter: Twitter,
};

const roles = [
  "Full Stack Developer",
  "AI Engineer",
  "Problem Solver",
  "Tech Enthusiast",
];

export default function HeroSection() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

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
  }, [displayText, isTyping, roleIndex]);

  return (
    <div className="h-full bento-card p-4 lg:p-5 flex flex-col justify-between relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-terminal-green/5 via-transparent to-terminal-cyan/5" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-terminal-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative z-10 space-y-2 lg:space-y-3">
        {/* Availability Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-terminal-green/10 border border-terminal-green/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terminal-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-terminal-green" />
            </span>
            <span className="text-xs font-medium text-terminal-green">Available for work</span>
          </span>
        </motion.div>

        {/* Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-2xl lg:text-3xl font-bold">
            <span className="text-white">Hi, I&apos;m </span>
            <span className="gradient-text">Ahmed Oublihi</span>
          </h1>
        </motion.div>

        {/* Animated Role */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="h-6"
        >
          <p className="text-base lg:text-lg text-terminal-muted font-mono">
            <span className="text-terminal-cyan">&gt;</span>{" "}
            <span className="text-white">{displayText}</span>
            <span className="inline-block w-0.5 h-5 ml-1 bg-terminal-green animate-cursor-blink align-middle" />
          </p>
        </motion.div>

        {/* Location & Email */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center gap-4 text-sm text-terminal-muted"
        >
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="text-terminal-green" />
            Bremen, Germany
          </span>
          <a
            href="mailto:oublihi.a@gmail.com"
            className="flex items-center gap-1.5 hover:text-terminal-cyan transition-colors"
          >
            <Mail size={14} className="text-terminal-cyan" />
            oublihi.a@gmail.com
          </a>
        </motion.div>

        {/* Brief Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-terminal-text/80 text-sm leading-relaxed max-w-md"
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
        className="relative z-10 flex flex-wrap items-center gap-2 pt-2"
      >
        {/* Social Links */}
        <div className="flex items-center gap-2">
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
                  className="flex items-center justify-center w-10 h-10 rounded-lg
                             bg-white/5 border border-white/10
                             hover:bg-terminal-green/10 hover:border-terminal-green/50
                             text-terminal-muted hover:text-terminal-green
                             transition-all duration-300 icon-glow"
                  aria-label={link.name}
                >
                  <Icon size={18} />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-white/10 hidden sm:block" />

        {/* Download CV Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1 }}
        >
          <Link
            href="/Ahmed_Oublihi_CV.pdf"
            target="_blank"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                       bg-gradient-to-r from-terminal-green to-terminal-cyan
                       text-slate-900 font-medium text-sm
                       hover:shadow-lg hover:shadow-terminal-green/25
                       transition-all duration-300 btn-glow"
          >
            <Download size={16} />
            <span>Download CV</span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
