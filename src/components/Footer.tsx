"use client";

import AIChatButton from "./AIChatButton";
import { Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Status bar footer */}
      <footer className="flex-shrink-0 border-t border-terminal-border bg-terminal-bg/95 backdrop-blur">
        <div className="container mx-auto px-4 h-7 flex items-center justify-between text-[11px] font-mono">
          {/* Left side */}
          <div className="flex items-center gap-4 text-terminal-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
              <span className="hidden sm:inline">READY</span>
            </span>
            <span className="hidden md:inline text-terminal-muted/70">
              Next.js • TypeScript • AI
            </span>
          </div>

          {/* Center */}
          <div className="flex items-center gap-1 text-terminal-muted/70">
            <span>Built with</span>
            <Heart size={12} className="text-red-400" />
            <span>by Ahmed</span>
          </div>

          {/* Right side */}
          <div className="text-terminal-muted/70">
            <span>{currentYear}</span>
          </div>
        </div>
      </footer>

      {/* Chat button */}
      <AIChatButton />
    </>
  );
}
