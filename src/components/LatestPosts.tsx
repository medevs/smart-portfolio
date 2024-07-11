import React from 'react';
import { ChevronRight, Clock, Calendar, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { getSortedPostsData, PostData } from '../../utils/markdown';
// import { getSortedPostsData, PostData } from '../../../utils/markdown';

const LatestPosts: React.FC = async () => {
  const allPosts = await getSortedPostsData();
  const latestPosts = allPosts.slice(0, 3); // Get the first 3 posts

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col h-full">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold flex items-center text-gray-800 dark:text-white">
          <BookOpen className="w-6 h-6 mr-2 text-blue-500" />
          Latest Posts
        </h2>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700 flex-grow">
        {latestPosts.map((post: PostData) => (
          <li key={post.id} className="group">
            <Link href={`/blog/${post.id}`} className="block p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out">
              <p className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{post.title}</p>
              <div className="flex items-center justify-between mt-3 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {post.date}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {post.readTime}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300 transform group-hover:translate-x-1" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="p-6 bg-gray-50 dark:bg-gray-700 mt-auto">
        <Link href="/blog" className="inline-flex items-center justify-center w-full text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-lg px-4 py-2 transition-colors duration-300">
          View all posts
          <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  );
}

export default LatestPosts;