"use client"

import React, { useEffect, useRef } from 'react';
import { X, ExternalLink, Github, Package } from 'lucide-react';
import Image from 'next/image';
import type { Technology } from './techDataFetcher';

interface TechInfoProps {
  tech: Technology | null;
  onClose: () => void;
}

const TechInfo = ({ tech, onClose }: TechInfoProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current && 
        !panelRef.current.contains(event.target as Node) &&
        event.target instanceof Node &&
        overlayRef.current?.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!tech) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      />
      
      {/* Tech Info Panel */}
      <div 
        ref={panelRef}
        className="fixed inset-y-0 right-0 w-96 bg-gray-900 shadow-2xl border-l border-gray-800 overflow-hidden transform transition-all duration-300 ease-in-out z-50"
      >
        {/* Header with blur effect */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-blue-500/20 to-transparent" />
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-300" />
        </button>

        {/* Content */}
        <div className="h-full overflow-y-auto px-6 py-8 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {/* Tech Header */}
          <div className="relative flex items-center space-x-4 mb-8">
            <div className="relative w-16 h-16 bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center">
              {tech.icon ? (
                <Image
                  src={tech.icon}
                  alt={tech.name}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              ) : (
                <span className="text-2xl font-bold text-gray-400">
                  {tech.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{tech.name}</h3>
              <p className="text-sm text-blue-400 font-medium">{tech.category}</p>
            </div>
          </div>

          {/* Version Badge */}
          {tech.version && (
            <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-6">
              Version {tech.version}
            </div>
          )}

          {/* Description */}
          <div className="mb-8">
            <h4 className="text-gray-300 font-semibold mb-2">About</h4>
            <p className="text-gray-400 leading-relaxed">
              {tech.description || `${tech.name} is a powerful technology used in modern software development.`}
            </p>
          </div>

          {/* Use Cases */}
          <div className="mb-8">
            <h4 className="text-gray-300 font-semibold mb-3">Common Use Cases</h4>
            <div className="space-y-2">
              {['Web Development', 'Mobile Applications', 'Enterprise Solutions'].map((useCase) => (
                <div key={useCase} className="flex items-center px-3 py-2 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-300 text-sm">{useCase}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-gray-300 font-semibold mb-3">Resources</h4>
            <div className="space-y-3">
              <a
                href={`https://github.com/topics/${tech.name.toLowerCase()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 px-4 py-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors group"
              >
                <Github className="w-5 h-5 text-gray-400 group-hover:text-blue-400" />
                <span className="text-gray-300 group-hover:text-blue-400 text-sm">GitHub Projects</span>
                <ExternalLink className="w-4 h-4 text-gray-500 ml-auto" />
              </a>
              <a
                href={`https://www.npmjs.com/search?q=${tech.name.toLowerCase()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 px-4 py-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors group"
              >
                <Package className="w-5 h-5 text-gray-400 group-hover:text-blue-400" />
                <span className="text-gray-300 group-hover:text-blue-400 text-sm">NPM Packages</span>
                <ExternalLink className="w-4 h-4 text-gray-500 ml-auto" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TechInfo;
