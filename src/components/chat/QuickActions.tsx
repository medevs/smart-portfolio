"use client";

import { Code2, Briefcase, GraduationCap, Mail, BookOpen, Sparkles } from "lucide-react";

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
    <div className="flex flex-wrap gap-2 p-3 border-b border-terminal-border bg-terminal-bg-alt/50">
      {commands.map(({ command, label, icon: Icon }) => (
        <button
          key={command}
          onClick={() => onCommand(command)}
          disabled={disabled}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-md
                     bg-terminal-bg border border-terminal-border
                     text-terminal-muted hover:text-terminal-green hover:border-terminal-green/50
                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                     hover:shadow-terminal-glow"
        >
          <Icon size={12} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
