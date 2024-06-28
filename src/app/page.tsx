// pages/HomePage.tsx
import React from 'react';
import { skills, recentPosts, featuredProjects } from '../assets/data';
import RealTimeInfoWidget from '@/components/RealTimeInfoWidget';
import AboutMe from '@/components/AboutMe';
import Technologies from '@/components/Technologies';
import FeaturedProjects from '@/components/FeaturedProjects';
import LatestPosts from '@/components/LatestPosts';
import SocialLinks from '@/components/SocialLinks';
import GitHubStats from '@/components/GitHubStats';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <AboutMe />
        <RealTimeInfoWidget />
        <Technologies skills={skills} />
        <FeaturedProjects projects={featuredProjects} />
        <LatestPosts className="md:col-span-2 lg:col-span-2" posts={recentPosts} />
        <SocialLinks className="md:col-span-1 lg:col-span-2" />
        <GitHubStats className="md:col-span-1 lg:col-span-2" />
      </div>
    </div>
  );
}

export default HomePage;