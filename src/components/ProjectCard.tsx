import React from 'react';
import { Github, ExternalLink, Star, GitFork, Clock } from 'lucide-react';
import * as Si from 'react-icons/si';

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: Array<{
    name: string;
    icon: string;
    color?: string;
  }>;
  githubLink: string;
  liveLink?: string;
  stars: number;
  forks: number;
  lastUpdated: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  technologies,
  githubLink,
  liveLink,
  stars,
  forks,
  lastUpdated
}) => {
  // Create a mapping of icon names to actual components
  const iconComponents: { [key: string]: React.ElementType } = {};
  Object.keys(Si).forEach(key => {
    iconComponents[key] = (Si as any)[key];
  });

  // Function to format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="group relative overflow-hidden rounded-xl p-1 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl flex-grow">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-75 transition-all duration-500 group-hover:opacity-100"></div>
      <div className="relative h-full rounded-lg bg-white p-6 dark:bg-gray-800 transition-all duration-500 dark:bg-opacity-80 backdrop-blur-sm flex flex-col">
        <h3 className="mb-3 text-xl md:text-2xl font-bold text-gray-800 dark:text-white">{title}</h3>
        <p className="mb-4 text-sm md:text-base text-gray-600 dark:text-gray-300 flex-grow">{description}</p>
        <div className="mt-auto space-y-4">
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => {
              const IconComponent = iconComponents[tech.icon];
              return IconComponent ? (
                <div
                  key={index}
                  className="inline-flex items-center bg-gray-100 dark:bg-gray-700 rounded-md px-2 py-1 mr-2"
                >
                  <div 
                    className="w-4 h-4 mr-1"
                    style={{ color: tech.color }}
                  >
                    <IconComponent className="w-full h-full" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {tech.name}
                  </span>
                </div>
              ) : null;
            })}
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Star size={16} className="mr-1" />
                <span>{stars}</span>
              </span>
              <span className="flex items-center">
                <GitFork size={16} className="mr-1" />
                <span>{forks}</span>
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-300"
            >
              <Github className="mr-1" size={20} />
              <span className="text-sm">GitHub</span>
            </a>
            {liveLink && (
              <a
                href={liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-300"
              >
                <ExternalLink className="mr-1" size={20} />
                <span className="text-sm">Live Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;