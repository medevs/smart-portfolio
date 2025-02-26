'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { githubService } from '@/lib/github';
import { GithubIcon, ExternalLink, Loader } from 'lucide-react';
import { 
  SiNextdotjs, SiOpenai, SiReact, SiTypescript, 
  SiTailwindcss, SiNodedotjs, SiMongodb,
  SiLaravel, SiPhp, SiMysql, SiDocker
} from 'react-icons/si';
import type { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

type GitHubRepo = RestEndpointMethodTypes["repos"]["listForUser"]["response"]["data"][0];

const techIcons: { [key: string]: React.ReactNode } = {
  'Next.js': <SiNextdotjs className="w-4 h-4" />,
  'OpenAI': <SiOpenai className="w-4 h-4" />,
  'React': <SiReact className="w-4 h-4" />,
  'TypeScript': <SiTypescript className="w-4 h-4" />,
  'TailwindCSS': <SiTailwindcss className="w-4 h-4" />,
  'Node.js': <SiNodedotjs className="w-4 h-4" />,
  'MongoDB': <SiMongodb className="w-4 h-4" />,
  'Laravel': <SiLaravel className="w-4 h-4" />,
  'PHP': <SiPhp className="w-4 h-4" />,
  'MySQL': <SiMysql className="w-4 h-4" />,
  'Docker': <SiDocker className="w-4 h-4" />
};

const FeaturedProjects: React.FC = () => {
  const [projects, setProjects] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const username = 'medevs';
      const { data: repos } = await githubService.getRepositories(username, {
        per_page: 100,
        type: 'owner'
      });

      // Sort by stars and update date
      const sortedRepos = repos.sort((a, b) => {
        // First compare by stars
        const starsA = a.stargazers_count || 0;
        const starsB = b.stargazers_count || 0;
        if (starsB !== starsA) {
          return starsB - starsA;
        }
        // If stars are equal, sort by update date
        const dateA = new Date(a.updated_at || 0).getTime();
        const dateB = new Date(b.updated_at || 0).getTime();
        return dateB - dateA;
      });

      setProjects(sortedRepos.slice(0, 4));
    } catch (err) {
      setError('Error fetching featured projects');
      console.error('Error fetching featured projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#151B28] rounded-lg p-3 h-full transition-colors">
      <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600 mb-4">
        Featured Projects
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 h-[calc(100%-3rem)]">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-gray-50 dark:bg-gradient-to-br dark:from-[#1E1E2E] dark:to-[#2D2D44] rounded-lg p-3 flex flex-col justify-between border border-gray-200 dark:border-gray-800/50 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-colors"
          >
            <div>
              <h3 className="text-lg font-semibold mb-1">
                {project.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {project.description || 'No description available'}
              </p>
              {project.topics && project.topics.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.topics.map((tech, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">★</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{project.stargazers_count}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">⑂</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{project.forks_count}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 mt-2">
                <a
                  href={project.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
                {project.homepage && (
                  <a
                    href={project.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProjects;