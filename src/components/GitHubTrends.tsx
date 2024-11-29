"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import type { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';

type SearchRepoItem = RestEndpointMethodTypes["search"]["repos"]["response"]["data"]["items"][0];

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

const GitHubTrends: React.FC = () => {
  const [trendingRepos, setTrendingRepos] = useState<TrendingRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const fetchTrendingRepos = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/github/trends?page=${page}`);
        if (!response.ok) {
          throw new Error('Failed to fetch trending repositories');
        }
        const data = await response.json();
        setTrendingRepos(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching trending repos:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch trending repositories');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingRepos();
  }, [page]);

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

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

  if (trendingRepos.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="text-gray-600 dark:text-gray-400">
          No trending repositories found. Please try again later.
        </div>
      </div>
    );
  }

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
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Previous
        </button>
        <button
          onClick={handleNextPage}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Next
          <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default GitHubTrends;