import GitHubInsightsCharts from '@/components/GitHubInsightsCharts';
import GitHubTrends from '@/components/GitHubTrends';
import React from 'react';

const GitHubStatsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200">GitHub Statistics and Insights</h1>
      
      {/* <div className="mb-8">
        <GitHubInsightsCharts />
      </div> */}
      
      <div>
        <GitHubTrends />
      </div>
    </div>
  );
};

export default GitHubStatsPage;