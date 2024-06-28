/* eslint-disable @next/next/no-img-element */
// components/GitHubStats.tsx
import React from 'react';

interface GitHubStatsProps {
  className: string;
}

const GitHubStats: React.FC<GitHubStatsProps> = ({ className }) => {
  return (
    <div className={`bg-neutral-400 p-4 rounded-lg shadow-md ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-gray-900 dark:text-gray-50 text-2xl">📊</span>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">GitHub Stats</h2>
      </div>
      <div className="flex justify-center">
        <img height={590} width={590} src="https://github-readme-stats.vercel.app/api/top-langs?username=medevs&show_icons=true&locale=en&layout=compact&theme=radical" alt="Top Languages" />
      </div>
    </div>
  );
}

export default GitHubStats;