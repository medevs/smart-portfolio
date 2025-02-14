"use client"

import React from 'react';
import { X } from 'lucide-react';
import type { Technology } from './techDataFetcher';

interface TechInfoProps {
  tech: Technology | null;
  onClose: () => void;
}

const TechInfo = ({ tech, onClose }: TechInfoProps) => {
  if (!tech) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-80 bg-white dark:bg-gray-800 shadow-lg border-l dark:border-gray-700 p-4 transform transition-transform duration-200 ease-in-out">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Technology Details
        </h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <img src={tech.icon} alt={tech.name} className="w-12 h-12" />
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100">{tech.name}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{tech.category}</p>
          </div>
        </div>

        {tech.version && (
          <div>
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Latest Version
            </h5>
            <p className="text-sm text-gray-600 dark:text-gray-400">{tech.version}</p>
          </div>
        )}

        <div>
          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </h5>
          <p className="text-sm text-gray-600 dark:text-gray-400">{tech.description}</p>
        </div>

        <div>
          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Common Use Cases
          </h5>
          <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
            <li>Web Development</li>
            <li>Mobile Applications</li>
            <li>Enterprise Solutions</li>
          </ul>
        </div>

        <div>
          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Resources
          </h5>
          <div className="space-y-2">
            <a
              href={`https://github.com/topics/${tech.name.toLowerCase()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-blue-500 hover:underline"
            >
              GitHub Projects
            </a>
            <a
              href={`https://www.npmjs.com/search?q=${tech.name.toLowerCase()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-blue-500 hover:underline"
            >
              NPM Packages
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechInfo;
