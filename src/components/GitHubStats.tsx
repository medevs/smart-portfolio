'use client'

import React, { useState, useEffect } from 'react';
import { githubService } from '@/lib/github';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Book, Star, Users, UserPlus } from 'lucide-react';
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
        setError('Failed to fetch GitHub data');
        console.error('Error fetching GitHub data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  if (loading) return null;
  if (error) return <div className="text-red-400">{error}</div>;

  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const stats = [
    { label: 'Repositories', value: userData?.public_repos || 0, icon: <Book className="w-5 h-5 text-blue-400" /> },
    { label: 'Stars', value: totalStars, icon: <Star className="w-5 h-5 text-yellow-400" /> },
    { label: 'Followers', value: userData?.followers || 0, icon: <Users className="w-5 h-5 text-green-400" /> },
    { label: 'Following', value: userData?.following || 0, icon: <UserPlus className="w-5 h-5 text-purple-400" /> }
  ];

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#151B28] rounded-lg p-3 h-full transition-colors">
      <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600 mb-3">
        GitHub Stats
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 mb-3">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-gray-50 dark:bg-[#1E2330] rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-[#252B3B]"
          >
            <div className="flex flex-col items-center gap-1">
              <div className="text-gray-400 dark:text-gray-500">
                {stat.icon}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gray-50 dark:bg-[#1E2330] rounded-lg p-3 transition-colors">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-2">
          Most Used Languages
        </h3>
        <div className="h-[210px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={languages}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {languages.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(23, 23, 23, 0.9)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GitHubStats;