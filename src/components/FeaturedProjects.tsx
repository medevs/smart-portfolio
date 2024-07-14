import React from 'react';
import ProjectCard from './ProjectCard';

export interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  githubLink: string;
  liveLink: string;
  stars: number;
  forks: number;
  lastUpdated: string;
}

const projects: Omit<ProjectCardProps, 'stars' | 'forks' | 'lastUpdated'>[] = [
  {
    title: "Portfolio",
    description: "A Portfolio Website with an AI chatbot that can answer any question about you.",
    technologies: ["Next.js", "Langchain", "MongoDB", "Stripe", "tailwind"],
    githubLink: "https://github.com/medevs/smart-portfolio",
    liveLink: "https://medevs.xyz"
  },
  {
    title: "RemindMe",
    description: "Full Stack RemindApp",
    technologies: ["React", "Firebase", "Tailwind CSS"],
    githubLink: "https://github.com/medevs/remind-me",
    liveLink: "https://remind-me-beige.vercel.app"
  }
];

const ProjectsDisplay: React.FC = () => {
  return (
    <div className="rounded-lg shadow-md md:col-span-2 lg:col-span-3">
      <div className="p-4">
        <h2 className="text-xl font-bold">Featured Projects</h2>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectCard 
            key={index} 
            {...project} 
            stars={0} 
            forks={0} 
            lastUpdated={new Date().toISOString()}
          />
        ))}
      </div>
    </div>
  );
}

export default ProjectsDisplay;