"use client"

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Github, Star, GitFork, Activity, GithubIcon, Loader } from 'lucide-react';
import { githubService } from '@/lib/github';
import type { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

type SearchRepoItem = RestEndpointMethodTypes["search"]["repos"]["response"]["data"]["items"][0];

interface LanguageData {
  name: string;
  value: number;
}

interface RepoData {
  name: string;
  stars: number;
}

interface EventData {
  type: string;
  count: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658'];

const GitHubInsightsCharts: React.FC = () => {
  const [languages, setLanguages] = useState<LanguageData[]>([]);
  const [topRepos, setTopRepos] = useState<RepoData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        // First validate the token
        const isValid = await githubService.isTokenValid();
        if (!isValid) {
          throw new Error('GitHub token is invalid or not set');
        }

        // Fetch top languages
        console.log('Fetching top languages...');
        const langResponse = await githubService.octokit.search.repos({
          q: 'stars:>10000',
          sort: 'stars',
          order: 'desc',
          per_page: 100
        });

        console.log('Language response:', langResponse);
        const languageCounts: { [key: string]: number } = {};
        langResponse.data.items.forEach((repo: SearchRepoItem) => {
          if (repo.language) {
            languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
          }
        });

        const languageData = Object.entries(languageCounts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 7);
        setLanguages(languageData);

        // Fetch top repositories
        console.log('Fetching top repositories...');
        const repoResponse = await githubService.octokit.search.repos({
          q: 'stars:>50000',
          sort: 'stars',
          order: 'desc',
          per_page: 10
        });

        console.log('Repository response:', repoResponse);
        const topReposData = repoResponse.data.items.map((repo: SearchRepoItem) => ({
          name: repo.name,
          stars: repo.stargazers_count
        }));
        setTopRepos(topReposData);

      } catch (err) {
        console.error('Error fetching GitHub insights:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch GitHub insights. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64">
    <Loader className="animate-spin text-indigo-500" size={48} />
  </div>;

  if (error) return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>
      <div className="text-gray-600 dark:text-gray-400">
        <p>Please check:</p>
        <ul className="list-disc ml-6">
          <li>GitHub token is properly set in environment variables</li>
          <li>You have internet connectivity</li>
          <li>GitHub API is accessible</li>
        </ul>
      </div>
    </div>
  );

  if (languages.length === 0 && topRepos.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="text-gray-600 dark:text-gray-400">
          No data available. Please check your GitHub token and try again.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
        <GithubIcon className="mr-2" /> GitHub Insights
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Top Languages</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={languages}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {languages.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Top Repositories by Stars</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topRepos} layout="vertical" margin={{ left: 100 }}>
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" />
              <Tooltip />
              <Bar dataKey="stars" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GitHubInsightsCharts;