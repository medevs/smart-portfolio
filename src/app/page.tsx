import React from 'react';
import AboutMe from '@/components/AboutMe';
import Technologies from '@/components/Technologies';
import FeaturedProjects from '@/components/FeaturedProjects';
import LatestPosts from '@/components/LatestPosts';
import GitHubStats from '@/components/GitHubStats';
import Timeline from '@/components/Timeline';
import Languages from '@/components/Languages';
import Hobbies from '@/components/Hobbies';

const HomePage: React.FC = () => {
  return (
    <main className="min-h-screen p-2 max-w-7xl mx-auto space-y-2">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        <div className="lg:col-span-2">
          <AboutMe />
        </div>
        <div>
          <GitHubStats />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        {/* Featured Projects - Spans 2 columns */}
        <div className="lg:col-span-2">
          <FeaturedProjects />
        </div>

        {/* Technologies Stack */}
        <div>
          <Technologies />
        </div>

        {/* Timeline - Spans full width */}
        <div className="lg:col-span-3">
          <Timeline />
        </div>

        {/* Latest Posts */}
        <div className="lg:col-span-2">
          <LatestPosts />
        </div>

        {/* Languages */}
        <div>
          <Languages />
        </div>

        {/* Hobbies */}
        <div className="lg:col-span-3">
          <Hobbies />
        </div>
      </div>
    </main>
  );
};

export default HomePage;