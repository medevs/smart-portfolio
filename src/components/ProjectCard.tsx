import React from 'react';
import { Github, ExternalLink, Star, GitFork, Clock } from 'lucide-react';
import TechIcon from './TechIcon';

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
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
        <h3 className="mb-3 text-2xl font-bold text-gray-800 dark:text-white md:block hidden">{title}</h3>
        <p className="mb-4 text-gray-600 dark:text-gray-300 flex-grow md:block hidden">{description}</p>
        <div className="mt-auto space-y-4">
          <div className="flex flex-wrap gap-2 md:block hidden">
            {technologies.map((tech, index) => (
              <TechIcon key={index} name={tech} />
            ))}
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Star size={16} className="mr-1" />
                <span className="md:inline hidden">{stars}</span>
              </span>
              <span className="flex items-center">
                <GitFork size={16} className="mr-1" />
                <span className="md:inline hidden">{forks}</span>
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
              <span className="text-sm md:inline hidden">GitHub</span>
            </a>
            {liveLink && (
              <a
                href={liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-300"
              >
                <ExternalLink className="mr-1" size={20} />
                <span className="text-sm md:inline hidden">Live Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;