"use client";

import { motion } from "framer-motion";
import { projects } from "@/config";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const statusColors = {
  active: "bg-green-500/20 text-green-400 border-green-500/30",
  building: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  planned: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

const statusLabels = {
  active: "Live",
  building: "In Progress",
  planned: "Coming Soon",
};

export default function ProductsSection() {
  const featuredProject = projects[0];
  const otherProjects = projects.slice(1);

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Featured Project */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-1 min-h-0"
      >
        <Link
          href={featuredProject.url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="group block h-full bento-card overflow-hidden card-shine"
        >
          <div className="relative h-full flex flex-col">
            {/* Preview Image */}
            {featuredProject.image && (
              <div className="relative w-full h-24 sm:h-28 lg:h-32 overflow-hidden border-b border-white/10">
                <Image
                  src={featuredProject.image}
                  alt={`${featuredProject.name} preview`}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-terminal-bg via-transparent to-transparent" />
              </div>
            )}

            <div className="relative flex-1 p-3 lg:p-4 flex flex-col">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-terminal-green/5 via-transparent to-terminal-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Header */}
              <div className="relative flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 text-[9px] font-medium rounded-full border ${statusColors[featuredProject.status]}`}
                    >
                      {statusLabels[featuredProject.status]}
                    </span>
                    <span className="text-[9px] text-terminal-muted">
                      Featured Project
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-terminal-green transition-colors">
                    {featuredProject.name}
                  </h3>
                </div>
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-terminal-green/10 border border-terminal-green/30 flex items-center justify-center group-hover:bg-terminal-green/20 transition-colors">
                  <ArrowUpRight
                    size={16}
                    className="text-terminal-green group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </div>
              </div>

              {/* Description */}
              <p className="relative text-xs text-terminal-muted mb-2 line-clamp-2">
                {featuredProject.description}
              </p>

              {/* Tech Stack */}
              <div className="relative flex flex-wrap gap-1 mt-auto">
                {featuredProject.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-1.5 py-0.5 text-[9px] font-medium rounded
                               bg-white/5 border border-white/10 text-terminal-cyan
                               group-hover:border-terminal-cyan/30 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Other Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {otherProjects.map((project, index) => (
          <motion.div
            key={project.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Link
              href={project.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bento-card card-shine h-full overflow-hidden"
            >
              {/* Preview Image for secondary projects */}
              {project.image && (
                <div className="relative w-full h-16 sm:h-20 overflow-hidden border-b border-white/10">
                  <Image
                    src={project.image}
                    alt={`${project.name} preview`}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-terminal-bg via-transparent to-transparent" />
                </div>
              )}

              <div className="p-2.5 lg:p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="text-xs lg:text-sm font-semibold text-white group-hover:text-terminal-green transition-colors truncate">
                        {project.name}
                      </h4>
                      <span
                        className={`flex-shrink-0 px-1.5 py-0.5 text-[8px] font-medium rounded border ${statusColors[project.status]}`}
                      >
                        {statusLabels[project.status]}
                      </span>
                    </div>
                    <p className="text-[10px] text-terminal-muted line-clamp-1">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1">
                  {project.tech.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-1.5 py-0.5 text-[8px] rounded
                                 bg-white/5 border border-white/10 text-terminal-muted"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech.length > 3 && (
                    <span className="px-1.5 py-0.5 text-[8px] text-terminal-muted">
                      +{project.tech.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
