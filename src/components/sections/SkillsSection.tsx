"use client";

import { motion } from "framer-motion";
import { Code2, Server, Database, Brain, LucideIcon } from "lucide-react";
import { skillCategories } from "@/config";

const iconMap: Record<string, LucideIcon> = {
  Code2,
  Server,
  Database,
  Brain,
};

export default function SkillsSection() {
  return (
    <div className="h-full bento-card p-2.5 lg:p-3 flex flex-col overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-1.5 mb-1.5 flex-shrink-0"
      >
        <div className="w-5 h-5 rounded-lg bg-terminal-green/10 flex items-center justify-center">
          <Code2 size={11} className="text-terminal-green" />
        </div>
        <h2 className="text-xs font-semibold text-foreground">Skills</h2>
      </motion.div>

      {/* All Categories Grid */}
      <div className="flex-1 grid grid-cols-2 gap-2 min-h-0 overflow-y-auto scrollbar-hide">
        {skillCategories.map((category, catIndex) => {
          const Icon = iconMap[category.icon] || Code2;
          return (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + catIndex * 0.05 }}
              className="flex flex-col gap-1"
            >
              {/* Category Label */}
              <div className="flex items-center gap-1">
                <Icon
                  size={9}
                  className="text-terminal-green flex-shrink-0"
                />
                <span className="text-[8px] lg:text-[9px] font-semibold text-foreground truncate">
                  {category.name}
                </span>
              </div>

              {/* Skills */}
              <div className="space-y-1">
                {category.skills.map((skill, index) => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[8px] lg:text-[9px] text-foreground/80">
                        {skill.name}
                      </span>
                      <span className="text-[7px] lg:text-[8px] text-terminal-muted tabular-nums">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="h-1 bg-inner-card-bg border border-inner-card-border rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{
                          duration: 0.5,
                          delay: 0.1 + catIndex * 0.08 + index * 0.03,
                        }}
                        className="h-full bg-gradient-to-r from-terminal-green to-terminal-cyan rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
