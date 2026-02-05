"use client";

import { useState, useEffect } from "react";
import TerminalWindow from "@/components/terminal/TerminalWindow";
import CommandPrompt from "@/components/terminal/CommandPrompt";
import { FileText, Calendar, Clock, ArrowRight, Tag } from "lucide-react";
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
  const [showContent, setShowContent] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullText = "ls -la ./posts/*.md";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let index = 0;
          const typingInterval = setInterval(() => {
            if (index <= fullText.length) {
              setTypedText(fullText.slice(0, index));
              index++;
            } else {
              clearInterval(typingInterval);
              setTimeout(() => setShowContent(true), 300);
            }
          }, 60);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById("blog-section");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="blog-section" className="py-8 px-4">
      <TerminalWindow title="blog" className="max-w-4xl mx-auto">
        <div className="space-y-4">
          {/* Command */}
          <CommandPrompt>
            <span>{typedText}</span>
            {!showContent && typedText.length > 0 && typedText.length < fullText.length && (
              <span className="inline-block w-2 h-4 ml-0.5 bg-terminal-green animate-cursor-blink" />
            )}
          </CommandPrompt>

          {/* Output */}
          {showContent && (
            <div className="space-y-3 animate-fade-in">
              {/* Header */}
              <div className="text-terminal-muted text-xs">
                total {posts.length} articles
              </div>

              {/* Posts list */}
              {posts.slice(0, 5).map((post, index) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="group block p-4 rounded-lg bg-terminal-bg-alt/30 border border-terminal-border
                             hover:border-terminal-green/50 hover:bg-terminal-bg-alt/50
                             transition-all duration-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      <FileText
                        size={18}
                        className="text-terminal-cyan group-hover:text-terminal-green transition-colors"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Title */}
                      <h3 className="text-terminal-green font-medium group-hover:underline line-clamp-1">
                        {post.title}
                      </h3>

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-terminal-muted">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {post.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag size={12} />
                          {post.category}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-terminal-text/70 text-sm mt-2 line-clamp-2">
                        {post.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={16} className="text-terminal-green" />
                    </div>
                  </div>
                </Link>
              ))}

              {/* View all link */}
              {posts.length > 5 && (
                <div className="text-center pt-2">
                  <span className="text-terminal-muted text-sm">
                    ... and {posts.length - 5} more articles
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </TerminalWindow>
    </section>
  );
}
