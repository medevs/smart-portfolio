'use client'

import { useState } from "react";
import { Filter, Tag, Calendar } from 'lucide-react';

interface BlogFiltersProps {
  categories: string[];
  tags: string[];
}

export default function BlogFilters({ categories, tags }: BlogFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  // You would implement the actual filtering logic here and pass it up to the parent component

  return (
    <div className="mb-8 flex flex-wrap gap-4">
      <div className="flex items-center">
        <Filter size={20} className="mr-2 text-gray-500" />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center">
        <Tag size={20} className="mr-2 text-gray-500" />
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1"
        >
          <option value="">All Tags</option>
          {tags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>
      <div className="flex items-center">
        <Calendar size={20} className="mr-2 text-gray-500" />
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1"
        >
          <option value="">All Years</option>
          {/* You would populate this dynamically based on your posts */}
        </select>
      </div>
    </div>
  );
}