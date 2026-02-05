"use client";

import { motion } from "framer-motion";
import { Bot, Database, Zap, Brain, Sparkles } from "lucide-react";

const capabilities = [
  {
    icon: Brain,
    title: "RAG",
    description: "Vector search & retrieval",
    iconColor: "text-purple-400",
  },
  {
    icon: Bot,
    title: "Agents",
    description: "LangChain & tools",
    iconColor: "text-terminal-green",
  },
  {
    icon: Database,
    title: "Vector DBs",
    description: "pgvector & embeddings",
    iconColor: "text-terminal-cyan",
  },
  {
    icon: Zap,
    title: "LLMs",
    description: "OpenAI & streaming",
    iconColor: "text-amber-400",
  },
];

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
        <h2 className="text-sm font-semibold text-white">AI Capabilities</h2>
      </motion.div>

      {/* Feature Cards Grid - Compact */}
      <div className="grid grid-cols-2 gap-1.5 flex-1 min-h-0">
        {capabilities.map((cap, index) => {
          const Icon = cap.icon;
          return (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + index * 0.05 }}
              className="group p-2 rounded-lg bg-white/5 border border-white/10 hover:border-terminal-green/30 transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded flex-shrink-0 bg-white/5 border border-white/10 flex items-center justify-center">
                  <Icon size={12} className={cap.iconColor} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[11px] font-semibold text-white group-hover:text-terminal-green transition-colors">
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
