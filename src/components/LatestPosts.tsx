import React from 'react';
import { ChevronRight, Clock } from 'lucide-react';
import { recentPosts } from '../assets/data';


const LatestPosts: React.FC = () => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl md:col-span-2 lg:col-span-2`}>
      <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600">
        <h2 className="text-2xl font-bold text-white">Latest Posts</h2>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {recentPosts.map((post, index) => (
          <li key={index} className="group">
            <a href="#" className="block p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out">
              <p className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{post.title}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-2" />
                  {post.date}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300 transform group-hover:translate-x-1" />
              </div>
            </a>
          </li>
        ))}
      </ul>
      <div className="p-6 bg-gray-50 dark:bg-gray-700">
        <a href="/blog" className="inline-flex items-center text-lg font-semibold text-blue-600 dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300">
          View all posts
          <ChevronRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
        </a>
      </div>
    </div>
  );
}

export default LatestPosts;