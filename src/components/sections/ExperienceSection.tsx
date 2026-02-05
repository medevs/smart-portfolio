"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin, Calendar } from "lucide-react";
import { experiences } from "@/config";

const typeColors = {
  fulltime: "bg-terminal-green/20 text-terminal-green border-terminal-green/30",
  freelance: "bg-terminal-cyan/20 text-terminal-cyan border-terminal-cyan/30",
  contract: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  internship: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

const typeLabels = {
  fulltime: "Full",
  freelance: "Free",
  contract: "Contract",
  internship: "Intern",
};

export default function ExperienceSection() {
  return (
    <div className="h-full bento-card p-2 lg:p-3 flex flex-col overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-1.5 mb-2 flex-shrink-0"
      >
        <div className="w-6 h-6 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
          <Briefcase size={12} className="text-purple-400" />
        </div>
        <h2 className="text-sm font-semibold text-foreground">Experience</h2>
      </motion.div>

      {/* Timeline - Scrollable */}
      <div className="flex-1 overflow-y-auto scrollbar-hide relative min-h-0">
        {/* Timeline line */}
        <div className="absolute left-[5px] top-1 bottom-1 w-0.5 bg-gradient-to-b from-terminal-green via-terminal-cyan to-transparent" />

        <div className="space-y-1.5">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + index * 0.05 }}
              className="relative pl-4"
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-2 w-2.5 h-2.5 rounded-full bg-surface-primary border-2 border-terminal-green" />

              {/* Content */}
              <div className="group p-2 rounded-lg bg-white/5 border border-card-theme-border hover:border-terminal-green/30 transition-all">
                {/* Header */}
                <div className="flex items-start justify-between gap-1 mb-1">
                  <div className="min-w-0">
                    <h3 className="text-[11px] font-semibold text-foreground group-hover:text-terminal-green transition-colors truncate">
                      {exp.role}
                    </h3>
                    <p className="text-[9px] text-terminal-cyan truncate">
                      {exp.company}
                    </p>
                  </div>
                  <span
                    className={`flex-shrink-0 px-1 py-0.5 text-[7px] font-medium rounded border ${typeColors[exp.type]}`}
                  >
                    {typeLabels[exp.type]}
                  </span>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-2 text-[8px] text-terminal-muted">
                  <span className="flex items-center gap-0.5">
                    <Calendar size={8} />
                    {exp.period}
                  </span>
                  <span className="flex items-center gap-0.5">
                    <MapPin size={8} />
                    {exp.location}
                  </span>
                </div>

                {/* Tech - only show on larger screens */}
                <div className="hidden lg:flex flex-wrap gap-1 mt-1">
                  {exp.tech.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-1 py-0.5 text-[7px] rounded bg-white/5 border border-card-theme-border text-terminal-muted"
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
