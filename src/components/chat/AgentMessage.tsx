"use client";

import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface AgentMessageProps {
  role: "user" | "assistant";
  content: string;
}

export default function AgentMessage({ role, content }: AgentMessageProps) {
  const isAgent = role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-3 animate-slide-up-fade",
        isAgent ? "justify-start" : "justify-end"
      )}
    >
      {isAgent && (
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-terminal-green/20 to-terminal-cyan/20 flex items-center justify-center border border-terminal-green/30">
          <Bot size={16} className="text-terminal-green" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 text-sm",
          isAgent
            ? "bg-white/5 border border-card-theme-border text-terminal-text rounded-tl-sm"
            : "bg-gradient-to-br from-terminal-green/20 to-terminal-cyan/10 border border-terminal-green/30 text-terminal-text rounded-tr-sm"
        )}
      >
        <ReactMarkdown
          components={{
            a: ({ node, ...props }) => (
              <Link
                {...props}
                href={props.href ?? ""}
                className="text-terminal-cyan hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              />
            ),
            p: ({ node, ...props }) => (
              <p {...props} className="mb-2 last:mb-0 leading-relaxed" />
            ),
            ul: ({ node, ...props }) => (
              <ul {...props} className="mb-2 ml-4 list-disc space-y-1" />
            ),
            ol: ({ node, ...props }) => (
              <ol {...props} className="mb-2 ml-4 list-decimal space-y-1" />
            ),
            li: ({ node, ...props }) => (
              <li {...props} className="leading-relaxed" />
            ),
            strong: ({ node, ...props }) => (
              <strong {...props} className="text-terminal-green font-semibold" />
            ),
            code: ({ node, className, children, ...props }) => {
              const isInline = !className;
              if (isInline) {
                return (
                  <code
                    {...props}
                    className="px-1.5 py-0.5 rounded bg-surface-elevated/50 text-terminal-cyan text-xs font-mono"
                  >
                    {children}
                  </code>
                );
              }
              return (
                <code {...props} className={cn(className, "font-mono")}>
                  {children}
                </code>
              );
            },
            pre: ({ node, ...props }) => (
              <pre
                {...props}
                className="my-2 p-3 rounded-lg bg-surface-elevated/80 border border-card-theme-border overflow-x-auto text-xs font-mono"
              />
            ),
            h1: ({ node, ...props }) => (
              <h1
                {...props}
                className="text-base font-bold text-terminal-green mb-2 mt-3 first:mt-0"
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                {...props}
                className="text-sm font-bold text-terminal-green mb-2 mt-3 first:mt-0"
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                {...props}
                className="text-sm font-semibold text-terminal-cyan mb-1 mt-2 first:mt-0"
              />
            ),
            hr: ({ node, ...props }) => (
              <hr {...props} className="my-3 border-card-theme-border" />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote
                {...props}
                className="border-l-2 border-terminal-cyan/50 pl-3 my-2 text-terminal-muted italic"
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {!isAgent && (
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-terminal-cyan/20 to-terminal-green/10 flex items-center justify-center border border-terminal-cyan/30">
          <User size={16} className="text-terminal-cyan" />
        </div>
      )}
    </div>
  );
}
