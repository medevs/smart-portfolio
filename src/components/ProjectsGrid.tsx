"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { githubService } from '@/lib/github';
import ProjectCard from './ProjectCard';
import { Loader, GitBranch, User } from 'lucide-react';
import type { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';
import { skills } from '@/data/skills';

type GitHubRepo = RestEndpointMethodTypes["repos"]["listForUser"]["response"]["data"][0];
type GitHubCommit = RestEndpointMethodTypes["repos"]["listCommits"]["response"]["data"][0];

interface Technology {
  name: string;
  icon: string;
  color?: string;
}

interface Project {
  title: string;
  description: string;
  technologies: Technology[];
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
  const [sortBy, setSortBy] = useState<'stars' | 'updated' | 'forks' | 'name'>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');

  // Function to map GitHub topics to our icon format
  const mapTopicToTechnology = (topic: string): Technology => {
    // Try to find a matching skill
    const matchedSkill = skills.find(
      skill => skill.name.toLowerCase() === topic.toLowerCase() ||
        topic.toLowerCase().includes(skill.name.toLowerCase()) ||
        skill.name.toLowerCase().includes(topic.toLowerCase())
    );

    if (matchedSkill) {
      return {
        name: matchedSkill.name,
        icon: matchedSkill.icon,
        color: matchedSkill.color
      };
    }

    // Default mapping for common technologies that might not be in skills
    const defaultMappings: { [key: string]: Technology } = {
      'python': { name: 'Python', icon: 'SiPython', color: '#3776AB' },
      'java': { name: 'Java', icon: 'SiJava', color: '#007396' },
      'php': { name: 'PHP', icon: 'SiPhp', color: '#777BB4' },
      'ruby': { name: 'Ruby', icon: 'SiRuby', color: '#CC342D' },
      'vue': { name: 'Vue.js', icon: 'SiVuedotjs', color: '#4FC08D' },
      'angular': { name: 'Angular', icon: 'SiAngular', color: '#DD0031' },
      'aws': { name: 'AWS', icon: 'SiAmazonaws', color: '#232F3E' },
      'firebase': { name: 'Firebase', icon: 'SiFirebase', color: '#FFCA28' },
      'graphql': { name: 'GraphQL', icon: 'SiGraphql', color: '#E10098' },
      'flutter': { name: 'Flutter', icon: 'SiFlutter', color: '#02569B' }
    };

    const defaultTech = defaultMappings[topic.toLowerCase()];
    if (defaultTech) {
      return defaultTech;
    }

    // For unknown technologies, create a generic entry
    return {
      name: topic.charAt(0).toUpperCase() + topic.slice(1),
      icon: 'SiGithub', // Default icon
      color: '#6e7681' // Default color
    };
  };

  const fetchProjects = useCallback(async () => {
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
          technologies: (repo.topics || []).map(mapTopicToTechnology),
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

      const allTechs = Array.from(new Set(sortedProjects.flatMap(project =>
        project.technologies.map(tech => tech.name)
      )));
      setTechnologies(['All', ...allTechs]);
    } catch (err) {
      setError('Error fetching projects. Please try refreshing the page.');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const getSortedAndFilteredProjects = () => {
    let filteredProjects = [...projects];

    // Filter by search query
    if (searchQuery) {
      filteredProjects = filteredProjects.filter(project => 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies.some(tech => tech.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by technology
    if (filter !== 'All') {
      filteredProjects = filteredProjects.filter(project =>
        project.technologies.some(tech => tech.name === filter)
      );
    }

    // Filter by ownership
    filteredProjects = filteredProjects.filter(project =>
      activeTab === 'own' ? project.isOwn : !project.isOwn
    );

    // Sort projects
    return filteredProjects.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'stars':
          comparison = b.stars - a.stars;
          break;
        case 'forks':
          comparison = b.forks - a.forks;
          break;
        case 'updated':
          comparison = new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
          break;
        case 'name':
          comparison = a.title.localeCompare(b.title);
          break;
      }
      return sortOrder === 'asc' ? -comparison : comparison;
    });
  };

  const resetAllFilters = () => {
    setFilter('All');
    setActiveTab('own');
    setSortBy('updated');
    setSortOrder('desc');
    setSearchQuery('');
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="w-full">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/20 focus:border-primary dark:focus:border-primary transition-colors"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-2 items-center justify-center">
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'stars' | 'updated' | 'forks' | 'name')}
            className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-800 hover:border-primary/50 dark:hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/20 focus:border-primary dark:focus:border-primary transition-colors"
            style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
          >
            <option value="updated" className="bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-100">Last Updated</option>
            <option value="stars" className="bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-100">Stars</option>
            <option value="forks" className="bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-100">Forks</option>
            <option value="name" className="bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-100">Name</option>
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-900 hover:border-primary/50 dark:hover:border-primary/50 w-9 h-9 flex items-center justify-center transition-colors"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-800 hover:border-primary/50 dark:hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/20 focus:border-primary dark:focus:border-primary transition-colors"
          style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
        >
          <option value="All" className="bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-100">All Technologies</option>
          {technologies.filter(tech => tech !== 'All').map((tech) => (
            <option 
              key={tech} 
              value={tech} 
              className="bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-100"
            >
              {tech}
            </option>
          ))}
        </select>

        <button
          onClick={resetAllFilters}
          className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-800 hover:bg-gray-200 dark:hover:bg-gray-900 hover:border-primary/50 dark:hover:border-primary/50 flex items-center gap-1.5 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Clear All
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setActiveTab('own')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'own'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-800/50 text-gray-300 border border-gray-700/50'
          }`}
        >
          <User size={16} />
          My Projects
        </button>
        <button
          onClick={() => setActiveTab('contributed')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'contributed'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-800/50 text-gray-300 border border-gray-700/50'
          }`}
        >
          <GitBranch size={16} />
          Contributed
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : error ? (
          <div className="col-span-full text-red-500 text-center py-12">{error}</div>
        ) : (
          getSortedAndFilteredProjects().map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))
        )}
      </div>

      {/* No Results Message */}
      {!loading && !error && getSortedAndFilteredProjects().length === 0 && (
        <div className="text-center text-gray-400 py-12">
          No projects found matching your criteria
        </div>
      )}
    </div>
  );
};

export default ProjectsGrid;