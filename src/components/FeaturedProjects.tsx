// components/FeaturedProjects.tsx
import React from 'react';
import { ExternalLink, LucideGithub } from 'lucide-react';

interface Project {
  icon: string;
  name: string;
  description: string;
  language: string;
  slug: string;
  link: string;
  sourceCode: string;
}

interface FeaturedProjectsProps {
  projects: Project[];
}

const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ projects }) => {
  return (
    <div className={`bg-neutral-400 rounded-lg shadow-md md:col-span-2 lg:col-span-3`}>
      <div className="p-4">
        <h2 className="text-xl font-bold">Featured Projects</h2>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-2">
        {projects.map((project, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md transition duration-300 ease-in-out transform hover:scale-105">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl text-indigo-500 dark:text-indigo-400">{project.icon}</span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{project.name}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{project.description}</p>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                <span className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded mr-2">{project.language}</span>
                <span>{project.slug}</span>
              </div>
            </div>
            <div className="flex border-t border-gray-200 dark:border-gray-600">
              <a href={project.link} className="flex-1 px-4 py-3 text-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-150 ease-in-out">
                <ExternalLink className="w-4 h-4 inline mr-1" />
                Live Project
              </a>
              <div className="border-l border-gray-200 dark:border-gray-600"></div>
              <a href={project.sourceCode} className="flex-1 px-4 py-3 text-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-150 ease-in-out">
                <LucideGithub className="w-4 h-4 inline mr-1" />
                Source Code
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturedProjects;