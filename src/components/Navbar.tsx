"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { Terminal, Github, Linkedin, Twitter } from "lucide-react";

const socialLinks = [
  { name: "GitHub", href: "https://github.com/medevs", icon: Github },
  { name: "LinkedIn", href: "https://linkedin.com/in/ahmed-oublihi", icon: Linkedin },
  { name: "Twitter", href: "https://twitter.com/AhmedOublihi", icon: Twitter },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-terminal-border bg-terminal-bg/95 backdrop-blur supports-[backdrop-filter]:bg-terminal-bg/80">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo / Home link */}
          <Link
            href="/"
            className="flex items-center gap-2 text-terminal-text hover:text-terminal-green transition-colors"
          >
            <Terminal size={20} className="text-terminal-green" />
            <span className="font-mono text-sm hidden sm:inline">
              <span className="text-terminal-muted">~/</span>
              <span className="text-terminal-green">ahmed</span>
              <span className="text-terminal-muted">/</span>
              <span className="text-terminal-cyan">portfolio</span>
            </span>
            <span className="font-mono text-sm sm:hidden text-terminal-green">
              ahmed
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Social links */}
            <div className="hidden sm:flex items-center gap-1">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-md text-terminal-muted hover:text-terminal-green hover:bg-terminal-bg-alt transition-colors"
                  aria-label={link.name}
                >
                  <link.icon size={18} />
                </a>
              ))}
            </div>

            {/* Divider */}
            <div className="hidden sm:block h-5 w-px bg-terminal-border" />

            {/* Theme toggle */}
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
