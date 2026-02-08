"use client";

import { motion } from "framer-motion";
import { FileText, ArrowRight, BookOpen } from "lucide-react";
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
    <div className="h-full bento-card p-2.5 lg:p-3 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-1.5 flex-shrink-0"
      >
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-lg bg-terminal-cyan/10 flex items-center justify-center">
            <BookOpen size={11} className="text-terminal-cyan" />
          </div>
          <h2 className="text-xs font-semibold text-foreground">Blog</h2>
        </div>
        <Link
          href="/blog"
          className="flex items-center gap-1 text-[10px] text-terminal-muted hover:text-terminal-green transition-colors"
        >
          View all
          <ArrowRight size={9} />
        </Link>
      </motion.div>

      {/* Posts Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-1.5 min-h-0">
        {displayPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="min-h-0"
          >
            <Link
              href={`/blog/${post.id}`}
              className="group flex flex-col justify-between h-full p-2 rounded-xl bg-inner-card-bg border border-inner-card-border hover:border-terminal-green/30 transition-all"
            >
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {index === 0 && (
                    <span className="px-1.5 py-0.5 text-[7px] font-medium rounded-full bg-terminal-green/15 text-terminal-green">
                      Latest
                    </span>
                  )}
                  <span className="px-1.5 py-0.5 text-[7px] font-medium rounded-full bg-inner-card-bg text-terminal-muted border border-inner-card-border">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-[10px] font-medium text-foreground group-hover:text-terminal-green transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-[8px] text-terminal-muted mt-1">
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
            <FileText size={24} className="mx-auto text-terminal-muted mb-1" />
            <p className="text-xs text-terminal-muted">No posts yet</p>
          </div>
        </div>
      )}
    </div>
  );
}
