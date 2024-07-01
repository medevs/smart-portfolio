// components/FeaturedProjects.tsx
import React from 'react';
import ProjectCard from './ProjectCard';

const projects = [
  {
    title: "E-commerce Platform",
    description: "A full-stack e-commerce solution with user authentication, product management, and payment integration.",
    technologies: ["Next.js", "Node.js", "MongoDB", "Stripe"],
    githubLink: "https://github.com/username/ecommerce-platform",
    liveLink: "https://myecommerceplatform.com"
  },
  {
    title: "Task Management App",
    description: "A responsive task management application with real-time updates and collaboration features.",
    technologies: ["React", "Firebase", "Tailwind CSS"],
    githubLink: "https://github.com/username/task-manager",
    liveLink: "https://mytaskmanager.com"
  }
];

const ProjectsDisplay = () => {
  return (
    <div className={`rounded-lg shadow-md md:col-span-2 lg:col-span-3`}>
      <div className="p-4">
        <h2 className="text-xl font-bold">Featured Projects</h2>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-2">
      {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </div>
  );
}

export default ProjectsDisplay;