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
  return (
    <div className="h-full flex flex-col md:flex-row gap-3 overflow-y-auto md:overflow-visible">
      {projects.map((project, index) => (
        <motion.div
          key={project.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + index * 0.1 }}
          className="flex-shrink-0 md:flex-shrink md:flex-1 md:min-w-0 h-[280px] sm:h-[320px] md:h-full"
        >
          <Link
            href={project.url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="group block h-full rounded-xl border border-white/10 bg-[#080c0a] overflow-hidden hover:border-terminal-green/40 transition-all duration-300 relative"
          >
            {/* Full Image Background */}
            <div className="absolute inset-0 flex items-center justify-center p-3 pb-28">
              {project.image ? (
                <div className="relative w-full h-full">
                  <Image
                    src={project.image}
                    alt={`${project.name} preview`}
                    fill
                    className="object-contain object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-terminal-green/10 to-terminal-cyan/10" />
              )}
            </div>

            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080c0a] via-[#080c0a]/80 via-35% to-transparent" />

            {/* Status badges - Top */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
              <span
                className={`px-2 py-0.5 text-[8px] lg:text-[9px] font-medium rounded-full border backdrop-blur-sm ${statusColors[project.status]}`}
              >
                {statusLabels[project.status]}
              </span>
              {index === 0 && (
                <span className="px-2 py-0.5 text-[8px] lg:text-[9px] text-white/80 bg-black/50 backdrop-blur-sm rounded-full border border-white/10">
                  Featured
                </span>
              )}
            </div>

            {/* Arrow indicator - Top Right */}
            <div className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
              <ArrowUpRight
                size={14}
                className="text-white group-hover:text-terminal-green transition-colors"
              />
            </div>

            {/* Content Overlay - Bottom */}
            <div className="absolute inset-x-0 bottom-0 p-3 z-10">
              <h3 className="text-sm lg:text-base font-bold text-white group-hover:text-terminal-green transition-colors mb-1">
                {project.name}
              </h3>

              <p className="text-[10px] lg:text-[11px] text-white/70 mb-2 line-clamp-2">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1">
                {project.tech.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="px-1.5 py-0.5 text-[7px] lg:text-[8px] font-medium rounded
                               bg-black/40 border border-white/20 text-terminal-cyan
                               backdrop-blur-sm"
                  >
                    {tech}
                  </span>
                ))}
                {project.tech.length > 3 && (
                  <span className="px-1 py-0.5 text-[7px] lg:text-[8px] text-white/50">
                    +{project.tech.length - 3}
                  </span>
                )}
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
