"use client"

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader } from 'lucide-react';

interface LanguageData {
  name: string;
  value: number;
}

interface RepoData {
  name: string;
  stars: number;
}

interface InsightsResponse {
  languages: LanguageData[];
  topRepos: RepoData[];
  error?: string;
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
        const response = await fetch('/api/github/insights');
        const data: InsightsResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch GitHub insights');
        }

        if (data.languages && data.topRepos) {
          setLanguages(data.languages);
          setTopRepos(data.topRepos);
          setError(null);
        } else {
          throw new Error('Invalid data format received from server');
        }
      } catch (err) {
        console.error('Error fetching insights:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch GitHub insights');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="text-red-600 dark:text-red-400 mb-4">{error}</div>
        <div className="text-gray-600 dark:text-gray-400">
          <p>Please check:</p>
          <ul className="list-disc ml-6">
            <li>GitHub token is properly set in environment variables</li>
            <li>GitHub username is configured correctly</li>
            <li>You have internet connectivity</li>
            <li>GitHub API is accessible</li>
          </ul>
        </div>
      </div>
    );
  }

  if (languages.length === 0 || topRepos.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="text-gray-600 dark:text-gray-400">
          No GitHub data available. Make sure you have public repositories.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Languages Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={languages}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {languages.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Top Repositories by Stars</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topRepos} layout="vertical" margin={{ left: 20, right: 20 }}>
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={120} />
              <Tooltip />
              <Bar dataKey="stars" fill="#8884d8">
                {topRepos.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GitHubInsightsCharts;