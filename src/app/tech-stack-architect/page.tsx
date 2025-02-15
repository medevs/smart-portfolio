"use client"

import React from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamically import the StackBuilder component to avoid SSR issues with ReactFlow
const StackBuilder = dynamic(
  () => import('@/components/tech-stack-architect/StackBuilder'),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-[600px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    ),
    ssr: false
  }
);

const TechStackArchitectPage = () => {
  return (
    <main className="min-h-screen p-4 max-w-7xl mx-auto">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Tech Stack Architect
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Design, validate, and visualize your project&apos;s technology stack with this interactive tool.
          </p>
        </div>

        {/* Main content area */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <StackBuilder />
        </div>

        {/* Features section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <FeatureCard
            title="Interactive Builder"
            description="Drag and drop technologies to build your stack. Get real-time compatibility feedback."
            icon="🏗️"
          />
          <FeatureCard
            title="Smart Analysis"
            description="Receive intelligent recommendations based on your choices and industry best practices."
            icon="🧠"
          />
          <FeatureCard
            title="Export & Share"
            description="Generate beautiful architecture diagrams and share them with your team."
            icon="📤"
          />
        </div>
      </div>
    </main>
  );
};

const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: string }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-transform hover:scale-105">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
};

export default TechStackArchitectPage;
