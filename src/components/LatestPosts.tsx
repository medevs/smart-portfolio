// components/LatestPosts.tsx
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface Post {
  title: string;
  date: string;
}

interface LatestPostsProps {
  className: string;
  posts: Post[];
}

const LatestPosts: React.FC<LatestPostsProps> = ({ className, posts }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}>
      <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600">
        <h2 className="text-lg font-semibold text-white">Latest Posts</h2>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {posts.map((post, index) => (
          <li key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-150 ease-in-out">
            <a href="#" className="block">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{post.title}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">{post.date}</p>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </a>
          </li>
        ))}
      </ul>
      <div className="p-4 bg-gray-50 dark:bg-gray-700">
        <a href="#" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
          View all posts
        </a>
      </div>
    </div>
  );
}

export default LatestPosts;