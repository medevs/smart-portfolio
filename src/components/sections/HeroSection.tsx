"use client";

import { useState, useEffect } from "react";
import TerminalWindow from "@/components/terminal/TerminalWindow";
import CommandPrompt from "@/components/terminal/CommandPrompt";
import { socialLinks } from "@/data/products";
import { Github, Linkedin, Twitter, MapPin, Mail, ExternalLink, LucideIcon } from "lucide-react";
import Link from "next/link";

const iconMap: Record<string, LucideIcon> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Twitter: Twitter,
};

export default function HeroSection() {
  const [showContent, setShowContent] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullText = "whoami";

  useEffect(() => {
    // Typing animation for command
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => setShowContent(true), 300);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <section className="py-8 px-4">
      <TerminalWindow title="ahmed@portfolio:~" className="max-w-4xl mx-auto">
        <div className="space-y-4">
          {/* Command */}
          <CommandPrompt>
            <span>{typedText}</span>
            {!showContent && (
              <span className="inline-block w-2 h-4 ml-0.5 bg-terminal-green animate-cursor-blink" />
            )}
          </CommandPrompt>

          {/* Output */}
          {showContent && (
            <div className="space-y-6 animate-fade-in">
              {/* Name and Title */}
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold text-terminal-green">
                  Ahmed Oublihi
                </h1>
                <p className="text-lg text-terminal-cyan">
                  Full Stack Developer & AI Engineer
                </p>
              </div>

              {/* Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-terminal-muted">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-terminal-green" />
                  Bremen, Germany
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail size={14} className="text-terminal-cyan" />
                  <a
                    href="mailto:oublihi.a@gmail.com"
                    className="hover:text-terminal-cyan transition-colors"
                  >
                    oublihi.a@gmail.com
                  </a>
                </span>
              </div>

              {/* Summary */}
              <div className="border-l-2 border-terminal-green/50 pl-4 text-terminal-text/90">
                <p className="leading-relaxed">
                  Building intelligent software with modern web technologies.
                  Specializing in <span className="text-terminal-cyan">React</span>,{" "}
                  <span className="text-terminal-cyan">Next.js</span>,{" "}
                  <span className="text-terminal-cyan">TypeScript</span>, and{" "}
                  <span className="text-terminal-cyan">AI/ML</span> integration.
                  Passionate about creating efficient, user-focused applications
                  with clean code.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link) => {
                  const Icon = iconMap[link.name] || ExternalLink;
                  return (
                    <Link
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-md
                                 bg-terminal-bg-alt border border-terminal-border
                                 text-terminal-muted hover:text-terminal-green hover:border-terminal-green/50
                                 transition-all duration-200 text-sm"
                    >
                      <Icon size={16} />
                      <span className="hidden sm:inline">{link.username}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </TerminalWindow>
    </section>
  );
}
