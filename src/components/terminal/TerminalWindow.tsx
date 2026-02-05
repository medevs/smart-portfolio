"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TerminalWindowProps {
  title?: string;
  children: ReactNode;
  className?: string;
  showDots?: boolean;
  flexContent?: boolean;
}

export default function TerminalWindow({
  title = "terminal",
  children,
  className,
  showDots = true,
  flexContent = false,
}: TerminalWindowProps) {
  return (
    <div
      className={cn(
        // Glassmorphism base
        "rounded-xl overflow-hidden",
        "bg-terminal-bg/60 backdrop-blur-xl",
        "border border-card-theme-border",
        "shadow-glass",
        // Hover glow effect
        "hover:border-terminal-green/30",
        "hover:shadow-glass-hover",
        "transition-all duration-300",
        // Glow border effect
        "glow-border",
        flexContent && "flex flex-col",
        className
      )}
    >
      {/* Header with gradient line */}
      <div className="relative px-3 py-2 bg-gradient-to-r from-terminal-bg-alt/80 to-transparent flex-shrink-0">
        {/* Gradient bottom border */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-terminal-green/50 via-terminal-cyan/30 to-transparent" />

        <div className="flex items-center gap-3">
          {showDots && (
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer" />
            </div>
          )}
          <span className="text-xs font-mono text-terminal-muted">{title}</span>
        </div>
      </div>

      {/* Content */}
      <div className={cn(
        "p-3 font-mono text-sm text-terminal-text",
        flexContent && "flex-1 overflow-auto"
      )}>
        {children}
      </div>
    </div>
  );
}
