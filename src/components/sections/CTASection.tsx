"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <div className="h-full bento-card relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-terminal-green/10 via-transparent to-terminal-cyan/10" />
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-terminal-green/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-terminal-cyan/20 rounded-full blur-3xl" />

      <div className="relative z-10 h-full p-3 flex flex-col justify-center items-center text-center">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-2"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-terminal-green/20 to-terminal-cyan/20 border border-terminal-green/30 flex items-center justify-center">
            <Sparkles size={20} className="text-terminal-green" />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-base font-bold text-white mb-1"
        >
          Let&apos;s Work Together
        </motion.h2>

        {/* Contact Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-2 mt-2"
        >
          <a
            href="mailto:oublihi.a@gmail.com"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                       bg-gradient-to-r from-terminal-green to-terminal-cyan
                       text-slate-900 font-medium text-[11px]
                       hover:shadow-lg hover:shadow-terminal-green/25
                       transition-all duration-300 btn-glow"
          >
            <Mail size={12} />
            <span>Email</span>
          </a>

          <Link
            href="https://linkedin.com/in/ahmed-oublihi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                       bg-white/5 border border-white/10
                       text-white font-medium text-[11px]
                       hover:bg-white/10 hover:border-terminal-cyan/30
                       transition-all duration-300"
          >
            <Linkedin size={12} />
            <span>LinkedIn</span>
          </Link>
        </motion.div>

        {/* Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-2 flex items-center gap-1.5"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terminal-green opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-terminal-green" />
          </span>
          <span className="text-[10px] text-terminal-green">
            Available for work
          </span>
        </motion.div>
      </div>
    </div>
  );
}
