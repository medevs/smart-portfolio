"use client"

import React, { useState, useEffect } from 'react';
import { Octokit } from '@octokit/rest';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';

interface TrendingRepo {
  id: number;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
}

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const GitHubTrends: React.FC = () => {
  const [trendingRepos, setTrendingRepos] = useState<TrendingRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const perPage = 6; // 6 projects per page, 5 pages total for 30 projects

  useEffect(() => {
    const fetchTrendingRepos = async () => {
      setLoading(true);
      try {
        const date = new Date();
        date.setDate(date.getDate() - 7); // Get repos from the last week
        const formattedDate = date.toISOString().split('T')[0];

        const response = await octokit.search.repos({
          q: `created:>${formattedDate}`,
          sort: 'stars',
          order: 'desc',
          per_page: perPage,
          page: page
        });

        const mappedRepos: TrendingRepo[] = response.data.items.map(item => ({
          id: item.id,
          full_name: item.full_name,
          html_url: item.html_url,
          description: item.description,
          stargazers_count: item.stargazers_count,
          forks_count: item.forks_count,
          language: item.language,
          topics: item.topics || []
        }));

        setTrendingRepos(mappedRepos);
      } catch (err) {
        setError('Failed to fetch trending repositories');
        console.error('Error fetching trending repos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingRepos();
  }, [page]);

  if (loading) return <div className="flex justify-center items-center h-64">
    <Loader className="animate-spin text-indigo-500" size={48} />
  </div>;
  if (error) return <div className="text-red-600 dark:text-red-400">{error}</div>;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Trending Repositories in Github from last Week</h2>
      <div className="space-y-4">
        {trendingRepos.map((repo) => (
          <div key={repo.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md shadow-sm">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              {repo.full_name}
            </a>
            <p className="text-gray-600 dark:text-gray-300 mt-1">{repo.description}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 text-xs font-semibold rounded">
                {repo.language || 'Unknown'}
              </span>
              {repo.topics.slice(0, 5).map(topic => (
                <span key={topic} className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 text-xs font-semibold rounded">
                  {topic}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span>⭐ {repo.stargazers_count} stars</span>
              <span>🍴 {repo.forks_count} forks</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:bg-gray-100 dark:disabled:bg-gray-600"
        >
          <ChevronLeft />
        </button>
        <span className="text-gray-800 dark:text-gray-200">Page {page} of 5</span>
        <button
          onClick={() => setPage(p => Math.min(5, p + 1))}
          disabled={page === 5}
          className="px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:bg-gray-100 dark:disabled:bg-gray-600"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default GitHubTrends;