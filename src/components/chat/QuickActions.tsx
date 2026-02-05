"use client";

import { Code2, Briefcase, GraduationCap, Mail, BookOpen, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionsProps {
  onCommand: (command: string) => void;
  disabled?: boolean;
}

const commands = [
  { command: "/skills", label: "Skills", icon: Code2 },
  { command: "/projects", label: "Projects", icon: Sparkles },
  { command: "/experience", label: "Experience", icon: Briefcase },
  { command: "/education", label: "Education", icon: GraduationCap },
  { command: "/blog", label: "Blog", icon: BookOpen },
  { command: "/hire", label: "Hire Me", icon: Mail },
];

export default function QuickActions({ onCommand, disabled }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-white/5 bg-surface-elevated/30">
      {commands.map(({ command, label, icon: Icon }) => (
        <button
          key={command}
          onClick={() => onCommand(command)}
          disabled={disabled}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5",
            "rounded-full text-xs font-medium",
            "bg-white/5 hover:bg-white/10",
            "border border-card-theme-border hover:border-terminal-green/30",
            "text-terminal-muted hover:text-terminal-green",
            "transition-all duration-200",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/5 disabled:hover:border-card-theme-border disabled:hover:text-terminal-muted"
          )}
        >
          <Icon size={12} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
