import React from 'react';
import { Github, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  githubLink: string;
  liveLink: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ title, description, technologies, githubLink, liveLink }) => {
  return (
    <div className="group relative overflow-hidden rounded-xl p-1 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-75 transition-all duration-500 group-hover:opacity-100"></div>
      <div className="relative h-full rounded-lg bg-white p-6 dark:bg-gray-800 transition-all duration-500 dark:bg-opacity-80 backdrop-blur-sm">
        <h3 className="mb-3 text-2xl font-bold text-gray-800 dark:text-white">{title}</h3>
        <p className="mb-4 text-gray-600 dark:text-gray-300">{description}</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {technologies.map((tech, index) => (
            <span key={index} className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              {tech}
            </span>
          ))}
        </div>
        <div className="flex justify-between">
          <a
            href={githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300"
          >
            <Github className="mr-1" size={16} />
            <span className="text-sm">GitHub</span>
          </a>
          <a
            href={liveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-300"
          >
            <ExternalLink className="mr-1" size={16} />
            <span className="text-sm">Live Demo</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;