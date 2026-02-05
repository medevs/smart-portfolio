import { getSortedPostsData } from "../../../utils/markdown";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, Tag, FileText } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles about web development, AI, and software engineering by Ahmed.",
};

export default async function BlogPage() {
  const posts = await getSortedPostsData();

  const categories = [...new Set(posts.map(post => post.category))];

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 pb-20">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-terminal-muted hover:text-terminal-green transition-colors mb-6 font-mono text-sm"
          >
            <ArrowLeft size={16} />
            <span>cd ~/portfolio</span>
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Blog
          </h1>
          <p className="text-terminal-muted max-w-2xl">
            Thoughts on web development, AI/ML, and building software that matters.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-terminal-green/20 text-terminal-green border border-terminal-green/30">
            All ({posts.length})
          </span>
          {categories.map((category) => (
            <span
              key={category}
              className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/5 text-terminal-muted border border-card-theme-border hover:border-terminal-cyan/30 hover:text-terminal-cyan transition-colors cursor-pointer"
            >
              {category} ({posts.filter(p => p.category === category).length})
            </span>
          ))}
        </div>

        {/* Featured Post */}
        {posts.length > 0 && (
          <Link
            href={`/blog/${posts[0].id}`}
            className="block mb-8 group"
          >
            <div className="relative rounded-2xl overflow-hidden bg-card-theme-bg border border-card-theme-border hover:border-terminal-green/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-terminal-green/5 to-terminal-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-6 md:p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-terminal-green/20 text-terminal-green">
                    Featured
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-foreground/10 text-terminal-muted">
                    {posts[0].category}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 group-hover:text-terminal-green transition-colors">
                  {posts[0].title}
                </h2>
                <p className="text-terminal-muted mb-4 line-clamp-2 max-w-3xl">
                  {posts[0].description}
                </p>
                <div className="flex items-center gap-4 text-sm text-terminal-muted">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-terminal-cyan" />
                    {posts[0].date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-terminal-cyan" />
                    {posts[0].readTime}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.slice(1).map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="group block rounded-xl overflow-hidden bg-card-theme-bg border border-card-theme-border hover:border-terminal-green/30 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <FileText size={16} className="text-terminal-cyan group-hover:text-terminal-green transition-colors" />
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-foreground/10 text-terminal-muted">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-terminal-green transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-terminal-muted mb-4 line-clamp-2">
                  {post.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-terminal-muted">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-16">
            <FileText size={48} className="mx-auto text-terminal-muted mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No posts yet</h3>
            <p className="text-terminal-muted">Check back soon for new content!</p>
          </div>
        )}
      </div>
    </div>
  );
}
