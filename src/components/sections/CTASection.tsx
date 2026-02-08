"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin, Sparkles } from "lucide-react";
import Link from "next/link";
import { personalInfo, socialLinks } from "@/config";

export default function CTASection() {
  const linkedinLink = socialLinks.find((l) => l.name === "LinkedIn");

  return (
    <div className="h-full bento-card relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-terminal-green/5 via-transparent to-terminal-cyan/5" />

      <div className="relative z-10 h-full p-3 flex flex-col justify-center items-center text-center gap-2">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-terminal-green/15 to-terminal-cyan/15 border border-terminal-green/20 flex items-center justify-center">
            <Sparkles size={14} className="text-terminal-green" />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm font-bold text-foreground"
        >
          Let&apos;s Work Together
        </motion.h2>

        {/* Contact Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-1.5"
        >
          <a
            href={`mailto:${personalInfo.email}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                       bg-gradient-to-r from-terminal-green to-terminal-cyan
                       text-background dark:text-foreground font-medium text-[10px]
                       hover:shadow-lg hover:shadow-terminal-green/20
                       transition-all duration-300"
          >
            <Mail size={11} />
            <span>Email</span>
          </a>

          {linkedinLink && (
            <Link
              href={linkedinLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                         bg-inner-card-bg border border-inner-card-border
                         text-foreground font-medium text-[10px]
                         hover:bg-white/10 hover:border-terminal-cyan/30
                         transition-all duration-300"
            >
              <Linkedin size={11} />
              <span>LinkedIn</span>
            </Link>
          )}
        </motion.div>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-1.5"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terminal-green opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-terminal-green" />
          </span>
          <span className="text-[9px] text-terminal-green">
            {personalInfo.availability.message}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
