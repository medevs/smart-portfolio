"use client"

import React, { useState, useMemo } from 'react';
import { Technology } from '../techDataFetcher';
import { TechStack } from '../stackUtils';
import { Search } from 'lucide-react';
import Image from 'next/image';

interface SidebarProps {
  technologies: Record<string, Technology[]>;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  savedStacks: TechStack[];
  onLoadStack: (stack: TechStack) => void;
  onDeleteStack: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  technologies,
  selectedCategory,
  onCategoryChange,
  savedStacks,
  onLoadStack,
  onDeleteStack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTechnologies = useMemo(() => {
    if (!searchQuery.trim()) {
      return technologies[selectedCategory] || [];
    }

    const query = searchQuery.toLowerCase();
    return Object.values(technologies)
      .flat()
      .filter(
        tech =>
          tech.name.toLowerCase().includes(query) ||
          tech.type.toLowerCase().includes(query) ||
          (tech.description?.toLowerCase() || '').includes(query)
      );
  }, [technologies, selectedCategory, searchQuery]);

  return (
    <div className="w-64 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white flex flex-col h-[calc(80vh-8rem)] overflow-hidden rounded-l-lg">
      {/* Search and Categories */}
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 space-y-2 flex-shrink-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Search technologies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white pl-9 pr-3 py-1.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm border border-gray-200 dark:border-gray-600"
          />
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-2 py-1.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm border border-gray-200 dark:border-gray-600"
        >
          {Object.keys(technologies).map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Technologies List */}
      <div className="flex-1 overflow-y-auto py-2 px-3 border-b border-gray-200 dark:border-gray-700 space-y-1.5">
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
          {searchQuery ? 'Search Results' : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace(/_/g, ' ')}
        </div>
        {filteredTechnologies.length > 0 ? (
          filteredTechnologies.map((tech) => (
            <div
              key={tech.name}
              className="bg-white dark:bg-gray-700 px-2 py-1.5 rounded cursor-move hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors group border border-gray-200 dark:border-gray-600"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/reactflow', tech.type);
                e.dataTransfer.setData('application/techname', tech.name);
                e.dataTransfer.setData('application/techicon', tech.icon || '');
                e.dataTransfer.setData('application/tech', JSON.stringify(tech));
              }}
            >
              <div className="flex items-center">
                {tech.icon && (
                  <Image
                    src={tech.icon}
                    alt={tech.name}
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                )}
                <span className="group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors text-sm">{tech.name}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No technologies found
          </div>
        )}
      </div>

      {/* Saved Stacks */}
      <div className="flex-shrink-0 p-3">
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Saved Stacks</div>
        <div className="space-y-1.5">
          {savedStacks.map((stack) => (
            <div
              key={stack.id}
              className="bg-white dark:bg-gray-700 px-2 py-1.5 rounded flex items-center justify-between group border border-gray-200 dark:border-gray-600"
            >
              <button
                onClick={() => onLoadStack(stack)}
                className="text-sm text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                {stack.name}
              </button>
              <button
                onClick={() => onDeleteStack(stack.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
          {savedStacks.length === 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
              No saved stacks
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
