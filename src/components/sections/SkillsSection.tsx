"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Server, Database, Brain, LucideIcon } from "lucide-react";
import { skillCategories } from "@/config";

const iconMap: Record<string, LucideIcon> = {
  Code2,
  Server,
  Database,
  Brain,
};

export default function SkillsSection() {
  const [activeCategory, setActiveCategory] = useState<string | null>(
    "Frontend"
  );

  return (
    <div className="h-full bento-card p-2 lg:p-3 flex flex-col overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-1.5 mb-2"
      >
        <div className="w-6 h-6 rounded-lg bg-terminal-green/10 border border-terminal-green/30 flex items-center justify-center">
          <Code2 size={12} className="text-terminal-green" />
        </div>
        <h2 className="text-sm font-semibold text-white">Skills</h2>
      </motion.div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1 mb-2">
        {skillCategories.map((category) => {
          const Icon = iconMap[category.icon] || Code2;
          const isActive = activeCategory === category.name;
          return (
            <button
              key={category.name}
              onClick={() => setActiveCategory(isActive ? null : category.name)}
              className={`
                flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium
                transition-all duration-200
                ${
                  isActive
                    ? "bg-terminal-green/20 border-terminal-green/50 text-terminal-green"
                    : "bg-white/5 border-white/10 text-terminal-muted hover:text-white"
                }
                border
              `}
            >
              <Icon size={10} />
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Skills Display */}
      <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0">
        <AnimatePresence mode="wait">
          {activeCategory ? (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="space-y-1.5"
            >
              {skillCategories
                .find((c) => c.name === activeCategory)
                ?.skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[11px] text-white">
                        {skill.name}
                      </span>
                      <span className="text-[9px] text-terminal-muted">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 0.5, delay: index * 0.03 }}
                        className="h-full bg-gradient-to-r from-terminal-green to-terminal-cyan rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-wrap gap-1"
            >
              {skillCategories.flatMap((category) =>
                category.skills.map((skill) => (
                  <span
                    key={skill.name}
                    className="px-2 py-1 rounded text-[10px] font-medium
                               bg-white/5 border border-white/10 text-terminal-muted"
                  >
                    {skill.name}
                  </span>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
