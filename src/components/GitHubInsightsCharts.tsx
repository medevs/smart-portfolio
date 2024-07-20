"use client"

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Github, Star, GitFork, Activity, GithubIcon, Loader } from 'lucide-react';

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
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        // Fetch top languages
        const langResponse = await fetch('https://api.github.com/search/repositories?q=stars:>10000&sort=stars&order=desc&per_page=100');
        const langData = await langResponse.json();
        const languageCounts: { [key: string]: number } = {};
        langData.items.forEach((repo: any) => {
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
        const repoResponse = await fetch('https://api.github.com/search/repositories?q=stars:>50000&sort=stars&order=desc&per_page=10');
        const repoData = await repoResponse.json();
        const topReposData = repoData.items.map((repo: any) => ({
          name: repo.name,
          stars: repo.stargazers_count
        }));
        setTopRepos(topReposData);

      } catch (err) {
        console.error('Error fetching GitHub insights:', err);
        setError('Failed to fetch GitHub insights. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64">
    <Loader className="animate-spin text-indigo-500" size={48} />
  </div>;
  if (error) return <div className="text-red-600 dark:text-red-400">{error}</div>;

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
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200 flex items-center">
            <Star className="mr-2" /> Top Repositories by Stars
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topRepos}>
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="stars" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>These charts provide insights into popular languages and top repositories</p>
        <p>Data is based on public GitHub information and is updated periodically.</p>
      </div>
    </div>
  );
};

export default GitHubInsightsCharts;