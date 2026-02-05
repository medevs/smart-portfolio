"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CommandPromptProps {
  user?: string;
  host?: string;
  path?: string;
  children?: ReactNode;
  className?: string;
}

export default function CommandPrompt({
  user = "ahmed",
  host = "portfolio",
  path = "~",
  children,
  className,
}: CommandPromptProps) {
  return (
    <div className={cn("font-mono text-sm flex items-start gap-2", className)}>
      <span className="flex-shrink-0 text-terminal-muted">
        <span className="text-terminal-green">{user}</span>
        <span className="text-terminal-muted">@</span>
        <span className="text-terminal-cyan">{host}</span>
        <span className="text-terminal-muted">:</span>
        <span className="text-terminal-cyan">{path}</span>
        <span className="text-terminal-muted">$</span>
      </span>
      <span className="text-terminal-text">{children}</span>
    </div>
  );
}
