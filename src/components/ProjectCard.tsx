'use client'

import { useState } from 'react'
import { Github, Globe } from 'lucide-react'

interface ProjectCardProps {
  title: string;
  description: string;
  websiteUrl: string;
  githubUrl: string;
  techStack: string[];
  image: string;
}

export default function ProjectCard({ 
  title, 
  description, 
  websiteUrl, 
  githubUrl, 
  techStack, 
  image 
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false)

  return (
    <div
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="space-x-4">
            <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="inline-block p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors duration-200">
              <Globe className="w-6 h-6" />
            </a>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="inline-block p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors duration-200">
              <Github className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400 mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech, index) => (
            <span key={index} className="px-2 py-1 bg-gray-700 rounded-full text-sm">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}