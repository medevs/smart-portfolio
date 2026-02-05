"use client";

import { useState, useEffect } from "react";
import TerminalWindow from "@/components/terminal/TerminalWindow";
import CommandPrompt from "@/components/terminal/CommandPrompt";
import { Bot, Database, Cpu, Sparkles, Zap, Brain } from "lucide-react";

const capabilities = [
  {
    icon: Brain,
    title: "RAG Systems",
    description: "Building retrieval-augmented generation pipelines",
    detail: "Vector embeddings, semantic search, context injection",
  },
  {
    icon: Bot,
    title: "AI Agents",
    description: "Creating autonomous AI assistants",
    detail: "LangChain, function calling, tool use",
  },
  {
    icon: Database,
    title: "Vector Databases",
    description: "Managing embeddings at scale",
    detail: "Supabase pgvector, similarity search",
  },
  {
    icon: Zap,
    title: "LLM Integration",
    description: "Connecting apps with language models",
    detail: "OpenAI, streaming, prompt engineering",
  },
];

export default function AgenticSection() {
  const [showContent, setShowContent] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [typedText, setTypedText] = useState("");
  const fullText = "./run-agent --capabilities";

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
          }, 50);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById("agentic-section");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (showContent && currentLine < capabilities.length) {
      const timeout = setTimeout(() => {
        setCurrentLine((prev) => prev + 1);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [showContent, currentLine]);

  return (
    <section id="agentic-section" className="py-8 px-4">
      <TerminalWindow title="ai-capabilities" className="max-w-4xl mx-auto">
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
            <div className="space-y-4 animate-fade-in">
              {/* Header */}
              <div className="flex items-center gap-2 text-terminal-cyan">
                <Cpu size={16} className="animate-pulse" />
                <span>[AGENT] Scanning capabilities...</span>
              </div>

              {/* Capabilities list */}
              <div className="grid gap-3 sm:grid-cols-2">
                {capabilities.map((cap, index) => {
                  const Icon = cap.icon;
                  const isVisible = index < currentLine;

                  return (
                    <div
                      key={cap.title}
                      className={`p-4 rounded-lg bg-terminal-bg-alt/50 border border-terminal-border
                                  transition-all duration-300
                                  ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-md bg-terminal-green/10 border border-terminal-green/30 flex items-center justify-center">
                          <Icon size={16} className="text-terminal-green" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-terminal-green font-semibold text-sm">
                            {cap.title}
                          </h3>
                          <p className="text-terminal-text text-sm mt-0.5">
                            {cap.description}
                          </p>
                          <p className="text-terminal-muted text-xs mt-1">
                            {cap.detail}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              {currentLine >= capabilities.length && (
                <div className="flex items-center gap-2 text-terminal-muted text-sm pt-2 animate-fade-in">
                  <Sparkles size={14} className="text-terminal-cyan" />
                  <span>
                    Try the AI chatbot (bottom-right) to see these skills in action!
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
