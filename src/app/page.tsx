// pages/HomePage.tsx
import React from 'react';
import { skills, recentPosts, featuredProjects } from '../assets/data';
import RealTimeInfoWidget from '@/components/RealTimeInfoWidget';
import AboutMe from '@/components/AboutMe';
import Technologies from '@/components/Technologies';
import FeaturedProjects from '@/components/FeaturedProjects';
import LatestPosts from '@/components/LatestPosts';
import InteractiveCode from '@/components/InteractiveCode';
import GitHubStats from '@/components/GitHubStats';

// pages/HomePage.tsx
const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <div className="sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-6">
          <AboutMe />
        </div>
        <div className="sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-3">
          <RealTimeInfoWidget />
        </div>
        <div className="sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-3">
          <Technologies />
        </div>
        <div className="sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-6">
          <FeaturedProjects />
        </div>
        <div className="sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-3">
          <LatestPosts  />
        
        </div>
        <div className="sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-3">
          <InteractiveCode />
        </div>
        <div className="sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-6">
          <GitHubStats />
        </div>
      </div>
    </div>
  );
}

export default HomePage;