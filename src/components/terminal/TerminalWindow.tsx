"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TerminalWindowProps {
  title?: string;
  children: ReactNode;
  className?: string;
  showDots?: boolean;
}

export default function TerminalWindow({
  title = "terminal",
  children,
  className,
  showDots = true,
}: TerminalWindowProps) {
  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden border border-terminal-border bg-terminal-bg",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-terminal-bg-alt border-b border-terminal-border">
        {showDots && (
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
            <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors" />
          </div>
        )}
        <span className="text-sm font-mono text-terminal-muted">{title}</span>
      </div>

      {/* Content */}
      <div className="p-4 font-mono text-sm text-terminal-text">{children}</div>
    </div>
  );
}
