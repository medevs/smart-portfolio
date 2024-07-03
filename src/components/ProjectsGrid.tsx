"use client"

import React, { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import { Loader } from 'lucide-react';

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
}

const ProjectsGrid: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const [technologies, setTechnologies] = useState<string[]>(['All']);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.github.com/users/medevs/repos?per_page=100');
      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }
      const data = await response.json();

      const projectsWithCommits = await Promise.all(data.map(async (repo: any) => {
        const commitResponse = await fetch(`https://api.github.com/repos/medevs/${repo.name}/commits?per_page=1`);
        const commitData = await commitResponse.json();
        const latestCommitDate = commitData[0]?.commit?.author?.date || repo.updated_at;

        return {
          title: repo.name,
          description: repo.description || 'No description available',
          technologies: repo.topics || [],
          githubLink: repo.html_url,
          liveLink: repo.homepage || undefined,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          lastUpdated: new Date(repo.updated_at).toLocaleDateString(),
          latestCommitDate: latestCommitDate,
        };
      }));

      const sortedProjects = projectsWithCommits.sort((a, b) =>
        new Date(b.latestCommitDate).getTime() - new Date(a.latestCommitDate).getTime()
      );

      setProjects(sortedProjects);

      const allTechs = Array.from(new Set(sortedProjects.flatMap(project => project.technologies)));
      setTechnologies(['All', ...allTechs]);
    } catch (err) {
      setError('Error fetching projects. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter(project => project.technologies.includes(filter));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Projects</h2>
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="animate-spin text-indigo-500" size={48} />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsGrid;