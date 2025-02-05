'use client'

import React, { useEffect, useState } from 'react';
import ProjectCard from './ProjectCard';
import { githubService } from '@/lib/github';

export interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  githubLink: string;
  liveLink: string;
  stars: number;
  forks: number;
  lastUpdated: string;
}

interface GithubRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage?: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
}

const ProjectsDisplay: React.FC = () => {
  const [projects, setProjects] = useState<ProjectCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch more repositories initially to ensure we get the most starred ones
        const response = await githubService.getRepositories('medevs', {
          sort: 'stars',
          direction: 'desc',
          per_page: 10 // Fetch more repos initially
        });

        const repos = response.data;
        
        // Double check sorting by stars and take top 4
        const sortedRepos = repos
          .sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0))
          .slice(0, 4);

        const formattedProjects = sortedRepos.map((repo) => ({
          title: repo.name,
          description: repo.description || 'No description available',
          technologies: repo.topics || [],
          githubLink: repo.html_url,
          liveLink: repo.homepage || '',
          stars: repo.stargazers_count ?? 0,
          forks: repo.forks_count ?? 0,
          lastUpdated: repo.updated_at ?? new Date().toISOString()
        }));

        setProjects(formattedProjects);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching GitHub projects:', err);
        setError('Failed to load projects');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg shadow-md p-6 bg-[#151B28]">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/4"></div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg shadow-md p-6 bg-[#151B28]">
        {error}
      </div>
    );
  }

  return (
    <div className="rounded-lg shadow-md bg-[#151B28]">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Featured Projects</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard 
              key={project.title} 
              {...project}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectsDisplay;