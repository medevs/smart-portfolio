"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Terminal,
  Cpu,
  Workflow,
  Sparkles,
  ChevronRight,
  Rocket,
} from "lucide-react";

const agenticTools = [
  {
    name: "Claude Code",
    tag: "opus-4.6",
    color: "text-orange-600 dark:text-orange-400",
    borderColor: "border-orange-300 dark:border-orange-400/30",
    bgColor: "bg-orange-50 dark:bg-orange-400/10",
    icon: Terminal,
    desc: "AI pair programmer",
  },
  {
    name: "Antigravity",
    tag: "v2.0",
    color: "text-violet-600 dark:text-violet-400",
    borderColor: "border-violet-300 dark:border-violet-400/30",
    bgColor: "bg-violet-50 dark:bg-violet-400/10",
    icon: Rocket,
    desc: "Code acceleration",
  },
  {
    name: "Cursor",
    tag: "agent",
    color: "text-sky-600 dark:text-sky-400",
    borderColor: "border-sky-300 dark:border-sky-400/30",
    bgColor: "bg-sky-50 dark:bg-sky-400/10",
    icon: Cpu,
    desc: "AI-native editor",
  },
  {
    name: "LangChain",
    tag: "agents",
    color: "text-emerald-600 dark:text-emerald-400",
    borderColor: "border-emerald-300 dark:border-emerald-400/30",
    bgColor: "bg-emerald-50 dark:bg-emerald-400/10",
    icon: Workflow,
    desc: "Agent orchestration",
  },
];

const terminalLines = [
  { type: "prompt", text: "claude --model opus-4.6" },
  { type: "output", text: "  Claude Code v2.1.34", color: "text-orange-600 dark:text-orange-400" },
  { type: "output", text: "  Model: Opus 4.6 \u00b7 Claude Max", color: "text-terminal-muted" },
  { type: "blank", text: "" },
  { type: "prompt", text: "agent deploy --stack fullstack" },
  { type: "success", text: "  \u2714 RAG pipeline initialized" },
  { type: "success", text: "  \u2714 Vector embeddings ready" },
  { type: "success", text: "  \u2714 Tool calling configured" },
  { type: "output", text: "  Agent deployed successfully.", color: "text-terminal-green" },
  { type: "blank", text: "" },
  { type: "prompt", text: "status --mode agentic" },
  { type: "output", text: "  Agentic Coder \u00b7 Pro", color: "text-amber-600 dark:text-amber-400" },
  { type: "output", text: "  Ships code with AI superpowers.", color: "text-terminal-muted" },
];

export default function AgenticSection() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visibleLines < terminalLines.length) {
      const delay = terminalLines[visibleLines]?.type === "blank" ? 300 :
                    terminalLines[visibleLines]?.type === "prompt" ? 600 : 150;
      const timeout = setTimeout(() => {
        setVisibleLines((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [visibleLines]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleLines]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full bento-card p-0 flex flex-col overflow-hidden relative">
      {/* Ambient glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Terminal Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-inner-card-bg border-b border-inner-card-border flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
            <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
            <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
          </div>
          <div className="flex items-center gap-1 ml-2 min-w-0">
            <Terminal size={10} className="text-terminal-muted flex-shrink-0" />
            <span className="text-[9px] font-mono text-terminal-muted truncate">
              ahmed@dev<span className="text-terminal-muted/50">:</span><span className="text-terminal-cyan">~/agentic</span>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terminal-green opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-terminal-green" />
          </span>
          <span className="text-[8px] font-mono text-terminal-green">LIVE</span>
        </div>
      </div>

      {/* Terminal Body */}
      <div
        ref={scrollRef}
        className="flex-1 px-3 py-2 font-mono text-[10px] leading-relaxed overflow-y-auto scrollbar-hide min-h-0 relative"
      >
        {terminalLines.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-start"
          >
            {line.type === "blank" ? (
              <div className="h-2.5" />
            ) : line.type === "prompt" ? (
              <div className="flex items-center gap-1">
                <ChevronRight size={8} className="text-terminal-green flex-shrink-0 mt-[1px]" />
                <span className="text-terminal-text">{line.text}</span>
              </div>
            ) : line.type === "success" ? (
              <span className="text-terminal-green">{line.text}</span>
            ) : (
              <span className={line.color || "text-terminal-muted"}>
                {line.text}
              </span>
            )}
          </motion.div>
        ))}

        {/* Blinking cursor at the end */}
        {visibleLines >= terminalLines.length && (
          <div className="flex items-center gap-1 mt-0.5">
            <ChevronRight size={8} className="text-terminal-green flex-shrink-0" />
            <span
              className={`inline-block w-[5px] h-3 bg-terminal-green transition-opacity duration-100 ${
                cursorVisible ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        )}
      </div>

      {/* Agentic Tools Strip */}
      <div className="flex-shrink-0 border-t border-inner-card-border bg-inner-card-bg">
        {/* Section label */}
        <div className="px-3 pt-1.5 pb-1 flex items-center gap-1.5">
          <Sparkles size={9} className="text-terminal-green" />
          <span className="text-[8px] font-semibold uppercase tracking-widest text-terminal-muted">
            Agentic Stack
          </span>
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-2 gap-1 px-2 pb-2">
          {agenticTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-md border ${tool.borderColor} ${tool.bgColor} hover:scale-[1.02] transition-all duration-200 cursor-default`}
              >
                <Icon size={11} className={`${tool.color} flex-shrink-0`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1">
                    <span className={`text-[8px] lg:text-[9px] font-bold ${tool.color}`}>
                      {tool.name}
                    </span>
                    <span className="text-[7px] text-terminal-muted/60 font-mono hidden lg:inline">
                      {tool.tag}
                    </span>
                  </div>
                  <p className="text-[7px] text-terminal-muted truncate hidden lg:block">
                    {tool.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
