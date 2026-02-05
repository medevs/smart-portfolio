"use client";

import { useState, useEffect } from "react";
import TerminalWindow from "@/components/terminal/TerminalWindow";
import CommandPrompt from "@/components/terminal/CommandPrompt";
import { products } from "@/data/products";
import { ExternalLink, Folder, FolderOpen } from "lucide-react";
import Link from "next/link";

export default function ProductsSection() {
  const [showContent, setShowContent] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullText = "ls ./products";

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
          }, 80);
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById("products-section");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const statusColors = {
    active: "text-green-400",
    building: "text-yellow-400",
    planned: "text-terminal-muted",
  };

  const statusLabels = {
    active: "LIVE",
    building: "WIP",
    planned: "SOON",
  };

  return (
    <section id="products-section" className="py-8 px-4">
      <TerminalWindow title="products" className="max-w-4xl mx-auto">
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
            <div className="space-y-1 animate-fade-in">
              {/* Header */}
              <div className="text-terminal-muted text-xs mb-3">
                total {products.length}
              </div>

              {/* Products list */}
              {products.map((product, index) => (
                <div
                  key={product.name}
                  className="group flex items-start gap-3 py-2 px-3 rounded-md
                             hover:bg-terminal-bg-alt/50 transition-colors"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    <FolderOpen
                      size={18}
                      className="text-terminal-cyan group-hover:text-terminal-green transition-colors"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Name */}
                      {product.url ? (
                        <Link
                          href={product.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-terminal-green hover:underline flex items-center gap-1"
                        >
                          {product.name}
                          <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      ) : (
                        <span className="text-terminal-green">{product.name}</span>
                      )}

                      {/* Status badge */}
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold
                                    ${statusColors[product.status]} bg-current/10`}
                      >
                        {statusLabels[product.status]}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-terminal-muted text-sm mt-0.5">
                      {product.description}
                    </p>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {product.tech.map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] px-1.5 py-0.5 rounded
                                     bg-terminal-bg border border-terminal-border text-terminal-cyan"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </TerminalWindow>
    </section>
  );
}
