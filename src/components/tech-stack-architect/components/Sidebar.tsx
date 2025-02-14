"use client"

import React from 'react';
import { Technology } from '../techDataFetcher';
import { TechStack } from '../stackUtils';
import { Save, Download, Image, Trash2 } from 'lucide-react';

interface SidebarProps {
  technologies: Record<string, Technology[]>;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onSaveStack: () => void;
  onExportJson: () => void;
  onExportImage: () => void;
  savedStacks: TechStack[];
  onLoadStack: (stack: TechStack) => void;
  onDeleteStack: (stackId: string) => void;
}

const Sidebar = ({
  technologies,
  selectedCategory,
  onCategoryChange,
  onSaveStack,
  onExportJson,
  onExportImage,
  savedStacks,
  onLoadStack,
  onDeleteStack,
}: SidebarProps) => {
  return (
    <div className="w-64 bg-gray-50 dark:bg-gray-900 p-4 border-r dark:border-gray-700 overflow-y-auto">
      <div className="space-y-4">
        {/* Stack controls */}
        <div className="flex space-x-2">
          <button
            onClick={onSaveStack}
            className="p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
            title="Save Stack"
          >
            <Save className="w-4 h-4" />
          </button>
          <button
            onClick={onExportJson}
            className="p-2 rounded-md bg-green-500 hover:bg-green-600 text-white"
            title="Export as JSON"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={onExportImage}
            className="p-2 rounded-md bg-purple-500 hover:bg-purple-600 text-white"
            title="Export as Image"
          >
            <Image className="w-4 h-4" />
          </button>
        </div>

        {/* Saved stacks */}
        {savedStacks.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Saved Stacks</h3>
            {savedStacks.map(stack => (
              <div
                key={stack.id}
                className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-md"
              >
                <button
                  onClick={() => onLoadStack(stack)}
                  className="text-sm text-gray-900 dark:text-gray-100 hover:text-blue-500"
                >
                  {stack.name}
                </button>
                <button
                  onClick={() => onDeleteStack(stack.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Category selector */}
        <select
          className="w-full p-2 border dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {Object.keys(technologies).map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
            </option>
          ))}
        </select>

        {/* Technology list */}
        <div className="space-y-2">
          {technologies[selectedCategory]?.map((tech) => (
            <div
              key={tech.name}
              className="flex items-center p-2 bg-white dark:bg-gray-800 rounded-md shadow-sm cursor-move hover:shadow-md transition-shadow"
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow', 'techNode');
                event.dataTransfer.setData('application/techname', tech.name);
                event.dataTransfer.setData('application/techicon', tech.icon);
                event.dataTransfer.setData('application/tech', JSON.stringify(tech));
              }}
            >
              <img src={tech.icon} alt={tech.name} className="w-6 h-6 mr-2" />
              <span className="text-sm text-gray-900 dark:text-gray-100">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
