import React from 'react';
import Link from 'next/link';
import { ChevronRight, BookOpen, Clock, Calendar } from 'lucide-react';
import { getSortedPostsData, PostData } from '../../utils/markdown';

const LatestPosts: React.FC = async () => {
  const allPosts = await getSortedPostsData();
  const latestPosts = allPosts.slice(0, 3);

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#151B28] rounded-lg p-4 h-full transition-colors">
      <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600 mb-6">
        Latest Posts
      </h2>
      <div className="space-y-3 h-[calc(100%-3rem)]">
        {latestPosts.map((post: PostData) => (
          <Link key={post.id} href={`/blog/${post.id}`}>
            <div className="group cursor-pointer p-3 mb-8 bg-gray-50 dark:bg-[#1E2330] rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-[#252B3B]">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200 mb-2 line-clamp-2">
                {post.title}
              </h3>
              <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {post.date}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {post.readTime}
                </div>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
        <Link href="/blog"
          className="inline-flex items-center text-sm mt-6 px-4 py-2 rounded-lg
        bg-gray-100 dark:bg-blue-500/10 text-gray-700 dark:text-blue-400 
        hover:bg-gray-200 dark:hover:bg-blue-500/20 transition-all">
          View all posts
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default LatestPosts;