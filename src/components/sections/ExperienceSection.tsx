"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin, Calendar } from "lucide-react";
import { experiences } from "@/config";

const typeColors = {
  fulltime: "bg-terminal-green/15 text-terminal-green border-terminal-green/30",
  freelance: "bg-terminal-cyan/15 text-terminal-cyan border-terminal-cyan/30",
  contract: "bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/20",
  internship: "bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-500/20",
};

const typeLabels = {
  fulltime: "Full",
  freelance: "Free",
  contract: "Contract",
  internship: "Intern",
};

export default function ExperienceSection() {
  return (
    <div className="h-full bento-card p-2.5 lg:p-3 flex flex-col overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-1.5 mb-1.5 flex-shrink-0"
      >
        <div className="w-5 h-5 rounded-lg bg-purple-500/10 flex items-center justify-center">
          <Briefcase size={11} className="text-purple-400" />
        </div>
        <h2 className="text-xs font-semibold text-foreground">Experience</h2>
      </motion.div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto scrollbar-hide relative min-h-0">
        {/* Timeline line */}
        <div className="absolute left-[4px] top-1 bottom-1 w-px bg-gradient-to-b from-terminal-green via-terminal-cyan to-transparent" />

        <div className="space-y-1">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + index * 0.05 }}
              className="relative pl-3.5"
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-[7px] w-2 h-2 rounded-full bg-surface-primary border-[1.5px] border-terminal-green" />

              {/* Content */}
              <div className="group p-1.5 rounded-lg bg-inner-card-bg border border-inner-card-border hover:border-terminal-green/20 transition-all">
                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[10px] font-semibold text-foreground group-hover:text-terminal-green transition-colors truncate leading-tight">
                      {exp.role}
                    </h3>
                    <p className="text-[8px] text-terminal-cyan truncate">
                      {exp.company}
                    </p>
                  </div>
                  <span
                    className={`flex-shrink-0 px-1 py-0.5 text-[6px] font-medium rounded border ${typeColors[exp.type]}`}
                  >
                    {typeLabels[exp.type]}
                  </span>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-1.5 text-[7px] text-terminal-muted mt-0.5">
                  <span className="flex items-center gap-0.5">
                    <Calendar size={7} />
                    {exp.period}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <MapPin size={7} />
                    {exp.location}
                  </span>
                </div>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-0.5 mt-1">
                  {exp.tech.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-1 py-0.5 text-[6px] rounded bg-inner-card-bg border border-inner-card-border text-terminal-muted"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
