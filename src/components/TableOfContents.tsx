"use client";

import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  className?: string;
  articleId: string;
}

export default function TableOfContents({ className, articleId }: TableOfContentsProps) {
  const navId = useId();
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Find all headings in the article content
    const article = document.querySelector("[data-article-content]");
    if (!article) return;

    const elements = Array.from(article.querySelectorAll("h1, h2, h3, h4, h5, h6"));

    // Filter out headings that are part of the TOC itself
    const headingElements = elements.filter((el) => !el.closest(".table-of-contents"));

    const items: TOCItem[] = headingElements.map((element) => {
      return {
        id: element.id,
        text: element.textContent || "",
        level: parseInt(element.tagName.substring(1), 10),
      };
    });

    // Synchronize headings discovered in the committed article DOM; unavailable during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHeadings(items);

    // Set up intersection observer to highlight active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "0px 0px -80% 0px" },
    );

    headingElements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [articleId]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className={cn("table-of-contents", className)}>
      <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold">Table of Contents</h2>
        <button
          type="button"
          aria-label={isCollapsed ? "Expand table of contents" : "Collapse table of contents"}
          aria-expanded={!isCollapsed}
          aria-controls={navId}
          onClick={() => setIsCollapsed((value) => !value)}
          className="min-h-11 min-w-11 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </button>
      </div>

      {!isCollapsed && (
        <nav
          id={navId}
          aria-label="Article contents"
          className="text-sm mt-2 max-h-[calc(100vh-200px)] overflow-y-auto"
        >
          <ul className="space-y-1">
            {headings.map((heading) => (
              <li
                key={heading.id}
                className={cn(
                  "transition-colors duration-200 py-0.5 text-sm",
                  heading.level === 1 && "ml-0",
                  heading.level === 2 && "ml-2",
                  heading.level === 3 && "ml-3",
                  heading.level === 4 && "ml-4",
                  heading.level === 5 && "ml-5",
                  heading.level === 6 && "ml-6",
                )}
              >
                <a
                  href={`#${heading.id}`}
                  className={cn(
                    "block hover:text-blue-600 dark:hover:text-blue-400 text-xs truncate group relative",
                    activeId === heading.id
                      ? "text-blue-600 dark:text-blue-400 font-medium"
                      : "text-gray-700 dark:text-gray-300",
                  )}
                  title={heading.text}
                >
                  <span>{heading.text}</span>
                  <span className="absolute left-0 top-full bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none w-48 whitespace-normal">
                    {heading.text}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
