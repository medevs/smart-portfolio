'use client'

import React from 'react';
import { GithubIcon, ExternalLink } from 'lucide-react';
import { 
  SiNextdotjs, SiOpenai, SiReact, SiTypescript, 
  SiTailwindcss, SiPrisma, SiMongodb, SiNodedotjs,
  SiLaravel, SiPhp, SiMysql, SiDocker
} from 'react-icons/si';

const techIcons: { [key: string]: JSX.Element } = {
  'Next.js': <SiNextdotjs className="w-4 h-4" />,
  'OpenAI': <SiOpenai className="w-4 h-4" />,
  'React': <SiReact className="w-4 h-4" />,
  'TypeScript': <SiTypescript className="w-4 h-4" />,
  'TailwindCSS': <SiTailwindcss className="w-4 h-4" />,
  'Prisma': <SiPrisma className="w-4 h-4" />,
  'MongoDB': <SiMongodb className="w-4 h-4" />,
  'Node.js': <SiNodedotjs className="w-4 h-4" />,
  'Laravel': <SiLaravel className="w-4 h-4" />,
  'PHP': <SiPhp className="w-4 h-4" />,
  'MySQL': <SiMysql className="w-4 h-4" />,
  'Docker': <SiDocker className="w-4 h-4" />
};

const projects = [
  {
    title: 'smart-portfolio',
    description: 'A Portfolio Website with an AI chatbot that can answer any question about you.',
    techStack: ['Next.js', 'OpenAI', 'TypeScript', 'TailwindCSS'],
    github: 'https://github.com/medevs/smart-portfolio',
    demo: 'https://portfolio.medevs.com',
    stars: 10,
    forks: 1
  },
  {
    title: 'supp-directory',
    description: 'A comprehensive supplements directory with detailed information and user reviews.',
    techStack: ['React', 'Node.js', 'MongoDB', 'TailwindCSS'],
    github: 'https://github.com/medevs/supp-directory',
    demo: 'https://supplements.medevs.com',
    stars: 0,
    forks: 0
  },
  {
    title: 'i-managments',
    description: 'Inventory management system with real-time tracking and analytics.',
    techStack: ['Laravel', 'PHP', 'MySQL', 'Docker'],
    github: 'https://github.com/medevs/i-managments',
    demo: 'https://i-managments.medevs.com',
    stars: 0,
    forks: 0
  },
  {
    title: 'careerai',
    description: 'AI-powered career guidance and job matching platform.',
    techStack: ['Next.js', 'OpenAI', 'Prisma', 'TypeScript'],
    github: 'https://github.com/medevs/careerai',
    demo: 'https://careerai.medevs.com',
    stars: 0,
    forks: 0
  }
];

const FeaturedProjects: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#151B28] rounded-lg p-4 h-full transition-colors">
      <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600 mb-4">
        Featured Projects
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 h-[calc(100%-3rem)]">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gradient-to-br dark:from-[#1E1E2E] dark:to-[#2D2D44] rounded-lg p-3 flex flex-col justify-between border border-gray-200 dark:border-gray-800/50 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-colors"
          >
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-200 mb-2">
                {project.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {project.description}
              </p>
              {project.techStack && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    >
                      {techIcons[tech]}
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">★</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{project.stars}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">⑂</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{project.forks}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProjects;