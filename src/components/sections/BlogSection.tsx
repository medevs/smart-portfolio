"use client";

import { motion } from "framer-motion";
import { FileText, Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  date: string;
  readTime: string;
  category: string;
  description: string;
}

interface BlogSectionProps {
  posts: BlogPost[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  const displayPosts = posts.slice(0, 3);

  return (
    <div className="h-full bento-card p-2 lg:p-3 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-2"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-terminal-cyan/10 border border-terminal-cyan/30 flex items-center justify-center">
            <BookOpen size={12} className="text-terminal-cyan" />
          </div>
          <h2 className="text-sm font-semibold text-white">Blog</h2>
        </div>
        <Link
          href="/blog"
          className="flex items-center gap-1 text-[11px] text-terminal-muted hover:text-terminal-green transition-colors"
        >
          View all
          <ArrowRight size={10} />
        </Link>
      </motion.div>

      {/* Posts Grid - Horizontal on desktop */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 min-h-0">
        {displayPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="min-h-0"
          >
            <Link
              href={`/blog/${post.id}`}
              className="group block h-full p-2 rounded-lg bg-white/5 border border-white/10 hover:border-terminal-green/30 transition-all"
            >
              <div className="flex items-center gap-1 mb-1">
                {index === 0 && (
                  <span className="px-1.5 py-0.5 text-[8px] font-medium rounded-full bg-terminal-green/20 text-terminal-green">
                    Latest
                  </span>
                )}
                <span className="px-1.5 py-0.5 text-[8px] font-medium rounded-full bg-white/10 text-terminal-muted">
                  {post.category}
                </span>
              </div>
              <h3 className="text-[11px] font-medium text-white mb-1 group-hover:text-terminal-green transition-colors line-clamp-2">
                {post.title}
              </h3>
              <div className="flex items-center gap-2 text-[9px] text-terminal-muted">
                <span>{post.date}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>


      {/* Empty State */}
      {posts.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <FileText size={32} className="mx-auto text-terminal-muted mb-2" />
            <p className="text-sm text-terminal-muted">No posts yet</p>
          </div>
        </div>
      )}
    </div>
  );
}
