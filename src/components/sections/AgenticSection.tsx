"use client";

import { motion } from "framer-motion";
import { Bot, Database, Zap, Brain, Sparkles, LucideIcon } from "lucide-react";
import { aiConfig } from "@/config";

const iconMap: Record<string, LucideIcon> = {
  Brain,
  Bot,
  Database,
  Zap,
};

export default function AgenticSection() {
  return (
    <div className="h-full bento-card p-2 lg:p-3 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-1.5 mb-2"
      >
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-terminal-green/20 to-terminal-cyan/20 border border-terminal-green/30 flex items-center justify-center">
          <Sparkles size={12} className="text-terminal-green" />
        </div>
        <h2 className="text-sm font-semibold text-foreground">AI Capabilities</h2>
      </motion.div>

      {/* Feature Cards Grid - Compact */}
      <div className="grid grid-cols-2 gap-1.5 flex-1 min-h-0">
        {aiConfig.capabilities.map((cap, index) => {
          const Icon = iconMap[cap.icon] || Sparkles;
          return (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + index * 0.05 }}
              className="group p-2 rounded-lg bg-white/5 border border-card-theme-border hover:border-terminal-green/30 transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded flex-shrink-0 bg-white/5 border border-card-theme-border flex items-center justify-center">
                  <Icon size={12} className={cap.iconColor} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[11px] font-semibold text-foreground group-hover:text-terminal-green transition-colors">
                    {cap.title}
                  </h3>
                  <p className="text-[9px] text-terminal-muted truncate">
                    {cap.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
