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
        "flex gap-3 animate-fade-in",
        isAgent ? "justify-start" : "justify-end"
      )}
    >
      {isAgent && (
        <div className="flex-shrink-0 w-8 h-8 rounded-md bg-terminal-green/10 border border-terminal-green/30 flex items-center justify-center">
          <Bot size={16} className="text-terminal-green" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[85%] rounded-lg px-4 py-3 font-mono text-sm",
          isAgent
            ? "bg-terminal-bg-alt border border-terminal-border text-terminal-text"
            : "bg-terminal-green/10 border border-terminal-green/30 text-terminal-text"
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
                    className="px-1.5 py-0.5 rounded bg-terminal-bg text-terminal-cyan text-xs"
                  >
                    {children}
                  </code>
                );
              }
              return (
                <code {...props} className={className}>
                  {children}
                </code>
              );
            },
            pre: ({ node, ...props }) => (
              <pre
                {...props}
                className="my-2 p-3 rounded-md bg-terminal-bg border border-terminal-border overflow-x-auto text-xs"
              />
            ),
            h1: ({ node, ...props }) => (
              <h1
                {...props}
                className="text-lg font-bold text-terminal-green mb-2 mt-3 first:mt-0"
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                {...props}
                className="text-base font-bold text-terminal-green mb-2 mt-3 first:mt-0"
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                {...props}
                className="text-sm font-bold text-terminal-cyan mb-1 mt-2 first:mt-0"
              />
            ),
            hr: ({ node, ...props }) => (
              <hr {...props} className="my-3 border-terminal-border" />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote
                {...props}
                className="border-l-2 border-terminal-cyan pl-3 my-2 text-terminal-muted italic"
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {!isAgent && (
        <div className="flex-shrink-0 w-8 h-8 rounded-md bg-terminal-cyan/10 border border-terminal-cyan/30 flex items-center justify-center">
          <User size={16} className="text-terminal-cyan" />
        </div>
      )}
    </div>
  );
}
