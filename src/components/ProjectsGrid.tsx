"use client"

import React, { useState, useEffect } from 'react';
import { githubService } from '@/lib/github';
import ProjectCard from './ProjectCard';
import { Loader, GitBranch, User } from 'lucide-react';
import type { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

type GitHubRepo = RestEndpointMethodTypes["repos"]["listForUser"]["response"]["data"][0];
type GitHubCommit = RestEndpointMethodTypes["repos"]["listCommits"]["response"]["data"][0];

interface Project {
  title: string;
  description: string;
  technologies: string[];
  githubLink: string;
  liveLink?: string;
  stars: number;
  forks: number;
  lastUpdated: string;
  latestCommitDate: string;
  isOwn: boolean;
}

const ProjectsGrid: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const [technologies, setTechnologies] = useState<string[]>(['All']);
  const [activeTab, setActiveTab] = useState<'own' | 'contributed'>('own');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const username = 'medevs';

      const { data: allRepos } = await githubService.getRepositories(username, {
        per_page: 100,
        sort: 'updated',
        type: 'all',
      });

      const allProjects: Project[] = await Promise.all(allRepos.map(async (repo: GitHubRepo) => {
        const { data: commits } = await githubService.getRepositoryCommits(
          repo.owner?.login ?? username,
          repo.name,
          { per_page: 1 }
        );

        const getValidDateString = (dateString: string | null | undefined): string => {
          if (dateString && !isNaN(Date.parse(dateString))) {
            return new Date(dateString).toISOString();
          }
          return new Date().toISOString();
        };

        const latestCommitDate = commits[0]?.commit?.author?.date || repo.updated_at;

        return {
          title: repo.name,
          description: repo.description || 'No description available',
          technologies: repo.topics || [],
          githubLink: repo.html_url,
          liveLink: repo.homepage || undefined,
          stars: repo.stargazers_count || 0,
          forks: repo.forks_count || 0,
          lastUpdated: getValidDateString(repo.updated_at),
          latestCommitDate: getValidDateString(latestCommitDate),
          isOwn: !repo.fork,
        };
      }));

      const sortedProjects = allProjects.sort((a, b) =>
        new Date(b.latestCommitDate).getTime() - new Date(a.latestCommitDate).getTime()
      );

      setProjects(sortedProjects);

      const allTechs = Array.from(new Set(sortedProjects.flatMap(project => project.technologies)));
      setTechnologies(['All', ...allTechs]);
    } catch (err) {
      setError('Error fetching projects. Please try refreshing the page.');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project => 
    (filter === 'All' || project.technologies.includes(filter)) &&
    (activeTab === 'own' ? project.isOwn : !project.isOwn)
  );

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Projects on Github</h2>
        <select
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {technologies.map((tech) => (
            <option key={tech} value={tech}>
              {tech}
            </option>
          ))}
        </select>
      </div>

      <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
        <button
          className={`py-2 px-4 font-medium focus:outline-none ${
            activeTab === 'own'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('own')}
        >
          <User className="w-4 h-4 inline-block mr-2" />
          My Projects
        </button>
        <button
          className={`py-2 px-4 font-medium focus:outline-none ${
            activeTab === 'contributed'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('contributed')}
        >
          <GitBranch className="w-4 h-4 inline-block mr-2" />
          Forked Projects
        </button>
      </div>

      {renderProjects(filteredProjects, loading, error)}
    </div>
  );
};

const renderProjects = (projects: Project[], loading: boolean, error: string | null) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => (
        <ProjectCard key={index} {...project} />
      ))}
    </div>
  );
};

export default ProjectsGrid;