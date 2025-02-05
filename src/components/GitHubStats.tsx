'use client'

import React, { useState, useEffect } from 'react';
import { githubService } from '@/lib/github';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

type GitHubRepo = RestEndpointMethodTypes["repos"]["listForUser"]["response"]["data"][0];

interface RepoData {
  name: string;
  stargazers_count: number;
  language: string;
}

interface LanguageData {
  name: string;
  value: number;
}

interface UserData {
  login: string;
  name: string | null;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  public_gists: number;
  created_at: string;
  bio: string | null;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const GitHubStats: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [repos, setRepos] = useState<RepoData[]>([]);
  const [languages, setLanguages] = useState<LanguageData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const userResponse = await githubService.getUserData('medevs');
        setUserData(userResponse.data as UserData);

        const reposResponse = await githubService.getRepositories('medevs', { per_page: 100 });
        setRepos(reposResponse.data.map((repo: GitHubRepo): RepoData => ({
          name: repo.name,
          stargazers_count: repo.stargazers_count ?? 0,
          language: repo.language ?? ''
        })));

        const languageCounts: { [key: string]: number } = {};
        reposResponse.data.forEach((repo: GitHubRepo) => {
          if (repo.language) {
            languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
          }
        });

        const languageData = Object.entries(languageCounts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5);

        setLanguages(languageData);
      } catch (err) {
        setError('Failed to fetch GitHub data. Please try again later.');
        console.error('Error fetching GitHub data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex-grow">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md shadow">
                <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
              </div>
            ))}
          </div>
          <div>
            <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-1/4 mb-8"></div>
            <div className="h-[200px] bg-gray-200 dark:bg-gray-600 rounded"></div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3"></div>
            <div className="flex justify-center space-x-4">
              <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-600 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (error) return <div className="text-red-600 dark:text-red-400">{error}</div>;

  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

  const stats = [
    { label: 'Repositories', value: userData?.public_repos || 0 },
    { label: 'Stars', value: totalStars },
    { label: 'Followers', value: userData?.followers || 0 },
    { label: 'Following', value: userData?.following || 0 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex-grow">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md shadow text-center">
            <span className="block text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</span>
          </div>
        ))}
      </div>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-8 text-gray-800 dark:text-gray-200">Top Languages</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={languages}
              cx="50%"
              cy="50%"
              outerRadius={60}
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
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Member since: {new Date(userData?.created_at || '').toLocaleDateString()}
      </div>
      <div className="mt-6 text-center">
        <a
          href={`https://github.com/${userData?.login}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gray-800 dark:bg-gray-600 text-white font-medium py-2 px-4 rounded hover:bg-gray-700 dark:hover:bg-gray-500 transition-colors mr-2 mb-2"
        >
          View Profile
        </a>
        <a
          href={`https://github.com/${userData?.login}?tab=repositories`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-500 text-white font-medium py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          View Repositories
        </a>
      </div>
    </div>
  );
};

export default GitHubStats;